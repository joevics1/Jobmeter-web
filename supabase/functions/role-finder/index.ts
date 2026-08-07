import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { callGeminiJSON } from "../_shared/gemini.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface RoleResult {
  role: string;
  seniority: string;
  description: string;
  requiredSkills: string[];
  skillGaps: string[];
  certifications: string[];
  salaryRange: string;
  matchScore: number;
}

interface RoleFinderResult {
  roles: RoleResult[];
  summary: string;
  totalSkillsMatched: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { skills, tools, yearsOfExperience, userId } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "At least one skill is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const experienceText = yearsOfExperience 
      ? `with ${yearsOfExperience} years of professional experience` 
      : "with varying levels of experience";

    const toolsText = tools && tools.length > 0 
      ? `\n- Tools/Software they use: ${tools.join(", ")}` 
      : "";

    const prompt = `
You are a career advisor and job matching expert. Based on the user's skills and experience, find 8-12 job roles they qualify for.

User Profile:
- Skills: ${skills.join(", ")}
${toolsText}
- Experience: ${experienceText}

IMPORTANT: Consider that some skills may be variations of the same technology (e.g., "React.js" and "React" are the same, "JavaScript" and "JS" are the same).

Return a JSON object with this exact structure:
{
  "roles": [
    {
      "role": "Job title (e.g., 'Senior Software Engineer')",
      "seniority": "Entry/Mid/Junior/Senior/Lead/Principal",
      "description": "Brief description of what this person would do in this role",
      "requiredSkills": ["skill1", "skill2"],
      "skillGaps": ["skill they don't have but would help"],
      "certifications": ["relevant certifications that would help"],
      "salaryRange": "e.g., ₦500,000 - ₦1,200,000 per month or $80,000 - $120,000 per year",
      "matchScore": 85
    }
  ],
  "summary": "A brief 2-3 sentence summary of the user's career direction",
  "totalSkillsMatched": 8
}

Rules:
1. Only suggest roles where matchScore is 50 or higher
2. Include both technical and non-technical roles where applicable
3. skillGaps should be realistic - not everything they lack
4. Focus on the Nigerian/African job market where relevant
5. Consider the combination of skills, not just individual skills
6. For salary, use Naira (₦) for Nigerian roles or USD ($) for international remote roles
7. Return exactly 8-12 roles
`;

    const result = await callGeminiJSON<RoleFinderResult>(prompt, GEMINI_API_KEY!, {
      temperature: 0.3,
      maxTokens: 8000,
    });

    if (!result.roles || !Array.isArray(result.roles) || result.roles.length === 0) {
      throw new Error('Gemini response missing roles');
    }

    // Save to database if userId provided
    if (userId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from("role_finder_results").insert({
          user_id: userId,
          skills: skills,
          tools: tools || [],
          years_of_experience: yearsOfExperience,
          result: result,
          created_at: new Date().toISOString()
        });
      } catch (dbError) {
        console.log("Failed to save to database:", dbError);
        // Don't fail the request if DB save fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in role-finder:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

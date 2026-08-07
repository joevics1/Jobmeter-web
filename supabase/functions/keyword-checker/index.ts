import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { callGeminiJSON } from "../_shared/gemini.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface KeywordResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
  hardSkills: string[];
  softSkills: string[];
  bulletImprovements: string[];
  summary: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cvText, jobDescription } = await req.json();

    if (!cvText || !jobDescription) {
      return new Response(
        JSON.stringify({ success: false, error: "CV text and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `
You are an expert CV analyzer and job matching specialist. Analyze the CV against the job description and provide keyword analysis.

CV TEXT:
${cvText}

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this exact structure:
{
  "matchScore": 85,
  "matchedKeywords": ["Python", "JavaScript", "React", "Team Leadership"],
  "missingKeywords": ["AWS", "Docker", "CI/CD"],
  "recommendedKeywords": ["AWS", "Docker", "Kubernetes", "CI/CD Pipeline"],
  "hardSkills": ["Python", "JavaScript", "React", "Node.js", "SQL"],
  "softSkills": ["Leadership", "Communication", "Problem Solving"],
  "bulletImprovements": [
    "Add quantified achievements (e.g., 'increased sales by 25%')",
    "Include AWS or cloud experience in skills section",
    "Highlight team leadership experience"
  ],
  "summary": "A brief summary of the match analysis"
}

Rules:
1. matchScore should be 0-100 based on keyword overlap
2. Include both hard skills and soft skills found
3. missingKeywords should be important skills from job that CV doesn't have
4. recommendedKeywords are suggestions for improvement
5. bulletImprovements are actionable CV improvements
6. Focus on skills, keywords, and qualifications that match
`;

    const result = await callGeminiJSON<KeywordResult>(prompt, GEMINI_API_KEY!, {
      temperature: 0.2,
      maxTokens: 8000,
    });

    if (typeof result.matchScore !== 'number') {
      throw new Error('Gemini response missing matchScore');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in keyword-checker:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

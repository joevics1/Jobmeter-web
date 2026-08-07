import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { callGeminiJSON } from "../_shared/gemini.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface ScamAnalysis {
  trustScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  redFlags: string[];
  warnings: string[];
  safeIndicators: string[];
  analysis: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, emailContent, companyName, jobPosting } = await req.json();

    const analysisText = text || emailContent || jobPosting || "";

    if (!analysisText || analysisText.length < 50) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide more text to analyze (at least 50 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const companyContext = companyName ? `Company Name: ${companyName}` : "";

    const prompt = `
You are an expert at detecting job scams and fraudulent job postings. Analyze the following job-related text for signs of scams.

${companyContext}

TEXT TO ANALYZE:
${analysisText}

IMPORTANT SCORING RULES:
1. Generic email domains (Gmail, Yahoo) - NORMAL for Nigeria, deduct only 0-3 points
2. Urgency tactics ("URGENT", "We're Hiring!") - NORMAL marketing, deduct 0 points
3. No company website/LinkedIn - minor concern, deduct only 3-5 points
4. NEW MAJOR RED FLAGS (deduct 15-25 points each):
   - Job NOT remote but NO location/address stated
   - Language inconsistent (copy-paste patterns)
   - Request for payment (training, equipment, visa fees)
   - Personal documents before interview
   - Wire transfer/Western Union
   - Unrealistic salary

MINOR CONCERNS (deduct 3-8 points each):
- Vague job description without specific requirements
- No company contact information
- Poorly formatted description

POSITIVE INDICATORS (add 5-10 points each):
- Clear job requirements listed
- Professional tone and formatting
- Specific salary range mentioned
- Company details provided
- Proper application process described

Return a JSON object with this exact structure:
{
  "trustScore": 85,
  "riskLevel": "LOW",
  "redFlags": ["Requests upfront payment of ₦50,000"],
  "warnings": ["Vague job description"],
  "safeIndicators": ["Clear job requirements listed"],
  "analysis": "Detailed explanation"
}

Rules:
1. Start with trustScore = 100, then subtract points based on red flags
2. riskLevel: 80-100 = LOW, 60-79 = MEDIUM, 40-59 = HIGH, 0-39 = CRITICAL
3. Be fair - Nigerian job market has different norms
4. If payment is requested, it's automatically CRITICAL risk
5. Include specific details about what you found
`;

    const result = await callGeminiJSON<ScamAnalysis>(prompt, GEMINI_API_KEY!, {
      temperature: 0.2,
      maxTokens: 8000,
    });

    if (typeof result.trustScore !== 'number') {
      throw new Error('Gemini response missing trustScore');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in scam-detector:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

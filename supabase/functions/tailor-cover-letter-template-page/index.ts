// Supabase Edge Function: tailor-cover-letter-template-page
// DEPRECATED / UNUSED — nothing calls this anymore. Quick Create used to
// route through here (Gemini call), but with no job description given
// there was nothing real to personalize against, so this was just an AI
// call spent inventing generic-sounding content from the same
// onboarding_data fields lib/cover-letter-template-pages/onboarding-fetch.ts
// now reads directly, for free. Quick Create is a straight fetch+merge
// now — see app/cover-letter-templates/build/client.tsx. Safe to delete
// this function (and undeploy it from Supabase) whenever convenient;
// left in place only so this isn't a destructive change on its own.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string;
  roleLabel: string;
  companyName?: string; // optional — falls back to a placeholder if not given
}

const TAILOR_PROMPT = `You are writing a personalized cover letter for a real candidate applying to a specific role. Rules:
- Do NOT invent employers, dates, degrees, or achievements not present in the profile data.
- Every claim in the letter must trace back to something the profile actually states — you may phrase/emphasize it differently, but never fabricate a fact.
- Write in first person, as the candidate.
- Opening paragraph: hook the reader, state the exact role being applied for, show genuine relevance.
- 1-2 body paragraphs: connect the candidate's REAL experience/skills (from the profile) to what this specific role needs.
- Closing paragraph: confident call to action, availability, thanks.
- Warm, professional, human tone — not stiff, not generic-sounding.
- If a company name is given, address the letter to them; otherwise use "Dear Hiring Manager,".

Return ONLY this JSON shape, no markdown, no explanation:
{
  "personalDetails": { "name": "string", "title": "string", "email": "string", "phone": "string", "location": "string", "linkedin": "string", "portfolio": "string" },
  "date": "string",
  "recipient": { "hiringManagerName": "string", "companyName": "string", "companyAddress": "string" },
  "salutation": "string",
  "openingParagraph": "string",
  "bodyParagraphs": ["string"],
  "closingParagraph": "string",
  "signOff": "string"
}`;

async function callGemini(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 3000 },
      }),
      signal: controller.signal,
    }
  );
  clearTimeout(timeoutId);

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { userId, roleLabel, companyName }: RequestBody = await req.json();
    if (!userId || !roleLabel) {
      return new Response(JSON.stringify({ error: 'Missing userId or roleLabel' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (onboardingError || !onboarding) {
      return new Response(JSON.stringify({ error: 'No profile data found. Please complete onboarding or fill the form manually.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `**TARGET ROLE**: ${roleLabel}
**COMPANY**: ${companyName || 'not specified — use "Dear Hiring Manager,"'}

**USER PROFILE DATA**:
${JSON.stringify(onboarding, null, 2)}

${TAILOR_PROMPT}`;

    const responseText = await callGemini(prompt);
    const jsonText = responseText.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```\s*$/g, '').trim();

    let structuredData: any;
    try {
      structuredData = JSON.parse(jsonText);
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to parse AI response.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: structuredData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in tailor-cover-letter-template-page:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

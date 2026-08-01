// Supabase Edge Function: generate-cv-template-page
// Isolated from generate-document — this powers ONLY the new CV Templates
// SEO-page builder (app/cv-templates/*). Takes plain form fields (no
// onboarding_data dependency required), optionally prefilling from
// onboarding_data read-only if a signed-in userId is passed.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  roleLabel: string;
  countryLabel: string;
  fullName: string;
  email?: string;
  phone?: string;
  yearsExperience?: string;
  summaryHint?: string;
  skills?: string[];
  userId?: string; // optional — if provided, prefill from onboarding_data (read-only)
}

const SYSTEM_PROMPT = `You are an expert CV writer. Build a professional, realistic CV that:
1. Fits EXACTLY on ONE A4 page
2. Is tailored to the target role and country given
3. Uses ONLY the information provided — do NOT invent employers, dates, or credentials beyond what's given
4. Where detail is thin (e.g. no work history provided), keep sections concise rather than fabricating specifics
5. Writes a compelling 3-4 sentence professional summary
6. Selects/orders skills sensibly for the target role

Return ONLY a valid JSON object with this shape (omit fields with no data, never invent values):
{
  "personalDetails": { "name": "string", "title": "string", "email": "string", "phone": "string", "location": "string" },
  "summary": "string",
  "skills": ["string"],
  "experience": [{ "role": "string", "company": "string", "years": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "years": "string" }]
}
Return ONLY the JSON object, no markdown, no explanations.`;

async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const models = ['gemini-2.5-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const modelName of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 8000 },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) continue;
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text) return text;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('429')) continue;
      if (modelName === models[models.length - 1]) throw error;
    }
  }
  throw new Error('All Gemini models failed');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { roleLabel, countryLabel, fullName, email, phone, yearsExperience, summaryHint, skills, userId } = body;

    if (!roleLabel || !countryLabel || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: roleLabel, countryLabel, fullName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Optional read-only prefill from onboarding_data — never written to.
    let profileHint = '';
    if (userId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      );
      const { data: onboarding } = await supabaseClient
        .from('onboarding_data')
        .select('cv_summary, cv_skills, cv_work_experience, cv_education, cv_location, cv_phone, cv_email')
        .eq('user_id', userId)
        .maybeSingle();

      if (onboarding) {
        profileHint = `\n**EXISTING PROFILE DATA (use if it helps, prefer explicit form fields below when both exist)**:\n${JSON.stringify(onboarding)}`;
      }
    }

    const prompt = `**TARGET ROLE**: ${roleLabel}
**TARGET COUNTRY**: ${countryLabel}
**FULL NAME**: ${fullName}
**EMAIL**: ${email || 'not provided'}
**PHONE**: ${phone || 'not provided'}
**YEARS OF EXPERIENCE**: ${yearsExperience || 'not provided'}
**ADDITIONAL CONTEXT FROM USER**: ${summaryHint || 'none'}
**SKILLS PROVIDED**: ${skills?.length ? skills.join(', ') : 'none — suggest sensible defaults for the role'}
${profileHint}

${SYSTEM_PROMPT}`;

    const responseText = await callGeminiAPI(prompt);
    const jsonText = responseText.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```\s*$/g, '').trim();

    let structuredData: any;
    try {
      structuredData = JSON.parse(jsonText);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response as JSON' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: structuredData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in generate-cv-template-page:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

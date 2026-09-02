// Supabase Edge Function: tailor-cv-template-page
// Powers "Quick Create". Isolated from generate-document — copied the
// pattern (fetch onboarding_data server-side, one AI call, never invent
// facts, only reword title/summary/bullets toward the target role) rather
// than importing it.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { callGeminiText } from '../_shared/gemini.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string;
  roleLabel: string;
}

const TAILOR_PROMPT = `You are tailoring an existing CV to a target role. Rules:
- Do NOT invent employers, dates, degrees, or facts not present in the profile data.
- Keep the same companies, job dates, and qualifications exactly as given.
- You MAY reword the professional title, summary, and experience bullets to emphasize relevance to the target role — but every bullet must still describe something the profile actually states, just phrased toward the new role.
- Max 4 bullets per role, max 4 experience entries, max 3 education entries (most recent first).
- Include every other section (projects, accomplishments, awards, certifications, languages, interests, publications, volunteer work, additional sections, roles, linkedin/github/portfolio) AS-IS from the profile data whenever present — do not reword these, just carry them over. Omit any section with no data — never fabricate.

Return ONLY this JSON shape, no markdown, no explanation (omit any field/section with no source data):
{
  "personalDetails": { "name": "string", "title": "string", "email": "string", "phone": "string", "location": "string", "linkedin": "string", "github": "string", "portfolio": "string" },
  "summary": "string",
  "roles": ["string"],
  "skills": ["string"],
  "experience": [{ "role": "string", "company": "string", "years": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "years": "string" }],
  "projects": [{ "title": "string", "description": "string" }],
  "accomplishments": ["string"],
  "awards": [{ "title": "string", "issuer": "string", "year": "string" }],
  "certifications": [{ "name": "string", "issuer": "string", "year": "string" }],
  "languages": ["string"],
  "interests": ["string"],
  "publications": [{ "title": "string", "journal": "string", "year": "string" }],
  "volunteerWork": [{ "organization": "string", "role": "string", "duration": "string", "description": "string" }],
  "additionalSections": [{ "sectionName": "string", "content": "string" }],
  "references": [{ "name": "string", "title": "string", "company": "string", "phone": "string", "email": "string" }]
}`;

async function callGemini(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  return callGeminiText(prompt, apiKey, { temperature: 0.4, maxTokens: 4000, timeoutMs: 45000 });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { userId, roleLabel }: RequestBody = await req.json();
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
    console.error('Error in tailor-cv-template-page:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

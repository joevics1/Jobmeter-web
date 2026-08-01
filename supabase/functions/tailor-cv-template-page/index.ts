// Supabase Edge Function: tailor-cv-template-page
// Powers "Quick Create". Isolated from generate-document — copied the
// pattern (fetch onboarding_data server-side, one AI call, never invent
// facts, only reword title/summary/bullets toward the target role) rather
// than importing it.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string;
  roleLabel: string;
  countryLabel: string;
}

const TAILOR_PROMPT = `You are tailoring an existing CV to a target role. Rules:
- Do NOT invent employers, dates, degrees, or facts not present in the profile data.
- Keep the same companies, job dates, and qualifications exactly as given.
- You MAY reword the professional title, summary, and experience bullets to emphasize relevance to the target role — but every bullet must still describe something the profile actually states, just phrased toward the new role.
- Max 4 bullets per role, max 4 experience entries, max 3 education entries (most recent first).
- If a field has no data in the profile, omit it — never fabricate.

Return ONLY this JSON shape, no markdown, no explanation:
{
  "personalDetails": { "name": "string", "title": "string", "email": "string", "phone": "string", "location": "string" },
  "summary": "string",
  "skills": ["string"],
  "experience": [{ "role": "string", "company": "string", "years": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "years": "string" }]
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
        generationConfig: { temperature: 0.4, maxOutputTokens: 4000 },
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
    const { userId, roleLabel, countryLabel }: RequestBody = await req.json();
    if (!userId || !roleLabel || !countryLabel) {
      return new Response(JSON.stringify({ error: 'Missing userId, roleLabel, or countryLabel' }), {
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
**TARGET COUNTRY**: ${countryLabel}

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

// Supabase Edge Function: parse-cv-template-form
// Isolated, separate from generate-cv-template-page and generate-document.
// One cheap-model call: takes whatever free text the user pastes/types and
// extracts it into the CV Templates form fields. It does NOT author or
// embellish content — it structures what's already there so the user can
// review/edit before rendering.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { callGeminiText } from '../_shared/gemini.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  rawText: string;
}

const PARSE_PROMPT = `Extract the following free-form text into structured CV fields.
Rules:
- Use ONLY information present in the text. Never invent employers, dates, degrees, or skills.
- Keep bullets short (max ~12 words each), max 4 bullets per role.
- Keep at most 4 work experience entries and 3 education entries (most recent/relevant first).
- If a field isn't mentioned, omit it or leave it as an empty string/array — do not guess.

Return ONLY this JSON shape, no markdown, no explanation:
{
  "name": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string (max 3 sentences, based only on what's stated)",
  "skills": ["string"],
  "experience": [{ "role": "string", "company": "string", "years": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "years": "string" }]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { rawText }: RequestBody = await req.json();
    if (!rawText || rawText.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please paste more detail before parsing.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    // Single call, cheapest/fastest model — this is extraction, not authoring.
    const text = await callGeminiText(
      `${PARSE_PROMPT}\n\n---\nTEXT TO PARSE:\n${rawText}`,
      apiKey,
      { temperature: 0.1, maxTokens: 3000, timeoutMs: 30000 }
    );
    const jsonText = text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```\s*$/g, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return new Response(JSON.stringify({ error: 'Could not parse that text. Try adding more structure (e.g. line breaks between jobs).' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in parse-cv-template-form:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

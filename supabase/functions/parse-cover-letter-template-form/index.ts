// Supabase Edge Function: parse-cover-letter-template-form
// Isolated, separate from generate-cover-letter-template-page and
// generate-document. One cheap-model call: takes whatever free text the
// user pastes/types (an old cover letter, notes, a rough draft) and
// extracts/structures it into the form fields. It does NOT author new
// content — it structures what's already there so the user can
// review/edit before rendering. (Writing a NEW letter from scratch is
// tailor-cover-letter-template-page's job, not this one.)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  rawText: string;
}

const PARSE_PROMPT = `Extract the following free-form text (likely a draft or pasted old cover letter) into structured cover letter fields.
Rules:
- Use ONLY information present in the text. Never invent names, companies, or achievements.
- If a field isn't mentioned, omit it or leave it as an empty string/array — do not guess.
- bodyParagraphs should be the letter's main content, split into logical paragraphs (excluding the opening hook and the closing call-to-action, which go in their own fields).

Return ONLY this JSON shape, no markdown, no explanation:
{
  "name": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "companyName": "string",
  "hiringManagerName": "string",
  "salutation": "string",
  "openingParagraph": "string",
  "bodyParagraphs": ["string"],
  "closingParagraph": "string",
  "signOff": "string"
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${PARSE_PROMPT}\n\n---\nTEXT TO PARSE:\n${rawText}` }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2000 },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonText = text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```\s*$/g, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return new Response(JSON.stringify({ error: 'Could not parse that text. Try adding more structure (e.g. line breaks between paragraphs).' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in parse-cover-letter-template-form:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

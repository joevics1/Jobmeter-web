// Supabase Edge Function: parse-cover-letter-template-form
// Isolated, separate from generate-cover-letter-template-page and
// generate-document. One cheap-model call: takes whatever free text the
// user pastes/types (an old cover letter, notes, a rough draft) and
// extracts/structures it into the form fields. It does NOT author new
// content — it structures what's already there so the user can
// review/edit before rendering. (Writing a NEW letter from scratch is
// tailor-cover-letter-template-page's job, not this one.)
//
// This is one of the two remaining Gemini calls in the cover-letter-
// templates feature (the other is customize-cover-letter-for-job) — the
// only two spots where AI is actually earning its cost, since both take
// real user-supplied text to work from. Quick Create/Edit/Clear no longer
// call Gemini at all (see app/cover-letter-templates/build/client.tsx).
//
// The client already gates this behind login, but that's UI-only — this
// endpoint's URL is public, so it verifies the caller's session itself
// (getAuthedUserId) rather than trusting anything in the request body,
// and enforces a per-user daily cap so one signed-in user can't burn
// unlimited Gemini calls on this free tool.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { callGeminiJSON } from '../_shared/gemini.ts'
import { checkDailyLimit, getAuthedUserId } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 15;

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const userId = await getAuthedUserId(req, supabaseUrl, anonKey);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Please sign in to use this.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { allowed, remaining } = await checkDailyLimit(`parse-cover-letter:${userId}`, DAILY_LIMIT);
    if (!allowed) {
      return new Response(JSON.stringify({ error: `Daily limit reached (${DAILY_LIMIT}/day). Please try again tomorrow.` }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { rawText }: RequestBody = await req.json();
    if (!rawText || rawText.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please paste more detail before parsing.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    let parsed: any;
    try {
      parsed = await callGeminiJSON(
        `${PARSE_PROMPT}\n\n---\nTEXT TO PARSE:\n${rawText}`,
        apiKey,
        { temperature: 0.1, maxTokens: 2000, timeoutMs: 30000 }
      );
    } catch {
      return new Response(JSON.stringify({ error: 'Could not parse that text. Try adding more structure (e.g. line breaks between paragraphs).' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: parsed, remaining }), {
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

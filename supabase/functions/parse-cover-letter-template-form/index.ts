// Supabase Edge Function: parse-cover-letter-template-form
// Isolated, separate from generate-cover-letter-template-page and
// generate-document. One cheap-model call: takes whatever free text the
// user pastes/types (an old cover letter, notes, a rough draft) and
// extracts/structures it into the form fields. It does NOT author new
// content — it structures what's already there so the user can
// review/edit before rendering. (Writing NEW paragraphs from real
// background is customize-cover-letter-for-job's job, not this one.)
//
// Also pulls the caller's onboarding_data as a secondary source, so a
// pasted draft that's missing contact details (a rough note with no
// email/phone) doesn't come back with those fields blank when we already
// know them from the signed-in user's profile. The pasted text always
// wins where it says something — this only fills gaps, never overrides.
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
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { callGeminiJSON } from '../_shared/gemini.ts'
import { checkDailyLimit, getAuthedUserId } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 5;

interface RequestBody {
  rawText: string;
}

const PARSE_PROMPT = `Extract the following free-form text (likely a draft or pasted old cover letter) into structured cover letter fields.
Rules:
- The TEXT TO PARSE is the primary source. Use ONLY information present in it for openingParagraph, bodyParagraphs, and closingParagraph — never invent achievements or facts not present in the text.
- For name/title/email/phone/location only: if the text doesn't mention a field, you may fill it from KNOWN PROFILE DATA below (if given) instead of leaving it blank. Never let profile data override something the pasted text actually states.
- If a field isn't available from either source, omit it or leave it as an empty string/array — do not guess.
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

    // Best-effort — a missing/incomplete profile should never block
    // parsing the pasted text itself.
    let onboarding: any = null;
    try {
      const supabaseClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      });
      const { data } = await supabaseClient
        .from('onboarding_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      onboarding = data;
    } catch (e) {
      console.error('Could not fetch onboarding_data (non-fatal):', e);
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    const prompt = `${PARSE_PROMPT}\n\n---\nTEXT TO PARSE:\n${rawText}${
      onboarding ? `\n\n---\nKNOWN PROFILE DATA (fallback only, for contact fields the text doesn't mention):\n${JSON.stringify(onboarding, null, 2)}` : ''
    }`;

    let parsed: any;
    try {
      parsed = await callGeminiJSON(prompt, apiKey, { temperature: 0.1, maxTokens: 2000, timeoutMs: 30000 });
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

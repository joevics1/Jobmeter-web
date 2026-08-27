// Supabase Edge Function: customize-cover-letter-for-job
// Isolated, separate from tailor-cover-letter-template-page and
// parse-cover-letter-template-form. Takes a job description and rewrites
// the letter's opening/body/closing paragraphs so they sound relevant to
// that job — but grounded in the user's REAL onboarding_data profile, not
// whatever paragraphs are currently sitting in the form. That distinction
// matters: a user who arrived here via Edit or Quick Create still has the
// role's generic per-role sample paragraphs in the form (see
// generate-cover-letter-template-page) — those are placeholder-style
// template text, not this person's real background. Rewording placeholder
// text to "sound relevant to the job" would just be dressing up
// fabricated experience as this person's own. So this function fetches
// the caller's onboarding_data server-side and writes fresh paragraphs
// from THAT, tailored to the job description — never inventing anything
// beyond what the profile actually states.
//
// This is one of the two remaining Gemini calls in the cover-letter-
// templates feature (the other is parse-cover-letter-template-form) —
// the only two spots where AI is actually earning its cost, since a real
// job description is what makes "personalization" meaningful. Quick
// Create/Edit/Clear no longer call Gemini at all.
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
  coverLetterData: any;
  jobDescription: string;
}

const CUSTOMIZE_PROMPT = `You are writing the opening, body, and closing paragraphs of a cover letter for a real candidate applying to a specific role. Rules:
- Ground EVERY claim in the REAL PROFILE DATA given below — their actual work history, skills, and summary. Do NOT invent employers, dates, achievements, or facts not present in the profile data.
- Ignore any placeholder/generic content already in "CURRENT LETTER" below (openingParagraph, bodyParagraphs, closingParagraph) — that may just be generic template text, not this person's real background. Write fresh paragraphs from the profile data instead, not a reworded version of the placeholder text.
- Select and phrase the REAL experience/skills that are most relevant to the job description — the goal is genuine relevance, not invention.
- Keep the structure: an opening hook naming the role, 1-2 body paragraphs connecting real experience to the job's needs, a confident closing call to action.
- You MAY set recipient.companyName if the job description names the company, and personalDetails.title if clearly implied by the job description — but do not invent a company name that isn't stated anywhere.
- Do not change personalDetails.name, email, phone, location, date, salutation, or signOff — return them exactly as given in "CURRENT LETTER".

Return ONLY the full CoverLetterData JSON object, same shape as "CURRENT LETTER", with openingParagraph/bodyParagraphs/closingParagraph (and optionally recipient.companyName / personalDetails.title) replaced as described. No markdown, no explanation.`;

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

    const { allowed, remaining } = await checkDailyLimit(`customize-cover-letter:${userId}`, DAILY_LIMIT);
    if (!allowed) {
      return new Response(JSON.stringify({ error: `Daily limit reached (${DAILY_LIMIT}/day). Please try again tomorrow.` }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { coverLetterData, jobDescription }: RequestBody = await req.json();
    if (!coverLetterData || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing coverLetterData or jobDescription' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (onboardingError || !onboarding) {
      return new Response(JSON.stringify({ error: 'No profile data found. Please complete onboarding to use Customize for Job.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    const prompt = `**REAL PROFILE DATA** (the only source of truth for facts/experience):
${JSON.stringify(onboarding, null, 2)}

**CURRENT LETTER** (identity/formatting fields to preserve as-is; body content is placeholder, ignore it as a source of facts):
${JSON.stringify(coverLetterData, null, 2)}

**JOB DESCRIPTION TO TAILOR TOWARD**:
${jobDescription}

${CUSTOMIZE_PROMPT}`;

    let structuredData: any;
    try {
      structuredData = await callGeminiJSON(prompt, apiKey, { temperature: 0.4, maxTokens: 3000, timeoutMs: 45000 });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to parse AI response.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: structuredData, remaining }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in customize-cover-letter-for-job:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

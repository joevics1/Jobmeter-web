// Supabase Edge Function: customize-cover-letter-for-job
// Isolated, separate from tailor-cover-letter-template-page and
// parse-cover-letter-template-form. Takes the cover letter data already
// in the form plus a pasted job description, and lightly rewords the
// paragraphs to emphasize relevance to that specific job — same "never
// invent, only reword" constraint as customize-cv-for-job.
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
import { callGeminiJSON } from '../_shared/gemini.ts'
import { checkDailyLimit, getAuthedUserId } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 15;

interface RequestBody {
  coverLetterData: any;
  jobDescription: string;
}

const CUSTOMIZE_PROMPT = `You are lightly tailoring an existing cover letter to a specific job description. Rules:
- Do NOT invent employers, dates, achievements, or facts not already present in the letter data given.
- You MAY reword openingParagraph, bodyParagraphs, and closingParagraph to emphasize relevance to the job description — but every claim must still be something already stated in the letter, just phrased toward this job.
- You MAY update recipient.companyName if the job description names the company, and personalDetails.title if it's clearly implied by the job description — but do not invent a company name that isn't stated anywhere.
- Do not change personalDetails.name, email, phone, location, date, or signOff.

Return ONLY the full CoverLetterData JSON object back, same shape as given, with only the fields above edited as described. No markdown, no explanation.`;

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

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    const prompt = `**CURRENT COVER LETTER DATA**:
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

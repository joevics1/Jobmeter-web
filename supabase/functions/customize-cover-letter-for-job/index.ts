// Supabase Edge Function: customize-cover-letter-for-job
// Isolated, separate from tailor-cover-letter-template-page and
// parse-cover-letter-template-form. Takes the cover letter data already
// in the form plus a pasted job description, and lightly rewords the
// paragraphs to emphasize relevance to that specific job — same "never
// invent, only reword" constraint as customize-cv-for-job.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
        generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
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
    const { coverLetterData, jobDescription }: RequestBody = await req.json();
    if (!coverLetterData || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing coverLetterData or jobDescription' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `**CURRENT COVER LETTER DATA**:
${JSON.stringify(coverLetterData, null, 2)}

**JOB DESCRIPTION TO TAILOR TOWARD**:
${jobDescription}

${CUSTOMIZE_PROMPT}`;

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
    console.error('Error in customize-cover-letter-for-job:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

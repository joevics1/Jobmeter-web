// Supabase Edge Function: customize-cv-for-job
// Isolated, separate from tailor-cv-template-page and parse-cv-template-form.
// Takes the CV data already in the form plus a pasted job description, and
// lightly rewords the summary + experience bullets to emphasize relevance
// to that specific job — same "never invent, only reword" constraint as
// the other AI paths in this feature.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  cvData: any;
  jobDescription: string;
}

const CUSTOMIZE_PROMPT = `You are lightly tailoring an existing CV to a specific job description. Rules:
- Do NOT invent employers, dates, degrees, titles, or facts not already present in the CV data given.
- Keep the same companies, job dates, and qualifications exactly as given.
- You MAY reword the summary and experience bullets to emphasize relevance to the job description — but every bullet must still describe something already stated in the CV, just phrased toward this job.
- Do not change skills, education, projects, achievements, or any other section — only summary and experience bullets may be reworded.
- Max 4 bullets per role.

Return ONLY the full CVData JSON object back, same shape as given, with only summary/experience.bullets edited. No markdown, no explanation.`;

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
    const { cvData, jobDescription }: RequestBody = await req.json();
    if (!cvData || !jobDescription || jobDescription.trim().length < 20) {
      return new Response(JSON.stringify({ error: 'Please paste a fuller job description before customizing.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `**JOB DESCRIPTION**:
${jobDescription}

**CURRENT CV DATA**:
${JSON.stringify(cvData, null, 2)}

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
    console.error('Error in customize-cv-for-job:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

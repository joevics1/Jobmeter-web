// Supabase Edge Function: generate-cover-letter-template-page
// Isolated from generate-cv-template-page and generate-document — this
// powers ONLY the Cover Letter Templates SEO-page builder
// (app/cover-letter-templates/*). Writes a genuinely reusable TEMPLATE
// letter for the target role (not a one-off data dump) — real
// opening/body/closing paragraphs someone in that role could adapt.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  roleLabel: string;
}

const SYSTEM_PROMPT = `You are an expert career coach writing a REUSABLE COVER LETTER TEMPLATE for a specific job role. This is not a letter for one real person — it's a strong, generic-but-specific template that any qualified candidate for this role could adapt with their own details.

Rules:
1. Fits comfortably on ONE A4 page.
2. Write in first person as a placeholder candidate — use bracketed placeholders like [Your relevant achievement] sparingly only where a real number/fact would normally go; otherwise write confident, concrete-sounding sentences about the KIND of experience someone in this role would have.
3. Opening paragraph: hook the reader, state the role being applied for, and show immediate relevance.
4. 1-2 body paragraphs: connect typical, realistic experience/skills for this role to what an employer in this field cares about. Be specific to the role (mention real tools/skills/responsibilities relevant to it), not generic filler.
5. Closing paragraph: confident call to action, availability for interview, thanks.
6. Professional but warm tone — not stiff, not overly casual.
7. Salutation should be "Dear Hiring Manager," (generic, since there's no real company yet).

Return ONLY this JSON shape, no markdown, no explanation:
{
  "personalDetails": { "name": "string (a placeholder name like 'Your Name')", "title": "string (professional title for this role)", "email": "string (placeholder like your.email@example.com)", "phone": "string (placeholder)", "location": "string (placeholder like City, Country)" },
  "date": "string (e.g. 'Month Day, Year' — use a placeholder-style current-feeling date)",
  "recipient": { "companyName": "string (generic placeholder like 'Company Name')" },
  "salutation": "string",
  "openingParagraph": "string",
  "bodyParagraphs": ["string"],
  "closingParagraph": "string",
  "signOff": "string (e.g. 'Sincerely,')"
}
Return ONLY the JSON object, no markdown, no explanations.`;

async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const models = ['gemini-2.5-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const modelName of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 4000 },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) continue;
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text) return text;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('429')) continue;
      if (modelName === models[models.length - 1]) throw error;
    }
  }
  throw new Error('All Gemini models failed');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { roleLabel } = body;

    if (!roleLabel) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: roleLabel' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `**TARGET ROLE**: ${roleLabel}\n\n${SYSTEM_PROMPT}`;

    const responseText = await callGeminiAPI(prompt);
    const jsonText = responseText.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```\s*$/g, '').trim();

    let structuredData: any;
    try {
      structuredData = JSON.parse(jsonText);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response as JSON' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: structuredData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in generate-cover-letter-template-page:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

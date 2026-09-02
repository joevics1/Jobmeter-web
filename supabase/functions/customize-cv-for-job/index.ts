// Supabase Edge Function: customize-cv-for-job
// Isolated, separate from tailor-cv-template-page and parse-cv-template-form.
// Takes the CV data already in the form plus a pasted job description, and
// lightly rewords the summary + experience bullets to emphasize relevance
// to that specific job — same "never invent, only reword" constraint as
// the other AI paths in this feature.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { callGeminiText } from '../_shared/gemini.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  cvData: any;
  jobDescription: string;
}

const CUSTOMIZE_PROMPT = `You are lightly tailoring an existing CV to a specific job description. Rules:
- Do NOT invent employers, dates, degrees, or facts not already present in the CV data given.
- Keep the same companies, job dates, and qualifications in "experience" exactly as given — do not change experience[].role, experience[].company, or experience[].years.
- You MAY reword the summary and experience bullets to emphasize relevance to the job description — but every bullet must still describe something already stated in the CV, just phrased toward this job.
- You MAY reorder and select from the existing "skills" array to prioritize the ones most relevant to this job description, and trim it to at most 10. Do NOT add any skill that is not already present in the given skills array — only reorder/select from what's there.
- personalDetails.title and the top-level "roles" array both exist specifically to be tailored per job — you MAY reword them toward the job description, but only using terms that are genuinely supported by the person's actual skills and experience elsewhere in the CV. Do not claim a different profession or seniority level than what the rest of the CV demonstrates.
- Do not change education, projects, achievements, or any other section.
- Max 4 bullets per role.

Return ONLY the full CVData JSON object back, same shape as given, with only summary, experience bullets, skills, personalDetails.title, and roles edited as described. No markdown, no explanation.`;

async function callGemini(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  return callGeminiText(prompt, apiKey, { temperature: 0.4, maxTokens: 4000, timeoutMs: 45000 });
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

    // Hard guarantees, not just prompt instructions — an LLM can still slip
    // up despite being told not to. Rather than trust the model echoed
    // every untouched field back correctly, rebuild the result starting
    // from the ORIGINAL cvData and only overlay the specific fields this
    // function is meant to touch. Everything else comes out byte-identical
    // to what was given, regardless of what the model actually returned.
    const result = JSON.parse(JSON.stringify(cvData)); // deep clone of the original, untouched

    if (typeof structuredData?.summary === 'string' && structuredData.summary.trim()) {
      result.summary = structuredData.summary;
    }

    if (typeof structuredData?.personalDetails?.title === 'string' && structuredData.personalDetails.title.trim()) {
      result.personalDetails = { ...result.personalDetails, title: structuredData.personalDetails.title };
    }

    if (Array.isArray(structuredData?.roles) && structuredData.roles.every((r: any) => typeof r === 'string')) {
      result.roles = structuredData.roles.slice(0, 8);
    }

    // Skills: only reorder/select from what already existed — never add.
    const originalSkills: string[] = Array.isArray(cvData?.skills) ? cvData.skills : [];
    if (Array.isArray(structuredData?.skills)) {
      const originalLower = new Set(originalSkills.map((s) => String(s).trim().toLowerCase()));
      const filtered = structuredData.skills.filter(
        (s: any) => typeof s === 'string' && originalLower.has(s.trim().toLowerCase())
      );
      result.skills = (filtered.length > 0 ? filtered : originalSkills).slice(0, 10);
    }

    // Experience: role/company/years always come from the original, by
    // index — only bullets may come from the model, and only if the
    // returned array is the same length as the original (a mismatched
    // length means the model restructured something we can't safely
    // trust field-by-field, so fall back to the original entry untouched).
    if (Array.isArray(cvData?.experience) && Array.isArray(structuredData?.experience)
        && structuredData.experience.length === cvData.experience.length) {
      result.experience = cvData.experience.map((original: any, i: number) => {
        const candidateBullets = structuredData.experience[i]?.bullets;
        const bullets = Array.isArray(candidateBullets) && candidateBullets.every((b: any) => typeof b === 'string')
          ? candidateBullets.slice(0, 4)
          : original.bullets;
        return { ...original, bullets };
      });
    }

    // Everything else (education, projects, achievements, awards,
    // certifications, languages, interests, publications, volunteerWork,
    // additionalSections, references, personalDetails besides title) was
    // never in scope for this function and is left exactly as cloned.

    return new Response(JSON.stringify({ success: true, data: result }), {
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

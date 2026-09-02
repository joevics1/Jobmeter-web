import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini-client';
import { safeSubmitLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Same 25-sector list and dropdown value formats as app/submit/page.tsx
// (SECTORS, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS) - kept in sync manually
// since the form doesn't export these as a shared module.
const SECTORS = [
  'Information Technology & Software',
  'Engineering & Manufacturing',
  'Finance & Banking',
  'Healthcare & Medical',
  'Education & Training',
  'Sales & Marketing',
  'Human Resources & Recruitment',
  'Customer Service & Support',
  'Media, Advertising & Communications',
  'Design, Arts & Creative',
  'Construction & Real Estate',
  'Logistics, Transport & Supply Chain',
  'Agriculture & Agribusiness',
  'Energy & Utilities (Oil, Gas, Renewable Energy)',
  'Legal & Compliance',
  'Government & Public Administration',
  'Retail & E-commerce',
  'Hospitality & Tourism',
  'Science & Research',
  'Security & Defense',
  'Telecommunications',
  'Nonprofit & NGO',
  'Environment & Sustainability',
  'Product Management & Operations',
  'Data & Analytics',
];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Executive'];

async function callGeminiAI(prompt: string): Promise<string> {
  const { text } = await callGemini(prompt, { temperature: 0.1, maxOutputTokens: 4096 });
  return text;
}

function buildPrompt(rawContent: string): string {
  return `You are an expert job posting parser. Parse the following raw, pasted job posting text (it may come from WhatsApp, LinkedIn, email, or anywhere else, and may be messy or informally formatted) and extract structured information to pre-fill a job submission form.

Extract:
1. title - the job title
2. sector - MUST be exactly one of these: ${SECTORS.join(', ')}
3. companyName - ONLY if you are 90% confident it's the real company name. Do not use generic terms like "leading company", "our client", "a reputable firm". If unsure, use an empty string. Never invent a placeholder name.
4. companyWebsite - if mentioned, else empty string
5. city, state - location, else empty string
6. remote - boolean, true if this is a remote/work-from-home role
7. employmentType - MUST be exactly one of: ${EMPLOYMENT_TYPES.join(', ')}
8. experienceLevel - MUST be exactly one of: ${EXPERIENCE_LEVELS.join(', ')} (map years mentioned: 0-1=Entry Level, 1-3=Junior, 3-5=Mid-level, 5-8=Senior, 8-10=Lead, 10+=Executive)
9. skills - comma-separated string of required skills, e.g. "React, JavaScript, TypeScript, Node.js"
10. salaryMin, salaryMax - numbers only (no currency symbols, no commas), null if not mentioned
11. currency - 3-letter currency code if mentioned (e.g. NGN, USD, AED, SAR, QAR), else "NGN"
12. period - one of: annually, monthly, hourly (default "annually" if unclear)
13. description - a clear, professional rewrite of the role description, 2-4 sentences
14. responsibilities - comma-separated string, e.g. "Develop features, Code reviews, Team collaboration"
15. qualifications - comma-separated string, e.g. "3+ years experience, Bachelor's degree"
16. benefits - comma-separated string, e.g. "Health insurance, Pension, Remote work" (empty string if none mentioned)
17. applicationUrl - full https:// URL if mentioned, else empty string
18. applicationEmail - email address if mentioned (no mailto: prefix), else empty string
19. applicationPhone - phone number if mentioned (no tel: prefix), else empty string
20. deadline - YYYY-MM-DD format if a deadline is mentioned, else empty string

Return ONLY a valid JSON object, no markdown formatting, no code fences, no explanation - just the raw JSON object with exactly this structure:
{
  "title": "string",
  "sector": "string",
  "companyName": "string",
  "companyWebsite": "string",
  "city": "string",
  "state": "string",
  "remote": boolean,
  "employmentType": "string",
  "experienceLevel": "string",
  "skills": "string",
  "salaryMin": number or null,
  "salaryMax": number or null,
  "currency": "string",
  "period": "string",
  "description": "string",
  "responsibilities": "string",
  "qualifications": "string",
  "benefits": "string",
  "applicationUrl": "string",
  "applicationEmail": "string",
  "applicationPhone": "string",
  "deadline": "string"
}

Job posting text to parse:
${rawContent}`;
}

function extractJson(raw: string): any {
  let text = raw.trim();

  if (text.includes('```json')) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) text = match[1];
  } else if (text.includes('```')) {
    const match = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match) text = match[1];
  }

  text = text.trim();

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return JSON.parse(objectMatch[0]);
  }
  return JSON.parse(text);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await safeSubmitLimit(`${ip}:parse-paste`);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests — please slow down and try again shortly.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { rawContent } = await request.json();

    if (!rawContent || typeof rawContent !== 'string' || !rawContent.trim()) {
      return NextResponse.json({ error: 'Please paste a job description.' }, { status: 400 });
    }

    if (rawContent.trim().length < 20) {
      return NextResponse.json({ error: "That doesn't look like a full job description. Please paste more detail." }, { status: 400 });
    }

    const prompt = buildPrompt(rawContent.trim());
    const aiResponse = await callGeminiAI(prompt);

    let parsed;
    try {
      parsed = extractJson(aiResponse);
    } catch (parseErr) {
      console.error('[parse-paste] Failed to parse AI response as JSON:', aiResponse);
      return NextResponse.json(
        { error: "Couldn't understand that job posting. Try filling the form manually instead." },
        { status: 422 }
      );
    }

    // Guard against a totally empty extraction (e.g. AI returned {} for junk input)
    if (!parsed || (!parsed.title && !parsed.description)) {
      return NextResponse.json(
        { error: "Couldn't find enough job details in that text. Try pasting the full posting, or fill the form manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ parsed });
  } catch (error: any) {
    console.error('[parse-paste] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse job description. Please try again or fill the form manually.' },
      { status: 500 }
    );
  }
}

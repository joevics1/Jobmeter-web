// app/api/documents/research/route.ts
//
// Step 1 of the AI Document Writer's "ground once, reuse forever" flow.
//
// Given a document type + country:
//   - If we already have a cached, fresh jurisdiction template for this
//     exact pair, return it immediately — no AI call at all.
//   - Otherwise, run a single grounded (Google Search) Gemini pass to
//     research that country's actual legal requirements for this document,
//     cache the result server-side, and return it.
//
// This route never sees or stores any personal/deal data — only the
// jurisdiction's legal structure, which is shared across every user.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { callGemini, parseGeminiJSON } from '@/lib/gemini-documents';
import { getDocumentType, getDocumentCountry } from '@/lib/document-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Re-ground after 6 months in case a law changed — keeps the cache from
// going stale forever with no refresh path.
const STALE_AFTER_MS = 1000 * 60 * 60 * 24 * 180;

export interface LegalRequirements {
  summary: string;
  requiredFields: string[];
  mandatoryClauses: string[];
  disclosures: string[];
  formattingNotes: string;
  notarizationRequired: boolean;
  witnessRequired: boolean;
  governingLawNote: string;
}

const RESEARCH_SYSTEM_PROMPT = `You are a legal research assistant. You use Google Search grounding to find real, current, jurisdiction-specific information about a legal document type.

Return ONLY a valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "summary": "1-2 sentence summary of what this document needs in this jurisdiction",
  "requiredFields": ["short label for each piece of information needed, e.g. 'Seller full legal name', 'Vehicle VIN', 'Sale price'"],
  "mandatoryClauses": ["clause or disclosure legally required in this jurisdiction for this document, e.g. 'Odometer mileage disclosure'"],
  "disclosures": ["specific legal disclosure statements or warnings required by law here, written out close to their real legal wording"],
  "formattingNotes": "notarization, witness, or registration requirements and any other formatting/procedural notes",
  "notarizationRequired": true or false,
  "witnessRequired": true or false,
  "governingLawNote": "the correct governing-law clause reference for this jurisdiction, e.g. 'the laws of the Federal Republic of Nigeria' or 'the laws of the State of California'"
}

Be specific to the actual country/jurisdiction given. If it's a country with state/provincial variation (e.g. USA), give the general federal-level baseline requirements that apply broadly, and note in formattingNotes that state-level rules can add requirements. Do not invent legal citations you are not reasonably confident about — prefer general, defensible guidance over fabricated specifics.`;

export async function POST(req: NextRequest) {
  try {
    const { documentTypeSlug, country } = await req.json();

    if (!documentTypeSlug || !country) {
      return NextResponse.json({ error: 'documentTypeSlug and country are required.' }, { status: 400 });
    }

    const docType = getDocumentType(documentTypeSlug);
    const docCountry = getDocumentCountry(country);
    if (!docType || !docCountry) {
      return NextResponse.json({ error: 'Unknown document type or country.' }, { status: 400 });
    }

    // ── Check cache ────────────────────────────────────────────────────
    const { data: cached } = await supabase
      .from('document_jurisdiction_templates')
      .select('legal_requirements, last_verified_at')
      .eq('document_type', documentTypeSlug)
      .eq('country', country)
      .maybeSingle();

    if (cached) {
      const age = Date.now() - new Date(cached.last_verified_at).getTime();
      if (age < STALE_AFTER_MS) {
        return NextResponse.json({
          legalRequirements: cached.legal_requirements as LegalRequirements,
          cached: true,
        });
      }
    }

    // ── Ground once ────────────────────────────────────────────────────
    const userPrompt = `Document type: ${docType.label} (${docType.description})\nCountry / jurisdiction: ${docCountry.name}\n\nResearch the real legal requirements for creating this document in this country and return the JSON schema described in your instructions.`;

    const result = await callGemini({
      systemPrompt: RESEARCH_SYSTEM_PROMPT,
      userPrompt,
      grounding: true,
      temperature: 0.2,
      maxOutputTokens: 4096,
    });

    const legalRequirements = parseGeminiJSON<LegalRequirements>(result.text);

    // ── Cache it (upsert — safe if two users race on the same new pair) ──
    await supabase
      .from('document_jurisdiction_templates')
      .upsert(
        {
          document_type: documentTypeSlug,
          country,
          legal_requirements: legalRequirements,
          model_used: result.modelUsed,
          last_verified_at: new Date().toISOString(),
        },
        { onConflict: 'document_type,country' }
      );

    return NextResponse.json({
      legalRequirements,
      cached: false,
      sources: result.sources,
    });
  } catch (err: any) {
    console.error('[documents/research] error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to research legal requirements. Please try again.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;

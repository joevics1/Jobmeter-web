// app/api/documents/generate/route.ts
//
// Step 2 of the AI Document Writer.
//
// Takes the (already-cached) jurisdiction legal requirements plus the
// user's deal-specific details — or a request to use placeholders — and
// assembles the full, formatted document. No grounding needed here: the
// legal research already happened once in /api/documents/research. This
// step is just clause-library assembly, so it's cheaper and faster.
//
// The filled document itself is returned to the client and never written
// to the database when it contains real personal data — per the product
// spec that stays client-side only (localStorage). The one exception:
// when placeholders were used for a Template-tier document type and no
// template exists yet for that (type, country) pair, the placeholder
// version (no real personal data) is saved as a draft to seed the
// Template library for review — see the auto-seed block below.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { callGemini, parseGeminiJSON } from '@/lib/gemini-documents';
import { getDocumentType, getDocumentCountry, HIGH_RISK_DOCUMENT_TYPES } from '@/lib/document-types';
import { tokenizeGeneratedDocument } from '@/lib/document-tokenizer';
import type { LegalRequirements } from '../research/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface GeneratedDocument {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  signatures: { role: string }[];
}

const GENERATE_SYSTEM_PROMPT = `You are an expert legal document drafter. You write complete, thorough, professionally formatted contracts and legal documents — the kind a real law firm would produce, not a one-paragraph summary.

Return ONLY a valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "title": "DOCUMENT TITLE IN CAPS",
  "intro": "One formal opening paragraph identifying the parties, the date, and the purpose of the agreement.",
  "sections": [
    { "heading": "1. SECTION NAME IN CAPS", "body": "Full clause text. Use \\n\\n between paragraphs within the same section if there is more than one. Write in complete, formal contract language, not bullet fragments." }
  ],
  "signatures": [ { "role": "Seller" }, { "role": "Buyer" } ]
}

Rules:
- Be thorough and complete. A real contract has many sections — write ALL of the following that are relevant to this document type, each as its own numbered section: Parties/Recitals, full description of the vehicle/subject matter, price/consideration and payment terms, all jurisdiction-mandated disclosures (word them close to the real legal requirement given to you), condition/warranty or as-is clause, title and ownership transfer, risk of loss, representations and warranties of both parties, default and remedies (if this is a loan/lease/financed document), indemnification, governing law and jurisdiction (use the exact governing-law wording given to you), dispute resolution, notices, entire agreement clause, severability, counterparts, and any other clause implied by the mandatory clauses list you're given. Aim for a genuinely complete, multi-page contract — do not compress this into a short summary.
- Use the exact required fields and details the user gave you. If a detail wasn't provided and placeholders were not requested, write a clearly marked blank like "____________________" rather than inventing real-sounding data.
- If placeholders were requested, use bracketed ALL-CAPS placeholders like [SELLER FULL NAME], [VEHICLE VIN], [SALE PRICE], [DATE] etc. so the document is usable as a fill-in template.
- Always end with a "SIGNATURES" section in the sections array whose body briefly states the parties agree to be bound, and separately list every signing party in the "signatures" array (role only, e.g. Seller, Buyer, Witness, Lender, Lessee — include Witness or Notary only if the jurisdiction requires it).
- Write in formal, precise legal English appropriate to the given jurisdiction.
- Do NOT use markdown formatting anywhere in "title", "intro", "heading", or "body" — no **bold**, no _italic_, no markdown headers, no bullet dashes. Section headings are already rendered bold by the platform; within body text, if a term needs emphasis, write it in plain capitalized text (e.g. "Events of Default") instead of wrapping it in asterisks.
- Do not write any disclaimer or "not legal advice" text yourself — the platform displays that separately, outside the document.`;

export async function POST(req: NextRequest) {
  try {
    const {
      documentTypeSlug,
      country,
      legalRequirements,
      userDetails,
      usePlaceholders,
    }: {
      documentTypeSlug: string;
      country: string;
      legalRequirements: LegalRequirements;
      userDetails?: string;
      usePlaceholders?: boolean;
    } = await req.json();

    if (!documentTypeSlug || !country || !legalRequirements) {
      return NextResponse.json(
        { error: 'documentTypeSlug, country, and legalRequirements are required.' },
        { status: 400 }
      );
    }
    if (!usePlaceholders && !userDetails?.trim()) {
      return NextResponse.json(
        { error: 'Please provide the details to use, or choose to use placeholders.' },
        { status: 400 }
      );
    }

    const docType = getDocumentType(documentTypeSlug);
    const docCountry = getDocumentCountry(country);
    if (!docType || !docCountry) {
      return NextResponse.json({ error: 'Unknown document type or country.' }, { status: 400 });
    }

    const userPrompt = `Document type: ${docType.label}
Jurisdiction: ${docCountry.name}

Jurisdiction legal requirements (from prior research — follow these):
${JSON.stringify(legalRequirements, null, 2)}

${usePlaceholders
        ? 'The user wants to preview this document with placeholder data. Use bracketed ALL-CAPS placeholders for every party name, ID number, date, and amount instead of real details.'
        : `User-provided details to use in the document:\n${userDetails}`}

Write the complete document now, following the JSON schema and rules in your instructions.`;

    const result = await callGemini({
      systemPrompt: GENERATE_SYSTEM_PROMPT,
      userPrompt,
      grounding: false,
      temperature: 0.4,
      maxOutputTokens: 8192,
    });

    const document = parseGeminiJSON<GeneratedDocument>(result.text);

    // ── Feature A: auto-seed the Template tier from AI output ──────────────
    // Only when: placeholders were used (so there's no real personal data —
    // just bracketed placeholders), this document type is tagged as a
    // Template-tier candidate, and nothing already exists for this exact
    // (type, country) pair. Saved as `draft` — never visible publicly until
    // reviewed and published deliberately. Never blocks or fails the
    // user's request if anything here goes wrong.
    if (usePlaceholders && docType.tier === 'template') {
      try {
        const { data: existing } = await supabase
          .from('document_templates')
          .select('id')
          .eq('document_type', documentTypeSlug)
          .eq('country', country)
          .maybeSingle();

        if (!existing) {
          const tokenized = tokenizeGeneratedDocument(document);
          await supabase.from('document_templates').insert({
            document_type: documentTypeSlug,
            country,
            title: tokenized.title,
            intro: tokenized.intro,
            sections: tokenized.sections,
            signatures: document.signatures,
            fields: tokenized.fields,
            legal_note: legalRequirements.summary || '',
            seo_intro: '',
            status: 'draft',
          });
        }
      } catch (seedErr: any) {
        console.warn('[documents/generate] Draft template auto-seed skipped:', seedErr?.message || seedErr);
      }
    }

    return NextResponse.json({
      document,
      modelUsed: result.modelUsed,
      isHighRisk: HIGH_RISK_DOCUMENT_TYPES.has(documentTypeSlug),
    });
  } catch (err: any) {
    console.error('[documents/generate] error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate the document. Please try again.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;

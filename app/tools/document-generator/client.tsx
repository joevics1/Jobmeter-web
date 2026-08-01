'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Loader2, ChevronRight, Home, Sparkles, CheckCircle2, FileCheck2, History,
} from 'lucide-react';
import {
  DOCUMENT_TYPES, DOCUMENT_COUNTRIES, DOCUMENT_TYPES_SORTED, DOCUMENT_TYPES_POPULAR_COUNT,
  DOCUMENT_COUNTRIES_SORTED, DOCUMENT_COUNTRIES_POPULAR_COUNT,
} from '@/lib/document-types';
import { GeneratedDocument, sanitizeDocument } from '@/lib/document-format';
import { saveToHistory } from '@/lib/document-history';
import DocumentEditor from '@/components/documents/DocumentEditor';
import TemplateAvailableLink from '@/components/documents/TemplateAvailableLink';

interface LegalRequirements {
  summary: string;
  requiredFields: string[];
  mandatoryClauses: string[];
  disclosures: string[];
  formattingNotes: string;
  notarizationRequired: boolean;
  witnessRequired: boolean;
  governingLawNote: string;
}

type Step = 'select' | 'researching' | 'details' | 'generating' | 'preview';

// Short, on-page only — not part of the generated document itself.
const SHORT_DISCLAIMER =
  'Informational only, not legal advice. Have high-value or high-risk agreements reviewed by a licensed attorney.';

export default function DocumentGeneratorClient() {
  const [step, setStep] = useState<Step>('select');
  const [documentTypeSlug, setDocumentTypeSlug] = useState('');
  const [country, setCountry] = useState('');
  const [legalRequirements, setLegalRequirements] = useState<LegalRequirements | null>(null);
  const [userDetails, setUserDetails] = useState('');
  const [usePlaceholders, setUsePlaceholders] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docType = DOCUMENT_TYPES.find(d => d.slug === documentTypeSlug);
  const docCountry = DOCUMENT_COUNTRIES.find(c => c.code === country);

  const handleResearch = useCallback(async () => {
    if (!documentTypeSlug || !country) return;
    setError(null);
    setStep('researching');
    try {
      const res = await fetch('/api/documents/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentTypeSlug, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed.');
      setLegalRequirements(data.legalRequirements);
      setStep('details');
    } catch (err: any) {
      setError(err.message || 'Something went wrong researching this document. Please try again.');
      setStep('select');
    }
  }, [documentTypeSlug, country]);

  const handleGenerate = useCallback(async () => {
    if (!legalRequirements) return;
    if (!usePlaceholders && !userDetails.trim()) {
      setError('Please add the details to use, or tap "Use placeholder details".');
      return;
    }
    setError(null);
    setStep('generating');
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTypeSlug, country, legalRequirements,
          userDetails: usePlaceholders ? undefined : userDetails,
          usePlaceholders,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');
      const sanitized = sanitizeDocument(data.document);
      setGeneratedDocument(sanitized);
      setIsHighRisk(!!data.isHighRisk);
      setStep('preview');
      if (docType && docCountry) {
        saveToHistory({
          source: 'ai',
          documentTypeSlug,
          documentTypeLabel: docType.label,
          countryCode: country,
          countryLabel: docCountry.name,
          isHighRisk: !!data.isHighRisk,
          document: sanitized,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong writing this document. Please try again.');
      setStep('details');
    }
  }, [legalRequirements, userDetails, usePlaceholders, documentTypeSlug, country, docType, docCountry]);

  const handleReset = () => {
    setStep('select');
    setDocumentTypeSlug('');
    setCountry('');
    setLegalRequirements(null);
    setUserDetails('');
    setUsePlaceholders(false);
    setGeneratedDocument(null);
    setIsHighRisk(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground no-print">
          <Link href="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" />Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tools" className="hover:text-foreground">Tools</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Document Generator</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">AI-Powered · Free</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">AI Document Generator</h1>
          <p className="text-muted-foreground leading-relaxed">
            Pick a document and a country. We research the real legal requirements for that jurisdiction, then draft a complete, formatted document you can edit and download.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-2 no-print">{SHORT_DISCLAIMER}</p>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-3 no-print"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            Prefer a fixed template instead? Browse free templates →
          </Link>
          <div className="flex justify-end">
            <Link
              href="/documents/my-documents"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-600 text-white text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors mt-3 no-print"
            >
              <History className="h-3.5 w-3.5" />
              My Documents
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 text-sm no-print">
            {error}
          </div>
        )}

        {/* ── Step: select ──────────────────────────────────────────── */}
        {step === 'select' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Document type</label>
              {DOCUMENT_TYPES_SORTED.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-background border border-border rounded-lg px-3 py-2.5">
                  No document types are available yet — check back soon.
                </p>
              ) : (
                <select
                  value={documentTypeSlug}
                  onChange={e => setDocumentTypeSlug(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
                >
                  <option value="">Select a document…</option>
                  {DOCUMENT_TYPES_SORTED.slice(0, DOCUMENT_TYPES_POPULAR_COUNT).map(d => (
                    <option key={d.slug} value={d.slug}>{d.label}</option>
                  ))}
                  {DOCUMENT_TYPES_POPULAR_COUNT > 0 && DOCUMENT_TYPES_POPULAR_COUNT < DOCUMENT_TYPES_SORTED.length && (
                    <option disabled>──────────</option>
                  )}
                  {DOCUMENT_TYPES_SORTED.slice(DOCUMENT_TYPES_POPULAR_COUNT).map(d => (
                    <option key={d.slug} value={d.slug}>{d.label}</option>
                  ))}
                </select>
              )}
              {docType && <p className="text-xs text-muted-foreground mt-1.5">{docType.description}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
              >
                <option value="">Select a country…</option>
                {DOCUMENT_COUNTRIES_SORTED.slice(0, DOCUMENT_COUNTRIES_POPULAR_COUNT).map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
                <option disabled>──────────</option>
                {DOCUMENT_COUNTRIES_SORTED.slice(DOCUMENT_COUNTRIES_POPULAR_COUNT).map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {documentTypeSlug && country && (
              <TemplateAvailableLink documentTypeSlug={documentTypeSlug} country={country} />
            )}

            <button
              onClick={handleResearch}
              disabled={!documentTypeSlug || !country}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Start
            </button>
          </div>
        )}

        {/* ── Step: researching ─────────────────────────────────────── */}
        {step === 'researching' && (
          <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
            <p className="text-foreground font-medium">Researching legal requirements…</p>
            <p className="text-sm text-muted-foreground">Checking what {docCountry?.name} requires for a {docType?.label.toLowerCase()}.</p>
          </div>
        )}

        {/* ── Step: details ────────────────────────────────────────── */}
        {step === 'details' && legalRequirements && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{legalRequirements.summary}</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">
                To generate your {docType?.label} for {docCountry?.name}, I'll need:
              </p>
              <ul className="space-y-1">
                {legalRequirements.requiredFields.map((f, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Your details</label>
                <button
                  type="button"
                  onClick={() => { setUsePlaceholders(true); setUserDetails(''); }}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                    usePlaceholders
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-dashed border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  Use placeholder details
                </button>
              </div>
              <textarea
                value={usePlaceholders ? '' : userDetails}
                onChange={e => { setUserDetails(e.target.value); if (usePlaceholders) setUsePlaceholders(false); }}
                disabled={usePlaceholders}
                placeholder={usePlaceholders
                  ? 'Placeholder names and sample details will be used instead — you can fill them in after downloading.'
                  : 'Type everything you have — names, details, price, dates, etc. One message is enough.'}
                rows={6}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!usePlaceholders && !userDetails.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Generate Document
              </button>
            </div>
          </div>
        )}

        {/* ── Step: generating ─────────────────────────────────────── */}
        {step === 'generating' && (
          <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
            <p className="text-foreground font-medium">Writing your document…</p>
            <p className="text-sm text-muted-foreground">Drafting a complete, formatted {docType?.label.toLowerCase()}.</p>
          </div>
        )}

        {/* ── Step: preview ────────────────────────────────────────── */}
        {step === 'preview' && generatedDocument && (
          <DocumentEditor
            document={generatedDocument}
            onChange={setGeneratedDocument}
            isHighRisk={isHighRisk}
            fileNamePrefix={docType?.label || 'document'}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

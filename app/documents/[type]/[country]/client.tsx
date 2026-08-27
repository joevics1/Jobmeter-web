'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, FileCheck2, Wand2, History, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { DocumentTemplateRow, fillTemplate } from '@/lib/document-templates-data';
import { DocumentTypeDef, DocumentCountryDef, HIGH_RISK_DOCUMENT_TYPES } from '@/lib/document-types';
import { GeneratedDocument } from '@/lib/document-format';
import { downloadDocx } from '@/lib/document-docx-export';
import { saveToHistory } from '@/lib/document-history';
import DocumentEditor from '@/components/documents/DocumentEditor';
import DocumentPrintStyles from '@/components/documents/DocumentPrintStyles';

const SHORT_DISCLAIMER =
  'Informational only, not legal advice. Have high-value or high-risk agreements reviewed by a licensed attorney.';

interface TemplateDocumentClientProps {
  template: DocumentTemplateRow;
  docType: DocumentTypeDef;
  docCountry: DocumentCountryDef;
}

export default function TemplateDocumentClient({ template, docType, docCountry }: TemplateDocumentClientProps) {
  // Two screens ahead of the result: 'preview' (placeholder-filled template,
  // the default landing view) → 'form' (fill in your details). The result
  // screen below is gated on generatedDocument, same as before.
  const [screen, setScreen] = useState<'preview' | 'form'>('preview');
  const [values, setValues] = useState<Record<string, string>>({});
  const [usePlaceholders, setUsePlaceholders] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [previewDownloading, setPreviewDownloading] = useState<'pdf' | 'docx' | null>(null);

  const isHighRisk = HIGH_RISK_DOCUMENT_TYPES.has(docType.slug);

  // Always placeholder-filled, independent of the form's own "Use placeholder
  // details" toggle — this is what Screen 1 shows by default.
  const previewDoc = fillTemplate(template, {}, template.fields, true);
  const previewDocument: GeneratedDocument = {
    title: previewDoc.title,
    intro: previewDoc.intro,
    sections: previewDoc.sections,
    signatures: template.signatures,
  };

  const handlePreviewDownloadPdf = () => {
    setPreviewDownloading('pdf');
    setTimeout(() => {
      window.print();
      setPreviewDownloading(null);
    }, 50);
  };

  const handlePreviewDownloadDocx = async () => {
    setPreviewDownloading('docx');
    try {
      await downloadDocx(previewDocument, `${docType.label}-template`);
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewDownloading(null);
    }
  };

  const handleFieldChange = (id: string, value: string) => {
    setValues(v => ({ ...v, [id]: value }));
    if (usePlaceholders) setUsePlaceholders(false);
  };

  const missingRequired = !usePlaceholders && template.fields.some(f => f.required && !values[f.id]?.trim());

  const handleFill = () => {
    const filled = fillTemplate(template, values, template.fields, usePlaceholders);
    const doc: GeneratedDocument = {
      title: filled.title,
      intro: filled.intro,
      sections: filled.sections,
      signatures: template.signatures,
    };
    setGeneratedDocument(doc);
    saveToHistory({
      source: 'template',
      documentTypeSlug: docType.slug,
      documentTypeLabel: docType.label,
      countryCode: docCountry.code,
      countryLabel: docCountry.name,
      isHighRisk,
      document: doc,
    });
  };

  const handleReset = () => {
    setGeneratedDocument(null);
    setValues({});
    setUsePlaceholders(false);
    setScreen('form'); // editing again goes straight back to the form, not the preview
  };

  return (
    <div className="min-h-screen bg-background">
      <DocumentPrintStyles />
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb — same on both screens */}
        <div className="flex items-center justify-between gap-3 no-print flex-wrap">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" />Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/documents" className="hover:text-foreground">Documents</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{docType.label} — {docCountry.name}</span>
          </nav>
          <Link
            href="/documents/my-documents"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 border border-blue-600 text-white text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
          >
            <History className="h-3.5 w-3.5" />
            My Documents
          </Link>
        </div>

        {/* ── Screen 1: Preview ─────────────────────────────────────── */}
        {!generatedDocument && screen === 'preview' && (
          <>
            <div className="pb-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Free Template · No Sign-Up</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {docType.label} Template — {docCountry.flag} {docCountry.name}
              </h1>
            </div>

            {template.legal_note && (
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 rounded-lg px-4 py-3 text-sm">
                {template.legal_note}
              </div>
            )}

            <p className="text-xs text-muted-foreground/80">{SHORT_DISCLAIMER}</p>

            {/* Placeholder-filled preview — same "paper" look as the real result */}
            <div id="doc-print-area" className="bg-white text-black mx-auto max-w-[210mm] shadow-lg rounded-sm p-[15mm] sm:p-[20mm]">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">{previewDoc.title}</h2>

              {previewDoc.intro && (
                <p className="text-sm leading-relaxed mb-6">{previewDoc.intro}</p>
              )}

              {previewDoc.sections.map((section, i) => (
                <div key={i} className="mb-5">
                  <h3 className="text-sm font-bold mb-1.5">{section.heading}</h3>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{section.body}</div>
                </div>
              ))}

              <div className="mt-10 pt-6 border-t border-gray-300">
                <p className="text-sm font-bold mb-6">SIGNATURES</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {template.signatures.map((sig, i) => (
                    <div key={i}>
                      <div className="border-b border-gray-400 h-10" />
                      <p className="text-xs text-gray-600 mt-1">{sig.role} — Signature</p>
                      <p className="text-xs mt-3">Printed Name: ________________________</p>
                      <p className="text-xs mt-2">Date: ______________</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO article content */}
            {template.seo_intro && (
              <div className="prose-sm text-muted-foreground leading-relaxed border-t border-border pt-6">
                <p>{template.seo_intro}</p>
              </div>
            )}
            </div>

            {/* Fixed bottom action bar — stays put while the preview scrolls */}
            <div data-app-bottom-bar="true" className="no-print fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
              <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
                <button
                  onClick={() => setScreen('form')}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={handlePreviewDownloadPdf}
                  disabled={!!previewDownloading}
                  className="flex-1 flex items-center justify-center gap-1 border border-border bg-card hover:bg-muted disabled:opacity-50 text-foreground text-sm font-semibold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
                >
                  {previewDownloading === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  <span>PDF</span>
                </button>
                <button
                  onClick={handlePreviewDownloadDocx}
                  disabled={!!previewDownloading}
                  className="flex-1 flex items-center justify-center gap-1 border border-border bg-card hover:bg-muted disabled:opacity-50 text-foreground text-sm font-semibold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
                >
                  {previewDownloading === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  <span>Word Docx</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Screen 2: Form ────────────────────────────────────────── */}
        {!generatedDocument && screen === 'form' && (
          <>
            <button
              onClick={() => setScreen('preview')}
              className="no-print flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to preview
            </button>

            <p className="text-xs text-muted-foreground/80">{SHORT_DISCLAIMER}</p>

            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Fill in your details</h2>
                <button
                  type="button"
                  onClick={() => { setUsePlaceholders(true); setValues({}); }}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                    usePlaceholders
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-dashed border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  Use placeholder details
                </button>
              </div>

              {usePlaceholders ? (
                <p className="text-sm text-muted-foreground bg-background border border-border rounded-lg px-3 py-2.5">
                  Placeholder fields like [SELLER'S FULL NAME] will be used — fill them in after downloading.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {template.fields.map(field => (
                    <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={values[field.id] || ''}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none"
                        />
                      ) : (
                        <input
                          type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                          value={values[field.id] || ''}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleFill}
                disabled={missingRequired}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors"
              >
                <Wand2 className="h-4 w-4" />
                Fill Document
              </button>
            </div>
          </>
        )}

        {/* ── Screen 3: Result (unchanged) ──────────────────────────── */}
        {generatedDocument && (
          <DocumentEditor
            document={generatedDocument}
            onChange={setGeneratedDocument}
            isHighRisk={isHighRisk}
            fileNamePrefix={docType.label}
            onReset={handleReset}
            resetLabel="Edit"
          />
        )}
      </div>
    </div>
  );
}

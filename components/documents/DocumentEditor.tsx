'use client';

import { useRef, useState } from 'react';
import { Loader2, Download, AlertTriangle } from 'lucide-react';
import { GeneratedDocument } from '@/lib/document-format';
import { downloadDocx as downloadDocxFile } from '@/lib/document-docx-export';
import DocumentPrintStyles from '@/components/documents/DocumentPrintStyles';

interface DocumentEditorProps {
  document: GeneratedDocument;
  onChange: (doc: GeneratedDocument) => void;
  isHighRisk?: boolean;
  fileNamePrefix: string;
  onReset: () => void;
  resetLabel?: string;
}

export default function DocumentEditor({
  document: generatedDocument,
  onChange,
  isHighRisk,
  fileNamePrefix,
  onReset,
  resetLabel = 'Start Over',
}: DocumentEditorProps) {
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const updateTitle = (value: string) => onChange({ ...generatedDocument, title: value });
  const updateIntro = (value: string) => onChange({ ...generatedDocument, intro: value });
  const updateSectionHeading = (i: number, value: string) => {
    const sections = [...generatedDocument.sections];
    sections[i] = { ...sections[i], heading: value };
    onChange({ ...generatedDocument, sections });
  };
  const updateSectionBody = (i: number, value: string) => {
    const sections = [...generatedDocument.sections];
    sections[i] = { ...sections[i], body: value };
    onChange({ ...generatedDocument, sections });
  };

  const downloadPdf = () => {
    setDownloading('pdf');
    // Print CSS (below) hides everything except #doc-print-area.
    setTimeout(() => {
      window.print();
      setDownloading(null);
    }, 50);
  };

  const downloadDocx = async () => {
    setDownloading('docx');
    try {
      await downloadDocxFile(generatedDocument, fileNamePrefix);
    } catch (err) {
      console.error(err);
      setError('Could not build the Word file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <DocumentPrintStyles />

      {error && <p className="text-sm text-red-500 no-print">{error}</p>}

      <p className="text-xs text-muted-foreground no-print">
        Click any text in the document below to edit it before downloading.
      </p>

      {isHighRisk && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg px-4 py-3 text-sm no-print">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>This document type carries meaningful legal and financial risk (e.g. repossession or consumer-protection terms). Have it reviewed by a local attorney before you sign or rely on it.</span>
        </div>
      )}

      {/* A4 document preview / editor — always rendered as white paper regardless of site theme */}
      <div
        id="doc-print-area"
        ref={printAreaRef}
        className="bg-white text-black mx-auto max-w-[210mm] shadow-lg rounded-sm p-[15mm] sm:p-[20mm]"
      >
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={e => updateTitle(e.currentTarget.textContent || '')}
          className="text-xl sm:text-2xl font-bold text-center mb-6 outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
        >
          {generatedDocument.title}
        </h2>

        {generatedDocument.intro && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={e => updateIntro(e.currentTarget.textContent || '')}
            className="text-sm leading-relaxed mb-6 outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
          >
            {generatedDocument.intro}
          </p>
        )}

        {generatedDocument.sections.map((section, i) => (
          <div key={i} className="mb-5">
            <h3
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateSectionHeading(i, e.currentTarget.textContent || '')}
              className="text-sm font-bold mb-1.5 outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
            >
              {section.heading}
            </h3>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateSectionBody(i, e.currentTarget.innerText || '')}
              className="text-sm leading-relaxed whitespace-pre-wrap outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
            >
              {section.body}
            </div>
          </div>
        ))}

        <div className="mt-10 pt-6 border-t border-gray-300">
          <p className="text-sm font-bold mb-6">SIGNATURES</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {generatedDocument.signatures.map((sig, i) => (
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

      {/* Fixed bottom action bar — stays put while the document scrolls */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
          >
            {resetLabel}
          </button>
          <button
            onClick={downloadPdf}
            disabled={!!downloading}
            className="flex-1 flex items-center justify-center gap-1 border border-border bg-card hover:bg-muted disabled:opacity-50 text-foreground text-sm font-semibold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
          >
            {downloading === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>PDF</span>
          </button>
          <button
            onClick={downloadDocx}
            disabled={!!downloading}
            className="flex-1 flex items-center justify-center gap-1 border border-border bg-card hover:bg-muted disabled:opacity-50 text-foreground text-sm font-semibold rounded-lg py-3 px-1 transition-colors whitespace-nowrap"
          >
            {downloading === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Word Docx</span>
          </button>
        </div>
      </div>
    </div>
  );
}

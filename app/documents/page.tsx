import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, FileCheck2 } from 'lucide-react';
import { getAllPublishedTemplates } from '@/lib/document-templates-data';
import DocumentsIndexClient from '@/components/documents/DocumentsIndexClient';

export const revalidate = 0;
// TEMPORARY: see the matching note in app/documents/[type]/[country]/page.tsx
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Free Document Templates | JobMeter',
  description: 'Free, ready-to-use document templates by country — offer letters, agreements, affidavits, and more. Fill in your details and download as PDF or Word.',
  alternates: { canonical: 'https://www.jobmeter.app/documents' },
};

export default async function DocumentsIndexPage() {
  const templates = await getAllPublishedTemplates();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6 space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" />Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Document Templates</span>
        </nav>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileCheck2 className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Free · No Sign-Up</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Document Templates</h1>
          <p className="text-muted-foreground leading-relaxed">
            Ready-made, country-specific document templates. Fill in your details and download as PDF or Word — instantly, no AI wait. Need a document that isn't listed here yet?{' '}
            <Link href="/tools/document-generator" className="text-blue-500 hover:underline">Try the AI Document Generator</Link> instead.
          </p>
        </div>

        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No templates published yet — check back soon.</p>
        ) : (
          <DocumentsIndexClient templates={templates} />
        )}
      </div>
    </div>
  );
}


import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import DocumentGeneratorClient from './client';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

export const metadata: Metadata = {
  title: 'AI Document Generator — Contracts, Agreements & More | JobMeter',
  description: 'Generate a jurisdiction-correct employment offer letter, contract, agreement, power of attorney, and more — free, AI-drafted, with legal requirements researched for your country. Edit, then download as PDF or Word.',
  alternates: { canonical: 'https://www.jobmeter.app/tools/document-generator' },
  openGraph: {
    title: 'AI Document Generator | JobMeter',
    description: 'Pick a document type and country. Our AI researches the real legal requirements for your jurisdiction and drafts a complete, formatted document — free, no login.',
    url: 'https://www.jobmeter.app/tools/document-generator',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.jobmeter.app/tools/document-generator',
      name: 'AI Document Generator',
      description: 'Free AI-powered document generator. Researches jurisdiction-specific legal requirements and drafts a complete, formatted document ready to edit and download.',
      url: 'https://www.jobmeter.app/tools/document-generator',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
          { '@type': 'ListItem', position: 3, name: 'Document Generator', item: 'https://www.jobmeter.app/tools/document-generator' },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is this a real legal document?',
          acceptedAnswer: { '@type': 'Answer', text: 'The generator drafts a document based on researched legal requirements for your chosen country, but it is informational only and not legal advice. For high-value or high-risk agreements, have it reviewed by a local attorney before you rely on it.' },
        },
        {
          '@type': 'Question',
          name: 'Is my document saved on your servers?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. The document you generate, and any edits you make, stay only in your own browser. We never store your name, deal details, or the finished document on our servers.' },
        },
        {
          '@type': 'Question',
          name: 'What formats can I download?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can download your finished document as a PDF or as a Word (.docx) file, fully formatted with headings and signature blocks.' },
        },
        {
          '@type': 'Question',
          name: 'Is this free?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Completely free, no login required.' },
        },
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AI Document Generator — JobMeter',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description: 'Free AI-powered document generator with jurisdiction-specific legal research.',
      url: 'https://www.jobmeter.app/tools/document-generator',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'NGN' },
    },
  ],
};

export default function DocumentGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <DocumentGeneratorClient />

      <RelatedToolsStrip />

      {/* ── SEO content — server-rendered ── */}
      <div className="bg-muted/30 border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 space-y-14">

          <div className="max-w-screen-lg space-y-10 text-sm text-muted-foreground leading-relaxed">

            <div>
              <h2 className="text-2xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
                What Is the AI Document Generator?
              </h2>
              <p className="mb-3">Employment, tenancy, and everyday personal or business agreements almost always need paperwork — and the paperwork that actually holds up depends entirely on where you are. An offer letter that&apos;s perfectly valid in one country can be missing a mandatory disclosure, a witness signature, or a notarization requirement in another. This tool covers a growing range of document types across 160 countries, and instead of handing you a generic Western template with the country name swapped in, it researches the actual legal requirements for your chosen document and jurisdiction before drafting anything.</p>
              <p>Some documents (marked as templates) use a carefully structured, jurisdiction-adapted format. Others — typically the more nuanced agreements, like installment payment plans or multi-party addendums — are fully AI-drafted around your specific details after the legal research step runs. Either way, you end up with a complete, formatted document, not a fill-in-the-blank shell.</p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
                How It Works
              </h2>
              <div className="space-y-3">
                <p><strong className="text-foreground">1. Choose a document type and country.</strong> From an employment offer letter to a power of attorney to a lease agreement, pick what you need and where it applies.</p>
                <p><strong className="text-foreground">2. The AI researches your jurisdiction.</strong> Before drafting anything, it works out what your country actually requires — mandatory clauses, required disclosures, whether notarization or a witness is needed, and any formatting conventions specific to that jurisdiction.</p>
                <p><strong className="text-foreground">3. Fill in your details.</strong> Enter the names, dates, and terms involved, or use placeholders if you just want to see the structure first.</p>
                <p><strong className="text-foreground">4. Edit, then download.</strong> Review the generated document, make any edits directly in the browser, and download it as a PDF or Word (.docx) file — fully formatted with headings and signature blocks.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
                Documents You Can Generate
              </h2>
              <p className="mb-4">Document types are organized by category, with new ones added over time:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Employment', items: 'Employment offer letter, employment contract, resignation letter, termination letter, non-disclosure agreement' },
                  { title: 'Tenancy & Property', items: 'Residential lease agreement, tenancy agreement, rent receipt, notice to vacate' },
                  { title: 'Agreements & Contracts', items: 'Service agreement, freelance contract, partnership agreement, loan agreement' },
                  { title: 'Personal & Legal', items: 'Power of attorney, affidavit, consent letter, sworn declaration' },
                ].map(({ title, items }) => (
                  <div key={title} className="bg-card border border-border rounded-xl p-4">
                    <p className="font-bold text-foreground text-sm mb-1.5">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{items}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
                Why Jurisdiction Actually Matters
              </h2>
              <p className="mb-3">A generic template downloaded from a random website usually assumes one country&apos;s rules and quietly applies them everywhere. That can mean missing a notarization requirement that makes the document unenforceable, skipping a disclosure your jurisdiction legally requires, or using a witness format a local authority won&apos;t accept. Because this tool researches the specific country you select before drafting, those requirements get built in rather than left for you to discover after the fact.</p>
              <p>That said, this is informational drafting, not legal advice. For high-value agreements or anything with unusual risk — a large loan, a cross-border arrangement, a business-level contract — it&apos;s worth having the finished document reviewed by a local attorney before you rely on it.</p>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
                Your Details Stay in Your Browser
              </h2>
              <p className="mb-3">Nothing you type into this tool — names, dates, terms, the finished document itself — is stored on our servers. Everything, including your document history if you generate more than one, lives only in your own browser&apos;s local storage. That means you can safely draft a document involving real names and real deal terms without worrying about where that information ends up, and it also means clearing your browser data will clear your saved history, so download anything you want to keep.</p>
            </div>

          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
              Document Generator FAQ
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[
                { q: 'Is this a real legal document?', a: 'The generator drafts a document based on researched legal requirements for your chosen country, but it\'s informational only, not legal advice. For high-value or high-risk agreements, have it reviewed by a local attorney before you rely on it.' },
                { q: 'Is my document saved on your servers?', a: 'No. The document you generate, and any edits you make, stay only in your own browser. We never store your name, deal details, or the finished document on our servers.' },
                { q: 'What formats can I download?', a: 'PDF or Word (.docx), fully formatted with headings and signature blocks.' },
                { q: 'Is this free?', a: 'Yes — completely free, no login required.' },
                { q: 'How many document types and countries are supported?', a: 'A growing range of document types, for 160 countries — from employment offer letters and leases to powers of attorney and affidavits.' },
                { q: 'What\'s the difference between a template and an AI-drafted document?', a: 'Template documents use a structured, jurisdiction-adapted format for straightforward cases. AI-drafted documents are fully generated around your specific details after the legal research step — used for more nuanced agreements like installment plans or cross-border sale addendums.' },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none gap-3">
                    <span className="text-sm font-semibold text-foreground">{q}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4"><p className="text-sm text-muted-foreground leading-relaxed">{a}</p></div>
                </details>
              ))}
            </div>
          </div>

          {/* Related tools */}
          <section>
            <h2 className="text-xl font-black uppercase text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif" }}>
              More Free Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: '/documents', label: 'Free Document Templates', color: 'blue' },
                { href: '/tools/ats-review', label: 'ATS CV Review', color: 'violet' },
                { href: '/tools/career', label: 'Career Coach', color: 'emerald' },
              ].map(({ href, label, color }) => (
                <Link key={href} href={href} className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-200 dark:border-${color}-500/20 hover:bg-${color}-100 dark:hover:bg-${color}-500/20 transition-all`}>
                  <p className={`text-sm font-bold text-${color}-700 dark:text-${color}-400`}>{label}</p>
                  <ChevronRight className={`h-4 w-4 text-${color}-500`} />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

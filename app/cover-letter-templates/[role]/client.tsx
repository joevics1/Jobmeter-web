'use client';

// app/cover-letter-templates/[role]/client.tsx
// Shows the sample TEMPLATE letter first (the page's own written content),
// then SEO copy, then a static 3-button bottom action bar
// (Quick Create | Edit | Clear). Quick Create opens the onboarding modal
// if signed out instead of navigating anywhere — same pattern as CV
// templates, and functionally restricts Quick Create to signed-in users
// since it never proceeds to /build without a userId.
//
// Country is omitted from the URL/UI for now — see lib/cover-letter-template-pages/data.ts.

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CoverLetterRolePage } from '@/lib/cover-letter-template-pages/data';
import { COVER_LETTER_PAGE_DESIGNS } from '@/lib/cover-letter-template-pages/design-list';
import { renderCoverLetterTemplate } from '@/lib/cover-letter-template-pages/cover-letter-renderer';
import { useCoverLetterOverflowCheck } from '@/lib/cover-letter-template-pages/use-cover-letter-overflow';
import { supabase } from '@/lib/supabase';
import BackButton from '../_components/back-button';
import CoverLetterPreviewFrame from '../_components/cover-letter-preview-frame';
import CoverLetterOnboardingModal from '../_components/cover-letter-onboarding-modal';
import BlogMarkdownRenderer from '@/components/BlogMarkdownRenderer';

export default function RolePageClient({ page }: { page: CoverLetterRolePage }) {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = useState(COVER_LETTER_PAGE_DESIGNS[0]?.id ?? 'cl-template-1');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });
  }, []);

  const { previewFrameRef, isOverflowing, checkOverflow } = useCoverLetterOverflowCheck();

  const previewHtml = useMemo(() => {
    if (!page.preview_cover_letter_data) return null;
    return renderCoverLetterTemplate(selectedDesign, page.preview_cover_letter_data);
  }, [selectedDesign, page.preview_cover_letter_data]);

  const base = `/cover-letter-templates/build?role=${encodeURIComponent(page.role_slug)}`;

  return (
    <>
      <BackButton title={page.role_label} href="/cover-letter-templates" />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span>{page.role_label}</span>
          <Link href="/cover-letter-templates/history" className="text-blue-600 font-medium">Cover Letter History</Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {page.role_label} Cover Letter Template
        </h1>

        {page.seo_intro && <p className="text-lg text-foreground mb-6">{page.seo_intro}</p>}

        {previewHtml && (
          <section className="mb-10">
            {/* Horizontally scrolling design switcher */}
            <div className="flex gap-2 mb-4 overflow-x-auto flex-nowrap pb-1 -mx-1 px-1">
              {COVER_LETTER_PAGE_DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesign(d.id)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${
                    selectedDesign === d.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-card text-foreground border-border'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-muted">
              <CoverLetterPreviewFrame
                ref={previewFrameRef}
                title={`${page.role_label} cover letter template — ${selectedDesign}`}
                html={previewHtml}
                onLoad={checkOverflow}
              />
            </div>
            {isOverflowing && process.env.NODE_ENV !== 'production' && (
              <p className="text-xs text-amber-600 mt-1">
                Dev note: this sample letter overflows one page for the "{selectedDesign}" design — worth trimming the seed content.
              </p>
            )}
          </section>
        )}

        {page.seo_content && (
          <article className="mb-10">
            <BlogMarkdownRenderer content={page.seo_content} />
          </article>
        )}

        {page.faqs?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((f, i) => (
                <div key={i}>
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="text-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-24 pt-8 border-t border-border">
          <h2 className="text-lg font-bold mb-4">Next Steps</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href={`/jobs?search=${encodeURIComponent(page.role_label)}`}
              className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {page.role_label} jobs
            </Link>
            <Link href="/cv-templates" className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              Build a matching CV
            </Link>
            <Link href="/tools/interview" className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              Practice interview questions
            </Link>
            <Link href="/cover-letter-templates" className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              Browse all cover letter templates
            </Link>
            <Link href="/blog" className="px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              Career advice
            </Link>
          </div>
        </section>
      </main>

      {/* Static action bar — fixed to bottom. Quick Create is functionally
          restricted to signed-in users: it never navigates to /build
          without a userId, it opens the sign-in modal instead. */}
      <div data-app-bottom-bar="true" className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {!authChecked ? (
            <div className="h-11" />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => userId ? router.push(`${base}&start=quick`) : setAuthModalOpen(true)}
                type="button"
                className="text-center bg-blue-600 text-white rounded-lg py-2.5 px-2 text-sm font-semibold"
              >
                Quick Create
              </button>
              <Link href={`${base}&start=sample`} className="text-center border border-blue-600 text-blue-600 rounded-lg py-2.5 px-2 text-sm font-semibold">
                Edit
              </Link>
              <Link href={`${base}&start=blank`} className="text-center border border-border rounded-lg py-2.5 px-2 text-sm font-semibold text-foreground">
                Clear
              </Link>
            </div>
          )}
        </div>
      </div>
      <CoverLetterOnboardingModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

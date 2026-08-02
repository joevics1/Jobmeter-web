'use client';

// app/cv-templates/[role]/[country]/client.tsx
// SEO copy + horizontally-scrolling design preview + a static bottom action
// bar that goes straight into the form (2 buttons signed-out, 3 signed-in).
// No generic "Build your CV" CTA — the entry points ARE the action bar.

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ContentRolePage } from '@/lib/cv-template-pages/data';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { supabase } from '@/lib/supabase';
import BackButton from '../../_components/back-button';

export default function RolePageClient({ page }: { page: ContentRolePage }) {
  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });
  }, []);

  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  function checkOverflow() {
    try {
      const doc = previewFrameRef.current?.contentDocument;
      const content = doc?.querySelector('.content') as HTMLElement | null;
      if (!content) { setIsOverflowing(false); return; }
      const match = content.style.transform.match(/scale\(([\d.]+)\)/);
      if (match) {
        setIsOverflowing(parseFloat(match[1]) < 0.82);
      } else {
        setIsOverflowing(content.scrollHeight > content.clientHeight + 3);
      }
    } catch {
      setIsOverflowing(false);
    }
  }

  const previewHtml = useMemo(() => {
    if (!page.preview_cv_data) return null;
    return renderCVTemplate(selectedDesign, page.preview_cv_data, 'view');
  }, [selectedDesign, page.preview_cv_data]);

  const base = `/cv-templates/build?role=${encodeURIComponent(page.role_slug)}&country=${encodeURIComponent(page.country_code)}`;
  const loginRedirect = `/auth/login?redirect=${encodeURIComponent(base)}`;

  return (
    <>
      <BackButton title={`${page.role_label} — ${page.country_label}`} href="/cv-templates" />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>{page.role_label} / {page.country_label}</span>
          <Link href="/cv-templates/history" className="text-blue-700 font-medium">CV History</Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {page.role_label} CV Template for {page.country_label}
        </h1>

        {page.seo_intro && <p className="text-lg text-gray-700 mb-6">{page.seo_intro}</p>}

        {previewHtml && (
          <section className="mb-10">
            {/* Horizontally scrolling design switcher — mobile and desktop */}
            <div className="flex gap-2 mb-4 overflow-x-auto flex-nowrap pb-1 -mx-1 px-1">
              {CV_PAGE_DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesign(d.id)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${
                    selectedDesign === d.id
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
              <iframe
                ref={previewFrameRef}
                title={`${page.role_label} CV preview — ${selectedDesign}`}
                srcDoc={previewHtml}
                onLoad={() => {
                  checkOverflow();
                  // This is our own seed content, not user-editable — surface
                  // it to us in dev console rather than to the visitor.
                }}
                className="w-full"
                style={{ height: '900px', border: 'none' }}
              />
            </div>
            {isOverflowing && process.env.NODE_ENV !== 'production' && (
              <p className="text-xs text-amber-600 mt-1">
                Dev note: this sample CV needed heavy shrinking to fit one page for the "{selectedDesign}" design — worth trimming the seed content.
              </p>
            )}
          </section>
        )}

        {page.seo_content && (
          <article className="prose max-w-none mb-10 whitespace-pre-line">
            {page.seo_content}
          </article>
        )}

        {page.faqs?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((f, i) => (
                <div key={i}>
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="text-gray-700">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Static action bar — fixed to bottom on mobile and desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {!authChecked ? (
            <div className="h-11" />
          ) : userId ? (
            <div className="grid grid-cols-3 gap-2">
              <Link href={`${base}&start=quick`} className="text-center bg-blue-700 text-white rounded-lg py-2.5 px-2 text-sm font-semibold">
                Quick Create
              </Link>
              <Link href={`${base}&start=fetch`} className="text-center border border-blue-700 text-blue-700 rounded-lg py-2.5 px-2 text-sm font-semibold">
                Edit
              </Link>
              <Link href={`${base}&start=blank`} className="text-center border rounded-lg py-2.5 px-2 text-sm font-semibold text-gray-700">
                Clear
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 text-center mb-1.5">
                <Link href={loginRedirect} className="text-blue-700 font-medium">Log in</Link> for Quick Create &amp; Edit
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`${base}&start=sample`} className="text-center bg-blue-700 text-white rounded-lg py-2.5 px-2 text-sm font-semibold">
                  Edit
                </Link>
                <Link href={`${base}&start=blank`} className="text-center border rounded-lg py-2.5 px-2 text-sm font-semibold text-gray-700">
                  Clear
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

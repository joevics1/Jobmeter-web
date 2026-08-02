'use client';

// app/cv-templates/[role]/[country]/client.tsx
// SEO copy + horizontally-scrolling design preview + a static bottom action
// bar that goes straight into the form (2 buttons signed-out, 3 signed-in).
// No generic "Build your CV" CTA — the entry points ARE the action bar.

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { ContentRolePage } from '@/lib/cv-template-pages/data';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { supabase } from '@/lib/supabase';

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

  const previewHtml = useMemo(() => {
    if (!page.preview_cv_data) return null;
    return renderCVTemplate(selectedDesign, page.preview_cv_data, 'view');
  }, [selectedDesign, page.preview_cv_data]);

  const base = `/cv-templates/build?role=${encodeURIComponent(page.role_slug)}&country=${encodeURIComponent(page.country_code)}`;
  const loginRedirect = `/auth/login?redirect=${encodeURIComponent(base)}`;

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-10 pb-28">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/cv-templates">CV Templates</Link> / {page.role_label} / {page.country_label}
        </nav>

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
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
              <iframe
                title={`${page.role_label} CV preview — ${selectedDesign}`}
                srcDoc={previewHtml}
                className="w-full"
                style={{ height: '900px', border: 'none' }}
              />
            </div>
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
              <Link href={`${base}&start=quick`} className="text-center bg-purple-700 text-white rounded-lg py-2.5 px-2 text-sm font-semibold">
                Quick Create
              </Link>
              <Link href={`${base}&start=fetch`} className="text-center border border-purple-700 text-purple-700 rounded-lg py-2.5 px-2 text-sm font-semibold">
                Fetch My Details
              </Link>
              <Link href={`${base}&start=blank`} className="text-center border rounded-lg py-2.5 px-2 text-sm font-semibold text-gray-700">
                Fill Out Form
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 text-center mb-1.5">
                <Link href={loginRedirect} className="text-purple-700 font-medium">Log in</Link> for Quick Create &amp; Fetch My Details
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`${base}&start=sample`} className="text-center bg-purple-700 text-white rounded-lg py-2.5 px-2 text-sm font-semibold">
                  Edit Sample Document
                </Link>
                <Link href={`${base}&start=blank`} className="text-center border rounded-lg py-2.5 px-2 text-sm font-semibold text-gray-700">
                  Empty Form
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

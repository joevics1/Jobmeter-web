'use client';

// app/cv-templates/[role]/[country]/client.tsx
// Renders SEO copy + a switchable design preview using the isolated
// cv-template-pages renderer. The "Build your CV" CTA hands off to the
// existing /cv/create builder via query params — it does not call into
// that builder's code directly.

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ContentRolePage } from '@/lib/cv-template-pages/data';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';

export default function RolePageClient({ page }: { page: ContentRolePage }) {
  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');

  const previewHtml = useMemo(() => {
    if (!page.preview_cv_data) return null;
    return renderCVTemplate(selectedDesign, page.preview_cv_data, 'view');
  }, [selectedDesign, page.preview_cv_data]);

  const buildHref = `/cv-templates/build?role=${encodeURIComponent(page.role_slug)}&country=${encodeURIComponent(page.country_code)}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/cv-templates">CV Templates</Link> / {page.role_label} / {page.country_label}
      </nav>

      <h1 className="text-3xl font-bold mb-4">
        {page.role_label} CV Template for {page.country_label}
      </h1>

      {page.seo_intro && <p className="text-lg text-gray-700 mb-6">{page.seo_intro}</p>}

      <div className="mb-8">
        <Link
          href={buildHref}
          className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Build your {page.role_label} CV
        </Link>
      </div>

      {previewHtml && (
        <section className="mb-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            {CV_PAGE_DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDesign(d.id)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
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
  );
}

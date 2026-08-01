// app/cv-templates/[role]/[country]/page.tsx
// New, isolated route for the CV Templates SEO pages. Only depends on
// lib/cv-template-pages/* (fresh table + copied types/renderer) — does not
// touch or import the existing /cv/create builder code.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRolePage, getAllPublishedRolePageParams } from '@/lib/cv-template-pages/data';
import RolePageClient from './client';

export async function generateStaticParams() {
  return getAllPublishedRolePageParams('cv');
}

// Skip ISR caching while pages are actively being added/reviewed.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: { role: string; country: string } }
): Promise<Metadata> {
  const page = await getRolePage('cv', params.role, params.country);
  if (!page) return { title: 'Not Found' };

  const title = page.meta_title || `${page.role_label} CV Template for ${page.country_label} (Free) | JobMeter`;
  const description =
    page.meta_description ||
    `Free ${page.role_label} CV template for ${page.country_label}. Fill in your details, switch designs, and download — no sign-up required.`;
  const url = `https://jobmeter.app/cv-templates/${params.role}/${params.country}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function buildSchema(page: NonNullable<Awaited<ReturnType<typeof getRolePage>>>, url: string) {
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url,
      name: `${page.role_label} CV Template for ${page.country_label}`,
      url,
      isPartOf: { '@type': 'WebSite', name: 'JobMeter', url: 'https://jobmeter.app' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
        { '@type': 'ListItem', position: 2, name: 'CV Templates', item: 'https://jobmeter.app/cv-templates' },
        { '@type': 'ListItem', position: 3, name: `${page.role_label} — ${page.country_label}`, item: url },
      ],
    },
  ];

  if (page.faqs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return schemas;
}

export default async function CVRolePage(
  { params }: { params: { role: string; country: string } }
) {
  const page = await getRolePage('cv', params.role, params.country);
  if (!page) notFound();

  const url = `https://jobmeter.app/cv-templates/${params.role}/${params.country}`;
  const schemas = buildSchema(page, url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <RolePageClient page={page} />
    </>
  );
}

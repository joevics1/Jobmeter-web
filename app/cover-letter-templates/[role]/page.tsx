// app/cover-letter-templates/[role]/page.tsx
// New, isolated route for the Cover Letter Templates SEO pages. Only
// depends on lib/cover-letter-template-pages/* — does not touch or import
// the CV templates code or any existing CV/cover-letter builder code.
//
// Country is omitted from the URL for now — see lib/cover-letter-template-pages/data.ts.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCoverLetterRolePage, getAllPublishedCoverLetterRolePageParams } from '@/lib/cover-letter-template-pages/data';
import RolePageClient from './client';

export async function generateStaticParams() {
  return getAllPublishedCoverLetterRolePageParams();
}

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: { role: string } }
): Promise<Metadata> {
  const page = await getCoverLetterRolePage(params.role);
  if (!page) return { title: 'Not Found' };

  const title = page.meta_title || `${page.role_label} Cover Letter Template (Free) | JobMeter`;
  const description =
    page.meta_description ||
    `Free ${page.role_label} cover letter template. Quick Create it with your own details, edit it, and download — no sign-up required to start.`;
  const url = `https://jobmeter.app/cover-letter-templates/${params.role}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function buildSchema(page: NonNullable<Awaited<ReturnType<typeof getCoverLetterRolePage>>>, url: string) {
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url,
      name: `${page.role_label} Cover Letter Template`,
      url,
      isPartOf: { '@type': 'WebSite', name: 'JobMeter', url: 'https://jobmeter.app' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
        { '@type': 'ListItem', position: 2, name: 'Cover Letter Templates', item: 'https://jobmeter.app/cover-letter-templates' },
        { '@type': 'ListItem', position: 3, name: page.role_label, item: url },
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

export default async function CoverLetterRolePage(
  { params }: { params: { role: string } }
) {
  const page = await getCoverLetterRolePage(params.role);
  if (!page) notFound();

  const url = `https://jobmeter.app/cover-letter-templates/${params.role}`;
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

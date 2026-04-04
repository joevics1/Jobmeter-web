import JobList from '@/components/jobs/JobList';
import { Metadata } from 'next';

export const revalidate = 1800; // matches Redis CACHE_TTL — revalidates every 30 min

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

export const metadata: Metadata = {
  title: 'Find Jobs Near You — Search & Apply for Open Positions | JobMeter',
  description: 'Search thousands of jobs from verified employers across Nigeria, UK, US, Canada, UAE and more. Filter by location, role, salary and experience level. Updated daily.',
  keywords: ['find jobs', 'job search', 'job listings', 'vacancies', 'employment', 'hiring', 'career opportunities', 'job board'],
  openGraph: {
    title: 'Find Jobs Near You | JobMeter',
    description: 'Search thousands of jobs from verified employers. Free job search tool.',
    type: 'website',
    url: `${siteUrl}/jobs`,
    siteName: 'JobMeter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Jobs Near You | JobMeter',
    description: 'Search thousands of jobs from verified employers. Free job search tool.',
  },
  alternates: {
    canonical: `${siteUrl}/jobs`,
  },
};

async function getJobs(): Promise<any[]> {
  try {
    const res = await fetch(`${siteUrl}/api/jobs`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const { jobs } = await res.json();
    return Array.isArray(jobs) ? jobs : [];
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  // ── JSON-LD: ItemList of top 20 jobs for Google ───────────────────────────
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Job Openings | JobMeter',
    description: 'Browse the latest verified job listings across Nigeria, UK, US, Canada, UAE and more.',
    url: `${siteUrl}/jobs`,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 20).map((job: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/jobs/${job.slug || job.id}`,
      name: job.title || 'Job Opening',
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <JobList initialJobs={jobs} />
    </>
  );
}
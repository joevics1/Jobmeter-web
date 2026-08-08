import { notFound } from 'next/navigation';
import { mapJobToSchema } from '@/lib/mapJobToSchema';
import JobClient from './JobClient';
import JobList from '@/components/jobs/JobList';
import { Metadata } from 'next';
import { cache } from 'react';
import { getAllPublishedTemplateParams } from '@/lib/document-templates-data';
import { getDocumentType, getDocumentCountry } from '@/lib/document-types';
import { getRolePage } from '@/lib/cv-template-pages/data';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const COMPANIES_URL = 'https://jobs-api.joevicspro.workers.dev/companies';

const JOBS_TABLE = 'jobs'; // was jobs_nigeria mirror - doesn't carry apply_in_app/screening columns

// ─── Parse segments into { country, slug } ───────────────────────────────────
// /jobs                        → segments = undefined
// /jobs/some-slug              → segments = ['some-slug']
// /jobs/nigeria/some-slug      → segments = ['nigeria', 'some-slug']
function parseSegments(segments: string[] | undefined): {
  country: string | null;
  slug: string | null;
} {
  if (!segments || segments.length === 0) return { country: null, slug: null };
  if (segments.length === 1) return { country: null, slug: segments[0] };
  return {
    country: segments.slice(0, -1).join('/'),
    slug: segments[segments.length - 1],
  };
}

// ─── Helper: derive a URL-safe country slug from a job record ─────────────────
function getJobCountrySlug(job: any): string {
  const countryArr: string[] = Array.isArray(job.country) ? job.country : [];
  const first = countryArr.find((c) => c.toLowerCase() !== 'global');
  if (first) {
    return first.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (job.location && typeof job.location === 'object') {
    const c = job.location.country || job.location.countries?.[0];
    if (c && c.toLowerCase() !== 'global') {
      return c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
  }
  return 'global';
}

// ─── Country-aware cross-links (documents + CV templates) ─────────────────────
// Maps the country slugs produced by getJobCountrySlug() to the ISO codes the
// /documents/[type]/[country] route and DOCUMENT_COUNTRIES list use. Only
// needs to cover countries JobMeter actually has job listings for.
const JOB_COUNTRY_TO_DOC_CODE: Record<string, string> = {
  nigeria: 'ng',
  uae: 'ae',
  'united-arab-emirates': 'ae',
  'saudi-arabia': 'sa',
  saudiarabia: 'sa',
  qatar: 'qa',
  kuwait: 'kw',
  bahrain: 'bh',
  oman: 'om',
  ghana: 'gh',
  kenya: 'ke',
  'south-africa': 'za',
  uk: 'gb',
  'united-kingdom': 'gb',
  usa: 'us',
  'united-states': 'us',
  canada: 'ca',
  egypt: 'eg',
};

export type DocumentLink = { type: string; country: string; label: string };

// Up to 3 document templates relevant to the job's country, so the sidebar
// can point at real, existing /documents/[type]/[country] pages instead of
// only the generic /documents index.
const getMatchingDocuments = cache(async (countrySlug: string): Promise<{ links: DocumentLink[]; countryLabel: string | null }> => {
  const docCode = JOB_COUNTRY_TO_DOC_CODE[countrySlug];
  if (!docCode) return { links: [], countryLabel: null };

  try {
    const allParams = await getAllPublishedTemplateParams();
    const matches = allParams.filter((p) => p.country === docCode);
    if (matches.length === 0) return { links: [], countryLabel: null };

    const links = matches.slice(0, 3).map((m) => ({
      type: m.type,
      country: m.country,
      label: getDocumentType(m.type)?.label || m.type.replace(/-/g, ' '),
    }));
    return { links, countryLabel: getDocumentCountry(docCode)?.name || null };
  } catch (error) {
    console.error('Error fetching matching document templates:', error);
    return { links: [], countryLabel: null };
  }
});

export type CvTemplateMatch = { slug: string; label: string };

// Finds a published CV template role page matching the job's title/role, so
// the sidebar can offer "Build a [Role] CV" instead of a generic CV link.
// Tries an exact role_slug match first, then falls back to a loose search on
// role_label. Returns null (not a guess) if nothing published actually
// matches — a missing widget is better than a link to a 404.
const getMatchingCvTemplate = cache(async (rawRole: string): Promise<CvTemplateMatch | null> => {
  const cleaned = rawRole
    .replace(/\bjobs?\b/gi, '')
    .trim()
    .toLowerCase();
  if (!cleaned) return null;

  const candidateSlug = cleaned.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!candidateSlug) return null;

  try {
    const exact = await getRolePage('cv', candidateSlug);
    if (exact) return { slug: exact.role_slug, label: exact.role_label };

    const firstWord = cleaned.split(/\s+/)[0];
    if (!firstWord || firstWord.length < 3) return null;

    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('content_role_pages')
      .select('role_slug, role_label')
      .eq('kind', 'cv')
      .eq('status', 'published')
      .ilike('role_label', `%${firstWord}%`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) return { slug: data.role_slug, label: data.role_label };
    return null;
  } catch (error) {
    console.error('Error matching CV template role:', error);
    return null;
  }
});

const getJob = cache(async (slug: string) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${JOBS_TABLE}?slug=eq.${slug}&select=*&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: false },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
});

const getCompanies = cache(async () => {
  try {
    const res = await fetch(COMPANIES_URL, { next: { revalidate: 604800 } });
    const data = await res.json();
    return data.companies || [];
  } catch (error) {
    console.error('Failed to fetch companies from Cloudflare:', error);
    return [];
  }
});

const getRelatedJobs = cache(async (currentJob: any) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString();

  const params = new URLSearchParams({
    select: 'id,title,company,location,country,category,slug,status,deadline,created_at',
    category: `eq.${currentJob.category}`,
    id: `neq.${currentJob.id}`,
    created_at: `gte.${dateStr}`,
    order: 'created_at.desc',
    limit: '30',
  });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${JOBS_TABLE}?${params.toString()}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: false },
    }
  );
  if (!res.ok) return [];

  const allJobs: any[] = await res.json();
  return allJobs.slice(0, 10);
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { segments?: string[] };
}): Promise<Metadata> {
  const { slug } = parseSegments(params.segments);

  // /jobs listing page
  if (!slug) {
    return {
      title: 'Find Jobs Near You — Search & Apply for Open Positions | JobMeter',
      description:
        'Search thousands of jobs from verified employers across Nigeria, UK, US, Canada, UAE and more. Filter by location, role, salary and experience level. Updated daily.',
      keywords: [
        'find jobs', 'job search', 'job listings', 'vacancies',
        'employment', 'hiring', 'career opportunities', 'job board',
      ],
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
      // The /jobs listing page is always indexable
      robots: { index: true, follow: true },
    };
  }

  // /jobs/[slug] or /jobs/[country]/[slug] — job detail page
  const job = await getJob(slug);
  if (!job) return { title: 'Job Not Found' };

  const companyName =
    typeof job.company === 'string' ? job.company : job.company?.name || 'Company';
  const titleCore = `${job.title} at ${companyName}`;
  const description = job.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

  const countrySlug = getJobCountrySlug(job);
  const canonicalUrl = `${siteUrl}/jobs/${countrySlug}/${job.slug || job.id}`;

  // ── Indexing strategy ──────────────────────────────────────────────────────
  // ALL job pages are indexed — including expired ones.
  // Expired pages still have value: they show related jobs and pass link equity.
  // The /jobs listing page and country paths reduce keyword overlap, so
  // cannibalization is not a concern here.
  // ──────────────────────────────────────────────────────────────────────────
  return {
    title: titleCore,
    description,
    openGraph: {
      title: titleCore,
      description,
      type: 'website',
      siteName: 'JobMeter',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleCore,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function JobPage({
  params,
}: {
  params: { segments?: string[] };
}) {
  const { slug } = parseSegments(params.segments);

  // /jobs — show the job listing page
  if (!slug) {
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <main className="min-h-screen bg-white">
          <JobList />
        </main>
      </>
    );
  }

  // /jobs/[slug] or /jobs/[country]/[slug] — show job detail
  const job = await getJob(slug);
  if (!job) notFound();

  const companies = await getCompanies();
  const relatedJobs = await getRelatedJobs(job);
  const schema = mapJobToSchema(job);

  const countrySlug = getJobCountrySlug(job);
  const [{ links: documentLinks, countryLabel: documentsCountryLabel }, cvTemplateMatch] = await Promise.all([
    getMatchingDocuments(countrySlug),
    getMatchingCvTemplate(job.role || job.title || ''),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <JobClient
        job={job}
        relatedJobs={relatedJobs}
        companies={companies}
        documentLinks={documentLinks}
        documentsCountryLabel={documentsCountryLabel}
        cvTemplateMatch={cvTemplateMatch}
      />
    </>
  );
}

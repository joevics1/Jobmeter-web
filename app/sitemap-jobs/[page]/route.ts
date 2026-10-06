import { createClient } from '@supabase/supabase-js';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';
const JOBS_TABLE = 'jobs'; // was jobs_nigeria mirror - doesn't carry apply_in_app/screening columns
const JOBS_PER_SITEMAP = 1000;

// Jobs created before this date keep their old /jobs/slug URL format.
// Jobs created on or after this date get the new /jobs/country/slug format.
const COUNTRY_URL_CUTOFF = '2026-05-30';

function buildJobUrl(job: { slug: string; country: string[] | null; created_at: string }): string {
  const isNew = job.created_at >= COUNTRY_URL_CUTOFF;
  if (isNew && Array.isArray(job.country) && job.country.length > 0) {
    const countrySlug = job.country[0]
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `${siteUrl}/jobs/${countrySlug}/${job.slug}`;
  }
  return `${siteUrl}/jobs/${job.slug}`;
}

/**
 * Paginated job sitemap — includes active, expired_indexed, and expired jobs.
 * Expired job pages still serve related jobs and should remain indexed.
 * Place at: app/sitemap-jobs/[page]/route.ts
 */
export async function GET(
  _request: Request,
  { params }: { params: { page: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not found');
      return new Response('Missing Supabase credentials', { status: 500 });
    }

    const page = parseInt(params.page, 10);
    if (isNaN(page) || page < 1) {
      return new Response('Invalid page number', { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const from = (page - 1) * JOBS_PER_SITEMAP;
    const to = from + JOBS_PER_SITEMAP - 1;

    const { data: jobs, error } = await supabase
      .from(JOBS_TABLE)
      .select('slug, updated_at, country, created_at, status')
      .in('status', ['active', 'expired_indexed', 'expired'])
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching jobs for sitemap page ${page}:`, error);
      return new Response('Error fetching jobs', { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      return new Response('Page not found', { status: 404 });
    }

    console.log(`📄 Job sitemap page ${page}: ${jobs.length} jobs (rows ${from}–${to})`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${jobs
  .map((job) => {
    // Active jobs get full priority; expired get slightly lower but still indexed
    const priority = job.status === 'active' ? '0.8' : '0.5';
    const changefreq = job.status === 'active' ? 'daily' : 'weekly';
    return `  <url>
    <loc>${buildJobUrl(job)}</loc>
    <lastmod>${job.updated_at ? new Date(job.updated_at).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating job sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}

export const revalidate = 86400;
        

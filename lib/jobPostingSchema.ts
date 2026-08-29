// Shared by the 7 job-finder tool pages (remote, entry-level,
// graduate-trainee, internship, nysc, accommodation, visa) to emit real
// JobPosting structured data server-side, so these pages are eligible for
// Google for Jobs rich results. Previously none of the finder pages emitted
// any JobPosting markup -- job listings only ever rendered client-side.

export type WorkerJob = {
  id: string;
  slug: string;
  title: string;
  role?: string;
  role_category?: string;
  sector?: string;
  category?: string;
  description?: string;
  company: { name: string; website?: string | null } | string;
  location?: { city?: string; country?: string; state?: string; remote?: boolean } | string;
  employment_type?: string;
  job_type?: string;
  experience_level?: string;
  accommodation_status?: string;
  visa_assistance?: string;
  posted_date?: string;
  created_at?: string;
  deadline?: string | null;
  status?: string | null;
  salary_range?: { min: number | null; max: number | null; currency?: string; period?: string } | null;
};

const WORKER_URL = 'https://jobs-api.joevicspro.workers.dev/jobs';

// Server-side fetch, used only to build structured data -- the visible job
// list on each page is still fetched and filtered client-side, unchanged.
// Failures here must never break the page, so this always resolves to an
// array (empty on any error).
export async function fetchWorkerJobsForSchema(): Promise<WorkerJob[]> {
  try {
    const res = await fetch(WORKER_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.jobs) ? data.jobs : [];
  } catch {
    return [];
  }
}

function companyName(job: WorkerJob): string {
  return typeof job.company === 'string' ? job.company : job.company?.name || 'Confidential';
}

function jobLocation(job: WorkerJob) {
  return typeof job.location === 'object' ? job.location : null;
}

function isRemoteJob(job: WorkerJob): boolean {
  return (job.job_type || '').toLowerCase() === 'remote' || jobLocation(job)?.remote === true;
}

// Builds one schema.org JobPosting object per job. Expired jobs are still
// included (with an accurate validThrough date) rather than dropped --
// Google automatically excludes postings whose validThrough has passed from
// rich results, which is the correct behavior; it's inaccurate/misleading
// to omit validThrough or fake a future date for a closed role.
export function jobPostingSchema(job: WorkerJob) {
  const loc = jobLocation(job);
  const posted = job.posted_date || job.created_at;
  const postedDate = posted ? new Date(posted) : null;
  const validThrough = job.deadline ? new Date(job.deadline) : null;
  const remote = isRemoteJob(job);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description:
      (job.description && job.description.trim()) ||
      `${job.title} at ${companyName(job)}${job.sector ? ` in the ${job.sector} sector` : ''}. View full details and apply on Jobmeter.`,
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName(job),
    },
    url: `https://www.jobmeter.app/jobs/${job.slug}`,
    identifier: {
      '@type': 'PropertyValue',
      name: companyName(job),
      value: job.id,
    },
  };

  if (postedDate && !isNaN(postedDate.getTime())) {
    schema.datePosted = postedDate.toISOString().split('T')[0];
  }
  if (validThrough && !isNaN(validThrough.getTime())) {
    schema.validThrough = validThrough.toISOString();
  }

  if (remote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: loc?.country || 'Worldwide',
    };
  }
  if (loc && (loc.city || loc.country)) {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: loc.city || undefined,
        addressRegion: loc.state || undefined,
        addressCountry: loc.country || undefined,
      },
    };
  }

  if (job.salary_range?.min && job.salary_range?.currency) {
    const period = (job.salary_range.period || '').toUpperCase();
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary_range.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_range.min,
        maxValue: job.salary_range.max ?? job.salary_range.min,
        unitText: period.includes('MONTH') ? 'MONTH' : period.includes('HOUR') ? 'HOUR' : 'YEAR',
      },
    };
  }

  if (job.employment_type) {
    schema.employmentType = job.employment_type.toUpperCase().replace(/[\s-]+/g, '_');
  }

  return schema;
}

// Caps how many JobPosting entries we emit per page. Keeps structured data
// roughly in parity with what a visitor actually sees on the first page of
// results (client pages default to ~20 per page), rather than dumping the
// entire matched set into the page head.
export const MAX_JOB_POSTINGS = 20;

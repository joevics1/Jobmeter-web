import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Building2, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import AdUnit from '@/components/ads/AdUnit';

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: 'Top Companies Hiring in Nigeria | Company Directory | JobMeter',
    description:
      'Explore top companies hiring in Nigeria. Discover company culture, benefits, open positions, and career opportunities from leading employers.',
    keywords: ['companies hiring nigeria', 'top employers', 'company directory', 'career opportunities', 'company profiles'],
    openGraph: {
      title: 'Top Companies Hiring in Nigeria | JobMeter',
      description: 'Explore top companies hiring in Nigeria. Discover company culture, benefits, and career opportunities.',
      type: 'website',
      url: 'https://jobmeter.app/company',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Top Companies Hiring in Nigeria | JobMeter',
      description: 'Explore top companies hiring in Nigeria. Discover company culture, benefits, and career opportunities.',
    },
    alternates: {
      canonical: 'https://jobmeter.app/company',
    },
  };
}

interface Company {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  industry: string | null;
  company_size: string | null;
  headquarters_location: string | null;
  is_verified: boolean;
  view_count: number;
  job_count: number;
}

async function getCompanies(search?: string, industry?: string): Promise<Company[]> {
  try {
    let query = supabase
      .from('companies')
      .select(
        'id, name, slug, tagline, logo_url, industry, company_size, headquarters_location, is_verified, view_count, job_count'
      )
      .eq('is_published', true);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (industry) {
      query = query.eq('industry', industry);
    }

    const { data, error } = await query
      .order('is_verified', { ascending: false })
      .order('job_count', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

async function getIndustries(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('industry')
      .eq('is_published', true)
      .not('industry', 'is', null);

    if (error || !data) return [];

    const unique = Array.from(new Set(data.map((c) => c.industry).filter(Boolean))) as string[];
    return unique.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
}

// Same forever-cache problem as the [slug] page -- match the sitemap's cadence
// so a company that gets unpublished actually disappears from the directory
// listing within an hour instead of staying cached indefinitely.
export const revalidate = 3600;

export default async function CompanyDirectoryPage({ searchParams }: Props) {
  const companyName = searchParams?.name;

  // Handle ?name= redirect
  if (companyName && typeof companyName === 'string') {
    const { data: company } = await supabase
      .from('companies')
      .select('slug')
      .ilike('name', companyName)
      .eq('is_published', true)
      .single();

    if (company) redirect(`/company/${company.slug}`);
  }

  const search = typeof searchParams?.q === 'string' ? searchParams.q.trim() : '';
  const industryFilter = typeof searchParams?.industry === 'string' ? searchParams.industry : '';
  const hasActiveFilter = Boolean(search || industryFilter);

  const [companies, industries] = await Promise.all([
    getCompanies(search || undefined, industryFilter || undefined),
    getIndustries(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Companies Hiring in Nigeria',
    description: 'Directory of top companies hiring in Nigeria',
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 10).map((company, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: company.name,
        url: `https://jobmeter.app/company/${company.slug}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50">

        {/* ── Header ── */}
        <div className="text-white" style={{ backgroundColor: '#2563EB' }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="mb-3 sm:mb-4">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Jobs</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Building2 size={24} />
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">Company Directory</h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl leading-relaxed">
              Discover top companies hiring in Nigeria. Explore company culture, benefits, and find your next career
              opportunity.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Building2 size={14} />
                {companies.length} companies
              </span>
            </div>
          </div>
        </div>

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-4">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Companies</span>
            </nav>
          </div>
        </div>

        {/* ── Display ad — top (slot 4198231153) ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2">
            <AdUnit slot="4198231153" format="auto" />
          </div>
        </div>

        {/* ── Search + filter ── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
            <form method="GET" action="/company" className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="Search companies by name..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="industry"
                defaultValue={industryFilter}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                Search
              </button>
              {hasActiveFilter && (
                <Link
                  href="/company"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap text-center"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>
        </div>

        {/* ── Employer CTA ── */}
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                  Are you an employer?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">Register your company to attract top talent.</p>
              </div>
              <Link
                href="/company/register"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap w-full sm:w-auto text-center"
              >
                Register Company
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main content + sidebar layout ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex gap-8 items-start">

            {/* ── Company list ── */}
            <div className="flex-1 min-w-0">
              {companies.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-12 text-center">
                  <Building2 size={36} className="sm:size-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {hasActiveFilter ? 'No companies match your search' : 'No companies available'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {hasActiveFilter
                      ? 'Try a different name or industry.'
                      : 'Check back soon for company profiles.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {companies.map((company, index) => (
                    <React.Fragment key={company.id}>
                      <Link
                        href={`/company/${company.slug}`}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          {company.logo_url ? (
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0">
                              <Image
                                src={company.logo_url}
                                alt={company.name}
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building2 size={24} className="sm:size-7 lg:size-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                                {company.name}
                              </h4>
                              {company.is_verified && (
                                <CheckCircle size={14} className="sm:size-4 lg:size-[18px] text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            {company.tagline && (
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{company.tagline}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                          <span className="text-xs sm:text-sm text-gray-600">
                            {company.job_count} {company.job_count === 1 ? 'job' : 'jobs'}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600 font-medium text-xs sm:text-sm">
                            <span className="hidden sm:inline">View</span>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>

                      {/* In-feed ad after every 9th company */}
                      {index % 9 === 8 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                          <AdUnit
                            slot="9025117620"
                            format="fluid"
                            layout="in-feed"
                            layoutKey="-fb+5w+4e-db+86"
                          />
                        </div>
                      )}

                      {/* In-article ad after every 18th company */}
                      {index % 18 === 17 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-lg p-2">
                          <AdUnit slot="4690286797" format="fluid" layout="in-article" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Middle display ad — below company list */}
              <div className="my-6">
                <AdUnit slot="9010641928" format="auto" />
              </div>

              {/* Second in-article ad — bottom of list */}
              <div className="my-6 bg-white rounded-lg p-2">
                <AdUnit
                  slot="8181708196"
                  format="fluid"
                  layout="in-article"
                />
              </div>
            </div>

            {/* ── Desktop sidebar ── */}
            <aside className="hidden lg:block w-[300px] flex-shrink-0">
              {/* Sticky sidebar ad — display top slot repurposed for sidebar */}
              <div className="sticky top-4 space-y-6">
                {/* Sidebar display ad 1 — middle display slot */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <p className="text-[10px] text-gray-400 text-center pt-1">Advertisement</p>
                  <AdUnit slot="9010641928" format="auto" />
                </div>

                {/* Sidebar in-feed ad */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <p className="text-[10px] text-gray-400 text-center pt-1">Advertisement</p>
                  <AdUnit
                    slot="9025117620"
                    format="fluid"
                    layout="in-feed"
                    layoutKey="-fb+5w+4e-db+86"
                  />
                </div>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </>
  );
}
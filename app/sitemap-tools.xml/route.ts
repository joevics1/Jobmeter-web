import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

const tools = [
  { slug: 'ats-review', name: 'ATS Resume Checker' },
  { slug: 'interview', name: 'AI Interview Practice' },
  { slug: 'scam-detector', name: 'Job Scam Detector' },
  { slug: 'scam-checker', name: 'Company Scam Checker' },
  { slug: 'paye-calculator', name: 'PAYE Calculator' },
  { slug: 'keyword-checker', name: 'Resume Keyword Checker' },
  { slug: 'role-finder', name: 'Job Role Finder' },
  { slug: 'career', name: 'Career Path Planner' },
  { slug: 'remote-jobs-finder', name: 'Remote Jobs Finder' },
  { slug: 'internship-finder', name: 'Internship Finder' },
  { slug: 'accommodation-finder', name: 'Accommodation Finder' },
  { slug: 'nysc-finder', name: 'NYSC Job Finder' },
  { slug: 'graduate-trainee-finder', name: 'Graduate Trainee Finder' },
  { slug: 'entry-level-finder', name: 'Entry Level Jobs Finder' },
  { slug: 'visa-finder', name: 'Visa Sponsorship Jobs Finder' },
  { slug: 'quiz', name: 'Company Quiz Platform' },
  { slug: 'job-offer-evaluator', name: 'Job Offer Evaluator' },
  { slug: 'profession-country-match', name: 'Profession Country Match' },
  { slug: 'certification-roadmap', name: 'Certification Roadmap' },
  { slug: 'education-equivalency-checker', name: 'Education Equivalency Checker' },
  { slug: 'ielts-checker', name: 'IELTS Checker' },
  { slug: 'saudi-profession-classifier', name: 'Saudi Profession Classifier' },
  { slug: 'noc-job-change-checker', name: 'NOC & Job Change Checker' },
  { slug: 'gcc-comparison', name: 'GCC Country Comparison' },
  { slug: 'nitaqat-checker', name: 'Nitaqat Checker' },
  { slug: 'saudi-visa-calculator', name: 'Saudi Visa Calculator' },
  { slug: 'uae-job-seeker-visa', name: 'UAE Job Seeker Visa' },
  { slug: 'salary-benchmark', name: 'Salary Benchmark' },
  { slug: 'take-home-pay-calculator', name: 'Gulf Take-Home Pay Calculator' },
  { slug: 'saudi-dependent-levy', name: 'Saudi Dependent Levy Calculator' },
  { slug: 'saudi-eosb-calculator', name: 'Saudi EOSB Calculator' },
  { slug: 'uae-gratuity-calculator', name: 'UAE Gratuity Calculator' },
  { slug: 'iqama-cost-calculator', name: 'Iqama Cost Calculator' },
  { slug: 'relocation-budget-planner', name: 'Relocation Budget Planner' },
  { slug: 'cost-of-living', name: 'Cost of Living Comparison' },
  { slug: 'remittance-estimator', name: 'Remittance Estimator' },
  { slug: 'kuwait-dependent-fee-calculator', name: 'Kuwait Dependent Fee Calculator' },
  { slug: 'oman-eosb-calculator', name: 'Oman EOSB Calculator' },
  { slug: 'kuwait-indemnity-calculator', name: 'Kuwait Indemnity Calculator' },
  { slug: 'bahrain-gratuity-calculator', name: 'Bahrain Gratuity Calculator' },
  { slug: 'qatar-gratuity-calculator', name: 'Qatar Gratuity Calculator' },
  { slug: 'qatar-qatarization-calculator', name: 'Qatarization Calculator' },
  { slug: 'oman-omanisation-calculator', name: 'Omanisation Calculator' },
  { slug: 'kuwait-kuwaitization-calculator', name: 'Kuwaitization Calculator' },
  { slug: 'bahrain-bahrainisation-calculator', name: 'Bahrainisation Calculator' },
  { slug: 'qatar-qid-cost-calculator', name: 'Qatar QID Cost Calculator' },
  { slug: 'kuwait-civil-id-cost-calculator', name: 'Kuwait Civil ID Cost Calculator' },
  { slug: 'bahrain-cpr-cost-calculator', name: 'Bahrain CPR Cost Calculator' },
  { slug: 'oman-resident-card-cost-calculator', name: 'Oman Resident Card Cost Calculator' },
];

export async function GET() {
  const routes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  routes.push({
    url: `${siteUrl}/tools`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  console.log(`📄 Tools sitemap: ${routes.length} tools`);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date(route.lastModified || new Date()).toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export const revalidate = 3600;

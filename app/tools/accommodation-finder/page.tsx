import { theme } from '@/lib/theme';
import { Home, Briefcase, Globe, GraduationCap, Award, Rocket, ClipboardList, Wifi } from 'lucide-react';
import { AccommodationFinderClient } from './AccommodationFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';

export const revalidate = 3600;

export const metadata = {
  title: 'Jobs with Accommodation — Roles with Housing Included | Jobmeter',
  description: 'Browse job openings that include accommodation as a benefit, updated daily across sectors and locations.',
};

export default async function AccommodationFinderPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => job.accommodation_status === 'yes')
    .slice(0, MAX_JOB_POSTINGS)
    .map((job) => jobPostingSchema(job));

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      {/* Header */}
      <div
        className="pt-12 pb-8 px-6"
        style={{ backgroundColor: theme.colors.primary.DEFAULT }}
      >
        <div className="max-w-7xl mx-auto">
          <a href="/tools" className="text-sm text-white/80 hover:text-white transition-colors self-start inline-block mb-2">
            ← Back to Tools
          </a>
          <div className="flex items-center gap-3 mb-2">
            <Home size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              Jobs with Accommodation
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find jobs that offer accommodation benefits
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and location</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Find jobs with housing benefits</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply and save on commute</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ad 1: Display Top - After How It Works */}
      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <AdUnit slot="4198231153" format="auto" />
      </div>

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {/* Client Island */}
        <AccommodationFinderClient />

        {/* ── Related Tools ── */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Other free tools to help you find the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Remote Jobs',             description: 'Find remote job opportunities in Nigeria and worldwide',           icon: Wifi,          color: '#06B6D4', route: '/tools/remote-jobs-finder' },
              { title: 'Internship Finder',        description: 'Find internship opportunities to kickstart your career',           icon: Briefcase,     color: '#2563EB', route: '/tools/internship-finder' },
              { title: 'NYSC Jobs',               description: 'Find job opportunities for NYSC corpers',                          icon: Award,         color: '#10B981', route: '/tools/nysc-finder' },
              { title: 'Jobs with Visa Sponsorship', description: 'Find jobs that offer visa sponsorship and work permits',         icon: Globe,         color: '#3B82F6', route: '/tools/visa-finder' },
              { title: 'Graduate & Trainee Jobs', description: 'Find graduate programs and trainee positions for fresh graduates',  icon: GraduationCap, color: '#2563EB', route: '/tools/graduate-trainee-finder' },
              { title: 'Entry Level Jobs',        description: 'Find entry-level jobs for beginners starting their career',         icon: Rocket,        color: '#6366F1', route: '/tools/entry-level-finder' },
              { title: 'Quiz Platform',           description: 'Practice aptitude tests and theory questions',                     icon: ClipboardList, color: '#F59E0B', route: '/tools/quiz' },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.route}
                  href={tool.route}
                  className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 hover:shadow-md transition-shadow group"
                  style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tool.color}18` }}>
                    <Icon size={20} style={{ color: tool.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{tool.title}</p>
                    <p className="text-xs text-gray-500 leading-snug">{tool.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── SEO Content ── */}
        <div className="mt-8 bg-white rounded-2xl p-6 md:p-10" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
          <article className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs with Accommodation</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Some employers include housing as part of the job -- common in hospitality, healthcare, domestic and care work, construction, and roles based in remote locations far from where most applicants live. This page filters Jobmeter's jobs table for listings where the employer has marked accommodation as included, worldwide.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What "accommodation included" can mean</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              This varies a lot by employer -- it can mean a private apartment, shared staff housing, a housing allowance added to your salary, or short-term accommodation only during an initial relocation period. Always confirm the specifics (shared vs. private, included in salary vs. separate, duration) directly with the employer before accepting an offer.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Questions worth asking before you accept</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Is it private or shared housing?</strong> And if shared, how many people per room or unit.</li>
              <li><strong>Is it included in your salary, or a separate benefit?</strong> Some listings quote a lower base salary because housing is bundled in.</li>
              <li><strong>What happens if you leave the role early?</strong> Some accommodation arrangements are tied to your contract and end the day your employment does.</li>
              <li><strong>Is it near your actual workplace?</strong> Ask about commute time and whether transport is also provided.</li>
              <li><strong>Get it in writing.</strong> Verbal promises about housing quality or duration are hard to enforce later.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How are these jobs identified on this page?', a: 'We filter for jobs where the employer explicitly marked accommodation as included in the listing.' },
                { q: 'Is this global?', a: 'Yes. Jobmeter\'s jobs table covers listings from everywhere, and this page filters that same table for accommodation-included roles.' },
                { q: 'Is the accommodation always free?', a: 'Not always -- some listings include it as a free benefit, others as a housing allowance or subsidized option. Check each listing\'s details.' },
                { q: 'Does this page include expired listings?', a: 'Expired roles may still appear, marked as closed, so you can see recent hiring activity even after a posting has closed.' },
              ].map(({ q, a }) => (
                <div key={q} className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* ── Schema Markup ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Jobs with Accommodation | Jobmeter",
                "description": "Browse job openings that include accommodation as a benefit, updated daily across sectors and locations.",
                "url": "https://jobmeter.app/tools/accommodation-finder",
                "inLanguage": "en",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://jobmeter.app" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://jobmeter.app/tools" },
                    { "@type": "ListItem", "position": 3, "name": "Jobs with Accommodation", "item": "https://jobmeter.app/tools/accommodation-finder" },
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How are these jobs identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We filter for jobs where the employer explicitly marked accommodation as included in the listing." } },
                  { "@type": "Question", "name": "Is this global?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Jobmeter's jobs table covers listings from everywhere, and this page filters that same table for accommodation-included roles." } },
                  { "@type": "Question", "name": "Is the accommodation always free?", "acceptedAnswer": { "@type": "Answer", "text": "Not always -- some listings include it as a free benefit, others as a housing allowance or subsidized option. Check each listing's details." } },
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Related Job Finder Tools on Jobmeter",
                "description": "Other free job finder tools available on jobmeter.app",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Jobs with Visa Sponsorship",    "url": "https://jobmeter.app/tools/visa-finder" },
                  { "@type": "ListItem", "position": 2, "name": "Remote Jobs Finder",             "url": "https://jobmeter.app/tools/remote-jobs-finder" },
                  { "@type": "ListItem", "position": 3, "name": "Internship Finder",              "url": "https://jobmeter.app/tools/internship-finder" },
                  { "@type": "ListItem", "position": 4, "name": "NYSC Jobs Finder",               "url": "https://jobmeter.app/tools/nysc-finder" },
                  { "@type": "ListItem", "position": 5, "name": "Entry Level Jobs Finder",        "url": "https://jobmeter.app/tools/entry-level-finder" },
                ]
              },
              ...jobPostings,
            ])
          }}
        />
      </div>
    </div>
  );
}

import { theme } from '@/lib/theme';
import { Award, Laptop, Home, Globe, Rocket, GraduationCap, Briefcase } from 'lucide-react';
import { NYSCFinderClient } from './NYSCFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';

export const revalidate = 3600;

export const metadata = {
  title: 'NYSC Jobs — Job Vacancies for Corpers | Jobmeter',
  description: 'Browse job openings suited for NYSC corps members, updated daily across sectors and states in Nigeria.',
};

export default async function NYSCFinderPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => (job.role || '').toLowerCase().includes('nysc'))
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
            <Award size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              NYSC Jobs
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find job opportunities for NYSC corpers
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and location</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Find jobs suitable for corpers</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply and start your service year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Island */}
      <NYSCFinderClient />

      <AdUnit slot="1769800630" format="auto" />

      {/* ── Related Tools ── */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Other free tools to help you find the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Remote Jobs',               description: 'Find remote job opportunities in Nigeria and worldwide',           icon: Laptop,        color: '#06B6D4', route: '/tools/remote-jobs-finder' },
              { title: 'Internship Finder',          description: 'Find internship opportunities to kickstart your career',           icon: Briefcase,     color: '#2563EB', route: '/tools/internship-finder' },
              { title: 'Jobs with Accommodation',   description: 'Find jobs that offer accommodation benefits',                      icon: Home,          color: '#14B8A6', route: '/tools/accommodation-finder' },
              { title: 'Jobs with Visa Sponsorship', description: 'Find jobs that offer visa sponsorship and work permits',          icon: Globe,         color: '#3B82F6', route: '/tools/visa-finder' },
              { title: 'Graduate & Trainee Jobs',   description: 'Find graduate programs and trainee positions for fresh graduates',  icon: GraduationCap, color: '#2563EB', route: '/tools/graduate-trainee-finder' },
              { title: 'Entry Level Jobs',          description: 'Find entry-level jobs for beginners starting their career',         icon: Rocket,        color: '#6366F1', route: '/tools/entry-level-finder' },
              { title: 'Quiz Platform',             description: 'Practice aptitude tests and theory questions',                     icon: Briefcase,     color: '#F59E0B', route: '/tools/quiz' },
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
      </div>

      {/* ── SEO Content ── */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mt-8 bg-white rounded-2xl p-6 md:p-10" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
          <article className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">NYSC Jobs</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              This page is for corps members serving under Nigeria's National Youth Service Corps (NYSC) -- unlike the rest of Jobmeter's job-finder tools, which cover listings from everywhere, this one filters specifically for roles relevant to NYSC members in Nigeria. We match jobs where the role field contains "nysc," which typically means PPA (Primary Place of Assignment) opportunities, roles open to serving corps members, or post-NYSC positions explicitly aimed at recent corps members.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What this covers</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Listings here can include PPA placements at companies and organizations, part-time or side opportunities compatible with active service, and roles specifically targeted at corps members who've just finished their service year (often called "ex-corpers" or "POP" -- Passing Out Parade -- hires). Requirements and pay structures vary widely by employer, so check each listing's details.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for corps members job hunting</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Start early if you can.</strong> Requesting or negotiating a PPA that aligns with your career goals is easier before you're deployed than after.</li>
              <li><strong>Build a portfolio during service.</strong> Many corps members use their service year to gain experience that becomes the basis of their post-NYSC job search.</li>
              <li><strong>Network within your state of deployment.</strong> Local employers often prefer to hire corps members who are already familiar with the area.</li>
              <li><strong>Check both PPA and post-service listings.</strong> Some roles are only open to currently-serving corps members; others specifically want people who've completed service.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How are NYSC jobs identified on this page?', a: 'We filter for jobs where the role field contains "nysc" -- a text match against live listings in the jobs table.' },
                { q: 'Is this page Nigeria-specific?', a: 'Yes -- unlike our other job-finder tools, which are global, this page is specifically for NYSC corps members in Nigeria.' },
                { q: 'Does this include PPA opportunities?', a: 'Listings can include PPA-related roles when they\'re explicitly tagged as such, alongside other roles aimed at serving or recently completed corps members.' },
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
      </div>

      <AdUnit slot="3434236090" format="auto" />

      {/* ── Schema Markup ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "NYSC Jobs | Jobmeter",
              "description": "Browse job openings suited for NYSC corps members, updated daily across sectors and states in Nigeria.",
              "url": "https://www.jobmeter.app/tools/nysc-finder",
              "inLanguage": "en",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://www.jobmeter.app" },
                  { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.jobmeter.app/tools" },
                  { "@type": "ListItem", "position": 3, "name": "NYSC Jobs", "item": "https://www.jobmeter.app/tools/nysc-finder" },
                ]
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "How are NYSC jobs identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We filter for jobs where the role field contains 'nysc' -- a text match against live listings in the jobs table." } },
                { "@type": "Question", "name": "Is this page Nigeria-specific?", "acceptedAnswer": { "@type": "Answer", "text": "Yes -- unlike our other job-finder tools, which are global, this page is specifically for NYSC corps members in Nigeria." } },
                { "@type": "Question", "name": "Does this include PPA opportunities?", "acceptedAnswer": { "@type": "Answer", "text": "Listings can include PPA-related roles when explicitly tagged as such, alongside other roles aimed at serving or recently completed corps members." } },
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Related Job Finder Tools on Jobmeter",
              "description": "Other free job finder tools available on jobmeter.app",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Internship Finder",           "url": "https://www.jobmeter.app/tools/internship-finder" },
                { "@type": "ListItem", "position": 2, "name": "Graduate & Trainee Jobs",     "url": "https://www.jobmeter.app/tools/graduate-trainee-finder" },
                { "@type": "ListItem", "position": 3, "name": "Entry Level Jobs Finder",     "url": "https://www.jobmeter.app/tools/entry-level-finder" },
                { "@type": "ListItem", "position": 4, "name": "Jobs with Accommodation",     "url": "https://www.jobmeter.app/tools/accommodation-finder" },
                { "@type": "ListItem", "position": 5, "name": "Remote Jobs Finder",          "url": "https://www.jobmeter.app/tools/remote-jobs-finder" },
              ]
            },
            ...jobPostings,
          ])
        }}
      />
    </div>
  );
}

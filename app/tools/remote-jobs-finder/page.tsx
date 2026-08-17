import { Wifi, GraduationCap, Award, Globe, Home, Rocket, ClipboardList } from 'lucide-react';
import { theme } from '@/lib/theme';
import RemoteJobsFinderClient from './RemoteJobsFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

// Was `false` (fully static forever after first build) -- switched to
// hourly ISR so the JobPosting structured data below stays accurate as
// jobs are posted/expire, instead of freezing at whatever existed at build
// time.
export const revalidate = 3600;

export const metadata = {
  title: 'Remote Jobs — Find Work From Home & Remote Job Openings | Jobmeter',
  description: 'Browse remote job openings updated daily. Filter by sector and employment type to find legitimate work-from-home roles.',
};

export default async function RemoteJobsPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => (job.job_type || '').toLowerCase() === 'remote')
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
            <Wifi size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              Remote Jobs
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find remote job opportunities in Nigeria and worldwide
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and employment type</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Browse remote jobs that match your skills</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply directly or save for later</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {/* Interactive Client Component */}
        <RemoteJobsFinderClient />

        <RelatedToolsStrip />

        <AdUnit slot="4198231153" format="auto" />

        {/* Related Tools */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Discover other tools to help you find the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { id: 'internship-finder', title: 'Internship Finder', description: 'Find internship opportunities to kickstart your career', icon: GraduationCap, color: '#2563EB', route: '/tools/internship-finder' },
              { id: 'nysc-finder', title: 'NYSC Jobs', description: 'Find job opportunities for NYSC corpers', icon: Award, color: '#10B981', route: '/tools/nysc-finder' },
              { id: 'accommodation-finder', title: 'Jobs with Accommodation', description: 'Find jobs that offer accommodation benefits', icon: Home, color: '#14B8A6', route: '/tools/accommodation-finder' },
              { id: 'visa-finder', title: 'Jobs with Visa Sponsorship', description: 'Find jobs offering visa sponsorship and work permits', icon: Globe, color: '#3B82F6', route: '/tools/visa-finder' },
              { id: 'graduate-trainee-finder', title: 'Graduate & Trainee Jobs', description: 'Find graduate programs and trainee positions', icon: GraduationCap, color: '#2563EB', route: '/tools/graduate-trainee-finder' },
              { id: 'entry-level-finder', title: 'Entry Level Jobs', description: 'Find entry-level jobs for beginners starting their career', icon: Rocket, color: '#6366F1', route: '/tools/entry-level-finder' },
              { id: 'quiz', title: 'Quiz Platform', description: 'Practice aptitude tests and theory questions', icon: ClipboardList, color: '#F59E0B', route: '/tools/quiz' },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.id}
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

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 md:p-10" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
          <article className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Remote Jobs</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Remote roles let you work from anywhere with an internet connection, for an employer based in a different city or country. Jobmeter lists remote openings across every sector we cover, sourced from the same jobs table as the rest of the site — not a separate curated feed, so what you see here reflects the live listings on the board.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What counts as a remote job here</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              This page shows jobs explicitly tagged as remote by the employer or poster. Some listings are fully remote with no location requirement; others are remote within a specific country or timezone (for example, "remote, must be based in the UAE"). Check each listing's details before applying, since "remote" doesn't always mean remote from anywhere.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for a remote job search</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Filter by sector.</strong> Remote roles exist in almost every field now, from customer support to software engineering — narrowing by sector usually cuts out more noise than a keyword search.</li>
              <li><strong>Read the location requirement carefully.</strong> Some "remote" roles still require you to be resident in a specific country for tax or legal reasons.</li>
              <li><strong>Tailor your application to remote work specifically.</strong> Mention tools you've used for async collaboration and how you stay productive without in-person oversight.</li>
              <li><strong>Be wary of unusually generous offers with vague job descriptions.</strong> Remote-job scams are common; a legitimate employer will have a real company presence you can verify.</li>
              <li><strong>Check back often.</strong> New listings post regularly, and remote roles tend to attract a lot of applicants quickly.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How are remote jobs identified on this page?', a: 'We show jobs where the employer explicitly tagged the role as remote (job_type: Remote). We don\'t infer this from the job description text.' },
                { q: 'Are these remote jobs open worldwide?', a: 'Some are open to anyone, anywhere; others require you to be based in a specific country or timezone. Always check the listing details before applying.' },
                { q: 'Does this page include expired listings?', a: 'Expired roles may still appear, marked as closed, so you can see recent hiring activity in a sector even after a specific posting has closed.' },
                { q: 'How often is this list updated?', a: 'It reflects the live jobs table, so it updates as new roles are posted and existing ones expire.' },
              ].map(({ q, a }) => (
                <div key={q} className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <AdUnit slot="9751041788" format="auto" />

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Remote Jobs | Jobmeter",
                "description": "Browse remote job openings updated daily. Filter by sector and employment type to find legitimate work-from-home roles.",
                "url": "https://jobmeter.app/tools/remote-jobs-finder",
                "inLanguage": "en",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jobmeter.app" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://jobmeter.app/tools" },
                    { "@type": "ListItem", "position": 3, "name": "Remote Jobs", "item": "https://jobmeter.app/tools/remote-jobs-finder" },
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How are remote jobs identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We show jobs where the employer explicitly tagged the role as remote. We don't infer this from the job description text." } },
                  { "@type": "Question", "name": "Are these remote jobs open worldwide?", "acceptedAnswer": { "@type": "Answer", "text": "Some are open to anyone, anywhere; others require you to be based in a specific country or timezone. Always check the listing details before applying." } },
                  { "@type": "Question", "name": "Does this page include expired listings?", "acceptedAnswer": { "@type": "Answer", "text": "Expired roles may still appear, marked as closed, so you can see recent hiring activity in a sector even after a specific posting has closed." } },
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Related Job Finder Tools",
                "description": "Other free job finder tools available on the platform",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Internship Finder", "url": "https://jobmeter.app/tools/internship-finder" },
                  { "@type": "ListItem", "position": 2, "name": "NYSC Jobs Finder", "url": "https://jobmeter.app/tools/nysc-finder" },
                  { "@type": "ListItem", "position": 3, "name": "Jobs with Accommodation Finder", "url": "https://jobmeter.app/tools/accommodation-finder" },
                  { "@type": "ListItem", "position": 4, "name": "Jobs with Visa Sponsorship Finder", "url": "https://jobmeter.app/tools/visa-finder" },
                  { "@type": "ListItem", "position": 5, "name": "Entry Level Jobs Finder", "url": "https://jobmeter.app/tools/entry-level-finder" },
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

import { theme } from '@/lib/theme';
import InternshipFinderClient from './InternshipFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { GraduationCap, Laptop, Award, Home, Globe, Rocket, ClipboardList, GraduationCap as GC, ChevronRight } from 'lucide-react';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

export const revalidate = 3600;

export const metadata = {
  title: 'Internship Finder — Find Internship Openings | Jobmeter',
  description: 'Browse internship openings updated daily to kickstart your career, filterable by sector and location.',
};

export default async function InternshipFinderPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => {
      const role = (job.role || '').toLowerCase();
      return role.includes('intern') || role.includes('interns') || role.includes('internship');
    })
    .slice(0, MAX_JOB_POSTINGS)
    .map((job) => jobPostingSchema(job));

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div
        className="pt-12 pb-8 px-6"
        style={{ backgroundColor: theme.colors.primary.DEFAULT }}
      >
        <div className="max-w-7xl mx-auto">
          <a href="/tools" className="text-sm text-white/80 hover:text-white transition-colors self-start inline-block mb-2">
            ← Back to Tools
          </a>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              Internship Finder
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find internship opportunities to kickstart your career
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and location</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Browse internship opportunities</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply to start your career</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <InternshipFinderClient />

        <RelatedToolsStrip />

        <AdUnit slot="4198231153" format="auto" />

        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Other free tools to help you discover the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Remote Jobs',            description: 'Find remote job opportunities in Nigeria and worldwide',          icon: Laptop,        color: '#06B6D4', route: '/tools/remote-jobs-finder' },
              { title: 'NYSC Jobs',              description: 'Find job opportunities for NYSC corpers',                         icon: Award,         color: '#10B981', route: '/tools/nysc-finder' },
              { title: 'Jobs with Accommodation',description: 'Find jobs that offer accommodation benefits',                     icon: Home,          color: '#14B8A6', route: '/tools/accommodation-finder' },
              { title: 'Jobs with Visa Sponsorship', description: 'Find jobs that offer visa sponsorship and work permits',      icon: Globe,         color: '#3B82F6', route: '/tools/visa-finder' },
              { title: 'Graduate & Trainee Jobs',description: 'Find graduate programs and trainee positions for fresh graduates', icon: GraduationCap, color: '#2563EB', route: '/tools/graduate-trainee-finder' },
              { title: 'Entry Level Jobs',       description: 'Find entry-level jobs for beginners starting their career',       icon: Rocket,        color: '#6366F1', route: '/tools/entry-level-finder' },
              { title: 'Quiz Platform',          description: 'Practice aptitude tests and theory questions',                    icon: ClipboardList, color: '#F59E0B', route: '/tools/quiz' },
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

        <div className="mt-8 bg-white rounded-2xl p-6 md:p-10" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
          <article className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship Finder</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Internships give you real, structured work experience — usually for a fixed period ranging from a few weeks to several months — and are one of the most common ways to break into a new field or industry. This page filters Jobmeter's jobs table for roles with "intern," "interns," or "internship" in the role field, worldwide, so it reflects live postings rather than a fixed list.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What to check before applying</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Internship terms vary a lot — some are paid, some are unpaid or stipend-only, some are full-time and some part-time, and requirements around being a current student or recent graduate differ by employer and country. Read each listing carefully rather than assuming a standard structure.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for internship applications</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Apply even with limited experience.</strong> Internships are designed for people without a full work history — coursework, personal projects, and volunteer work all count.</li>
              <li><strong>Watch application windows.</strong> Many structured internship programs, especially at larger companies, only recruit at fixed times of year.</li>
              <li><strong>Ask about conversion.</strong> Some internships lead directly to a full-time offer — it's reasonable to ask about this at interview stage.</li>
              <li><strong>Clarify pay and logistics early.</strong> If a listing doesn't mention compensation, accommodation, or remote/in-person expectations, ask before you invest time in the process.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How are internships identified on this page?', a: 'We filter for jobs where the role field contains "intern", "interns", or "internship" -- a text match against live listings.' },
                { q: 'Is this global?', a: 'Yes. Jobmeter\'s jobs table covers listings from everywhere, and this page filters that same table for internship roles.' },
                { q: 'Are these internships paid?', a: 'It varies by listing -- some are paid, some are stipend-only or unpaid. Check each posting\'s details.' },
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

        <AdUnit slot="9751041788" format="auto" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Internship Finder | Jobmeter",
                "description": "Browse internship openings updated daily to kickstart your career, filterable by sector and location.",
                "url": "https://www.jobmeter.app/tools/internship-finder",
                "inLanguage": "en",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://www.jobmeter.app" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.jobmeter.app/tools" },
                    { "@type": "ListItem", "position": 3, "name": "Internship Finder", "item": "https://www.jobmeter.app/tools/internship-finder" },
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How are internships identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We filter for jobs where the role field contains 'intern', 'interns', or 'internship' -- a text match against live listings." } },
                  { "@type": "Question", "name": "Is this global?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Jobmeter's jobs table covers listings from everywhere, and this page filters that same table for internship roles." } },
                  { "@type": "Question", "name": "Are these internships paid?", "acceptedAnswer": { "@type": "Answer", "text": "It varies by listing -- some are paid, some are stipend-only or unpaid. Check each posting's details." } },
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Related Job Finder Tools on Jobmeter",
                "description": "Other free job finder tools available on jobmeter.app",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Remote Jobs Finder",           "url": "https://www.jobmeter.app/tools/remote-jobs-finder" },
                  { "@type": "ListItem", "position": 2, "name": "Graduate & Trainee Jobs",       "url": "https://www.jobmeter.app/tools/graduate-trainee-finder" },
                  { "@type": "ListItem", "position": 3, "name": "NYSC Jobs Finder",              "url": "https://www.jobmeter.app/tools/nysc-finder" },
                  { "@type": "ListItem", "position": 4, "name": "Jobs with Accommodation",       "url": "https://www.jobmeter.app/tools/accommodation-finder" },
                  { "@type": "ListItem", "position": 5, "name": "Entry Level Jobs Finder",       "url": "https://www.jobmeter.app/tools/entry-level-finder" },
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

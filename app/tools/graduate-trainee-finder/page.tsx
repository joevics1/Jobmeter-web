import React from 'react';
import { theme } from '@/lib/theme';
import { GraduationCap, Briefcase, Wifi, Award, Home, Globe, Rocket, ClipboardList } from 'lucide-react';
import { GraduateTraineeFinderClient } from './GraduateTraineeFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';

export const revalidate = 3600;

export const metadata = {
  title: 'Graduate & Trainee Jobs — Programs for Fresh Graduates | Jobmeter',
  description: 'Browse graduate trainee programs and entry-level trainee positions updated daily, for fresh graduates starting their career.',
};

export default async function GraduateTraineeFinderPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => (job.role || '').toLowerCase().includes('trainee'))
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
            <GraduationCap size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              Graduate & Trainee Jobs
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find graduate programs, trainee positions, and entry-level opportunities for fresh graduates
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and location</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Find graduate programs and trainee roles</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply to kickstart your career</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <GraduateTraineeFinderClient />

        <AdUnit slot="4198231153" format="auto" />

        {/* ── Related Tools ── */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Other free tools to help you find the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Remote Jobs',              description: 'Find remote job opportunities in Nigeria and worldwide',           icon: Wifi,          color: '#06B6D4', route: '/tools/remote-jobs-finder' },
              { title: 'Internship Finder',         description: 'Find internship opportunities to kickstart your career',           icon: Briefcase,     color: '#2563EB', route: '/tools/internship-finder' },
              { title: 'NYSC Jobs',                description: 'Find job opportunities for NYSC corpers',                          icon: Award,         color: '#10B981', route: '/tools/nysc-finder' },
              { title: 'Jobs with Accommodation',  description: 'Find jobs that offer accommodation benefits',                      icon: Home,          color: '#14B8A6', route: '/tools/accommodation-finder' },
              { title: 'Jobs with Visa Sponsorship',description: 'Find jobs that offer visa sponsorship and work permits',          icon: Globe,         color: '#3B82F6', route: '/tools/visa-finder' },
              { title: 'Entry Level Jobs',         description: 'Find entry-level jobs for beginners starting their career',         icon: Rocket,        color: '#6366F1', route: '/tools/entry-level-finder' },
              { title: 'Quiz Platform',            description: 'Practice aptitude tests and theory questions',                     icon: ClipboardList, color: '#F59E0B', route: '/tools/quiz' },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Graduate & Trainee Jobs</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Graduate trainee programs are structured entry points for recent graduates — usually involving rotations across departments, mentorship, and a defined path toward a permanent role. This page filters Jobmeter's jobs table for roles with "trainee" in the title, worldwide, so it reflects live postings rather than a fixed list.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">How trainee programs typically work</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Structure varies by employer and industry, but most trainee programs run somewhere between several months and two years, rotate participants through different parts of the business, and are designed to convert into a permanent placement at the end. Some are highly structured and competitive (common at large banks, consultancies, and multinationals); others are closer to a formalized entry-level role with a training label attached. Read each listing closely — the term "trainee" covers a wide range of program structures.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for trainee program applications</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Apply early in the cycle.</strong> Structured trainee programs at larger employers often open and close applications on a fixed annual or biannual schedule.</li>
              <li><strong>Expect aptitude tests.</strong> Many trainee programs at larger companies use numerical, verbal, or logical reasoning tests as an early screening step — practicing these in advance helps.</li>
              <li><strong>Show breadth, not just depth.</strong> Since trainee programs rotate you across functions, evidence of adaptability and quick learning matters as much as specific technical skill.</li>
              <li><strong>Ask about conversion rates.</strong> If you get to interview stage, it's reasonable to ask what proportion of trainees are offered a permanent role at the end.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How are trainee jobs identified on this page?', a: 'We filter for jobs where the role field contains "trainee" — this is a straightforward text match against live listings, not a separately curated program list.' },
                { q: 'Is this global?', a: 'Yes. Jobmeter\'s jobs table covers listings from everywhere, and this page filters that same table for trainee roles.' },
                { q: 'What\'s the difference between a graduate trainee program and an internship?', a: 'An internship is usually shorter and doesn\'t always lead to a permanent role. A trainee program is typically a longer, structured commitment with a clearer path toward permanent employment.' },
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

        {/* ── Schema Markup ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Graduate & Trainee Jobs | Jobmeter",
                "description": "Browse graduate trainee programs and entry-level trainee positions updated daily, for fresh graduates starting their career.",
                "url": "https://www.jobmeter.app/tools/graduate-trainee-finder",
                "inLanguage": "en",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://www.jobmeter.app" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.jobmeter.app/tools" },
                    { "@type": "ListItem", "position": 3, "name": "Graduate & Trainee Jobs", "item": "https://www.jobmeter.app/tools/graduate-trainee-finder" },
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How are trainee jobs identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We filter for jobs where the role field contains 'trainee' -- a text match against live listings, not a separately curated program list." } },
                  { "@type": "Question", "name": "Is this global?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Jobmeter's jobs table covers listings from everywhere, and this page filters that same table for trainee roles." } },
                  { "@type": "Question", "name": "What's the difference between a trainee program and an internship?", "acceptedAnswer": { "@type": "Answer", "text": "An internship is usually shorter and doesn't always lead to a permanent role. A trainee program is typically longer and more structured, with a clearer path toward permanent employment." } },
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Related Job Finder Tools on Jobmeter",
                "description": "Other free job finder tools available on jobmeter.app",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Remote Jobs Finder",           "url": "https://www.jobmeter.app/tools/remote-jobs-finder" },
                  { "@type": "ListItem", "position": 2, "name": "Internship Finder",             "url": "https://www.jobmeter.app/tools/internship-finder" },
                  { "@type": "ListItem", "position": 3, "name": "NYSC Jobs Finder",              "url": "https://www.jobmeter.app/tools/nysc-finder" },
                  { "@type": "ListItem", "position": 4, "name": "Jobs with Visa Sponsorship",    "url": "https://www.jobmeter.app/tools/visa-finder" },
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

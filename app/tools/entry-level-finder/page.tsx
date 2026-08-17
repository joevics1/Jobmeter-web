import { theme } from '@/lib/theme';
import { Rocket, Briefcase, Wifi, Home, GraduationCap, Award, ClipboardList, Globe } from 'lucide-react';
import { EntryLevelFinderClient } from './EntryLevelFinderClient';
import AdUnit from '@/components/ads/AdUnit';

export const revalidate = false;

export const metadata = {
  title: 'Entry Level Jobs — No-Experience & Junior Roles | Jobmeter',
  description: 'Browse entry-level job openings for beginners and recent graduates, updated daily across every sector Jobmeter covers.',
};

export default function EntryLevelFinderPage() {
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
            <Rocket size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              Entry Level Jobs
            </h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>
            Find entry-level jobs for beginners and those starting their career
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">1</div>
              <p className="text-sm text-gray-600">Search by job title, skill, or company</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">2</div>
              <p className="text-sm text-gray-600">Filter by sector and location</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">3</div>
              <p className="text-sm text-gray-600">Browse entry-level opportunities</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">4</div>
              <p className="text-sm text-gray-600">Apply and start your career</p>
            </div>
          </div>
        </div>
      </div>

      <EntryLevelFinderClient />

      <AdUnit slot="4198231153" format="auto" />

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Explore More Job Finder Tools</h2>
          <p className="text-sm text-gray-500 mb-6">Other free tools to help you find the right opportunity faster</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Remote Jobs',               description: 'Find remote job opportunities in Nigeria and worldwide',           icon: Wifi,          color: '#06B6D4', route: '/tools/remote-jobs-finder' },
              { title: 'Internship Finder',          description: 'Find internship opportunities to kickstart your career',           icon: Briefcase,     color: '#2563EB', route: '/tools/internship-finder' },
              { title: 'NYSC Jobs',                 description: 'Find job opportunities for NYSC corpers',                          icon: Award,         color: '#10B981', route: '/tools/nysc-finder' },
              { title: 'Jobs with Accommodation',   description: 'Find jobs that offer accommodation benefits',                      icon: Home,          color: '#14B8A6', route: '/tools/accommodation-finder' },
              { title: 'Jobs with Visa Sponsorship', description: 'Find jobs that offer visa sponsorship and work permits',          icon: Globe,         color: '#3B82F6', route: '/tools/visa-finder' },
              { title: 'Graduate & Trainee Jobs',   description: 'Find graduate programs and trainee positions for fresh graduates',  icon: GraduationCap, color: '#2563EB', route: '/tools/graduate-trainee-finder' },
              { title: 'Quiz Platform',             description: 'Practice aptitude tests and theory questions',                     icon: ClipboardList, color: '#F59E0B', route: '/tools/quiz' },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Entry Level Jobs</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Entry-level roles are built for people starting out — typically 0–2 years of experience — across every industry Jobmeter covers, worldwide. This page filters the live jobs table down to listings tagged entry-level, so what you see reflects current openings rather than a fixed, separately curated list.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What "entry level" means here</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We show jobs the employer explicitly tagged as entry-level. Requirements still vary a lot by role and country — some genuinely require zero prior experience, others expect a completed degree or a short internship. Read each listing's requirements rather than assuming "entry level" always means "no experience needed."
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for landing your first role</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li><strong>Lead with skills and projects, not job history.</strong> A portfolio, coursework, or personal project can substitute for professional experience in fields like development, design, or data.</li>
              <li><strong>Use the sector filter.</strong> Entry-level roles cluster differently by field — customer service and sales tend to have the highest volume of genuinely no-experience listings.</li>
              <li><strong>Tailor your CV to each listing.</strong> Mirror the language in the job description, especially for roles that go through automated screening.</li>
              <li><strong>Apply broadly but track everything.</strong> Entry-level roles get a lot of applicants; a spreadsheet of what you've applied to and when helps you follow up on time.</li>
              <li><strong>Don't rule out remote roles.</strong> Combine this filter with the Remote Jobs page if you're open to working for an employer outside your country.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-5 mb-8">
              {[
                { q: 'How is "entry level" defined on this page?', a: 'We show jobs the employer tagged as entry-level in the jobs table. Actual experience requirements still vary by listing, so check the job description.' },
                { q: 'Is this global, or specific to one country?', a: 'Global. Jobmeter\'s jobs table covers listings from everywhere, and this page filters that same table by experience level.' },
                { q: 'Does this include internships or graduate trainee programs?', a: 'Those have their own dedicated pages — see Internship Finder and Graduate & Trainee Jobs — since they\'re structured differently from a standard entry-level hire.' },
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
                "name": "Entry Level Jobs | Jobmeter",
                "description": "Browse entry-level job openings for beginners and recent graduates, updated daily across every sector Jobmeter covers.",
                "url": "https://jobmeter.app/tools/entry-level-finder",
                "inLanguage": "en",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jobmeter.app" },
                    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://jobmeter.app/tools" },
                    { "@type": "ListItem", "position": 3, "name": "Entry Level Jobs", "item": "https://jobmeter.app/tools/entry-level-finder" },
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How is \"entry level\" defined on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We show jobs the employer tagged as entry-level in the jobs table. Actual experience requirements still vary by listing." } },
                  { "@type": "Question", "name": "Is this global, or specific to one country?", "acceptedAnswer": { "@type": "Answer", "text": "Global. Jobmeter's jobs table covers listings from everywhere, and this page filters that same table by experience level." } },
                  { "@type": "Question", "name": "Does this include internships or graduate trainee programs?", "acceptedAnswer": { "@type": "Answer", "text": "Those have their own dedicated pages, since they are structured differently from a standard entry-level hire." } },
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Related Job Finder Tools on Jobmeter",
                "description": "Other free job finder tools available on jobmeter.app",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Remote Jobs Finder",           "url": "https://jobmeter.app/tools/remote-jobs-finder" },
                  { "@type": "ListItem", "position": 2, "name": "Internship Finder",             "url": "https://jobmeter.app/tools/internship-finder" },
                  { "@type": "ListItem", "position": 3, "name": "Graduate & Trainee Jobs",       "url": "https://jobmeter.app/tools/graduate-trainee-finder" },
                  { "@type": "ListItem", "position": 4, "name": "Jobs with Visa Sponsorship",    "url": "https://jobmeter.app/tools/visa-finder" },
                  { "@type": "ListItem", "position": 5, "name": "Jobs with Accommodation",       "url": "https://jobmeter.app/tools/accommodation-finder" },
                ]
              }
            ])
          }}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100" style={{ height: '50px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50px', overflow: 'hidden' }}>
          <AdUnit slot="3349195672" format="auto" style={{ display: 'block', width: '100%', height: '50px', maxHeight: '50px', overflow: 'hidden' }} />
        </div>
      </div>
    </div>
  );
}

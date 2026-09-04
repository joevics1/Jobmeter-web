import React from 'react';
import { Globe } from 'lucide-react';
import { theme } from '@/lib/theme';
import VisaFinderClient from './VisaFinderClient';
import AdUnit from '@/components/ads/AdUnit';
import { fetchWorkerJobsForSchema, jobPostingSchema, MAX_JOB_POSTINGS } from '@/lib/jobPostingSchema';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

export const revalidate = 3600;

export const metadata = {
  title: 'Jobs with Visa Sponsorship — Openings Offering Work Visa Support | Jobmeter',
  description: 'Browse job openings that include visa sponsorship, updated daily across every sector and country Jobmeter covers.',
};

export default async function VisaFinderPage() {
  const allJobs = await fetchWorkerJobsForSchema();
  const jobPostings = allJobs
    .filter((job) => job.visa_assistance === 'yes')
    .slice(0, MAX_JOB_POSTINGS)
    .map((job) => jobPostingSchema(job));

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="pt-12 pb-8 px-6" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
        <div className="max-w-7xl mx-auto">
          <a href="/tools" className="text-sm text-white/80 hover:text-white transition-colors self-start inline-block mb-2">← Back to Tools</a>
          <div className="flex items-center gap-3 mb-2">
            <Globe size={32} />
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>Jobs with Visa Sponsorship</h1>
          </div>
          <p className="text-sm" style={{ color: theme.colors.text.light }}>Find jobs that offer visa sponsorship and work permits</p>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '1', p: 'Search by job title, skill, or company' },
              { n: '2', p: 'Filter by sector and location' },
              { n: '3', p: 'Find jobs offering visa sponsorship' },
              { n: '4', p: 'Apply and relocate for work' },
            ].map(({ n, p }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">{n}</div>
                <p className="text-sm text-gray-600">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad 1: Display Top - After How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4198231153" format="auto" />
*/}
      </div>

      <VisaFinderClient />

      <RelatedToolsStrip />
      <div className="mt-8 bg-white rounded-2xl p-6 md:p-10 mx-4 md:mx-6 mb-8" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
        <article className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs with Visa Sponsorship</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Visa sponsorship means an employer is willing to handle (and usually fund) the legal work-permit process for hiring you internationally. This page filters Jobmeter's jobs table for listings where the employer has explicitly marked visa assistance as available, worldwide, across every sector we cover.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">What "visa sponsorship" can mean in practice</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Sponsorship arrangements vary enormously by country and employer -- from full legal and relocation support to a smaller stipend toward visa fees. Some listings offer a genuine path to long-term residency, others are for shorter, fixed-term work permits. Always confirm the specifics of visa type, duration, and who bears the cost before you commit to an application.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Tips for a sponsored-job search</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li><strong>Understand the visa type before you apply.</strong> A temporary work permit and a permanent-residency pathway are very different commitments -- know which one a role is actually offering.</li>
            <li><strong>Get sponsorship terms in writing.</strong> Verbal promises about covering visa costs or handling paperwork are hard to enforce later.</li>
            <li><strong>Research licensing requirements for your field.</strong> Regulated professions (healthcare, law, some engineering disciplines) often require additional local certification even with a valid work visa.</li>
            <li><strong>Be cautious of anyone asking you to pay upfront for a "guaranteed" sponsorship.</strong> Legitimate employer-sponsored visas are paid for by the employer, not the candidate.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-5 mb-8">
            {[
              { q: 'How are these jobs identified on this page?', a: 'We filter for jobs where the employer explicitly marked visa assistance as available in the listing.' },
              { q: 'Is this global?', a: 'Yes. Jobmeter\'s jobs table covers listings from everywhere, and this page filters that same table for visa-sponsored roles.' },
              { q: 'Does sponsorship always mean permanent residency?', a: 'No -- some sponsored roles are for temporary work permits, others lead toward longer-term residency. Check each listing\'s details.' },
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

      {/* Ad 4: Display Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="9751041788" format="auto" />
*/}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "WebPage", "name": "Jobs with Visa Sponsorship | Jobmeter", "description": "Browse job openings that include visa sponsorship, updated daily across every sector and country Jobmeter covers.", "url": "https://www.jobmeter.app/tools/visa-finder", "inLanguage": "en", "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.jobmeter.app" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.jobmeter.app/tools" },
          { "@type": "ListItem", "position": 3, "name": "Jobs with Visa Sponsorship", "item": "https://www.jobmeter.app/tools/visa-finder" },
        ] } },
        { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
          { "@type": "Question", "name": "How are these jobs identified on this page?", "acceptedAnswer": { "@type": "Answer", "text": "We filter for jobs where the employer explicitly marked visa assistance as available in the listing." } },
          { "@type": "Question", "name": "Is this global?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Jobmeter's jobs table covers listings from everywhere, and this page filters that same table for visa-sponsored roles." } },
          { "@type": "Question", "name": "Does sponsorship always mean permanent residency?", "acceptedAnswer": { "@type": "Answer", "text": "No -- some sponsored roles are for temporary work permits, others lead toward longer-term residency. Check each listing's details." } },
        ] },
        { "@context": "https://schema.org", "@type": "ItemList", "name": "Related Job Finder Tools on Jobmeter", "description": "Other free job finder tools available on jobmeter.app", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Remote Jobs Finder", "url": "https://www.jobmeter.app/tools/remote-jobs-finder" },
          { "@type": "ListItem", "position": 2, "name": "Internship Finder", "url": "https://www.jobmeter.app/tools/internship-finder" },
          { "@type": "ListItem", "position": 3, "name": "NYSC Jobs Finder", "url": "https://www.jobmeter.app/tools/nysc-finder" },
          { "@type": "ListItem", "position": 4, "name": "Jobs with Accommodation", "url": "https://www.jobmeter.app/tools/accommodation-finder" },
          { "@type": "ListItem", "position": 5, "name": "Entry Level Jobs Finder", "url": "https://www.jobmeter.app/tools/entry-level-finder" },
        ] },
        ...jobPostings,
      ]) }} />
    </div>
  );
}

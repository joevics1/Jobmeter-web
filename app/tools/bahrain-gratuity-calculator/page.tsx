// app/tools/bahrain-gratuity-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import GratuityCalculatorShell from '../_shared/GratuityCalculatorShell';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/bahrain-gratuity-calculator';

export const metadata: Metadata = {
  title: 'Bahrain Gratuity Calculator | End-of-Service Estimate | JobMeter',
  description: "Estimate your Bahrain end-of-service gratuity: half a month's wage per year for the first 3 years, then 1 month/year after. Includes a note on Bahrain's ongoing SIO reform.",
  keywords: [
    'bahrain gratuity calculator', 'bahrain end of service benefit', 'bahrain indemnity calculator',
    'bahrain labour law gratuity', 'bahrain severance pay', 'bahrain sio reform',
    'bahrain gratuity formula', 'bahrain end of service 2026', 'bahrain resignation gratuity',
    'bahrain private sector gratuity', 'bahrain social insurance organisation', 'bahrain expat gratuity',
    'bahrain gratuity calculation years of service',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Bahrain Gratuity Calculator', url: pageUrl,
    description: "Estimate Bahrain's end-of-service gratuity under the traditional formula, with a note on the country's ongoing reform of the system.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Bahrain Gratuity Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question', name: 'How is gratuity calculated in Bahrain?',
        acceptedAnswer: { '@type': 'Answer', text: "The traditional formula pays half a month's basic wage per year of service for the first three years, then one full month's wage per year after that." },
      },
      {
        '@type': 'Question', name: 'Is Bahrain changing how gratuity works?',
        acceptedAnswer: { '@type': 'Answer', text: "Bahrain's Social Insurance Organisation (SIO) has been reforming aspects of the end-of-service and unemployment insurance system. The traditional formula remains the commonly reported baseline, but confirm current rules with SIO or LMRA before relying on any estimate." },
      },
    ],
  },
];

export default function BahrainGratuityPage() {
  return (
    <>
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Bahrain Gratuity Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Bahrain Gratuity Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Estimate your end-of-service payout — with an honest flag on <span className="font-semibold">Bahrain's ongoing reform</span>
            </p>
            <p className="mt-4 text-blue-100 text-lg">Manama • Riffa • Muharraq • Isa Town</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4">{/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="top-ad" />
*/}</div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Bahrain's gratuity system is in the middle of reform. This calculator uses the traditional formula
              still commonly reported — treat the result as a starting estimate, not a final figure.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <GratuityCalculatorShell country="bahrain" />

          <RelatedToolsStrip />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6">{/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="mid-page-ad" />
*/}</div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why this estimate comes with a bigger caveat than the others</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Bahrain's Social Insurance Organisation (SIO) reform</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Bahrain's traditional gratuity formula — half a month's wage per year for the first three years,
                  then a full month's wage per year after — has been the reported baseline for years. But Bahrain has
                  been actively reforming how end-of-service and unemployment protection work, with changes tied to
                  the Social Insurance Organisation rather than a single clean law update.
                </p>
                <p>
                  That makes Bahrain the one country in this set where we'd specifically tell you: use this as a
                  starting estimate, then confirm the current rules directly with SIO or Bahrain's Labour Market
                  Regulatory Authority (LMRA) before treating the number as final — more so than for Oman, Kuwait, or
                  Qatar, where the legal basis is a single clearly dated law.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Bahrain's
                traditional end-of-service formula as commonly reported. Bahrain's system is under active reform —
                verify current rules with SIO or LMRA before relying on this figure. Not legal or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

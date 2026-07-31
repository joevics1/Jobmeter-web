// app/tools/oman-eosb-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import GratuityCalculatorShell from '../_shared/GratuityCalculatorShell';

const pageUrl = 'https://jobmeter.app/tools/oman-eosb-calculator';

export const metadata: Metadata = {
  title: 'Oman End-of-Service Benefit (EOSB) Calculator 2026 | JobMeter',
  description: "Calculate your Oman end-of-service gratuity under Royal Decree 53/2023, split correctly across the old and new formulas at the 31 July 2023 cutoff.",
  keywords: [
    'oman eosb calculator', 'oman end of service benefit', 'oman gratuity calculator',
    'royal decree 53 2023 oman', 'oman labour law gratuity', 'oman severance pay calculator',
    'oman gratuity formula', 'oman end of service 2026', 'oman resignation gratuity',
    'oman old vs new gratuity law', 'oman gratuity split calculation', 'oman work permit gratuity',
    'oman labor law article 61', 'oman expat end of service', 'oman gratuity eligibility',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Oman EOSB Calculator', url: pageUrl,
    description: "Calculate Oman's end-of-service benefit under Royal Decree 53/2023, correctly split at the 31 July 2023 formula-change cutoff.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Oman EOSB Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question', name: 'How is EOSB calculated in Oman after the 2023 reform?',
        acceptedAnswer: { '@type': 'Answer', text: "Royal Decree 53/2023 introduced a new formula of one full month's basic wage per year of service, effective 31 July 2023. Service completed before that date is still calculated under the old formula (15 days per year for the first 3 years, then 1 month per year), so most long-serving employees need their gratuity split across both formulas." },
      },
      {
        '@type': 'Question', name: 'Does resignation reduce EOSB in Oman?',
        acceptedAnswer: { '@type': 'Answer', text: "Oman's 2023 reform removed most of the resignation-based reductions and minimum service requirements that existed under the old law, making its EOSB system more employee-favorable than several of its GCC neighbors for service after the cutoff date." },
      },
    ],
  },
];

export default function OmanEOSBPage() {
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
              <span className="text-white font-medium">Oman EOSB Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Oman EOSB Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Correctly split your gratuity across Oman's <span className="font-semibold">old and new formulas</span> at the 2023 cutoff
            </p>
            <p className="mt-4 text-blue-100 text-lg">Muscat • Salalah • Sohar • Nizwa</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Oman changed its end-of-service formula on 31 July 2023. If you started before that date, your gratuity
              is split: the old formula applies to service before the cutoff, the new formula to everything after.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <GratuityCalculatorShell country="oman" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why the split-date calculation matters</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Royal Decree 53/2023, effective 31 July 2023</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Before the reform, Oman calculated gratuity at 15 days' basic wage per year for the first three
                  years of service, then one month's wage per year after that — a formula most other GCC countries
                  still use in some form. The new law simplifies this to a flat one month's wage per year, but only
                  for service completed from 31 July 2023 onward.
                </p>
                <p>
                  For anyone who started their job before that date, this means gratuity isn't calculated with a
                  single formula end-to-end — it's the old-formula amount for the pre-cutoff period, plus the
                  new-formula amount for everything after, added together. This calculator handles that split
                  automatically based on your actual start and end dates.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Royal Decree
                53/2023 and Royal Decree 35/2003 as publicly reported. Individual settlements can include additional
                components (unused leave, notice pay) not modeled here. Verify with Oman's Ministry of Labour before
                relying on this figure. Not legal or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

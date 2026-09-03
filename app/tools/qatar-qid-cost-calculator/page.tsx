// app/tools/qatar-qid-cost-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import QatarQIDCostCalculator from './QatarQIDCostCalculator';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/qatar-qid-cost-calculator';

export const metadata: Metadata = {
  title: 'Qatar QID Cost Calculator | Residence Permit Fees 2026 | JobMeter',
  description: 'Calculate the real cost of renewing your Qatar ID (QID): QAR 500/year or QAR 900/3 years, plus medical test, delivery, family members, and late fines.',
  keywords: [
    'qatar qid cost', 'qatar id renewal fee', 'qatar residence permit cost', 'qid renewal calculator',
    'metrash2 fees', 'qatar id renewal 2026', 'qatar moi residence fee', 'qatar id family member fee',
    'qatar id late renewal fine', 'qatar id medical test fee', 'qatar id delivery fee',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Qatar QID Cost Calculator', url: pageUrl, description: 'Calculate the total cost of renewing a Qatar ID (QID), including optional add-ons.', inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
    { '@type': 'ListItem', position: 3, name: 'Qatar QID Cost Calculator', item: pageUrl },
  ]},
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'How much does it cost to renew a Qatar ID?', acceptedAnswer: { '@type': 'Answer', text: 'The standard renewal fee is QAR 500 for one year or QAR 900 for three years for expatriate workers. Home delivery via Q-Post adds QAR 20, and a medical fitness test (if required) is typically around QAR 100.' } },
    { '@type': 'Question', name: 'Who pays for QID renewal in Qatar?', acceptedAnswer: { '@type': 'Answer', text: "For work-sponsored residents, the employer usually covers the renewal fee. If you're sponsoring family members, you're typically responsible for their QID costs yourself." } },
  ]},
];

export default function QatarQIDCostPage() {
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
              <span className="text-white font-medium">Qatar QID Cost Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Qatar QID Cost Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">The real total — <span className="font-semibold">not just the headline renewal fee</span></p>
            <p className="mt-4 text-blue-100 text-lg">Doha • Al Rayyan • Al Wakrah • Lusail</p>
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
              The QAR 500/900 renewal fee is only part of the bill — medical tests, delivery, family members, and
              late fines all add up. This calculator shows the real total.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8"><QatarQIDCostCalculator />

        <RelatedToolsStrip /></div>
        <div className="max-w-6xl mx-auto px-6 py-6">{/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="mid-page-ad" />
*/}</div>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What actually goes into a QID renewal</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Ministry of Interior, via Metrash2 / portal.moi.gov.qa</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The QID — Qatar's residence permit card — is required for nearly every government and private
                  service in the country, from banking to healthcare. Renewal itself is straightforward: QAR 500 for
                  a one-year card or QAR 900 for three years, which works out cheaper per year the longer you commit.
                </p>
                <p>
                  What catches people out is everything around the renewal fee. A medical fitness test isn't always
                  required, but when it is, it adds roughly QAR 100. Choosing home delivery through Q-Post adds
                  QAR 20. And if you miss the 90-day grace period after expiry, fines run QAR 10 per day — which
                  adds up fast if you're not tracking your expiry date closely.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Fees reflect Qatar's MOI
                schedule as publicly reported in 2026 and can change. Always confirm the exact amount in Metrash2 or
                on the MOI portal before paying. Not official guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

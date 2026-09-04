// app/tools/kuwait-indemnity-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import GratuityCalculatorShell from '../_shared/GratuityCalculatorShell';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/kuwait-indemnity-calculator';

export const metadata: Metadata = {
  title: 'Kuwait Indemnity (End-of-Service) Calculator | JobMeter',
  description: 'Calculate your Kuwait end-of-service indemnity under Labour Law No. 6 of 2010: 15 days/year for the first 5 years, then 1 month/year, with resignation reductions applied correctly.',
  keywords: [
    'kuwait indemnity calculator', 'kuwait end of service benefit', 'kuwait gratuity calculator',
    'kuwait labour law article 51', 'kuwait severance pay', 'kuwait resignation gratuity',
    'kuwait indemnity formula', 'kuwait gratuity cap', 'kuwait end of service 2026',
    'kuwait indemnity resignation reduction', 'kuwait labor law 6 2010', 'kuwait termination indemnity',
    'kuwait indemnity calculation years of service', 'kuwait private sector gratuity',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Kuwait Indemnity Calculator', url: pageUrl,
    description: 'Calculate end-of-service indemnity in Kuwait under Labour Law No. 6 of 2010, including resignation-based reductions.',
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Kuwait Indemnity Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question', name: 'How much indemnity do you get in Kuwait if you resign?',
        acceptedAnswer: { '@type': 'Answer', text: 'It depends on years of service: under 3 years typically forfeits indemnity entirely, 3–5 years reduces it to half, 5–10 years to two-thirds, and 10+ years is generally paid in full — even on resignation.' },
      },
      {
        '@type': 'Question', name: 'Is there a cap on end-of-service indemnity in Kuwait?',
        acceptedAnswer: { '@type': 'Answer', text: "Yes, total indemnity is generally capped at around one and a half years' total wage under Kuwait Labour Law No. 6 of 2010, regardless of how many years were actually served." },
      },
    ],
  },
];

export default function KuwaitIndemnityPage() {
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
              <span className="text-white font-medium">Kuwait Indemnity Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Kuwait Indemnity Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              See exactly what you'll get — including <span className="font-semibold">resignation reductions</span> most calculators skip
            </p>
            <p className="mt-4 text-blue-100 text-lg">Kuwait City • Hawalli • Ahmadi • Farwaniya</p>
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
              Kuwait's indemnity formula is straightforward on paper, but resignation reductions and the 1.5-year cap
              catch a lot of people off guard. This tool applies both automatically.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <GratuityCalculatorShell country="kuwait" />

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why resignation timing matters so much in Kuwait</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Kuwait Labour Law No. 6 of 2010, Article 51</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Under Kuwait's labor law, the base indemnity calculation — 15 days' wage per year for the first
                  five years, then one month's wage per year after that — is only the starting point. If you resign
                  rather than being terminated or completing a fixed-term contract, that base amount gets scaled down
                  depending on exactly how long you've been employed.
                </p>
                <p>
                  The reduction bands are steep at the low end: resigning with under three years of service typically
                  forfeits the entire indemnity, not just a portion of it. That threshold effect means the difference
                  between resigning at 2 years 11 months and 3 years 1 month can be the entire payout — worth timing
                  deliberately if you're planning a move.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Kuwait Labour Law
                No. 6 of 2010, Article 51, as publicly reported. Individual settlements can vary. Verify with
                Kuwait's Ministry of Social Affairs and Labour before relying on this figure. Not legal or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

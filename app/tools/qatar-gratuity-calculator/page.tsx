// app/tools/qatar-gratuity-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import GratuityCalculatorShell from '../_shared/GratuityCalculatorShell';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/qatar-gratuity-calculator';

export const metadata: Metadata = {
  title: 'Qatar Gratuity Calculator | End-of-Service Benefit | JobMeter',
  description: "Calculate your Qatar end-of-service gratuity: 3 weeks' basic wage per year of service under Qatar Labour Law No. 14 of 2004 — the simplest formula in the GCC.",
  keywords: [
    'qatar gratuity calculator', 'qatar end of service benefit', 'qatar labour law 14 2004',
    'qatar severance pay calculator', 'qatar eosb calculator', 'qatar gratuity formula',
    'qatar end of service 2026', 'qatar three weeks wage gratuity', 'qatar resignation gratuity',
    'qatar private sector gratuity', 'qatar expat end of service', 'qatar gratuity eligibility',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Qatar Gratuity Calculator', url: pageUrl,
    description: "Calculate Qatar's end-of-service gratuity at 3 weeks' basic wage per year of service under Labour Law No. 14 of 2004.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Qatar Gratuity Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question', name: 'How much gratuity do you get in Qatar?',
        acceptedAnswer: { '@type': 'Answer', text: "Three weeks' basic wage for every year of service, under Qatar Labour Law No. 14 of 2004 — a flat rate with no tiering by years of service, unlike Kuwait, Oman, or Bahrain." },
      },
      {
        '@type': 'Question', name: 'Do you need a minimum period of service to get gratuity in Qatar?',
        acceptedAnswer: { '@type': 'Answer', text: 'Generally at least one full year of continuous service is required to qualify for end-of-service gratuity in Qatar.' },
      },
    ],
  },
];

export default function QatarGratuityPage() {
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
              <span className="text-white font-medium">Qatar Gratuity Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Qatar Gratuity Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              The GCC's <span className="font-semibold">simplest formula</span> — 3 weeks' wage per year, no tiers
            </p>
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
              Qatar uses a single flat rate — 3 weeks' basic wage per year of service — with no step-up bands based
              on tenure, unlike Kuwait, Oman, or Bahrain.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <GratuityCalculatorShell country="qatar" />

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why Qatar's formula is easier to get right</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Qatar Labour Law No. 14 of 2004</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Where Kuwait, Oman, and Bahrain all step the rate up after a certain number of years of service,
                  Qatar applies the same rate — three weeks' basic wage — for every year worked, from year one
                  onward. That makes the math simpler and the result easier to predict early in your tenure, since
                  you don't need to know whether you'll cross a 3-, 5-, or 10-year threshold to estimate your payout.
                </p>
                <p>
                  The main thing to get right is still using your <em>basic</em> wage, not your total salary package
                  — housing and transport allowances are typically excluded from the gratuity calculation even though
                  they're part of what shows up on your payslip each month.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Qatar Labour Law
                No. 14 of 2004 as publicly reported. Individual settlements can include additional components not
                modeled here. Verify with Qatar's Ministry of Labour before relying on this figure. Not legal or
                financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// app/tools/bahrain-cpr-cost-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import BahrainCPRCostCalculator from './BahrainCPRCostCalculator';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/bahrain-cpr-cost-calculator';

export const metadata: Metadata = {
  title: 'Bahrain CPR & Work Permit Cost Calculator (2026) | JobMeter',
  description: 'Calculate the real cost of a Bahrain work permit and CPR renewal: LMRA work permit fee, basic healthcare fee, CPR card, and dependent permits.',
  keywords: [
    'bahrain cpr cost', 'bahrain work permit fee', 'lmra fees 2026', 'bahrain residency cost calculator',
    'bahrain cpr renewal fee', 'bahrain work permit renewal cost', 'bahrain healthcare fee expat',
    'bahrain dependent permit fee', 'iga cpr renewal',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Bahrain CPR & Work Permit Cost Calculator', url: pageUrl, description: 'Calculate the total cost of a Bahrain work permit renewal including CPR card and healthcare fees.', inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
    { '@type': 'ListItem', position: 3, name: 'Bahrain CPR Cost Calculator', item: pageUrl },
  ]},
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'How much does a Bahrain work permit cost?', acceptedAnswer: { '@type': 'Answer', text: 'LMRA work permit renewal costs BHD 105 for one year, BHD 52.50 for six months, or BHD 210 for two years, plus a basic healthcare fee of BHD 90/45/180 respectively.' } },
    { '@type': 'Question', name: 'How much is CPR renewal in Bahrain?', acceptedAnswer: { '@type': 'Answer', text: 'The CPR (national ID card) renewal fee for non-Bahraini residents is a flat BHD 10, regardless of your work permit duration.' } },
  ]},
];

export default function BahrainCPRCostPage() {
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
              <span className="text-white font-medium">Bahrain CPR Cost Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Bahrain CPR & Work Permit Cost Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">Work permit + healthcare fee + CPR — <span className="font-semibold">the full total</span></p>
            <p className="mt-4 text-blue-100 text-lg">Manama • Riffa • Muharraq • Isa Town</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Bahrain splits residency costs across two authorities — LMRA (work permit + healthcare fee) and IGA
              (CPR card). This calculator adds both together for the real total.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8"><BahrainCPRCostCalculator />

        <RelatedToolsStrip /></div>
        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Two authorities, one total cost</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">LMRA (work permit) + IGA (CPR card)</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Bahrain is unusual among GCC countries in splitting residency-related fees across two separate
                  authorities. Your work permit and its accompanying basic healthcare fee go through the Labour
                  Market Regulatory Authority (LMRA), while your CPR card — the actual national identity card — is
                  renewed separately through the Information & eGovernment Authority (IGA) at a flat BHD 10,
                  regardless of how long your work permit runs.
                </p>
                <p>
                  Choosing a longer work permit period (2 years vs. 6 months) lowers your effective annual cost since
                  the per-period fee doesn't scale linearly, but it also means committing further out. Dependent
                  permits add a flat BHD 90 each, renewal period aside.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Fees reflect LMRA and IGA
                schedules as publicly reported in 2026 and can change. Always confirm the current amount on
                bahrain.bh or LMRA's Expat Management System before paying. Not official guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

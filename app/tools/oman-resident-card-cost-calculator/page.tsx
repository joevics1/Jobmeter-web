// app/tools/oman-resident-card-cost-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import OmanResidentCardCostCalculator from './OmanResidentCardCostCalculator';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/oman-resident-card-cost-calculator';

export const metadata: Metadata = {
  title: 'Oman Resident Card Cost Calculator (2026) | JobMeter',
  description: "Calculate your Oman resident card renewal cost under ROP Decision No. 78/2025: RO 5/10/15 for 1/2/3-year validity, plus visa renewal and medical fitness fees.",
  keywords: [
    'oman resident card cost', 'oman rop fees 2026', 'oman residency renewal calculator',
    'oman visa renewal fee', 'oman resident card renewal', 'rop decision 78 2025',
    'oman medical fitness test fee', 'oman civil status division fee', 'oman resident card validity',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Oman Resident Card Cost Calculator', url: pageUrl, description: 'Calculate the total cost of renewing an Oman expatriate resident card under the 2025 ROP fee reform.', inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
    { '@type': 'ListItem', position: 3, name: 'Oman Resident Card Cost Calculator', item: pageUrl },
  ]},
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'How much does an Oman resident card cost?', acceptedAnswer: { '@type': 'Answer', text: 'Under ROP Decision No. 78/2025, the fee is RO 5 for one year of validity, RO 10 for two years, or RO 15 for three years, plus a separate OMR 11 visa/residency renewal fee.' } },
    { '@type': 'Question', name: 'Is a medical test required for Oman resident card renewal?', acceptedAnswer: { '@type': 'Answer', text: "Not always — it's a separate service required in some cases. When required, it costs OMR 30 for non-catering workers or OMR 40 for catering workers." } },
  ]},
];

export default function OmanResidentCardCostPage() {
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
              <span className="text-white font-medium">Oman Resident Card Cost Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Oman Resident Card Cost Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">Now with <span className="font-semibold">flexible 1-3 year validity</span> under the 2025 reform</p>
            <p className="mt-4 text-blue-100 text-lg">Muscat • Salalah • Sohar • Nizwa</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="1769800630" format="auto" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Oman recently gave expats a choice of 1, 2, or 3-year resident card validity, each with its own fee.
              Longer validity means fewer renewals but more paid upfront — see the real total here.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8"><OmanResidentCardCostCalculator />

        <RelatedToolsStrip /></div>
        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="3434236090" format="auto" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What changed with ROP Decision No. 78/2025</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Royal Oman Police, effective August 2025</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Before the 2025 reform, expatriate resident cards in Oman had a fixed validity — you renewed on
                  whatever schedule the previous rules set, whether that suited your situation or not. The new
                  decision gives residents a real choice: one, two, or three years, priced at RO 5, RO 10, and RO 15
                  respectively — so the per-year cost actually stays flat regardless of which option you pick, but
                  choosing a longer validity means fewer trips to renew.
                </p>
                <p>
                  Keep in mind the resident-card fee is separate from your visa/residency renewal fee (a flat OMR 11)
                  and from any underlying labour or work permit renewal with the Ministry of Labour — this
                  calculator covers the ROP card and visa renewal only, not the full picture of every fee an
                  employer might handle on your behalf.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on ROP Decision No.
                78/2025 as publicly reported. Fees and required steps can change — confirm current amounts on the ROP
                e-services portal before paying. Not official guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

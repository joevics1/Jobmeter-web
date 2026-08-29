// app/tools/kuwait-civil-id-cost-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import KuwaitCivilIDCostCalculator from './KuwaitCivilIDCostCalculator';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/kuwait-civil-id-cost-calculator';

export const metadata: Metadata = {
  title: 'Kuwait Civil ID & Residency Cost Calculator (2026) | JobMeter',
  description: "Calculate your Kuwait residency and Civil ID costs by sponsor category — investor/partner (KWD 50/yr), self-sponsored (KWD 500/yr), plus mandatory health insurance.",
  keywords: [
    'kuwait civil id cost', 'kuwait residency fee calculator', 'paci civil id fee', 'kuwait iqama cost',
    'article 24 residency kuwait', 'kuwait civil id renewal 2026', 'kuwait health insurance fee',
    'kuwait investor residency fee', 'kuwait domestic worker residency cost', 'kuwait self sponsored fee',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Kuwait Civil ID & Residency Cost Calculator', url: pageUrl, description: "Calculate Kuwait's residency and Civil ID costs by sponsor category under the 2025/2026 reform.", inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
    { '@type': 'ListItem', position: 3, name: 'Kuwait Civil ID Cost Calculator', item: pageUrl },
  ]},
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'How much does Kuwait residency cost self-sponsored residents?', acceptedAnswer: { '@type': 'Answer', text: 'Self-sponsored residents under Article 24 pay KWD 500 per year for their residency fee, plus KWD 3 for the Civil ID card and mandatory health insurance of roughly KWD 100 per year.' } },
    { '@type': 'Question', name: 'Is health insurance mandatory in Kuwait?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, under the 2025/2026 residency reform, mandatory health insurance fees were doubled to KWD 100 per year for most expatriate categories, and residency cannot be issued or renewed without valid coverage.' } },
  ]},
];

export default function KuwaitCivilIDCostPage() {
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
              <span className="text-white font-medium">Kuwait Civil ID Cost Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Kuwait Civil ID & Residency Cost Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">Costs now vary sharply by <span className="font-semibold">sponsor category</span> under the 2026 reform</p>
            <p className="mt-4 text-blue-100 text-lg">Kuwait City • Hawalli • Ahmadi • Farwaniya</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Kuwait's residency fees now depend heavily on which category you fall under — investors pay a fraction
              of what self-sponsored residents pay. Pick your category to see your real annual cost.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8"><KuwaitCivilIDCostCalculator />

        <RelatedToolsStrip /></div>
        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why your category changes the bill so much</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Ministerial Resolution No. 2249 of 2025</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Kuwait's late-2025 residency reform didn't just restructure dependent fees — it also widened the
                  gap between what different categories of resident pay for their own residency. Investors,
                  partners, and property owners pay a comparatively modest KWD 50 per year, while self-sponsored
                  residents under Article 24 pay ten times that: KWD 500 per year.
                </p>
                <p>
                  Standard private-sector employees under Article 18 don't typically see a separate large annual
                  residency fee billed to them directly — it's built into the employer's work-permit process, which
                  is why we haven't shown a standalone number for that category above. If you're unsure which
                  category applies to you, that distinction — whether you or your employer holds the sponsorship —
                  is the first thing to confirm.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Kuwait's residency
                reform effective 23 December 2025 as publicly reported. Fee schedules are set by executive by-law and
                can change — verify current rates with PACI or Kuwait's Ministry of Interior. Not legal or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

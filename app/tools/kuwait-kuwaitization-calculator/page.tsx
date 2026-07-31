// app/tools/kuwait-kuwaitization-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import LocalizationQuotaCalculator from '../_shared/LocalizationQuotaCalculator';

const pageUrl = 'https://jobmeter.app/tools/kuwait-kuwaitization-calculator';

export const metadata: Metadata = {
  title: 'Kuwaitization Ratio Calculator | JobMeter',
  description: "Calculate your company's Kuwaiti national employment ratio. Kuwaitization quotas are set sector-by-sector rather than one published number — this tool explains what that means for you.",
  keywords: [
    'kuwaitization calculator', 'kuwait national employment quota', 'kuwaitization ratio',
    'kuwait demographic structure committee', 'kuwait private sector nationalization',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Kuwaitization Ratio Calculator', url: pageUrl,
    description: "Calculate a company's Kuwaiti national employment ratio and understand how Kuwait's sector-by-sector quota system works.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Kuwaitization Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Does Kuwait publish one national Kuwaitization percentage?', acceptedAnswer: { '@type': 'Answer', text: "No — unlike Qatar's single 20%-by-2030 target, Kuwait sets Kuwaitization quotas sector-by-sector through its National Committee for the Organization of the Demographic Structure, and these have been tightening since a policy update in October 2023." } },
      { '@type': 'Question', name: 'How is Kuwaitization enforced?', acceptedAnswer: { '@type': 'Answer', text: 'Through the work-permit approval and renewal process rather than a single public target or portal — sector committees set and adjust quotas administratively.' } },
    ],
  },
];

export default function KuwaitizationPage() {
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
              <span className="text-white font-medium">Kuwaitization Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Kuwaitization Ratio Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              See your ratio — and understand why Kuwait <span className="font-semibold">doesn't publish one number</span>
            </p>
            <p className="mt-4 text-blue-100 text-lg">Kuwait City • Hawalli • Ahmadi • Farwaniya</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Kuwait sets Kuwaitization quotas sector-by-sector rather than one national figure. Calculate your ratio
              here, then confirm your specific sector's requirement with your PRO or Kuwait's Public Authority of Manpower.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <LocalizationQuotaCalculator country="kuwait" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why there's no single "Kuwaitization number"</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">National Committee for the Organization of the Demographic Structure</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Kuwait's approach to workforce nationalization is structurally different from Qatar's. Rather than
                  one published national target, quotas are set and adjusted sector-by-sector by a dedicated
                  committee established under Prime Ministerial Resolution No. 392 — which means a retail company
                  and an oil-and-gas contractor could face meaningfully different expectations, and neither number is
                  published in one central place the way Qatar's 20% target is.
                </p>
                <p>
                  What has been consistent is direction: quotas have been tightening since a October 2023 policy
                  update aimed at curbing the country's demographic imbalance, with foreign workers representing
                  around 79% of Kuwait's total workforce. If you're planning hiring around Kuwaitization, the most
                  reliable move is confirming your specific sector's current requirement directly rather than relying
                  on a general industry figure.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Kuwait does not publish one
                uniform private-sector Kuwaitization percentage — quotas are set administratively by sector.
                Calculate your ratio here, then confirm your specific obligation with Kuwait's Public Authority of
                Manpower. Not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// app/tools/bahrain-bahrainisation-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import LocalizationQuotaCalculator from '../_shared/LocalizationQuotaCalculator';

const pageUrl = 'https://jobmeter.app/tools/bahrain-bahrainisation-calculator';

export const metadata: Metadata = {
  title: 'Bahrainisation Ratio Calculator | JobMeter',
  description: "Calculate your company's Bahraini national employment ratio. Bahrain leans on Tamkeen training incentives more than hard quotas — this tool explains what that means for you.",
  keywords: [
    'bahrainisation calculator', 'bahrain national employment quota', 'bahrainization ratio',
    'bahrain LMRA', 'tamkeen bahrain', 'bahrain private sector localization',
    'bahrainisation percentage', 'bahrain workforce nationalization', 'bahrain training incentives',
    'bahrain labour market regulatory authority', 'bahrainisation compliance',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Bahrainisation Ratio Calculator', url: pageUrl,
    description: "Calculate a company's Bahraini national employment ratio and understand Bahrain's training-incentive-led approach to workforce localization.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Bahrainisation Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Does Bahrain have strict Bahrainisation quotas like other GCC countries?', acceptedAnswer: { '@type': 'Answer', text: 'Generally lower and less rigid than its GCC neighbors. Bahrain relies more heavily on training and wage-support incentives through its Tamkeen program than on hard mandated percentages.' } },
      { '@type': 'Question', name: 'Who enforces Bahrainisation?', acceptedAnswer: { '@type': 'Answer', text: "Bahrain's Labour Market Regulatory Authority (LMRA), which also manages the country's relatively flexible labour mobility framework — Bahrain has largely moved away from the traditional kafala sponsorship model." } },
    ],
  },
];

export default function BahrainisationPage() {
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
              <span className="text-white font-medium">Bahrainisation Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Bahrainisation Ratio Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Bahrain's approach leans on <span className="font-semibold">training incentives</span>, not just quotas
            </p>
            <p className="mt-4 text-blue-100 text-lg">Manama • Riffa • Muharraq • Isa Town</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Bahrain has generally lower and softer localization requirements than its GCC neighbors, backed more by
              Tamkeen training support than strict fines. Calculate your ratio here.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <LocalizationQuotaCalculator country="bahrain" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why Bahrain's model looks different from its neighbors</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Labour Market Regulatory Authority (LMRA) + Tamkeen</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  With a population of roughly 1.7 million, Bahrain takes a noticeably different approach to
                  workforce localization than Saudi Arabia, Qatar, or Oman. Rather than leading with hard percentage
                  mandates and steep fines, Bahrain — through its Tamkeen program — puts more weight on training
                  support, wage subsidies, and enterprise development, targeting sectors like financial services,
                  ICT, entrepreneurship, and professional services.
                </p>
                <p>
                  That doesn't mean there's no expectation at all — LMRA still sets and enforces requirements — but
                  the emphasis on raising Bahraini workforce capability rather than replacing expatriate labour at
                  speed means the mandated percentages tend to run lower than what you'd see in Qatar or Oman. This
                  calculator gives you your raw ratio; treat it as a starting point for a conversation with LMRA
                  rather than a compliance verdict.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Bahrain does not publish one
                uniform national Bahrainisation percentage — requirements vary and are enforced by LMRA. Confirm your
                specific obligation directly with LMRA or Tamkeen. Not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

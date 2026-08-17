// app/tools/kuwait-dependent-fee-calculator/page.tsx
import { Metadata } from 'next';
import KuwaitDependentFeeCalculator from './KuwaitDependentFeeCalculator';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://jobmeter.app/tools/kuwait-dependent-fee-calculator';

export const metadata: Metadata = {
  title: 'Kuwait Dependent Fee Calculator (2026 Residency Reform) | JobMeter',
  description: 'Calculate Kuwait\'s 2026 dependent residency fees by sponsor category: KWD 20/40/100 for spouse & children, KWD 300 for parents & other dependents, plus mandatory health insurance.',
  keywords: [
    'kuwait dependent fee calculator', 'kuwait residency fees 2026', 'kuwait family visa cost',
    'kuwait dependent visa fee', 'article 22 kuwait residency', 'kuwait iqama family fee',
    'kuwait expat dependent cost', 'kuwait residency law 2026', 'kuwait health insurance expat',
    'kuwait spouse residency fee', 'kuwait children residency cost', 'kuwait parent sponsorship fee',
    'ministerial resolution 2249 kuwait', 'kuwait family sponsorship cost', 'kuwait investor dependent fee',
    'kuwait self sponsored article 24', 'kuwait residency reform 2025', 'kuwait dependent fee increase',
  ],
  openGraph: {
    title: 'Kuwait Dependent Fee Calculator — 2026 Residency Reform',
    description: 'See exactly what sponsoring your family in Kuwait costs under the new fee structure, by sponsor category.',
  },
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Kuwait Dependent Fee Calculator',
    url: pageUrl,
    description: 'Calculate annual dependent residency fees in Kuwait under the 2025/2026 residency law reform, by sponsor category.',
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://jobmeter.app' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Kuwait Dependent Fee Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kuwait Dependent Fee Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KWD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much is the dependent fee in Kuwait in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under the reform effective 23 December 2025, standard private-sector sponsors (Article 18) pay KWD 20/year per spouse or child. Investors, partners, property owners, and religious figures pay KWD 40/year. Self-sponsored residents (Article 24) pay KWD 100/year. Parents and other extended-family dependents are charged KWD 300/year regardless of sponsor category.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do children and spouses fall under the same fee category in Kuwait now?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The 2025/2026 reform moved children and spouses of expatriates under a single unified Article 22 family residency category, replacing the previously fragmented system.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is health insurance required for dependents in Kuwait?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, mandatory private health insurance (estimated around KWD 100/year per long-term resident) applies to virtually all foreign residents and their dependents under the reformed rules.',
        },
      },
    ],
  },
];

export default function KuwaitDependentFeePage() {
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
              <span className="text-white font-medium">Kuwait Dependent Fee Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Kuwait Dependent Fee Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              See what sponsoring your family actually costs under Kuwait's <span className="font-semibold">2026 residency reform</span>
            </p>
            <p className="mt-4 text-blue-100 text-lg">Kuwait City • Hawalli • Ahmadi • Farwaniya</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Kuwait overhauled its residency and dependent fee structure in an executive by-law effective 23 December 2025.
              Enter your sponsor category and family size to see your real annual cost.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <KuwaitDependentFeeCalculator />

          <RelatedToolsStrip />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What changed in Kuwait's 2026 residency reform</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Ministerial Resolution No. 2249 of 2025</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Kuwait's Ministry of Interior restructured its residency framework in late 2025, unifying family visas
                  under a single Article 22 category and tying dependent fees to the sponsor's own residency type
                  rather than a flat rate for everyone. That means two people sponsoring the same family size can now
                  owe very different amounts depending on whether they're a standard employee, an investor, or
                  self-sponsored.
                </p>
                <p>
                  Parents and other extended-family dependents were moved to their own, much higher tier — KWD 300 per
                  year, up from KWD 200 — reflecting Kuwait's broader push to tie residency costs to economic
                  contribution rather than keep them flat across the board.
                </p>
                <p>
                  Alongside the fee changes, mandatory private health insurance now applies to nearly all long-term
                  foreign residents and their dependents, which is easy to forget when budgeting for a family move —
                  this calculator includes it as an optional line item so you can see the full picture, not just the
                  headline dependent fee.
                </p>
              </div>
            </div>

            <div className="px-10 py-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Frequently asked</h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mt-5">
                <p>
                  <strong>Who counts as a standard sponsor?</strong> Most private-sector employees working under
                  Article 18 residency fall into this category, which carries the lowest dependent fee tier (KWD
                  20/year per spouse or child).
                </p>
                <p>
                  <strong>Why is the parent/other-dependent fee so much higher?</strong> Kuwait treats extended-family
                  sponsorship (parents, siblings, and similar relatives) as a separate, higher-cost category from
                  immediate spouse/children sponsorship, and that gap widened further in the 2025/2026 reform.
                </p>
                <p>
                  <strong>Are these fees one-time or recurring?</strong> They're annual — paid at renewal, not just at
                  initial sponsorship — so the multi-year projection above matters more than the single-year number
                  if you're planning a longer stay.
                </p>
              </div>
            </div>

            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This tool provides estimates
                based on publicly reported figures from Kuwait's Ministry of Interior residency reform effective 23
                December 2025. Fee schedules are set by executive by-law and can change without much notice — always
                verify current rates directly with Kuwait's MOI before making financial decisions. Not legal or
                financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

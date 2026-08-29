// app/tools/oman-omanisation-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import LocalizationQuotaCalculator from '../_shared/LocalizationQuotaCalculator';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/oman-omanisation-calculator';

export const metadata: Metadata = {
  title: 'Omanisation Quota Calculator | Sector Targets & Fee Impact | JobMeter',
  description: "Calculate your company's Omanisation ratio against sector targets (banking 80-90%+, general private sector ~35%), and see how Ministerial Decision 602/2025 affects your work-permit fees.",
  keywords: [
    'omanisation calculator', 'oman localization quota', 'omanisation targets by sector',
    'oman ministerial decision 602 2025', 'oman work permit fee discount', 'omanisation compliance',
    'omanisation ratio calculator', 'oman banking sector quota', 'oman ministry of labour quota',
    'omanization percentage', 'oman workforce nationalization', 'omanisation fee incentive',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Omanisation Quota Calculator', url: pageUrl,
    description: "Calculate a company's Omanisation ratio against sector-specific targets and see the work-permit fee impact under Ministerial Decision 602/2025.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://www.jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Omanisation Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: "What is Oman's Omanisation target?", acceptedAnswer: { '@type': 'Answer', text: "Omanisation targets are sector-specific rather than one national number, ranging roughly 35% to 90%+ depending on activity. Banking and financial services carry the highest targets, often 80-90%+ in customer-facing and administrative roles." } },
      { '@type': 'Question', name: 'Does meeting Omanisation targets save money in Oman?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Ministerial Decision 602/2025 gives compliant employers a 30% discount on expatriate work-permit fees, while non-compliant employers face doubled fees.' } },
    ],
  },
];

export default function OmanisationPage() {
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
              <span className="text-white font-medium">Omanisation Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Omanisation Quota Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              See your ratio against sector targets — and the <span className="font-semibold">fee impact</span> of compliance
            </p>
            <p className="mt-4 text-blue-100 text-lg">Muscat • Salalah • Sohar • Nizwa</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Omanisation targets vary sharply by sector — banking runs as high as 80-90%+, while many general
              private-sector activities sit closer to 35%. Pick your sector for a realistic comparison.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <LocalizationQuotaCalculator country="oman" />

          <RelatedToolsStrip />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Why Omanisation is priced, not just enforced</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Ministerial Decision 602/2025</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Oman's Ministry of Labour ties Omanisation compliance directly to the foreign labour clearance
                  system — your ratio affects whether you can obtain, renew, or amend expatriate work visas at all,
                  continuously rather than at a single annual checkpoint.
                </p>
                <p>
                  On top of that, Ministerial Decision 602/2025 turned compliance into a direct cost lever: employers
                  who meet their Omanisation target get a 30% discount on expatriate work-permit fees, while
                  non-compliant employers pay double. That makes the sector you're in genuinely consequential —
                  banking-sector targets sit far higher than general private-sector activities, so the same
                  headcount decision carries very different financial weight depending on your industry.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Sector targets shown are
                representative figures reported publicly — your exact target is set per activity code by Oman's
                Ministry of Labour and can differ. Confirm your specific obligation with MOL. Not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

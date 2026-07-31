// app/tools/qatar-qatarization-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import AdUnit from '@/components/ads/AdUnit';
import LocalizationQuotaCalculator from '../_shared/LocalizationQuotaCalculator';

const pageUrl = 'https://jobmeter.app/tools/qatar-qatarization-calculator';

export const metadata: Metadata = {
  title: 'Qatarization Quota Calculator (Law No. 12 of 2024) | JobMeter',
  description: "Calculate your company's Qatarization ratio against Qatar's 20%-by-2030 private sector target under Law No. 12 of 2024, including fine exposure.",
  keywords: [
    'qatarization calculator', 'qatarization law 12 2024', 'qatar national employment quota',
    'qatarization compliance', 'qatar private sector quota', 'qatarization fines',
    'qatarization ratio calculator', 'qatar 2030 national target', 'qatar ministry of labour quota',
    'qatarization percentage', 'qatar workforce nationalization', 'qatarization sector targets',
  ],
  alternates: { canonical: pageUrl },
};

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'Qatarization Quota Calculator', url: pageUrl,
    description: "Calculate a company's Qatarization ratio against Qatar's national private-sector target under Law No. 12 of 2024.",
    inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Tools', url: 'https://jobmeter.app' },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Qatarization Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: "What is Qatar's Qatarization target?", acceptedAnswer: { '@type': 'Answer', text: "Qatar's Ministry of Labour targets 20% Qatari participation in private and mixed-sector employment by 2030, up from roughly 17% currently, under Qatarization Law No. 12 of 2024, which took effect in April 2025." } },
      { '@type': 'Question', name: 'Is there a public company-lookup for Qatarization status?', acceptedAnswer: { '@type': 'Answer', text: "No — unlike Saudi Arabia's Nitaqat system, Qatar doesn't run a public per-company tier lookup. Compliance is checked through Ministry of Labour field inspections rather than a searchable portal." } },
      { '@type': 'Question', name: 'What are the fines for Qatarization non-compliance?', acceptedAnswer: { '@type': 'Answer', text: 'Fines range from QAR 10,000 to QAR 100,000 per violation, escalating for repeat violations, alongside visa-processing restrictions and limitations on bidding for government contracts.' } },
    ],
  },
];

export default function QatarizationPage() {
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
              <span className="text-white font-medium">Qatarization Calculator</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Qatarization Quota Calculator</h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Check your ratio against Qatar's <span className="font-semibold">20%-by-2030</span> national target
            </p>
            <p className="mt-4 text-blue-100 text-lg">Doha • Al Rayyan • Al Wakrah • Lusail</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-4"><AdUnit slot="top-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Qatar doesn't run a public per-company lookup the way Saudi Arabia's Nitaqat does — enter your own
              workforce numbers to see where you stand against the national target.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <LocalizationQuotaCalculator country="qatar" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6"><AdUnit slot="mid-page-ad" /></div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-10 pt-10 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">How Qatarization actually works, compared to Nitaqat</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Qatarization Law No. 12 of 2024</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Qatarization shares the same underlying goal as Saudi Arabia's Nitaqat — increasing national
                  participation in the private sector — but it works differently in practice. Where Nitaqat assigns
                  every company a public, color-coded tier that anyone can look up, Qatarization is enforced through
                  Ministry of Labour field inspections against a single national target, currently 20% by 2030.
                </p>
                <p>
                  Expatriates make up roughly 85–90% of Qatar's total population and an even higher share of its
                  private-sector workforce, with only about 10% of Qataris historically working outside government
                  roles. That's the gap the 2030 target is meant to close, and it's why enforcement has moved from
                  informal policy to a binding law with real financial penalties since April 2025.
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> Based on Qatarization Law
                No. 12 of 2024 as publicly reported. Sector-specific enforcement priorities can shift — confirm your
                company's specific obligations with Qatar's Ministry of Labour. Not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

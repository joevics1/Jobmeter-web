// app/tools/remittance-estimator/page.tsx
import { Metadata } from 'next';
import RemittanceEstimatorTool from './RemittanceEstimatorTool';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/remittance-estimator';

export const metadata: Metadata = {
  title: 'Gulf Remittance Estimator 2026 | UAE, Saudi, Qatar to Home Country',
  description: 'Realistic monthly savings & remittance calculator for Gulf expats. Estimate take-home pay after living expenses in Dubai, Riyadh, Doha & more. Convert to INR, PHP, PKR, NGN, BDT with live rates & fees.',
  keywords: [
    'gulf remittance calculator', 'UAE salary to India', 'Dubai savings calculator',
    'Saudi remittance to Pakistan', 'Qatar to Philippines', 'expat savings GCC',
    'cost of living Dubai expat', 'remittance estimator Gulf', 'send money home from UAE',
    'AED to INR remittance estimator 2026', 'Gulf expat savings calculator', 'Wise fee calculator UAE',
    'monthly remittance calculator UAE/Saudi/Qatar', 'Dubai salary after expenses remittance'
  ],
  openGraph: {
    title: 'Gulf Remittance Estimator - How Much Can You Send Home?',
    description: 'Practical tool for expats in UAE, KSA, Qatar. See realistic remittances after rent, food, and lifestyle costs.',
    images: [{ url: '/og-remittance-tool.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Gulf Remittance Estimator',
    url: pageUrl,
    description: 'A realistic monthly savings and remittance calculator for Gulf expats in the UAE, Saudi Arabia, and Qatar.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'JobMeter',
      url: 'https://www.jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.jobmeter.app/og-remittance-tool.jpg',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Gulf Remittance Estimator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gulf Remittance Estimator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculate net savings and remittance potential from GCC countries to home countries like India, Pakistan, and Philippines.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the Gulf Remittance Estimator',
    description: 'Calculate your realistic monthly savings and remittance potential from the Gulf to your home country.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Input Income',
        text: 'Enter your monthly tax-free salary in AED, SAR, or QAR.',
      },
      {
        '@type': 'HowToStep',
        name: 'Detail Expenses',
        text: 'Add costs for housing, food, transport, and utilities based on your lifestyle profile.',
      },
      {
        '@type': 'HowToStep',
        name: 'Check Remittance',
        text: 'Review the final amount available for remittance after all local costs and transfer fees.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much can I send home from Dubai/UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The amount depends on your lifestyle and salary. A realistic Dubai budget shows that housing and utilities can take 40-55% of your income.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a limit to foreign remittance from the Gulf?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There is generally no maximum limit, but transfers over $10,000 may require source-of-funds verification.',
        },
      },
    ],
  },
];

export default function RemittanceEstimatorPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-emerald-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Gulf Remittance Estimator</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Gulf Remittance Estimator
            </h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Know exactly <span className="font-semibold">How much can I send home from Dubai/UAE</span> every month
            </p>
            <p className="mt-4 text-emerald-100 text-lg">
              UAE • Saudi Arabia • Qatar • Kuwait • Bahrain • Oman
            </p>
          </div>
        </div>

        {/* Top Ad */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4198231153" format="auto" />
*/}
        </div>

        {/* Condensed intro container */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this 2026 <strong>Gulf expat financial planning tool</strong> to calculate your <strong>monthly remittance calculator UAE/Saudi/Qatar</strong> potential. This <strong>Gulf salary to savings calculator</strong> helps you turn your tax-free income into a <strong>realistic Dubai budget</strong> after factoring in <strong>shared accommodation savings Dubai</strong> and live exchange rates.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <RemittanceEstimatorTool />

          <RelatedToolsStrip />
        </div>

        {/* Middle Ad */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4690286797" format="fluid" layout="in-article" />
*/}
        </div>

        {/* SEO & Educational Content */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section: Remittance Analysis */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Expat Remittance Calculator Gulf 2026</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Dubai salary after expenses remittance</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Calculating your <strong>monthly remittance calculator for expats</strong> involves more than just looking at the exchange rate. To understand <strong>how much can I send home from Dubai</strong>, you must navigate the <strong>UAE expat cost of living 2026</strong> metrics. While a tax-free salary in the GCC is the primary draw, the <strong>Dubai remittance to India</strong> or <strong>Saudi Arabia salary savings calculator</strong> results depend heavily on lifestyle choices.
                </p>
                <p>
                  Whether you are looking for an <strong>AED to INR remittance estimator 2026</strong> or a <strong>UAE to Pakistan remittance calculator</strong>, the impact of <strong>remittance immigration</strong> trends and the <strong>global remittance market size</strong> cannot be ignored. The <strong>economic impact of remittances</strong> is vast, acting as a lifeline for families in the Philippines, Bangladesh, and Nigeria. Using a <strong>GCC cost of living and remittance tool</strong> allows for <strong>expat remittance planning</strong> that is both accurate and data-driven.
                </p>
                <p>
                  This <strong>Gulf remittance estimator</strong> uses <strong>Numbeo-based cost of living GCC</strong> data to provide <strong>optimization insights expat savings</strong>. By choosing between <strong>aggressive saver vs balanced family remittance scenarios</strong>, users can visualize how <strong>shared housing</strong> or <strong>home cooking savings expat</strong> habits can generate an additional 1,500–3,000 AED/SAR in monthly savings.
                </p>
              </div>
            </div>

            {/* Section: Country-Specific Planning */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">UAE to India, Pakistan & Philippines Remittance</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Riyadh / Doha / GCC salary remittance</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  For the thousands of expats searching for <strong>cost of living Dubai for Indians / Pakistanis / Filipinos</strong>, our <strong>UAE to India remittance calculator</strong> and <strong>UAE to Nigeria money transfer calculator</strong> offer precise estimates. The <strong>lowest cost remittance corridor GCC-India</strong> is often the most competitive, but fees vary between the <strong>Wise fee calculator UAE</strong>, <strong>Remitly fee calculator UAE</strong>, and traditional banks.
                </p>
                <p>
                  When comparing <strong>Wise vs Remitly vs Bank fees UAE to India</strong>, you must also look at the <strong>live exchange rate AED to INR</strong>. Many users track the <strong>Gulf Exchange rate today</strong> or the <strong>LuLu Exchange Qatar rate today</strong> using a <strong>Gulf Exchange app</strong> or <strong>WorldRemit exchange rate calculator</strong>. Finding a <strong>Gulf Exchange near me open now</strong> is often a weekend ritual for workers in <strong>Plaza Mall</strong> or Riyadh.
                </p>
                <p>
                  Planning your <strong>Qatar expat budget planner</strong> or <strong>Saudi job offer</strong> analysis requires understanding <strong>realistic expenses buffer remittance</strong>. If your <strong>housing is 40-55% expenses GCC</strong>, your <strong>Dubai salary after expenses remittance</strong> will be lower than expected unless you adopt a <strong>bachelor lifestyle cost Gulf</strong> model.
                </p>
              </div>
            </div>

            {/* Section: Technical Calculations */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Payroll & End of Service Logic</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">How is end of service calculated in UAE?</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Beyond monthly transfers, long-term savings are tied to gratuity. Many ask: <strong>how is end of service calculated in UAE?</strong> and <strong>how do I calculate my pay per day?</strong> Generally, <strong>is salary calculated on 30 or 31 days in the UAE?</strong> Most companies use a 30-day divisor for the <strong>daily rate from monthly salary in UAE</strong>. These figures are crucial for <strong>tax-free salary savings calculator Gulf</strong> outputs.
                </p>
                <p>
                  Our <strong>JobMeter remittance tool</strong> and <strong>Gulf jobs savings estimator</strong> integrate these labor laws. Whether you are a <strong>single professional Dubai expenses</strong> expert or managing a <strong>family vs bachelor lifestyle cost Gulf</strong>, understanding <strong>how much Gulf expats send home monthly</strong> helps in setting personal benchmarks. <strong>Expat reports Dubai rent food transport schooling costs</strong> indicate that schooling is the largest secondary expense for families in the UAE and Qatar.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Transfer Method</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Fee Type</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Wise / Remitly</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Low Transparent Fees</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Best exchange rates for small/medium amounts</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Local Exchange Houses</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Fixed Transaction Fee</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Cash pickups and reliability for India/Pakistan</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Commercial Banks</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">High Spread + SWIFT fees</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Large transfers ($10,000+) and property payments</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: FAQ & Global Data */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions on Gulf Remittances</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is the maximum limit for foreign remittance?</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">In most GCC countries, there is no hard cap, but <strong>what happens if I transfer more than $10,000?</strong> You will likely need to provide an <strong>offer letter</strong> or proof of income to comply with <strong>remittance portal</strong> regulations. For a <strong>$300,000 wire transfer</strong>, expect 3-5 business days for processing.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Where do expats send the most money home?</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">According to <strong>World Bank remittance data GCC</strong>, the <strong>top 3 countries with the highest remittances</strong> from the Gulf are India, China, and the Philippines. The <strong>best country for expats to make money</strong> remains the UAE and Saudi Arabia due to high tax-free base salaries.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Is there any tax on foreign remittance?</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">The UAE and Saudi Arabia do not tax the outward transfer of money. However, <strong>how much can expats send home from gulf remittance 2022</strong> data shows that home countries (like India under LRS) may have specific TCS or income tax implications on received funds.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do I track my Gulf Exchange transaction?</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Use the <strong>Gulf Exchange transaction tracking</strong> feature on their official app. This is common for workers sending money from <strong>Doha</strong> or <strong>Dubai</strong> to keep a record for <strong>remittance benefits</strong> and tax filings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Long-form SEO Content */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Strategic Financial Planning for GCC Expats</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">2026 Gulf expat financial planning tool</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The journey of an expat in the Middle East often begins with a <strong>job offer letter</strong>. However, the true value of that <strong>tax-free salary</strong> is only realized through diligent use of a <strong>Gulf salary to savings calculator</strong>. To maximize your <strong>remittance estimator Gulf</strong> results, you must look beyond the monthly wage. 
                </p>
                <p>
                  Consider <strong>cost of living Dubai vs India</strong>. While a salary might be 5x higher in the UAE, the <strong>monthly expenses in Dubai</strong>—specifically rent and schooling—can be 10x higher. This is why our <strong>personalized lifestyle profile remittance</strong> tool (Single, Family, Bachelor) is so critical. An <strong>editable expense sliders calculator</strong> allows you to adjust for <strong>home cooking savings</strong> or <strong>shared accommodation</strong>, which are the <strong>pro tips remittance Gulf</strong> experts swear by to save an extra <strong>1,500-3,000 AED</strong>.
                </p>
                <p>
                  The <strong>remittance fees comparison Wise Remitly</strong> section of our tool ensures you don't lose 3-5% of your hard-earned money to hidden bank spreads. In 2026, <strong>favourable rates</strong> and digital fintech apps have made the <strong>best money transfer UAE to India/Pakistan/Bangladesh/Philippines</strong> easier than ever. 
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This <strong>gulf remittance calculator</strong> is an estimation tool based on <strong>World Bank remittance data</strong>, <strong>Numbeo</strong>, and <strong>expat surveys</strong>. Actual <strong>remittance portal</strong> rates and <strong>Gulf Exchange</strong> fees vary. Not financial advice.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
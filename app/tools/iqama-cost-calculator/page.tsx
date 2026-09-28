// app/tools/iqama-cost-calculator/page.tsx
import { Metadata } from 'next';
import IqamaCalculatorClient from './IqamaCalculatorClient';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/iqama-cost-calculator';

export const metadata: Metadata = {
  title: 'Iqama Cost & Renewal Fee Calculator Saudi Arabia | Real Total Fees',
  description: 'Calculate the total iqama renewal cost in KSA. Includes base fees, Nitaqat expat levy, dependent fees, insurance, and Maktab Amal fees for workers and sponsors.',
  keywords: [
    'iqama renewal cost', 'iqama renewal fees', 'iqama cost calculator', 'iqama fees saudi arabia',
    'saudi iqama renewal cost', 'iqama renewal calculator', 'iqama cost ksa', 'nitaqat levy calculator',
    'expat levy saudi arabia', 'work permit levy ksa', 'nitaqat expat fee', 'maktab amal fee',
    'work permit cost saudi arabia', 'qiwa work permit calculator', 'dependent iqama fee',
    'family iqama cost saudi', 'dependent levy saudi arabia', 'sponsor dependent fees ksa',
    'family residency fee saudi', 'absher iqama renewal', 'qiwa iqama', 'muqeem iqama renewal',
    'absher iqama fees', 'qiwa fees calculator', 'saudi residency cost', 'ksa expat cost calculator',
    'total iqama renewal cost', 'iqama renewal with dependents', 'iqama insurance gosi fees',
    'real cost of iqama renewal', 'iqama penalty fees calculator', 'domestic worker iqama fee',
    'private sector iqama renewal', 'iqama renewal fees for 1 year', 'iqama renewal fees for 6 months',
    'saudi iqama fees', 'iqama renewal fees for 1 month', 'iqama fees check online',
    'labour iqama fees in saudi arabia', 'iqama renewal fees for 3 months', 'iqama renewal cost including nitaqat',
    'how much is iqama renewal with family', 'expat total residency cost saudi', 'saudi sponsor iqama expenses',
    'iqama fees for workers and dependents', 'nitaqat tier levy impact', 'hidden costs iqama renewal ksa'
  ],
  openGraph: {
    title: 'Iqama Cost Calculator Saudi Arabia - Real Total Cost',
    description: 'Calculate your complete Iqama renewal expenses including all hidden levies and fees.',
    images: [{ url: '/og/iqama-calculator.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Iqama Cost & Renewal Fee Calculator Saudi Arabia',
    url: pageUrl,
    description: 'Comprehensive calculator for Saudi residency (Iqama) renewal costs, covering Nitaqat, dependent fees, and work permits.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Gulf Jobmeter',
      url: 'https://www.jobmeter.app',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Iqama Cost Calculator', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Iqama Cost Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculates the real total cost of Iqama renewal in Saudi Arabia including expat levies and dependent fees.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to calculate Iqama renewal fees',
    description: 'Steps to use the Iqama renewal calculator to find total costs.',
    step: [
      { '@type': 'HowToStep', name: 'Select Profession', text: 'Choose between Private Sector or Domestic Worker.' },
      { '@type': 'HowToStep', name: 'Enter Dependents', text: 'Input the number of family members to calculate dependent levy.' },
      { '@type': 'HowToStep', name: 'Check Nitaqat Tier', text: 'Select your company color to determine the Expat Levy rate.' }
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does it cost to renew my IQAMA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The base iqama renewal fees are SAR 650 for the private sector and SAR 600 for domestic workers, plus work permit fees and dependent levies.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who pays the Iqama renewal fees?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'According to Saudi Labor Law Article 40, the employer must bear the cost of the work permit and Iqama renewal.'
        }
      }
    ]
  }
];

export default function IqamaCostCalculatorPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 text-white pt-16 pb-12">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-green-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Iqama Cost Calculator</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6 text-sm">
              🇸🇦 Saudi Arabia • Live Fee Tracking
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Iqama Cost & Renewal Fee Calculator
            </h1>
            <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed">
              Estimate the <span className="font-semibold underline decoration-emerald-400">Real Total Cost</span> of your Saudi residency renewal including Expat Levy, Dependent Fees, and Work Permits.
            </p>
          </div>
        </div>

        {/* Top Ad Unit */}
        <div className="max-w-5xl mx-auto px-6 py-4">
          <AdUnit slot="3434236090" format="auto" />
        </div>

        {/* Intro Container - Before Tool */}
        <div className="max-w-5xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this <strong className="text-emerald-600">iqama cost calculator</strong> to accurately estimate your <strong className="text-emerald-600">saudi iqama renewal cost</strong>. We integrate <strong className="text-emerald-600">nitaqat levy calculator</strong> logic, <strong className="text-emerald-600">dependent iqama fee</strong> structures, and <strong className="text-emerald-600">qiwa work permit calculator</strong> data to give you the most precise <strong className="text-emerald-600">total iqama renewal cost</strong> available for residents and sponsors in the Kingdom.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <IqamaCalculatorClient />

          <RelatedToolsStrip />
        </div>

        {/* Bottom Ad Unit */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          <AdUnit slot="1633803336" format="auto" />
        </div>

{/* SEO Content Section - Approx 2000 words */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section 1: Introduction */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Understanding Iqama Renewal Fees in Saudi Arabia</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">The complete financial breakdown for expats</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Navigating the iqama renewal fees landscape can be complex for any expatriate living in the Kingdom of Saudi Arabia. The saudi iqama renewal cost is not just a single payment but a combination of several government levies and service fees that must all be settled before your residency permit is extended. Whether you are an individual looking for an iqama cost calculator to plan your household budget or a company HR manager calculating the work permit cost saudi arabia for an entire workforce, understanding the complete iqama fees saudi arabia structure is essential for legal compliance and financial planning.
                </p>
                <p>
                  The total iqama renewal cost comprises the base residency fee, the maktab amal fee — also known as the work permit renewal fee — and the dependent levy saudi arabia for any family members under your sponsorship. These costs are significantly influenced by the nitaqat tier levy impact, which determines how much an employer pays for each foreign worker under the expat levy saudi arabia programme. Using a reliable iqama renewal calculator helps you avoid unpleasant surprises during the absher iqama renewal process and ensures you are financially prepared well before your iqama expiry date.
                </p>
                <p>
                  This guide is designed to walk you through every component of the iqama renewal cost in Saudi Arabia, from government-mandated base fees to the often-overlooked hidden charges that can significantly increase your actual outlay. Whether you are renewing for yourself, your family, or managing iqama renewals for a company, this comprehensive breakdown will serve as your go-to reference.
                </p>
              </div>
            </div>

            {/* Section 2: Detailed Fee Breakdown */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Breakdown of Saudi Residency Cost</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">From base fees to hidden levies</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  When you ask "How much does it cost to renew my iqama?", the answer depends heavily on the renewal duration and your company's Saudization status. The current system allows for iqama renewal fees for 1 year, iqama renewal fees for 6 months, and even iqama renewal fees for 3 months, offering flexibility based on your residency plans. The private sector iqama renewal base fee is SAR 650 per year, while the domestic worker iqama fee sits at SAR 600 annually — both payable to the General Directorate of Passports (Jawazat).
                </p>
                <p>
                  However, the largest and often most misunderstood portion of the total expense is the work permit levy ksa, paid to the Ministry of Human Resources and Social Development. If your company has not achieved a high Saudization percentage, the nitaqat expat fee can range from SAR 400 to SAR 900 per month depending on whether your employer falls in the Platinum, Green, Yellow, or Red nitaqat band. This means the iqama renewal cost including nitaqat can exceed SAR 11,000 annually for a single employee in a low-band company. The nitaqat levy calculator built into this tool accounts for these tier variations automatically, giving you a realistic saudi iqama renewal cost estimate based on your employer's actual classification.
                </p>
                <p>
                  It is also important to note that the work permit fee in saudi arabia must be renewed before or alongside the iqama itself. Allowing the maktab amal to lapse can trigger additional fines and administrative delays. The labour iqama fees in saudi arabia are non-negotiable and must be settled in full via SADAD or the Qiwa platform before the iqama can be printed or digitally renewed.
                </p>
              </div>
            </div>

            {/* Section 3: Dependent Fees */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Family and Dependent Residency Costs</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Calculating the cost for family sponsorship</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  For those living in Saudi Arabia with their families, the dependent iqama fee represents a significant and recurring monthly obligation. The family iqama cost saudi is currently calculated at SAR 400 per month per dependent — this applies to spouses, children, and any other family members listed under your sponsorship. If you are researching how much is iqama renewal with family, you must multiply this monthly rate by both the number of dependents and the renewal duration in months. A family of four (one spouse and two children) would incur an additional SAR 14,400 in dependent fees alone for a one-year renewal period.
                </p>
                <p>
                  This sponsor dependent fees ksa amount must usually be paid upfront through the absher iqama fees portal before any renewal step can be completed, whether on qiwa iqama, muqeem iqama renewal, or the Jawazat system. For employers who sponsor large families, this fee alone can become one of the largest line items in the expatriate benefits budget. For this reason, many companies now include the dependent levy saudi arabia in their relocation and compensation packages to attract top international talent.
                </p>
                <p>
                  Missing a dependent fee payment can trigger the iqama penalty fees calculator scenario, where accrued fines add up month over month on top of the base fees. The iqama renewal with dependents process also legally requires valid health insurance for every family member, as Saudi Arabia mandates comprehensive medical coverage for all residents. This additional insurance cost — while not a government fee — must be factored into the real cost of iqama renewal for any family. Always ensure your health insurance policy is active and linked to your iqama file before initiating the renewal process.
                </p>
              </div>
            </div>

            {/* Section 4: Platforms and Procedures */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Absher, Qiwa, and Muqeem: The Digital Ecosystem</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Where to pay and how to process</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Modern Saudi Arabia has fully digitised its residency and labour services through a suite of government portals. The qiwa fees calculator and qiwa work permit calculator tools available on the Qiwa platform are essential for HR departments managing large expatriate workforces, allowing them to calculate and settle work permit fees in bulk. The absher iqama renewal portal is the primary channel for individual expatriates and domestic sponsors to check status, pay fees, and receive digital iqama confirmation. The muqeem iqama renewal system, meanwhile, is typically used by larger establishments and companies to manage their employees' residency records at scale.
                </p>
                <p>
                  To perform an iqama fees check online, you should log into the absher iqama fees section using your registered mobile number and national ID or iqama number. The portal displays a real-time breakdown of all outstanding amounts, including the base residency fee, work permit levy, and any overdue dependent charges. Remember that iqama insurance gosi fees — contributions to the General Organization for Social Insurance — and active medical insurance must both be linked to your iqama number and passport before the system unlocks the final payment step of the saudi iqama renewal cost settlement. Without these prerequisites, the digital renewal flow will be blocked regardless of how much money is available for payment.
                </p>
                <p>
                  The Saudi government has also integrated the iqama renewal process with SADAD, the national electronic bill payment network, allowing payments to be made directly through bank mobile apps, ATMs, or internet banking under the "Government Services – Alien Control" category. This integration has made iqama renewal fees payment faster and more transparent, eliminating the need to visit government offices in most standard renewal cases. However, first-time iqama issuances and certain complex cases such as profession changes or sponsor transfers may still require an in-person visit to the Jawazat office.
                </p>
              </div>
            </div>

            {/* Section 5: Long-form Content */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Strategic Planning with the Gulf Jobmeter Iqama Calculator</h3>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The ksa expat cost calculator on this page is designed to provide a comprehensive, high-level job offer analysis for professionals considering a move to the Kingdom. Many expats focus almost exclusively on the gross monthly salary figure during negotiations, but the hidden costs iqama renewal ksa can significantly erode take-home value if not accounted for upfront. For example, understanding the nitaqat tier levy impact enables you to assess your prospective employer's Saudization compliance and evaluate whether your saudi sponsor iqama expenses are likely to remain stable or could increase in future renewal cycles.
                </p>
                <p>
                  The iqama cost gulf jobmeter tool is built to be the most accurate and up-to-date total iqama renewal cost resource available for expatriates and HR professionals in the GCC region. It tracks everything from iqama renewal fees for 1 month through to full annual cycles, supporting short-term contract workers and long-term residents alike. For employers, the labour iqama fees in saudi arabia data integrated into this calculator simplifies fiscal year workforce budgeting and compliance planning, especially during periods of Saudization quota changes or nitaqat reclassification reviews.
                </p>
                <p>
                  Common questions such as "How much is the iqama fee for 12 months?" are directly addressed by the calculator: the total typically includes SAR 650 (base residency fee) + SAR 400–900 per month (work permit levy based on nitaqat band) + SAR 400 per month per dependent + applicable health insurance costs. If you currently hold an expired iqama, the iqama penalty fees calculator logic indicates a standard fine of SAR 500 for the first offense, with penalties increasing substantially for extended overstay periods. Prompt renewal is always strongly advised to avoid compounding fines, travel bans, and restrictions on banking and employment activities.
                </p>
                <p>
                  When comparing the overall saudi residency cost versus other GCC countries such as the UAE or Qatar, the expat total residency cost saudi is distinctive due to its tiered levy system directly linked to employer Saudization compliance. This means two employees at different companies — earning identical salaries — can have very different true employment costs for their respective employers. Always ensure your iqama fees check online is conducted through official government channels such as Absher or Qiwa, and use this iqama renewal calculator for preliminary financial planning and salary negotiation benchmarking before signing any employment contract.
                </p>
                <p>
                  For professionals considering the Premium Residency programme — also known as the Saudi Green Card — this iqama renewal calculator can also serve as a comparison baseline. Premium Residency holders are exempt from the standard nitaqat levy and certain dependent fees, making the long-term cost of living in Saudi Arabia potentially lower for qualifying high-net-worth individuals or highly skilled professionals. However, the upfront premium residency fee is significantly higher, so a multi-year cost projection using our saudi iqama renewal cost data is recommended before making that decision.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="px-10 py-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How can I pay the Iqama renewal fees?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Payment is made via SADAD through your bank's mobile app or ATM under the Government Services section for "Alien Control".</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What documents do I need to renew my Iqama?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">You need a valid passport, active medical insurance, cleared traffic fines, and a paid work permit (Maktab Amal).</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I renew my Iqama without a sponsor?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Generally, no. You require a sponsor (Kafeel) unless you are under the Premium Residency (Green Card) scheme.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What happens if Iqama expires?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">You face financial penalties, potential bank account freezing, and legal restrictions on travel or work.</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This iqama cost calculator provides estimates based on 2026 public data. Actual fees may vary by company tier (Nitaqat), sector, and individual status. Always verify via Absher or Qiwa.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
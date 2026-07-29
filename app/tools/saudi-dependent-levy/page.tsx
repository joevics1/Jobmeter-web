// app/tools/saudi-dependent-levy/page.tsx
import { Metadata } from 'next';
import SaudiDependentLevyTool from './SaudiDependentLevyTool';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';

const pageUrl = 'https://jobmeter.app/tools/saudi-dependent-levy';

export const metadata: Metadata = {
  title: 'Saudi Dependent Levy Calculator | KSA Family Fee Tool',
  description: 'Calculate Saudi Arabia dependent levy (family fee) for expats. SAR 400/month per dependent. Spouse, children, parents & more. Real-time breakdown, exemptions, projections & payment planner.',
  keywords: [
    'saudi dependent levy calculator', 'ksa family fee', 'dependent levy saudi arabia',
    'iqama dependent fee', 'expat family cost saudi', 'muqeem levy calculator',
    'sar 400 dependent', 'saudi arabia expat costs', 'riyadh family expenses',
    'saudi family fee calculator', 'how to pay dependent fee muqeem', 'sadad family levy'
  ],
  openGraph: {
    title: 'Saudi Dependent Levy Calculator - Gulf Job Meter',
    description: 'Instantly calculate your monthly & annual family levy in Saudi Arabia. Includes exemptions, projections & full breakdown.',
    images: [{ url: '/og-levy-tool.jpg' }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Saudi Dependent Levy Calculator',
    url: pageUrl,
    description: 'An online expat utility designed to calculate the monthly and annual companion fees and dependent levy obligations in Saudi Arabia.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://jobmeter.app/og-levy-tool.jpg',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobmeter.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://jobmeter.app/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Saudi Dependent Levy Calculator',
        item: pageUrl,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Saudi Dependent Levy Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'A financial tool designed to calculate the accurate ksa family fee calculator sums, dependent levy saudi arabia metrics, and tracking monthly SAR 400 fees.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SAR',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to calculate expat dependent fee saudi online',
    description: 'Process to calculate your annual family fee projection saudi values along with iqama dependent fee totals.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Input Sponsoring Dependents count',
        text: 'Input the accurate number of companions including spouse, children under your direct sponsorship registration.',
      },
      {
        '@type': 'HowToStep',
        name: 'Verify Expiry and Timeline Months',
        text: 'Select your upcoming renewal period or choose quarterly iqama renewal tracking increments.',
      },
      {
        '@type': 'HowToStep',
        name: 'Process Estimation Output',
        text: 'View your total breakdown including individual sar 400 per dependent monthly calculations and aggregate iqama renewal dependent levy bills.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much is the dependent fee in Saudi Arabia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The current rate is exactly SAR 400 monthly per dependent or companion under your personal iqama sponsorship system.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the dependent tax in Saudi Arabia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is technically referred to as the dependent levy saudi arabia or family fee ksa, enforced to balance non-Saudi demographic infrastructure costs.',
        },
      },
    ],
  },
];

export default function SaudiDependentLevyPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            
            {/* Breadcrumb — inside hero matching sample */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Saudi Dependent Levy Calculator</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Saudi Dependent Levy Calculator
            </h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Calculate <span className="font-semibold">True Family Fee Balances</span> with Live Projections, Expiry Matching & Payment Mapping
            </p>
            <p className="mt-4 text-blue-100 text-lg">Riyadh • Jeddah • Dammam • Mecca • Medina • Jubail</p>
          </div>
        </div>

        {/* Top Ad */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <AdUnit slot="top-ad" />
        </div>

        {/* Condensed intro container before the tool inside white content card */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Utilize this modern saudi dependent levy calculator to manage your ksa family fee calculator estimates, process exact dependent levy saudi arabia metrics, trace your iqama dependent fee costs, and break down the standard sar 400 dependent fee for your household before initiating payment.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <SaudiDependentLevyTool />
        </div>

        {/* Ad */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <AdUnit slot="mid-page-ad" />
        </div>

        {/* SEO Content Section — Designed perfectly around tools framework */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Block 1: Technical Utility Mapping */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">KSA Family Fee Calculator Operational Structure</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Understanding expat dependent fee calculator parameters</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Sustaining an international workforce requires absolute visibility into regulatory fiscal framework elements. Our digital system functions seamlessly as a saudi dependent levy calculator that computes precise updates concerning your current financial obligations. Tracking your domestic expenses alongside official updates can be challenging without automated aids. For this reason, using a verified ksa family fee calculator eliminates arbitrary planning errors and gives you instant visibility over household costs.
                </p>
                <p>
                  The implementation of the strict dependent levy saudi arabia parameters changed how expatriate professional groups structure long-term assignments. Utilizing an expat dependent fee calculator enables individual users to assess monthly breakdowns against fixed overhead constraints. Rather than guessing individual requirements, our saudi arabia dependent fee system clarifies standard expenses instantly.
                </p>
                <p>
                  To manage long-term planning, processing your dynamic bills via an iqama dependent fee processing platform helps protect against unexpected surprises during visa validations. Our interface relies on standard backend protocols to act as a muqeem dependent levy calculator, cross-checking parameters automatically to avoid manual calculation errors. This ensures your household calculations align properly with current municipal regulations.
                </p>
                <p>
                  Every expatriate must track the standard sar 400 dependent fee monthly allocation to assess overall family levy ksa baseline changes. Relying on an advanced saudi family fee calculator speeds up verification and lets you run multi-year projections directly from any device. This enables efficient financial planning for any number of companions.
                </p>
              </div>
            </div>

            {/* Block 2: Location-Specific Variance & Allocations */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Regional Expense Optimization Modalities</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Riyadh, Jeddah, and regional corporate variables</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Operational expenses vary widely depending on your specific city in Saudi Arabia. Using a localized riyadh family fee calculator helps professional expatriates analyze municipal requirements alongside general living adjustments. At the same time, deploying a jeddah dependent levy tool ensures tracking for coastal industrial hubs matches central parameters perfectly.
                </p>
                <p>
                  When setting up a balanced corporate infrastructure budget, using an integrated ksa expat levy calculator keeps HR tracking clean and straightforward. Our specialized gulf job meter levy tool provides dedicated tracking tailored to individual family profiles. This ensures that overall saudi arabia family expenses calculator calculations stay reliable and precise over multiple years.
                </p>
                <p>
                  Understanding the difference between raw allowances and true net savings requires analyzing the exact sar 400 per dependent monthly fee framework. Our system matches these base numbers against the fixed 4800 sar annual dependent fee baseline per companion. This breakdown gives you a highly accurate view of your saudi expat family cost per month.
                </p>
                <p>
                  When calculating household expenses, setting aside the exact dependent levy 400 sar monthly sum helps track long-term trends before contract renewals. If you find yourself wondering how much is family fee in saudi arabia, remember that it is a flat, non-graduated fee structure. This makes calculating the saudi dependent fee for spouse and children completely predictable, while ensuring your expat family levy cost ksa projections remain steady.
                </p>
              </div>
            </div>

            {/* Block 3: Portal Processing & Payment Workflows */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Iqama Validation & Digital Portal Interfaces</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Navigating SADAD, Absher, and Muqeem systems</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Fulfilling municipal fee requirements requires careful navigation of the Kingdom's official payment channels. Running calculations through an iqama dependent fee calculator ensures you confirm the exact amount due before initiating bank transactions. New arrivals often need to learn how to pay dependent fee muqeem protocols without running into portal time-outs or system delays.
                </p>
                <p>
                  Most expatriates handle their payments using the standard sadad dependent levy payment dashboard integrated into their local banking apps. You can easily verify outstanding balances using the official absher family fee check tool. This ensures your online statements match the calculations from your internal muqeem fees calculator.
                </p>
                <p>
                  Paying your iqama renewal dependent levy on time is essential to prevent system lockouts or disruptions during professional contract reviews. When you pay family levy saudi arabia balances ahead of schedule, your digital records remain clear and accessible. This clear visibility helps avoid last-minute delays during visa and residency updates.
                </p>
                <p>
                  It is important to remember that keeping track of your saudi dependent levy iqama expiry dates prevents standard late penalties from impacting your record. Expatriates who monitor family levy in saudi arabia latest news are always better prepared for shifts in standard operating rules. This ongoing attention ensures that managing your saudi dependent levy for expats stays well-organized across your entire stay.
                </p>
                <p>
                  When calculating total family expenses, checking the complete saudi iqama fees baseline helps clarify exactly which fees fall under your responsibility versus your company's. While labour iqama fees in saudi arabia are paid by the employer, your family calculations rely entirely on your personal dependent fee calculator configuration. This separation keeps your iqama renewal fees for 1 year calculations clear, simple, and reliable.
                </p>
              </div>
            </div>

            {/* Block 4: Exemptions, Rulings & Statutory Details */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Exemption Frameworks & Legal Structures</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Statutory exclusions and specific regulatory parameters</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Not all foreign residents are subject to standard companion fee calculations across every category. Reviewing the official saudi dependent levy exemptions list clarifies which family groups are excluded from the standard monthly fees. Knowing exactly who is exempt from family fee ksa rules saves your household from making unnecessary payments on official portals.
                </p>
                <p>
                  For example, the children of saudi mother dependent fee exemption ensures that these family members are completely excluded from the standard calculation tracking. Similarly, a non saudi wife of saudi citizen levy exemption removes monthly companion fees for eligible spouses. These explicit guidelines help keep your family expense calculations accurate and compliant.
                </p>
                <p>
                  Certain specialized employment fields also offer relief, such as the government sector dependent fee exemption for specific public service positions. At the same time, the gcc nationals family fee saudi exclusion guarantees that citizens of neighboring Gulf states do not face companion fee requirements. This standard framework simplifies planning for regional professionals.
                </p>
                <p>
                  Reviewing the overall saudi arabia expat family costs helps professionals evaluate incoming job offers more effectively. Our system estimates expat living costs riyadh with family requirements to ensure your expected savings match real-world conditions. This detailed tracking keeps your saudi sponsor family expenses balanced and realistic.
                </p>
                <p>
                  Using a complete ksa expat levy breakdown lets you see exactly how monthly fees accumulate over long-term residency periods. Our dynamic platform generates a precise annual family fee projection saudi chart based on your family profile. This setup makes it easy to plan ahead for milestones like registering a newborn dependent fee saudi arabia profile or managing an adult children dependent levy ksa adjustment.
                </p>
              </div>
            </div>

            {/* Block 5: Core Answers & FAQ Layout */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Analytical Reference & System Queries</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Direct processing answers for expat logistics</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  <strong>What is the dependent tax in Saudi Arabia?</strong> It is an administrative companion levy applied to sponsored family members, calculated as a flat rate rather than a progressive tax. Expatriates can query balances through the absher individuals iqama fee inquiry portal to confirm that their recorded digital balances match their physical headcount perfectly.
                </p>
                <p>
                  <strong>How much is the levy in Saudi Arabia?</strong> The work permit levy stands separate from the companion tracking system, whereas the family fee remains exactly SAR 400 monthly per person. Checking your status using a reliable saudi calculator dependent levy tool helps prevent registration errors and keeps your dashboard metrics aligned with official portal updates.
                </p>
                <p>
                  <strong>Can we get a refund of dependent fee?</strong> Paid companion fees are generally non-refundable once processed by portal payment systems, even if a dependent exits the Kingdom early on a final exit visa. For this reason, checking details through a reliable saudi jawazat companion fees portal helps ensure you only pay for the exact months your family will be resident.
                </p>
                <p>
                  <strong>When did the dependent fee start in Saudi Arabia?</strong> The program launched in July 2017 as part of the saudi arabia expat financial balance program to diversify revenue channels. This mechanism requires clear tracking before iqama validation, making tools like the dependent identity card check essential for accurate household accounting.
                </p>
                <p>
                  <strong>How much is the fee for a dependent visa?</strong> The initial entry processing visa carries a distinct entry processing charge, while ongoing residency requires tracking via the standard saudi expat levy vs dependent fee framework. Sponsoring professionals use the moi paid government services resident dashboard to manage these fees alongside their baseline maktab amal fee calculation requirements.
                </p>
                <p>
                  <strong>How to get a Saudi dependent visa?</strong> Visas are requested by submitting attested marriage and birth certificates through official channels. Once active on the muqeem dashboard family status portal, the tracking system automatically calculates relevant charges to keep your family visa cost saudi expat estimates up to date.
                </p>
                <p>
                  <strong>How to renew dependent iqama in Saudi?</strong> The process requires fulfilling the standard iqama residency renewal sequence: securing medical insurance, paying work permits, and settling companion fees via sadad postpaid ministry of interior channels. This workflow must be completed before your sponsor can finalize updates on official portals.
                </p>
                <p>
                  <strong>Can a dependent visa holder work in Saudi Arabia?</strong> Sponsored companions are generally not permitted to take up employment without formal sponsorship transfer to an approved commercial business entity. Keeping this rule in mind helps you map out your total household income using your kafeel sponsored family fee profile.
                </p>
              </div>
            </div>

            {/* Block 6: Extended Operational Standards */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Technical Reference & Professional Guide Matrix</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Managing structural updates across the corporate landscape</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  To maximize clarity, we can look at a helpful comparison table that outlines how these companion fees accumulate over typical residency periods. This structure makes it simple to track your long-term planning milestones:
                </p>
                <div className="my-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-200 dark:border-gray-800 text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                        <th className="p-3 border border-gray-200 dark:border-gray-800">Dependent Group Profile</th>
                        <th className="p-3 border border-gray-200 dark:border-gray-800">Monthly Obligation</th>
                        <th className="p-3 border border-gray-200 dark:border-gray-800">Annual Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">Single Sponsored Companion</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 400</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 4,800</td>
                      </tr>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                        <td className="p-3 border border-gray-200 dark:border-gray-800">Two Sponsored Dependents</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 800</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 9,600</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">Three Sponsored Dependents</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 1,200</td>
                        <td className="p-3 border border-gray-200 dark:border-gray-800">SAR 14,400</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Navigating the complex landscape of expat regulations requires clear, transparent tools. For example, our platform applies the same level of precision found in a specialized tokunbo style expat calculator to ensure all household metrics remain accurate. This ensures your calculations stay completely reliable, whether you are reviewing saudi arabia corporate visa fees or budgeting for an expanding family.
                </p>
                <p>
                  When building a detailed budget, referencing a localized riyadh cost of living index with dependents gives you a realistic view of monthly baseline costs. These estimates help professionals plan for major expenses, from typical jeddah expat compound expenses to standard school tuition fees. This careful preparation ensures your long-term savings plans stay on track.
                </p>
                <p>
                  It is also vital to review your employment terms against saudi labor law article 40 fee responsibility guidelines to ensure corporate compliance. While companies cover their internal workforce fees, employees remain responsible for their personal companion costs. Our system integrates with verified cchi health insurance iqama link tracking to verify that your health policies match your portal records perfectly.
                </p>
                <p>
                  Finally, tracking your business metrics using the official qiwa work permit fee tracking system helps avoid sudden administrative delays during corporate updates. Keeping your company's nitaqat company status iqama renewal level in mind ensures all visa processing paths remain clear. Sponsoring professionals log in securely using their saudi national access nafath credentials to review current requirements, verify ongoing updates, and confirm that their family records remain perfectly up to date.
                </p>
                <p>
                  Our advanced system is also built to handle modern choices, like evaluating saudi arabia premium residency alternatives that offer complete exemption from ongoing companion fees. Whether you are balancing a standard budget or tracking complex long-term milestones, our interface delivers clear, actionable numbers. This reliable support gives your household full control over its financial planning across the Kingdom.
                </p>
              </div>
            </div>

            {/* Translation and Alternate Phrasing Terms Block */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">System Transliteration Matrix:</strong> Multi-channel verification supports index routing tracking for alternate search queries including رسوم التابعين السعودية along with rasm al-tabi'in reference lines, رسوم العائلة في السعودية portals, حاسبة رسوم التابعين engines, levy التابعين indices, and iqama fee family structures. Always verify exact records with official portals.
              </p>
            </div>

          </div>
        </div>

        {/* Existing Static Footer Content Area */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
            <h2 className="text-3xl font-semibold">Understanding the Saudi Dependent Levy</h2>
            <p>
              The dependent levy (also called family fee) is a monthly charge of <strong>SAR 400 per dependent/companion</strong> paid by the expatriate sponsor. It is <strong>not deductible from salary</strong> and must be paid personally via Muqeem or SADAD.
            </p>

            <h3 className="text-2xl font-semibold mt-10">Who Pays & What Counts as a Dependent?</h3>
            <ul>
              <li>Spouse (wife/husband)</li>
              <li>Children (under 18 typically for full dependent status)</li>
              <li>Adult children, parents, and other sponsored relatives (companions)</li>
              <li>Domestic workers (in some cases)</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-10">Common Exemptions</h3>
            <ul>
              <li>Non-Saudi wife of a Saudi citizen</li>
              <li>Children of a Saudi mother (married to non-Saudi)</li>
              <li>Dependents of GCC nationals</li>
              <li>Scholarship students and their families</li>
              <li>Certain government sector cases</li>
            </ul>

            <p className="text-sm text-gray-500 mt-12">
              <strong>Disclaimer:</strong> This tool provides estimates based on publicly available data. Rules can change and individual cases vary. Always verify with Muqeem, Absher, or Jawazat. Not legal or financial advice.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
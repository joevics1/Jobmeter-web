// app/tools/saudi-eosb-calculator/page.tsx
import { Metadata } from 'next';
import SaudiEOSBCalculator from './SaudiEOSBCalculator';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://jobmeter.app/tools/saudi-eosb-calculator';

export const metadata: Metadata = {
  title: 'Saudi End-of-Service Benefits (EOSB) Calculator | Gratuity KSA',
  description: 'Accurate Saudi EOSB / Gratuity Calculator according to KSA Labour Law Articles 84 & 85. Includes resignation reductions, unpaid leave, part-time, and full settlement breakdown.',
  keywords: [
    'Saudi EOSB calculator', 'Saudi gratuity calculator', 'end of service benefits Saudi Arabia',
    'KSA labour law 84 85', 'Saudi resignation gratuity', 'EOSB calculator Saudi', 
    'final settlement Saudi', 'Iqama end of service', 'Saudi expatriate gratuity',
    'Saudi end of service calculator', 'KSA end of service benefits', 'Saudi labor law article 84',
    'Saudi labor law article 85', 'end of service award Saudi', 'EOSB KSA',
    'Saudi final exit settlement', 'gratuity if resign Saudi', 'actual wage gratuity Saudi',
    'end of service reward calculator KSA', 'Qiwa EOSB calculator', 'HRSD gratuity calculator',
    'Saudi EOSB resignation', 'part time gratuity Saudi', 'unpaid leave EOSB deduction',
    'Saudi Arabia end of service gratuity', 'mukafa’a nihayat al khidma'
  ],
  openGraph: {
    title: 'Saudi EOSB Calculator - Accurate Gratuity Tool',
    description: 'Calculate your End of Service Benefits in Saudi Arabia with full transparency.',
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Saudi EOSB Calculator',
    url: pageUrl,
    description: 'An expert web application designed to compute statutory End-of-Service Benefits for employees in the Kingdom of Saudi Arabia.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://jobmeter.app/og-eosb-calculator.jpg',
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
        name: 'Saudi EOSB Calculator',
        item: pageUrl,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Saudi EOSB Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'An online financial tool that estimates total employee end-of-service gratuity rewards under Saudi Labor Law provisions.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the Saudi EOSB Calculator',
    description: 'Enter salary values, service tenure dates, and contract termination types to find your precise severance award.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter Salary Data',
        text: 'Input your contract basic salary along with all fixed recurring allowances to form the combined actual wage baseline.',
      },
      {
        '@type': 'HowToStep',
        name: 'Input Tenure and Absences',
        text: 'Specify your exact starting and final working dates, entering any undocumented or unpaid leave blocks for accurate deduction pruning.',
      },
      {
        '@type': 'HowToStep',
        name: 'Select Separation Type',
        text: 'Choose whether the separation stems from standard employer termination, contract expiration, mutual agreement, or worker resignation.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is eosb calculated in ksa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is computed based on half a month of the employee actual wage for each of the first five years, and a full month of actual wage for each consecutive year, adjusted by the specific separation reason.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I estimate my payout with Qiwa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, though utilizing a standalone calculation resource like this tool provides immediate offline calculations without corporate authentication.',
        },
      },
    ],
  },
];

export default function Page() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Gradient Hero */}
        <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            
            {/* Breadcrumb — inside hero */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Saudi EOSB Calculator</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Saudi EOSB Calculator
            </h1>
            <p className="text-2xl max-w-3xl mx-auto">
              Calculate <span className="font-semibold">True Statutory Gratuity</span> with Leave Deductions, Resignation Tiers & Compliance Benchmarks
            </p>
            <p className="mt-4 text-blue-100 text-lg">Based on Current KSA Labour Law • Articles 84 & 85</p>
          </div>
        </div>

        {/* Condensed intro — single line, smaller font */}
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this professional <span className="font-semibold">Saudi EOSB calculator</span> and <span className="font-semibold">Saudi gratuity calculator</span> to verify your precise legal entitlement — enter your contract terms to translate base pay, housing stipends, and continuous service durations into an analytical final settlement layout, structured exactly against ministerial guidelines.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <SaudiEOSBCalculator />

          <RelatedToolsStrip />
        </div>

        {/* Extensive SEO & Educational Content Section */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

            {/* Section 1: Saudi Labour Law EOSB Analysis */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Saudi Labour Law EOSB Analysis</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">What your statutory final statement package really means</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Managing a professional transition or a final separation from an enterprise in the Kingdom requires an absolute mastery of how a digital <strong>Saudi EOSB calculator</strong> processes your statutory variables. The computation of your contract parameters under a <strong>Saudi end of service calculator</strong> framework does not rely on a basic estimation, but on strict statutory matrices. Whether you are reviewing an automated payroll report as a manager or assessing your personal compensation timeline as an employee, verifying your <strong>end of service benefits Saudi Arabia</strong> profiles serves as a critical step in safeguarding your statutory workspace rights.
                </p>
                <p>
                  Our specialized engine is calibrated specifically as an <strong>accurate Saudi EOSB calculator</strong>, ensuring that complex parameters like dynamic tenure lengths, fixed historical payroll variables, and specialized leave clauses are correctly processed. By operating as an advanced <strong>EOSB calculator Saudi</strong> alternative, this utility provides comprehensive accounting visibility to human resource executives and global expatriates alike. When a workforce relationship ends, relying on an independent <strong>KSA gratuity calculator</strong> helps clarify discrepancies between standard internal corporate ledger spreadsheets and the absolute statutory mandates dictated by central ministries.
                </p>
                <p>
                  For the thousands of global specialists navigating employment changes, a structured <strong>Saudi final settlement calculator</strong> approach removes the obscurity often associated with complex corporate handshakes. The final values compiled under an independent <strong>end of service gratuity Saudi</strong> routine ensure that your basic pay rates and fixed allowances are accounted for with absolute computational fidelity. Before finalizing any documentation or signing a physical exit ledger, running your variables through a high-fidelity <strong>KSA end of service benefits calculator</strong> guarantees your structural payroll protection from start to finish.
                </p>
              </div>
            </div>

            {/* Section 2: KSA Labour Law 84 85 Framework */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">KSA Labour Law 84 85 Framework</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Statutory calculations for termination and voluntary separation</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The financial foundation of every single separation settlement across the local private sector is governed directly by the statutory interplay of <strong>KSA labour law 84 85</strong> guidelines. Under the strict requirements of <strong>Saudi labor law article 84</strong>, a worker accumulates half a month of their last drawn actual salary for each year of continuous employment during the first five years, expanding to a full month of their actual wage for each consecutive year beyond that threshold. These cumulative milestones form the base entitlement baseline, ensuring long-term institutional tenure is recognized through a structured tiering system.
                </p>
                <p>
                  Conversely, when a worker chooses to leave voluntarily before an employer terminates the arrangement, the statutory fractions found inside <strong>Saudi labor law article 85</strong> are triggered. The specific language of <strong>Article 85 resignation Saudi</strong> adjustments introduces significant reductions to safeguard businesses from sudden talent shortfalls. Utilizing an online <strong>Saudi EOSB calculator resignation tiers</strong> panel makes it easy to visualize how voluntary leaves scale down your capital. Our comprehensive <strong>end of service reward calculator KSA</strong> applies these regulatory formulas automatically, providing an open <strong>HRSD end of service calculator alternative</strong> that yields immediate clarity.
                </p>
                <p>
                  When individuals evaluate their career steps, knowing the difference between an employer-driven contract cancellation and a voluntary exit prevents costly oversights. The calculations for a <strong>Saudi resignation gratuity</strong> vary based on exact service brackets, making it vital to cross-check variables before submitting formal notices. By using an independent <strong>Saudi Labour Law EOSB</strong> processing model, you can review your projected numbers ahead of time, ensuring that your final payouts remain aligned with ministerial guidelines.
                </p>
              </div>

              {/* Statutory Tiers Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Continuous Service Tenure</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Resignation Payout Ratio (Article 85)</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Employer Termination Ratio (Article 84)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Less than 2 Years</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">0% (No entitlement accumulated)</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Pro-rated base award via Article 84</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">2 Years to less than 5 Years</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">1/3 (One-third of full accrued award)</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">100% full pro-rated base award</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">5 Years to less than 10 Years</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">2/3 (Two-thirds of full accrued award)</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">100% full pro-rated base award</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">10 Years or More</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">100% (Full unmitigated award)</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">100% full pro-rated base award</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Saudi Gratuity Calculation Nuances */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Saudi Gratuity Calculation Nuances</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Accounting for actual wage bases, trial horizons, and leave adjustments</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  A real-world calculation requires looking closely at how your contract wage basis is structured. Any accurate <strong>actual wage gratuity calculator KSA</strong> routine must rely on the full statutory actual wage, which combines your baseline salary with all fixed recurring allowances such as housing, transportation, utilities, and fixed food stipends. Running a <strong>final settlement Saudi including allowances</strong> audit helps ensure your company isn't using a base-only salary figure, which would incorrectly downscale your statutory payout.
                </p>
                <p>
                  Furthermore, handling non-traditional timelines requires clear, rule-based logic. Evaluating a <strong>Saudi EOSB with probation</strong> setup depends on whether you complete the trial horizon; if you continue past the probation phase, those initial months count fully toward your total tenure, whereas a separation within that trial phase cancels any future accrual. For personnel operating under alternative shift frameworks, our built-in <strong>part time EOSB calculator Saudi</strong> routine applies precise, hour-weighted formulas to ensure your <strong>part time gratuity Saudi</strong> profiles match ministerial standards.
                </p>
                <p>
                  Unpaid leaves and unexcused absences also change your continuous service timeline. Our tool applies an automatic <strong>unpaid leave EOSB deduction</strong> to remove non-working blocks from your total calendar tenure, protecting you from manual bookkeeping errors. This level of precision is why tracking your metrics through an independent <strong>Saudi gratuity calculator with unpaid leave</strong> option provides a highly reliable way to confirm compliance before signing any final release paperwork.
                </p>
              </div>
            </div>

            {/* Section 4: Expatriate Final Exit Settlements & Employer Costs */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Expatriate Final Exit Settlements</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Sponsorship levy tracking and legal exit processing</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  For global professionals, managing a <strong>Saudi expatriate gratuity</strong> audit is closely tied to completing the country's residency exit requirements. The broader <strong>Iqama end of service</strong> process involves more than just calculating your severance; it requires clearing pending utility liabilities, canceling active credit facilities, and managing corporate sponsorship exit visas. A true <strong>expat final settlement Saudi</strong> review requires full transparency regarding both employee payouts and the background operational costs handled by the employer.
                </p>
                <p>
                  To provide this transparency, this tool features an integrated <strong>employer cost EOSB Saudi</strong> analysis module. This section estimates the recurring government overhead spent during your tenure—including human resources work permit fees and medical insurance premiums. This data helps employees evaluate their total compensation package while ensuring their <strong>Saudi EOSB for foreigners</strong> calculations match state benchmarks. By utilizing a clear <strong>ESB calculator Saudi</strong> approach, both parties can avoid common accounting friction points.
                </p>
                <p>
                  Whether you are planning a long-term relocation or compiling records for a potential <strong>Saudi labor court EOSB claim</strong>, using a clear validation framework helps protect your financial interests. Relying on verified calculations ensures your contract variables are handled with absolute precision, giving you full confidence as you navigate the <strong>KSA end of service benefits expatriate</strong> process.
                </p>
              </div>
            </div>

            {/* Section 5: How to Use This Tool */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How to Use This Tool</h2>
              <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Input Your Complete Salary Structure.</strong> Enter your contractual basic pay along with all fixed recurring allowances into the fields of our <span className="font-semibold">Saudi basic salary allowances gratuity</span> input panel.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Define Your Exact Tenure Dates.</strong> Select your historical onboarding date and your final effective departure date to let the system generate a precise <span className="font-semibold">Saudi gratuity calculation</span> based on pro-rated calendar days.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Account for Absences or Hour Ratios.</strong> Document any unpaid leave days to apply an automatic <span className="font-semibold">unpaid leave EOSB deduction</span>, or adjust your shift percentage if calculating a <span className="font-semibold">part time gratuity Saudi</span> value.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">4</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Select Your Separation Context.</strong> Select the exact reason for termination to ensure the application enforces the correct <span className="font-semibold">Saudi labor law article 85</span> reduction fractions or standard <span className="font-semibold">Saudi labor law article 84</span> metrics.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">5</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Analyze Your Full Settlement Sheet.</strong> Review the compiled <span className="font-semibold">final settlement sheet Saudi Arabia</span> dashboard to view your total statutory entitlement alongside the background corporate sponsorship fee summaries.</p>
                </li>
              </ol>
            </div>

            {/* Section 6: Frequently Asked Questions */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How is eosb calculated in ksa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    The answer to <strong>how is eosb calculated in ksa</strong> depends completely on your total continuous service tenure and your specific reason for contract separation. Under standard conditions, you accumulate half a month of your actual wage for each of the initial five years of employment, which scales up to a full month of your actual wage for every subsequent year of continuous service.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How is end of service gratuity calculated in KSA?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    To understand exactly <strong>how is end of service gratuity calculated in KSA</strong>, you must identify your final actual wage (basic salary plus fixed monthly allowances). This combined base rate is multiplied against your pro-rated calendar years, and then adjusted by the <strong>Saudi resignation end of service</strong> reduction scales if you chose to leave voluntarily.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I estimate my payout with Qiwa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes, you can. While checking your profile via the official state portal is recommended, using our independent <strong>Qiwa end of service calculator</strong> simulator lets you verify your numbers instantly without needing corporate single sign-on credentials, serving as an excellent <strong>Qiwa gratuity calculator</strong> or <strong>Qiwa EOSB calculator</strong> alternative.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is the formula for calculating gratuity?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    To evaluate <strong>what is the formula for calculating gratuity</strong>, take your actual wage basis and apply the calculation: (Actual Wage × 0.5) for the first 5 years, plus (Actual Wage × 1.0) for every year after that. If an employee resigns before reaching ten years of service, the <strong>gratuity if resign Saudi</strong> adjustments will scale down that base total.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is EOSB calculation?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    An <strong>what is EOSB calculation</strong> refers to the mandatory process used to determine the legal severance pay an employer must provide to an employee upon contract completion, as required under current <strong>Saudi labor law end of service benefits</strong> guidelines.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What are the 4 benefits of employees?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Under statutory guidelines, <strong>what are the 4 benefits of employees</strong> typically includes mandatory medical insurance coverage, annual paid vacation leave with travel tickets, safe occupational settings, and the final <strong>end of service award Saudi</strong> given upon termination.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do I calculate my end of service?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    If you are wondering <strong>how do I calculate my end of service</strong>, map your exact employment timeline, deduct any non-working days using an <strong>unpaid leave EOSB deduction</strong> tool, and input your fixed monthly allowances into our <strong>Saudi labor office calculator</strong> panel to see a clear breakdown.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I get final pay if I resign?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes. If you ask <strong>can I get final pay if I resign</strong>, you are legally entitled to an exit payout provided you have completed at least two years of continuous service. If you leave with less than two years of service, your voluntary <strong>EOSB on resignation Saudi</strong> value drops to zero.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What are common EOSB calculation mistakes?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Some of the <strong>what are common EOSB calculation mistakes</strong> include using only your basic salary instead of the combined actual wage, forgetting to subtract unpaid leave days, or misapplying resignation reduction factors to a <strong>Saudi fixed term contract end of service</strong>.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is EOSB accrual?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    An <strong>what is EOSB accrual</strong> is the monthly accounting practice where a business sets aside provisions on its balance sheet for future severance liabilities, ensuring it can meet long-term <strong>KSA workforce gratuity entitlement</strong> requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How much gratuity will I get after 2 years?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    To answer <strong>how much gratuity will I get after 2 years</strong>: if your employer terminates your contract, you will receive exactly one full month of your actual wage. If you choose to resign right at the two-year mark, your voluntary exit adjustment reduces the final payout to exactly one-third of that month's wage.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How to solve end-of-service disputes?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    To find out <strong>how to solve end-of-service</strong> disputes, employees should generate a clear statutory breakdown using an independent <strong>HRSD gratuity calculator</strong> alternative, compare it directly with their company's internal reports, and submit an official dispute through the Qiwa portal if discrepancies remain unresolved.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer Section */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This is an estimation utility built upon public documentation and standard national labor codes. Actual contracts and individual provisions may vary. Always cross-verify your statements with your signed employment contract and relevant regional labor authorities.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
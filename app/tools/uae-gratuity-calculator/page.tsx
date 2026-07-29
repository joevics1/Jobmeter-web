// app/tools/uae-gratuity-calculator/page.tsx
import { Metadata } from 'next';
import GratuityCalculator from './GratuityCalculator';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';

const pageUrl = 'https://jobmeter.app/tools/uae-gratuity-calculator';

export const metadata: Metadata = {
  title: 'UAE Gratuity Calculator 2026 | End of Service Calculator UAE (MOHRE)',
  description: 'Most accurate UAE Gratuity Calculator 2026. Calculate End of Service (EOS) benefits under Federal Decree-Law No. 33 of 2021 for Mainland, DIFC & ADGM with unpaid leave, part-time & 2-year cap.',
  keywords: [
    'uae gratuity calculator', 'end of service calculator uae', 'gratuity calculator dubai',
    'uae end of service gratuity', 'gratuity calculation uae', 'final settlement uae labour law',
    'end of service calculator dubai', 'uae labour law gratuity', 'difc gratuity calculator',
    'gratuity calculator uae 2026', 'eos calculator uae', 'uae gratuity law'
  ],
  openGraph: {
    title: 'UAE Gratuity Calculator 2026 - Accurate End of Service Calculator',
    description: 'Free UAE EOS Gratuity Calculator with full breakdown and legal references.',
  },
};

export default function UAEGratuityPage() {
  // Structured JSON-LD Schema Graphs
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://jobmeter.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://jobmeter.app/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "UAE Gratuity Calculator",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}/#webapp`,
        "url": pageUrl,
        "name": "UAE Gratuity Calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "description": "Free and accurate end of service calculator for UAE Mainland, Free Zones, DIFC, and ADGM following MOHRE guidelines."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How to calculate UAE gratuity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UAE gratuity calculation depends on the length of continuous service and basic salary. For service between 1 and 5 years, it is calculated at 21 days of basic salary per year. For service exceeding 5 years, it is calculated at 30 days of basic salary for each additional year."
            }
          },
          {
            "@type": "Question",
            "name": "What is the new rule for gratuity in the UAE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The updated guidelines eliminate distinctions between limited and unlimited contracts, ensuring a standard evaluation framework based strictly on continuous tenure and basic salary proportions."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Script
        id="jsonld-gratuity"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section — breadcrumb moved inside */}
      <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          
          {/* Breadcrumb — inside hero */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span aria-hidden="true" className="opacity-60">›</span>
            <a href="/tools" className="hover:text-white transition-colors">Tools</a>
            <span aria-hidden="true" className="opacity-60">›</span>
            <span className="text-white font-medium">UAE Gratuity Calculator</span>
          </nav>

          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            UAE Gratuity Calculator
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Calculate your End of Service (EOS) benefits under the latest UAE Labour Law.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Ad Unit Component */}
        <div className="mb-6">
          <AdUnit slot="7849102345" />
        </div>

        {/* Summary Introduction Container */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl shadow-sm text-[15px] leading-relaxed text-blue-900 dark:text-blue-300">
          <p>
            Welcome to the definitive <strong>uae gratuity calculator</strong> system. This corporate-grade web utility operates as an automated <strong>end of service calculator uae</strong> engine, allowing employees and human resources managers to determine accurate corporate departures. By processing key variables, it delivers structural transparency for anyone tracking a <strong>gratuity calculator dubai</strong> breakdown or general <strong>eos calculator uae</strong> settlements. Utilize this interface to compute your true <strong>end of service gratuity uae</strong> values instantly.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <GratuityCalculator />

{/* Comprehensive SEO Content - UAE Gratuity Calculator */}
        <div className="mt-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl shadow-sm overflow-hidden">

          {/* Section 1 */}
          <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              How UAE End of Service Gratuity Works
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                End of service gratuity — commonly referred to as EOS or EOSB — is a lump-sum payment that every employer in the UAE is legally required to pay to an employee upon the termination of their employment, regardless of whether the separation is voluntary or involuntary. It is mandated under Federal Decree-Law No. 33 of 2021 on the Regulation of Labour Relations, which governs all private sector employees working on the UAE mainland. The gratuity is calculated based on your basic salary and the total length of your continuous service with the employer.
              </p>
              <p>
                The core gratuity calculation formula in the UAE works as follows: employees who have completed between one and five years of service are entitled to 21 calendar days of basic salary for each year worked. For every year of service beyond five years, the entitlement increases to 30 calendar days of basic salary per year. The total gratuity payout is capped at two years' worth of basic salary, regardless of how long the employee has worked. Our UAE end of service calculator applies this exact formula automatically, factoring in your start date, end date, basic salary, contract type, and reason for leaving.
              </p>
              <p>
                It is important to understand that gratuity is calculated on basic salary only — not on total package. Housing allowances, transport allowances, commission, overtime, and annual bonuses are all excluded from the gratuity calculation base. This is one of the most common sources of confusion for employees reviewing their final settlement, and one of the key reasons an accurate end of service calculator is so useful when verifying what your employer owes you.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Gratuity Calculation by Contract Type: Limited vs Unlimited
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Under the previous UAE Labour Law (Federal Law No. 8 of 1980), contracts were classified as either limited (fixed-term) or unlimited (open-ended), and the gratuity entitlement differed depending on which contract type you held and how your employment ended. Under the updated 2021 law, all new employment contracts are classified as fixed-term, but legacy unlimited contracts remain valid and their gratuity rules still apply to employees who held them prior to the legislative change.
              </p>
              <p>
                For unlimited contracts, an employee who resigns before completing one year of service receives no gratuity. If they resign after one year but before three years, they are entitled to one-third of the standard gratuity. Resigning after three years but before five years entitles the employee to two-thirds of the full gratuity. Only after completing five or more years of continuous service does a resigning employee under an unlimited contract receive the full gratuity amount. Employees who are terminated — rather than resigning — receive full gratuity from the first year, regardless of tenure.
              </p>
              <p>
                For limited (fixed-term) contracts, the rules are more straightforward under the new law: employees are generally entitled to full gratuity upon completion of at least one year of continuous service, regardless of whether they resign or are terminated. Our UAE gratuity calculator handles both contract types accurately, applying the correct reduction factors for resignation scenarios under legacy unlimited contracts so your final settlement figure reflects the actual legal entitlement.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Gratuity Rules for Free Zones: DIFC, ADGM, and Beyond
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Employees working in UAE free zones are generally subject to the same mainland gratuity rules under the Federal Labour Law, with one significant exception: the Dubai International Financial Centre (DIFC) and the Abu Dhabi Global Market (ADGM) operate under their own independent legal frameworks and have replaced the traditional lump-sum gratuity model with a defined contribution savings scheme.
              </p>
              <p>
                In the DIFC, the Employee Workplace Savings (DEWS) plan replaced the end of service gratuity in January 2020. Under DEWS, employers contribute a fixed percentage of each employee's basic salary into a managed fund on a monthly basis — 5.83% for employees with less than five years of service, and 8.33% for those with five or more years. This is a fundamentally different model from traditional gratuity, and it means DIFC employees have a portable, funded savings account rather than a lump-sum entitlement paid only at the end of employment.
              </p>
              <p>
                The ADGM follows a similar approach under its own Employment Regulations. For all other free zones — including JAFZA, DMCC, KIZAD, and RAK free zones — the Federal Labour Law gratuity provisions apply, meaning employees in these zones are entitled to the standard 21-days and 30-days per year formula. Our gratuity calculator covers mainland UAE, standard free zones, and includes dedicated notes for DIFC and ADGM so you can identify exactly which framework governs your employment.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Partial Years, Unpaid Leave, and Other Deductions
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Gratuity is not always calculated for neat, whole-number years of service. When an employee leaves mid-year, the final year is calculated on a pro-rata basis. This means if you worked for 3 years and 7 months, you would receive gratuity for the full 3 years plus a proportional amount for the 7-month partial year. This pro-rata gratuity calculation is an area where manual errors frequently occur, particularly when employers use outdated spreadsheet tools or calculate based on calendar months rather than actual calendar days.
              </p>
              <p>
                Unpaid leave is another important factor. Under UAE labour law, periods of unpaid leave are excluded from the total service duration for gratuity purposes. This means that if you took three months of unpaid leave over the course of your employment, those three months are subtracted from your total service period before the gratuity entitlement is calculated. Unpaid sick leave beyond the statutory entitlement and unauthorized absences are similarly excluded. Our end of service calculator includes an unpaid leave field so this deduction is applied automatically and correctly.
              </p>
              <p>
                Domestic workers — household employees such as housemaids, drivers, cooks, and nannies — are governed by Federal Law No. 10 of 2017 on Domestic Workers rather than the main Labour Law. Under this law, domestic workers are entitled to one month's wage for each year of service as gratuity, provided they have completed at least one year of continuous service. This is a different formula from the standard 21-day calculation, and our calculator accounts for this distinction when you select the domestic worker employment category.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Final Settlement: What Else Is Included Beyond Gratuity?
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Gratuity is the most significant component of a UAE final settlement, but it is rarely the only one. When your employment ends, your employer is typically obligated to pay several additional items alongside the end of service gratuity. These include any accrued but unused annual leave — calculated at your daily wage rate for each remaining leave day — as well as any outstanding salary or salary in lieu of notice if the employer has waived the notice period.
              </p>
              <p>
                Notice period obligations are defined in your employment contract and must comply with the statutory minimums under the UAE Labour Law. For employees with less than one year of service, the minimum notice period is 30 days. This increases to 60 days for employees who have served between one and five years, and 90 days for those with five or more years. If the employer terminates the employee without serving or compensating the notice period, the salary equivalent for those days must be added to the final settlement.
              </p>
              <p>
                Employees are also entitled to a repatriation ticket to their home country when their employment ends, unless they find new employment within the UAE without leaving the country. Some employment contracts specify additional end-of-service benefits above the statutory minimum — these contractual provisions are enforceable and must be honoured by the employer. Our UAE final settlement calculator helps you understand the full picture of what you are owed, not just the gratuity component, so you can verify your employer's settlement offer with confidence before signing any clearance documents.
              </p>
            </div>
          </div>

          {/* Section 6 - FAQ */}
          <div className="p-8 md:p-12 border-t border-gray-100 dark:border-gray-800/60">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Is gratuity calculated on basic salary or total salary?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Gratuity is calculated on basic salary only. Allowances such as housing, transport, and education, as well as commissions and bonuses, are excluded from the calculation base under UAE Labour Law.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  What is the maximum gratuity payout in the UAE?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  The total gratuity amount is capped at two years of basic salary, regardless of the total number of years served. This cap applies to both mainland and standard free zone employees.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Am I entitled to gratuity if I resign?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Yes, provided you have completed at least one year of continuous service. Under legacy unlimited contracts, the gratuity amount may be reduced depending on your total tenure. Under the current fixed-term contract law, you are entitled to full gratuity after one year of service.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  How long does an employer have to pay gratuity?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Under the UAE Labour Law, the employer must settle all end of service dues — including gratuity, unpaid salary, and leave balance — within 14 days of the employment termination date. Delays beyond this period may entitle the employee to file a complaint with the Ministry of Human Resources and Emiratisation (MoHRE).
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Does unpaid leave affect my gratuity entitlement?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Yes. Periods of unpaid leave are deducted from your total service duration when calculating gratuity. This reduces the number of qualifying days, which can lower your final entitlement. Enter your unpaid leave days in the calculator above to see the adjusted figure.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Are DIFC and ADGM employees entitled to gratuity?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  DIFC and ADGM employees are not covered by the standard UAE gratuity scheme. Instead, they are enrolled in mandatory savings plans — DEWS in the DIFC and a similar scheme in the ADGM — where employers make monthly contributions on their behalf throughout employment.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Can my employer deduct from my gratuity?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Employers may deduct amounts legally owed by the employee — such as outstanding loans advanced by the company or compensation for damage caused by the employee — from the gratuity payout. However, arbitrary deductions or penalties are not permitted under UAE Labour Law.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  What is the gratuity entitlement for domestic workers?
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  Domestic workers in the UAE are entitled to one month's wage for each completed year of service, governed by Federal Law No. 10 of 2017. This differs from the standard 21-day formula that applies to private sector employees under the main Labour Law.
                </p>
              </div>

            </div>
          </div>

          {/* Disclaimer section matching the sample page structure precisely */}
          <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
            <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
              <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This is an estimation tool based on public data and standard labor laws (2026). Actual contracts may vary. Always consult the full offer letter and relevant labor authorities.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
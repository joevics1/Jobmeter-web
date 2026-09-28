// app/tools/job-offer-evaluator/page.tsx
import { Metadata } from 'next';
import JobOfferEvaluator from './JobOfferEvaluator';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/job-offer-evaluator';

export const metadata: Metadata = {
  title: 'Gulf Job Offer Evaluator: UAE Salary Calculator & True Compensation',
  description:
    'Evaluate any Gulf job offer with UAE salary calculator logic, gratuity estimates, housing value, and total compensation analysis for Dubai, Saudi Arabia, Qatar, and the GCC.',
  keywords: [
    'gulf job offer', 'gulf job offer evaluator', 'uae job offer', 'job offer in dubai',
    'uae salary calculator', 'gcc salary calculator', 'dubai job offer calculator',
    'job offer analysis', 'gratuity calculator uae', 'gratuity calculator saudi',
    'end of service gratuity calculator', 'total compensation calculator gcc',
    'total compensation calculator gulf', 'salary negotiation', 'job offer letter',
    'offer letter', 'international job offers', 'job opportunities in dubai for foreigners',
    'expat salary gulf', 'saudi job offer', 'qatar job offer'
  ],
  openGraph: {
    title: 'Gulf Job Offer Evaluator: UAE Salary Calculator & True Compensation',
    description:
      'Compare Gulf job offers with gratuity, allowances, family costs, and market benchmarks for UAE, Saudi Arabia, Qatar, and the GCC.',
    images: [{ url: '/og-job-evaluator.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Gulf Job Offer Evaluator',
    url: pageUrl,
    description:
      'A Gulf job offer evaluator and UAE salary calculator that compares compensation packages across the GCC.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://www.jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.jobmeter.app/og-job-evaluator.jpg',
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
        item: 'https://www.jobmeter.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://www.jobmeter.app/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Gulf Job Offer Evaluator',
        item: pageUrl,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gulf Job Offer Evaluator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description:
      'A GCC salary calculator and job offer analysis tool that estimates total compensation, gratuity, allowances, and market value.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the Gulf Job Offer Evaluator',
    description:
      'Enter salary, allowances, location, and contract details to calculate true total compensation and gratuity.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter the offer details',
        text: 'Add the salary, housing allowance, transport allowance, bonuses, and contract length from the offer letter.',
      },
      {
        '@type': 'HowToStep',
        name: 'Select the country',
        text: 'Choose UAE, Saudi Arabia, Qatar, or another GCC country to apply the right gratuity and benefit logic.',
      },
      {
        '@type': 'HowToStep',
        name: 'Review the result',
        text: 'Compare the total compensation, gratuity estimate, and net value before accepting the job offer.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a Gulf job offer evaluator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is a tool that compares salary, allowances, gratuity, and other benefits so you can judge the true value of a UAE job offer or other GCC job offer.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this work as a UAE salary calculator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. It estimates total compensation for UAE offers, including gratuity and benefits, so it works like a UAE salary calculator and dubai job offer calculator.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use it for Saudi job offers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. It also supports Saudi job offer comparisons and end of service gratuity analysis for GCC compensation planning.',
        },
      },
    ],
  },
];

export default function JobOfferEvaluatorPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Hero Section — breadcrumb moved inside */}
        <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">

            {/* Breadcrumb — inside hero */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Gulf Job Offer Evaluator</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Gulf Job Offer Evaluator
            </h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Calculate <span className="font-semibold">True Total Compensation</span> with Gratuity, Family Costs & Market Benchmark
            </p>
            <p className="mt-4 text-blue-100 text-lg">UAE • Saudi Arabia • Qatar • Kuwait • Bahrain • Oman</p>
          </div>
        </div>

        {/* Top Ad */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Added 'slot' prop to fulfill AdUnitProps layout requirements */}
          <AdUnit slot="1769800630" format="auto" />
        </div>

        {/* Condensed intro — single line, smaller font */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this UAE & GCC salary calculator to compare any Gulf, Dubai, Saudi, or Qatar job offer — enter your offer letter details to turn base pay, allowances, and end of service gratuity into one clear total value, benchmarked against 2026 market rates.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <JobOfferEvaluator />

          <RelatedToolsStrip />
        </div>

        {/* Ad */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Added 'slot' prop to fulfill AdUnitProps layout requirements */}
          <AdUnit slot="3434236090" format="auto" />
        </div>

        {/* SEO Content Section */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

            {/* Section: What Your Package Really Means */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">UAE Job Offer Analysis</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">What your package really means</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  A gulf job offer can look attractive at first glance, especially when the headline salary is tax-free and the package includes housing, transport, annual flights, and medical insurance. But the real question is not just how much the company pays each month — it is how much value the full package creates over a year, over the contract term, and at the end of service. That is why a UAE job offer should be assessed with a structured job offer analysis instead of relying only on the base pay.
                </p>
                <p>
                  This page is designed for anyone comparing international job offers across the GCC, including professionals seeking job opportunities in Dubai for foreigners, expat salary Gulf comparisons, and relocation packages that include family support. A high salary in one city may still be weaker than a lower salary in another city once housing cost, school fees, transport, gratuity, and annual travel are included.
                </p>
                <p>
                  For many candidates, the most important documents are the job offer letter and the full offer letter terms. These define the basic salary, allowances, overtime rules, notice period, probation, end of service gratuity, and any clawbacks or deductions. Before you accept a UAE, Saudi, or Qatar job offer, review the package as a whole and compare it with the market benchmark for your role and level.
                </p>
              </div>
            </div>

            {/* Section: Dubai Job Offer Calculator */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dubai Job Offer Calculator</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">For real-world comparison</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  A Dubai job offer calculator should not only convert salary into a yearly figure. It should estimate how much of the package is actually usable after housing costs, commuting, dependents, schooling, and lifestyle expenses are taken into account. Dubai is highly competitive, so job offer in Dubai searches often focus on whether the role provides enough housing allowance or a strong enough total package to justify the move.
                </p>
                <p>
                  Instead of comparing offers by salary alone, a gulf job offer evaluator helps you compare base salary, fixed allowances, variable compensation, annual tickets, medical cover, and the likely value of gratuity. When deciding between two offers, the difference may be hidden in the bonus structure or in the end of service gratuity calculator logic rather than in the monthly wage.
                </p>
                <p>
                  Start by entering the basic salary from the offer letter, then include housing and transport allowances if they are fixed, add any annual bonus or flight allowance, and choose the country so the calculator can apply the correct gratuity assumptions. The result answers the question every candidate asks: is this really a strong offer, or just a high headline number?
                </p>
              </div>
            </div>

            {/* Section: GCC Salary Calculator */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">GCC Salary Calculator</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">UAE vs Saudi Arabia vs Qatar</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  A good GCC salary calculator needs to recognize that compensation rules differ across the region. A salary package in the UAE may rely heavily on housing allowance and annual flights, while a Saudi job offer may include different fixed allowances, relocation support, or family benefits. Qatar offers can also vary widely depending on whether the employer provides accommodation, transport, schooling, and medical coverage.
                </p>
                <p>
                  One role may have a higher basic salary, but another may be better once housing, gratuity, school fees, and flight allowance are included. A practical gulf job offer comparison should reflect the full value of the package — especially for expats planning a long-term move and for families trying to estimate the real financial impact of relocation.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Country</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">What to compare</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Why it matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">UAE</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Base salary, housing allowance, flights, gratuity</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Key for UAE salary calculator and job offer in Dubai analysis</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Saudi Arabia</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Fixed allowances, relocation support, end of service benefit</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Important for Saudi job offer and expat salary Gulf planning</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Qatar</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Accommodation, transport, schooling, contract benefits</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Useful for Qatar job offer and family budgeting</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: Gratuity */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Gratuity Calculator</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">UAE and Saudi end-of-service benefit explained</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  A gratuity calculator UAE section is essential because many professionals underestimate the value of end-of-service pay. In common UAE summaries, employees who complete at least one year may receive gratuity based on 21 days of basic salary for the first five years and 30 days for each year after that, subject to the legal rules and contract type. This is why a gratuity calculator UAE is not a bonus feature — it is a core part of job offer analysis.
                </p>
                <p>
                  Saudi compensation planning also benefits from an end of service gratuity calculator because the Saudi labor framework uses its own calculation rules. In many cases, the benefit is linked to length of service and resignation or termination conditions. For a candidate evaluating a Saudi job offer, the gratuity component can significantly affect the true total compensation GCC result.
                </p>
                <p>
                  When people search for an end of service gratuity calculator, they are usually trying to answer one simple question: how much money will I actually take home at the end of the contract? A strong gulf job offer should make that value easy to estimate from the beginning.
                </p>
              </div>
            </div>

            {/* Section: Offer Letter & Salary Negotiation */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Offer Letter & Salary Negotiation</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">How to negotiate from a position of clarity</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The job offer letter is one of the most important documents in the hiring process. It tells you what the employer is promising, what is fixed, what is conditional, and what is not included. Before you negotiate, use the calculator to understand the weakest parts of the package and the places where extra value can be added. Salary negotiation becomes far easier when you know whether the package is already competitive or needs improvement.
                </p>
                <p>
                  A smart salary negotiation strategy focuses on the total package rather than the base salary alone. If the salary is capped, try to improve the housing allowance, schooling support, transportation, annual ticket, signing bonus, or health insurance. In many international job offers, especially in the Gulf, those extras can be worth thousands of dollars per year and may be more valuable than a small salary increase.
                </p>
                <p>
                  Always check the offer letter for basic salary, allowances, gratuity treatment, probation terms, notice period, and any conditions that affect final compensation. That full picture is what makes a gulf job offer evaluator more useful than a basic salary calculator.
                </p>
              </div>
            </div>

            {/* Section: How to Use */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How to Use This Tool</h2>
              <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Enter your offer details.</strong> Input the salary and benefits from your job offer letter or offer letter — basic salary, housing allowance, transport, bonuses, annual flights, and contract length.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Select the country.</strong> Choose UAE, Saudi Arabia, Qatar, or another GCC country so the calculator applies the correct gratuity and market assumptions.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Review the total compensation.</strong> Compare the estimated annual value against the local benchmark and use the result to support salary negotiation or to decide between offers.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">4</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Include family costs if relevant.</strong> For a family move, add schooling and housing costs — those expenses can change the decision completely.</p>
                </li>
              </ol>
            </div>

            {/* Section: FAQ */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Is this a UAE salary calculator?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Yes. The page works as a UAE salary calculator and a Dubai job offer calculator by converting salary, allowances, and gratuity into a clear total annual value.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I use it for Saudi job offer analysis?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Yes. It is built for Saudi job offer comparison as well, including end of service gratuity and GCC salary calculator style analysis.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Does this help with salary negotiation?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Yes. The calculator shows where the offer is weak or strong, which makes salary negotiation more strategic and easier to support with numbers.</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This is an estimation tool based on public data and standard labor laws (2026). Actual contracts may vary. Always consult the full offer letter and relevant labor authorities.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
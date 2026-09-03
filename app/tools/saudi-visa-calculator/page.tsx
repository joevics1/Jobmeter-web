// app/tools/saudi-visa-calculator/page.tsx
import { Metadata } from 'next';
import SaudiVisaCalculator from './SaudiVisaCalculator';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/saudi-visa-calculator';

export const metadata: Metadata = {
  title: 'Saudi Skill Visa Points Calculator | High-Skilled Work Permit KSA',
  description: 'Free Saudi Arabia Work Visa Points Calculator. Check eligibility for High-Skilled, Skilled, or Basic tiers based on MHRSD / Qiwa guidelines. Salary, education, experience & more.',
  keywords: [
    'saudi skill visa calculator', 'ksa points calculator', 'saudi high skilled visa', 'saudi work permit eligibility',
    'qiwa visa calculator', 'saudi iqama high skilled', 'mhrsd points system', 'saudi visa 2026',
    'vision 2030 skilled worker', 'saudi work visa points', 'high skilled work permit ksa', 'saudi points based visa',
    'saudi work permit classification', 'oliver wyman saudi assessment', 'ssco visa calculator',
    'saudi iqama points checker', 'mhrsd skill tiers'
  ],
  openGraph: {
    title: 'Saudi Skill Visa Points Calculator - Gulf Job Meter',
    description: 'Instant eligibility check for Saudi High-Skilled Work Permit. Based on official MHRSD & Oliver Wyman-style points system.',
    images: [{ url: '/og-saudi-visa-calculator.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Saudi Skill Visa Points Calculator',
    url: pageUrl,
    description: 'Check eligibility for the Saudi High-Skilled Work Permit using our comprehensive points based system estimator.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://www.jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.jobmeter.app/og-saudi-visa-calculator.jpg',
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
        name: 'Saudi Skill Visa Points Calculator',
        item: pageUrl,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Saudi Skill Visa Points Calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'A tool designed to estimate points and determine eligibility for Saudi High-Skilled work permit tiers.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the Saudi Skill Visa Points Calculator',
    description: 'Enter your profession, monthly salary, educational degree, and career experience to calculate your work permit tier.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Select Occupation & Tier',
        text: 'Choose your profession matching the Saudi Standard Classification of Occupations.',
      },
      {
        '@type': 'HowToStep',
        name: 'Provide Salary & Credentials',
        text: 'Input monthly basic salary, fixed allowance details, education level, and documented experience.',
      },
      {
        '@type': 'HowToStep',
        name: 'Analyze Result Score',
        text: 'Check if you cross the target points threshold required for the premium work permit classification.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is a skill test compulsory for Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, for many technical and artisan professions, passing an assessment under the Saudi Skill Verification Program (SVP) is mandatory. However, executive roles in major groups 1-3 often bypass manual trade tests, provided they satisfy the alternative saudi professional accreditation points criteria and submit verified degrees through the ministry portal.' },
      },
      {
        '@type': 'Question',
        name: 'How much is a 1 year Saudi visa?',
        acceptedAnswer: { '@type': 'Answer', text: 'The total baseline cost for a business or work residency permit involves multiple components, including processing fees, corporate human resource levies, and health coverage premiums. While basic entry-level permits have lower base fees, specialized professional categories require additional verifications through the qiwa platform skill assessment ecosystem.' },
      },
      {
        '@type': 'Question',
        name: 'What is the salary of skilled workers in Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'Compensation values depend entirely on your industry domain, role seniority, and corporate structure. However, to qualify for premium categories via our saudi high skilled visa criteria, candidates typically need a monthly salary threshold starting at SAR 15,000, though this varies by sector under latest mhrsd skill tiers calculator rules.' },
      },
      {
        '@type': 'Question',
        name: 'What is the score for skilled worker visa?',
        acceptedAnswer: { '@type': 'Answer', text: 'While general technical classifications require meeting basic verification rules, the premium tier requires a score of 70 to 75 points. Running your profile through a saudi skilled worker points calculator helps ensure you check your standing against these targets before submitting paperwork.' },
      },
      {
        '@type': 'Question',
        name: 'Which skill is high demand in Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'Specializations in engineering, digital technology, medical infrastructure, and corporate management see the highest demand. These professions align directly with the targets of the vision 2030 skilled worker initiative, and checking your specific role code in our ssco visa calculator confirms if your background receives priority point weighting.' },
      },
      {
        '@type': 'Question',
        name: 'What are the common reasons for visa refusal for Saudi?',
        acceptedAnswer: { '@type': 'Answer', text: 'Common issues include discrepancies in your official employment contract, unaccredited academic credentials, failing the required medical clearance, or missing key milestones within the qiwa platform skill assessment. Ensuring your documentation matches the requirements of the mhrsd points system helps minimize these processing risks.' },
      },
      {
        '@type': 'Question',
        name: 'What happens after 5 years of Skilled Worker visa?',
        acceptedAnswer: { '@type': 'Answer', text: 'Long-term residents can renew their employment permits seamlessly, provided their employer maintains an active status on the ministry platforms. Accumulating high scores via our saudi work visa self assessment makes it easier to transition toward long-term premium residency options if you meet the baseline requirements.' },
      },
      {
        '@type': 'Question',
        name: 'What qualifies you as a Skilled Worker?',
        acceptedAnswer: { '@type': 'Answer', text: 'Qualification requires holding a recognized, attested degree or technical certificate coupled with verifiable professional experience. Running these factors through our ksa high skill visa eligibility tool shows you exactly how the ministry categorizes your background across the official tier options.' },
      },
      {
        '@type': 'Question',
        name: 'What is the minimum salary for a Skilled Worker visa?',
        acceptedAnswer: { '@type': 'Answer', text: 'While basic visas do not impose high minimum salary limits, entering the top tiers requires meeting strict income floors. Using our saudi high skilled visa calculator helps you check whether your base salary and fixed allowances satisfy the current sector requirements.' },
      },
      {
        '@type': 'Question',
        name: 'What job gives the most money in Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'Executive leadership roles, specialized medical fields, financial advisory, and advanced engineering sectors offer the highest compensation packages. These positions score maximum points within our saudi work visa points framework due to their high salary components and advanced professional accreditation requirements.' },
      },
      {
        '@type': 'Question',
        name: 'Is 3000 Riyal a good salary in Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'An income of SAR 3,000 serves as a standard entry-level salary for general basic support or technical trades. However, to qualify for premium administrative or expert categories within our saudi iqama high skilled matrix, your monthly package must significantly exceed these entry-level baselines.' },
      },
      {
        '@type': 'Question',
        name: 'How to apply for a Saudi skilled worker visa?',
        acceptedAnswer: { '@type': 'Answer', text: 'The process begins with an employer initiating a job offer via the official ministry portals. Once the preliminary contract is filed, you can use our saudi visa points checker to verify your points score, complete your degree attestations, and finalize your professional accreditations to complete the application.' },
      },
      {
        '@type': 'Question',
        name: 'How much is a Saudi work visa from Nigeria?',
        acceptedAnswer: { '@type': 'Answer', text: 'Total costs depend on local consular fees, processing agent charges, and document attestation requirements. Candidates should ensure their target position matches the criteria in our saudi work visa eligibility tool to avoid unexpected processing delays.' },
      },
      {
        '@type': 'Question',
        name: 'Which skill is best for Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: 'Technical expertise in software engineering, cloud computing, healthcare infrastructure, and project management offers the strongest career potential. Tracking your profile through our oliver wyman ksa visa tool model shows that these specialized skills provide the most direct path to crossing the high-skilled points threshold.' },
      },
      {
        '@type': 'Question',
        name: 'How do I verify my classification on Qiwa?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your employer manages your official classification directly through their company portal based on the mhrsd guidelines work permit skill categories. Our calculator serves as an independent estimator, allowing you to double-check your point totals and tier eligibility beforehand.' },
      },
      {
        '@type': 'Question',
        name: 'Can I download my skill verification certificate online?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, once you pass your technical assessments, you can access your credentials through the official skill test Saudi Arabia certificate download portals. Having a valid skill test certificate download linked to your profile is required to maintain a compliant skilled work status.' },
      },
      {
        '@type': 'Question',
        name: 'How can I check my official Takamol exam status?',
        acceptedAnswer: { '@type': 'Answer', text: 'Candidates can verify their performance metrics directly through the integrated Takamol Skill Verification Program electronic platform. Keeping these test records updated is essential for smooth how to check saudi iqama skill tier lookups and avoiding regulatory processing delays.' },
      },
      {
        '@type': 'Question',
        name: 'What are the primary benefits of a High-Skilled Iqama?',
        acceptedAnswer: { '@type': 'Answer', text: 'Securing a premium classification unlocks major operational advantages, including faster visa renewals, streamlined processing times, and a smoother path for family sponsorship high skilled saudi visa applications. Reviewing your profile with our saudi high skilled benefits iqama matrix helps you maximize these benefits.' },
      },
      {
        '@type': 'Question',
        name: 'How do I verify my status under Saudi Skilled Worker Visa guidelines?',
        acceptedAnswer: { '@type': 'Answer', text: 'Applicants must ensure their employment contracts are properly registered through the ministry\'s electronic systems. Checking your credentials with our specialized Saudi Skilled Worker Visa planning module helps ensure your paperwork aligns with the required point thresholds.' },
      },
      {
        '@type': 'Question',
        name: 'How do changes to the visa rules affect my current Iqama?',
        acceptedAnswer: { '@type': 'Answer', text: 'Existing work permits remain valid until their expiration date, but renewals must comply with the updated saudi visa updates high skilled structural models. Keeping track of your profile score via our qiwa work permit classification tool simulator helps ensure you stay ahead of any regulatory updates.' },
      },
    ],
  },
];

export default function SaudiVisaPage() {
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
            
            {/* Breadcrumb — inside hero */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Saudi Skill Visa Points Calculator</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Saudi Skill Visa Points Calculator
            </h1>
            <p className="text-2xl max-w-4xl mx-auto">
              High-Skilled Work Permit Eligibility Checker (MHRSD / Qiwa)
            </p>
            <p className="mt-4 text-blue-100 text-lg">
              Based on official guidelines + Oliver Wyman self-assessment model
            </p>
          </div>
        </div>

        {/* Top Ad Area */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4198231153" format="auto" className="my-4" />
*/}
        </div>

        {/* Condensed Intro Container */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this premium <span className="font-semibold">saudi skill visa calculator</span> to estimate your professional classification tier instantly. Enter your career credentials, professional accreditation status, monthly salary, and academic degree to see if you achieve the target points threshold needed to secure high-tier iqama privileges.
            </p>
          </div>
        </div>

        {/* Main interactive tool element */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <SaudiVisaCalculator />

          <RelatedToolsStrip />
        </div>

        {/* Middle Ad Area */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4690286797" layout="in-article" className="my-6" />
*/}
        </div>

        {/* Extended Strategic Search Layout */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

            {/* Section 1: Core Mechanics */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Saudi Skill-Based Work Permit Allocation</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Understanding the structural mechanics of professional classification</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The labor framework regulated by the Ministry of Human Resources and Social Development completely shifts how international professional packages are processed. Under the contemporary guidelines, the kingdom implements an analytics-driven structure to process every work permit Saudi Arabia issues. This model evaluates an applicant through a complex matrix known as the <strong>saudi points based system visa</strong>. Our system functions as a robust <strong>saudi skill visa calculator</strong> and comprehensive <strong>ksa points calculator</strong>, mirroring the structural filters utilized by corporate employers during the regulatory validation process.
                </p>
                <p>
                  By moving away from unstructured qualification metrics, the ministries rely on the official <strong>saudi standard classification occupations visa</strong> to group incoming professionals. If your defined professional role corresponds to <strong>ssco groups 1-3 visa</strong> parameters, your profile becomes eligible to target premium classification brackets. Utilizing our advanced <strong>saudi high skilled visa calculator</strong> ensures you map your specific profession accurately against standard parameters before starting visa processing or concluding contract terms.
                </p>
                <p>
                  This modern structural framework evaluates your salary, background credentials, verified experience metrics, and industry domain. Individuals aiming to pass immigration screening rely on our specialized <strong>saudi work permit points calculator</strong> to perform an independent audit of their eligibility score. By inputting specific career metrics into this matrix, you discover how the combination of base compensation figures and validated credentials forms your professional profile score.
                </p>
              </div>
            </div>

            {/* Section 2: Core Matrix Breakdown */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">MHRSD Tiers & Points Allocation</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Deep dive into the operational scoring logic</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  When utilizing a <strong>qiwa visa calculator</strong> or an operational <strong>saudi iqama points calculator</strong>, candidates must realize that scoring points are distributed across distinct performance pillars. The system weights variables such as academic credentials, basic salary metrics, age demographics, and continuous years of verified professional experience. This interactive system relies heavily on calculations modeled after the <strong>oliver wyman saudi skill visa assessment</strong> system, which sets clear target thresholds for global expat talent.
                </p>
                <p>
                  To secure the top tier classification, applicants must cross the rigorous <strong>saudi high skilled 70 points / 75 points</strong> score requirement. Our built-in <strong>mhrsd points system calculator</strong> helps check exactly where your background lands on this spectrum. Scoring points are heavily influenced by your monthly basic compensation package, which is why an integrated <strong>saudi work visa salary threshold calculator</strong> is critical to evaluating whether your corporate offer guarantees automatic entry into premium immigration categories.
                </p>
                <p>
                  Beyond compensation, your specific academic history plays a major role in your overall score. Having a verified Master’s degree or PhD yields substantial scoring boosts within the <strong>saudi visa education experience salary points</strong> calculation. Similarly, utilizing a <strong>saudi visa experience points calculator</strong> helps outline how many points you receive for each year of documented corporate tenure, making the final immigration application review far more predictable.
                </p>
              </div>
            </div>

            {/* Section 3: Professional Categories Comparative Analysis */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Visa Tiers and Verification Matrix</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Structural comparison of basic, skilled, and premium profiles</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The official system divides work permits into three tiers: Basic, Skilled, and High-Skilled. To understand how these categories differ, candidates must compare the <strong>saudi skilled vs high skilled</strong> requirements alongside the entry-level <strong>saudi basic skilled work permit</strong> parameters. Securing a placement within the top tier requires deep structural compliance with the updated <strong>saudi work permit classification</strong> guidelines.
                </p>
                <p>
                  A critical step in validating your tier placement involves the <strong>Saudi Skill Verification Program (SVP)</strong>. Depending on your occupation, passing a physical or theoretical examination might be required. For instance, testing requirements like the <strong>SVP skill test</strong> or specific <strong>Takamol test result check online Saudi Arabia</strong> portals ensure your skills match local requirements. Our <strong>saudi expat skill level checker</strong> helps determine whether your role requires a standard test or professional accreditation.
                </p>
              </div>

              {/* Comprehensive Metric Mapping Data Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Immigration Tier</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Core Eligibility Framework</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Required Scoring Tools & Verifications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">High-Skilled</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">SSCO Major Groups 1-3, high salary thresholds, advanced academic history.</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Requires 70-75 points via saudi high skilled visa tool matrix.</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Skilled</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Technical roles, mandatory professional accreditation, specific sector experience.</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Requires Takamol Skill Verification Program and active skill test.</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">Basic Skilled</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">General labor occupations, base entry qualifications, minimal structural score requirements.</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Subject to basic skill test Saudi Arabia certificate download checks.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Deep Strategic Insights */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Strategic Integration with Vision 2030</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Evaluating macro-economic objectives and premium talent paths</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  This point-based structural shift aligns directly with the strategic goals of the <strong>vision 2030 skilled worker visa</strong> framework. By optimizing how work permits are allocated, the kingdom aims to attract top global talent to accelerate its economic transformation. Utilizing our <strong>saudi skill based visa eligibility</strong> calculator shows you how well your background fits these national strategic goals.
                </p>
                <p>
                  For highly educated professionals, achieving a high score on the <strong>saudi arabia work permit calculator</strong> unlocks major long-term career benefits. These perks include streamlined corporate processing, faster ministry approvals, and a clearer path to <strong>family sponsorship high skilled saudi visa</strong> processing. Tracking your status using an independent <strong>saudi iqama points checker</strong> helps you confirm your profile qualifies for these premium benefits before finalizing relocation terms.
                </p>
                <p>
                  Additionally, the points system creates a clear framework for <strong>saudi work permit renewal high skilled</strong> applications. If you maintain the required salary thresholds and professional accreditations, your renewals are processed through the ministry faster than standard labor classifications. For anyone using our <strong>saudi skill visa calculator gulf</strong> edition, this provides a reliable way to assess long-term career stability in the region.
                </p>
                <p>
                  Whether your specialization falls under <strong>ksa work visa points for engineers / it / doctors / managers</strong> categories, each domain contains unique point weights. For instance, specific engineering domains or high-level executive positions receive higher priority weighting within the <strong>qiwa platform skill assessment</strong> matrix. This ensures the point system remains responsive to the country's actual economic demands.
                </p>
              </div>
            </div>

            {/* Section 5: Step-by-Step Practical Integration Guide */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How to Evaluate Your Professional Points Score</h2>
              <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Map your profile against the SSCO framework.</strong> Review your corporate offer letter and map your position description directly onto the official classification groups using our <strong>ssco high skilled calculator</strong> logic.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Input your total compensation.</strong> Use the <strong>saudi visa points checker</strong> to log your monthly basic salary along with any guaranteed monthly fixed allowances to verify your salary points bracket.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Log academic and professional experience data.</strong> Enter your highest level of completed education and total years of verifiable experience to let our <strong>saudi arabia points calculator iqama</strong> model process your core credentials score.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">4</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Verify your target tier placement.</strong> Check your final score against the required 70-75 points high skilled threshold to see if your profile qualifies for fast-tracked <strong>qiwa skill classification</strong> processing.</p>
                </li>
              </ol>
            </div>

            {/* Section 6: Comprehensive Regulatory FAQ Area */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Is a skill test compulsory for Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes, for many technical and artisan professions, passing an assessment under the <strong>Saudi Skill Verification Program (SVP)</strong> is mandatory. However, executive roles in major groups 1-3 often bypass manual trade tests, provided they satisfy the alternative <strong>saudi professional accreditation points</strong> criteria and submit verified degrees through the ministry portal.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How much is a 1 year Saudi visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    The total baseline cost for a business or work residency permit involves multiple components, including processing fees, corporate human resource levies, and health coverage premiums. While basic entry-level permits have lower base fees, specialized professional categories require additional verifications through the <strong>qiwa platform skill assessment</strong> ecosystem.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is the salary of skilled workers in Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Compensation values depend entirely on your industry domain, role seniority, and corporate structure. However, to qualify for premium categories via our <strong>saudi high skilled visa</strong> criteria, candidates typically need a monthly salary threshold starting at SAR 15,000, though this varies by sector under latest <strong>mhrsd skill tiers calculator</strong> rules.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is the score for skilled worker visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    While general technical classifications require meeting basic verification rules, the premium tier requires a score of 70 to 75 points. Running your profile through a <strong>saudi skilled worker points calculator</strong> helps ensure you check your standing against these targets before submitting paperwork.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Which skill is high demand in Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Specializations in engineering, digital technology, medical infrastructure, and corporate management see the highest demand. These professions align directly with the targets of the <strong>vision 2030 skilled worker</strong> initiative, and checking your specific role code in our <strong>ssco visa calculator</strong> confirms if your background receives priority point weighting.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What are the common reasons for visa refusal for Saudi?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Common issues include discrepancies in your official employment contract, unaccredited academic credentials, failing the required medical clearance, or missing key milestones within the <strong>qiwa platform skill assessment</strong>. Ensuring your documentation matches the requirements of the <strong>mhrsd points system</strong> helps minimize these processing risks.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What happens after 5 years of Skilled Worker visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Long-term residents can renew their employment permits seamlessly, provided their employer maintains an active status on the ministry platforms. Accumulating high scores via our <strong>saudi work visa self assessment</strong> makes it easier to transition toward long-term premium residency options if you meet the baseline requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What qualifies you as a Skilled Worker?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Qualification requires holding a recognized, attested degree or technical certificate coupled with verifiable professional experience. Running these factors through our <strong>ksa high skill visa eligibility tool</strong> shows you exactly how the ministry categorizes your background across the official tier options.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is the minimum salary for a Skilled Worker visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    While basic visas do not impose high minimum salary limits, entering the top tiers requires meeting strict income floors. Using our <strong>saudi high skilled visa calculator</strong> helps you check whether your base salary and fixed allowances satisfy the current sector requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What job gives the most money in Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Executive leadership roles, specialized medical fields, financial advisory, and advanced engineering sectors offer the highest compensation packages. These positions score maximum points within our <strong>saudi work visa points</strong> framework due to their high salary components and advanced professional accreditation requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Is 3000 Riyal a good salary in Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    An income of SAR 3,000 serves as a standard entry-level salary for general basic support or technical trades. However, to qualify for premium administrative or expert categories within our <strong>saudi iqama high skilled</strong> matrix, your monthly package must significantly exceed these entry-level baselines.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How to apply for a Saudi skilled worker visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    The process begins with an employer initiating a job offer via the official ministry portals. Once the preliminary contract is filed, you can use our <strong>saudi visa points checker</strong> to verify your points score, complete your degree attestations, and finalize your professional accreditations to complete the application.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How much is a Saudi work visa from Nigeria?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Total costs depend on local consular fees, processing agent charges, and document attestation requirements. Candidates should ensure their target position matches the criteria in our <strong>saudi work visa eligibility</strong> tool to avoid unexpected processing delays.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Which skill is best for Saudi Arabia?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Technical expertise in software engineering, cloud computing, healthcare infrastructure, and project management offers the strongest career potential. Tracking your profile through our <strong>oliver wyman ksa visa tool</strong> model shows that these specialized skills provide the most direct path to crossing the high-skilled points threshold.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do I verify my classification on Qiwa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Your employer manages your official classification directly through their company portal based on the <strong>mhrsd guidelines work permit skill categories</strong>. Our calculator serves as an independent estimator, allowing you to double-check your point totals and tier eligibility beforehand.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I download my skill verification certificate online?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes, once you pass your technical assessments, you can access your credentials through the official <strong>skill test Saudi Arabia certificate download</strong> portals. Having a valid <strong>skill test certificate download</strong> linked to your profile is required to maintain a compliant skilled work status.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How can I check my official Takamol exam status?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Candidates can verify their performance metrics directly through the integrated <strong>Takamol Skill Verification Program</strong> electronic platform. Keeping these test records updated is essential for smooth <strong>how to check saudi iqama skill tier</strong> lookups and avoiding regulatory processing delays.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What are the primary benefits of a High-Skilled Iqama?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Securing a premium classification unlocks major operational advantages, including faster visa renewals, streamlined processing times, and a smoother path for <strong>family sponsorship high skilled saudi visa</strong> applications. Reviewing your profile with our <strong>saudi high skilled benefits iqama</strong> matrix helps you maximize these benefits.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do I verify my status under Saudi Skilled Worker Visa guidelines?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Applicants must ensure their employment contracts are properly registered through the ministry's electronic systems. Checking your credentials with our specialized <strong>Saudi Skilled Worker Visa</strong> planning module helps ensure your paperwork aligns with the required point thresholds.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do changes to the visa rules affect my current Iqama?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Existing work permits remain valid until their expiration date, but renewals must comply with the updated <strong>saudi visa updates high skilled</strong> structural models. Keeping track of your profile score via our <strong>qiwa work permit classification tool</strong> simulator helps ensure you stay ahead of any regulatory updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer block */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This is an educational estimation tool based on public data and standard labor models. Actual contracts and classifications may vary. Always consult official Qiwa platform setups and relevant labor authorities.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Ad Area */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="9751041788" format="auto" className="my-4" />
*/}
        </div>
      </div>
    </>
  );
}
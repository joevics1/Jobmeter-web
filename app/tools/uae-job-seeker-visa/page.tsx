// app/tools/uae-job-seeker-visa/page.tsx
import { Metadata } from 'next';
import UAEJobSeekerVisaTool from './UAEJobSeekerVisaTool';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/uae-job-seeker-visa';

export const metadata: Metadata = {
  title: 'UAE Job Seeker Visa Eligibility Checker | 60/90/120 Days',
  description: 'Check your eligibility for UAE Job Seeker Visa (60, 90 or 120 days) instantly. No sponsor needed. Get personalized assessment, cost breakdown, and document checklist.',
  keywords: [
    'UAE job seeker visa', 'UAE jobseeker visa', 'job seeker visa UAE', 'Dubai job seeker visa',
    '120 days job seeker visa UAE', '90 days job seeker visa UAE', '60 days job seeker visa UAE',
    'UAE visa without sponsor', 'job seeker visa without sponsor', 'ICP job seeker visa',
    'UAE job seeker visa eligibility', 'UAE job seeker visa requirements', 'UAE job seeker visa cost',
    'attested degree UAE visa', 'MOHRE skill level', 'job search visa UAE',
    'UAE visa requirements', 'apply UAE job seeker visa online', 'UAE job seeker visa documents',
    'recent graduate visa UAE', 'job seeker visa UAE from India', 'GDRFA job seeker visa'
  ],
  openGraph: {
    title: 'UAE Job Seeker Visa Eligibility Checker - Gulf Job Meter',
    description: 'Free instant assessment with cost estimator and official checklist',
    images: [{ url: '/og-visa-tool.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'UAE Job Seeker Visa Eligibility Checker',
    url: pageUrl,
    description: 'Check your eligibility for the UAE Job Seeker Visa instantly without a local sponsor.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://www.jobmeter.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.jobmeter.app/og-visa-tool.jpg',
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
        name: 'UAE Job Seeker Visa Eligibility Checker',
        item: pageUrl,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'UAE Job Seeker Visa Eligibility Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'An interactive system designed to evaluate professional profiles against official ministry criteria for unsponsored visas.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the UAE Job Seeker Visa Eligibility Checker',
    description: 'Determine your qualification level, structural tiering, and administrative pricing calculations instantly.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Input Qualification Data',
        text: 'Select your verified academic tier, graduation timeline, and professional classification status.',
      },
      {
        '@type': 'HowToStep',
        name: 'Evaluate Structural Tiers',
        text: 'Map your background against official guidelines to view potential durations.',
      },
      {
        '@type': 'HowToStep',
        name: 'Review the Breakdown',
        text: 'Analyze the system-generated documentation checklist and estimated financial setup fees.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is eligible for a job seeker visa in the UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Professionals classified under specific skill levels holding an accredited degree from a top global university or recent graduates may qualify.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a sponsor for the Dubai job seeker visa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, this framework provides an entirely unsponsored pathway for qualified foreign talent looking to enter the local market.',
        },
      },
    ],
  },
];

export default function UAEJobSeekerVisaPage() {
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
              <span className="text-white font-medium">UAE Job Seeker Visa Eligibility Checker</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              UAE Job Seeker Visa Eligibility Checker
            </h1>
            <p className="text-2xl max-w-4xl mx-auto">
              Discover if you qualify for 60, 90, or 120 days visa in the UAE — No sponsor required
            </p>
            <p className="mt-4 text-blue-100 text-lg">
              Based on official ICP, GDRFA & MOHRE guidelines
            </p>
          </div>
        </div>

        {/* Top Ad */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <AdUnit slot="1769800630" format="auto" />
        </div>

        {/* Condensed intro — single line, smaller font */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this interactive eligibility tracker to assess your credentials against official criteria, mapping out specialized pathways for the Dubai job seeker visa, structural tier requirements, and localized compliance pricing metrics dynamically.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          <UAEJobSeekerVisaTool />

          <RelatedToolsStrip />
        </div>

        {/* Middle Ad */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <AdUnit slot="8855092895" format="fluid" layout="in-article" />
        </div>

        {/* Detailed SEO & Educational Content */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section 1 */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">UAE Job Seeker Visa Analysis</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">What your eligibility status means</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Evaluating a cross-border professional transition requires deep alignment with standard frameworks. The <strong>UAE job seeker visa</strong> serves as a verified, legal gateway for international candidates aiming to anchor their careers in a highly competitive economic zone. Unlike traditional employment processing, utilizing the specialized <strong>UAE jobseeker visa</strong> route allows an individual to explore the local ecosystem directly without an immediate corporate commitment. This structured <strong>job seeker visa UAE</strong> layout ensures complete freedom of movement during standard search parameters.
                </p>
                <p>
                  For individuals navigating structural immigration frameworks, securing a formal <strong>jobseeker visit visa UAE</strong> document ensures complete alignment with executive decrees. Navigating the expanding business landscape via a dedicated <strong>Dubai job seeker visa</strong> or an official <strong>Abu Dhabi job seeker visa</strong> gives you a clear competitive advantage in timing and local networking. By bypassing third-party intermediaries, candidates leverage an automated <strong>UAE job search visa</strong> stream optimized for high-demand modern industries.
                </p>
                <p>
                  The system accommodates varying timelines tailored to specific strategic goals, offering a flexible <strong>120 days job seeker visa UAE</strong> program, a balanced <strong>90 days job seeker visa UAE</strong> option, or a concise <strong>60 days job seeker visa UAE</strong> track. Operating completely as a <strong>UAE visa without sponsor</strong> mechanism, this path transfers complete structural autonomy to the applicant. By utilizing a verified <strong>job seeker visa without sponsor</strong> configuration, international talent mitigates entry vulnerabilities through a completely legitimate, officially audited <strong>unsponsored visa UAE</strong> framework.
                </p>
                <p>
                  When individuals assess global mobility strategies, they frequently weigh options like a <strong>freelance visa dubai</strong> or a standard corporate <strong>dubai work visa</strong>. Each path carries specific baseline requirements. While a formal <strong>dubai work permit</strong> requires direct corporate backing, a flexible <strong>dubai work permit visa</strong> or an unsponsored entry layout allows professionals to negotiate compensation packages with multiple firms simultaneously. Understanding total overhead, including the <strong>dubai employment visa cost</strong>, <strong>dubai employment visa price</strong>, and specific <strong>dubai employment visa charges</strong>, is essential before planning your target arrival timeline.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dubai Job Seeker Visa Calculator & Practical Application Guide</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">For real-world alignment</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Managing your career transition budget requires a transparent look at standard corporate pricing tiers, such as the entry <strong>dubai employment visa fees</strong> or specialized executive paths like a <strong>manager visa dubai</strong>. Navigating the system using a dedicated <strong>dubai job visa</strong> portal ensures complete transactional visibility. Candidates must also keep specific regulatory guidelines in mind, such as the standard <strong>freelance visa dubai requirements</strong>, to accurately plan their career steps.
                </p>
                <p>
                  Using official digital portals to <strong>dubai work visa online apply</strong> channels speeds up file generation times significantly. Knowing your baseline entry expenses, including the estimated <strong>dubai work visa price</strong> or general <strong>company visa in dubai</strong> processing fees, prevents unexpected financial constraints upon arrival. For long-term validation, tracking how a standard <strong>dubai employment visa</strong> converts into a localized residency card ensures compliance across all administrative levels.
                </p>
                <p>
                  Securing <strong>own visa jobs in dubai</strong> gives you the flexibility to move freely across competitive market sectors. For regional variations, tracking paths like a <strong>dubai work visa for pakistani</strong> citizens or finding <strong>jobs in dubai with visa sponsorship</strong> criteria can change your path completely. From navigating a <strong>dubai job visa for pakistani</strong> applicant to reviewing general <strong>dubai work visa fees</strong>, our tracking systems offer detailed clarity for international candidates.
                </p>
                <p>
                  This interactive tool is built to streamline your search, whether you are utilizing a targeted <strong>job search visa dubai</strong> track or looking up the exact <strong>job seeker visa uae price</strong> structure. By checking if a <strong>temporary work permit dubai</strong> fits your field or reviewing the standard steps of a <strong>dubai employment visa process</strong>, you can approach the job market with clear data. Every step, from analyzing the <strong>dubai employment visa process time</strong> to using a <strong>dubai visit visa for job seekers</strong>, is mapped out to optimize your timeline.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">MOHRE Skill Levels & Educational Document Attestation Matrix</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">UAE vs individual emirates regulatory standards</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  To secure formal approval, an applicant's academic history must line up exactly with local classifications. Checking your <strong>UAE job seeker visa eligibility</strong> parameters requires a detailed review of all mandatory verification documents. Meeting the <strong>job seeker visa UAE requirements</strong> depends heavily on your corporate ranking under the official <strong>MOHRE skill level job seeker visa</strong> directive. This framework separates applicants into clear operational bands, specifically <strong>skill level 1 2 3 UAE visa</strong> tiers, to match your experience with local market needs.
                </p>
                <p>
                  Young professionals can take advantage of the dedicated <strong>recent graduate visa UAE</strong> path, which provides an accelerated entry track for alumni from a <strong>top 500 university UAE visa</strong> list. A critical step in this process is securing an <strong>attested degree UAE visa</strong> document, which proves your academic records are authentic. Gathering the right <strong>UAE job seeker visa documents</strong> and following an official <strong>UAE job seeker visa checklist</strong> are essential steps to avoid processing delays.
                </p>
                <p>
                  A verified <strong>bachelor degree UAE job seeker visa</strong> pathway requires strict financial planning. Applicants must submit official <strong>financial proof job seeker visa UAE</strong> statements along with a mandatory <strong>security deposit UAE job seeker visa</strong> to complete their file. For country-specific tracking, evaluating the standard <strong>dubai work permit for pakistani</strong> files or monitoring the <strong>dubai work permit processing time</strong> helps you plan your departure details perfectly.
                </p>
                <p>
                  If you are assessing options like a <strong>dubai work permit visa for pakistani</strong> citizens or checking the latest <strong>job seeking visa uae price</strong> updates, maintaining high compliance is key. The modern digital ecosystem empowers the modern <strong>jobseeker uae</strong> by cutting out complex steps. From tracking your <strong>working visa dubai processing time</strong> to calculating the <strong>dubai work visa for indian</strong> professional tiers, this framework provides clear, actionable pathways for global talent.
                </p>
                <p>
                  A deep dive into specialized paths, such as the <strong>self employed visa dubai</strong> or an official <strong>freelance work permit dubai</strong>, reveals unique professional advantages. Many candidates find that holding a <strong>dubai visa freelance</strong> setup gives them more control over their client contracts. Exploring <strong>freelance visa jobs in dubai</strong> or finding entry-level <strong>free visa jobs in dubai</strong> are excellent ways to get your foot in the door of this fast-moving economy.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Classification Tiers</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Regulatory Verification Elements</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Operational Value Drivers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">MOHRE Skill Level 1</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Managers, Executives, Senior Directors</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Essential for corporate setups and long-term residency tracks</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">MOHRE Skill Level 2</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Technical Specialists, Engineers, Scientists</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Optimizes paths for specialized tech and engineering roles</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">MOHRE Skill Level 3</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Associate Professionals, Technicians, Specialized Staff</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Streamlines entries for technical support and operational experts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Unsponsored Visa Framework & Total Cost Breakdown</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Strategic planning panel</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Filing your application through an official <strong>dubai online work visa apply</strong> portal keeps your professional transition moving quickly. Ensuring your documentation matches the required <strong>visa dubai freelance</strong> specifications keeps your profile fully compliant with local labor laws. For detailed budgeting, tracking your total expenses using an interactive <strong>UAE job seeker visa cost</strong> calculator keeps your finances clear. Reviewing the <strong>Dubai job seeker visa fees</strong> up front helps you manage your relocation capital effectively.
                </p>
                <p>
                  Calculating the comprehensive <strong>120 days job seeker visa cost UAE</strong> package gives you a clear financial view of your job search timeline. Using official platforms like the <strong>ICP job seeker visa</strong> system or checking status details through the <strong>GDRFA job seeker visa</strong> network ensures reliable, authorized file management. Qualified candidates can easily <strong>apply UAE job seeker visa online</strong> to move toward a more flexible career setup.
                </p>
                <p>
                  If you are analyzing options like the <strong>job seeker visa UAE from India</strong> framework or evaluating how to transition from a <strong>job seeker visa UAE inside country</strong> status, accurate data is your best tool. Learning <strong>how to apply for UAE job seeker visa</strong> pathways properly protects your career investment. Maintaining high profile standards leads to a stronger <strong>UAE job seeker visa success rate</strong> during key hiring seasons.
                </p>
                <p>
                  Before making your move, it is smart to check if you <strong>can I extend job seeker visa UAE</strong> permissions or review common <strong>UAE job seeker visa rejection reasons</strong> to keep your application on track. Comparing a <strong>job seeker visa vs tourist visa UAE</strong> setup highlights the distinct legal and professional benefits of choosing a dedicated job search track. Similarly, comparing a <strong>freelance visa vs job seeker visa UAE</strong> path lets you pick the exact framework that fits your target lifestyle.
                </p>
                <p>
                  Using an official <strong>UAE job exploration visa</strong> format provides a secure, fully authorized entry into the country's main commercial hubs. Choosing a <strong>no sponsor job visa UAE</strong> model gives you the independence to look for opportunities across different emirates. From evaluating <strong>UAE freelance visa eligibility</strong> rules to utilizing a <strong>work visa without job offer UAE</strong> mechanism, this platform gives you the tools to take charge of your career path.
                </p>
                <p>
                  Planning your move around a <strong>visit visa for job search UAE</strong> option or anchoring your application via a <strong>UAE talent visa job seeker</strong> profile ensures you match the criteria local employers are looking for. Reviewing <strong>MOHRE skill levels explained</strong> documentation clarifies your exact market position. Making sure you have all <strong>attested documents for UAE visa</strong> processing ready ensures a smooth, predictable path from application to approval.
                </p>
                <p>
                  Completing the mandatory <strong>UAE visa medical test job seeker</strong> screening is a vital final step to activate your entry permits. From processing steps via a <strong>Job Seeker visa Dubai apply online</strong> link to tracking updates on a <strong>UAE job seeker visa official website</strong>, our tools keep you closely connected to official workflows. Ensuring you meet every single <strong>UAE job seeker visa requirements</strong> parameter guarantees complete peace of mind.
                </p>
                <p>
                  Confirming the <strong>Job seeking visa Dubai price</strong> metrics early lets you allocate your transition funds wisely. Submitting a comprehensive <strong>UAE job seeker visa application</strong> unlocks direct access to top corporate networks. Reviewing the official <strong>UAE job seeker visa university list</strong> lets recent graduates verify their eligibility status instantly. In addition, checking the <strong>UAE job seeker visa processing time</strong> helps you coordinate your travel logistics down to the day.
                </p>
                <p>
                  Comparing a <strong>Uae job seeker visa vs tourist visa</strong> setup highlights the clear advantages of holding a proper, employment-focused entry permit. For regional placement, matching the <strong>Dubai job seeker visa eligibility</strong> rules or looking into a <strong>Sharjah job seeker visa</strong> path expands your professional reach. This deep market access opens up high-value <strong>job opportunities visa UAE</strong> pathways across key modern fields.
                </p>
                <p>
                  Whether you are navigating the system as a specialized <strong>dubai work visa requirements</strong> applicant or tracking overall baseline requirements, this interactive system is built to guide your steps. By streamlining your documentation and checking your background against official benchmarks, you can build a stable, compliant foundation for long-term career success in the region.
                </p>
              </div>
            </div>

            {/* Section 5: How to Use */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How to Use This Tool</h2>
              <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Input Qualification Data.</strong> Select your verified academic tier, graduation timeline, and professional classification status within the system interface.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Evaluate Structural Tiers.</strong> Map your professional background against current ministry guidelines to view potential visa durations and paths.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Review the System Breakdown.</strong> Analyze the system-generated documentation checklist and estimated financial setup fees required for official submission.</p>
                </li>
              </ol>
            </div>

            {/* Section 6: FAQ */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Who is eligible for a job seeker visa in the UAE?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Professionals classified under MOHRE skill levels 1, 2, or 3 who hold an accredited bachelor's degree from a top-ranked global university, as well as recent graduates, can qualify under this unsponsored framework.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Do I need a sponsor for the Dubai job seeker visa?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    No. This framework is specifically designed to provide an entirely unsponsored pathway, allowing qualified global talent to legally enter and explore the local job market independently.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How does document attestation affect the application?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Having an attested degree is a mandatory requirement. Your educational certificates must be fully verified by the Ministry of Education to confirm your profile matches the required skill classification tiers.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This is an estimation tool based on public data and standard labor laws. Actual configurations may vary. Always consult the official entry portals and relevant labor authorities before planning your relocation.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Ad */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AdUnit slot="3434236090" format="auto" />
        </div>
      </div>
    </>
  );
}
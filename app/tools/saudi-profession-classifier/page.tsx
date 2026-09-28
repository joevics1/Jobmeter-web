import { Metadata } from 'next';
import AdUnit from '@/components/ads/AdUnit';
import { SaudiProfessionClassifierClient } from './SaudiProfessionClassifierClient';
import Script from 'next/script';

const pageUrl = 'https://www.jobmeter.app/tools/saudi-profession-classifier';

export const metadata: Metadata = {
  title: 'Saudi Profession Classification Checker | High-Skilled, Skilled or Basic (KSA)',
  description: 'Free Saudi Arabia Work Permit Skill Tier Checker. Determine if your job is High-Skilled, Skilled or Basic under Ministerial Resolution 4602. Iqama, Qiwa, Nitaqat & visa implications explained.',
  keywords: [
    'saudi profession classification', 'ksa skill tier', 'high skilled saudi', 'qiwa occupation checker',
    'ssco job code', 'saudi iqama renewal', 'work permit classification saudi', 'ministerial resolution 4602',
    'vision 2030 jobs', 'nitaqat classification', 'saudi skill tier checker', 'high skilled work permit saudi', 
    'qiwa skill classification', 'saudi standard classification of occupations', 'iqama profession code checker',
    'saudi work permit skill level', 'ssco occupation code', 'high skilled iqama', 'saudi points based work permit', 
    'nitaqat skill tier', 'saudi occupation classification tool', 'Saudi Arabia profession', 
    'Unique occupation worker in Saudi Arabia', 'Iqama profession meaning', 'Unique occupation worker meaning', 
    'Ssco list', 'Unique occupation Worker visa', 'Iqama profession computer science specialist', 'Ssic codes saudi'
  ],
  openGraph: {
    title: 'Saudi Profession Classification Checker - Gulf Job Meter',
    description: 'Instant skill tier assessment for Saudi work permits under Ministerial Resolution 4602',
    url: pageUrl,
    images: [{ url: '/og-saudi-classifier.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Saudi Profession Classification Checker',
    url: pageUrl,
    description: 'A tool to check Saudi Arabia work permit skill tiers (High-Skilled, Skilled, Basic) based on SSCO and Ministerial Resolution 4602.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Gulf Job Meter',
      url: 'https://www.jobmeter.app',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Saudi Profession Classification Checker', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Saudi Profession Classification Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Assess Saudi iqama profession codes and skill levels for Qiwa and Nitaqat compliance.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is an SSCO code and why does it matter?',
        acceptedAnswer: { '@type': 'Answer', text: 'SSCO stands for the Saudi Standard Classification of Occupations — the official system HRSD and Qiwa use to categorize every job title in the Kingdom. Your SSCO code determines your skill tier, which affects your Nitaqat classification, visa category, and family sponsorship eligibility.' },
      },
      {
        '@type': 'Question',
        name: 'How is my skill tier different from my job title?',
        acceptedAnswer: { '@type': 'Answer', text: "Your job title is what's on your offer letter or Iqama, but your skill tier (High-Skilled, Skilled, or Basic) is assigned by the SSCO classification system based on the closest matching occupation code — the two don't always align perfectly." },
      },
      {
        '@type': 'Question',
        name: "Can my employer classify me differently from this tool's result?",
        acceptedAnswer: { '@type': 'Answer', text: "Yes — this tool gives an independent estimate, but your official classification is set by your employer through the Qiwa platform and confirmed by HRSD." },
      },
      {
        '@type': 'Question',
        name: 'Does a Basic-tier classification limit family sponsorship?',
        acceptedAnswer: { '@type': 'Answer', text: 'Generally yes — elementary/Basic-tier occupations (Group 9) typically face more restricted family sponsorship terms than Skilled or High-Skilled tiers under current Saudi labor rules.' },
      },
    ],
  },
];

export default function SaudiProfessionClassifierPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Top Display Ad */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <AdUnit slot="1769800630" format="auto" />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Breadcrumb — inside hero */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-emerald-50 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Saudi Profession Classification</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm mb-6">
              🇸🇦 Saudi Arabia • Ministerial Resolution 4602
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Saudi Profession<br />Classification Checker
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl opacity-90">
              Instantly check if your job title is <span className="font-semibold">High-Skilled</span>,{' '}
              <span className="font-semibold">Skilled</span>, or <span className="font-semibold">Basic</span>
            </p>
          </div>
        </div>

        {/* Condensed intro container */}
        <div className="max-w-5xl mx-auto px-6 pb-8 -mt-4 relative z-20">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this Saudi skill tier checker to verify your Saudi Arabia profession classification under the latest Qiwa occupation checker guidelines. Enter your SSCO job code or iqama profession to see if you fall into the High-Skilled, Skilled, or Basic categories as per Ministerial Resolution 4602.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <SaudiProfessionClassifierClient />
          </div>
        </div>

        {/* Ad 1 */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <AdUnit slot="8855092895" format="fluid" layout="in-article" />
        </div>

        {/* SEO Content Section - Matching Sample Structure */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section 1: Understanding Ministerial Resolution 4602 */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Saudi Profession Classification Analysis</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Ministerial Resolution 4602 and KSA Skill Tiers</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The landscape of employment in the Kingdom of Saudi Arabia has undergone a seismic shift with the introduction of the <strong>Saudi profession classification</strong> system. Driven by <strong>Ministerial Resolution 4602</strong>, the Ministry of Human Resources and Social Development (HRSD) has implemented a robust framework to categorize every <strong>worker in Saudi Arabia</strong> into specific <strong>ksa skill tier</strong> levels. This <strong>saudi skill tier checker</strong> is designed to help expats and employers navigate the <strong>qiwa occupation checker</strong> logic, ensuring that <strong>iqama profession meaning</strong> and <strong>ssco job code</strong> assignments align with Vision 2030 goals.
                </p>
                <p>
                  For a <strong>unique occupation worker in Saudi Arabia</strong>, understanding your <strong>saudi work permit skill level</strong> is no longer optional. Whether you are an <strong>Iqama profession computer science specialist</strong> or working in <strong>elementary occupations</strong>, your classification impacts your <strong>high skilled iqama renewal</strong>, <strong>family sponsorship saudi skill level</strong>, and even the speed of your visa processing. The <strong>saudi standard classification of occupations</strong> (SSCO) now divides the labor market into nine distinct groups, which are further compressed into three functional tiers: <strong>High-Skilled</strong> (Groups 1-3), <strong>Skilled</strong> (Groups 4-8), and <strong>Basic</strong> (Group 9).
                </p>
              </div>
            </div>

            {/* Section 2: High-Skilled vs Skilled vs Basic */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">SSCO Job Code & Skill Levels</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">High-Skilled, Skilled, and Basic Categories</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  When using a <strong>qiwa ssco checker</strong>, you will find that <strong>high skilled saudi</strong> roles typically include managers, professionals, and technicians. These <strong>high skilled work permit saudi</strong> categories enjoy <strong>nitaqat classification</strong> benefits, such as higher points for <strong>saudization skill tier</strong> compliance. On the other hand, the <strong>skilled vs basic saudi work permit</strong> debate often centers on <strong>ssco occupation code</strong> Groups 4 through 8, which cover clerical, service, and craft workers.
                </p>
                <p>
                  The <strong>unique occupation worker meaning</strong> under the <strong>saudi profession tier checker</strong> involves a <strong>points based system work permit</strong>. If your <strong>saudi iqama profession code</strong> falls into the <strong>high skill tier</strong>, you likely meet the <strong>high skilled criteria saudi</strong> involving specific educational degrees and <strong>professional accreditation saudi work permit</strong> requirements from bodies like the Saudi Council of Engineers (SCE) or Saudi Commission for Health Specialties (SCFHS).
                </p>
              </div>
            </div>

            {/* Section 3: Qiwa and Nitaqat Implications */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Qiwa Occupation & Nitaqat Impact</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Iqama Renewal and Visa Processing</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The <strong>qiwa profession classification</strong> is the heartbeat of the modern <strong>work permit classification saudi</strong> system. Employers must use the <strong>qiwa occupation management</strong> portal to ensure that <strong>ssic codes saudi</strong> and <strong>ssco list</strong> entries are accurate. A mismatch in your <strong>saudi occupation classification tool</strong> result and your actual <strong>iqama profession code list</strong> can lead to delays in <strong>saudi iqama renewal</strong> or rejection of <strong>Unique occupation Worker visa</strong> applications.
                </p>
                <p>
                  Furthermore, <strong>nitaqat points profession classification</strong> are weighted differently. A <strong>high skilled saudi visa</strong> holder provides more "value" to a company's Nitaqat color zone than a <strong>basic tier saudi</strong> worker. This makes the <strong>saudi profession classification</strong> a critical tool for HR managers planning their <strong>saudization</strong> quotas. Using an <strong>iqama profession code checker</strong> helps verify if a <strong>saudi technicians skilled tier</strong> role is correctly registered to avoid penalties.
                </p>
              </div>
            </div>

            {/* Section 4: Comprehensive Keyword Integration Block */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">KSA Labour Law & Work Permits</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Navigating the 2026 Labor Landscape</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  In 2026, the <strong>saudi work permit groups 1-9</strong> framework is fully integrated with <strong>vision 2030 jobs classification</strong>. Every <strong>saudi job classification tool</strong> must account for <strong>saudi arabia skill based work permit system</strong> updates. Whether you are looking for an <strong>ssco occupation code finder</strong> or a <strong>saudi iqama profession code list</strong>, the goal is clarity. <strong>High skilled iqama</strong> holders benefit from <strong>saudi visa high skilled benefits</strong>, including easier family residency and <strong>minimum salary high skilled saudi</strong> protections. 
                </p>
                <p>
                  Conversely, <strong>elementary occupations basic tier saudi</strong> (Group 9) face more <strong>saudi work permit implications</strong>, such as restricted <strong>family sponsorship saudi skill level</strong>. This is why the <strong>saudi standard classification of occupations</strong> is the foundation of every <strong>iqama skill level checker</strong>. Knowing your <strong>ssco saudi</strong> code is the first step in <strong>saudi occupation code list</strong> verification.
                </p>
              </div>
            </div>

            {/* Section 5: How to Use */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How to Use This Checker</h2>
              <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Search your job title.</strong> Type your profession as it appears on your <strong>job offer letter</strong> or <strong>iqama</strong> into the <strong>saudi profession classification</strong> search bar.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Verify the SSCO Code.</strong> Match the <strong>ssco job code</strong> to ensure it aligns with the <strong>saudi standard classification of occupations</strong>.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Check the Skill Tier.</strong> See if you are <strong>High-Skilled</strong>, <strong>Skilled</strong>, or <strong>Basic</strong> to understand your <strong>qiwa occupation checker</strong> status.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">4</span>
                  <p><strong className="text-gray-800 dark:text-gray-200">Review Implications.</strong> Understand how your <strong>ksa skill tier</strong> affects <strong>iqama renewal</strong> and <strong>nitaqat classification</strong>.</p>
                </li>
              </ol>
            </div>

            {/* Section 6: FAQ */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What is an SSCO code and why does it matter?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    SSCO stands for the <strong>Saudi Standard Classification of Occupations</strong> — the official system HRSD and Qiwa use to categorize every job title in the Kingdom. Your SSCO code determines your skill tier, which in turn affects your Nitaqat classification, visa category, and even family sponsorship eligibility.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How is my skill tier different from my job title?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Your job title is what's written on your offer letter or Iqama, but your skill tier (High-Skilled, Skilled, or Basic) is what the SSCO classification system assigns based on the closest matching occupation code — the two don't always align perfectly, which is why checking the mapping matters.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can my employer classify me differently from this tool's result?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes — this tool gives an independent estimate, but your official classification is set by your employer through the Qiwa platform and confirmed by HRSD. If the two don't match, that's worth raising with your employer's HR or PRO before it affects a visa or Nitaqat-related decision.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Does a Basic-tier classification limit family sponsorship?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Generally yes — elementary/Basic-tier occupations (Group 9) typically face more restricted family sponsorship terms than Skilled or High-Skilled tiers under current Saudi labor rules.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This <strong>saudi profession classification</strong> tool is an estimation based on <strong>SSCO</strong> and <strong>Ministerial Resolution 4602</strong> public data (2026). Final <strong>qiwa occupation checker</strong> results are determined by <strong>HRSD</strong> and the <strong>Qiwa</strong> platform.
              </p>
            </div>
          </div>
        </div>

        {/* Ad 2 */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <AdUnit slot="1633803336" format="auto" />
        </div>

        {/* Bottom Ad */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <AdUnit slot="3434236090" format="auto" />
        </div>
      </div>
    </>
  );
}
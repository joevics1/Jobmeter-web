// app/tools/noc-job-change-checker/page.tsx
import { Metadata } from 'next';
import NOCJobChangeCheckerClient from './NOCJobChangeCheckerClient';
import AdUnit from '../../../components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/noc-job-change-checker';

export const metadata: Metadata = {
  title: 'NOC / Job Change Eligibility Checker GCC 2026 | UAE, KSA, Qatar, Kuwait',
  description:
    'Check if you can change jobs without NOC in UAE, Saudi Arabia, Qatar, Kuwait, Bahrain & Oman. Instant results with steps and official links (Updated May 2026).',
  keywords: [
    'NOC GCC', 'change job UAE', 'Qiwa transfer', 'job change Qatar', 'visa transfer Kuwait', 'Kafala', 'expat job switch GCC', 'job transfer UAE without NOC', 'Iqama transfer Saudi', 'sponsorship change Qatar', 'UAE visa transfer 2026', 'change sponsor without NOC', 'GCC job mobility', 'MOHRE job change', 'transferable Iqama', 'sponsorship transfer', 'change sponsor UAE', 'Iqama transfer', 'job transfer Saudi', 'NOC job change', 'eligibility checker NOC', 'can I change job GCC', 'MOHRE job change', 'transfer sponsorship UAE', 'UAE labour law job mobility', 'switch employer Dubai no NOC', 'Qiwa job transfer', 'sponsorship transfer KSA', 'change job Saudi without NOC', 'Qiwa employee transfer', 'transferable Iqama jobs', 'Qatar MoL transfer', 'change sponsor Qatar', 'Kuwait work visa transfer', 'change job Kuwait NOC', 'Bahrain job change', 'Oman job transfer expat', 'no objection certificate job change', 'GCC labour mobility', 'change employer Gulf without NOC', 'job transfer rules GCC', 'can I switch jobs in UAE', 'waiting period job change GCC', 'resign and transfer visa GCC', 'new job offer transfer sponsorship', 'Qiwa platform transfer', 'MOHRE visa transfer', 'Kuwait PAM transfer', 'without employer approval job change', 'notice period job transfer UAE', 'early transfer fees Kuwait'
  ],
  openGraph: {
    title: 'NOC / Job Change Eligibility Checker - Gulf Job Meter',
    description: 'Know your rights before switching jobs in the Gulf countries. Check NOC requirements and Qiwa transfer eligibility instantly.',
    images: [{ url: '/og-noc-checker.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'NOC / Job Change Eligibility Checker',
    url: pageUrl,
    description: 'A professional GCC tool to check NOC requirements, Qiwa transfer eligibility, and job change rules in UAE, Saudi Arabia, Qatar, and Kuwait.',
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
      { '@type': 'ListItem', position: 3, name: 'NOC Checker', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NOC / Job Change Eligibility Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Calculates eligibility for job transfers and sponsorship changes across GCC countries including Qiwa and MOHRE systems.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I change jobs in UAE without NOC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under current UAE labour law, many employees can switch employer Dubai no NOC by completing their contract or during the notice period via MOHRE job change protocols.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Qiwa transfer work in Saudi Arabia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Qiwa platform transfer allows for sponsorship transfer KSA without employer approval under specific conditions like contract expiration or unpaid wages.',
        },
      },
    ],
  },
];

export default function NOCJobChangePage() {
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
              <span className="text-white font-medium">NOC / Job Change Eligibility Checker</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm mb-6">
              Updated May 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              NOC / Job Change<br />Eligibility Checker
            </h1>
            <p className="text-2xl max-w-4xl mx-auto text-blue-100">
              Instant <span className="font-semibold">NOC GCC</span> eligibility check. Know if you can <span className="font-semibold">switch jobs</span> without employer approval and get clear next steps.
            </p>
            <p className="mt-4 text-blue-100 text-lg">UAE • Saudi Arabia • Qatar • Kuwait • Bahrain • Oman</p>
          </div>
        </div>

        {/* Top Ad */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <AdUnit slot="1769800630" format="auto" />
        </div>

        {/* Condensed intro */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this <strong className="text-gray-800 dark:text-gray-200">NOC eligibility tool</strong> to verify if you can change job UAE, initiate a Qiwa transfer in Saudi Arabia, or handle a sponsorship change Qatar without a No Objection Certificate. Our GCC job switch calculator analyzes MOHRE and Qiwa rules for 2026.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <NOCJobChangeCheckerClient />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-4">
          <RelatedToolsStrip />
        </div>

        {/* In-article Ad 1 */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AdUnit slot="8855092895" format="fluid" layout="in-article" />
        </div>

{/* SEO Content Section */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Module 1: System Overview & GCC Mobility */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">NOC GCC & Regional Job Mobility Frameworks</h2>
              <div className="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <div>
                  <p className="mb-4">
                    The <strong>GCC labour mobility 2026</strong> landscape has transformed the way expatriates approach a <strong>job change without NOC</strong>. Historically, the <strong>Kafala system job change</strong> required explicit permission, but recent reforms have introduced a new era of <strong>GCC job mobility</strong>. Whether you are navigating a <strong>visa transfer UAE</strong> or a <strong>Qiwa transfer</strong> in Saudi Arabia, the <strong>eligibility checker NOC</strong> is now a critical tool for professional advancement.
                  </p>
                  <p>
                    For those asking <strong>can I change job GCC</strong> countries without facing a ban, the answer depends on your specific contract and the <strong>job transfer rules GCC</strong> authorities have established. A <strong>no objection certificate job change</strong> is no longer a universal barrier, yet understanding <strong>NOC required or not 2026</strong> status is essential before signing a <strong>new job offer transfer sponsorship</strong> agreement. 
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    The <strong>end of Kafala GCC</strong> reforms have empowered workers to <strong>change employer Gulf without NOC</strong> after fulfilling specific primary conditions. Our <strong>GCC job switch calculator</strong> and <strong>visa transfer checker UAE KSA</strong> provide instant clarity on whether you can <strong>resign and transfer visa GCC</strong> without legal repercussions.
                  </p>
                  <p>
                    When you <strong>apply through proper channel</strong> protocols, the <strong>sponsorship transfer</strong> process becomes a mechanical step rather than a negotiation. Using an <strong>NOC eligibility tool</strong> ensures that your <strong>expat job switch GCC</strong> follows the <strong>UAE labour law job mobility</strong> standards or the <strong>Qiwa updates 2026</strong> mandates.
                  </p>
                </div>
              </div>
            </div>

            {/* Module 2: UAE & Saudi Deep Dive (Technical Breakdown) */}
            <div className="px-10 py-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Technical Transfer Protocols: UAE vs Saudi Arabia</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> UAE & Dubai Standards
                  </h3>
                  <div className="text-[14px] text-gray-600 dark:text-gray-400 space-y-3">
                    <p>The <strong>MOHRE job change</strong> process is the primary pathway for a <strong>job change UAE</strong>. To <strong>switch employer Dubai no NOC</strong>, an employee must verify their <strong>UAE visa transfer 2026</strong> eligibility through the MOHRE smart app. If you are attempting a <strong>job transfer UAE without NOC</strong>, you must adhere to the <strong>notice period job transfer UAE</strong> as stated in your labor contract.</p>
                    <p>The <strong>MOHRE visa transfer</strong> system automatically checks for any <strong>labour ban lift UAE</strong> status. If you <strong>change job UAE without NOC</strong>, the <strong>visa transfer UAE 2026</strong> rules require the new employer to initiate the application. Many wonder, <strong>can I switch jobs in UAE</strong> during a probation period? The <strong>job change rules 2026 UAE</strong> suggest this is possible if <strong>notice period</strong> costs are covered.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> KSA Qiwa & Iqama Systems
                  </h3>
                  <div className="text-[14px] text-gray-600 dark:text-gray-400 space-y-3">
                    <p>In Saudi Arabia, the <strong>Qiwa job transfer</strong> has replaced traditional manual <strong>sponsorship transfer KSA</strong>. For an <strong>Iqama transfer</strong>, the new company sends a request via the <strong>Qiwa platform transfer</strong>. To successfully <strong>change job Saudi without NOC</strong>, the worker must have completed one year with the current sponsor, aligning with the <strong>Qiwa employee transfer</strong> 12-month rule.</p>
                    <p>Those holding <strong>transferable Iqama jobs</strong> find the <strong>job transfer Saudi</strong> process much faster. The <strong>Iqama transfer Saudi</strong> status can be monitored in real-time. If you are eligible for <strong>Iqama transfer 2026</strong>, the <strong>grace period after contract end Qiwa</strong> provides a window to finalize the <strong>sponsorship transfer</strong> without leaving the country.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3: Qatar, Kuwait & Northern GCC Regulations */}
            <div className="px-10 py-10 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Qatar & Kuwait: Ministry of Labour Protocols</h2>
              <div className="space-y-6 text-[15px] text-gray-600 dark:text-gray-400">
                <p>
                  The <strong>job change Qatar without NOC</strong> revolution was a major step in <strong>GCC labour mobility</strong>. Currently, a <strong>sponsorship change Qatar</strong> is processed through the <strong>Qatar MoL transfer</strong> electronic system. The <strong>Qatar job change one year rule</strong> remains a cornerstone, though <strong>change sponsor Qatar 2026</strong> updates allow for earlier moves under specific conditions of contract breach.
                </p>
                <p>
                  For those using the <strong>Qatar Ministry of Labour job change</strong> portal, the <strong>1 year contract job change Qatar</strong> requirement ensures stability for employers while maintaining <strong>expat rights job change Gulf</strong>. In Kuwait, the <strong>visa transfer Kuwait</strong> process is overseen by the <strong>Kuwait PAM transfer</strong> department. A <strong>Kuwait work visa transfer</strong> often requires navigating <strong>early transfer fees Kuwait</strong> if the <strong>waiting period job change GCC</strong> hasn't been met.
                </p>
                <p>
                  Additionally, <strong>change job Kuwait NOC</strong> rules are more stringent than in the UAE. The <strong>Kuwait temporary visa transfer window</strong> occasionally opens for specific sectors. Meanwhile, <strong>Bahrain job change</strong> and <strong>Oman job transfer expat</strong> rules have aligned more closely with the <strong>NOC GCC</strong> standards, focusing on professional qualifications and contract completion rather than sponsor whims.
                </p>
              </div>
            </div>

            {/* Module 4: Legal Context & Comparison (Detailed Reference) */}
            <div className="px-10 py-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Legal Reference: Section 13, Termination, and Expat Rights</h2>
              <div className="grid md:grid-cols-3 gap-6 text-[14px]">
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Contract Termination</h4>
                  <p className="mb-2">Understand the <strong>5 reasons for termination</strong> that can impact your <strong>eligibility checker NOC</strong> results. If a contract is terminated by the employer, the <strong>waiting period job change GCC</strong> is often waived.</p>
                  <p>Searching for <strong>What is Section 13 of the Labour law in Nigeria?</strong> Often, expats compare GCC laws with home country regulations to understand <strong>expat rights job change Gulf</strong> broadly.</p>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">The NOC Document</h4>
                  <p className="mb-2">If you need to know <strong>How to get No Objection Certificate from employer</strong>, it typically starts with a formal request via an <strong>outside employment form</strong>. </p>
                  <p>A <strong>NOC letter after resignation</strong> is a vital document if you are moving to a competitor. Always ask: <strong>Do we need a NOC code in an employment letter?</strong> for your next role's security.</p>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">System Validations</h4>
                  <p className="mb-2">The <strong>Gulf Job Meter checker</strong> validates your <strong>transferable Iqama jobs</strong> status. It checks for <strong>ex post facto NOC</strong> requirements that might arise during <strong>visa transfer UAE</strong>.</p>
                  <p>When you <strong>apply through proper channel</strong>, ensure you have <strong>how to show proof of employment for a visa</strong> ready, such as a verified <strong>employment letter</strong>.</p>
                </div>
              </div>
            </div>

            {/* Module 5: Step-by-Step Tool Logic (SEO Dense) */}
            <div className="px-10 py-10 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Use the NOC & Job Change Eligibility Tool</h2>
              <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400">
                <p>
                  Our <strong>NOC eligibility tool</strong> is designed to provide a <strong>GCC job change rules comparison</strong> in seconds. To get an accurate result from the <strong>GCC job switch calculator</strong>, you must provide your current country (e.g., <strong>change job UAE</strong> or <strong>job transfer Saudi</strong>), your profession, and your time served. 
                </p>
                <p>
                  The tool evaluates <strong>without employer approval job change</strong> scenarios by looking at your salary bracket and the <strong>UAE vs Saudi job mobility</strong> index. If the tool determines a <strong>no objection certificate job change</strong> is required, it will provide a list of <strong>What documents do you need for NOC</strong>.
                </p>
                <p>
                  For KSA users, it analyzes <strong>Qiwa platform transfer</strong> availability. For UAE users, it checks <strong>MOHRE job change</strong> constraints. It answers the critical question: <strong>Is NOC from employer compulsory for visa?</strong> based on your specific 2026 data.
                </p>
              </div>
            </div>

            {/* Module 6: Expanded FAQ (Keyword Cluster) */}
            <div className="px-10 py-10 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">NOC & Visa Transfer: Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">How to respectfully quit a job without notice?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">While it is difficult to <strong>respectfully quit a job without notice</strong>, you can mitigate damage by offering to train a replacement or paying the <strong>notice period job transfer UAE</strong> compensation. Check your <strong>sponsorship transfer</strong> eligibility first.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">What is NOC in job contexts?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400"><strong>What is NOC in job</strong> contexts? It stands for No Objection Certificate. It is a legal document clearing you for a <strong>sponsorship change Qatar</strong> or a <strong>visa transfer UAE</strong> without your current employer's interference.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Do I need a NOC letter after resignation?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">A <strong>NOC letter after resignation</strong> is highly recommended for <strong>sponsorship transfer KSA</strong> and <strong>Kuwait work visa transfer</strong> to ensure a smooth <strong>Iqama transfer</strong> without legal delays.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">What is the waiting period job change GCC?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">The <strong>waiting period job change GCC</strong> varies. In Saudi, <strong>Qiwa updates 2026</strong> suggest a 1-year service for <strong>change job Saudi without NOC</strong>. In UAE, it depends on the <strong>MOHRE visa transfer</strong> category.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Can I switch employer Dubai no NOC?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">Yes, to <strong>switch employer Dubai no NOC</strong> is possible for most skilled workers under <strong>UAE labour law job mobility</strong>. Use the <strong>visa transfer checker UAE KSA</strong> for your specific job code.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">How does the Qiwa employee transfer work?</h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">The <strong>Qiwa employee transfer</strong> is initiated by the new firm. Once you accept the offer on the <strong>Qiwa platform transfer</strong>, the <strong>Iqama transfer Saudi</strong> begins automatically.</p>
                </div>
              </div>
            </div>

            {/* Module 7: Data & Verification Standards */}
            <div className="px-10 py-10 bg-gray-50/50 dark:bg-gray-800/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Verifying Your Eligibility</h2>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-6">
                Before you <strong>resign and transfer visa GCC</strong>, ensure all your documents are in order. The <strong>NOC job change</strong> process requires a valid <strong>employment letter</strong> and a clear record. Whether you are dealing with a <strong>sponsorship transfer</strong> in Oman or a <strong>Bahrain job change</strong>, professional conduct is key.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="text-blue-600 font-bold text-lg mb-1">MOHRE</div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">UAE Standards</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="text-emerald-600 font-bold text-lg mb-1">QIWA</div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">KSA Protocols</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="text-purple-600 font-bold text-lg mb-1">MoL</div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">Qatar Systems</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="text-orange-600 font-bold text-lg mb-1">PAM</div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">Kuwait Transfers</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-100 dark:bg-gray-800/80 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed text-center italic">
                <strong>Data Accuracy Note:</strong> The <strong>NOC eligibility tool</strong> and <strong>GCC job switch calculator</strong> results are based on <strong>GCC labour mobility 2026</strong> guidelines. Laws regarding <strong>visa transfer UAE</strong>, <strong>Qiwa updates 2026</strong>, and <strong>sponsorship change Qatar</strong> are subject to change by national ministries. Always verify your <strong>Iqama transfer</strong> or <strong>MOHRE job change</strong> status with official government portals.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Ad */}
        <div className="py-8 border-t border-gray-200 dark:border-gray-800">
          <AdUnit slot="3434236090" format="auto" />
        </div>
      </div>
    </>
  );
}
import { Metadata } from 'next';
import EquivalencyCheckerClient from './EquivalencyCheckerClient';
import AdUnit from '../../../components/ads/AdUnit'; // Adjust path as needed
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://jobmeter.app/tools/education-equivalency-checker';

export const metadata: Metadata = {
  title: 'UAE & Saudi Education Credential Equivalency Checker | 2026 MOE Guide',
  description: 'Free interactive tool to check if your foreign degree, diploma or high school certificate (India, UK, US, Philippines) is recognized in UAE (MOE) or Saudi Arabia. Get a personalized checklist and 2026 rules.',
  keywords: [
    'UAE equivalency', 'Saudi certificate equivalency', 'MOE UAE equivalency certificate', 'MoHESR recognition', 
    'degree attestation UAE', 'foreign degree UAE', 'high school equivalency UAE', 'DataFlow verification',
    'equivalency certificate cost UAE', 'how to get equivalency certificate in UAE', 'UAE Ministry of Education equivalency',
    'Certificate of Recognition MOE UAE', 'equivalency certificate Dubai', 'high school equivalency UAE Grade 12',
    'university degree equivalency UAE', 'UAE equivalency for Golden Visa', 'certificate equivalency Saudi Arabia',
    'KSA MOE equivalency', 'Riyadh degree equivalency', 'Qatar university degree equivalency', 'Doha MOEHE equivalency',
    'Kuwait certificate equivalency', 'Bahrain certificate equivalency', 'Oman certificate equivalency',
    'GCC degree attestation equivalency', 'how to apply for MOE equivalency certificate', 'UAE equivalency process 2026',
    'required documents for equivalency UAE', 'MOE portal equivalency application', 'foreign qualification recognition GCC',
    'expat degree equivalency Gulf', 'teacher equivalency certificate UAE', 'equivalency for job employment GCC',
    'study in UAE equivalency certificate', 'bachelor master PhD equivalency UAE', 'Indian degree equivalency Dubai',
    'UK degree equivalency UAE', 'Philippine degree equivalency Dubai', 'equivalency certificate cost UAE KSA Qatar',
    'check if my degree is recognized in UAE', 'Gulf education equivalency tool', 'MOE eServices equivalency',
    'common rejections MOE equivalency', 'CBSE curriculum equivalency UAE', 'equivalency for nurses GCC'
  ],
  openGraph: {
    title: 'UAE/Saudi Credential Equivalency Checker - Free 2026 Tool',
    description: 'Check your foreign qualifications for UAE & KSA jobs, Golden Visa, licensing & studies.',
    images: [{ url: '/og-education-equivalency.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'UAE & Saudi Education Credential Equivalency Checker',
    url: pageUrl,
    description: 'Check if your foreign degree is recognized by the UAE MOE or Saudi Arabia MOE for employment and residency.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Gulf Job Meter',
      url: 'https://jobmeter.app',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Education Equivalency Checker', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gulf Education Equivalency Checker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description: 'An interactive tool to verify education credential recognition across the UAE, Saudi Arabia, and the GCC.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to get MOE UAE Equivalency Certificate',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Primary Source Verification',
        text: 'Verify your degree via DataFlow, Quadrabay, or VFS Global depending on the institution location.',
      },
      {
        '@type': 'HowToStep',
        name: 'MOE Portal Application',
        text: 'Log in to the MOE eServices portal using UAE Pass and upload the verification report.',
      },
      {
        '@type': 'HowToStep',
        name: 'Receive Recognition Report',
        text: 'Download your Certificate of Recognition or Equivalency after the MOE review.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does it cost for an equivalency certificate in the UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The MOE application fee is typically around 100 AED, but total costs including DataFlow verification and attestation can range from 800 AED to 1,500 AED depending on the degree origin.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does an equivalency certificate take in the UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once the DataFlow verification is complete (which takes 15-30 days), the MOE recognition report is usually issued within 2 to 5 working days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I work in the UAE without equivalency?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For private sector roles not requiring a professional license (like engineering or medicine), attestation is often sufficient. However, government jobs, Golden Visas, and specific licensed professions require a full equivalency certificate.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to track equivalency certificate status?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can track your application status directly through the MOE gov ae equivalency portal or the DataFlow tracking page using your case number.',
        },
      },
    ],
  },
];

export default function EducationEquivalencyPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Top Gradient Hero */}
        <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Breadcrumb - Added as requested */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-emerald-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Education Credential Checker</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              UAE & Saudi Education<br />Credential Checker
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Find out if your foreign degree, diploma or high school certificate is likely recognized in the UAE (MOE) or Saudi Arabia. 
              Personalized checklist + step-by-step guide for professionals from Africa & South Asia.
            </p>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl text-lg">
              ✅ Instant Self-Assessment • 📋 Dynamic Checklist • ⏱️ Latest 2026 Rules
            </div>
          </div>
        </div>

        {/* Ad Unit - Top Display */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          <AdUnit slot="4198231153" format="auto" />
        </div>

        {/* Intro Container - Added as requested */}
        <div className="max-w-5xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              Use this <strong>Gulf education equivalency checker</strong> to verify if your <strong>university degree equivalency UAE</strong> or <strong>Saudi Arabia certificate equivalency</strong> meets the latest <strong>2026 MOE</strong> standards. 
              Simply enter your qualification details to generate a custom <strong>required documents for equivalency UAE</strong> checklist.
            </p>
          </div>
        </div>

        {/* Tool Section - Above the fold */}
        <div id="checker-tool" className="max-w-5xl mx-auto px-6 -mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
            <EquivalencyCheckerClient />

            <RelatedToolsStrip />
          </div>
        </div>

        {/* In-article Ad */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          <AdUnit slot="4690286797" layout="in-article" />
        </div>

        {/* Improved SEO Content - 2000 Word Section */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section 1: The 2026 Landscape */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">UAE Ministry of Education Equivalency Guide 2026</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6">Navigating MOE UAE equivalency certificate requirements</p>
              <div className="prose prose-emerald max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                <p>
                  Obtaining an <strong>equivalency certificate UAE</strong> has become a cornerstone for expatriates looking to build a career or pursue higher education in the Middle East. Whether you are applying for a <strong>UAE equivalency for Golden Visa</strong> or seeking a teaching license, understanding the <strong>MOE UAE equivalency certificate</strong> process is vital. As of 2026, the <strong>UAE Ministry of Education equivalency</strong> system has shifted towards a more digital-first approach, prioritizing the <strong>Certificate of Recognition MOE UAE</strong> (formerly known as the Qualification Recognition Report).
                </p>
                <p>
                  For those asking <strong>how to get equivalency certificate in UAE</strong>, the process starts with primary source verification. Organizations like <strong>DataFlow + MOE equivalency</strong> partners work together to ensure that a <strong>foreign degree UAE</strong> is authentic and comes from an accredited institution. This <strong>foreign qualification recognition GCC</strong> framework ensures that <strong>bachelor master PhD equivalency UAE</strong> standards remain world-class, preventing academic fraud and ensuring that only qualified professionals enter the workforce.
                </p>
                <p>
                  If you are holding an <strong>Indian degree equivalency Dubai</strong> request or a <strong>UK degree equivalency UAE</strong> application, you must first ensure your <strong>degree attestation UAE</strong> is completed via the Ministry of Foreign Affairs (MOFA). Only after attestation can you proceed to the <strong>MOE portal equivalency application</strong>.
                </p>
              </div>
            </div>

            {/* Section 2: Detailed Process & Cost */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Apply for MOE Equivalency Certificate</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-3">Required Documents for Equivalency UAE</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Original Degree/Diploma (MOFA Attested)</li>
                    <li>Official Academic Transcripts (All Years)</li>
                    <li>Passport Copy & Valid Residency Visa</li>
                    <li><strong>DataFlow verification equivalency</strong> report</li>
                    <li>Legal translation (if not in English/Arabic)</li>
                    <li>UAE Pass for <strong>MOE gov ae equivalency</strong> login</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-3">Estimated Costs & Timelines</h3>
                  <p className="text-sm">
                    The <strong>equivalency certificate cost UAE KSA Qatar</strong> varies significantly. In the UAE, the MOE fee is nominal (approx. 100 AED), but the <strong>DataFlow verification</strong> can cost between 800 and 1,200 AED.
                  </p>
                  <p className="text-sm mt-3">
                    <strong>Timeline:</strong> DataFlow takes 20-30 days, while the final <strong>MOE certificate of equivalency</strong> typically arrives within 48-72 hours of the final review.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Saudi Arabia & GCC */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Saudi Arabia & GCC Certificate Equivalency</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Riyadh, KSA, and beyond</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Moving to the Kingdom? The <strong>certificate equivalency Saudi Arabia</strong> process is managed by the <strong>KSA MOE</strong>. Unlike the UAE, the Saudi process relies heavily on the Saudi Cultural Attaché (SCA) in your home country. For a <strong>Riyadh degree equivalency</strong>, you must prove regular attendance (no distance learning for many professions). 
                </p>
                <p>
                  Similarly, the <strong>Qatar university degree equivalency</strong> and <strong>Doha MOEHE equivalency</strong> protocols require a "Letter of Authenticity" from the university. Whether it is <strong>Kuwait certificate equivalency</strong>, <strong>Oman certificate equivalency</strong>, or <strong>Bahrain certificate equivalency</strong>, the <strong>GCC degree attestation equivalency</strong> standards are tightening to protect local job markets. 
                </p>
              </div>
            </div>

            {/* Section 4: Comparison Table */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">GCC Equivalency Comparison Table</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 font-bold border-b">Feature</th>
                      <th className="px-4 py-3 font-bold border-b">UAE (MOE)</th>
                      <th className="px-4 py-3 font-bold border-b">Saudi Arabia (MOE)</th>
                      <th className="px-4 py-3 font-bold border-b">Qatar (MOEHE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 font-medium">Main Tool</td>
                      <td className="px-4 py-3"><strong>MOE eServices equivalency</strong></td>
                      <td className="px-4 py-3">MOE Portal / SCA</td>
                      <td className="px-4 py-3">MOEHE E-Portal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Verification</td>
                      <td className="px-4 py-3">DataFlow / Quadrabay</td>
                      <td className="px-4 py-3">Cultural Attaché</td>
                      <td className="px-4 py-3">Embassy + MOFA</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Timeline</td>
                      <td className="px-4 py-3">15-45 Days</td>
                      <td className="px-4 py-3">30-90 Days</td>
                      <td className="px-4 py-3">20-60 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Specific Professions */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Equivalency: Teachers, Nurses & Engineers</h2>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-6">
                Certain sectors have higher scrutiny. A <strong>teacher equivalency certificate UAE</strong> is mandatory for all private and public school educators. If you hold an <strong>American British CBSE curriculum equivalency UAE</strong> qualification, the MOE will check your subject specialism. For healthcare, <strong>equivalency for nurses GCC</strong> often requires a DataFlow Primary Source Verification (PSV) report before a license (DHA, MOH, DOH) can even be applied for. 
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                <h3 className="text-emerald-800 dark:text-emerald-300 font-bold mb-2 italic">Pro-Tip for Expats:</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Always check for <strong>common rejections MOE equivalency</strong>. The #1 reason for rejection in 2026 is "non-traditional study mode" (online/distance) from universities not on the MOE approved list. Use our <strong>Gulf education equivalency tool</strong> to verify your institution first.
                </p>
              </div>
            </div>

            {/* Section 6: High School Grade 12 */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">High School Equivalency UAE Grade 12</h2>
              <p className="text-[15px] text-gray-600 dark:text-gray-400">
                For students wishing to <strong>study in UAE equivalency certificate</strong> is required for university admission. This applies to <strong>high school certificate equivalency abroad UAE</strong>. If you graduated from India (CBSE/ICSE), Pakistan (FBISE), or the Philippines, you must provide transcripts for Grade 10, 11, and 12. The <strong>Certificate of Recognition MOE UAE</strong> for high school ensures your curriculum meets the UAE national standard for science or arts tracks.
              </p>
            </div>

            {/* Section 7: FAQs */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Equivalency Certificate FAQ</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Can I work in the UAE without equivalency?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In many private sector companies, <strong>degree attestation UAE</strong> is sufficient for a visa. However, for <strong>equivalency for job employment GCC</strong> in government or regulated sectors, you must have the full MOE certificate.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">How to track equivalency status online?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Simply use the <strong>Moe equivalency login</strong> on the official website. You will need your application number or UAE Pass credentials to see real-time updates.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">What if my equivalency certificate UAE is rejected?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Equivalency certificate UAE rejected</strong> notices usually stem from accreditation issues. You can appeal via the MOE portal by providing additional "Regularity of Attendance" proof or a "To Whom It May Concern" letter from your home country's Higher Education Commission (HEC).</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This <strong>Gulf education equivalency checker</strong> is a guidance tool based on 2026 public data. <strong>Check if my degree is recognized in UAE</strong> is a preliminary step; official decisions are made solely by the Ministry of Education.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="max-w-5xl mx-auto px-6 py-10 border-t border-gray-200 dark:border-gray-800">
          <AdUnit slot="9751041788" format="auto" />
        </div>

        {/* Final CTA & Disclaimer */}
        <div className="bg-gray-900 text-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm opacity-75 mb-4">Last updated: May 2026 • This is a guidance tool only.</p>
            <p className="text-lg">Official decisions are made solely by MOE UAE, KSA MOE, and Qatar MOEHE. Always verify on government portals.</p>
            <div className="mt-8 flex justify-center gap-8 text-sm">
              <a href="https://www.moe.gov.ae" target="_blank" className="hover:underline">MOE UAE</a>
              <a href="https://www.moe.gov.sa" target="_blank" className="hover:underline">Saudi MOE</a>
              <a href="https://www.edu.gov.qa" target="_blank" className="hover:underline">Qatar MOEHE</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
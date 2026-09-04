// app/tools/ielts-checker/page.tsx
import { Metadata } from 'next';
import IELTSCheckerTool from './IELTSCheckerTool';
import AdUnit from '@/components/ads/AdUnit';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/ielts-checker';

export const metadata: Metadata = {
  title: 'GCC IELTS Requirement Checker 2026 | UAE, Saudi, Qatar & Gulf',
  description:
    'Instantly check exact IELTS, OET and English proficiency requirements for work visas, licensing and jobs in UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain. Healthcare, Engineering, IT, Teaching and more.',
  keywords: [
    // Core IELTS + GCC
    'IELTS GCC', 'IELTS UAE', 'IELTS Saudi Arabia', 'IELTS Qatar', 'IELTS Oman', 'IELTS Kuwait', 'IELTS Bahrain',
    'IELTS score for Gulf jobs', 'IELTS requirement Gulf 2026', 'IELTS band score GCC',
    'English requirement Gulf jobs', 'English proficiency Gulf', 'English test for Gulf visa',
    // Licensing bodies
    'DHA IELTS', 'DOH IELTS', 'SCFHS IELTS', 'QCHP IELTS', 'HAAD IELTS', 'MOE IELTS UAE',
    'DHA English requirement', 'SCFHS English requirement', 'QCHP English requirement',
    'DHA license nurse', 'DHA license doctor', 'SCFHS license', 'QCHP license',
    // Healthcare
    'nurse IELTS UAE', 'nurse IELTS Qatar', 'nurse IELTS Saudi Arabia', 'nursing license Gulf',
    'OET for nurses GCC', 'OET UAE', 'OET Saudi Arabia', 'OET Qatar', 'OET vs IELTS Gulf',
    'doctor license Gulf', 'doctor IELTS UAE', 'doctor IELTS Saudi', 'medical license GCC',
    'healthcare English requirement UAE', 'pharmacist IELTS Gulf', 'physiotherapist IELTS GCC',
    'dentist English requirement UAE', 'allied health license GCC',
    // Engineering & IT
    'engineer IELTS Saudi Arabia', 'engineer visa Saudi IELTS', 'IT jobs English requirement UAE',
    'software engineer English Gulf', 'tech jobs English requirement GCC',
    // Teaching
    'teacher IELTS UAE', 'teacher English requirement Gulf', 'MOE teacher license UAE',
    'teaching job Qatar English', 'IELTS for teaching jobs Saudi Arabia',
    // Work visa & general
    'work visa English test Gulf', 'English requirement Dubai', 'English requirement Abu Dhabi',
    'English requirement Riyadh', 'English requirement Doha',
    'IELTS for Gulf work permit', 'minimum IELTS score UAE job', 'IELTS waiver Gulf',
    'English speaking country exemption Gulf', 'IELTS exempt Gulf countries',
    // Long-tail
    'what IELTS score do I need to work in UAE', 'IELTS score for DHA exam',
    'do nurses need IELTS for Qatar', 'OET or IELTS for Dubai hospital',
    'IELTS requirement for Saudi nursing license', 'English test for QCHP registration',
    'IELTS band 6 jobs UAE', 'IELTS band 7 Gulf jobs',
  ],
  openGraph: {
    title: 'GCC IELTS Requirement Checker 2026 | Gulf Job Meter',
    description:
      'Accurate IELTS, OET and English proficiency requirements for licensing, work visas and employment across UAE, Saudi Arabia, Qatar and the wider Gulf.',
    images: [{ url: '/og-ielts-tool.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GCC IELTS Requirement Checker 2026',
    url: pageUrl,
    description:
      'Check exact IELTS, OET and English proficiency requirements for jobs, work visas and professional licensing across UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain.',
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
      { '@type': 'ListItem', position: 3, name: 'GCC IELTS Requirement Checker', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GCC IELTS Requirement Checker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
      'Instantly check IELTS, OET and English proficiency requirements for professional licensing and work visas across all GCC countries in 2026.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Gulf Job Meter', url: 'https://www.jobmeter.app' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the GCC IELTS Requirement Checker',
    description: 'Select your profession and target GCC country to instantly see the exact IELTS or OET score required for licensing or employment.',
    step: [
      { '@type': 'HowToStep', name: 'Select your profession', text: 'Choose your role — nurse, doctor, engineer, teacher, IT professional or other.' },
      { '@type': 'HowToStep', name: 'Choose your target country', text: 'Select UAE, Saudi Arabia, Qatar, Oman, Kuwait or Bahrain to see country-specific requirements.' },
      { '@type': 'HowToStep', name: 'Review your requirements', text: 'See the exact IELTS band score, OET grade, licensing body, and any exemption conditions that apply to your situation.' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What IELTS score do I need to work in the UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on your profession. Healthcare professionals registered with DHA or DOH typically need IELTS 6.0 to 7.0 or OET B/C+. Teachers applying for MOE UAE positions usually need IELTS 6.0 minimum. Engineers and IT professionals often face no formal requirement, though employers may ask for 5.5 to 6.5.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use OET instead of IELTS for Gulf healthcare jobs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. OET is accepted by DHA, DOH, SCFHS, and QCHP as an alternative to IELTS for healthcare professionals. OET Grade B is generally equivalent to IELTS 7.0. OET is often preferred by nurses and doctors as it uses medical scenarios.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need IELTS if I am from an English-speaking country?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In many cases, graduates from recognized English-speaking countries such as the UK, USA, Australia, Canada, Ireland, and New Zealand are exempt from IELTS requirements for licensing in the GCC. Always verify with the specific licensing body as exemption policies vary.',
        },
      },
      {
        '@type': 'Question',
        name: 'What IELTS score does SCFHS require for Saudi nursing license?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SCFHS (Saudi Commission for Health Specialties) generally requires IELTS 6.0 overall with no band below 5.5 for nursing registration in Saudi Arabia. OET Grade C+ is also accepted. Requirements may be updated, so always check the SCFHS portal directly.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the IELTS requirement for QCHP Qatar nursing license?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'QCHP (Qatar Council for Healthcare Practitioners) requires IELTS 6.0 overall or OET Grade C+ for nursing license registration in Qatar. Candidates from recognized English-speaking countries may be exempt.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do engineers need IELTS for Saudi Arabia work visa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There is no standard government-mandated IELTS requirement for engineering work visas in Saudi Arabia. However, many large employers, particularly those on Vision 2030 mega-projects, expect candidates to demonstrate English proficiency at interview and may request a score of 5.5 to 6.5 informally.',
        },
      },
    ],
  },
];

export default function IELTSCheckerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">

          {/* Breadcrumb inside hero */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span aria-hidden="true" className="opacity-60">›</span>
            <a href="/tools" className="hover:text-white transition-colors">Tools</a>
            <span aria-hidden="true" className="opacity-60">›</span>
            <span className="text-white font-medium">GCC IELTS Requirement Checker</span>
          </nav>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            GCC IELTS Requirement Checker
          </h1>
          <p className="text-2xl max-w-4xl mx-auto">
            Know exactly what English score you need for your dream Gulf job
          </p>
          <p className="mt-4 text-blue-100 text-lg">
            Updated May 2026 • DHA, SCFHS, QCHP, MOE & more
          </p>
        </div>
      </div>

      {/* Top Ad */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4198231153" format="auto" />
*/}
      </div>

      {/* Intro text box */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
          <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
            Select your profession and target GCC country to instantly see the exact IELTS band score or OET grade required for licensing, work visas and employment across UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain — updated May 2026.
          </p>
        </div>
      </div>

      {/* Tool - unchanged */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <IELTSCheckerTool />

        <RelatedToolsStrip />
      </div>

      {/* Middle Ad */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4690286797" layout="in-article" />
*/}
      </div>

      {/* SEO Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

          {/* Section 1 */}
          <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">IELTS and English Requirements in the GCC</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Why English proficiency matters for Gulf jobs and licensing in 2026</p>
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                English proficiency is one of the most misunderstood requirements for professionals planning to work in the Gulf. Many candidates focus entirely on qualifications, experience, and salary — and only discover the IELTS or OET requirement after they have already applied or accepted an offer. Whether you are a nurse targeting DHA registration in Dubai, a doctor applying for SCFHS licensing in Saudi Arabia, a teacher seeking MOE approval in the UAE, or an engineer joining a Vision 2030 mega-project, the English requirement for your role and country can be very different.
              </p>
              <p>
                IELTS GCC requirements are not uniform. The UAE, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain each have their own licensing bodies, their own accepted English tests, and their own band score thresholds. Some professions face strict mandatory requirements enforced by government licensing authorities. Others face informal employer expectations with no legal minimum. Understanding the difference before you apply can save months of preparation time and prevent costly visa or licensing delays.
              </p>
              <p>
                This tool consolidates IELTS UAE, IELTS Saudi Arabia, IELTS Qatar, and GCC-wide requirements across the most common expat professions, so you can check exactly what you need in one place rather than navigating multiple licensing portals in different languages.
              </p>
            </div>
          </div>

          {/* Section 2 - Healthcare */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Healthcare Professionals</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Nurses, doctors, pharmacists, allied health — the strictest English requirements in the Gulf</p>
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                Healthcare is the profession category with the most rigorous English proficiency requirements across the GCC. Every major licensing body — DHA (Dubai Health Authority), DOH (Department of Health Abu Dhabi), SCFHS (Saudi Commission for Health Specialties), and QCHP (Qatar Council for Healthcare Practitioners) — has its own specific thresholds, and these are enforced as mandatory conditions for registration, not merely employer preferences.
              </p>
              <p>
                For nurse IELTS UAE requirements, DHA typically requires an overall IELTS band of 6.0 with no individual band below 5.5, or OET Grade C+. DOH Abu Dhabi applies similar standards. Nurses who completed their entire education in a recognized English-medium institution in a country such as the UK, USA, Australia, Canada, Ireland, or New Zealand may be eligible for an IELTS waiver, but this must be confirmed directly with DHA or DOH before applying.
              </p>
              <p>
                SCFHS IELTS requirements for Saudi nursing license registration are similar: IELTS 6.0 overall is the standard benchmark, with OET Grade C+ accepted as an alternative. Doctor IELTS Saudi requirements follow the same structure, though specialist physicians may face higher thresholds depending on the specialty and employer. QCHP English requirements for Qatar follow closely — IELTS 6.0 overall or OET C+ is the baseline for most healthcare roles, with QCHP IELTS conditions confirmed at registration.
              </p>
              <p>
                OET for nurses GCC is increasingly the preferred choice over IELTS because OET uses clinical scenarios — consultations, letters, listening exercises drawn from real healthcare environments — that feel more directly relevant to daily nursing and medical practice. OET Grade B is broadly equivalent to IELTS 7.0, and Grade C+ maps to approximately IELTS 6.0-6.5. If you are already working in a clinical English-language environment, OET UAE and OET Saudi preparation may feel more natural than academic IELTS study.
              </p>
              <p>
                Pharmacists, physiotherapists, dentists, radiographers, and other allied health professionals face similar requirements through the same licensing bodies. Always check the specific allied health license GCC requirements for your profession code, as thresholds can differ slightly by specialty within the same licensing authority.
              </p>
            </div>

            {/* Healthcare requirements table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mt-6">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Licensing Body</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Country</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">IELTS Minimum</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">OET Accepted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">DHA</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">UAE (Dubai)</td>
                    <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400 font-medium">6.0 overall</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Yes — Grade C+</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">DOH / HAAD</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">UAE (Abu Dhabi)</td>
                    <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400 font-medium">6.0 overall</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Yes — Grade C+</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">SCFHS</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Saudi Arabia</td>
                    <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400 font-medium">6.0 overall</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Yes — Grade C+</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">QCHP</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Qatar</td>
                    <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400 font-medium">6.0 overall</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">Yes — Grade C+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 - Teaching */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Teachers and Education Professionals</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">MOE licensing, international schools and English-medium teaching roles</p>
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                Teacher IELTS UAE requirements are set by the Ministry of Education (MOE) for government school placements and by individual international schools for private sector roles. For MOE UAE licensing, teachers typically need IELTS 6.0 overall. International schools in Dubai and Abu Dhabi generally expect 6.5 to 7.0 for English-subject teachers, and 6.0 for other subjects. Teaching job Qatar English requirements through the Ministry of Education follow a similar structure.
              </p>
              <p>
                IELTS for teaching jobs Saudi Arabia is increasingly relevant as the Kingdom expands its international school sector under Vision 2030 and recruits English-medium teachers from the UK, USA, Australia, and South Africa. Saudi MOE and private school boards typically expect IELTS 6.0 to 6.5, though native English speakers from recognized countries are often exempt from formal testing.
              </p>
              <p>
                For teaching professionals, the English speaking country exemption Gulf is perhaps the most commonly applied exemption. UK, USA, Australian, Canadian, Irish, and New Zealand graduates teaching in their native language typically do not need to sit IELTS. Always confirm this directly with the licensing authority or school, as exemption verification processes differ by emirate and country.
              </p>
            </div>
          </div>

          {/* Section 4 - Engineering & IT */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Engineers, IT and Tech Professionals</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Formal requirements vs employer expectations</p>
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                Engineer IELTS Saudi Arabia and tech jobs English requirement GCC are different from healthcare in an important way: there is generally no government-mandated minimum IELTS score for engineering or IT work visa applications across the GCC. The engineer visa Saudi process does not require a specific band score as a visa condition. However, this does not mean English proficiency is irrelevant.
              </p>
              <p>
                Most multinational companies, government-linked entities, and Vision 2030 mega-project contractors working across Riyadh, NEOM, and the Red Sea Project expect candidates to demonstrate strong professional English at interview. Many formally request an IELTS score of 5.5 to 6.5 as part of the application. Software engineer English Gulf and IT jobs English requirement UAE are increasingly treated as implicit prerequisites, particularly for roles involving client communication, project management, or international team leadership.
              </p>
              <p>
                For mid-level engineers and developers applying directly to local SMEs or through recruitment agencies in Abu Dhabi, Dubai, or Doha, English proficiency is usually assessed informally through the interview process rather than via a formal test score. The IELTS band 6 jobs UAE market for engineering and tech is competitive, and a strong score can differentiate candidates even when it is not a hard requirement.
              </p>
            </div>
          </div>

          {/* Section 5 - OET vs IELTS */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">OET vs IELTS for Gulf Healthcare Jobs</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Which test should you choose?</p>
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                The OET vs IELTS Gulf decision is one of the most common questions among healthcare professionals preparing to move to the UAE, Saudi Arabia, or Qatar. Both tests are accepted by the major GCC licensing bodies, but they suit different candidates in different situations.
              </p>
              <p>
                IELTS is the more widely recognized test globally. It is accepted not just for healthcare licensing but also for work visas, immigration, and academic purposes. If you are planning to study further, apply for permanent residency in another country, or work across multiple industries, IELTS gives you more flexibility. IELTS Academic is required for most licensing applications — IELTS General Training is not accepted by DHA, SCFHS, or QCHP for professional registration.
              </p>
              <p>
                OET UAE and OET Saudi Arabia are gaining traction because the test content directly mirrors clinical environments. Reading passages are medical articles. Writing tasks involve discharge letters and referral notes. Listening tasks simulate patient consultations. Speaking involves roleplay with a simulated patient. For nurses and doctors who are already working in English-medium clinical settings, this familiarity can make OET preparation faster and the test experience less stressful than academic IELTS.
              </p>
              <p>
                OET Grade B is broadly equivalent to IELTS 7.0. Grade C+ maps to approximately IELTS 6.0 to 6.5. For most GCC healthcare licensing requirements which sit at the 6.0 to 6.5 IELTS threshold, OET Grade C+ is the equivalent target. If you are aiming for the UAE Golden Visa or a senior clinical leadership role that expects a higher band, target OET B or IELTS 7.0.
              </p>
            </div>
          </div>

          {/* Section 6 - Tips */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Key Tips for Meeting GCC English Requirements</h2>
            <ol className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>
                <p><strong className="text-gray-800 dark:text-gray-200">Always verify with the official licensing portal.</strong> IELTS GCC requirements change. DHA, SCFHS, and QCHP update their thresholds periodically. Check the current requirement on the official body's website before booking your test.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">2</span>
                <p><strong className="text-gray-800 dark:text-gray-200">Check your exemption eligibility first.</strong> Graduates from recognized English-speaking countries — UK, USA, Australia, Canada, Ireland, New Zealand, South Africa — are often exempt from IELTS for GCC licensing. This can save months of test preparation. Confirm the exemption with the specific body before assuming it applies.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">3</span>
                <p><strong className="text-gray-800 dark:text-gray-200">Choose the right test for your profession.</strong> Healthcare professionals should consider OET UAE as an alternative to IELTS. It uses clinical scenarios and may feel more relevant to your daily work. For non-healthcare roles, IELTS remains the standard choice.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">4</span>
                <p><strong className="text-gray-800 dark:text-gray-200">Book IELTS Academic, not General Training.</strong> IELTS for Gulf work visa licensing always requires the Academic version. IELTS General Training is not accepted by DHA, DOH, SCFHS, or QCHP for professional registration. Sitting the wrong test means starting again.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center justify-center">5</span>
                <p><strong className="text-gray-800 dark:text-gray-200">A strong score matters even when it is not required.</strong> English requirement Dubai and GCC-wide employer expectations are rising. Candidates with IELTS 7.0 or above consistently report stronger offer packages, higher starting salaries, and faster hiring processes than those at the minimum threshold — even when no formal score is required by the employer.</p>
              </li>
            </ol>
          </div>

          {/* Section 7 - FAQs */}
          <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What IELTS score do I need to work as a nurse in the UAE?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Nurse IELTS UAE requirements through DHA are typically IELTS 6.0 overall with no band below 5.5. DOH Abu Dhabi applies similar standards. OET Grade C+ is accepted as an alternative. Nurses from recognized English-speaking countries may be eligible for an exemption.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Is OET accepted for DHA registration in Dubai?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">Yes. OET UAE is accepted by DHA for healthcare professional registration. OET Grade C+ is the minimum accepted grade, equivalent to approximately IELTS 6.0 to 6.5. OET is also accepted by DOH, SCFHS, and QCHP across the GCC.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What IELTS score is needed for SCFHS Saudi nursing license?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">SCFHS IELTS requirement for nursing license in Saudi Arabia is generally IELTS 6.0 overall. OET Grade C+ is accepted. Candidates who completed nursing education entirely in English in a recognized country may qualify for exemption. Always confirm on the SCFHS portal as requirements are periodically updated.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Do engineers need IELTS for a Saudi Arabia work visa?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">No formal IELTS requirement exists for engineer visa Saudi Arabia work permit applications. However, major employers on Vision 2030 projects and multinationals often expect IELTS 5.5 to 6.5 informally. Demonstrating English proficiency through the interview process is typically sufficient for most engineering roles.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Which IELTS version is required — Academic or General Training?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">All GCC professional licensing bodies require IELTS Academic. IELTS General Training is not accepted by DHA, DOH, SCFHS, or QCHP for healthcare or teaching license applications. Always book IELTS Academic when applying for GCC professional registration.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How long is an IELTS score valid for GCC licensing?</h3>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">IELTS scores are generally valid for two years from the test date. Most GCC licensing bodies including DHA, SCFHS, and QCHP require a score within the two-year validity window at the time of application. Plan your test date to ensure the score is still valid when you submit your license application.</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
            <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
              <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This tool aggregates publicly available information from licensing authorities as of May 2026. Requirements can change. Always cross-check with official sources — DHA, DOH, SCFHS, QCHP, MOE — before applying.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Ad */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="9751041788" format="auto" />
*/}
      </div>
    </div>
  );
}
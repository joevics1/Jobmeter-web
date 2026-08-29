// app/tools/nitaqat-checker/page.tsx
import { Metadata } from 'next';
import NitaqatChecker from './NitaqatChecker';
import AdUnit from '@/components/ads/AdUnit';
import Script from 'next/script';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

const pageUrl = 'https://www.jobmeter.app/tools/nitaqat-checker';

// Step 1: 100 Best Keywords (No years included)
export const metadata: Metadata = {
  title: 'Nitaqat Tier Checker Saudi Arabia: Saudization Status & Company Color',
  description:
    'Check your employer Nitaqat tier in Saudi Arabia. Analyze Saudization compliance, platinum green red status, Iqama renewal risks, and visa transfer eligibility.',
  keywords: [
    'nitaqat tier checker', 'nitaqat checker', 'saudization status', 'nitaqat red tier', 'nitaqat platinum', 
    'qiwa nitaqat', 'check nitaqat tier', 'saudi company nitaqat color', 'iqama renewal risk', 
    'saudization compliance', 'employer rating saudi arabia', 'nitaqat calculator', 'how to check nitaqat', 
    'nitaqat green tier', 'visa transfer nitaqat', 'saudization nitaqat', 'company color status ksa', 
    'nitaqat status expat', 'nitaqat tier saudi arabia', 'nitaqat status checker', 'saudization checker', 
    'check company nitaqat color', 'nitaqat red zone risks', 'nitaqat platinum benefits', 'nitaqat mutawar', 
    'iqama color status red green', 'saudi job offer nitaqat check', 'nitaqat meaning in arabic', 
    'saudization law', 'mol.gov.sa nitaqat inquiry', 'check iqama color status', 'nitaqat level calculator',
    'mhrsd nitaqat check', 'ministry of labor nitaqat', 'saudi work permit status', 'labor law saudi arabia nitaqat',
    'iqama color red', 'iqama color green', 'iqama color platinum', 'transfer of sponsorship nitaqat',
    'check nitaqat color online', 'nitaqat results', 'verify saudization percentage', 'saudi portal nitaqat',
    'absher nitaqat check', 'gosi nitaqat integration', 'company status check ksa', 'saudi business compliance',
    'expat employment ksa', 'saudization laws for companies', 'small business nitaqat', 'large business nitaqat',
    'medium enterprise nitaqat', 'construction sector nitaqat', 'retail sector nitaqat', 'it sector nitaqat',
    'hospital nitaqat tier', 'school nitaqat tier', 'private sector saudization', 'government sector saudization',
    'check my company color', 'is my company red or green', 'nitaqat points system', 'nitaqat balance',
    'nitaqat simulator', 'saudization certificate download', 'mhrsd portal login', 'qiwa individual portal',
    'qiwa business portal', 'iqama transfer red status', 'check nitaqat level', 'saudization quotas ksa',
    'labor reform initiative nitaqat', 'saudi vision 2030 saudization', 'nitaqat eligibility criteria',
    'human resources sd nitaqat', 'saudi localization program', 'nitaqat yellow tier', 'saudi job market analysis',
    'company tier check', 'work permit renewal saudi', 'employer compliance rating', 'nitaqat online inquiry',
    'saudization rates by sector', 'nitaqat for expats', 'saudi labor office nitaqat', 'check nitaqat company status',
    'nitaqat system guide', 'saudization rules', 'iqama renewal nitaqat red', 'visa transfer status ksa',
    'nitaqat color meaning', 'saudization levels', 'nitaqat high green', 'nitaqat mid green', 'nitaqat low green'
  ],
  openGraph: {
    title: 'Nitaqat Tier Checker & Saudization Status',
    description:
      'Evaluate Saudi company compliance with the Nitaqat tier checker. Understand risks for Iqama renewal and visa transfers based on company color.',
    images: [{ url: '/og-nitaqat.jpg' }],
  },
  alternates: { canonical: pageUrl }
};

// Step 2: Implement Schemas
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Nitaqat Tier Checker Saudi Arabia',
    url: pageUrl,
    description: 'Verify Saudi company Nitaqat color status, Saudization percentage, and employer compliance ratings.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tools',
      url: 'https://www.jobmeter.app',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jobmeter.app' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.jobmeter.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Nitaqat Tier Checker', item: pageUrl },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nitaqat Tier Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'A tool to check the Saudization status and Nitaqat color of companies in KSA.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the levels of nitaqat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nitaqat levels are Platinum, High Green, Mid Green, Low Green, and Red. Platinum is the highest compliance level.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to check company status red or green nitaqat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can use this Nitaqat tier checker tool or visit the official MHRSD/Qiwa portals and enter the company name or registration number.',
        },
      },
    ],
  },
];

export default function NitaqatCheckerPage() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Original Hero Section (Color & Design Unchanged) */}
        <div className="bg-gradient-to-br from-blue-700 via-emerald-600 to-teal-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            {/* Added Breadcrumbs at the top as requested */}
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-100 flex flex-wrap justify-center items-center gap-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <a href="/tools" className="hover:text-white transition-colors">Tools</a>
              <span aria-hidden="true" className="opacity-60">›</span>
              <span className="text-white font-medium">Nitaqat Tier Checker</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nitaqat Tier Checker
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Check Saudization Status, Employer Rating & Iqama Renewal Risks
            </p>
          </div>
        </div>

        {/* Ad Unit */}
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <AdUnit slot="4690286797" />
        </div>

        {/* Container with text before the tool (Under the ad) */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-8 py-5 shadow-sm">
            <p className="text-[15px] text-center leading-snug text-gray-600 dark:text-gray-400">
              This <span className="font-semibold text-emerald-600">nitaqat tier checker</span> provides an immediate look into any Saudi company&apos;s Saudization status. Enter the business name below to identify if the employer is in the Platinum, Green, or Red tier and understand the impact on your iqama renewal risk or visa transfer eligibility.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <NitaqatChecker />

          <RelatedToolsStrip />
        </div>

        {/* SEO Content (2000 Words - Following Sample Structure) */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* Section 1 */}
            <div className="px-10 pt-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Understanding Nitaqat & Saudization</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Professional Guide to Employer Compliance</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The Nitaqat program is the primary mechanism for the Saudi Arabia localization program, designed by the Ministry of Human Resources and Social Development (MHRSD). Every expatriate or local professional looking at a saudi job offer nitaqat check must understand that a company&apos;s rating determines its legal capacity to operate. The system categories firms based on their saudization percentage—the ratio of Saudi nationals to foreign workers.
                </p>
                <p>
                  Using a nitaqat status checker is essential for anyone living in the Kingdom. The nitaqat meaning in arabic refers to &quot;Zones,&quot; and these zones dictate everything from your ability to travel to whether you can renew your identity documents. Whether you are using the official mol.gov.sa nitaqat inquiry portal or this independent tool, knowing the saudization status of your employer protects your professional rights and legal standing.
                </p>
                <p>
                  In the current market, saudi company compliance is monitored through the Qiwa portal. The nitaqat checker allows you to see if a company is meeting its obligations under the latest labor law saudi arabia nitaqat updates. Companies that maintain a high saudization compliance level enjoy benefits like fast-track visa issuance, while those in the red zone face severe operational restrictions that directly affect their expat staff.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Company Color Status KSA Explained</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Platinum, Green, and Red Tiers</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The employer rating saudi arabia is visualized through colors. The <span className="font-bold text-blue-600">Nitaqat Platinum tier</span> represents the top percentile of companies. These firms have an exceptional saudization nitaqat record and can hire expats with minimal restrictions. If you are checking a nitaqat tier saudi arabia result and see Platinum, the company is highly stable.
                </p>
                <p>
                  The <span className="font-bold text-emerald-600">Green Tier</span> is the standard for compliant businesses. It is divided into nitaqat high green, mid green, and low green. While High and Mid Green status indicate a healthy company, a nitaqat low green status signals that the company is on the verge of falling into the restricted zone. HR managers often use a nitaqat level calculator or a saudization calculator to ensure they stay within these safe ranges.
                </p>
                <p>
                  The <span className="font-bold text-red-600">Nitaqat Red Tier</span> is a high-risk zone. A company falls into this tier when it fails to meet the minimum requirements of the saudization program. The nitaqat red zone risks are significant: the company cannot renew work permits, cannot issue new visas, and cannot change professions for their employees. Under the Labor Reform Initiative, employees in red companies can initiate a visa transfer nitaqat without the current employer&apos;s consent.
                </p>
              </div>

              {/* Data Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Tier / Color</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Iqama Renewal</th>
                      <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Visa Transfer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr>
                      <td className="px-5 py-3 font-medium text-blue-600">Platinum</td>
                      <td className="px-5 py-3">Fully Supported</td>
                      <td className="px-5 py-3">Allowed</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium text-emerald-600">Green (High/Mid)</td>
                      <td className="px-5 py-3">Supported</td>
                      <td className="px-5 py-3">Allowed</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium text-amber-600">Low Green</td>
                      <td className="px-5 py-3">Supported (Restricted)</td>
                      <td className="px-5 py-3">Limited</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium text-red-600">Red</td>
                      <td className="px-5 py-3 text-red-500">Blocked</td>
                      <td className="px-5 py-3">Open (Expat Rights)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: In-depth Analysis */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Risks & Expats Rights in Saudi Arabia</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Iqama Color Status Red Green & Mobility</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  For an expatriate, the iqama renewal risk is the most pressing concern. If your employer’s nitaqat status is red, the Ministry of Interior systems will physically block the renewal of your ID card. This can lead to your bank account being frozen, your driver&apos;s license becoming invalid, and potential legal penalties. Therefore, performing a check iqama color status check via the nitaqat tier checker online is a monthly necessity for many.
                </p>
                <p>
                  The nitaqat impact on iqama renewal is direct. When a company fails its saudization compliance, its access to the mhrsd portal login and qiwa business portal is restricted. This prevents them from paying the required fees for your work permit. Without a work permit, there is no iqama. If you find yourself in this situation, the risks working for red nitaqat company are too high to ignore.
                </p>
                <p>
                  Fortunately, the expat rights nitaqat tier laws are designed to protect you. If a company stays in the Red zone for a certain period, you are legally entitled to find a new employer. The new employer, provided they are in the Green or Platinum tier, can process your transfer of sponsorship nitaqat without needing a release letter from your current red-tier boss. This is a core part of the saudi arabia localization program and the labor reform initiative.
                </p>
              </div>
            </div>

            {/* Section 4: Sector Quotas */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Nitaqat Mutawar & Sector Specifics</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-5">Saudization Quotas KSA</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  The nitaqat program was recently updated to nitaqat mutawar. This new system moved away from flat percentages and introduced dynamic calculations based on the industry sector. For example, the saudization rates by sector for the construction sector nitaqat are different from the retail sector nitaqat or the it sector nitaqat. A large business nitaqat requirement will also differ significantly from a small business nitaqat mandate.
                </p>
                <p>
                  When you use a nitaqat calculator or a nitaqat simulator, you must account for these variables. The saudi vision 2030 saudization goals aim to reduce unemployment among locals, which means quotas in sectors like engineering, accounting, and marketing are constantly increasing. Using a saudization status checker helps you understand if your specific job role is at risk of being restricted to locals only in the near future.
                </p>
                <p>
                  Many professionals also look for a nitaqat certificate or a saudization certificate download to verify a firm&apos;s standing. While these documents are usually handled by HR, the public check nitaqat color online tools provide enough data for a preliminary assessment. Whether you are in a hospital nitaqat tier or a school nitaqat tier, the underlying nitaqat eligibility criteria remain the same: hire locals or face restrictions.
                </p>
              </div>
            </div>

            {/* Section 5: FAQ Block */}
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">What are the levels of nitaqat?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">The levels are Platinum (highest), High Green, Mid Green, Low Green, and Red (lowest). The nitaqat yellow tier has been largely phased out and integrated into the Red category for stricter compliance enforcement.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How do I check my company nitaqat status?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">You can use this tool by entering your company name, or log into the Qiwa individual portal/MHRSD portal to see the official color status associated with your current contract.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Can I travel if my company is in the Red tier?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">As long as your Iqama is valid and you have an Exit Re-entry visa, you can travel. However, a red-tier company cannot issue new exit re-entry visas, so you must act before your current visa or iqama expires.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">How long does it take for a color to change?</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">The status is updated weekly based on GOSI contributions and employee counts. If a company hires new Saudi staff, their saudization percentage increases, potentially moving them from Red to Green in a matter of weeks.</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-10 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">
                <strong className="text-gray-500 dark:text-gray-400">Disclaimer:</strong> This Nitaqat tier checker is for educational and assessment purposes only. While we aim for accuracy in saudization compliance data, official status can only be confirmed through the MHRSD or Qiwa portals. Always check your iqama renewal risk with legal counsel or official Saudi authorities.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
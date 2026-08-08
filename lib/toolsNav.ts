// lib/toolsNav.ts
// Single source of truth for tool page metadata used in cross-linking
// (footer, tools cluster layout, resource hub, CV template pages, etc).
// Keep in sync with app/tools/page.tsx if a tool is added, renamed, or removed.

export interface ToolNavItem {
  id: string;
  title: string;
  route: string;
  group: string;
  groupTitle: string;
}

export const TOOLS_NAV: ToolNavItem[] = [
  { id: 'ats-review', title: 'ATS CV Review', route: '/tools/ats-review', group: 'cv-tools', groupTitle: 'CV Tools' },
  { id: 'interview', title: 'Interview Practice', route: '/tools/interview', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'career', title: 'Career Coach', route: '/tools/career', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'role-finder', title: 'Role Finder', route: '/tools/role-finder', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'quiz', title: 'Recruitment Assessment Practice Tests', route: '/tools/quiz', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'paye-calculator', title: 'PAYE Calculator', route: '/tools/paye-calculator', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'remote-jobs-finder', title: 'Remote Jobs', route: '/tools/remote-jobs-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'entry-level-finder', title: 'Entry Level Jobs', route: '/tools/entry-level-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'graduate-trainee-finder', title: 'Graduate & Trainee Jobs', route: '/tools/graduate-trainee-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'internship-finder', title: 'Internship Finder', route: '/tools/internship-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'nysc-finder', title: 'NYSC Jobs', route: '/tools/nysc-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'accommodation-finder', title: 'Jobs with Accommodation', route: '/tools/accommodation-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'visa-finder', title: 'Jobs with Visa Sponsorship', route: '/tools/visa-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'scam-checker', title: 'Job Scam Checker', route: '/tools/scam-checker', group: 'safety-tools', groupTitle: 'Safety Tools' },
  { id: 'job-offer-evaluator', title: 'Job Offer Evaluator', route: '/tools/job-offer-evaluator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'profession-country-match', title: 'Profession Country Match', route: '/tools/profession-country-match', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'certification-roadmap', title: 'Certification Roadmap', route: '/tools/certification-roadmap', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'education-equivalency-checker', title: 'Education Equivalency Checker', route: '/tools/education-equivalency-checker', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'ielts-checker', title: 'IELTS Checker', route: '/tools/ielts-checker', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'saudi-profession-classifier', title: 'Saudi Profession Classifier', route: '/tools/saudi-profession-classifier', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'noc-job-change-checker', title: 'NOC & Job Change Checker', route: '/tools/noc-job-change-checker', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'gcc-comparison', title: 'GCC Country Comparison', route: '/tools/gcc-comparison', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'nitaqat-checker', title: 'Nitaqat Checker', route: '/tools/nitaqat-checker', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'saudi-visa-calculator', title: 'Saudi Visa Calculator', route: '/tools/saudi-visa-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'uae-job-seeker-visa', title: 'UAE Job Seeker Visa', route: '/tools/uae-job-seeker-visa', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'salary-benchmark', title: 'Salary Benchmark', route: '/tools/salary-benchmark', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'take-home-pay-calculator', title: 'Gulf Take-Home Pay Calculator', route: '/tools/take-home-pay-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'saudi-dependent-levy', title: 'Saudi Dependent Levy Calculator', route: '/tools/saudi-dependent-levy', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'saudi-eosb-calculator', title: 'Saudi EOSB Calculator', route: '/tools/saudi-eosb-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'uae-gratuity-calculator', title: 'UAE Gratuity Calculator', route: '/tools/uae-gratuity-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'iqama-cost-calculator', title: 'Iqama Cost Calculator', route: '/tools/iqama-cost-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'relocation-budget-planner', title: 'Relocation Budget Planner', route: '/tools/relocation-budget-planner', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'cost-of-living', title: 'Cost of Living Comparison', route: '/tools/cost-of-living', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'remittance-estimator', title: 'Remittance Estimator', route: '/tools/remittance-estimator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'kuwait-dependent-fee-calculator', title: 'Kuwait Dependent Fee Calculator', route: '/tools/kuwait-dependent-fee-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'oman-eosb-calculator', title: 'Oman EOSB Calculator', route: '/tools/oman-eosb-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'kuwait-indemnity-calculator', title: 'Kuwait Indemnity Calculator', route: '/tools/kuwait-indemnity-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'bahrain-gratuity-calculator', title: 'Bahrain Gratuity Calculator', route: '/tools/bahrain-gratuity-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'qatar-gratuity-calculator', title: 'Qatar Gratuity Calculator', route: '/tools/qatar-gratuity-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'qatar-qatarization-calculator', title: 'Qatarization Calculator', route: '/tools/qatar-qatarization-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'oman-omanisation-calculator', title: 'Omanisation Calculator', route: '/tools/oman-omanisation-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'kuwait-kuwaitization-calculator', title: 'Kuwaitization Calculator', route: '/tools/kuwait-kuwaitization-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'bahrain-bahrainisation-calculator', title: 'Bahrainisation Calculator', route: '/tools/bahrain-bahrainisation-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'qatar-qid-cost-calculator', title: 'Qatar QID Cost Calculator', route: '/tools/qatar-qid-cost-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'kuwait-civil-id-cost-calculator', title: 'Kuwait Civil ID Cost Calculator', route: '/tools/kuwait-civil-id-cost-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'bahrain-cpr-cost-calculator', title: 'Bahrain CPR Cost Calculator', route: '/tools/bahrain-cpr-cost-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'oman-resident-card-cost-calculator', title: 'Oman Resident Card Cost Calculator', route: '/tools/oman-resident-card-cost-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'documents', title: 'Free Document Templates', route: '/documents', group: 'document-templates', groupTitle: 'Document Templates' },
  { id: 'document-generator', title: 'AI Document Generator', route: '/tools/document-generator', group: 'document-templates', groupTitle: 'Document Templates' },
];

export const TOOL_GROUPS: { id: string; title: string }[] = [
  { id: 'cv-tools', title: 'CV Tools' },
  { id: 'career-tools', title: 'Career Tools' },
  { id: 'job-finders', title: 'Job Finders' },
  { id: 'safety-tools', title: 'Safety Tools' },
  { id: 'gulf-tools', title: 'Gulf Tools' },
  { id: 'document-templates', title: 'Document Templates' },
];

export function getToolsByGroup(groupId: string): ToolNavItem[] {
  return TOOLS_NAV.filter((t) => t.group === groupId);
}

// A short, curated set for compact widgets (footer, sidebars).
export const FEATURED_TOOLS: ToolNavItem[] = [
  { id: 'ats-review', title: 'ATS CV Review', route: '/tools/ats-review', group: 'cv-tools', groupTitle: 'CV Tools' },
  { id: 'interview', title: 'Interview Practice', route: '/tools/interview', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'role-finder', title: 'Role Finder', route: '/tools/role-finder', group: 'career-tools', groupTitle: 'Career Tools' },
  { id: 'remote-jobs-finder', title: 'Remote Jobs', route: '/tools/remote-jobs-finder', group: 'job-finders', groupTitle: 'Job Finders' },
  { id: 'scam-checker', title: 'Job Scam Checker', route: '/tools/scam-checker', group: 'safety-tools', groupTitle: 'Safety Tools' },
  { id: 'job-offer-evaluator', title: 'Job Offer Evaluator', route: '/tools/job-offer-evaluator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'salary-benchmark', title: 'Salary Benchmark', route: '/tools/salary-benchmark', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'take-home-pay-calculator', title: 'Gulf Take-Home Pay Calculator', route: '/tools/take-home-pay-calculator', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'cost-of-living', title: 'Cost of Living Comparison', route: '/tools/cost-of-living', group: 'gulf-tools', groupTitle: 'Gulf Tools' },
  { id: 'document-generator', title: 'AI Document Generator', route: '/tools/document-generator', group: 'document-templates', groupTitle: 'Document Templates' },
];

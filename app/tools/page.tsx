import React from 'react';
import Link from 'next/link';
import {
  FileText, FileCheck, Search, Shield, Calculator, MessageCircle, GraduationCap, ArrowRight, Briefcase, Brain,
  Globe, MapPin, DollarSign, Plane, Home, BookOpen, Award, BarChart2, Users, RefreshCw, CreditCard, Landmark,
  Star, TrendingUp, ClipboardList, CheckSquare, Navigation, Flag, Wallet
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { Metadata } from 'next';
import AdUnit from '@/components/ads/AdUnit';

export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

export const metadata: Metadata = {
  title: 'Career Tools — Free AI-Powered Job Search Tools | JobMeter',
  description: 'Free AI-powered career tools: CV checker, keyword analyzer, ATS review, interview practice, career coach, salary calculator, scam detector and more.',
  keywords: ['career tools', 'job tools', 'CV checker', 'ATS review', 'interview practice', 'salary calculator', 'scam detector', 'career coach'],
  openGraph: {
    title: 'Career Tools — Free AI-Powered Job Search Tools | JobMeter',
    description: 'Free AI-powered career tools: CV checker, keyword analyzer, ATS review, interview practice, career coach, salary calculator, scam detector and more.',
    type: 'website',
    url: `${siteUrl}/tools`,
    siteName: 'JobMeter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Tools — Free AI-Powered Job Search Tools | JobMeter',
    description: 'Free AI-powered career tools: CV checker, keyword analyzer, ATS review, interview practice, career coach, salary calculator, scam detector and more.',
  },
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
};

interface Tool {
  id: string; title: string; description: string; icon: React.ComponentType<any>; color: string; route?: string; gulf?: boolean;
}

interface ToolCategory {
  id: string; title: string; description: string; icon: React.ComponentType<any>; color: string; tools: Tool[];
}

export default function ToolsPage() {
  const categories: ToolCategory[] = [
    {
      id: 'cv-tools', title: 'CV Tools', description: 'Build and optimize your CV', icon: FileText, color: '#2563EB',
      tools: [
//        { id: 'cv-create', title: 'Create CV/Cover Letter', description: 'Build professional CVs and cover letters in minutes', icon: FileText, color: '#2563EB', route: '/cv' },
//        { id: 'keyword-checker', title: 'CV Keyword Checker', description: 'Check keyword match between your CV and job descriptions', icon: Search, color: '#10B981', route: '/tools/keyword-checker' },
        { id: 'ats-review', title: 'ATS CV Review', description: 'Optimize your CV for ATS systems and job matching', icon: FileCheck, color: '#8B5CF6', route: '/tools/ats-review' },
      ],
    },
    {
      id: 'career-tools', title: 'Career Tools', description: 'Tools to help advance your career', icon: Briefcase, color: '#F59E0B',
      tools: [
        { id: 'interview', title: 'Interview Practice', description: 'Practice with personalized questions based on job descriptions', icon: MessageCircle, color: '#8B5CF6', route: '/tools/interview' },
        { id: 'career', title: 'Career Coach', description: 'Get personalized career guidance and advice', icon: GraduationCap, color: '#F59E0B', route: '/tools/career' },
        { id: 'role-finder', title: 'Role Finder', description: 'Discover new career paths based on your skills', icon: Search, color: '#06B6D4', route: '/tools/role-finder' },
        { id: 'quiz', title: 'Recruitment Assessment Practice Tests', description: 'Practice aptitude tests from top companies', icon: Brain, color: '#EC4899', route: '/tools/quiz' },
      ],
    },
    {
      id: 'safety-tools', title: 'Safety Tools', description: 'Stay safe from job scams', icon: Shield, color: '#EF4444',
      tools: [
//        { id: 'scam-detector', title: 'Job Description Analyzer', description: 'AI-powered analysis to detect job scams in any text', icon: Shield, color: '#EF4444', route: '/tools/scam-detector' },
        { id: 'scam-checker', title: 'Job Scam Checker', description: 'Search and report fraudulent companies and recruiters', icon: Shield, color: '#DC2626', route: '/tools/scam-checker' },
      ],
    },
    {
      id: 'salary-tools', title: 'Salary Tools', description: 'Calculate and compare salaries', icon: Calculator, color: '#3B82F6',
      tools: [
        { id: 'paye-calculator', title: 'PAYE Calculator', description: 'Calculate net salary with 2026 Nigeria tax rates', icon: Calculator, color: '#3B82F6', route: '/tools/paye-calculator' },
      ],
    },
    {
      id: 'gulf-tools', title: 'Gulf Tools', description: 'Calculators and checkers for working in the GCC (UAE, Saudi Arabia & more)', icon: Globe, color: '#059669',
      tools: [
        { id: 'job-offer-evaluator', title: 'Job Offer Evaluator', description: 'Evaluate and compare Gulf job offers to make the best decision', icon: ClipboardList, color: '#F59E0B', route: '/tools/job-offer-evaluator', gulf: true },
        { id: 'profession-country-match', title: 'Profession Country Match', description: 'Find the best Gulf country for your profession and skills', icon: Globe, color: '#10B981', route: '/tools/profession-country-match', gulf: true },
        { id: 'certification-roadmap', title: 'Certification Roadmap', description: 'Plan your professional certifications for Gulf career growth', icon: Award, color: '#6366F1', route: '/tools/certification-roadmap', gulf: true },
        { id: 'education-equivalency-checker', title: 'Education Equivalency Checker', description: "Check how your degree is recognized across Gulf countries", icon: GraduationCap, color: '#0EA5E9', route: '/tools/education-equivalency-checker', gulf: true },
        { id: 'ielts-checker', title: 'IELTS Checker', description: 'Verify IELTS score requirements for Gulf jobs and visas', icon: BookOpen, color: '#14B8A6', route: '/tools/ielts-checker', gulf: true },
        { id: 'saudi-profession-classifier', title: 'Saudi Profession Classifier', description: "Classify your job under Saudi Arabia's official profession codes", icon: CheckSquare, color: '#8B5CF6', route: '/tools/saudi-profession-classifier', gulf: true },
        { id: 'noc-job-change-checker', title: 'NOC & Job Change Checker', description: 'Check NOC requirements and job change rules by Gulf country', icon: RefreshCw, color: '#EF4444', route: '/tools/noc-job-change-checker', gulf: true },
        { id: 'gcc-comparison', title: 'GCC Country Comparison', description: 'Compare living, working, and salary conditions across GCC countries', icon: BarChart2, color: '#3B82F6', route: '/tools/gcc-comparison', gulf: true },
        { id: 'nitaqat-checker', title: 'Nitaqat Checker', description: 'Check Nitaqat Saudization category for Saudi employers', icon: Flag, color: '#DC2626', route: '/tools/nitaqat-checker', gulf: true },
        { id: 'saudi-visa-calculator', title: 'Saudi Visa Calculator', description: 'Estimate visa fees and requirements for Saudi Arabia', icon: Plane, color: '#F97316', route: '/tools/saudi-visa-calculator', gulf: true },
        { id: 'uae-job-seeker-visa', title: 'UAE Job Seeker Visa', description: 'Check eligibility and requirements for the UAE job seeker visa', icon: Navigation, color: '#0891B2', route: '/tools/uae-job-seeker-visa', gulf: true },
        { id: 'salary-benchmark', title: 'Salary Benchmark', description: 'Compare your salary against Gulf market rates by role and country', icon: TrendingUp, color: '#10B981', route: '/tools/salary-benchmark', gulf: true },
        { id: 'take-home-pay-calculator', title: 'Gulf Take-Home Pay Calculator', description: 'Calculate your net salary after Gulf country deductions', icon: DollarSign, color: '#3B82F6', route: '/tools/take-home-pay-calculator', gulf: true },
        { id: 'saudi-dependent-levy', title: 'Saudi Dependent Levy Calculator', description: 'Calculate monthly dependent fees for expats in Saudi Arabia', icon: Users, color: '#7C3AED', route: '/tools/saudi-dependent-levy', gulf: true },
        { id: 'saudi-eosb-calculator', title: 'Saudi EOSB Calculator', description: 'Calculate your end-of-service benefit under Saudi labor law', icon: Landmark, color: '#059669', route: '/tools/saudi-eosb-calculator', gulf: true },
        { id: 'uae-gratuity-calculator', title: 'UAE Gratuity Calculator', description: 'Calculate your UAE end-of-service gratuity entitlement', icon: CreditCard, color: '#0EA5E9', route: '/tools/uae-gratuity-calculator', gulf: true },
        { id: 'iqama-cost-calculator', title: 'Iqama Cost Calculator', description: 'Estimate the full cost of Iqama sponsorship in Saudi Arabia', icon: Star, color: '#D97706', route: '/tools/iqama-cost-calculator', gulf: true },
        { id: 'relocation-budget-planner', title: 'Relocation Budget Planner', description: 'Plan and estimate your total relocation costs to any Gulf city', icon: Wallet, color: '#10B981', route: '/tools/relocation-budget-planner', gulf: true },
        { id: 'cost-of-living', title: 'Cost of Living Comparison', description: 'Compare cost of living across Gulf cities and your home country', icon: Home, color: '#F59E0B', route: '/tools/cost-of-living', gulf: true },
        { id: 'remittance-estimator', title: 'Remittance Estimator', description: 'Estimate money transfer costs and rates from Gulf countries', icon: RefreshCw, color: '#6366F1', route: '/tools/remittance-estimator', gulf: true },
        { id: 'kuwait-dependent-fee-calculator', title: 'Kuwait Dependent Fee Calculator', description: "Calculate Kuwait's 2026 dependent residency fees by sponsor category", icon: Users, color: '#DC2626', route: '/tools/kuwait-dependent-fee-calculator', gulf: true },
        { id: 'oman-eosb-calculator', title: 'Oman EOSB Calculator', description: 'Calculate your Oman end-of-service benefit, correctly split across the 2023 law change', icon: Landmark, color: '#059669', route: '/tools/oman-eosb-calculator', gulf: true },
        { id: 'kuwait-indemnity-calculator', title: 'Kuwait Indemnity Calculator', description: 'Calculate your Kuwait end-of-service indemnity, including resignation reductions', icon: CreditCard, color: '#0EA5E9', route: '/tools/kuwait-indemnity-calculator', gulf: true },
        { id: 'bahrain-gratuity-calculator', title: 'Bahrain Gratuity Calculator', description: 'Estimate your Bahrain end-of-service gratuity payout', icon: Landmark, color: '#7C3AED', route: '/tools/bahrain-gratuity-calculator', gulf: true },
        { id: 'qatar-gratuity-calculator', title: 'Qatar Gratuity Calculator', description: "Calculate your Qatar end-of-service gratuity at 3 weeks' wage per year", icon: CreditCard, color: '#F59E0B', route: '/tools/qatar-gratuity-calculator', gulf: true },
        { id: 'qatar-qatarization-calculator', title: 'Qatarization Calculator', description: "Check your company's ratio against Qatar's 20%-by-2030 national target", icon: Flag, color: '#8B0000', route: '/tools/qatar-qatarization-calculator', gulf: true },
        { id: 'oman-omanisation-calculator', title: 'Omanisation Calculator', description: 'Check your ratio against sector-specific Omanisation targets and fee impact', icon: Flag, color: '#C2410C', route: '/tools/oman-omanisation-calculator', gulf: true },
        { id: 'kuwait-kuwaitization-calculator', title: 'Kuwaitization Calculator', description: "Calculate your Kuwaiti national employment ratio by sector", icon: Flag, color: '#065F46', route: '/tools/kuwait-kuwaitization-calculator', gulf: true },
        { id: 'bahrain-bahrainisation-calculator', title: 'Bahrainisation Calculator', description: "Calculate your Bahraini national employment ratio", icon: Flag, color: '#B91C1C', route: '/tools/bahrain-bahrainisation-calculator', gulf: true },
        { id: 'qatar-qid-cost-calculator', title: 'Qatar QID Cost Calculator', description: 'Calculate the real total cost of renewing your Qatar ID', icon: Star, color: '#8B0000', route: '/tools/qatar-qid-cost-calculator', gulf: true },
        { id: 'kuwait-civil-id-cost-calculator', title: 'Kuwait Civil ID Cost Calculator', description: 'Calculate your Kuwait residency and Civil ID costs by sponsor category', icon: Star, color: '#065F46', route: '/tools/kuwait-civil-id-cost-calculator', gulf: true },
        { id: 'bahrain-cpr-cost-calculator', title: 'Bahrain CPR Cost Calculator', description: 'Calculate your Bahrain work permit and CPR renewal costs', icon: Star, color: '#B91C1C', route: '/tools/bahrain-cpr-cost-calculator', gulf: true },
        { id: 'oman-resident-card-cost-calculator', title: 'Oman Resident Card Cost Calculator', description: 'Calculate your Oman resident card renewal cost by validity period', icon: Star, color: '#C2410C', route: '/tools/oman-resident-card-cost-calculator', gulf: true },
      ],
    },
  ];

  // Calculate total number of tools/cards
  const totalTools = categories.reduce((sum, category) => sum + category.tools.length, 0);

  // Show middle ad only if there are at least 14 tools
  const showMiddleAd = totalTools >= 14;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      {/* Header */}
      <div className="pt-12 pb-10 px-6" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: theme.colors.text.light }}>Career Tools</h1>
        </div>
      </div>

      {/* ── AD 1: Top banner ── */}
      <div className="px-4 md:px-6 pt-6 max-w-6xl mx-auto">
        <AdUnit slot="4198231153" format="auto" />
      </div>

      <div className="px-4 md:px-6 py-8 max-w-6xl mx-auto">
        <div className="space-y-12">
          {categories.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <React.Fragment key={category.id}>
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category.color}15` }}>
                      <CategoryIcon size={24} style={{ color: category.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{category.title}</h2>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.id}
                          href={tool.route || '#'}
                          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-4 group"
                          style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tool.color}15` }}>
                            <Icon size={22} style={{ color: tool.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                              {tool.gulf && (
                                <span
                                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: '#05966915', color: '#059669' }}
                                >
                                  GULF
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                          </div>
                          <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </Link>
                      );
                    })}
                  </div>
                </section>

                {/* ── Conditional Middle AD ── */}
                {showMiddleAd && index === 1 && (
                  <div className="py-2">
                    <AdUnit slot="8181708196" format="fluid" layout="in-article" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── AD 3: Bottom banner ── */}
        <div className="mt-12">
          <AdUnit slot="9751041788" format="auto" />
        </div>
      </div>
    </div>
  );
}
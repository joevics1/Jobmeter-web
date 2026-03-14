// 📁 app/tools/quiz/[company]/page.tsx
// Pre-rendered at build time for every company in COMPANIES.
// Zero Supabase calls on user visit — questions only fetched when user starts a quiz.

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyQuizClient from './CompanyQuizClient';
import { COMPANIES, companyToSlug, slugToCompany } from '@/lib/quizCompanies';

interface Props {
  params: Promise<{ company: string }>;
}

// Pre-render every company page at build time
export async function generateStaticParams() {
  return COMPANIES.map((company) => ({
    company: companyToSlug(company),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: slug } = await params;
  const company = slugToCompany(slug);
  if (!company) return {};

  return {
    title: `${company} | Practice Questions & Answers`,
    description: `Practice ${company} aptitude test questions online. Free objective questions with instant results. Premium: 50 questions + AI-graded theory. Prepare for ${company.split(' ')[0]} recruitment.`,
    keywords: [
      `${company.split(' ')[0]} aptitude test`,
      `${company.split(' ')[0]} recruitment test`,
      `${company} practice questions`,
      'aptitude test Nigeria',
      'recruitment assessment practice',
    ],
  };
}

export default async function CompanyQuizPage({ params }: Props) {
  const { company: slug } = await params;
  const company = slugToCompany(slug);

  if (!company) notFound();

  return <CompanyQuizClient company={company} />;
}
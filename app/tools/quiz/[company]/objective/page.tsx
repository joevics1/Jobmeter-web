import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ObjectiveQuizClient from './ObjectiveQuizClient';
import { COMPANIES, companyToSlug, slugToCompany } from '@/lib/quizCompanies';
import QuizBreadcrumb from '@/components/quiz/QuizBreadcrumb';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

export const revalidate = false;

export async function generateStaticParams() {
  return COMPANIES.map((company) => ({
    company: companyToSlug(company),
  }));
}

interface Props {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: companySlug } = await params;
  const company = slugToCompany(companySlug);
  if (!company) return {};
  const firstName = company.split(' ')[0];

  return {
    title: `${company} Objective Questions Quiz | Practice Online`,
    description: `Free ${company} objective aptitude test questions. Multiple choice quiz with ${firstName} recruitment test practice.`,
    keywords: [`${firstName} objective questions`, `${firstName} aptitude test`, 'multiple choice quiz'],
    // Canonicalizes to the clean URL regardless of ?section=&count=&timer=
    // query params, so the many practice-run permutations aren't indexed
    // as separate duplicate pages.
    alternates: { canonical: `${siteUrl}/tools/quiz/${companySlug}/objective` },
  };
}

export default async function ObjectiveQuizPage({ params }: Props) {
  const { company: companySlug } = await params;
  const company = slugToCompany(companySlug);

  if (!company) notFound();

  return (
    <>
      <QuizBreadcrumb items={[
        { name: 'Home', href: '/' },
        { name: 'Tools', href: '/tools' },
        { name: 'Quiz Platform', href: '/tools/quiz' },
        { name: company, href: `/tools/quiz/${companySlug}` },
        { name: 'Objective Quiz', href: `/tools/quiz/${companySlug}/objective` },
      ]} />
      <ObjectiveQuizClient company={company} />
    </>
  );
}
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TheoryQuizClient from './TheoryQuizClient';
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
    title: `${company} Theory Questions Quiz | AI Graded`,
    description: `Practice ${company} theory and essay questions. Get AI-graded answers with feedback. Prepare for ${firstName} recruitment.`,
    keywords: [`${firstName} theory questions`, `${firstName} essay`, `${firstName} interview questions`, 'AI graded quiz'],
    alternates: { canonical: `${siteUrl}/tools/quiz/${companySlug}/theory` },
  };
}

export default async function TheoryQuizPage({ params }: Props) {
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
        { name: 'Theory Quiz', href: `/tools/quiz/${companySlug}/theory` },
      ]} />
      <TheoryQuizClient company={company} />
    </>
  );
}
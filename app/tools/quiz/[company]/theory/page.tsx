import { Metadata } from 'next';
import TheoryQuizClient from './TheoryQuizClient';

interface Props {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: companySlug } = await params;
  const company = companySlug.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `${company} Theory Questions Quiz | AI Graded`,
    description: `Practice ${company} theory and essay questions. Get AI-graded answers with feedback. Prepare for ${company} recruitment.`,
    keywords: [`${company} theory questions`, `${company} essay`, `${company} interview questions`, 'AI graded quiz'],
  };
}

export default async function TheoryQuizPage({ params }: Props) {
  const { company: companySlug } = await params;
  const company = companySlug.replace(/-/g, ' ').toUpperCase();
  
  return <TheoryQuizClient company={company} />;
}

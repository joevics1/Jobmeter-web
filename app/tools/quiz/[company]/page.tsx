import { Metadata } from 'next';
import CompanyQuizClient from './CompanyQuizClient';

interface Props {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: companySlug } = await params;
  const company = companySlug.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `${company} Aptitude Test Quiz | Practice Online`,
    description: `Practice ${company} aptitude test questions online. Free objective and theory questions with instant results. Prepare for ${company} recruitment.`,
    keywords: [`${company} aptitude test`, `${company} quiz`, `${company} recruitment test`, 'aptitude test practice', 'job interview preparation'],
  };
}

export default async function CompanyQuizPage({ params }: Props) {
  const { company: companySlug } = await params;
  const company = companySlug.replace(/-/g, ' ').toUpperCase();
  
  return <CompanyQuizClient company={company} />;
}

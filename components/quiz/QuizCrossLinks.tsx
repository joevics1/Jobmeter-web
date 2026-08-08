import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRelatedCompanies, companyToSlug } from '@/lib/quizCompanies';

// Used on the company selector page and both results screens (objective +
// theory). Two jobs:
//  1. Cross-link this quiz to a rotating set of sibling company quizzes, so
//     link equity flows between the ~19 company pages instead of every page
//     only linking back up to the /tools/quiz hub.
//  2. Cross-link out of the Quiz cluster entirely — to Jobs, other Tools,
//     CV Templates, and the Blog — so a finished quiz doesn't dead-end.
export default function QuizCrossLinks({ currentCompany }: { currentCompany: string }) {
  const related = getRelatedCompanies(currentCompany, 6);
  const firstName = currentCompany.split(' ')[0];

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {related.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Practice These Too</h3>
          <div className="flex flex-wrap gap-2">
            {related.map((company) => (
              <Link
                key={company}
                href={`/tools/quiz/${companyToSlug(company)}`}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {company.replace(/(Recruitment|Assessment|Practice Test|Graduate Trainee)/gi, '').trim() || company}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Next Steps</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href={`/jobs?search=${encodeURIComponent(firstName)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            {firstName} jobs <ArrowRight size={12} />
          </Link>
          <Link href="/tools/interview" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            Interview practice <ArrowRight size={12} />
          </Link>
          <Link href="/tools/ats-review" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            ATS CV review <ArrowRight size={12} />
          </Link>
          <Link href="/cv-templates" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            CV templates <ArrowRight size={12} />
          </Link>
          <Link href="/blog" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            Career blog <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { BreadcrumbListSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

interface Crumb {
  name: string;
  href: string; // relative, e.g. '/tools/quiz'
}

// Renders both the visible breadcrumb trail and its BreadcrumbList JSON-LD
// in one place, so every quiz page (hub, company, objective, theory) emits
// consistent, correct schema instead of each page hand-rolling it (or, as
// before, not having one at all).
export default function QuizBreadcrumb({ items }: { items: Crumb[] }) {
  const schemaItems = items.map((item) => ({ name: item.name, url: `${siteUrl}${item.href}` }));

  return (
    <>
      <BreadcrumbListSchema items={schemaItems} />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-2.5">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-gray-600" aria-label="Breadcrumb">
            {items.map((item, i) => (
              <span key={item.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-400">/</span>}
                {i === items.length - 1 ? (
                  <span className="text-gray-900 font-medium line-clamp-1">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-blue-600">{item.name}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

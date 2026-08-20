// app/cover-letter-templates/page.tsx — hub page listing all published
// cover letter template pages, for internal linking / discovery.
// Isolated data source (reuses content_role_pages with kind='cover_letter').

import Link from 'next/link';
import { getAllPublishedCoverLetterRolePages } from '@/lib/cover-letter-template-pages/data';
import BackButton from './_components/back-button';

export const metadata = {
  title: 'Free Cover Letter Templates by Role | JobMeter',
  description: 'Browse free, role-specific cover letter templates tailored for job seekers.',
};

export const dynamic = 'force-dynamic';

export default async function CoverLetterTemplatesHub() {
  const pages = await getAllPublishedCoverLetterRolePages();

  return (
    <>
      <BackButton title="Free Cover Letter Templates" href="/" />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Browse by Role</h1>
          <Link href="/cover-letter-templates/history" className="text-sm text-blue-600 font-medium">Cover Letter History</Link>
        </div>
        {pages.length === 0 ? (
          <p className="text-muted-foreground">No templates published yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {pages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/cover-letter-templates/${p.role_slug}`}
                  className="block border rounded-lg p-4 hover:border-blue-600"
                >
                  <span className="font-semibold">{p.role_label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

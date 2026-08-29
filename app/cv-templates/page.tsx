// app/cv-templates/page.tsx — hub page listing all published CV template
// pages, for internal linking / discovery. Isolated data source.

import Link from 'next/link';
import { getAllPublishedRolePages } from '@/lib/cv-template-pages/data';
import BackButton from './_components/back-button';

export const metadata = {
  title: 'Free CV Templates by Role | JobMeter',
  description: 'Browse free, role-specific CV templates tailored for job seekers.',
};

// Static generation with periodic revalidation, same as the individual
// role pages — was force-dynamic (rendered fresh on every request), which
// meant no caching at all for a page that just lists published templates.
export const revalidate = 3600;

export default async function CVTemplatesHub() {
  const pages = await getAllPublishedRolePages('cv');

  return (
    <>
      <BackButton title="Free CV Templates" href="/" />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Browse by Role</h1>
          <Link href="/cv-templates/history" className="text-sm text-blue-600 font-medium">CV History</Link>
        </div>
        {pages.length === 0 ? (
          <p className="text-muted-foreground">No templates published yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {pages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/cv-templates/${p.role_slug}`}
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

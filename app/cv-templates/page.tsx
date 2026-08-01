// app/cv-templates/page.tsx — hub page listing all published CV template
// pages, for internal linking / discovery. Isolated data source.

import Link from 'next/link';
import { getAllPublishedRolePages } from '@/lib/cv-template-pages/data';

export const metadata = {
  title: 'Free CV Templates by Role & Country | JobMeter',
  description: 'Browse free, role-specific CV templates tailored for job seekers across different countries.',
};

export const dynamic = 'force-dynamic';

export default async function CVTemplatesHub() {
  const pages = await getAllPublishedRolePages('cv');

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Free CV Templates</h1>
      {pages.length === 0 ? (
        <p className="text-gray-500">No templates published yet.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {pages.map((p) => (
            <li key={p.id}>
              <Link
                href={`/cv-templates/${p.role_slug}/${p.country_code}`}
                className="block border rounded-lg p-4 hover:border-purple-600"
              >
                <span className="font-semibold">{p.role_label}</span> — {p.country_label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

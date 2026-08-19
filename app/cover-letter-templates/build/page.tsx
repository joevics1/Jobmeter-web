// app/cover-letter-templates/build/page.tsx
// Shared entry point for cover letter creation, reached via ?role= from
// any role landing page. Fetches that page's sample template letter (for
// the signed-out "Edit Sample Document" path) — isolated data layer only.

import { getCoverLetterRolePage } from '@/lib/cover-letter-template-pages/data';
import BuildClient from './client';

export const metadata = {
  title: 'Build Your Cover Letter | JobMeter',
  description: 'Quick Create with your profile, edit the template, and download your cover letter in minutes.',
};

export default async function BuildPage({
  searchParams,
}: {
  searchParams: { role?: string; start?: string; historyId?: string };
}) {
  const roleSlug = searchParams.role || '';
  const start = searchParams.start || 'blank';
  const historyId = searchParams.historyId || '';

  const rolePage = roleSlug ? await getCoverLetterRolePage(roleSlug) : null;

  return (
    <BuildClient
      roleSlug={roleSlug}
      roleLabel={rolePage?.role_label || roleSlug.replace(/-/g, ' ')}
      sampleCoverLetterData={rolePage?.preview_cover_letter_data || null}
      start={start as 'quick' | 'blank' | 'sample' | 'history'}
      historyId={historyId}
    />
  );
}

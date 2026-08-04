// app/cv-templates/build/page.tsx
// Shared entry point for CV creation, reached via ?role= from any role
// landing page. Fetches that page's sample CV (for the signed-out "Edit
// Sample Document" path) — isolated data layer only.
//
// Country is omitted for now — see lib/cv-template-pages/data.ts.

import { getRolePage } from '@/lib/cv-template-pages/data';
import BuildClient from './client';

export const metadata = {
  title: 'Build Your CV | JobMeter',
  description: 'Fill in your details, pick a design, and generate your CV in minutes.',
};

export default async function BuildPage({
  searchParams,
}: {
  searchParams: { role?: string; start?: string; historyId?: string };
}) {
  const roleSlug = searchParams.role || '';
  const start = searchParams.start || 'blank';
  const historyId = searchParams.historyId || '';

  const rolePage = roleSlug ? await getRolePage('cv', roleSlug) : null;

  return (
    <BuildClient
      roleSlug={roleSlug}
      roleLabel={rolePage?.role_label || roleSlug.replace(/-/g, ' ')}
      sampleCvData={rolePage?.preview_cv_data || null}
      start={start as 'quick' | 'fetch' | 'blank' | 'sample' | 'history'}
      historyId={historyId}
    />
  );
}

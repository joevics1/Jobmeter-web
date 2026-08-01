// app/cv-templates/build/page.tsx
// Shared entry point for CV creation, reached via ?role=&country= from any
// role/country landing page. Fetches that page's sample CV (for the
// signed-out "Edit Sample Document" path) — isolated data layer only.

import { getRolePage } from '@/lib/cv-template-pages/data';
import BuildClient from './client';

export const metadata = {
  title: 'Build Your CV | JobMeter',
  description: 'Fill in your details, pick a design, and generate your CV in minutes.',
};

export default async function BuildPage({
  searchParams,
}: {
  searchParams: { role?: string; country?: string };
}) {
  const roleSlug = searchParams.role || '';
  const countryCode = searchParams.country || '';

  const rolePage = roleSlug && countryCode ? await getRolePage('cv', roleSlug, countryCode) : null;

  return (
    <BuildClient
      roleSlug={roleSlug}
      countryCode={countryCode}
      roleLabel={rolePage?.role_label || roleSlug.replace(/-/g, ' ')}
      countryLabel={rolePage?.country_label || countryCode.toUpperCase()}
      sampleCvData={rolePage?.preview_cv_data || null}
    />
  );
}

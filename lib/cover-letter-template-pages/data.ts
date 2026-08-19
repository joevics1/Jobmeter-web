// lib/cover-letter-template-pages/data.ts
// Data layer for the Cover Letter Templates SEO landing pages. Reuses the
// same content_role_pages table as the CV Templates feature (it already
// has a `kind` column typed 'cv' | 'cover_letter' — no new table needed),
// filtered to kind='cover_letter' throughout. Isolated from
// lib/cv-template-pages/* otherwise — this file has its own copy of the
// query logic rather than importing it, and reads preview_cover_letter_data
// (not preview_cv_data).

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { CoverLetterData } from './cover-letter-data-types';

export interface FAQRow {
  q: string;
  a: string;
}

export interface CoverLetterRolePage {
  id: string;
  kind: 'cover_letter';
  role_slug: string;
  country_code: string;
  role_label: string;
  country_label: string;
  meta_title: string | null;
  meta_description: string | null;
  seo_intro: string;
  seo_content: string;
  faqs: FAQRow[];
  preview_cover_letter_data: CoverLetterData | null;
  status: 'draft' | 'published';
  updated_at: string;
}

// Wrapped in cache() for the same reason as lib/cv-template-pages/data.ts —
// generateMetadata() and the page component call this with identical args
// in the same render pass.
export const getCoverLetterRolePage = cache(async function getCoverLetterRolePage(
  roleSlug: string
): Promise<CoverLetterRolePage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('*')
    .eq('kind', 'cover_letter')
    .eq('role_slug', roleSlug)
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as CoverLetterRolePage;
});

export async function getAllPublishedCoverLetterRolePageParams(): Promise<{ role: string }[]> {
  const pages = await getAllPublishedCoverLetterRolePages();
  return pages.map((p) => ({ role: p.role_slug }));
}

export async function getAllPublishedCoverLetterRolePages(): Promise<CoverLetterRolePage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('*')
    .eq('kind', 'cover_letter')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  const seen = new Set<string>();
  const deduped: CoverLetterRolePage[] = [];
  for (const row of data as CoverLetterRolePage[]) {
    if (seen.has(row.role_slug)) continue;
    seen.add(row.role_slug);
    deduped.push(row);
  }
  return deduped.sort((a, b) => a.role_label.localeCompare(b.role_label));
}

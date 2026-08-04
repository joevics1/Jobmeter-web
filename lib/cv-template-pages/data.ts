// lib/cv-template-pages/data.ts
// Data layer for the CV Templates SEO landing pages. Deliberately isolated
// from the existing CV/cover-letter builder — reads only the fresh
// `content_role_pages` table and the copied CVData type in this same folder.
// Do not import from lib/types/cv, lib/services/cvGenerationService, or
// lib/services/cvTemplateRenderer — this feature does not depend on them.
//
// Country is omitted from routing/lookup for now (role-only pages). The
// `content_role_pages` table still has country_code/country_label columns
// (NOT NULL) — existing rows are untouched, and getAllPublishedRolePages
// dedupes to one row per role_slug (most recently updated) so the UI never
// has to show or choose between countries. Re-adding country to the URL
// later just means re-adding the .eq('country_code', ...) filters below.

import { createClient } from '@/lib/supabase/server';
import type { CVData } from './cv-data-types';

export type ContentRolePageKind = 'cv' | 'cover_letter';

export interface FAQRow {
  q: string;
  a: string;
}

export interface ContentRolePage {
  id: string;
  kind: ContentRolePageKind;
  role_slug: string;
  country_code: string;
  role_label: string;
  country_label: string;
  meta_title: string | null;
  meta_description: string | null;
  seo_intro: string;
  seo_content: string;
  faqs: FAQRow[];
  preview_cv_data: CVData | null;
  status: 'draft' | 'published';
  updated_at: string;
}

export async function getRolePage(
  kind: ContentRolePageKind,
  roleSlug: string
): Promise<ContentRolePage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('*')
    .eq('kind', kind)
    .eq('role_slug', roleSlug)
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as ContentRolePage;
}

export async function getAllPublishedRolePageParams(
  kind: ContentRolePageKind
): Promise<{ role: string }[]> {
  const pages = await getAllPublishedRolePages(kind);
  return pages.map((p) => ({ role: p.role_slug }));
}

export async function getAllPublishedRolePages(
  kind: ContentRolePageKind
): Promise<ContentRolePage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('*')
    .eq('kind', kind)
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  // Dedupe to one row per role_slug (most recently updated) — country is
  // omitted from the UI for now, so multiple countries for the same role
  // would otherwise show as confusing duplicate cards/links.
  const seen = new Set<string>();
  const deduped: ContentRolePage[] = [];
  for (const row of data as ContentRolePage[]) {
    if (seen.has(row.role_slug)) continue;
    seen.add(row.role_slug);
    deduped.push(row);
  }
  return deduped.sort((a, b) => a.role_label.localeCompare(b.role_label));
}

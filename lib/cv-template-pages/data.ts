// lib/cv-template-pages/data.ts
// Data layer for the CV Templates SEO landing pages. Deliberately isolated
// from the existing CV/cover-letter builder — reads only the fresh
// `content_role_pages` table and the copied CVData type in this same folder.
// Do not import from lib/types/cv, lib/services/cvGenerationService, or
// lib/services/cvTemplateRenderer — this feature does not depend on them.

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
  roleSlug: string,
  countryCode: string
): Promise<ContentRolePage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('*')
    .eq('kind', kind)
    .eq('role_slug', roleSlug)
    .eq('country_code', countryCode)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as ContentRolePage;
}

export async function getAllPublishedRolePageParams(
  kind: ContentRolePageKind
): Promise<{ role: string; country: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_role_pages')
    .select('role_slug, country_code')
    .eq('kind', kind)
    .eq('status', 'published');

  if (error || !data) return [];
  return data.map((r) => ({ role: r.role_slug, country: r.country_code }));
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
    .order('role_label', { ascending: true });

  if (error || !data) return [];
  return data as ContentRolePage[];
}

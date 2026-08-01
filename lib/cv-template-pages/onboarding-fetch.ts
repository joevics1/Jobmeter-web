// lib/cv-template-pages/onboarding-fetch.ts
// Read-only access to onboarding_data for the "Fetch My Details" path.
// Never writes to this table. Field shapes confirmed against real rows:
// cv_work_experience: [{ title, company, duration, description }]
// cv_education: [{ degree, institution, year }]
// This is a raw, non-AI mapping — used only for "Fetch My Details".
// "Quick Create" instead calls the tailor-cv-template-page edge function,
// which fetches onboarding_data itself server-side and reshapes it via AI.

import { supabase } from '@/lib/supabase';
import type { CVData } from './cv-data-types';

export async function fetchOnboardingData(userId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

function splitIntoBullets(description: string | undefined): string[] {
  if (!description) return [];
  return description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 5);
}

export function mapOnboardingToCVData(row: any): CVData {
  return {
    personalDetails: {
      name: row.cv_name || '',
      title: row.cv_roles?.[0] || row.target_roles?.[0] || '',
      email: row.cv_email || '',
      phone: row.cv_phone || '',
      location: row.cv_location || '',
      linkedin: row.cv_linkedin || undefined,
      github: row.cv_github || undefined,
      portfolio: row.cv_portfolio || undefined,
    },
    summary: row.cv_summary || '',
    roles: Array.isArray(row.cv_roles) ? row.cv_roles : undefined,
    skills: Array.isArray(row.cv_skills) ? row.cv_skills : [],
    experience: Array.isArray(row.cv_work_experience)
      ? row.cv_work_experience.map((exp: any) => ({
          role: exp.title || exp.role || '',
          company: exp.company || '',
          years: exp.duration || exp.years || '',
          bullets: Array.isArray(exp.bullets) ? exp.bullets : splitIntoBullets(exp.description),
        }))
      : [],
    education: Array.isArray(row.cv_education)
      ? row.cv_education.map((edu: any) => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          years: edu.year || edu.years || '',
        }))
      : [],
    projects: Array.isArray(row.cv_projects)
      ? row.cv_projects.map((p: any) =>
          typeof p === 'string' ? { title: p, description: '' } : { title: p.title || '', description: p.description || '' }
        )
      : undefined,
    accomplishments: Array.isArray(row.cv_accomplishments) ? row.cv_accomplishments : undefined,
    awards: Array.isArray(row.cv_awards)
      ? row.cv_awards.map((a: any) => (typeof a === 'string' ? { title: a } : { title: a.title || '', issuer: a.issuer, year: a.year }))
      : undefined,
    certifications: Array.isArray(row.cv_certifications)
      ? row.cv_certifications.map((c: any) =>
          typeof c === 'string' ? { name: c } : { name: c.name || '', issuer: c.issuer, year: c.year }
        )
      : [],
    languages: Array.isArray(row.cv_languages) ? row.cv_languages : [],
    interests: Array.isArray(row.cv_interests) ? row.cv_interests : undefined,
    publications: Array.isArray(row.cv_publications)
      ? row.cv_publications.map((p: any) =>
          typeof p === 'string' ? { title: p } : { title: p.title || '', journal: p.venue || p.journal, year: p.year }
        )
      : undefined,
    volunteerWork: Array.isArray(row.cv_volunteer_work)
      ? row.cv_volunteer_work.map((v: any) => ({
          organization: v.organization || '',
          role: v.role,
          duration: v.period || v.duration,
          description: v.description,
        }))
      : undefined,
    additionalSections: Array.isArray(row.cv_additional_sections)
      ? row.cv_additional_sections.map((s: any) =>
          typeof s === 'string' ? { sectionName: 'Additional', content: s } : { sectionName: s.sectionName || 'Additional', content: s.content || '' }
        )
      : undefined,
  };
}

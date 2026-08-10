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

// Reverse of mapOnboardingToCVData — used by the Settings "Edit Profile"
// page to save edits back. Converts our normalized CVData shape back into
// onboarding_data's actual column shapes (title/duration/description for
// work experience, etc.) rather than inventing a new schema.
export function mapCVDataToOnboardingUpdate(data: CVData): Record<string, any> {
  return {
    cv_name: data.personalDetails.name || null,
    cv_email: data.personalDetails.email || null,
    cv_phone: data.personalDetails.phone || null,
    cv_location: data.personalDetails.location || null,
    cv_linkedin: data.personalDetails.linkedin || null,
    cv_github: data.personalDetails.github || null,
    cv_portfolio: data.personalDetails.portfolio || null,
    cv_summary: data.summary || null,
    cv_roles: data.roles?.length ? data.roles : null,
    cv_skills: data.skills?.length ? data.skills : null,
    cv_work_experience: data.experience?.length
      ? data.experience.map((e) => ({
          title: e.role,
          company: e.company,
          duration: e.years,
          description: (e.bullets || []).join('. '),
        }))
      : null,
    cv_education: data.education?.length
      ? data.education.map((e) => ({ degree: e.degree, institution: e.institution, year: e.years }))
      : null,
    cv_projects: data.projects?.length ? data.projects : null,
    cv_accomplishments: data.accomplishments?.length ? data.accomplishments : null,
    cv_awards: data.awards?.length
      ? data.awards.map((a) => ({ title: a.title, issuer: a.issuer, year: a.year }))
      : null,
    cv_certifications: data.certifications?.length ? data.certifications : null,
    cv_languages: data.languages?.length ? data.languages : null,
    cv_interests: data.interests?.length ? data.interests : null,
    cv_publications: data.publications?.length
      ? data.publications.map((p) => ({ title: p.title, venue: p.journal, year: p.year }))
      : null,
    cv_volunteer_work: data.volunteerWork?.length
      ? data.volunteerWork.map((v) => ({ organization: v.organization, role: v.role, period: v.duration, description: v.description }))
      : null,
    cv_additional_sections: data.additionalSections?.length ? data.additionalSections : null,
  };
}

export async function updateOnboardingData(userId: string, updates: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('onboarding_data')
    .update(updates)
    .eq('user_id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// For a brand-new user (e.g. just signed up via the parse-and-signup gate)
// who has no onboarding_data row yet — plain insert, not update.
export async function insertOnboardingData(userId: string, fields: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('onboarding_data')
    .insert({ user_id: userId, ...fields });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

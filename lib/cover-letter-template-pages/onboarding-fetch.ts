// lib/cover-letter-template-pages/onboarding-fetch.ts
// Read-only access to onboarding_data for signed-in users. Own copy of
// CV's lib/cv-template-pages/onboarding-fetch.ts (not imported — same
// isolation pattern as the rest of this feature: copied, not shared).
//
// This is a raw, non-AI mapping. Quick Create used to call the
// tailor-cover-letter-template-page edge function (Gemini, ~45s, real
// cost) to "personalize" a letter — but with no job description given,
// there's nothing real to personalize against, so that call just had
// Gemini invent generic-sounding content from the same fields this file
// reads directly. Quick Create, Edit, and Clear all use this now:
// - Quick Create: fetch + map, merge into the role's sample letter body,
//   go straight to result (no form, no AI, no cost — same shape as CV's
//   Quick Create).
// - Edit / Clear: fetch + map, but only personalDetails is merged in
//   (into the sample or blank letter respectively) before showing the
//   form, so a logged-in user never has to retype their own name/email/
//   phone/location.
// Actual AI-assisted personalization still exists — it's what "Customize
// for Job" (customize-cover-letter-for-job) is for, once there's a real
// job description to tailor against.

import { supabase } from '@/lib/supabase';
import type { CoverLetterData } from './cover-letter-data-types';

export async function fetchOnboardingData(userId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

// Only the fields we can respectfully drop into a letter's header without
// inventing anything. Nothing here is prose (see file comment above).
export function mapOnboardingToPersonalDetails(row: any): Partial<CoverLetterData['personalDetails']> {
  return {
    name: row.cv_name || '',
    title: row.cv_roles?.[0] || row.target_roles?.[0] || '',
    email: row.cv_email || '',
    phone: row.cv_phone || '',
    location: row.cv_location || '',
    linkedin: row.cv_linkedin || undefined,
    portfolio: row.cv_portfolio || undefined,
  };
}

// Merges fetched personalDetails into an existing CoverLetterData (sample
// or blank), keeping every other field — body content, salutation, etc. —
// untouched. Only fills in fields the profile actually has a value for.
export function mergePersonalDetails(base: CoverLetterData, row: any): CoverLetterData {
  const fetched = mapOnboardingToPersonalDetails(row);
  return {
    ...base,
    personalDetails: {
      ...base.personalDetails,
      ...(fetched.name ? { name: fetched.name } : {}),
      ...(fetched.title ? { title: fetched.title } : {}),
      ...(fetched.email ? { email: fetched.email } : {}),
      ...(fetched.phone ? { phone: fetched.phone } : {}),
      ...(fetched.location ? { location: fetched.location } : {}),
      ...(fetched.linkedin ? { linkedin: fetched.linkedin } : {}),
      ...(fetched.portfolio ? { portfolio: fetched.portfolio } : {}),
    },
  };
}

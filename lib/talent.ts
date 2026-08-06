// lib/talent.ts
// Shared helpers for the Talent Pool pages feature.

export const TALENT_FREE_DAILY_VIEW_LIMIT = 5;
export const TALENT_UNLIMITED_PRICE_NAIRA = 10000;
export const TALENT_UNLIMITED_PLAN_TYPE = 'talent_unlimited';

/**
 * The talent list only updates in a weekly batch, every Monday morning —
 * not live as people opt in. Rather than running a cron job, we compute
 * this once at opt-in time: "the next Monday 00:00" (local server time),
 * or today if it's already past Monday 00:00 *and* opt-in happened before
 * some point on Monday itself we just treat as "this Monday". The talent
 * list query then simply filters `talent_visible_from <= now()` — no
 * scheduled job needed anywhere.
 */
export function computeNextMonday(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  if (day === 1) {
    // Already Monday — visible from today.
    return d;
  }
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return d;
}

export type TalentCategory = 'intern' | 'available';

/**
 * Auto-sorts a candidate into "Intern" vs "Available for Work" based on
 * their onboarding experience_level. There's no explicit "intern"/"student"
 * bucket in the data today, so Entry-Level (or unset) reads as Intern;
 * anything more senior (Junior and up) reads as Available for Work.
 * Matching is case-insensitive since existing rows are inconsistently cased.
 */
export function classifyTalentCategory(experienceLevel: string | null | undefined): TalentCategory {
  const level = (experienceLevel || '').trim().toLowerCase();
  if (!level || level === 'entry-level' || level === 'entry level') {
    return 'intern';
  }
  return 'available';
}

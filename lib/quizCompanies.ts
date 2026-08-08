// 📁 lib/quizCompanies.ts
// No "use client" — importable by both server components and client components.
// To add a new company: add to COMPANIES, add questions to Supabase, redeploy.

export const COMPANIES = [
  'Access Bank Graduate Trainee Assessment Test',
  'Access Bank Recruitment Assessment Test',
  'British American Tobacco (BAT) Practice Test',
  'CAT Practice Test',
  'Deloitte Recruitment Assessment Practice Test',
  'Dragnet Assessment Practice Test',
  'Ernst & Young (EY) Assessment Practice Test',
  'ExxonMobil Recruitment Assessment Practice Test',
  'First Bank Recruitment Assessment Practice Test',
  'General Aptitude Practice Test',
  'GMAT Practice Test',
  'GT Bank Recruitment Assessment Practice Test',
  'HCP Aptitude Practice Test',
  'KPMG Assessment Practice Test',
  'NNPC Recruitment Assessment Practice Test',
  'PwC Recruitment Assessment Practice Test',
  'UBA Recruitment Assessment Practice Test',
  'Workforce Ability Aptitude Practice Test',
  'Zenith Bank Recruitment Aptitude Practice Test',
].sort() as string[];

export function companyToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function slugToCompany(slug: string): string | null {
  return COMPANIES.find((c) => companyToSlug(c) === slug) ?? null;
}

// Deterministic pseudo-random shuffle seeded by a string, so each company
// page gets a different-looking but stable set of "practice these too"
// links (stable = doesn't change on every request, since these pages are
// statically generated with revalidate=false — but varies company to
// company so link equity spreads across the whole set instead of every
// page linking the same fixed shortlist).
function seededShuffle<T>(arr: T[], seed: string): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Returns up to `count` companies other than `current`, in a stable
// pseudo-random order seeded by `current` — used to cross-link sibling
// quiz pages to each other instead of every page linking a fixed shortlist.
export function getRelatedCompanies(current: string, count = 6): string[] {
  const others = COMPANIES.filter((c) => c !== current);
  return seededShuffle(others, current).slice(0, count);
}
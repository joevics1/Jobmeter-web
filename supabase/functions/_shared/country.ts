// Single source of truth for country handling in the Telegram bot, the daily digest
// and the match alerts (telegram-bot, telegram-daily-digest, daily-job-notifications).
// Import with: import { ... } from '../_shared/country.ts';

// "Global" = remote jobs open to anyone worldwide (jobs.country contains 'Global').
// Regional tags (Africa, Europe, LATAM, ...) are NOT global: they only count for
// countries inside that region — see COUNTRY_REGIONS.
export const GLOBAL_TAG = 'Global';

const AFRICA = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Ethiopia', 'Morocco', 'Sierra Leone', 'Tanzania', 'Uganda',
  'Rwanda', 'Senegal', 'Cameroon', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Algeria', 'Tunisia', "Côte d'Ivoire",
  'Benin', 'Togo', 'Mali', 'Niger', 'Burkina Faso', 'Guinea', 'Liberia', 'Gambia', 'Cape Verde', 'Guinea-Bissau',
];
const MIDDLE_EAST = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Kuwait', 'Bahrain', 'Jordan', 'Turkey'];
const EUROPE = [
  'United Kingdom', 'Ireland', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Portugal', 'Poland', 'Sweden',
  'Norway', 'Switzerland', 'Romania',
];
const EASTERN_EUROPE = ['Poland', 'Romania'];
const NORTH_AMERICA_OCEANIA = ['United States', 'Canada', 'Australia', 'New Zealand'];
const LATAM = ['Mexico', 'Argentina', 'Brazil', 'Colombia', 'Chile'];
const ASIA = ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Philippines', 'Singapore', 'Malaysia', 'Indonesia', 'China', 'Japan'];

export const KNOWN_COUNTRIES = [...AFRICA, ...MIDDLE_EAST, ...EUROPE, ...NORTH_AMERICA_OCEANIA, ...LATAM, ...ASIA];

// Which regional tags a country may also receive (besides its own name and 'Global').
const REGION_MEMBERS: Record<string, string[]> = {
  Africa: AFRICA,
  'Middle East': MIDDLE_EAST,
  Europe: EUROPE,
  'Eastern Europe': EASTERN_EUROPE,
  LATAM,
  Asia: ASIA,
};
export const COUNTRY_REGIONS: Record<string, string[]> = {};
for (const [region, members] of Object.entries(REGION_MEMBERS)) {
  for (const c of members) (COUNTRY_REGIONS[c] ||= []).push(region);
}

export const COUNTRY_ALIASES: Record<string, string> = {
  uk: 'United Kingdom', 'great britain': 'United Kingdom', england: 'United Kingdom', britain: 'United Kingdom',
  usa: 'United States', us: 'United States', america: 'United States', 'united states of america': 'United States',
  uae: 'United Arab Emirates', dubai: 'United Arab Emirates', 'abu dhabi': 'United Arab Emirates',
  "cote d'ivoire": "Côte d'Ivoire", 'ivory coast': "Côte d'Ivoire", ksa: 'Saudi Arabia',
  remote: 'Global', global: 'Global', worldwide: 'Global', anywhere: 'Global',
};

// Nigerian cities/states, for profile locations written without the country ("Lagos", "Ogun State").
export const NIGERIA_HINTS = new Set([
  'lagos', 'abuja', 'fct', 'port harcourt', 'ibadan', 'kano', 'kaduna', 'enugu', 'benin city', 'ilorin', 'owerri', 'uyo',
  'abeokuta', 'jos', 'akure', 'abakaliki', 'aba', 'lekki', 'ikeja', 'ikorodu', 'ogun', 'rivers', 'delta', 'oyo', 'ondo',
  'osun', 'ekiti', 'akwa ibom', 'anambra', 'imo', 'edo', 'kwara', 'plateau', 'abia', 'kogi', 'bayelsa', 'cross river',
  'benue', 'nasarawa', 'sokoto', 'kebbi', 'zamfara', 'katsina', 'borno', 'yobe', 'adamawa', 'taraba', 'gombe', 'bauchi',
  'jigawa', 'ebonyi', 'niger state', 'warri', 'calabar', 'asaba', 'onitsha', 'awka', 'umuahia', 'osogbo', 'ado ekiti',
  'minna', 'lokoja', 'makurdi', 'maiduguri', 'yola', 'surulere', 'yaba', 'ikoyi', 'victoria island', 'ajah', 'festac',
  'maitama', 'wuse', 'gwarinpa', 'mushin', 'oshodi', 'apapa', 'ikotun', 'magodo',
]);

// Exact canonical name only ('Nigeria', 'Global') — what the bot stores when a user picks a country.
export function canonicalExact(input: string | null | undefined): string | null {
  const t = (input || '').trim().toLowerCase();
  if (!t) return null;
  if (t === 'global') return GLOBAL_TAG;
  return KNOWN_COUNTRIES.find((c) => c.toLowerCase() === t) || null;
}

// Free-text (typed input / profile location parts): also accepts aliases like "UK", "UAE", "Remote".
export function canonicalCountry(input: string | null | undefined): string | null {
  const t = (input || '').trim().toLowerCase();
  if (!t) return null;
  return COUNTRY_ALIASES[t] || canonicalExact(t);
}

// One country per user: an explicit pick in preferred_locations wins; otherwise the country in
// their JobMeter profile location ("Lagos, Nigeria" → Nigeria). null = unknown.
export function resolveCountry(o: { cv_location?: string | null; preferred_locations?: string[] | null }): string | null {
  const prefs = o.preferred_locations || [];
  for (let i = prefs.length - 1; i >= 0; i--) {
    const c = canonicalExact(prefs[i]);
    if (c) return c;
  }
  const parts = (o.cv_location || '').split(',').map((s) => s.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const c = canonicalCountry(parts[i]);
    if (c) return c;
  }
  for (const p of [...parts, ...prefs]) {
    if (NIGERIA_HINTS.has(p.trim().toLowerCase().replace(/\s+state$/, ''))) return 'Nigeria';
  }
  return null;
}

// Every jobs.country tag a user in `country` should see:
//  - 'Global'                          → global remote only, nothing else
//  - a specific country (e.g. Nigeria) → that country + 'Global' + only ITS OWN region(s) (e.g. 'Africa')
export function acceptedTags(country: string): string[] {
  if (country === GLOBAL_TAG) return [GLOBAL_TAG];
  return [country, GLOBAL_TAG, ...(COUNTRY_REGIONS[country] || [])];
}

// PostgREST `or` filter on jobs.country for a resolved country.
export function countryOrFilter(country: string): string {
  return acceptedTags(country).map((t) => `country.cs.{${t}}`).join(',');
}

// Telegram DMs respect the user's country. Unknown country (null) = no restriction.
export function jobAllowedForCountry(job: { country?: string[] | null; job_type?: string | null }, country: string | null): boolean {
  if (!country) return true;
  const accepted = new Set(acceptedTags(country).map((t) => t.toLowerCase()));
  const arr: string[] = Array.isArray(job.country) ? job.country : [];
  if (!arr.some((c) => accepted.has(String(c).toLowerCase()))) return false;
  if (country === GLOBAL_TAG) return /remote/i.test(job.job_type || '');
  return true;
}

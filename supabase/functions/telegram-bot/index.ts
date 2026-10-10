// supabase/functions/telegram-bot/index.ts
//
// Telegram bot webhook handler for JobMeter.
// Handles: /start onboarding, login (email+password via Supabase Auth),
// signup via CV upload (parses CV, asks sector + a password the user
// chooses), a main menu, sector-based job browsing (posts the same
// `social` copy used for the job-posting channel), My applications,
// My profile, and deep-link payloads (e.g. /start browse).
//
// Morning digest (top 3 jobs by sector, ~8am) is a separate function:
// supabase/functions/telegram-daily-digest — triggered by an external
// cron (cron-job.org), not by this webhook.
//
// Set up once deployed:
//   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
//     -d "url=https://<project-ref>.supabase.co/functions/v1/telegram-bot"
//
// Uses the TELEGRAM_BOT_TOKEN_2 secret (not TELEGRAM_BOT_TOKEN, which is the
// separate bot used for the job-posting channel).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = 'https://www.jobmeter.app';
const RECENT_DAYS = 14; // "recent" jobs window for browsing/digest

// ─── Sectors (matches the web app's filter list) ────────────────────────────

const SECTORS = [
  'Information Technology & Software',
  'Engineering & Manufacturing',
  'Finance & Banking',
  'Healthcare & Medical',
  'Education & Training',
  'Sales & Marketing',
  'Human Resources & Recruitment',
  'Customer Service & Support',
  'Media Advertising & Communications',
  'Design Arts & Creative',
  'Construction & Real Estate',
  'Logistics Transport & Supply Chain',
  'Agriculture & Agribusiness',
  'Energy & Utilities',
  'Legal & Compliance',
  'Government & Public Administration',
  'Retail & E-commerce',
  'Hospitality & Tourism',
  'Science & Research',
  'Security & Defense',
  'Telecommunications',
  'Nonprofit & NGO',
  'Environment & Sustainability',
  'Product Management & Operations',
  'Data & Analytics',
];

// Where to look next once a sector's recent jobs run out.
const RELATED_SECTORS: Record<string, string[]> = {
  'Information Technology & Software': ['Data & Analytics', 'Telecommunications'],
  'Data & Analytics': ['Information Technology & Software', 'Product Management & Operations'],
  'Engineering & Manufacturing': ['Construction & Real Estate', 'Energy & Utilities'],
  'Finance & Banking': ['Legal & Compliance', 'Data & Analytics'],
  'Healthcare & Medical': ['Science & Research'],
  'Education & Training': ['Nonprofit & NGO'],
  'Sales & Marketing': ['Media Advertising & Communications', 'Retail & E-commerce'],
  'Human Resources & Recruitment': ['Legal & Compliance', 'Customer Service & Support'],
  'Customer Service & Support': ['Sales & Marketing', 'Retail & E-commerce'],
  'Media Advertising & Communications': ['Sales & Marketing', 'Design Arts & Creative'],
  'Design Arts & Creative': ['Media Advertising & Communications'],
  'Construction & Real Estate': ['Engineering & Manufacturing'],
  'Logistics Transport & Supply Chain': ['Engineering & Manufacturing', 'Retail & E-commerce'],
  'Agriculture & Agribusiness': ['Environment & Sustainability'],
  'Energy & Utilities': ['Engineering & Manufacturing', 'Environment & Sustainability'],
  'Legal & Compliance': ['Finance & Banking', 'Government & Public Administration'],
  'Government & Public Administration': ['Legal & Compliance', 'Nonprofit & NGO'],
  'Retail & E-commerce': ['Sales & Marketing', 'Customer Service & Support'],
  'Hospitality & Tourism': ['Customer Service & Support'],
  'Science & Research': ['Healthcare & Medical', 'Engineering & Manufacturing'],
  'Security & Defense': ['Government & Public Administration'],
  'Telecommunications': ['Information Technology & Software', 'Engineering & Manufacturing'],
  'Nonprofit & NGO': ['Education & Training', 'Government & Public Administration'],
  'Environment & Sustainability': ['Agriculture & Agribusiness', 'Energy & Utilities'],
  'Product Management & Operations': ['Information Technology & Software'],
};

function sectorTerms(sector: string): string[] {
  return sector.split(/[,&]/).map((s) => s.trim()).filter((s) => s.length > 2);
}

function sectorOrFilter(sector: string): string {
  return sectorTerms(sector)
    .map((t) => `sector.ilike.%${t.replace(/[%_,()]/g, '')}%`)
    .join(',');
}

// ─── Telegram API helpers ───────────────────────────────────────────────────

function botApi(method: string) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN_2');
  return `https://api.telegram.org/bot${token}/${method}`;
}

async function tgCall(method: string, payload: Record<string, unknown>) {
  const res = await fetch(botApi(method), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!data?.ok) console.error(`Telegram ${method} failed:`, data);
  return data;
}

function sendMessage(chatId: number, text: string, extra: Record<string, unknown> = {}) {
  return tgCall('sendMessage', { chat_id: chatId, text, parse_mode: 'Markdown', ...extra });
}

function deleteMessage(chatId: number, messageId: number) {
  return tgCall('deleteMessage', { chat_id: chatId, message_id: messageId });
}

function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return tgCall('answerCallbackQuery', { callback_query_id: callbackQueryId, text });
}

async function getFileUrl(fileId: string): Promise<string | null> {
  const data = await tgCall('getFile', { file_id: fileId });
  if (!data?.ok) return null;
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN_2');
  return `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
}

// Inline keyboards
const kbAccountChoice = {
  inline_keyboard: [
    [{ text: '🔑 I have an account — Log in', callback_data: 'login' }],
    [{ text: '📄 New here — Sign up with my CV', callback_data: 'signup' }],
    [{ text: '⚡ Just get job alerts (no CV needed)', callback_data: 'quick_setup' }],
  ],
};

const kbMainMenu = {
  keyboard: [
    [{ text: '🔍 Browse jobs' }, { text: '🏢 My sector' }],
    [{ text: '🎯 My role' }, { text: '📋 My applications' }],
    [{ text: '👤 My profile' }, { text: '🌍 Remote Jobs' }],
    [{ text: '🧰 Tools' }, { text: '📝 CV Templates' }],
    [{ text: '📍 My country' }],
  ],
  resize_keyboard: true,
};

// All 10 tools in one list — plain outbound links, no auth/state needed,
// same idea as the sector picker's grid layout.
const ALL_TOOLS: { name: string; url: string }[] = [
  { name: '🎯 Role Finder', url: `${SITE_URL}/tools/role-finder` },
  { name: '📄 ATS CV Review', url: `${SITE_URL}/tools/ats-review` },
  { name: '🎤 Interview Practice', url: `${SITE_URL}/tools/interview` },
  { name: '🧭 Career Coach', url: `${SITE_URL}/tools/career` },
  { name: '🧠 Aptitude Quiz', url: `${SITE_URL}/tools/quiz` },
  { name: '🚩 Scam Checker', url: `${SITE_URL}/tools/scam-checker` },
  { name: '🎓 Internship Finder', url: `${SITE_URL}/tools/internship-finder` },
  { name: '👨‍🎓 Graduate Trainee Finder', url: `${SITE_URL}/tools/graduate-trainee-finder` },
  { name: '🌱 Entry-Level Finder', url: `${SITE_URL}/tools/entry-level-finder` },
  { name: '🏠 Remote Jobs Finder', url: `${SITE_URL}/tools/remote-jobs-finder` },
];

function linkGridKeyboard(items: { name: string; url: string }[]) {
  const rows: { text: string; url: string }[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    const row = [{ text: items[i].name, url: items[i].url }];
    if (items[i + 1]) row.push({ text: items[i + 1].name, url: items[i + 1].url });
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

// ─── Country resolution (kept in sync across telegram-bot, telegram-daily-digest, daily-job-notifications) ───
// "Global" = remote jobs that aren't tied to one country: tagged Global or a broad region.
const REGION_TAGS = ['Global', 'Africa', 'LATAM', 'Eastern Europe', 'Europe', 'Middle East', 'Asia'];
const KNOWN_COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Ethiopia', 'Morocco', 'Sierra Leone', 'Tanzania', 'Uganda',
  'Rwanda', 'Senegal', 'Cameroon', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Algeria', 'Tunisia', 'Ivory Coast',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Kuwait', 'Bahrain', 'Jordan', 'Turkey',
  'United Kingdom', 'United States', 'Canada', 'Australia', 'New Zealand', 'Ireland', 'Germany', 'France', 'Netherlands',
  'Spain', 'Italy', 'Portugal', 'Poland', 'Sweden', 'Norway', 'Switzerland',
  'India', 'Pakistan', 'Bangladesh', 'Nepal', 'Philippines', 'Singapore', 'Malaysia', 'Indonesia', 'China', 'Japan',
  'Mexico', 'Argentina', 'Brazil', 'Colombia', 'Chile',
];
const COUNTRY_ALIASES: Record<string, string> = {
  uk: 'United Kingdom', 'great britain': 'United Kingdom', england: 'United Kingdom', britain: 'United Kingdom',
  usa: 'United States', us: 'United States', america: 'United States', 'united states of america': 'United States',
  uae: 'United Arab Emirates', dubai: 'United Arab Emirates', 'abu dhabi': 'United Arab Emirates',
  "cote d'ivoire": 'Ivory Coast', ksa: 'Saudi Arabia',
  remote: 'Global', global: 'Global', worldwide: 'Global', anywhere: 'Global',
};
// Nigerian cities/states, for profile locations written without the country ("Lagos", "Ogun State").
const NIGERIA_HINTS = new Set([
  'lagos', 'abuja', 'fct', 'port harcourt', 'ibadan', 'kano', 'kaduna', 'enugu', 'benin city', 'ilorin', 'owerri', 'uyo',
  'abeokuta', 'jos', 'akure', 'abakaliki', 'aba', 'lekki', 'ikeja', 'ikorodu', 'ogun', 'rivers', 'delta', 'oyo', 'ondo',
  'osun', 'ekiti', 'akwa ibom', 'anambra', 'imo', 'edo', 'kwara', 'plateau', 'abia', 'kogi', 'bayelsa', 'cross river',
  'benue', 'nasarawa', 'sokoto', 'kebbi', 'zamfara', 'katsina', 'borno', 'yobe', 'adamawa', 'taraba', 'gombe', 'bauchi',
  'jigawa', 'ebonyi',
]);

// Exact canonical name only ('Nigeria', 'Global') — what the bot stores when a user picks a country.
function canonicalExact(input: string | null | undefined): string | null {
  const t = (input || '').trim().toLowerCase();
  if (!t) return null;
  if (t === 'global') return 'Global';
  return KNOWN_COUNTRIES.find((c) => c.toLowerCase() === t) || null;
}

// Free-text (typed input / profile location parts): also accepts aliases like "UK", "UAE", "Remote".
function canonicalCountry(input: string | null | undefined): string | null {
  const t = (input || '').trim().toLowerCase();
  if (!t) return null;
  return COUNTRY_ALIASES[t] || canonicalExact(t);
}

// One country per user: an explicit pick in preferred_locations wins; otherwise the country in
// their JobMeter profile location ("Lagos, Nigeria" → Nigeria). null = unknown.
function resolveCountry(o: { cv_location?: string | null; preferred_locations?: string[] | null }): string | null {
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

// PostgREST `or` filter on jobs.country for a resolved country.
function countryOrFilter(country: string): string {
  const parts = REGION_TAGS.map((t) => `country.cs.{${t}}`);
  if (country !== 'Global') parts.unshift(`country.cs.{${country}}`);
  return parts.join(',');
}

// ─── Country picker ──────────────────────────────────────────────────────────
// Quick-pick buttons. `value` is the exact string stored / used against jobs.country[].
const COUNTRY_OPTIONS: { label: string; value: string }[] = [
  { label: '🇳🇬 Nigeria', value: 'Nigeria' },
  { label: '🇬🇭 Ghana', value: 'Ghana' },
  { label: '🇰🇪 Kenya', value: 'Kenya' },
  { label: '🇿🇦 South Africa', value: 'South Africa' },
  { label: '🇦🇪 UAE', value: 'United Arab Emirates' },
  { label: '🇬🇧 United Kingdom', value: 'United Kingdom' },
  { label: '🇺🇸 United States', value: 'United States' },
  { label: '🇨🇦 Canada', value: 'Canada' },
  { label: '🌍 Global remote only', value: 'Global' },
];

function countryKeyboard(context: 'onboard' | 'quick' | 'change') {
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < COUNTRY_OPTIONS.length; i += 2) {
    const row = [{ text: COUNTRY_OPTIONS[i].label, callback_data: `cty:${i}:${context}` }];
    if (COUNTRY_OPTIONS[i + 1]) row.push({ text: COUNTRY_OPTIONS[i + 1].label, callback_data: `cty:${i + 1}:${context}` });
    rows.push(row);
  }
  rows.push([{ text: '✏️ Type my country', callback_data: `cty:other:${context}` }]);
  return { inline_keyboard: rows };
}

function countryPhrase(country: string): string {
  return country === 'Global' ? 'remote jobs open to anyone worldwide' : `jobs in *${country}* (plus global remote roles)`;
}

function sectorKeyboard(context: 'onboard' | 'browse' | 'change' | 'quick') {
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < SECTORS.length; i += 2) {
    const row = [{ text: SECTORS[i], callback_data: `sec:${i}:${context}` }];
    if (SECTORS[i + 1]) row.push({ text: SECTORS[i + 1], callback_data: `sec:${i + 1}:${context}` });
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

// Common roles per sector, shown as quick-pick suggestions. Not exhaustive —
// "Type my own" always covers anything not listed.
const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Information Technology & Software': ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Data Analyst', 'IT Support Specialist'],
  'Engineering & Manufacturing': ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Production Supervisor', 'Quality Control Engineer'],
  'Finance & Banking': ['Accountant', 'Financial Analyst', 'Bank Teller', 'Auditor', 'Investment Analyst'],
  'Healthcare & Medical': ['Nurse', 'Doctor', 'Pharmacist', 'Medical Lab Scientist', 'Healthcare Administrator'],
  'Education & Training': ['Teacher', 'Lecturer', 'Curriculum Developer', 'Training Coordinator', 'School Administrator'],
  'Sales & Marketing': ['Sales Executive', 'Marketing Manager', 'Business Development Officer', 'Digital Marketer', 'Brand Manager'],
  'Human Resources & Recruitment': ['HR Officer', 'Recruiter', 'HR Manager', 'Talent Acquisition Specialist', 'Payroll Officer'],
  'Customer Service & Support': ['Customer Service Representative', 'Call Center Agent', 'Support Specialist', 'Client Relations Officer'],
  'Media Advertising & Communications': ['Content Writer', 'Social Media Manager', 'PR Officer', 'Copywriter', 'Communications Specialist'],
  'Design Arts & Creative': ['Graphic Designer', 'UI/UX Designer', 'Video Editor', 'Illustrator', 'Creative Director'],
  'Construction & Real Estate': ['Site Engineer', 'Quantity Surveyor', 'Architect', 'Real Estate Agent', 'Project Manager'],
  'Logistics Transport & Supply Chain': ['Logistics Coordinator', 'Supply Chain Analyst', 'Warehouse Manager', 'Procurement Officer', 'Driver'],
  'Agriculture & Agribusiness': ['Agronomist', 'Farm Manager', 'Agricultural Extension Officer', 'Livestock Manager'],
  'Energy & Utilities': ['Petroleum Engineer', 'Power Systems Engineer', 'Solar Technician', 'HSE Officer'],
  'Legal & Compliance': ['Lawyer', 'Legal Officer', 'Compliance Officer', 'Paralegal', 'Company Secretary'],
  'Government & Public Administration': ['Civil Servant', 'Policy Analyst', 'Public Relations Officer', 'Administrative Officer'],
  'Retail & E-commerce': ['Store Manager', 'Sales Associate', 'E-commerce Manager', 'Inventory Manager'],
  'Hospitality & Tourism': ['Hotel Manager', 'Chef', 'Front Desk Officer', 'Tour Guide', 'Event Planner'],
  'Science & Research': ['Research Scientist', 'Lab Technician', 'Data Scientist', 'Research Analyst'],
  'Security & Defense': ['Security Officer', 'Risk Analyst', 'Military Officer', 'Surveillance Officer'],
  'Telecommunications': ['Network Engineer', 'Telecoms Technician', 'RF Engineer', 'Field Engineer'],
  'Nonprofit & NGO': ['Program Officer', 'Project Coordinator', 'M&E Officer', 'Grants Manager'],
  'Environment & Sustainability': ['Environmental Officer', 'Sustainability Analyst', 'HSE Officer', 'Conservation Officer'],
  'Product Management & Operations': ['Product Manager', 'Operations Manager', 'Business Analyst', 'Project Manager'],
  'Data & Analytics': ['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst', 'Data Engineer'],
};

function roleKeyboard(sector: string, context: 'onboard' | 'change' | 'quick') {
  const roles = ROLE_SUGGESTIONS[sector] || [];
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < roles.length; i += 2) {
    const row = [{ text: roles[i], callback_data: `role:${context}:${roles[i]}` }];
    if (roles[i + 1]) row.push({ text: roles[i + 1], callback_data: `role:${context}:${roles[i + 1]}` });
    rows.push(row);
  }
  rows.push([{ text: '✏️ Type my own role(s)', callback_data: `role_custom:${context}` }]);
  if (context === 'change') rows.push([{ text: '⏭️ Keep current', callback_data: 'role_skip' }]);
  return { inline_keyboard: rows };
}

// ─── State helpers ───────────────────────────────────────────────────────────
// telegram_users.state is a small JSON state machine: { step, temp }
// since edge functions are stateless between webhook calls.

type BotState = { step?: string; temp?: Record<string, any> };

async function getOrCreateTelegramUser(supabase: any, chatId: number, from: any) {
  const { data } = await supabase
    .from('telegram_users')
    .select('*')
    .eq('chat_id', chatId)
    .maybeSingle();

  if (data) return data;

  const { data: created } = await supabase
    .from('telegram_users')
    .insert({
      chat_id: chatId,
      telegram_username: from?.username || null,
      telegram_first_name: from?.first_name || null,
      state: {},
    })
    .select('*')
    .single();

  return created;
}

async function setState(supabase: any, chatId: number, state: BotState) {
  await supabase.from('telegram_users').update({ state }).eq('chat_id', chatId);
}

async function linkAccount(supabase: any, chatId: number, userId: string) {
  await supabase
    .from('telegram_users')
    .update({ user_id: userId, linked_at: new Date().toISOString(), state: {} })
    .eq('chat_id', chatId);
}

// ─── Validation ──────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Job formatting & fetching ──────────────────────────────────────────────

// Build the same [country]/[slug] job URL structure used on the web app
function buildJobUrl(job: { slug?: string | null; id: string; country?: string[] | null; location?: any }): string {
  const countryArr: string[] = Array.isArray(job.country) ? job.country : [];
  const first = countryArr.find((c) => c && c.toLowerCase() !== 'global');
  let countrySlug = 'global';
  if (first) {
    countrySlug = first.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  } else if (job.location && typeof job.location === 'object') {
    const c = job.location.country || job.location.countries?.[0];
    if (c && c.toLowerCase() !== 'global') {
      countrySlug = c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
  }
  return `${SITE_URL}/jobs/${countrySlug}/${job.slug || job.id}`;
}

function formatJobMessage(job: any): string {
  let body = job.social && job.social.trim() ? job.social.trim() : buildFallbackJobText(job);

  // Drop the trailing "Apply: <url>" line — we already show a tap-through button below.
  body = body.replace(/\n*apply:\s*https?:\/\/\S+\s*$/i, '').trim();

  const lines = body.split('\n');
  if (lines[0] && /^hiring:/i.test(lines[0])) {
    lines[0] = `💼 *${lines[0].replace(/^hiring:\s*/i, '').trim()}*`;
  }
  if (lines[1] && /^location:/i.test(lines[1])) {
    lines[1] = `📍 ${lines[1].replace(/^location:\s*/i, '').trim()}`;
  }
  return lines.join('\n');
}

function buildFallbackJobText(job: any): string {
  const companyName = (job.company && typeof job.company === 'object' && job.company.name) || 'Confidential employer';
  const locationParts: string[] = [];
  if (job.location && typeof job.location === 'object') {
    if (job.location.city) locationParts.push(job.location.city);
    if (job.location.state) locationParts.push(job.location.state);
  }
  if (Array.isArray(job.country) && job.country[0]) locationParts.push(job.country[0]);
  const locationStr = locationParts.join(', ') || 'Remote';
  return `Hiring: ${job.title}\nLocation: ${locationStr}\nCompany: ${companyName}`;
}

const JOB_SELECT = 'id, title, slug, company, country, location, sector, role, social, posted_date';

function roleOrFilter(roles: string[]): string {
  return roles
    .slice(0, 6)
    .map((r) => r.replace(/[%_,()]/g, '').trim())
    .filter((r) => r.length > 2)
    .map((r) => `role.ilike.%${r}%`)
    .join(',');
}

// Fetches a generous candidate pool for one filter tier (role OR sector), newest-first,
// active only, excluding anything already shown. When the user has a country, only that
// country's jobs plus global remote roles are returned.
async function queryCandidates(supabase: any, orFilter: string, excludeIds: string[], recentSinceISO: string, fetchSize: number, country: string | null = null) {
  if (!orFilter) return [];
  let query = supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('status', 'active')
    .or(orFilter)
    .gte('posted_date', recentSinceISO)
    .order('posted_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(fetchSize);

  if (country) {
    query = query.or(countryOrFilter(country));
    if (country === 'Global') query = query.ilike('job_type', 'remote');
  }

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('queryCandidates error:', error);
    return [];
  }
  return data || [];
}

type OnboardingBrief = { sector: string; targetRoles: string[]; country: string | null };

async function getOnboardingBrief(supabase: any, userId: string): Promise<OnboardingBrief | null> {
  const { data } = await supabase
    .from('onboarding_data')
    .select('sector, target_roles, cv_location, preferred_locations')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) return null;
  const sector = data.sector && data.sector !== 'null' ? data.sector : null;
  if (!sector) return null;
  return {
    sector,
    targetRoles: Array.isArray(data.target_roles) ? data.target_roles : [],
    country: resolveCountry({ cv_location: data.cv_location, preferred_locations: data.preferred_locations }),
  };
}

async function getUserSector(supabase: any, userId: string): Promise<string | null> {
  const brief = await getOnboardingBrief(supabase, userId);
  return brief?.sector || null;
}

/**
 * Tiered job fetch: role match first (highest intent), then the user's sector,
 * then related sectors — each tier newest-first, active-only, never repeating a
 * job already shown. If the user has a country, every tier is limited to that
 * country plus global remote roles.
 */
async function fetchTieredJobs(
  supabase: any,
  brief: OnboardingBrief,
  excludeIds: string[],
  limit = 3
) {
  const recentSinceISO = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tiers: { label: string; or: string }[] = [];
  const roleTerms = roleOrFilter(brief.targetRoles);
  if (roleTerms) tiers.push({ label: 'role', or: roleTerms });
  tiers.push({ label: 'sector', or: sectorOrFilter(brief.sector) });
  for (const rs of RELATED_SECTORS[brief.sector] || []) {
    tiers.push({ label: `related:${rs}`, or: sectorOrFilter(rs) });
  }

  let collected: any[] = [];
  let usedTier: string | null = null;

  for (const tier of tiers) {
    if (collected.length >= limit) break;
    const need = limit - collected.length;
    const currentExclude = [...excludeIds, ...collected.map((j) => j.id)];
    const picked = await queryCandidates(supabase, tier.or, currentExclude, recentSinceISO, need, brief.country);

    if (picked.length > 0) {
      collected = [...collected, ...picked];
      if (!usedTier) usedTier = tier.label;
      else if (usedTier !== tier.label && !usedTier.includes('+more')) usedTier = `${usedTier}+more`;
    }
  }

  return { jobs: collected, usedTier };
}

async function sendJobBatch(supabase: any, chatId: number, userId: string, shownIds: string[]) {
  const brief = await getOnboardingBrief(supabase, userId);
  if (!brief) {
    await sendMessage(chatId, `First, what sector are you interested in?`, { reply_markup: sectorKeyboard('browse') });
    return;
  }

  const { jobs, usedTier } = await fetchTieredJobs(supabase, brief, shownIds, 3);

  if (jobs.length === 0) {
    await sendMessage(
      chatId,
      `That's all the recent jobs I have matching your role and *${brief.sector}*${brief.country ? (brief.country === 'Global' ? ' (global remote)' : ` in *${brief.country}*`) : ''} right now. I'll send fresh ones every morning.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏢 Try a different sector', callback_data: 'change_sector' }],
            [{ text: '📍 Change country', callback_data: 'change_country' }],
            [{ text: '🌐 Browse all jobs', url: `${SITE_URL}/jobs` }],
          ],
        },
      }
    );
    return;
  }

  if (usedTier && usedTier.startsWith('related:')) {
    const relatedSector = usedTier.split(':')[1].split('+')[0];
    await sendMessage(chatId, `That's all the recent *${brief.sector}* jobs — here's a few from *${relatedSector}* too:`);
  } else if (usedTier === 'sector' && brief.targetRoles.length > 0) {
    await sendMessage(chatId, `No fresh matches for your exact role right now — here's what's new in *${brief.sector}*:`);
  }

  for (const job of jobs) {
    await sendMessage(chatId, formatJobMessage(job), {
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: '✅ View & apply', url: buildJobUrl(job) }]] },
    });
  }

  const newShownIds = [...shownIds, ...jobs.map((j: any) => j.id)].slice(-100); // cap growth
  await setState(supabase, chatId, { step: 'browsing', temp: { sector: brief.sector, shownIds: newShownIds } });

  await sendMessage(chatId, `Want more?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➡️ More jobs', callback_data: 'more_jobs' }],
        [{ text: '🏢 Change sector', callback_data: 'change_sector' }],
      ],
    },
  });
}

// Continuing a browse session (same sector) picks up where it left off instead of
// restarting from the freshest 3 every time — that was showing "the same jobs" on repeat taps.
async function browseJobs(supabase: any, chatId: number, userId: string, tgUser?: any) {
  const sector = await getUserSector(supabase, userId);
  if (!sector) {
    await sendMessage(chatId, `First, what sector are you interested in?`, { reply_markup: sectorKeyboard('browse') });
    return;
  }
  const state = (tgUser?.state || {}) as BotState;
  const shownIds = state.step === 'browsing' && state.temp?.sector === sector ? state.temp?.shownIds || [] : [];
  await sendJobBatch(supabase, chatId, userId, shownIds);
}

// ─── Remote jobs ─────────────────────────────────────────────────────────────
// Country-first, then Global-tagged remote roles, then the usual
// globally-remote-friendly markets (US/UK), then any remaining remote job.

async function getUserCountryOnly(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('onboarding_data')
    .select('cv_location, preferred_locations')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) return null;
  return resolveCountry({ cv_location: data.cv_location, preferred_locations: data.preferred_locations });
}

async function queryRemoteCandidates(supabase: any, countryOrFilter: string | null, excludeIds: string[], recentSinceISO: string, fetchSize: number) {
  let query = supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('status', 'active')
    .ilike('job_type', 'remote')
    .gte('posted_date', recentSinceISO)
    .order('posted_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(fetchSize);

  if (countryOrFilter) query = query.or(countryOrFilter);
  if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`);

  const { data, error } = await query;
  if (error) {
    console.error('queryRemoteCandidates error:', error);
    return [];
  }
  return data || [];
}

async function fetchRemoteJobs(supabase: any, country: string | null, excludeIds: string[], limit = 3) {
  const recentSinceISO = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tiers: (string | null)[] = [];
  if (country) {
    // Known country: that country's remote roles, then global remote roles — nothing else.
    if (country !== 'Global') tiers.push(`country.cs.{${country}}`);
    tiers.push(REGION_TAGS.map((t) => `country.cs.{${t}}`).join(','));
  } else {
    tiers.push(`country.cs.{Global}`);
    tiers.push(`country.cs.{United States},country.cs.{United Kingdom}`);
    tiers.push(null); // any remote job, no country constraint
  }

  let collected: any[] = [];
  for (const tier of tiers) {
    if (collected.length >= limit) break;
    const need = limit - collected.length;
    const exclude = [...excludeIds, ...collected.map((j) => j.id)];
    const more = await queryRemoteCandidates(supabase, tier, exclude, recentSinceISO, need);
    if (more.length > 0) collected = [...collected, ...more];
  }
  return collected;
}

async function sendRemoteJobBatch(supabase: any, chatId: number, userId: string, shownIds: string[]) {
  const country = await getUserCountryOnly(supabase, userId);
  const jobs = await fetchRemoteJobs(supabase, country, shownIds, 3);

  if (jobs.length === 0) {
    await sendMessage(
      chatId,
      `That's all the recent remote jobs I have right now. Check back soon, or browse everything on the web.`,
      { reply_markup: { inline_keyboard: [[{ text: '🌐 Browse all jobs', url: `${SITE_URL}/jobs` }]] } }
    );
    return;
  }

  for (const job of jobs) {
    await sendMessage(chatId, formatJobMessage(job), {
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: '✅ View & apply', url: buildJobUrl(job) }]] },
    });
  }

  const newShownIds = [...shownIds, ...jobs.map((j: any) => j.id)].slice(-100);
  await setState(supabase, chatId, { step: 'browsing_remote', temp: { shownIds: newShownIds } });

  await sendMessage(chatId, `Want more?`, {
    reply_markup: { inline_keyboard: [[{ text: '➡️ More remote jobs', callback_data: 'more_remote' }]] },
  });
}

// ─── Flows ───────────────────────────────────────────────────────────────────

async function handleStart(supabase: any, chatId: number, tgUser: any) {
  if (tgUser.linked_at) {
    await sendMessage(chatId, `Welcome back! 👋\n\nWhat would you like to do?`, { reply_markup: kbMainMenu });
    return;
  }
  await setState(supabase, chatId, { step: 'idle' });
  await sendMessage(
    chatId,
    `👋 Welcome to *JobMeter* — I send fresh jobs for your role straight to this chat *every morning*, and ping you the moment a great match appears.\n\nDo you already have a JobMeter account?`,
    { reply_markup: kbAccountChoice }
  );
}

async function startLogin(supabase: any, chatId: number) {
  await setState(supabase, chatId, { step: 'login_email' });
  await sendMessage(chatId, `What's the email on your JobMeter account?`);
}

async function handleLoginEmail(supabase: any, chatId: number, text: string) {
  const email = text.trim().toLowerCase();
  if (!isValidEmail(email)) {
    await sendMessage(chatId, `That doesn't look like a valid email — try again.`);
    return;
  }
  await setState(supabase, chatId, { step: 'login_password', temp: { email } });
  await sendMessage(chatId, `Thanks. Now send your password.\n\n_I'll delete that message right after reading it._`);
}

async function handleLoginPassword(
  supabase: any,
  anonClient: any,
  chatId: number,
  messageId: number,
  text: string,
  state: BotState
) {
  const email = state.temp?.email;
  const password = text;

  await deleteMessage(chatId, messageId);

  if (!email) {
    await setState(supabase, chatId, { step: 'idle' });
    await sendMessage(chatId, `Something went wrong — let's start over. Send /start.`);
    return;
  }

  const { data, error } = await anonClient.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    await sendMessage(chatId, `❌ Email or password didn't match. Try again, or send /start to restart.`);
    await setState(supabase, chatId, { step: 'login_email' });
    return;
  }

  await linkAccount(supabase, chatId, data.user.id);

  // Existing JobMeter users usually already have a country on their profile — use it, don't re-ask.
  const { data: ob } = await supabase
    .from('onboarding_data')
    .select('cv_location, preferred_locations')
    .eq('user_id', data.user.id)
    .maybeSingle();
  const profileCountry = ob ? resolveCountry({ cv_location: ob.cv_location, preferred_locations: ob.preferred_locations }) : null;

  if (profileCountry) {
    await sendMessage(
      chatId,
      `✅ Logged in! Your Telegram is now linked to your JobMeter account.\n\n📍 I'll send you fresh ${countryPhrase(profileCountry)} every morning, based on your JobMeter profile — plus an instant ping when something is a 50%+ match. Wrong country? Tap *📍 My country* to change it.`,
      { reply_markup: kbMainMenu }
    );
  } else {
    await sendMessage(
      chatId,
      `✅ Logged in! Your Telegram is now linked to your JobMeter account.\n\nI'll send you fresh jobs every morning and ping you when something is a 50%+ match. One thing first — where do you want to work?`,
      { reply_markup: kbMainMenu }
    );
    await sendMessage(chatId, `Pick your country, or global remote:`, { reply_markup: countryKeyboard('change') });
  }
}

async function startSignup(supabase: any, chatId: number) {
  await setState(supabase, chatId, { step: 'signup_cv' });
  await sendMessage(
    chatId,
    `Send me your CV as a file (PDF, DOC, or DOCX) and I'll pull your details straight from it — no forms to fill.`
  );
}

async function handleSignupCv(supabase: any, chatId: number, document: any) {
  const fileName: string = document.file_name || 'cv.pdf';
  const mimeType: string = document.mime_type || 'application/pdf';
  const MAX_SIZE = 8 * 1024 * 1024;

  if (document.file_size && document.file_size > MAX_SIZE) {
    await sendMessage(chatId, `That file's a bit large — please send a CV under 8MB.`);
    return;
  }

  await sendMessage(chatId, `📄 Got it — reading your CV now, one moment...`);

  const fileUrl = await getFileUrl(document.file_id);
  if (!fileUrl) {
    await sendMessage(chatId, `I couldn't download that file — please try sending it again.`);
    return;
  }

  try {
    const fileRes = await fetch(fileUrl);
    const fileBuf = new Uint8Array(await fileRes.arrayBuffer());
    let binary = '';
    for (let i = 0; i < fileBuf.length; i++) binary += String.fromCharCode(fileBuf[i]);
    const base64 = btoa(binary);

    const { data: extractData, error: extractError } = await supabase.functions.invoke('extract-cv-text', {
      body: { file: base64, mimeType, fileName },
    });
    if (extractError || !extractData?.text) {
      throw new Error(extractError?.message || 'Text extraction returned nothing');
    }

    const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv-text', {
      body: { text: extractData.text },
    });
    if (parseError || !parseData?.parsed) {
      throw new Error(parseError?.message || 'CV parsing returned nothing');
    }

    const cv = parseData.parsed;

    await setState(supabase, chatId, {
      step: cv.email && isValidEmail(cv.email) ? 'signup_confirm_email' : 'signup_email',
      temp: { cv, cvText: extractData.text, fileName, mimeType, fileSize: document.file_size || null },
    });

    if (cv.email && isValidEmail(cv.email)) {
      await sendMessage(
        chatId,
        `Nice, got your CV${cv.fullName ? ` — hi ${cv.fullName.split(' ')[0]}!` : '!'} 👋\n\nI found this email on it: *${cv.email}*\n\nUse this to create your account?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: `✅ Yes, use ${cv.email}`, callback_data: 'use_cv_email' }],
              [{ text: '✏️ Use a different email', callback_data: 'other_email' }],
            ],
          },
        }
      );
    } else {
      await sendMessage(chatId, `Nice, got your CV! 👋 What email should I create your account with?`);
    }
  } catch (e) {
    console.error('CV parsing error:', e);
    await sendMessage(chatId, `Sorry, I had trouble reading that CV. Please try another file, or send /start to try again.`);
    await setState(supabase, chatId, { step: 'idle' });
  }
}

// After email is confirmed, ask for their sector before creating the account
async function askSignupSector(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'signup_sector', temp });
  await sendMessage(chatId, `Last couple of things. What sector are you looking for work in?`, {
    reply_markup: sectorKeyboard('onboard'),
  });
}

async function askSignupRole(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'signup_role', temp });
  await sendMessage(chatId, `Got it. Any of these your target role? (or type your own)`, {
    reply_markup: roleKeyboard(temp.sector, 'onboard'),
  });
}

// ─── Quick setup (no CV, no email, no password) ─────────────────────────────
// Skips the whole account-creation conversation: pick a sector, pick a role,
// done. A lightweight shadow account is created silently behind the scenes so
// this plugs into the exact same matching/notification pipeline as a full
// signup — the person tracked by their Telegram chat, never sees a password.

function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 16; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

async function startQuickSetup(supabase: any, chatId: number) {
  await setState(supabase, chatId, { step: 'quick_sector' });
  await sendMessage(chatId, `No problem — what sector are you looking for work in?`, {
    reply_markup: sectorKeyboard('quick'),
  });
}

async function askQuickRole(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'quick_role', temp });
  await sendMessage(chatId, `And what role? (or type your own)`, {
    reply_markup: roleKeyboard(temp.sector, 'quick'),
  });
}

async function askQuickCountry(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'quick_country', temp });
  await sendMessage(chatId, `Last one — where do you want to work? I'll send jobs from there, plus remote roles open to anyone worldwide.`, {
    reply_markup: countryKeyboard('quick'),
  });
}

async function askSignupCountry(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'signup_country', temp });
  await sendMessage(chatId, `Where do you want to work? I'll send jobs from there, plus remote roles open to anyone worldwide.`, {
    reply_markup: countryKeyboard('onboard'),
  });
}

async function completeQuickSetup(supabaseAdmin: any, chatId: number, sector: string, roles: string[], country: string) {
  const email = `tg-${chatId}@telegram.jobmeter.local`;
  const password = generateRandomPassword();

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { source: 'telegram_quick_setup' },
  });

  if (createError || !created?.user) {
    console.error('Error creating quick-setup user:', createError);
    await sendMessage(chatId, `Something went wrong setting that up — please try again in a moment.`);
    return;
  }

  const userId = created.user.id;

  await supabaseAdmin.from('onboarding_data').insert({
    user_id: userId,
    sector,
    target_roles: roles,
    preferred_locations: [country],
  });

  await linkAccount(supabaseAdmin, chatId, userId);

  await sendMessage(
    chatId,
    `✅ You're set! Every morning I'll send you fresh *${roles.join(', ')}* ${countryPhrase(country)} in *${sector}* — and I'll ping you right away when something is a 50%+ match.\n\nWant sharper picks? Send your CV anytime and I'll fill in your skills and experience too — no need to start over.`,
    { reply_markup: kbMainMenu }
  );
}

async function applyCountryChoice(supabase: any, chatId: number, tgUser: any, state: BotState, context: string, country: string) {
  if (context === 'onboard') {
    await askSignupPassword(supabase, chatId, { ...state.temp, country });
  } else if (context === 'quick') {
    await completeQuickSetup(supabase, chatId, state.temp?.sector, state.temp?.roles || [], country);
  } else if (!tgUser.linked_at) {
    await sendMessage(chatId, `Send /start first to log in or sign up.`);
  } else {
    await supabase.from('onboarding_data').upsert({ user_id: tgUser.user_id, preferred_locations: [country] }, { onConflict: 'user_id' });
    await setState(supabase, chatId, { step: 'idle' });
    await sendMessage(chatId, `Done — I'll send ${countryPhrase(country)} from now on, including every morning.`, { reply_markup: kbMainMenu });
    await sendJobBatch(supabase, chatId, tgUser.user_id, []);
  }
}

async function askSignupPassword(supabase: any, chatId: number, temp: Record<string, any>) {
  await setState(supabase, chatId, { step: 'signup_password', temp });
  await sendMessage(
    chatId,
    `Almost done! Choose a password for your account (at least 6 characters).\n\n_I'll delete that message right after reading it._`
  );
}

async function completeSignup(
  supabaseAdmin: any,
  chatId: number,
  messageId: number | null,
  password: string,
  temp: Record<string, any>
) {
  if (messageId) await deleteMessage(chatId, messageId);

  if (!password || password.length < 6) {
    await sendMessage(chatId, `That password's too short — please send one with at least 6 characters.`);
    return false;
  }

  const email: string = temp.email;
  const cv = temp.cv || {};
  const sector: string | undefined = temp.sector;
  const chosenRoles: string[] | undefined = temp.roles;

  const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle();
  if (existingProfile) {
    await sendMessage(
      chatId,
      `Looks like *${email}* already has a JobMeter account. Let's log you in instead — send your password.`
    );
    await setState(supabaseAdmin, chatId, { step: 'login_password', temp: { email } });
    return true;
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: cv.fullName || null, source: 'telegram_bot' },
  });

  if (createError || !created?.user) {
    console.error('Error creating user from Telegram signup:', createError);
    await sendMessage(chatId, `Something went wrong creating your account. Please try again in a moment.`);
    return false;
  }

  const userId = created.user.id;

  await supabaseAdmin
    .from('profiles')
    .update({ full_name: cv.fullName || null, phone: cv.phone || null, location: cv.location || null })
    .eq('id', userId);

  await supabaseAdmin.from('onboarding_data').insert({
    user_id: userId,
    cv_name: cv.fullName || null,
    cv_email: cv.email || null,
    cv_phone: cv.phone || null,
    cv_location: cv.location || null,
    cv_summary: cv.summary || null,
    cv_skills: cv.skills || [],
    cv_work_experience: cv.workExperience || [],
    cv_education: cv.education || [],
    cv_projects: cv.projects || [],
    cv_accomplishments: cv.accomplishments || [],
    cv_awards: (cv.awards || []).map((a: any) => a.title || a.name).filter(Boolean),
    cv_certifications: (cv.certifications || []).map((c: any) => c.name).filter(Boolean),
    cv_languages: cv.languages || [],
    cv_interests: cv.interests || [],
    cv_linkedin: cv.linkedin || null,
    cv_github: cv.github || null,
    cv_portfolio: cv.portfolio || null,
    cv_ai_suggested_roles: cv.suggestedRoles || [],
    target_roles: chosenRoles && chosenRoles.length ? chosenRoles : (cv.suggestedRoles || []),
    preferred_locations: temp.country ? [temp.country] : (cv.location ? [cv.location] : []),
    sector: sector || null,
    cv_text: temp.cvText || null,
    cv_file_name: temp.fileName || null,
    cv_file_type: temp.mimeType || null,
    cv_file_size: temp.fileSize || null,
  });

  await linkAccount(supabaseAdmin, chatId, userId);

  await sendMessage(
    chatId,
    `🎉 Account created! I've saved your CV details${sector ? ` and set your sector to *${sector}*` : ''}${chosenRoles && chosenRoles.length ? ` and your target role to *${chosenRoles.join(', ')}*` : ''}${temp.country ? ` and your location to *${temp.country === 'Global' ? 'global remote' : temp.country}*` : ''}. Every morning I'll send you fresh jobs here, and I'll ping you right away when something scores 50%+.`,
    { reply_markup: kbMainMenu }
  );
  return true;
}

// ─── My applications / My profile ──────────────────────────────────────────

async function myApplications(supabase: any, chatId: number, userId: string) {
  const { data: applications, error } = await supabase
    .from('applications')
    .select('id, job_id, application_method, created_at')
    .eq('applicant_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('myApplications error:', error);
    await sendMessage(chatId, `Couldn't load your applications right now — try again shortly.`);
    return;
  }

  if (!applications || applications.length === 0) {
    await sendMessage(chatId, `You haven't applied to any jobs through JobMeter yet.`, {
      reply_markup: { inline_keyboard: [[{ text: '🔍 Browse jobs', callback_data: 'more_jobs_fresh' }]] },
    });
    return;
  }

  const jobIds = applications.map((a: any) => a.job_id);
  const { data: jobs } = await supabase.from('jobs').select('id, title, company, slug, country, location, status').in('id', jobIds);
  const jobsById = new Map<string, any>((jobs || []).map((j: any) => [j.id, j]));

  const lines = applications.map((a: any) => {
    const job = jobsById.get(a.job_id);
    const title = job?.title || 'Job no longer listed';
    const company = (job?.company && typeof job.company === 'object' && job.company.name) || '';
    const date = new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const status = job?.status === 'active' ? 'Open' : job?.status === 'expired' ? 'Closed' : '';
    return `• *${title}*${company ? ` — ${company}` : ''}\n  Applied ${date}${status ? ` · ${status}` : ''}`;
  });

  await sendMessage(chatId, `Your applications (most recent first):\n\n${lines.join('\n\n')}`, {
    reply_markup: { inline_keyboard: [[{ text: '🌐 See full details on the web', url: `${SITE_URL}/dashboard/applications` }]] },
  });
}

async function myProfile(supabase: any, chatId: number, userId: string) {
  const { data: profile, error } = await supabase
    .from('jobseeker_dashboard_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !profile) {
    await sendMessage(
      chatId,
      `I don't have your profile details yet. Send /start and sign up with your CV, or finish onboarding on the web.`,
      { reply_markup: { inline_keyboard: [[{ text: '🌐 Complete on jobmeter.app', url: SITE_URL }]] } }
    );
    return;
  }

  const lines: string[] = [];
  lines.push(`👤 *${profile.full_name || profile.cv_name || 'Your profile'}*`);
  if (profile.email) lines.push(`📧 ${profile.email}`);
  if (profile.phone) lines.push(`📱 ${profile.phone}`);
  if (profile.location || profile.cv_location) lines.push(`📍 ${profile.location || profile.cv_location}`);
  if (profile.sector) lines.push(`🏢 Sector: ${profile.sector}`);
  if (profile.experience_level) lines.push(`📈 Experience: ${profile.experience_level}`);
  const roles: string[] = Array.isArray(profile.target_roles) ? profile.target_roles : [];
  if (roles.length) lines.push(`🎯 Target roles: ${roles.slice(0, 5).join(', ')}`);
  const skills: string[] = Array.isArray(profile.cv_skills) ? profile.cv_skills : [];
  if (skills.length) lines.push(`🛠️ Top skills: ${skills.slice(0, 8).join(', ')}`);
  if (profile.cv_file_name) lines.push(`📄 CV on file: ${profile.cv_file_name}`);

  await sendMessage(chatId, lines.join('\n'), {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏢 Change sector', callback_data: 'change_sector' }],
        [{ text: '✏️ Edit full profile on jobmeter.app', url: `${SITE_URL}/dashboard/profile` }],
      ],
    },
  });
}

// ─── Main webhook handler ────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('ok', { status: 200 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, serviceKey);
  const anonClient = createClient(supabaseUrl, anonKey);

  try {
    const update = await req.json();

    // ── Callback query (inline button press) ──
    if (update.callback_query) {
      const cq = update.callback_query;
      const chatId = cq.message.chat.id;
      await answerCallbackQuery(cq.id);
      const tgUser = await getOrCreateTelegramUser(supabase, chatId, cq.from);
      const state = (tgUser.state || {}) as BotState;
      const data: string = cq.data || '';

      if (data === 'login') {
        await startLogin(supabase, chatId);
      } else if (data === 'signup') {
        await startSignup(supabase, chatId);
      } else if (data === 'quick_setup') {
        await startQuickSetup(supabase, chatId);
      } else if (data === 'use_cv_email') {
        const email = (state.temp?.cv?.email || '').trim().toLowerCase();
        if (email && isValidEmail(email)) {
          await askSignupSector(supabase, chatId, { ...state.temp, email });
        } else {
          await sendMessage(chatId, `What email should I use for your account?`);
          await setState(supabase, chatId, { step: 'signup_email', temp: state.temp });
        }
      } else if (data === 'other_email') {
        await setState(supabase, chatId, { step: 'signup_email', temp: state.temp });
        await sendMessage(chatId, `What email should I use for your account?`);
      } else if (data.startsWith('sec:')) {
        const [, idxStr, context] = data.split(':');
        const idx = parseInt(idxStr, 10);
        const sector = SECTORS[idx];
        if (!sector) {
          await sendMessage(chatId, `That option expired — please try again.`);
        } else if (context === 'onboard') {
          await askSignupRole(supabase, chatId, { ...state.temp, sector });
        } else if (context === 'quick') {
          await askQuickRole(supabase, chatId, { sector });
        } else if (context === 'browse' || context === 'change') {
          if (!tgUser.linked_at) {
            await sendMessage(chatId, `Send /start first to log in or sign up.`);
          } else {
            // upsert, not update: a login-only user may have no onboarding_data row
            // yet — update() would silently affect 0 rows and never add them to
            // the matching pool at all.
            await supabase.from('onboarding_data').upsert({ user_id: tgUser.user_id, sector }, { onConflict: 'user_id' });
            await sendMessage(chatId, `Got it — set your sector to *${sector}*.`);
            await sendJobBatch(supabase, chatId, tgUser.user_id, []);
          }
        }
      } else if (data.startsWith('role:')) {
        const rest = data.slice(5); // "<context>:<roleName>"
        const sepIdx = rest.indexOf(':');
        const context = rest.slice(0, sepIdx);
        const roleName = rest.slice(sepIdx + 1);
        if (context === 'onboard') {
          await askSignupCountry(supabase, chatId, { ...state.temp, roles: [roleName] });
        } else if (context === 'quick') {
          await askQuickCountry(supabase, chatId, { ...state.temp, roles: [roleName] });
        } else if (context === 'change') {
          if (!tgUser.linked_at) {
            await sendMessage(chatId, `Send /start first to log in or sign up.`);
          } else {
            await supabase.from('onboarding_data').upsert({ user_id: tgUser.user_id, target_roles: [roleName] }, { onConflict: 'user_id' });
            await sendMessage(chatId, `Got it — set your target role to *${roleName}*.`, { reply_markup: kbMainMenu });
          }
        }
      } else if (data.startsWith('cty:')) {
        const [, idxStr, context] = data.split(':');
        if (idxStr === 'other') {
          const step = context === 'onboard' ? 'signup_country_custom' : context === 'quick' ? 'quick_country_custom' : 'change_country_custom';
          await setState(supabase, chatId, { step, temp: state.temp });
          await sendMessage(chatId, `Type your country — e.g. "Nigeria", "Ghana" or "United Kingdom". (For remote-only, type "Global".)`);
        } else {
          const country = COUNTRY_OPTIONS[parseInt(idxStr, 10)]?.value;
          if (!country) {
            await sendMessage(chatId, `That option expired — please try again.`);
          } else {
            await applyCountryChoice(supabase, chatId, tgUser, state, context, country);
          }
        }
      } else if (data === 'change_country') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          await sendMessage(chatId, `Where do you want to work?`, { reply_markup: countryKeyboard('change') });
        }
      } else if (data.startsWith('role_custom:')) {
        const context = data.split(':')[1];
        const step = context === 'onboard' ? 'signup_role_custom' : context === 'quick' ? 'quick_role_custom' : 'change_role_custom';
        await setState(supabase, chatId, { step, temp: state.temp });
        await sendMessage(chatId, `Type the role(s) you want, separated by commas — e.g. "Project Manager, Product Owner".`);
      } else if (data === 'role_skip') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          await sendMessage(chatId, `No changes made to your target role.`, { reply_markup: kbMainMenu });
        }
      } else if (data === 'more_jobs' || data === 'more_jobs_fresh') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          const shownIds = data === 'more_jobs' ? state.temp?.shownIds || [] : [];
          await sendJobBatch(supabase, chatId, tgUser.user_id, shownIds);
        }
      } else if (data === 'more_remote') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          const shownIds = state.step === 'browsing_remote' ? state.temp?.shownIds || [] : [];
          await sendRemoteJobBatch(supabase, chatId, tgUser.user_id, shownIds);
        }
      } else if (data === 'change_sector') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          await sendMessage(chatId, `Pick a new sector:`, { reply_markup: sectorKeyboard('change') });
        }
      }

      return new Response('ok', { status: 200 });
    }

    // ── Regular message ──
    const message = update.message;
    if (!message) return new Response('ok', { status: 200 });

    const chatId = message.chat.id;
    const tgUser = await getOrCreateTelegramUser(supabase, chatId, message.from);
    const state = (tgUser.state || {}) as BotState;
    const text: string | undefined = message.text;

    // /start, optionally with a deep-link payload: "/start browse"
    if (text && text.startsWith('/start')) {
      const payload = text.slice(6).trim();
      if (payload === 'browse' && tgUser.linked_at) {
        await browseJobs(supabase, chatId, tgUser.user_id, tgUser);
      } else {
        await handleStart(supabase, chatId, tgUser);
      }
      return new Response('ok', { status: 200 });
    }
    if (text === '/menu' && tgUser.linked_at) {
      await sendMessage(chatId, `What would you like to do?`, { reply_markup: kbMainMenu });
      return new Response('ok', { status: 200 });
    }

    // Main menu button presses (linked users)
    if (tgUser.linked_at && text === '🔍 Browse jobs') {
      await browseJobs(supabase, chatId, tgUser.user_id, tgUser);
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '🏢 My sector') {
      const sector = await getUserSector(supabase, tgUser.user_id);
      await sendMessage(
        chatId,
        sector ? `Your current sector is *${sector}*.` : `You haven't set a sector yet.`,
        { reply_markup: sectorKeyboard('change') }
      );
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '🎯 My role') {
      const brief = await getOnboardingBrief(supabase, tgUser.user_id);
      if (!brief) {
        await sendMessage(chatId, `Set your sector first, then I can suggest roles for it.`, { reply_markup: sectorKeyboard('browse') });
        return new Response('ok', { status: 200 });
      }
      const currentRoles = brief.targetRoles.length ? brief.targetRoles.join(', ') : 'not set yet';
      await sendMessage(chatId, `Your current target role: *${currentRoles}*\n\nPick a new one for *${brief.sector}*:`, {
        reply_markup: roleKeyboard(brief.sector, 'change'),
      });
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '📍 My country') {
      const brief = await getOnboardingBrief(supabase, tgUser.user_id);
      const cur = brief?.country ? (brief.country === 'Global' ? 'global remote only' : brief.country) : 'not set yet';
      await sendMessage(chatId, `Your current job location: *${cur}*\n\nPick a new one:`, { reply_markup: countryKeyboard('change') });
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '📋 My applications') {
      await myApplications(supabase, chatId, tgUser.user_id);
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '👤 My profile') {
      await myProfile(supabase, chatId, tgUser.user_id);
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '📝 CV Templates') {
      await sendMessage(chatId, `Build your CV from a professional template:`, {
        reply_markup: { inline_keyboard: [[{ text: '📝 Open CV templates', url: `${SITE_URL}/cv-templates` }]] },
      });
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '🧰 Tools') {
      await sendMessage(chatId, `Pick a tool to open on jobmeter.app:`, { reply_markup: linkGridKeyboard(ALL_TOOLS) });
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '🌍 Remote Jobs') {
      const state2 = (tgUser.state || {}) as BotState;
      const shownIds = state2.step === 'browsing_remote' ? state2.temp?.shownIds || [] : [];
      await sendRemoteJobBatch(supabase, chatId, tgUser.user_id, shownIds);
      return new Response('ok', { status: 200 });
    }

    // Document upload during CV signup
    if (message.document && state.step === 'signup_cv') {
      await handleSignupCv(supabase, chatId, message.document);
      return new Response('ok', { status: 200 });
    }

    // Conversation state machine
    if (text) {
      switch (state.step) {
        case 'login_email':
          await handleLoginEmail(supabase, chatId, text);
          break;
        case 'login_password':
          await handleLoginPassword(supabase, anonClient, chatId, message.message_id, text, state);
          break;
        case 'signup_email':
        case 'signup_confirm_email': {
          const email = text.trim().toLowerCase();
          if (!isValidEmail(email)) {
            await sendMessage(chatId, `That doesn't look like a valid email — try again.`);
            break;
          }
          await askSignupSector(supabase, chatId, { ...state.temp, email });
          break;
        }
        case 'signup_role_custom': {
          const roles = text.split(',').map((r) => r.trim()).filter(Boolean);
          if (!roles.length) {
            await sendMessage(chatId, `Send at least one role.`);
            break;
          }
          await askSignupCountry(supabase, chatId, { ...state.temp, roles });
          break;
        }
        case 'quick_role_custom': {
          const roles = text.split(',').map((r) => r.trim()).filter(Boolean);
          if (!roles.length) {
            await sendMessage(chatId, `Send at least one role.`);
            break;
          }
          await askQuickCountry(supabase, chatId, { ...state.temp, roles });
          break;
        }
        case 'change_role_custom': {
          const roles = text.split(',').map((r) => r.trim()).filter(Boolean);
          if (!roles.length) {
            await sendMessage(chatId, `Send at least one role.`);
            break;
          }
          await supabase.from('onboarding_data').upsert({ user_id: tgUser.user_id, target_roles: roles }, { onConflict: 'user_id' });
          await setState(supabase, chatId, { step: 'idle' });
          await sendMessage(chatId, `Got it — set your target role(s) to *${roles.join(', ')}*.`, { reply_markup: kbMainMenu });
          break;
        }
        case 'signup_country_custom':
        case 'quick_country_custom':
        case 'change_country_custom': {
          const ctx = state.step === 'signup_country_custom' ? 'onboard' : state.step === 'quick_country_custom' ? 'quick' : 'change';
          const country = canonicalCountry(text);
          if (!country) {
            await sendMessage(chatId, `I didn't recognise that country. Type the full country name (e.g. "Kenya"), "Global" for remote-only, or pick from the list:`, {
              reply_markup: countryKeyboard(ctx),
            });
            break;
          }
          await applyCountryChoice(supabase, chatId, tgUser, state, ctx, country);
          break;
        }
        case 'signup_password': {
          const ok = await completeSignup(supabase, chatId, message.message_id, text, state.temp || {});
          if (!ok) {
            // keep them on the same step so they can retry (state already has temp)
          }
          break;
        }
        default:
          if (!tgUser.linked_at) {
            await sendMessage(chatId, `Send /start to get going.`);
          } else {
            await sendMessage(chatId, `Not sure what you mean — try the menu below.`, { reply_markup: kbMainMenu });
          }
      }
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Telegram bot error:', error);
    return new Response('ok', { status: 200 });
  }
});

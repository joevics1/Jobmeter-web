// supabase/functions/telegram-daily-digest/index.ts
//
// Morning digest: sends each Telegram-linked user their top 3 recent jobs
// (by preferred sector, falling back to related sectors, then general
// recent postings) using the same `social` post copy as the channel bot.
//
// Triggered by an external cron (cron-job.org) once a day, e.g. 07:00 UTC
// (~8am WAT). Not called by the telegram-bot webhook.
//
// Protect with the CRON_SECRET secret if set: cron-job.org should call
//   POST https://<project-ref>.supabase.co/functions/v1/telegram-daily-digest
//   Header: x-cron-secret: <same value as the CRON_SECRET Supabase secret>
// If CRON_SECRET isn't set, the function runs unauthenticated (fine while
// testing, but set the secret before relying on this in production).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = 'https://www.jobmeter.app';
const RECENT_DAYS = 14;
const DIGEST_BATCH_SIZE = 3;

// Kept in sync with supabase/functions/telegram-bot/index.ts
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
  return sectorTerms(sector).map((t) => `sector.ilike.%${t.replace(/[%_,()]/g, '')}%`).join(',');
}

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

function titleCase(s: string): string {
  return s.split(' ').map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w)).join(' ');
}

function deriveCountry(onboarding: { cv_location?: string | null; preferred_locations?: string[] | null }): string | null {
  if (onboarding.cv_location) {
    const parts = onboarding.cv_location.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return titleCase(parts[parts.length - 1]);
  }
  if (onboarding.preferred_locations && onboarding.preferred_locations.length) {
    return titleCase(onboarding.preferred_locations[onboarding.preferred_locations.length - 1]);
  }
  return null;
}

function roleOrFilter(roles: string[]): string {
  return roles
    .slice(0, 6)
    .map((r) => r.replace(/[%_,()]/g, '').trim())
    .filter((r) => r.length > 2)
    .map((r) => `role.ilike.%${r}%`)
    .join(',');
}

function jobMatchesCountry(job: any, country: string): boolean {
  const arr: string[] = Array.isArray(job.country) ? job.country : [];
  return arr.some((c) => c.toLowerCase() === country.toLowerCase() || c.toLowerCase() === 'global');
}

async function queryCandidates(supabase: any, orFilter: string, excludeIds: string[], recentSinceISO: string, fetchSize: number) {
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
  if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`);
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
    country: deriveCountry({ cv_location: data.cv_location, preferred_locations: data.preferred_locations }),
  };
}

// Role match first, then the user's sector, then related sectors — mirrors telegram-bot's browsing logic.
async function fetchDigestJobs(supabase: any, brief: OnboardingBrief | null, seenIds: string[]) {
  const recentSinceISO = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (!brief) {
    return await queryCandidates(supabase, 'status.eq.active', seenIds, recentSinceISO, DIGEST_BATCH_SIZE);
  }

  const tiers: string[] = [];
  const roleTerms = roleOrFilter(brief.targetRoles);
  if (roleTerms) tiers.push(roleTerms);
  tiers.push(sectorOrFilter(brief.sector));
  for (const rs of RELATED_SECTORS[brief.sector] || []) tiers.push(sectorOrFilter(rs));

  let collected: any[] = [];

  for (const orFilter of tiers) {
    if (collected.length >= DIGEST_BATCH_SIZE) break;
    const need = DIGEST_BATCH_SIZE - collected.length;
    const excludeNow = [...seenIds, ...collected.map((j) => j.id)];
    const candidates = await queryCandidates(supabase, orFilter, excludeNow, recentSinceISO, Math.max(need * 5, 15));
    if (candidates.length === 0) continue;

    let picked: any[];
    if (brief.country) {
      const inCountry = candidates.filter((j) => jobMatchesCountry(j, brief.country as string));
      picked = inCountry.slice(0, need);
      if (picked.length < need) {
        const rest = candidates.filter((j) => !picked.some((p) => p.id === j.id)).slice(0, need - picked.length);
        picked = [...picked, ...rest];
      }
    } else {
      picked = candidates.slice(0, need);
    }
    collected = [...collected, ...picked];
  }

  return collected;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const cronSecret = Deno.env.get('CRON_SECRET');
  if (cronSecret) {
    const provided = req.headers.get('x-cron-secret');
    if (provided !== cronSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split('T')[0];

    const { data: linkedUsers, error: usersError } = await supabase
      .from('telegram_users')
      .select('chat_id, user_id, digest_last_sent_date, digest_seen_job_ids, telegram_first_name')
      .not('linked_at', 'is', null)
      .not('user_id', 'is', null);

    if (usersError) throw usersError;

    if (!linkedUsers || linkedUsers.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No linked Telegram users', sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sentCount = 0;
    let skippedAlreadySent = 0;
    let skippedNoJobs = 0;
    let errorCount = 0;

    for (const tgUser of linkedUsers) {
      try {
        if (tgUser.digest_last_sent_date === today) {
          skippedAlreadySent++;
          continue;
        }

        const brief = await getOnboardingBrief(supabase, tgUser.user_id);

        const seenIds: string[] = Array.isArray(tgUser.digest_seen_job_ids) ? tgUser.digest_seen_job_ids : [];
        const jobs = await fetchDigestJobs(supabase, brief, seenIds);

        if (jobs.length === 0) {
          skippedNoJobs++;
          continue;
        }

        const { data: profileRow } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', tgUser.user_id)
          .maybeSingle();
        const rawName = (profileRow?.full_name || '').trim().split(/\s+/)[0] || (tgUser.telegram_first_name || '').trim();
        const nameStr = rawName ? ` ${rawName.replace(/([_*`\[])/g, '\\$1')}` : '';

        await sendMessage(
          tgUser.chat_id,
          `☀️ *Good morning${nameStr}!* Here's what's fresh${brief ? ` in *${brief.sector}*` : ''} today:`
        );

        for (const job of jobs) {
          await sendMessage(tgUser.chat_id, formatJobMessage(job), {
            disable_web_page_preview: true,
            reply_markup: { inline_keyboard: [[{ text: '✅ View & apply', url: buildJobUrl(job) }]] },
          });
        }

        const closingText = brief?.sector
          ? `👀 ${rawName ? rawName.replace(/([_*`\[])/g, '\\$1') + ', m' : 'M'}ore *${brief.sector}* roles just dropped — see which ones fit you`
          : `👀 ${rawName ? rawName.replace(/([_*`\[])/g, '\\$1') + ', m' : 'M'}ore roles just dropped that fit your profile — see which ones`;
        await sendMessage(tgUser.chat_id, closingText, {
          reply_markup: { inline_keyboard: [[{ text: '🔍 See my matches', url: `https://t.me/JobMeter_Bot?start=browse` }]] },
        });

        const newSeenIds = [...seenIds, ...jobs.map((j: any) => j.id)].slice(-30);
        await supabase
          .from('telegram_users')
          .update({ digest_last_sent_date: today, digest_seen_job_ids: newSeenIds })
          .eq('chat_id', tgUser.chat_id);

        sentCount++;
      } catch (userError) {
        errorCount++;
        console.error(`Error sending digest to chat ${tgUser.chat_id}:`, userError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalLinkedUsers: linkedUsers.length,
        sent: sentCount,
        skippedAlreadySentToday: skippedAlreadySent,
        skippedNoJobs,
        errors: errorCount,
        date: today,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Fatal error in telegram-daily-digest:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

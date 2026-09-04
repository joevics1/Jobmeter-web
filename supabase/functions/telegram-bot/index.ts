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
  ],
};

const kbMainMenu = {
  keyboard: [
    [{ text: '🔍 Browse jobs' }, { text: '🏢 My sector' }],
    [{ text: '📋 My applications' }, { text: '👤 My profile' }],
  ],
  resize_keyboard: true,
};

function sectorKeyboard(context: 'onboard' | 'browse' | 'change') {
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < SECTORS.length; i += 2) {
    const row = [{ text: SECTORS[i], callback_data: `sec:${i}:${context}` }];
    if (SECTORS[i + 1]) row.push({ text: SECTORS[i + 1], callback_data: `sec:${i + 1}:${context}` });
    rows.push(row);
  }
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

const JOB_SELECT = 'id, title, slug, company, country, location, sector, social, posted_date';

async function queryJobsForSector(
  supabase: any,
  sector: string,
  excludeIds: string[],
  limit: number,
  recentSinceISO: string
) {
  let query = supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('status', 'active')
    .or(sectorOrFilter(sector))
    .gte('posted_date', recentSinceISO)
    .order('posted_date', { ascending: false })
    .limit(limit);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('queryJobsForSector error:', error);
    return [];
  }
  return data || [];
}

async function fetchJobBatch(supabase: any, primarySector: string, shownIds: string[], limit = 3) {
  const recentSinceISO = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let collected = await queryJobsForSector(supabase, primarySector, shownIds, limit, recentSinceISO);
  let usedRelated = false;
  let relatedSectorUsed: string | null = null;

  if (collected.length < limit) {
    const related = RELATED_SECTORS[primarySector] || [];
    for (const rs of related) {
      if (collected.length >= limit) break;
      const need = limit - collected.length;
      const excludeNow = [...shownIds, ...collected.map((j: any) => j.id)];
      const more = await queryJobsForSector(supabase, rs, excludeNow, need, recentSinceISO);
      if (more.length > 0) {
        collected = [...collected, ...more];
        usedRelated = true;
        relatedSectorUsed = rs;
      }
    }
  }

  return { jobs: collected, usedRelated, relatedSectorUsed };
}

async function getUserSector(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('onboarding_data')
    .select('sector')
    .eq('user_id', userId)
    .maybeSingle();
  const sector = data?.sector;
  return sector && sector !== 'null' ? sector : null;
}

async function sendJobBatch(supabase: any, chatId: number, userId: string, sector: string, shownIds: string[]) {
  const { jobs, usedRelated, relatedSectorUsed } = await fetchJobBatch(supabase, sector, shownIds, 3);

  if (jobs.length === 0) {
    await sendMessage(
      chatId,
      `That's all the recent jobs I have for *${sector}* and related sectors right now. Check back soon, or browse everything on the web.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏢 Try a different sector', callback_data: 'change_sector' }],
            [{ text: '🌐 Browse all jobs', url: `${SITE_URL}/jobs` }],
          ],
        },
      }
    );
    return;
  }

  if (usedRelated && relatedSectorUsed) {
    await sendMessage(chatId, `That's all the recent *${sector}* jobs — here's a few from *${relatedSectorUsed}* too:`);
  }

  for (const job of jobs) {
    await sendMessage(chatId, formatJobMessage(job), {
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: '✅ View & apply', url: buildJobUrl(job) }]] },
    });
  }

  const newShownIds = [...shownIds, ...jobs.map((j: any) => j.id)].slice(-60); // cap growth
  await setState(supabase, chatId, { step: 'browsing', temp: { sector, shownIds: newShownIds } });

  await sendMessage(chatId, `Want more?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➡️ More jobs', callback_data: 'more_jobs' }],
        [{ text: '🏢 Change sector', callback_data: 'change_sector' }],
      ],
    },
  });
}

async function browseJobs(supabase: any, chatId: number, userId: string) {
  const sector = await getUserSector(supabase, userId);
  if (!sector) {
    await sendMessage(chatId, `First, what sector are you interested in?`, { reply_markup: sectorKeyboard('browse') });
    return;
  }
  await sendJobBatch(supabase, chatId, userId, sector, []);
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
    `👋 Welcome to *JobMeter* — I find jobs matched to you, and DM you the moment a great one comes in.\n\nDo you already have a JobMeter account?`,
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
  await sendMessage(
    chatId,
    `✅ Logged in! Your Telegram is now linked to your JobMeter account.\n\nI'll DM you here whenever a job scores 50%+ for you. What would you like to do?`,
    { reply_markup: kbMainMenu }
  );
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
    target_roles: cv.suggestedRoles || [],
    preferred_locations: cv.location ? [cv.location] : [],
    sector: sector || null,
    cv_text: temp.cvText || null,
    cv_file_name: temp.fileName || null,
    cv_file_type: temp.mimeType || null,
    cv_file_size: temp.fileSize || null,
  });

  await linkAccount(supabaseAdmin, chatId, userId);

  await sendMessage(
    chatId,
    `🎉 Account created! I've saved your CV details${sector ? ` and set your sector to *${sector}*` : ''}, so I'll start matching you to jobs right away and DM you here when something scores 50%+.`,
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
          await askSignupPassword(supabase, chatId, { ...state.temp, sector });
        } else if (context === 'browse' || context === 'change') {
          if (!tgUser.linked_at) {
            await sendMessage(chatId, `Send /start first to log in or sign up.`);
          } else {
            await supabase.from('onboarding_data').update({ sector }).eq('user_id', tgUser.user_id);
            await sendMessage(chatId, `Got it — set your sector to *${sector}*.`);
            await sendJobBatch(supabase, chatId, tgUser.user_id, sector, []);
          }
        }
      } else if (data === 'more_jobs' || data === 'more_jobs_fresh') {
        if (!tgUser.linked_at) {
          await sendMessage(chatId, `Send /start first to log in or sign up.`);
        } else {
          const sector = data === 'more_jobs' ? state.temp?.sector : null;
          const shownIds = data === 'more_jobs' ? state.temp?.shownIds || [] : [];
          const effectiveSector = sector || (await getUserSector(supabase, tgUser.user_id));
          if (!effectiveSector) {
            await sendMessage(chatId, `What sector are you interested in?`, { reply_markup: sectorKeyboard('browse') });
          } else {
            await sendJobBatch(supabase, chatId, tgUser.user_id, effectiveSector, shownIds);
          }
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
        await browseJobs(supabase, chatId, tgUser.user_id);
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
      await browseJobs(supabase, chatId, tgUser.user_id);
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
    if (tgUser.linked_at && text === '📋 My applications') {
      await myApplications(supabase, chatId, tgUser.user_id);
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && text === '👤 My profile') {
      await myProfile(supabase, chatId, tgUser.user_id);
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

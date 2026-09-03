// supabase/functions/telegram-bot/index.ts
//
// Telegram bot webhook handler for JobMeter.
// Handles: /start onboarding, login (email+password via Supabase Auth),
// signup via CV upload (parses CV, creates an account), a main menu,
// and job browsing. Real-time match notifications (>= 50%) are sent from
// daily-job-notifications/index.ts, which looks up linked chats in
// telegram_users.
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
    [{ text: '🔍 Browse jobs' }],
    [{ text: '📋 My applications' }, { text: '👤 My profile' }],
  ],
  resize_keyboard: true,
};

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

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

// ─── Flows ───────────────────────────────────────────────────────────────────

async function handleStart(supabase: any, chatId: number, tgUser: any) {
  if (tgUser.linked_at) {
    await sendMessage(
      chatId,
      `Welcome back! 👋\n\nWhat would you like to do?`,
      { reply_markup: kbMainMenu }
    );
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

  // Delete the password message immediately for privacy — bots can delete
  // incoming messages in private chats.
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
  const MAX_SIZE = 8 * 1024 * 1024; // 8MB, matches Telegram bot download limits comfortably

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

    // Reuse the existing CV pipeline: extract text, then parse into structured fields.
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

    const cv = parseData.parsed; // { fullName, email, phone, location, skills, suggestedRoles, ... }

    await setState(supabase, chatId, {
      step: cv.email && isValidEmail(cv.email) ? 'signup_confirm_email' : 'signup_email',
      temp: {
        cv,
        cvText: extractData.text,
        fileName,
        mimeType,
        fileSize: document.file_size || null,
      },
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

async function createAccountFromCv(supabaseAdmin: any, chatId: number, email: string, state: BotState) {
  const cv = state.temp?.cv || {};

  // Don't let someone accidentally create a duplicate account for an email that already exists.
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingProfile) {
    await setState(supabaseAdmin, chatId, { step: 'login_email', temp: { email } });
    await sendMessage(
      chatId,
      `Looks like *${email}* already has a JobMeter account. Let's log you in instead — send your password.`
    );
    await setState(supabaseAdmin, chatId, { step: 'login_password', temp: { email } });
    return;
  }

  const password = generatePassword();

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: cv.fullName || null, source: 'telegram_bot' },
  });

  if (createError || !created?.user) {
    console.error('Error creating user from Telegram signup:', createError);
    await sendMessage(chatId, `Something went wrong creating your account. Please try again in a moment.`);
    return;
  }

  const userId = created.user.id;

  // profiles row is expected to be created by an existing DB trigger on auth.users insert
  // (same as web signup). Fill in anything CV-derived that the trigger wouldn't know.
  await supabaseAdmin
    .from('profiles')
    .update({
      full_name: cv.fullName || null,
      phone: cv.phone || null,
      location: cv.location || null,
    })
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
    cv_text: state.temp?.cvText || null,
    cv_file_name: state.temp?.fileName || null,
    cv_file_type: state.temp?.mimeType || null,
    cv_file_size: state.temp?.fileSize || null,
  });

  await linkAccount(supabaseAdmin, chatId, userId);

  await sendMessage(
    chatId,
    `🎉 Account created!\n\n*Email:* ${email}\n*Password:* \`${password}\`\n\nSave that password somewhere safe — you can change it anytime on jobmeter.app. I've saved your CV details, so I'll start matching you to jobs right away and DM you here when something scores 50%+.`,
    { reply_markup: kbMainMenu }
  );
}

async function browseJobs(supabase: any, chatId: number) {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title, slug, company, country, location, salary_range')
    .order('posted_date', { ascending: false })
    .limit(6);

  if (error || !jobs || jobs.length === 0) {
    await sendMessage(chatId, `No jobs found right now — check back soon, or browse the full list on the web.`, {
      reply_markup: { inline_keyboard: [[{ text: '🌐 Browse on jobmeter.app', url: `${SITE_URL}/jobs` }]] },
    });
    return;
  }

  const lines = jobs.map((j: any) => {
    const company = (j.company && typeof j.company === 'object' && j.company.name) || 'Confidential employer';
    return `• *${j.title}* — ${company}`;
  });

  await sendMessage(chatId, `Here are the latest jobs:\n\n${lines.join('\n')}`, {
    reply_markup: { inline_keyboard: [[{ text: '🌐 See all & filter on the web', url: `${SITE_URL}/jobs` }]] },
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

      if (cq.data === 'login') await startLogin(supabase, chatId);
      else if (cq.data === 'signup') await startSignup(supabase, chatId);
      else if (cq.data === 'use_cv_email') {
        const state = (tgUser.state || {}) as BotState;
        const email = (state.temp?.cv?.email || '').trim().toLowerCase();
        if (email && isValidEmail(email)) {
          await createAccountFromCv(supabase, chatId, email, state);
        } else {
          await sendMessage(chatId, `What email should I use for your account?`);
          await setState(supabase, chatId, { step: 'signup_email', temp: state.temp });
        }
      } else if (cq.data === 'other_email') {
        const state = (tgUser.state || {}) as BotState;
        await setState(supabase, chatId, { step: 'signup_email', temp: state.temp });
        await sendMessage(chatId, `What email should I use for your account?`);
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

    // Commands work regardless of conversation state
    if (text === '/start') {
      await handleStart(supabase, chatId, tgUser);
      return new Response('ok', { status: 200 });
    }
    if (text === '/menu' && tgUser.linked_at) {
      await sendMessage(chatId, `What would you like to do?`, { reply_markup: kbMainMenu });
      return new Response('ok', { status: 200 });
    }

    // Main menu button presses (linked users)
    if (tgUser.linked_at && text === '🔍 Browse jobs') {
      await browseJobs(supabase, chatId);
      return new Response('ok', { status: 200 });
    }
    if (tgUser.linked_at && (text === '📋 My applications' || text === '👤 My profile')) {
      await sendMessage(
        chatId,
        `That's on the roadmap for the bot — for now you can see it on the web app.`,
        { reply_markup: { inline_keyboard: [[{ text: '🌐 Open jobmeter.app', url: SITE_URL }]] } }
      );
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
          await createAccountFromCv(supabase, chatId, email, state);
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
    // Always 200 back to Telegram so it doesn't endlessly retry a broken update.
    return new Response('ok', { status: 200 });
  }
});

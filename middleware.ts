// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_COUNTRIES = new Set(['SG']);

// Known link-preview / unfurl bots. These fetch the page to build a
// preview card (title, image, description) but never see the actual
// content and don't count as real visitors — blocking them stops the
// preview card from rendering on the platform in question.
const PREVIEW_BOT_UA_PATTERNS = [
  /facebookexternalhit/i,   // Facebook / Messenger
  /Twitterbot/i,            // Twitter / X
  /LinkedInBot/i,           // LinkedIn
  /WhatsApp/i,              // WhatsApp
  /TelegramBot/i,           // Telegram
  /Slackbot/i,              // Slack (covers Slackbot-LinkExpanding too)
  /Discordbot/i,            // Discord
  /SkypeUriPreview/i,       // Skype
  /Pinterest/i,             // Pinterest
  /vkShare/i,               // VK
  /redditbot/i,             // Reddit
];

function isPreviewBot(userAgent: string): boolean {
  return PREVIEW_BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Block link-preview bots first — cheapest check, applies regardless
  // of country, and this is the majority of what we're trying to stop.
  const userAgent = request.headers.get('user-agent') || '';
  if (pathname.startsWith('/jobs') && isPreviewBot(userAgent)) {
    return new NextResponse('Preview Disabled', { status: 403 });
  }

  const country = request.headers.get('x-vercel-ip-country') || 'unknown';

  // Skip immediately for non-blocked countries — the vast majority of requests
  // never need any processing at all, so we exit as fast as possible.
  if (!BLOCKED_COUNTRIES.has(country)) {
    return NextResponse.next();
  }

  // Only reach here for blocked countries (SG).
  // Block access to /jobs routes only.
  if (pathname.startsWith('/jobs')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run on /jobs routes — that's the only route with active logic.
    // All other routes (blog, apply, onboarding, dashboard, cv, profile)
    // had no middleware logic and were burning edge CPU for nothing.
    '/jobs/:path*',
  ],
};
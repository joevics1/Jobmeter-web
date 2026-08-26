// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { safeLimit, getClientIp, RATE_LIMIT_ENFORCE } from '@/lib/rate-limit';
import { claimsToBeCrawler, getCachedCrawlerRanges } from '@/lib/crawler-allowlist';
import { decideRateLimitAction } from '@/lib/rate-limit-decision';

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Block link-preview bots first — cheapest check, applies regardless of
  // country/rate-limit state, and doesn't need Redis at all.
  if (pathname.startsWith('/jobs') && isPreviewBot(userAgent)) {
    return new NextResponse('Preview Disabled', { status: 403 });
  }

  const country = request.headers.get('x-vercel-ip-country') || 'unknown';
  const ip = getClientIp(request);

  // Cloudflare sits in front of Vercel and already runs Bot Fight Mode + its
  // own verified-bot allowlist + ASN/country rules, so most junk never
  // reaches here at all. This is a second layer for whatever gets through —
  // scrapers hammering individual job/company pages faster than a human
  // could, from an IP Cloudflare didn't flag.
  const action = await decideRateLimitAction({
    pathname,
    country,
    ip,
    userAgent,
    blockedCountries: BLOCKED_COUNTRIES,
    now: Date.now(),
    rateLimitEnforce: RATE_LIMIT_ENFORCE,
    // Only spend the Redis read + CIDR scan when the UA at least claims to
    // be a known crawler — avoids an unconditional Redis round trip on every
    // single request.
    crawlerRanges: claimsToBeCrawler(userAgent) ? await getCachedCrawlerRanges() : [],
    runLimiter: () =>
      safeLimit(`${ip}:${pathname.startsWith('/company') ? 'company' : 'jobs'}`),
  });

  switch (action.type) {
    case 'blocked-country':
      return new NextResponse('Access Denied', { status: 403 });

    case 'allow':
      return NextResponse.next();

    case 'shadow-log':
      // Watch these logs for a few days before flipping RATE_LIMIT_MODE=enforce.
      console.log(
        `[rate-limit shadow] would block ip=${action.ip} path=${action.pathname} limit=${action.limit} remaining=${action.remaining}`
      );
      return NextResponse.next();

    case 'rate-limited':
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(action.retryAfterSeconds),
          'X-RateLimit-Limit': String(action.limit),
          'X-RateLimit-Remaining': '0',
        },
      });
  }
}

export const config = {
  matcher: [
    // Only run on /jobs and /company routes — everywhere else had no
    // middleware logic and would just burn edge CPU for nothing.
    '/jobs/:path*',
    '/company/:path*',
  ],
};

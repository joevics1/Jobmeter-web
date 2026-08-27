// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { safeLimit, getClientIp, RATE_LIMIT_ENFORCE } from '@/lib/rate-limit';
import { claimsToBeCrawler, getCachedCrawlerRanges } from '@/lib/crawler-allowlist';
import { decideRateLimitAction } from '@/lib/rate-limit-decision';

const BLOCKED_COUNTRIES = new Set(['SG']);

// Matches a valid job/country slug segment: lowercase letters, numbers, and
// hyphens only. Real slugs on this site never contain "://", "www.", "tel:",
// "@", spaces, or dots — those only show up when a scraper mechanically
// follows every href it parsed out of a rendered page (external profile
// links, mailto/tel links) instead of only following real internal links.
const VALID_SLUG_SEGMENT = /^[a-z0-9-]+$/;

// Known link-preview / unfurl bots (Facebook/Twitter/LinkedIn/WhatsApp/etc).
// IMPORTANT: these must NEVER be blocked. Blocking them doesn't stop a "fake
// visitor" — these bots ARE the mechanism that fetches the page to build the
// preview card when a job link is shared. A previous version of this file
// 403'd them here, which broke every social share sitewide ("preview
// unavailable"). Left as a comment as a guardrail against re-adding it.

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Reject obviously scraped/malformed job paths before any other check,
  // DB lookup, or rendering work happens — cheapest possible exit. Real
  // slugs are always [a-z0-9-]; a scraper mechanically following every href
  // it parsed out of a rendered page produces paths like
  // /jobs/nigeria/www.linkedin.com/in/... or /jobs/tel:0915..., which this
  // catches with zero false positives against legitimate traffic.
  if (pathname.startsWith('/jobs/')) {
    const segments = pathname.slice('/jobs/'.length).split('/').filter(Boolean);
    for (const segment of segments) {
      if (!VALID_SLUG_SEGMENT.test(segment)) {
        return new NextResponse('Not Found', { status: 404 });
      }
    }
  }

  // The site now sits behind Cloudflare's proxy, which means Vercel only ever
  // sees Cloudflare's own edge IP as the "client" — x-vercel-ip-country would
  // reflect whichever Cloudflare datacenter routed the request, not the real
  // visitor's country. Cloudflare adds its own header with the true visitor
  // country before forwarding to the origin; use that instead.
  const country = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || 'unknown';
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

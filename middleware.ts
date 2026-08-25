// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ratelimit, getClientIp, RATE_LIMIT_ENFORCE } from '@/lib/rate-limit';
import { claimsToBeCrawler, getCachedCrawlerRanges } from '@/lib/crawler-allowlist';
import { ipInAnyCidr } from '@/lib/cidr-match';

const BLOCKED_COUNTRIES = new Set(['SG']);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const country = request.headers.get('x-vercel-ip-country') || 'unknown';

  // ── Existing geo-block (SG on /jobs) — unchanged, kept first since it's a
  // cheap synchronous check that should exit fast for the common case. ────
  if (BLOCKED_COUNTRIES.has(country) && pathname.startsWith('/jobs')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ── Rate limiting on /jobs and /company ─────────────────────────────────
  // Cloudflare sits in front of Vercel and already runs Bot Fight Mode +
  // its own verified-bot allowlist + ASN/country rules, so most junk never
  // reaches here at all. This is a second layer for whatever gets through —
  // scrapers hammering individual job/company pages faster than a human
  // could, from an IP Cloudflare didn't flag.
  const ip = getClientIp(request);

  // If we can't determine a real IP, fail OPEN rather than lump every such
  // request into one shared "unknown" bucket and rate-limit unrelated
  // visitors against each other.
  if (ip === 'unknown') {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent');

  // Only spend the extra Redis read + CIDR scan on requests that are at
  // least claiming to be a known crawler. The IP match below — not the UA
  // string — is what actually grants the bypass, since UA is spoofable.
  if (claimsToBeCrawler(userAgent)) {
    const ranges = await getCachedCrawlerRanges();
    if (ranges.length > 0 && ipInAnyCidr(ip, ranges)) {
      return NextResponse.next();
    }
    // UA claims a crawler but the IP doesn't match any published range —
    // don't punish it specially, just fall through to the same rate limit
    // everyone else gets.
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(
    `${ip}:${pathname.startsWith('/company') ? 'company' : 'jobs'}`
  );

  if (!success) {
    if (!RATE_LIMIT_ENFORCE) {
      // Shadow mode: log what WOULD have been blocked, but let it through.
      // Watch these logs for a few days before flipping RATE_LIMIT_MODE=enforce.
      console.log(
        `[rate-limit shadow] would block ip=${ip} path=${pathname} limit=${limit} remaining=${remaining}`
      );
      return NextResponse.next();
    }

    const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run on /jobs and /company routes — everywhere else had no
    // middleware logic and would just burn edge CPU for nothing.
    '/jobs/:path*',
    '/company/:path*',
  ],
};
// Pure decision logic for middleware.ts, deliberately separated from the
// actual Redis/Upstash calls so this can be unit-tested with fake inputs —
// the sliding-window counting algorithm itself is @upstash/ratelimit's own
// tested code, not something we should re-derive by hand in a test double.

import { claimsToBeCrawler } from './crawler-allowlist';
import { ipInAnyCidr } from './cidr-match';

export interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch ms
}

export type RateLimitAction =
  | { type: 'blocked-country' }
  | { type: 'allow' } // includes verified-crawler bypass and fail-open cases
  | { type: 'shadow-log'; ip: string; pathname: string; limit: number; remaining: number }
  | { type: 'rate-limited'; retryAfterSeconds: number; limit: number };

export interface DecideRateLimitInput {
  pathname: string;
  country: string;
  ip: string;
  userAgent: string | null;
  blockedCountries: Set<string>;
  now: number;
  rateLimitEnforce: boolean;
  /** Cached verified-crawler CIDR ranges, already fetched from Redis. */
  crawlerRanges: string[];
  /** Runs the actual Upstash sliding-window check. Only called when we get
   *  past the fast-path checks above (blocked country, unknown IP, verified
   *  crawler) — so real Redis traffic is only spent when it matters. */
  runLimiter: () => Promise<LimitResult>;
}

export async function decideRateLimitAction(
  input: DecideRateLimitInput
): Promise<RateLimitAction> {
  const { pathname, country, ip, userAgent, blockedCountries, now, rateLimitEnforce, crawlerRanges, runLimiter } =
    input;

  if (blockedCountries.has(country) && pathname.startsWith('/jobs')) {
    return { type: 'blocked-country' };
  }

  // Fail open rather than lump every IP-less request into one shared bucket.
  if (ip === 'unknown') {
    return { type: 'allow' };
  }

  if (claimsToBeCrawler(userAgent)) {
    if (crawlerRanges.length > 0 && ipInAnyCidr(ip, crawlerRanges)) {
      return { type: 'allow' };
    }
    // UA claims a crawler but IP doesn't match any published range — no
    // special penalty, just fall through to the same limit as everyone else.
  }

  const { success, limit, remaining, reset } = await runLimiter();

  if (success) {
    return { type: 'allow' };
  }

  if (!rateLimitEnforce) {
    return { type: 'shadow-log', ip, pathname, limit, remaining };
  }

  const retryAfterSeconds = Math.max(0, Math.ceil((reset - now) / 1000));
  return { type: 'rate-limited', retryAfterSeconds, limit };
}

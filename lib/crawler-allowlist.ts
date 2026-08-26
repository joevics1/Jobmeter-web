import { Redis } from '@upstash/redis';

// Official, Google-published IP ranges — NOT to be confused with trusting the
// User-Agent header alone, which is trivially spoofable. We only treat a
// request as a verified crawler if its IP is actually inside one of these
// ranges. See: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests
const GOOGLE_COMMON_CRAWLERS_URL =
  'https://developers.google.com/static/crawling/ipranges/common-crawlers.json';
// Covers AdsBot / Mediapartners-Google — the ones actually relevant to an
// AdSense invalid-traffic investigation.
const GOOGLE_SPECIAL_CRAWLERS_URL =
  'https://developers.google.com/static/crawling/ipranges/special-crawlers.json';
const BING_CRAWLERS_URL = 'https://www.bing.com/toolbox/bingbot.json';

const CACHE_KEY = 'crawler-ip-ranges:v1';
const CACHE_TTL_SECONDS = 60 * 60 * 30; // 30h safety net; the cron refresh runs daily

interface GoogleIpRangesFile {
  prefixes: Array<{ ipv4Prefix?: string; ipv6Prefix?: string }>;
}

interface BingIpRangesFile {
  prefixes: Array<{ ipv4Prefix?: string; ipv6Prefix?: string }>;
}

function redisClient(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

async function fetchRanges(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: GoogleIpRangesFile | BingIpRangesFile = await res.json();
    return data.prefixes
      .map((p) => p.ipv4Prefix || p.ipv6Prefix)
      .filter((p): p is string => !!p);
  } catch {
    return [];
  }
}

/** Refreshes the cached crawler IP ranges. Call this from a daily cron job —
 *  NOT from the request path, since these barely change and a per-request
 *  fetch would add real latency (and a real failure mode) to every visitor. */
export async function refreshCrawlerAllowlist(): Promise<{ count: number }> {
  const [google, googleSpecial, bing] = await Promise.all([
    fetchRanges(GOOGLE_COMMON_CRAWLERS_URL),
    fetchRanges(GOOGLE_SPECIAL_CRAWLERS_URL),
    fetchRanges(BING_CRAWLERS_URL),
  ]);
  const all = [...google, ...googleSpecial, ...bing];
  const redis = redisClient();
  // @upstash/redis auto-serializes non-string values on set() and
  // auto-deserializes JSON-looking strings on get() — pass the array
  // directly rather than JSON.stringify-ing it ourselves, or get() ends up
  // trying to double-parse an already-parsed value.
  await redis.set(CACHE_KEY, all, { ex: CACHE_TTL_SECONDS });
  return { count: all.length };
}

/** Reads the cached CIDR list. Returns [] (fail open to "not verified", i.e.
 *  rate-limit applies) if the cache hasn't been populated yet. */
export async function getCachedCrawlerRanges(): Promise<string[]> {
  const redis = redisClient();
  const cached = await redis.get<string[]>(CACHE_KEY);
  return cached ?? [];
}

// A quick, cheap pre-filter on User-Agent so we don't do the (still fast, but
// non-zero) Redis read + CIDR scan on every single request — only on ones
// that are AT LEAST claiming to be a known crawler. The IP check afterwards
// is what actually decides trust; this is purely a performance short-circuit.
const CRAWLER_UA_HINTS = [
  'googlebot',
  'adsbot-google',
  'mediapartners-google',
  'bingbot',
  'adidxbot',
];

export function claimsToBeCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_HINTS.some((hint) => ua.includes(hint));
}

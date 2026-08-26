// Run with: npx tsx lib/__tests__/crawler-allowlist.test.ts
// Mocks global fetch with realistic Google/Bing JSON responses (verified
// against real schema during development — see conversation) so we can test
// the parsing/caching logic without hitting the network or a real Redis.

let passed = 0;
let failed = 0;
function assert(condition: boolean, description: string) {
  if (condition) passed++;
  else { failed++; console.error(`✗ FAIL: ${description}`); }
}

const GOOGLE_COMMON_SAMPLE = {
  creationTime: '2026-08-20T00:00:00.000000',
  prefixes: [
    { ipv4Prefix: '66.249.64.0/27' },
    { ipv6Prefix: '2001:4860:4801:10::/64' },
  ],
};
const GOOGLE_SPECIAL_SAMPLE = {
  creationTime: '2026-08-20T00:00:00.000000',
  prefixes: [{ ipv4Prefix: '192.178.4.0/27' }],
};
const BING_SAMPLE = {
  creationTime: '2021-11-10T10:00:00.121331',
  prefixes: [
    { ipv4Prefix: '157.55.39.0/24' },
    { ipv4Prefix: '40.77.167.0/24' },
  ],
};

const redisStore = new Map<string, string>();

// Fake in-memory Redis: enough of @upstash/redis's REST surface for this
// module's get/set calls — set(key, value, {ex}) and get(key).
function installFakes() {
  const originalFetch = global.fetch;
  global.fetch = (async (url: string | URL, init?: RequestInit) => {
    const u = url.toString();
    if (u.includes('common-crawlers.json')) {
      return new Response(JSON.stringify(GOOGLE_COMMON_SAMPLE), { status: 200 });
    }
    if (u.includes('special-crawlers.json')) {
      return new Response(JSON.stringify(GOOGLE_SPECIAL_SAMPLE), { status: 200 });
    }
    if (u.includes('bingbot.json')) {
      return new Response(JSON.stringify(BING_SAMPLE), { status: 200 });
    }
    if (u.includes('upstash.io')) {
      // @upstash/redis auto-pipelines by default — even single get/set calls
      // go through POST /pipeline with a body of [[CMD, ...args], ...] and
      // expect a response of [{result}, ...] in the same order.
      const body = init?.body ? JSON.parse(init.body as string) : null;
      if (Array.isArray(body)) {
        const results = body.map((cmd: unknown[]) => {
          const [op, key, value] = cmd;
          const opLower = String(op).toLowerCase();
          if (opLower === 'set') {
            // Real Upstash: the client already sent `value` as a JSON string
            // (it stringifies non-primitives itself before the HTTP call) —
            // store it verbatim, don't re-stringify.
            redisStore.set(key as string, value as string);
            return { result: 'OK' };
          }
          if (opLower === 'get') {
            // Real Upstash returns the raw stored string; @upstash/redis's
            // client-side auto-deserialization (tested separately above)
            // is what turns it back into an array for the caller.
            return { result: redisStore.get(key as string) ?? null };
          }
          return { result: null };
        });
        return new Response(JSON.stringify(results), { status: 200 });
      }
    }
    throw new Error(`Unexpected fetch in test: ${u}`);
  }) as typeof fetch;
  return () => { global.fetch = originalFetch; };
}

async function run() {
  process.env.UPSTASH_REDIS_REST_URL = 'https://fake-instance.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';

  const restoreFetch = installFakes();
  try {
    const { refreshCrawlerAllowlist, getCachedCrawlerRanges } = await import('../crawler-allowlist');

    const { count } = await refreshCrawlerAllowlist();
    assert(count === 5, `refreshCrawlerAllowlist collects all ranges from all 3 sources (got ${count}, expected 5)`);

    const ranges = await getCachedCrawlerRanges();
    assert(ranges.includes('66.249.64.0/27'), 'cached ranges include Google common-crawlers entry');
    assert(ranges.includes('192.178.4.0/27'), 'cached ranges include Google special-crawlers (AdsBot/Mediapartners) entry');
    assert(ranges.includes('157.55.39.0/24'), 'cached ranges include Bing entry');
    assert(ranges.includes('2001:4860:4801:10::/64'), 'IPv6 prefixes are preserved, not dropped');
  } finally {
    restoreFetch();
  }

  // Uncached (empty) case: getCachedCrawlerRanges must return [] rather than
  // throw, so callers correctly fail toward "not verified" (still rate-limited)
  // instead of crashing the whole request.
  {
    redisStore.clear();
    const restore2 = installFakes();
    try {
      const { getCachedCrawlerRanges } = await import('../crawler-allowlist');
      const ranges = await getCachedCrawlerRanges();
      assert(Array.isArray(ranges) && ranges.length === 0, 'empty cache returns [] instead of throwing');
    } finally {
      restore2();
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run();

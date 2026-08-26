// Standalone test runner (no jest/vitest in this project) — run with:
//   npx tsx lib/__tests__/rate-limit.test.ts
import { decideRateLimitAction, LimitResult } from '../rate-limit-decision';
import { ipInCidr, ipInAnyCidr } from '../cidr-match';
import { claimsToBeCrawler } from '../crawler-allowlist';
import { getClientIp } from '../rate-limit';

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`✗ FAIL: ${description}`);
  }
}

function fakeLimiter(result: LimitResult): () => Promise<LimitResult> {
  return async () => result;
}

async function run() {
  // ── getClientIp: header precedence, correctness through Cloudflare ─────
  {
    const req = new Request('https://jobmeter.example/jobs', {
      headers: { 'cf-connecting-ip': '102.89.1.1', 'x-forwarded-for': '10.0.0.1, 10.0.0.2' },
    });
    assert(getClientIp(req) === '102.89.1.1', 'cf-connecting-ip takes priority over x-forwarded-for');
  }
  {
    const req = new Request('https://jobmeter.example/jobs', {
      headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.2' },
    });
    assert(getClientIp(req) === '203.0.113.5', 'falls back to first x-forwarded-for entry');
  }
  {
    const req = new Request('https://jobmeter.example/jobs');
    assert(getClientIp(req) === 'unknown', 'returns "unknown" when no IP header is present at all');
  }

  // ── claimsToBeCrawler: only a fast UA pre-filter, not the actual trust decision ──
  assert(claimsToBeCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), 'detects Googlebot UA');
  assert(claimsToBeCrawler('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'), 'detects Bingbot UA');
  assert(!claimsToBeCrawler('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'), 'ordinary browser UA is not flagged');
  assert(!claimsToBeCrawler(null), 'null UA is not flagged');

  // ── CIDR matching (re-verified here as part of the suite, not just ad hoc) ──
  assert(ipInCidr('66.249.66.1', '66.249.64.0/19'), 'real Googlebot IP matches its published range');
  assert(!ipInCidr('8.8.8.8', '66.249.64.0/19'), 'unrelated IP does not match');
  assert(ipInAnyCidr('157.55.39.10', ['1.2.3.0/24', '157.55.39.0/24']), 'matches across multiple ranges');

  // ── decideRateLimitAction: the actual branching logic we own ────────────
  const blockedCountries = new Set(['SG']);

  // 1. Geo-block still takes priority, and only applies to /jobs.
  {
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'SG', ip: '1.2.3.4', userAgent: 'curl/8.0',
      blockedCountries, now: Date.now(), rateLimitEnforce: true, crawlerRanges: [],
      runLimiter: fakeLimiter({ success: true, limit: 60, remaining: 59, reset: Date.now() + 60000 }),
    });
    assert(action.type === 'blocked-country', 'SG + /jobs is blocked before rate limiting even runs');
  }
  {
    const action = await decideRateLimitAction({
      pathname: '/company/acme', country: 'SG', ip: '1.2.3.4', userAgent: 'curl/8.0',
      blockedCountries, now: Date.now(), rateLimitEnforce: true, crawlerRanges: [],
      runLimiter: fakeLimiter({ success: true, limit: 60, remaining: 59, reset: Date.now() + 60000 }),
    });
    assert(action.type === 'allow', 'SG geo-block does NOT apply to /company (unchanged scope)');
  }

  // 2. Unknown IP fails open without ever touching the limiter.
  {
    let limiterCalled = false;
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'US', ip: 'unknown', userAgent: 'curl/8.0',
      blockedCountries, now: Date.now(), rateLimitEnforce: true, crawlerRanges: [],
      runLimiter: async () => { limiterCalled = true; return { success: false, limit: 60, remaining: 0, reset: Date.now() }; },
    });
    assert(action.type === 'allow', 'unknown IP fails open (allow)');
    assert(!limiterCalled, 'unknown IP never consults the limiter at all');
  }

  // 3. Verified crawler (UA + IP both match) bypasses without consulting the limiter.
  {
    let limiterCalled = false;
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'US', ip: '66.249.66.1',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      blockedCountries, now: Date.now(), rateLimitEnforce: true,
      crawlerRanges: ['66.249.64.0/19'],
      runLimiter: async () => { limiterCalled = true; return { success: false, limit: 60, remaining: 0, reset: Date.now() }; },
    });
    assert(action.type === 'allow', 'verified crawler (UA+IP match) bypasses the limit');
    assert(!limiterCalled, 'verified crawler never consults the limiter — the whole point of the bypass');
  }

  // 4. UA CLAIMS Googlebot but IP does NOT match any published range — must
  //    NOT get special treatment; falls through to the normal limiter check.
  {
    let limiterCalled = false;
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'US', ip: '1.2.3.4', // not in the Googlebot range
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      blockedCountries, now: Date.now(), rateLimitEnforce: true,
      crawlerRanges: ['66.249.64.0/19'],
      runLimiter: async () => { limiterCalled = true; return { success: true, limit: 60, remaining: 10, reset: Date.now() + 30000 }; },
    });
    assert(limiterCalled, 'spoofed Googlebot UA (IP mismatch) is NOT exempted — still consults the limiter');
    assert(action.type === 'allow', 'and is allowed/denied on the same terms as anyone else (allowed here since limiter said success)');
  }

  // 5. Rate limit exceeded + shadow mode: logs, but still allows through.
  {
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'US', ip: '9.9.9.9', userAgent: 'curl/8.0',
      blockedCountries, now: Date.now(), rateLimitEnforce: false, crawlerRanges: [],
      runLimiter: fakeLimiter({ success: false, limit: 60, remaining: 0, reset: Date.now() + 45000 }),
    });
    assert(action.type === 'shadow-log', 'exceeding the limit in shadow mode produces a shadow-log action, not a block');
  }

  // 6. Rate limit exceeded + enforce mode: actually blocks, with correct Retry-After.
  {
    const now = Date.now();
    const resetAt = now + 45000; // 45s from now
    const action = await decideRateLimitAction({
      pathname: '/jobs/123', country: 'US', ip: '9.9.9.9', userAgent: 'curl/8.0',
      blockedCountries, now, rateLimitEnforce: true, crawlerRanges: [],
      runLimiter: fakeLimiter({ success: false, limit: 60, remaining: 0, reset: resetAt }),
    });
    assert(action.type === 'rate-limited', 'exceeding the limit in enforce mode actually blocks');
    if (action.type === 'rate-limited') {
      assert(action.retryAfterSeconds === 45, `Retry-After computed correctly (got ${action.retryAfterSeconds}, expected 45)`);
    }
  }

  // 7. Under the limit: always allowed regardless of mode.
  {
    const action = await decideRateLimitAction({
      pathname: '/company/acme', country: 'US', ip: '9.9.9.9', userAgent: 'curl/8.0',
      blockedCountries, now: Date.now(), rateLimitEnforce: true, crawlerRanges: [],
      runLimiter: fakeLimiter({ success: true, limit: 60, remaining: 12, reset: Date.now() + 20000 }),
    });
    assert(action.type === 'allow', 'under the limit is always allowed');
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run();

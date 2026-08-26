// Run with: npx tsx lib/__tests__/fail-open.test.ts
// Verifies the exact scenario about to happen in production: Redis env vars
// not configured yet. Must fail OPEN (request allowed through), never throw.

let passed = 0;
let failed = 0;
function assert(condition: boolean, description: string) {
  if (condition) passed++;
  else { failed++; console.error(`✗ FAIL: ${description}`); }
}

async function run() {
  // Deliberately invalid/missing-style config, same as a fresh deploy
  // without UPSTASH_REDIS_REST_URL/TOKEN set in Vercel yet.
  process.env.UPSTASH_REDIS_REST_URL = '';
  process.env.UPSTASH_REDIS_REST_TOKEN = '';

  const { safeLimit } = await import('../rate-limit');
  const { getCachedCrawlerRanges } = await import('../crawler-allowlist');

  let threw = false;
  let result;
  try {
    result = await safeLimit('test-key');
  } catch {
    threw = true;
  }
  assert(!threw, 'safeLimit() does not throw when Redis is unconfigured');
  assert(result?.success === true, 'safeLimit() fails OPEN (success: true) when Redis is unconfigured');

  let threw2 = false;
  let ranges;
  try {
    ranges = await getCachedCrawlerRanges();
  } catch {
    threw2 = true;
  }
  assert(!threw2, 'getCachedCrawlerRanges() does not throw when Redis is unconfigured');
  assert(Array.isArray(ranges) && ranges.length === 0, 'getCachedCrawlerRanges() returns [] when Redis is unconfigured');

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run();

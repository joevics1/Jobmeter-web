import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Tunable without a redeploy of the logic itself — only env vars change.
// Defaults chosen as a starting point; see SHADOW_MODE below for how to
// calibrate these against real traffic before they actually block anyone.
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 60);
const WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 60);

// Shadow mode: compute and log what WOULD be limited, but never actually
// return 429. Flip RATE_LIMIT_MODE=enforce in Vercel env vars once you've
// watched the logs for a few days and are confident the threshold is right
// for real traffic (and not, e.g., people behind shared/carrier-grade IPs).
export const RATE_LIMIT_ENFORCE = process.env.RATE_LIMIT_MODE === 'enforce';

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
  analytics: true,
  prefix: 'ratelimit:jobmeter',
});

// Separate, much stricter limiter for job-submission endpoints
// (/api/jobs/submit, /api/jobs/parse-paste, /api/jobs/process-submission).
// These aren't page views — each one either creates a job submission or
// spends a Gemini API call, so the generic 60-req/min page limiter is far
// too loose here. Same fail-open behavior via safeLimit below.
const SUBMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_SUBMIT_MAX ?? 8);
const SUBMIT_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_SUBMIT_WINDOW_SECONDS ?? 600); // 10 min

export const submitRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(SUBMIT_MAX_REQUESTS, `${SUBMIT_WINDOW_SECONDS} s`),
  analytics: true,
  prefix: 'ratelimit:jobmeter:submit',
});

export async function safeSubmitLimit(key: string): Promise<SafeLimitResult> {
  try {
    return await submitRatelimit.limit(key);
  } catch (error) {
    console.error('[rate-limit] Submit-limiter Redis call failed — failing open. Error:', error);
    return { success: true, limit: SUBMIT_MAX_REQUESTS, remaining: SUBMIT_MAX_REQUESTS, reset: Date.now() };
  }
}

export interface SafeLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Wraps ratelimit.limit() so a missing/misconfigured/unreachable Redis
 * (e.g. UPSTASH_REDIS_REST_URL/TOKEN not set yet) fails OPEN — the request
 * is allowed through — instead of throwing and taking down every request to
 * /jobs and /company with a 500. The Redis client itself doesn't throw on
 * construction when env vars are missing, only on the actual call, so this
 * is the layer that has to catch it.
 */
export async function safeLimit(key: string): Promise<SafeLimitResult> {
  try {
    return await ratelimit.limit(key);
  } catch (error) {
    console.error(
      '[rate-limit] Redis call failed — failing open (request allowed, not rate-limited). ' +
        'Check UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN are set. Error:',
      error
    );
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS, reset: Date.now() };
  }
}

/**
 * Real client IP. Cloudflare proxies every request before it reaches Vercel,
 * so request.ip / a naive x-forwarded-for read would just see Cloudflare's
 * edge IP — a tiny, shared pool — and effectively rate-limit ALL visitors
 * together instead of one visitor at a time. cf-connecting-ip is the header
 * Cloudflare sets specifically to carry the true originating IP through.
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Fallbacks for any path that somehow bypasses Cloudflare (e.g. direct
  // Vercel domain access, previews) — first entry in x-forwarded-for is the
  // original client when present.
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  return request.headers.get('x-real-ip') || 'unknown';
}

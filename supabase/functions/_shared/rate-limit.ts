// Shared per-user daily rate limiter for Supabase Edge Functions.
//
// Talks to Upstash Redis over its plain REST API (a couple of fetch
// calls) instead of pulling in the @upstash/ratelimit npm package —
// simplest thing that works in Deno, and reuses the exact same Redis
// instance/credentials the Next.js side already uses via lib/rate-limit.ts
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Those two need to
// also be set as secrets on the Supabase project — Vercel env vars aren't
// visible to Supabase Edge Functions:
//   supabase secrets set UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=...
//
// Fixed daily window, not sliding — good enough for "don't let one user
// burn unlimited Gemini calls on a free tool" without needing the
// sliding-window algorithm lib/rate-limit.ts uses for the higher-volume
// /jobs and /company IP-based limiting.
//
// Fails OPEN on any Redis error (missing secrets, network issue, etc.) —
// same reasoning as lib/rate-limit.ts's safeLimit: a broken rate limiter
// should never be the reason a legitimate user's request 500s.

export interface DailyLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export async function checkDailyLimit(
  key: string,
  limit: number
): Promise<DailyLimitResult> {
  const url = Deno.env.get('UPSTASH_REDIS_REST_URL');
  const token = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

  if (!url || !token) {
    console.error('[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set on this Supabase project — failing open.');
    return { allowed: true, remaining: limit, limit };
  }

  const redisKey = `ratelimit:jobmeter-edge:${key}:${new Date().toISOString().slice(0, 10)}`; // resets daily (UTC)

  try {
    // Upstash's pipeline endpoint: INCR then, only on the first hit today,
    // set a 25h expiry (comfortably past the UTC day boundary) so the key
    // doesn't linger forever.
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, '90000', 'NX'],
      ]),
    });

    if (!res.ok) throw new Error(`Upstash error: ${res.status}`);

    const [incrResult] = await res.json();
    const count = Number(incrResult?.result ?? 0);

    return { allowed: count <= limit, remaining: Math.max(0, limit - count), limit };
  } catch (error) {
    console.error('[rate-limit] Upstash call failed — failing open. Error:', error);
    return { allowed: true, remaining: limit, limit };
  }
}

/**
 * Verifies the request actually carries a valid Supabase session and
 * returns that user's id — never trust a userId passed in the request
 * body for anything security- or limit-relevant, since a body field can
 * be spoofed by anyone hitting the function URL directly.
 */
export async function getAuthedUserId(req: Request, supabaseUrl: string, anonKey: string): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: anonKey },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

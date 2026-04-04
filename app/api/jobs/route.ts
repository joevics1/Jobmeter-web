import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

const FIELDS = 'id, slug, title, company, location, country, salary_range, employment_type, posted_date, created_at, sector, role_category, job_type, role, related_roles, ai_enhanced_roles, skills_required, ai_enhanced_skills, experience_level';
const CACHE_TTL     = 1800;   // 30 min — primary Redis cache
const STALE_TTL     = 86400;  // 24 h  — stale fallback
const COOLDOWN_SECS = 1800;   // 30 min — minimum gap between cache busts
const CACHE_KEY     = 'jobs:all';
const STALE_KEY     = 'jobs:all:stale';
const VERSION_KEY   = 'jobs:cache:version';   // bumped on bust — tells clients to drop sessionStorage
const COOLDOWN_KEY  = 'jobs:cache:last_bust'; // unix timestamp of last successful bust

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Helper: safely parse whatever Upstash returns ────────────────────────────
function parseRedisValue(raw: unknown): unknown[] | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminSecret = searchParams.get('admin_secret');

  // ── Lightweight version check — 1 Redis read, no Supabase ────────────────
  if (searchParams.get('check') === 'version') {
    try {
      const version = await redis.get<string>(VERSION_KEY);
      return NextResponse.json(
        { cacheVersion: version ?? null },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    } catch {
      return NextResponse.json(
        { cacheVersion: null },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }
  }

  // ── Admin: cooldown-gated cache bust ──────────────────────────────────────
  if (searchParams.get('action') === 'bust_cache') {
    const expectedSecret = process.env.ADMIN_CACHE_SECRET;
    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const now = Math.floor(Date.now() / 1000);
      const lastBust = await redis.get<number>(COOLDOWN_KEY);

      // If a bust happened within the cooldown window, skip silently
      if (lastBust && now - lastBust < COOLDOWN_SECS) {
        const retryIn = COOLDOWN_SECS - (now - lastBust);
        console.log(`[jobs-api] Bust skipped — cooldown active, retry in ${retryIn}s`);
        return NextResponse.json({ skipped: true, retry_in_seconds: retryIn });
      }

      // Cooldown passed — bust cache, bump version, record timestamp
      const newVersion = Date.now().toString();
      await Promise.all([
        redis.del(CACHE_KEY),
        redis.del(STALE_KEY),
        redis.set(VERSION_KEY, newVersion),                   // no TTL — version is permanent
        redis.set(COOLDOWN_KEY, now, { ex: COOLDOWN_SECS }),  // expires after cooldown window
      ]);

      console.log(`[jobs-api] Cache busted — new version: ${newVersion}`);
      return NextResponse.json({ success: true, version: newVersion });
    } catch (err) {
      console.error('[jobs-api] Cache bust error:', err);
      return NextResponse.json({ error: 'Cache bust failed' }, { status: 500 });
    }
  }

  try {
    // ── 1+2. Read version + primary cache in one round-trip ──────────────
    // mget cuts 2 Redis commands down to 1 on every request
    let cacheVersion: string | null = null;
    let cached: unknown[] | null = null;
    try {
      const [rawVersion, rawCache] = await redis.mget(VERSION_KEY, CACHE_KEY);
      cacheVersion = rawVersion ? String(rawVersion) : null;
      cached = parseRedisValue(rawCache);
    } catch {
      // non-fatal — fall through to Supabase
    }

    if (cached) {
      console.log(`[jobs-api] Cache HIT — ${cached.length} jobs`);
      return NextResponse.json(
        { jobs: cached, total: cached.length, source: 'cache', cacheVersion },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // ── 3. Cache MISS — fetch from Supabase ──────────────────────────────
    console.log('[jobs-api] Cache MISS — fetching from Supabase');
    const supabase = getSupabase();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('jobs')
      .select(FIELDS)
      .eq('status', 'active')
      .gte('posted_date', thirtyDaysAgoStr)
      .order('posted_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(0, 1999);

    if (error) {
      console.error('[jobs-api] Supabase error:', error);

      // Serve stale fallback on Supabase failure
      const staleRaw = await redis.get(STALE_KEY);
      const stale = parseRedisValue(staleRaw);
      if (stale) {
        console.warn('[jobs-api] Serving STALE fallback cache');
        return NextResponse.json(
          { jobs: stale, total: stale.length, source: 'stale-cache', cacheVersion },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    const jobs = data || [];
    const serialized = JSON.stringify(jobs);

    // Write primary + stale in parallel; don't await — return to client immediately
    Promise.all([
      redis.setex(CACHE_KEY, CACHE_TTL, serialized),
      redis.setex(STALE_KEY, STALE_TTL, serialized),
    ])
      .then(() => console.log(`[jobs-api] Cached ${jobs.length} jobs (primary: ${CACHE_TTL}s, stale: ${STALE_TTL}s)`))
      .catch(err => console.error('[jobs-api] Redis write error:', err));

    return NextResponse.json(
      { jobs, total: jobs.length, source: 'supabase', cacheVersion },
      { headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    console.error('[jobs-api] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
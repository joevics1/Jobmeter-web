// app/api/cron/refresh-crawler-ips/route.ts
// Runs automatically via Vercel's native Cron Jobs (see vercel.json),
// daily at 03:00 UTC. Not on cron-jobs.org — an external cron pointed at
// the bare "jobmeter.app" domain hit the apex→www redirect, which most
// cron services don't follow, so it silently never actually ran. Vercel's
// native cron invokes the route directly against the deployment, so this
// isn't affected by the domain redirect at all.
//
// Refreshes the cached Google/Bing crawler CIDR ranges that middleware.ts
// uses to bypass rate limiting for verified crawlers. This matters more
// now that RATE_LIMIT_MODE=enforce is live in production: if this list
// goes stale, real Googlebot/Bingbot traffic can start getting caught by
// the rate limiter. Deliberately kept out of the request path — these
// ranges barely change, so fetching them per-request would just add
// latency (and a new failure mode) to every visitor for no benefit.
//
// If you still want an external cron as a redundant trigger, point it at
// https://www.jobmeter.app/api/cron/refresh-crawler-ips (the www form,
// not the bare domain) so it doesn't hit the redirect.

import { refreshCrawlerAllowlist } from '@/lib/crawler-allowlist';

export async function GET() {
  try {
    const { count } = await refreshCrawlerAllowlist();
    return Response.json({ success: true, rangesCached: count });
  } catch (error) {
    console.error('Failed to refresh crawler allowlist:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}

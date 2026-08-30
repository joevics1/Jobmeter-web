// app/api/cron/refresh-crawler-ips/route.ts
// Add this URL to cron-job.org, scheduled once daily:
// https://www.jobmeter.app/api/cron/refresh-crawler-ips
//
// Use the "www" form, not the bare "jobmeter.app" domain — the bare
// domain redirects (301) to www, and cron-job.org (like most cron
// services) doesn't follow redirects by default, so it was silently
// never actually hitting the route. Using the www URL directly avoids
// the redirect entirely.
//
// Refreshes the cached Google/Bing crawler CIDR ranges that middleware.ts
// uses to bypass rate limiting for verified crawlers. This matters more
// now that RATE_LIMIT_MODE=enforce is live in production: if this list
// goes stale, real Googlebot/Bingbot traffic can start getting caught by
// the rate limiter. Deliberately kept out of the request path — these
// ranges barely change, so fetching them per-request would just add
// latency (and a new failure mode) to every visitor for no benefit.

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

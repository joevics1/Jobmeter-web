// app/api/cron/refresh-crawler-ips/route.ts
// Add this URL to cron-jobs.org (same as your other cron jobs), scheduled
// once daily: https://yourdomain.com/api/cron/refresh-crawler-ips
// Refreshes the cached Google/Bing crawler CIDR ranges that middleware.ts
// uses to bypass rate limiting for verified crawlers. Deliberately kept out
// of the request path — these ranges barely change, so fetching them
// per-request would just add latency (and a new failure mode) to every
// visitor for no benefit.

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

import { NextRequest, NextResponse } from 'next/server';

// Runs on Vercel's Edge runtime rather than a Node serverless function —
// cheaper and faster for a simple "lookup + redirect" with no rendering.
export const runtime = 'edge';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  if (!code) {
    return NextResponse.redirect(siteUrl, 302);
  }

  try {
    // short_code is written to `jobs` (source of truth, via trigger + backfill).
    // `jobs_nigeria` is a mirror and may lag behind on that column, so we look
    // the code up against `jobs` and just redirect using the shared `slug`,
    // which the live job page resolves against `jobs_nigeria`.
    // Case-insensitive match so links still work regardless of how the code
    // was typed/cased — avoids sending real visitors to a dead end over a
    // case mismatch.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?short_code=ilike.${encodeURIComponent(code)}&select=slug&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const data = await res.json();
      const slug = data?.[0]?.slug;
      if (slug) {
        return NextResponse.redirect(`${siteUrl}/jobs/${slug}`, 302);
      }
    }
  } catch (error) {
    console.error('Short link lookup failed:', error);
  }

  // Code didn't resolve to anything (expired/removed job, bad code, etc.) —
  // send the visitor somewhere useful instead of a dead end.
  return NextResponse.redirect(`${siteUrl}/jobs`, 302);
}

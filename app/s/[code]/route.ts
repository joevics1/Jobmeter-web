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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs_nigeria?short_code=eq.${encodeURIComponent(code)}&select=slug&limit=1`,
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

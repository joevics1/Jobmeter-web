// app/api/geo/route.ts
// Uses Vercel's built-in geo headers — no external API, no rate limits, no cost
import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_CODE_TO_NAME } from '@/lib/countries';

export async function GET(request: NextRequest) {
  // Vercel automatically injects geo data into request headers
  const countryCode = request.headers.get('x-vercel-ip-country') || '';
  const country = COUNTRY_CODE_TO_NAME[countryCode] || null;

  // Previously this defaulted every unrecognized country code to 'Nigeria',
  // which silently mislabeled visitors from anywhere not in a 13-country
  // map (missing Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, India, Egypt,
  // and dozens more that ARE offered as manual filter options). If we don't
  // actually know the visitor's country, say so — the caller falls back to
  // 'Global' rather than a confident wrong guess.
  return NextResponse.json(
    { country, countryCode },
    {
      headers: {
        // Cache at CDN for 24hrs — country rarely changes per visitor
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
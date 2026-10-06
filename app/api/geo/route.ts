// app/api/geo/route.ts
// Uses Vercel's built-in geo headers — no external API, no rate limits, no cost
import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_CODE_TO_NAME } from '@/lib/countries';

export async function GET(request: NextRequest) {
  // Vercel automatically injects geo data into request headers
  // Site sits behind Cloudflare, which forwards the visitor's real country in
  // cf-ipcountry; x-vercel-ip-country would just be Cloudflare's edge location.
  const countryCode = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || '';
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
        // Answer depends on who is asking, so it must NOT be shared by a CDN
        // (a public cache would hand one visitor's country to everyone).
        // The client also remembers it in localStorage, so this runs once per browser.
        'Cache-Control': 'private, max-age=86400',
      },
    }
  );
}
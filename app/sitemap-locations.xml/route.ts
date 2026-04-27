import { createClient } from '@supabase/supabase-js';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

export async function GET() {
  const lines: string[] = [];
  const today = new Date().toISOString();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return xmlResponse(lines);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ✅ Filter by website_country = 'nigeria'
    const { data: statePages, error: stateError } = await supabase
      .from('location_state_pages')
      .select('country_slug, slug, full_path, updated_at, towns')
      .eq('is_active', true)
      .eq('website_country', 'nigeria');

    if (stateError) return xmlResponse(lines);

    for (const page of statePages || []) {
      const stateUrl = `${siteUrl}/jobs/Location/${page.full_path || `${page.country_slug}/${page.slug}`}`;
      lines.push(urlEntry(stateUrl, page.updated_at || today, 'daily', '0.8'));
      const towns: Array<{ slug: string; is_active: boolean; updated_at?: string }> = page.towns || [];
      for (const town of towns) {
        if (!town.is_active || !town.slug) continue;
        lines.push(urlEntry(`${stateUrl}/${town.slug}`, town.updated_at || today, 'daily', '0.7'));
      }
    }
  } catch (err) {
    return xmlResponse(lines);
  }
  return xmlResponse(lines);
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function xmlResponse(lines: string[]) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.length > 0 ? lines.join('\n') : `  <url><loc>${siteUrl}/jobs</loc><lastmod>${new Date().toISOString()}</lastmod></url>`}
</urlset>`;
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
export const revalidate = 3600;
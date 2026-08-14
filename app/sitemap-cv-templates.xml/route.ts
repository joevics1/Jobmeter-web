import { getAllPublishedRolePages } from '@/lib/cv-template-pages/data';

// Same reasoning as app/cv-templates/[role]/page.tsx — periodic
// revalidation instead of rendering fresh on every single request.
export const revalidate = 3600;

export async function GET() {
  const pages = await getAllPublishedRolePages('cv');

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>https://jobmeter.app/cv-templates/${p.role_slug}</loc>
    <lastmod>${p.updated_at}</lastmod>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

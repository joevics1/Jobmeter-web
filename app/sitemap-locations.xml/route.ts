import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jobmeter.app';

/**
 * Location sitemap - generates state and town pages
 * Place at: app/sitemap-locations/route.ts
 */
export async function GET() {
  const routes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not found');
      return new Response('Missing Supabase credentials', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch all job locations. Range overrides Supabase's default 1000-row cap.
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('location')
      .range(0, 9999);

    if (error) {
      console.error('Error fetching jobs for locations:', JSON.stringify(error));
      return new Response(`Error fetching jobs: ${error.message}`, { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      console.warn('No jobs found for location sitemap');
    } else {
      const states = new Set<string>();
      const stateTowns: { [key: string]: Set<string> } = {};

      for (const job of jobs) {
        try {
          // Skip null/undefined locations
          if (!job.location) continue;

          let state = '';
          let town = '';

          if (typeof job.location === 'string') {
            // Handle "City, State" string format
            const parts = job.location.split(',').map((p: string) => p.trim());
            if (parts.length >= 2) {
              town = parts[0];
              state = parts[1];
            } else if (parts.length === 1) {
              state = parts[0];
            }
          } else if (typeof job.location === 'object' && job.location !== null) {
            // Handle { state, city } object format
            state = String(job.location.state || '').trim();
            town = String(job.location.city || job.location.town || '').trim();
          }

          state = state.trim();
          town = town.trim();

          if (!state) continue;

          states.add(state);
          if (!stateTowns[state]) stateTowns[state] = new Set();
          if (town) stateTowns[state].add(town);

        } catch (parseErr) {
          // Skip individual bad location entries without crashing the whole sitemap
          console.warn('Skipping unparseable location:', job.location, parseErr);
          continue;
        }
      }

      // Add state pages
      states.forEach(state => {
        const formattedState = state.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (!formattedState) return;
        routes.push({
          url: `${siteUrl}/jobs/state/${formattedState}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });

      // Add town pages
      Object.keys(stateTowns).forEach(state => {
        const formattedState = state.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (!formattedState) return;

        stateTowns[state].forEach(town => {
          const formattedTown = town.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          if (!formattedTown) return;
          routes.push({
            url: `${siteUrl}/jobs/state/${formattedState}/${formattedTown}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
          });
        });
      });

      const totalTowns = Object.values(stateTowns).reduce((acc, t) => acc + t.size, 0);
      console.log(`📄 Location sitemap: ${states.size} states, ${totalTowns} towns`);
    }

  } catch (error) {
    console.error('Error generating location sitemap:', error);
    return new Response(`Error generating sitemap: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date(route.lastModified || new Date()).toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export const revalidate = 3600;
"use client";

// Compact "Related Tools" widget, rendered by each /tools/* page right
// after its own tool component and before its SEO content. Picks 5 tools
// at random, seeded by the current path so the set is stable on repeat
// visits/reloads but varies from page to page — deliberately small and
// single-container so it doesn't compete with the page's own content.

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS_NAV } from '@/lib/toolsNav';

// Tiny deterministic PRNG seeded from a string (mulberry32), so the same
// page always shows the same 5 tools without needing client-side state or
// risking a server/client hydration mismatch.
function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  let state = h >>> 0;
  const rand = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function RelatedToolsStrip() {
  const pathname = usePathname() || '/tools';
  const candidates = TOOLS_NAV.filter((t) => t.route !== pathname);
  const picks = seededShuffle(candidates, pathname).slice(0, 5);

  if (picks.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 pb-6">
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }}>
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b" style={{ borderColor: '#BFDBFE' }}>
          <Sparkles size={13} className="text-blue-600" />
          <h2 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Related Tools</h2>
        </div>
        <div className="divide-y" style={{ borderColor: '#DBEAFE' }}>
          {picks.map((tool) => (
            <Link
              key={tool.id}
              href={tool.route}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 bg-white/60 hover:bg-white transition-colors"
            >
              <span>{tool.title}</span>
              <ArrowRight size={13} className="text-blue-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
        <Link
          href="/tools"
          className="block px-4 py-2 text-xs font-medium text-blue-700 hover:bg-white transition-colors text-center border-t"
          style={{ borderColor: '#BFDBFE' }}
        >
          View all tools →
        </Link>
      </div>
    </section>
  );
}

"use client";

// Compact "Related Tools" widget shown at the bottom of every /tools/* page
// (wired in via app/tools/layout.tsx). Picks 5 tools at random, seeded by
// the current path so the set is stable on repeat visits/reloads but
// varies from page to page — deliberately small and single-container so
// it doesn't compete with the page's own content for attention.

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
    <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <Sparkles size={13} className="text-blue-600" />
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Related Tools</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {picks.map((tool) => (
            <Link
              key={tool.id}
              href={tool.route}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <span>{tool.title}</span>
              <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
        <Link
          href="/tools"
          className="block px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 text-center border-t border-gray-200"
        >
          View all tools →
        </Link>
      </div>
    </section>
  );
}

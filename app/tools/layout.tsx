// app/tools/layout.tsx
// Wraps every page under /tools/* (49 pages) so they all pick up the same
// "Explore more" cross-link block automatically — no need to edit each
// individual tool page. This is the main hub-and-spoke connector for the
// Tools cluster: every tool links back to the Tools hub, a few sibling
// tools in the same group, and out to the other clusters (Jobs, CV
// Templates, Blog) so link equity flows both ways instead of dead-ending.

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';
import { TOOL_GROUPS, getToolsByGroup } from '@/lib/toolsNav';

function RelatedToolsStrip() {
  // Rotate which group is featured based on the day so repeat visitors see
  // variety, while still being deterministic per build (no client JS needed).
  const dayIndex = new Date().getDate() % TOOL_GROUPS.length;
  const group = TOOL_GROUPS[dayIndex];
  const tools = getToolsByGroup(group.id).slice(0, 6);

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 pb-24">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">More {group.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.route}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {tool.title} <ArrowRight size={12} />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Link href="/tools" className="text-blue-600 hover:underline font-medium">
            All career tools →
          </Link>
          <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
            Browse jobs →
          </Link>
          <Link href="/cv-templates" className="text-blue-600 hover:underline font-medium">
            Free CV templates →
          </Link>
          <Link href="/blog" className="text-blue-600 hover:underline font-medium">
            Career blog →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <RelatedToolsStrip />
    </>
  );
}

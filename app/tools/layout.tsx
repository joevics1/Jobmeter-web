// app/tools/layout.tsx
// Wraps every page under /tools/* (49 pages) so they all pick up the same
// compact "Related Tools" widget automatically — no need to edit each
// individual tool page. See components/tools/RelatedToolsStrip.tsx for the
// widget itself (5 randomly-picked tools, seeded per-path, single small
// container).

import { ReactNode } from 'react';
import RelatedToolsStrip from '@/components/tools/RelatedToolsStrip';

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <RelatedToolsStrip />
    </>
  );
}

// app/tools/layout.tsx
// Each /tools/* page now renders <RelatedToolsStrip /> itself, right after
// its own tool component and before its SEO content (see
// components/tools/RelatedToolsStrip.tsx) — this layout used to also
// auto-append one at the very bottom of every page, which duplicated it.
// Layout is now just a plain passthrough.

import { ReactNode } from 'react';

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// app/cv-templates/history/layout.tsx
// The history page itself is a client component (reads localStorage), so
// it can't export `metadata` directly — a layout can, even for a client
// page below it. This is a personalized, per-browser list of saved CVs,
// not a content page, so it should stay out of the index. Only the role
// landing pages and the hub page should be indexable.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CVHistoryLayout({ children }: { children: ReactNode }) {
  return children;
}

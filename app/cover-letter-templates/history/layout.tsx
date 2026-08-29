// app/cover-letter-templates/history/layout.tsx
// Same reasoning as app/cv-templates/history/layout.tsx — the page itself
// is a client component (reads localStorage) so it can't export `metadata`
// directly, and this is a personalized, per-browser list, not a content
// page. Only the role landing pages and the hub page should be indexable.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CoverLetterHistoryLayout({ children }: { children: ReactNode }) {
  return children;
}

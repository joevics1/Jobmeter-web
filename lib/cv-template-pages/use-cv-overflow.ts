'use client';

import { useRef, useState } from 'react';

// Shared by every screen that renders a CV preview in an iframe and needs to
// know whether the content overflows the printable page (compares the
// iframe's .content scrollHeight vs clientHeight). Previously duplicated
// near-verbatim in build/client.tsx and [role]/client.tsx.
//
// Detection-only, deliberately: an earlier attempt at an actual
// transform:scale() shrink-to-fit (60737f5) was tried and reverted
// (588b99b) in this codebase. CVPreviewFrame's own comment calls its
// viewport-scaling approach "a different and much safer thing than the
// content-shrink script we tried and reverted earlier" — that's solving a
// different problem (narrow-screen responsiveness), not this one (content
// genuinely exceeding one page). Don't reintroduce content-level shrinking
// here without understanding why the original was reverted.
export function useCvOverflowCheck() {
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  function checkOverflow() {
    try {
      const doc = previewFrameRef.current?.contentDocument;
      const content = doc?.querySelector('.content') as HTMLElement | null;
      if (!content) {
        setIsOverflowing(false);
        return;
      }
      setIsOverflowing(content.scrollHeight > content.clientHeight + 3);
    } catch {
      setIsOverflowing(false);
    }
  }

  return { previewFrameRef, isOverflowing, checkOverflow };
}

'use client';

import { useRef, useState } from 'react';

// Same pattern as lib/cv-template-pages/use-cv-overflow.ts (detection-only,
// no shrink-to-fit — see that file's comment for why). Cover letter
// designs don't have a `.content` wrapper the way CV templates do — the
// whole `.page` div IS the content area, and it's already `overflow:
// hidden`, so scrollHeight still reports the true (pre-clip) content
// height while clientHeight reports the fixed 297mm page height.
export function useCoverLetterOverflowCheck() {
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  function checkOverflow() {
    try {
      const doc = previewFrameRef.current?.contentDocument;
      const page = doc?.querySelector('.page') as HTMLElement | null;
      if (!page) {
        setIsOverflowing(false);
        return;
      }
      setIsOverflowing(page.scrollHeight > page.clientHeight + 3);
    } catch {
      setIsOverflowing(false);
    }
  }

  return { previewFrameRef, isOverflowing, checkOverflow };
}

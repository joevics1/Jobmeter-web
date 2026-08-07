'use client';

// app/cv-templates/_components/cv-preview-frame.tsx
// Shared, responsive A4 preview. The rendered CV HTML is a fixed-size A4
// page (794x1123px at 96dpi) — on a narrow mobile screen that just
// overflows and becomes unreadable/unusable. This scales the whole iframe
// down to fit the actual container width (a standard "responsive iframe"
// technique — scaling the viewport, not the content inside it, which is a
// different and much safer thing than the content-shrink script we tried
// and reverted earlier).

import { useEffect, useRef, useState, forwardRef } from 'react';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const CVPreviewFrame = forwardRef<HTMLIFrameElement, {
  html: string;
  title: string;
  onLoad?: () => void;
}>(function CVPreviewFrame({ html, title, onLoad }, forwardedRef) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const width = wrapperRef.current?.offsetWidth;
      if (width) setScale(Math.min(1, width / A4_WIDTH_PX));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full" style={{ height: A4_HEIGHT_PX * scale, overflow: 'hidden' }}>
      <iframe
        ref={forwardedRef}
        title={title}
        srcDoc={html}
        onLoad={onLoad}
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
});

export default CVPreviewFrame;

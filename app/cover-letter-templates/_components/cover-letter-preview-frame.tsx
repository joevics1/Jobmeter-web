'use client';

// app/cover-letter-templates/_components/cover-letter-preview-frame.tsx
// Shared, responsive A4 preview — same viewport-scaling technique as
// app/cv-templates/_components/cv-preview-frame.tsx (scales the iframe
// itself down to fit its container, not the content inside it).

import { useEffect, useRef, useState, forwardRef } from 'react';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const CoverLetterPreviewFrame = forwardRef<HTMLIFrameElement, {
  html: string;
  title: string;
  onLoad?: () => void;
}>(function CoverLetterPreviewFrame({ html, title, onLoad }, forwardedRef) {
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

export default CoverLetterPreviewFrame;

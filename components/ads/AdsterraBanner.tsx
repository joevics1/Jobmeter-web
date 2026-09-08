'use client';

import { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  /** The 32-char key from the atOptions script Adsterra gives you. */
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Adsterra's standard ad tag works by setting a global `atOptions` variable,
 * then loading a script that reads it. That's fine for one ad per page, but
 * breaks down with several: whichever unit's script happens to run last can
 * clobber `atOptions` before an earlier unit's invoke.js has read it,
 * especially once React/Next.js is involved and plain top-to-bottom
 * synchronous <script> execution order isn't guaranteed the way it is in
 * static HTML.
 *
 * Rendering each unit inside its own <iframe> (via a hand-built srcDoc, not
 * Adsterra's own 'iframe' format option — that's a separate setting
 * controlling how *they* render the ad *inside* our iframe) gives each one
 * its own isolated `window`, so they can never collide regardless of load
 * order or timing.
 */
export default function AdsterraBanner({ adKey, width, height, className }: AdsterraBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <style>html,body{margin:0;padding:0;overflow:hidden;}</style>
  </head>
  <body>
    <script>
      atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    </script>
    <script src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
  </body>
</html>`);
    doc.close();
  }, [adKey, width, height]);

  return (
    <iframe
      ref={iframeRef}
      title="Advertisement"
      width={width}
      height={height}
      scrolling="no"
      style={{ border: 'none', display: 'block', maxWidth: '100%' }}
      className={className}
    />
  );
}

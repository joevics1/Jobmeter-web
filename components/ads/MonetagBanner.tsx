"use client";

import { useEffect } from 'react';

interface MonetagBannerProps {
  /** Monetag zone ID for this In-Page Push (Banner) placement. */
  zone: string;
}

/**
 * MonetagBanner — In-Page Push (Banner) ad unit from Monetag.
 *
 * Monetag's embed code creates its own <script> element and appends it to
 * <body> (falling back to <html>), rather than binding to a container div
 * the way AdSense's <ins> tag does — the script itself decides how/where
 * the creative renders once loaded. This component's only job is to inject
 * that exact script once per zone, and remove it again on unmount so
 * navigating away (client-side route change) doesn't leave a stale/duplicate
 * zone script running on a page it no longer applies to.
 *
 * Renders no visible markup itself.
 */
export default function MonetagBanner({ zone }: MonetagBannerProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Guard against double-injection (e.g. React StrictMode's dev double-
    // invoke, or the same zone appearing on two mounted pages at once).
    if (document.querySelector(`script[data-zone="${zone}"]`)) return;

    const script = document.createElement('script');
    (document.body || document.documentElement).appendChild(script);
    script.dataset.zone = zone;
    script.src = 'https://nap5k.com/tag.min.js';

    return () => {
      script.remove();
    };
  }, [zone]);

  return null;
}

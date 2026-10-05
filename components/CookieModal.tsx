"use client";

import React, { useState, useEffect } from 'react';
import { X, Cookie as CookieIcon } from 'lucide-react';

// Any page-level bar that's pinned to the bottom of the viewport (the
// mobile bottom nav, the CV/cover-letter builder action bars, the
// document editor toolbar, etc.) should mark itself with
// `data-app-bottom-bar` so this banner can sit above it instead of
// covering it — they previously shared the same fixed-bottom-0 spot and
// whichever mounted last (usually this banner, after its 5s delay) would
// hide the other one.
const BOTTOM_BAR_SELECTOR = '[data-app-bottom-bar]';

const CookieModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if user has already accepted cookies
    const checkCookieConsent = () => {
      const hasAccepted = localStorage.getItem('cookieAccepted');
      if (!hasAccepted) {
        setIsVisible(true);
      }
    };

    // Wait 5 seconds before checking cookie consent
    const timer = setTimeout(checkCookieConsent, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Recompute how far up the banner needs to sit whenever a bottom bar is
  // present. Bars can mount/unmount after this effect starts (e.g. the CV
  // builder's action bar only appears once a document has been generated),
  // so this watches the DOM rather than checking once.
  useEffect(() => {
    if (!isVisible) return;

    function recalcOffset() {
      const bars = Array.from(document.querySelectorAll<HTMLElement>(BOTTOM_BAR_SELECTOR));
      // Distance from the viewport bottom to the top edge of the highest bar,
      // so stacked bars (page action bar lifted above the bottom menu) are
      // both cleared, not just the tallest single one.
      const highest = bars.reduce((max, el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 ? Math.max(max, window.innerHeight - rect.top) : max;
      }, 0);
      setOffset(Math.max(0, Math.round(highest)));
    }

    recalcOffset();
    window.addEventListener('resize', recalcOffset);

    const observer = new MutationObserver(recalcOffset);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', recalcOffset);
      observer.disconnect();
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Store acceptance in localStorage
    localStorage.setItem('cookieAccepted', 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-0 right-0 bg-gray-900 text-white z-50 px-4 py-3 shadow-lg transition-[bottom] duration-150"
      style={{ bottom: offset }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <CookieIcon size={20} className="text-blue-400" />
          <span className="hidden sm:inline">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </span>
          <span className="sm:hidden">
            We use cookies to improve your experience.
          </span>
          <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline ml-1">
            Learn more
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
          >
            Accept
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
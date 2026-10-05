"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import CookieModal from '@/components/CookieModal';
import { theme } from '@/lib/theme';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { useAuth } from '@/context/AuthContext';

// One AuthModal instance for the entire site, mounted here and driven by
// AuthContext. Every "sign in" trigger anywhere on the site should call
// useAuth().openAuthModal() instead of rendering its own <AuthModal>.
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

export default function RootLayoutClient({
  children,
}: {
    children: React.ReactNode;
  }) {
  const pathname = usePathname();
  const { authModalOpen, authModalMode, closeAuthModal } = useAuth();

  // Force every route change to start at the top of the page. Next.js's
  // built-in scroll-to-top on navigation only reliably fires when the
  // matched layout segment actually remounts — pages that share a
  // persistent layout (e.g. everything under /tools/*, which has its own
  // layout.tsx) can otherwise keep the previous page's scroll position,
  // landing the user mid-page or at the bottom of a long page like the
  // quiz platform. This runs on every pathname change, site-wide, so no
  // individual page needs its own fix.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Bottom nav pages that show bottom navigation
  const bottomNavPages = ['/jobs', '/documents', '/cv', '/tools', '/settings', '/dashboard'];
  
  // The bottom menu now shows on every page, including job details and the
  // recruiter dashboard. Only the sign-in/onboarding flows and a live
  // mock-interview session hide it, so nothing pulls the user out mid-flow.
  const hideBottomNav =
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/onboarding') ||
    (pathname?.startsWith('/tools/interview/') && pathname !== '/tools/interview');

  // Hide header on bottom nav pages (mobile-style pages) — except /dashboard,
  // which shows both the header and bottom nav.
  const hideHeader = bottomNavPages.includes(pathname || '') && pathname !== '/dashboard';

  // Show footer on pages that don't have bottom nav
  const showFooter = !bottomNavPages.includes(pathname || '') && !hideBottomNav;

  // Don't load AdSense on sign-in/sign-up/onboarding/checkout flows.
  // AdSense's Auto Ads can show a full-page "vignette" interstitial on
  // navigation events, which can interrupt a Google OAuth redirect or a
  // Paystack checkout redirect mid-flow — moved here from the static
  // <head> in app/layout.tsx so it's conditional on the route.
  const adExcludedPrefixes = ['/auth', '/onboarding', '/talent'];
  // AdSense re-enabled 2026-09-13 with fresh ad units on the blog pages
  // (previous units retired after the restriction history). Manual
  // <AdUnit/> placements elsewhere on the site remain individually
  // commented out — only the two new blog units are live for now.
  const shouldLoadAds = !adExcludedPrefixes.some((p) => pathname?.startsWith(p));

  // Engagement gate: hold off loading the Auto ads script until the
  // visitor gives a genuine signal of reading the page. Two tiers:
  //
  // 1) WhatsApp in-app browser, detected via user-agent. This only
  //    catches share-link taps that open inside WhatsApp's own webview —
  //    a lot of WhatsApp-sourced traffic opens in the phone's default
  //    browser instead, where this signal isn't visible at all. Still
  //    worth using as one extra layer, on top of tier 2 below, not
  //    instead of it. For these sessions specifically: no ads on the
  //    first page view unless the visitor navigates to a second page,
  //    or stays 10+ seconds on the first page — whichever comes first.
  //
  // 2) Everyone else (including WhatsApp taps that land in a regular
  //    browser, invisible to the check above): 10+ seconds dwell, or
  //    scrolling past 25% of the page, whichever comes first.
  //
  // Both tiers live at the RootLayoutClient level, which mounts once per
  // hard page load and stays mounted across client-side navigation — so
  // this is a once-per-tab-session gate, not once-per-page-view. Only a
  // fresh hard reload resets it, which is the right moment to re-check,
  // since that's equivalent to a brand new landing.
  const [adsUnlocked, setAdsUnlocked] = useState(false);
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);
  const initialPathnameRef = useRef(pathname);
  const isWhatsAppUARef = useRef(false);

  // Detect WhatsApp's in-app browser once, on mount.
  useEffect(() => {
    isWhatsAppUARef.current = /WhatsApp/i.test(navigator.userAgent);
  }, []);

  // Track whether the visitor has moved to a second page since landing —
  // on its own this unlocks ads for tier 1 (WhatsApp UA) sessions.
  useEffect(() => {
    if (pathname !== initialPathnameRef.current) {
      setHasNavigatedAway(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (adsUnlocked) return;
    if (hasNavigatedAway && isWhatsAppUARef.current) {
      setAdsUnlocked(true);
    }
  }, [hasNavigatedAway, adsUnlocked]);

  // Timer-based unlock path — 10s for tier 1, 10s (or 25% scroll) for
  // tier 2. Runs once per "not yet unlocked" state; re-runs are guarded
  // by the adsUnlocked check above and the dependency array below.
  useEffect(() => {
    if (adsUnlocked) return;

    let resolved = false;
    const unlock = () => {
      if (resolved) return;
      resolved = true;
      setAdsUnlocked(true);
    };

    if (isWhatsAppUARef.current) {
      const timerId = window.setTimeout(unlock, 10000);
      return () => window.clearTimeout(timerId);
    }

    const timerId = window.setTimeout(unlock, 10000);
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return; // page too short to scroll — rely on the timer only
      const scrolledFraction = window.scrollY / scrollableHeight;
      if (scrolledFraction >= 0.25) {
        unlock();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [adsUnlocked]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.background.DEFAULT }}>
      {/* Google AdSense — re-enabled 2026-09-13 with fresh blog ad units. */}
      {shouldLoadAds && adsUnlocked && (
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1119289641389825"
          crossOrigin="anonymous"
        />
      )}

      {/* Header - hidden on bottom nav pages */}
      {!hideHeader && <Header />}

      {/* Main content with bottom padding for nav (unless hidden) */}
      <main 
        className="flex-1" 
        style={{ 
          backgroundColor: theme.colors.background.muted,
          paddingBottom: hideBottomNav && !showFooter ? '0' : '80px',
          paddingTop: hideHeader ? '0px' : undefined
        }}
      >
        {children}
      </main>
      
      {/* Bottom Navigation - hidden on job details and auth pages */}
      {!hideBottomNav && <BottomNavigation />}
      
      {/* Footer - shown on pages without bottom nav */}
      {showFooter && (
        // Keep the footer clear of the fixed bottom menu (h-16 = 64px).
        <div style={{ paddingBottom: hideBottomNav ? 0 : '64px' }}>
          <Footer />
        </div>
      )}
      
       {/* Cookie Modal */}
      <CookieModal />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Single site-wide Auth Modal, controlled by AuthContext */}
      {authModalOpen && (
        <AuthModal open={authModalOpen} onOpenChange={closeAuthModal} defaultMode={authModalMode} />
      )}
    </div>
  );
}
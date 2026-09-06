"use client";

import React, { useEffect, useState } from 'react';
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
  
  // Hide bottom nav on job details pages and auth/onboarding pages
  const hideBottomNav = 
    (pathname?.startsWith('/jobs/') && pathname !== '/jobs') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/onboarding') ||
    (pathname?.startsWith('/dashboard') && pathname !== '/dashboard') ||
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
  // Ad pause lifted 2026-09-01 — AdSense's "limited ad serving" status
  // cleared. Script re-enabled so Auto ads can run; manual <AdUnit/>
  // placements site-wide remain individually commented out (see each
  // file for re-enable instructions) as part of a deliberately
  // conservative, Auto-ads-only rollout for the next couple of weeks.
  const shouldLoadAds = !adExcludedPrefixes.some((p) => pathname?.startsWith(p));

  // Engagement gate: hold off loading the Auto ads script until the
  // visitor gives a genuine signal of reading the page — 5+ seconds of
  // dwell time, or scrolling past 25% of the page, whichever comes
  // first. This isn't specific to any one traffic source; it's meant to
  // filter out accidental taps and instant bounces site-wide (relevant
  // given the CTR anomaly seen around the Aug 2026 AdSense restriction).
  //
  // Because this state lives here in RootLayoutClient — which mounts
  // once per hard page load and stays mounted across client-side
  // navigation — the gate applies once per browser tab/session, not
  // once per page view. A visitor who lands via a fresh link (e.g.
  // tapped from WhatsApp) has to clear the gate once; after that,
  // clicking around the site normally won't re-trigger it. Only a fresh
  // hard reload resets it, which is the right moment to re-check, since
  // that's equivalent to a brand new landing.
  const [adsUnlocked, setAdsUnlocked] = useState(false);

  useEffect(() => {
    if (adsUnlocked) return;

    let resolved = false;
    const unlock = () => {
      if (resolved) return;
      resolved = true;
      setAdsUnlocked(true);
    };

    const timerId = window.setTimeout(unlock, 5000);

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
      {showFooter && <Footer />}
      
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
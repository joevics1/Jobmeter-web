"use client";

import React, { useEffect } from 'react';
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
  const shouldLoadAds = !adExcludedPrefixes.some((p) => pathname?.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.background.DEFAULT }}>
      {shouldLoadAds && (
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
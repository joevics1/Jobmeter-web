"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Briefcase, Building2, FileText, BookOpen, Wrench, Settings, ChevronRight,
  ChevronDown, Send, Users, LogIn, LayoutDashboard, Bookmark, Newspaper, Tag, Megaphone,
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePendingInvitationsCount } from '@/hooks/usePendingInvitationsCount';
import { useAuth } from '@/context/AuthContext';

type NavItem = { label: string; href: string; icon: React.ElementType; description?: string };

// Primary links for job seekers — the core of the site.
const mainNav: NavItem[] = [
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Companies', href: '/company', icon: Building2 },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'CV & Docs', href: '/docs', icon: FileText },
  { label: 'Resources', href: '/resource', icon: BookOpen },
  { label: 'Blog', href: '/blog', icon: Newspaper },
];

// Everything a recruiter/employer needs, grouped so it doesn't crowd the bar.
const employerNav: NavItem[] = [
  { label: 'Post a Job', href: '/submit', icon: Send, description: 'Reach candidates across Nigeria & the Gulf' },
  { label: 'Find Talent', href: '/talent', icon: Users, description: 'Browse and invite matched candidates' },
  { label: 'Rates & Advertising', href: '/rates', icon: Tag, description: 'Plans, featured jobs and ad options' },
];

// Signed-in account links (shown in the mobile drawer; Dashboard + Settings
// also appear in the desktop bar).
const accountNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Saved Jobs', href: '/saved', icon: Bookmark },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [employerOpen, setEmployerOpen] = useState(false);
  const employerRef = useRef<HTMLDivElement>(null);
  const pendingInvitations = usePendingInvitationsCount();

  // loading = still checking, so we don't flash "Log In" for a signed-in
  // visitor while the session check is in flight.
  const { isSignedIn, loading, openAuthModal } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && !!pathname?.startsWith(href + '/'));
  const employerActive = employerNav.some((i) => isActive(i.href));

  // Close menus on route change.
  useEffect(() => {
    setEmployerOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close the employer dropdown on outside click / Escape.
  useEffect(() => {
    if (!employerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (employerRef.current && !employerRef.current.contains(e.target as Node)) {
        setEmployerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEmployerOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [employerOpen]);

  const badge = (size: 'sm' | 'md') => (
    <span
      className={`absolute rounded-full flex items-center justify-center font-bold text-white ${
        size === 'sm'
          ? '-top-1.5 -right-1.5 min-w-[15px] h-[15px] px-0.5 text-[9px]'
          : '-top-1 -right-1.5 min-w-[16px] h-4 px-1 text-[10px]'
      }`}
      style={{ backgroundColor: '#DC2626' }}
    >
      {pendingInvitations > 9 ? '9+' : pendingInvitations}
    </span>
  );

  const desktopLinkClass = (active: boolean) =>
    `flex items-center gap-2 px-2.5 lg:px-3 py-2 rounded-lg transition-colors duration-200 ${
      active ? '' : 'hover:bg-gray-100'
    }`;
  const desktopLinkStyle = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? theme.colors.primary.DEFAULT : 'transparent',
    color: active ? '#FFFFFF' : theme.colors.text.primary,
  });

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
        style={{ borderColor: theme.colors.border.DEFAULT }}
      >
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
            JobMeter
          </Link>

          {/* Right side: desktop nav + account / mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} className={desktopLinkClass(active)} style={desktopLinkStyle(active)}>
                    <Icon size={18} className="hidden xl:block" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* For Employers dropdown */}
              <div className="relative" ref={employerRef}>
                <button
                  onClick={() => setEmployerOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={employerOpen}
                  className={desktopLinkClass(employerActive)}
                  style={desktopLinkStyle(employerActive)}
                >
                  <Megaphone size={18} className="hidden xl:block" />
                  <span className="text-sm font-medium">For Employers</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${employerOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {employerOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg py-2"
                    style={{ borderColor: theme.colors.border.DEFAULT }}
                  >
                    {employerNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <Icon size={20} className="mt-0.5 shrink-0" style={{ color: theme.colors.primary.DEFAULT }} />
                          <span>
                            <span className="block text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-xs" style={{ color: theme.colors.text.secondary }}>
                                {item.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop account area */}
            {!loading && isSignedIn && (
              <div className="hidden md:flex items-center gap-1 ml-1 pl-2 border-l" style={{ borderColor: theme.colors.border.DEFAULT }}>
                <Link
                  href="/dashboard"
                  className={desktopLinkClass(isActive('/dashboard'))}
                  style={desktopLinkStyle(isActive('/dashboard'))}
                >
                  <LayoutDashboard size={18} className="hidden xl:block" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/settings"
                  aria-label="Settings"
                  className={`relative p-2 rounded-lg transition-colors ${isActive('/settings') ? '' : 'hover:bg-gray-100'}`}
                  style={desktopLinkStyle(isActive('/settings'))}
                >
                  <Settings size={20} />
                  {pendingInvitations > 0 && badge('sm')}
                </Link>
              </div>
            )}

            {!loading && !isSignedIn && (
              <button
                onClick={() => openAuthModal('signin')}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                style={{ borderColor: theme.colors.primary.DEFAULT, color: theme.colors.primary.DEFAULT }}
              >
                <LogIn size={16} />
                Log In
              </button>
            )}

            {/* Mobile Menu Button - visible only on mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden relative p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} style={{ color: theme.colors.text.primary }} />
              {pendingInvitations > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: '#DC2626' }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-xl overflow-y-auto"
            style={{ animation: 'slideIn 0.2s ease-out' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b sticky top-0 bg-white">
              <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} style={{ color: theme.colors.text.primary }} />
              </button>
            </div>

            <nav className="py-2 pb-8">
              {!loading && !isSignedIn && (
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('signin'); }}
                  className="w-full flex items-center gap-3 px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <LogIn size={22} style={{ color: theme.colors.primary.DEFAULT }} />
                  <span className="text-base font-medium" style={{ color: theme.colors.primary.DEFAULT }}>
                    Log In
                  </span>
                </button>
              )}

              <MobileSection title="Explore" items={mainNav} isActive={isActive} onNavigate={() => setMobileMenuOpen(false)} />
              <MobileSection title="For Employers" items={employerNav} isActive={isActive} onNavigate={() => setMobileMenuOpen(false)} />
              {!loading && isSignedIn && (
                <MobileSection
                  title="Account"
                  items={accountNav}
                  isActive={isActive}
                  onNavigate={() => setMobileMenuOpen(false)}
                  badgeHref="/settings"
                  badgeNode={pendingInvitations > 0 ? badge('md') : null}
                />
              )}
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16" />
    </>
  );
}

function MobileSection({
  title, items, isActive, onNavigate, badgeHref, badgeNode,
}: {
  title: string;
  items: NavItem[];
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  badgeHref?: string;
  badgeNode?: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <p
        className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide"
        style={{ color: theme.colors.text.muted }}
      >
        {title}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between px-4 py-3.5 transition-colors duration-200 ${active ? '' : 'hover:bg-gray-50'}`}
            style={{
              backgroundColor: active ? `${theme.colors.primary.DEFAULT}10` : 'transparent',
              borderLeft: active ? `4px solid ${theme.colors.primary.DEFAULT}` : '4px solid transparent',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="relative">
                <Icon
                  size={22}
                  style={{ color: active ? theme.colors.primary.DEFAULT : theme.colors.text.secondary }}
                />
                {badgeHref === item.href && badgeNode}
              </span>
              <span
                className="text-base font-medium"
                style={{ color: active ? theme.colors.primary.DEFAULT : theme.colors.text.primary }}
              >
                {item.label}
              </span>
            </div>
            <ChevronRight size={20} style={{ color: theme.colors.text.muted }} />
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Briefcase, FileText, BookOpen, Wrench, Settings, ChevronRight, Send, Users, LogIn } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePendingInvitationsCount } from '@/hooks/usePendingInvitationsCount';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Post Job', href: '/submit', icon: Send },
  { label: 'Talent', href: '/talent', icon: Users },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'Resources', href: '/resource', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingInvitations = usePendingInvitationsCount();

  // loading = still checking, so we don't flash "Log In" for a signed-in
  // visitor while the session check is in flight.
  const { isSignedIn, loading, openAuthModal } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
        style={{ borderColor: theme.colors.border.DEFAULT }}
      >
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold"
            style={{ color: theme.colors.primary.DEFAULT }}
          >
            JobMeter
          </Link>

          {/* Right side: desktop nav + Log In / mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      transition-colors duration-200
                      ${active
                        ? ''
                        : 'hover:bg-gray-100'
                      }
                    `}
                    style={{
                      backgroundColor: active ? theme.colors.primary.DEFAULT : 'transparent',
                      color: active ? '#FFFFFF' : theme.colors.text.primary,
                    }}
                  >
                    <span className="relative">
                      <Icon size={18} />
                      {item.href === '/settings' && pendingInvitations > 0 && (
                        <span
                          className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: '#DC2626' }}
                        >
                          {pendingInvitations > 9 ? '9+' : pendingInvitations}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

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
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} style={{ color: theme.colors.text.primary }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-xl"
            style={{ animation: 'slideIn 0.2s ease-out' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
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

            {/* Drawer Content */}
            <nav className="py-4">
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-4
                      transition-colors duration-200
                      ${active
                        ? ''
                        : 'hover:bg-gray-50'
                      }
                    `}
                    style={{
                      backgroundColor: active ? `${theme.colors.primary.DEFAULT}10` : 'transparent',
                      borderLeft: active ? `4px solid ${theme.colors.primary.DEFAULT}` : '4px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative">
                        <Icon
                          size={22}
                          style={{
                            color: active
                              ? theme.colors.primary.DEFAULT
                              : theme.colors.text.secondary,
                          }}
                        />
                        {item.href === '/settings' && pendingInvitations > 0 && (
                          <span
                            className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: '#DC2626' }}
                          >
                            {pendingInvitations > 9 ? '9+' : pendingInvitations}
                          </span>
                        )}
                      </span>
                      <span
                        className="text-base font-medium"
                        style={{
                          color: active
                            ? theme.colors.primary.DEFAULT
                            : theme.colors.text.primary,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      style={{ color: theme.colors.text.muted }}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16" />
    </>
  );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, BookOpen, Wrench, Settings } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePendingInvitationsCount } from '@/hooks/usePendingInvitationsCount';

export default function BottomNavigation() {
  const pathname = usePathname();
  const pendingInvitations = usePendingInvitationsCount();

  const navItems = [
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'CV & Docs', href: '/docs', icon: FileText },
    { label: 'Tools', href: '/tools', icon: Wrench },
    { label: 'Resources', href: '/resource', icon: BookOpen },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Highlight the matching section on nested pages too, e.g. /jobs/<slug>
  // keeps "Jobs" active and /tools/<tool> keeps "Tools" active.
  const sectionPrefixes: Record<string, string[]> = {
    '/jobs': ['/jobs'],
    '/docs': ['/docs', '/cv', '/documents'],
    '/tools': ['/tools'],
    '/resource': ['/resource'],
    '/settings': ['/settings'],
  };
  const isActive = (href: string) =>
    (sectionPrefixes[href] || [href]).some(
      (prefix) => pathname === prefix || pathname?.startsWith(prefix + '/')
    );

  return (
    <nav
      aria-label="Main navigation"
      data-app-bottom-bar="true"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t"
      style={{
        borderColor: theme.colors.border.DEFAULT,
        backgroundColor: theme.colors.background.DEFAULT,
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`
                flex flex-col items-center justify-center 
                flex-1 h-full transition-colors duration-200
                ${active ? '' : 'hover:bg-gray-50'}
              `}
            >
              <span className="relative mb-1">
                <Icon
                  size={24}
                  className="transition-colors duration-200"
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
                className="text-xs font-medium transition-colors duration-200"
                style={{
                  color: active
                    ? theme.colors.primary.DEFAULT
                    : theme.colors.text.secondary,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

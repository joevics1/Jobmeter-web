"use client";

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { LogOut, Briefcase } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Recruiter pages, and the redesigned main dashboard, render their own
  // full-page UI — no legacy chrome needed here. The main dashboard now
  // relies on the site-wide Header/BottomNavigation (see RootLayoutClient),
  // same as /jobs and /settings, instead of this layout's own header bar.
  if (pathname?.startsWith('/dashboard/recruiter') || pathname === '/dashboard') {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Note: this used to carry a 7-tab bar (Applied Jobs, Career Coach, CV Review,
  // Interview Prep, LinkedIn Insights, Saved Jobs) — all dead links to pages that
  // were never built (only /dashboard and /dashboard/profile actually exist).
  // Removed, same fix as applied to jobmeter-gulf.
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">JobMeter</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

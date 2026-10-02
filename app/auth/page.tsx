"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import RecruiterAuthModal from '@/components/RecruiterAuthModal';
import { theme } from '@/lib/theme';

// This route exists purely to host the sign-in/sign-up modal for pages that
// need to send an unauthenticated visitor somewhere ("/auth?redirect=/submit",
// "/auth?redirect=/apply/123", etc). It was never actually built — every
// one of those redirects was hitting Next's default 404 instead.
export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  // Recruiters (e.g. coming from /submit) get their own modal: no onboarding.
  const RECRUITER_PATHS = ['/submit', '/dashboard/recruiter', '/company/register', '/rates'];
  const isRecruiter =
    searchParams.get('role') === 'recruiter' ||
    RECRUITER_PATHS.some((p) => redirectTo === p || redirectTo.startsWith(p + '/') || redirectTo.startsWith(p + '?'));

  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Already signed in (e.g. came back to this URL directly) — no need
    // to show the modal at all, just continue on.
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      if (user) {
        router.replace(redirectTo);
      } else {
        setChecking(false);
        setOpen(true);
      }
    });

    // Fires as soon as sign-in/sign-up succeeds inside the modal —
    // AuthContext's own listener handles updating the rest of the app,
    // this is just what gets the person to where they were headed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace(redirectTo);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [redirectTo, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background.muted }}>
      {!checking && (isRecruiter ? (
        <RecruiterAuthModal
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) router.push('/');
          }}
          defaultMode={searchParams.get('mode') === 'signin' ? 'signin' : 'signup'}
          redirectTo={redirectTo}
        />
      ) : (
        <AuthModal
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            // Closed without signing in — nothing to return them to.
            if (!next) router.push('/');
          }}
          defaultMode={mode}
        />
      ))}
    </div>
  );
}

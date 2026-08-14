"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Recruiters are routed here too (RecruiterAuthModal passes ?role=recruiter
    // through the OAuth redirect) since Google doesn't let us attach custom
    // metadata to the sign-in request itself.
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    // Set by the SIGN-IN (not signup) Google button, so a returning user
    // lands back where they were instead of always on a fixed page —
    // e.g. signing in from a job listing to apply should return there.
    const returnTo = params.get("returnTo");

    // With implicit flow, Supabase automatically parses the hash fragment
    // (#access_token=...) because detectSessionInUrl: true is set in supabase.ts.
    // We just need to wait for the SIGNED_IN event, then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          subscription.unsubscribe();

          if (role === "recruiter") {
            // Best-effort: make sure this profile is actually marked as a
            // recruiter. The on_auth_user_created DB trigger always creates
            // a profiles row first (it fires on the auth.users insert,
            // before this client-side code ever runs) and defaults
            // user_type to 'seeker' since Google's OAuth payload has no way
            // to carry our custom user_type metadata. So the row already
            // exists by now — we still need to correct its user_type, not
            // just insert one when it's missing (which was the bug: that
            // branch never ran, so Google-signed-up recruiters stayed
            // 'seeker' forever). Never blocks the redirect if it fails.
            try {
              await supabase
                .from("profiles")
                .update({ user_type: "recruiter" })
                .eq("id", session.user.id);
            } catch (err) {
              console.error("Recruiter profile setup error:", err);
            }

            router.replace("/submit");
            return;
          }

          const { data: onboarding } = await supabase
            .from("onboarding_data")
            .select("user_id")
            .eq("user_id", session.user.id)
            .single();

          if (!onboarding) {
            // Brand-new user — always finish onboarding first, no matter
            // where they started the sign-in from.
            router.replace("/onboarding");
            return;
          }

          const isUsableReturnTo = returnTo && returnTo !== "/" && !returnTo.startsWith("/auth") && !returnTo.startsWith("/onboarding");
          router.replace(isUsableReturnTo ? returnTo : "/dashboard");
        }
      }
    );

    // Safety fallback: if no SIGNED_IN fires in time, go back to the
    // homepage so they can retry — /auth doesn't exist (it was a dead,
    // unused page, since removed). Widened from 5s to 10s: this timeout
    // was firing on real signups even when the OAuth login itself
    // succeeded, most likely because heavy third-party ad scripts
    // (AdSense/AdMaven, loaded site-wide including on this page) can
    // delay JS execution enough to blow past a tight 5s window before
    // Supabase's client-side SIGNED_IN event ever fires.
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      router.replace(returnTo && returnTo !== "/" ? returnTo : "/");
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4" />
        <p className="text-slate-600">Signing you in...</p>
      </div>
    </div>
  );
}
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

    // With implicit flow, Supabase automatically parses the hash fragment
    // (#access_token=...) because detectSessionInUrl: true is set in supabase.ts.
    // We just need to wait for the SIGNED_IN event, then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          subscription.unsubscribe();

          if (role === "recruiter") {
            // Best-effort: make sure a recruiter profile row exists, same as
            // the password sign-up flow. Never blocks the redirect if it fails.
            try {
              const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", session.user.id)
                .single();

              if (!existingProfile) {
                await supabase.from("profiles").insert([{
                  id: session.user.id,
                  email: session.user.email,
                  user_type: "recruiter",
                }]);
              }
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

          router.replace(onboarding ? "/settings" : "/onboarding");
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
      router.replace("/");
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
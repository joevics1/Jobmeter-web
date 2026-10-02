"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy standalone recruiter signup page. Recruiter sign-in/sign-up now lives
// in RecruiterAuthModal (hosted by /auth), so any old links land there.
export default function RecruiterAuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auth?role=recruiter&redirect=/submit');
  }, [router]);
  return null;
}

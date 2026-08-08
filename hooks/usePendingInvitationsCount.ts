'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Pending job-invitation count for the signed-in candidate, used to show a
 * notification badge (Settings nav, bottom nav) until email/push exists.
 * Re-checks whenever the route changes, so responding to an invite on
 * /invitations and navigating away refreshes the badge elsewhere.
 */
export function usePendingInvitationsCount() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (active) setCount(0); return; }
      const { count: pendingCount } = await supabase
        .from('job_invitations')
        .select('id', { count: 'exact', head: true })
        .eq('candidate_id', session.user.id)
        .eq('status', 'pending');
      if (active) setCount(pendingCount || 0);
    })();
    return () => { active = false; };
  }, [pathname]);

  return count;
}

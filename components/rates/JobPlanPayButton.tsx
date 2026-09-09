"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { usePaystack } from '@/hooks/usePaystack';
import { JOB_POSTING_PLANS, JobPostingPlanId } from '@/lib/constants/jobPricing';

export default function JobPlanPayButton({ planId, highlight }: { planId: JobPostingPlanId; highlight?: boolean }) {
  const router = useRouter();
  const { initializePayment, loading, error } = usePaystack();
  const [checkingAuth, setCheckingAuth] = useState(false);

  const handlePay = async () => {
    setCheckingAuth(true);
    const { data: { session } } = await supabase.auth.getSession();
    setCheckingAuth(false);

    if (!session?.user?.email) {
      router.push('/auth?redirect=/rates');
      return;
    }

    const plan = JOB_POSTING_PLANS[planId];
    await initializePayment({
      email: session.user.email,
      amount: plan.amount,
      paymentType: 'job_listing',
      planType: planId,
      callback_url: `${window.location.origin}/payment/callback?redirect=${encodeURIComponent('/dashboard/recruiter/jobs')}`,
    });
  };

  const busy = loading || checkingAuth;

  return (
    <div className="mt-4">
      <button
        onClick={handlePay}
        disabled={busy}
        className="w-full py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        style={
          highlight
            ? { backgroundColor: theme.colors.primary.DEFAULT, color: '#fff' }
            : { backgroundColor: `${theme.colors.primary.DEFAULT}12`, color: theme.colors.primary.DEFAULT }
        }
      >
        {busy && <Loader2 size={15} className="animate-spin" />}
        {busy ? 'Redirecting...' : 'Pay with Paystack'}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

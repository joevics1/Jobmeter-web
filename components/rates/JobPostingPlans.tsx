"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { JOB_POSTING_PLANS, FREE_ACTIVE_JOB_LIMIT, JobPostingPlanId } from '@/lib/constants/jobPricing';
import JobPlanPayButton from './JobPlanPayButton';

// Maps a JOB_POSTING_PLANS key to the plan_type string actually stored on
// user_subscriptions once paid for (see paymentService.ts's webhook).
const SUBSCRIPTION_PLAN_TYPE: Record<JobPostingPlanId, string> = {
  starter_monthly: 'job_posting_starter',
  basic_monthly: 'job_posting_basic',
  unlimited_monthly: 'job_posting_unlimited',
};

function PlanCard({
  title, price, sublabel, features, highlight, cta,
}: {
  title: string; price: string; sublabel?: string; features: string[]; highlight?: boolean;
  cta: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border ${highlight ? 'border-2 shadow-lg' : 'border-gray-100 shadow-sm'} bg-white flex flex-col`}
      style={highlight ? { borderColor: theme.colors.primary.DEFAULT } : undefined}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>{price}</p>
      {sublabel && <p className="text-xs text-gray-500 mb-4">{sublabel}</p>}
      <ul className="space-y-2 mt-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: theme.colors.success }} />
            {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}

export default function JobPostingPlans() {
  const [loading, setLoading] = useState(true);
  const [currentPlanType, setCurrentPlanType] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_subscriptions')
        .select('plan_type, expires_at')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .in('plan_type', Object.values(SUBSCRIPTION_PLAN_TYPE))
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setCurrentPlanType(data?.plan_type || null);
      setExpiresAt(data?.expires_at || null);
      setLoading(false);
    })();
  }, []);

  const renderCta = (planId: JobPostingPlanId, highlight?: boolean) => {
    if (loading) {
      return (
        <div className="mt-4 w-full py-2.5 flex items-center justify-center">
          <Loader2 size={16} className="animate-spin text-gray-300" />
        </div>
      );
    }
    const isCurrent = currentPlanType === SUBSCRIPTION_PLAN_TYPE[planId];
    if (isCurrent) {
      return (
        <div className="mt-4">
          <div
            className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
            style={{ backgroundColor: `${theme.colors.success}15`, color: theme.colors.success }}
          >
            <CheckCircle2 size={15} /> Current Plan
          </div>
          {expiresAt && (
            <p className="text-center text-xs text-gray-400 mt-1.5">
              Renews or expires {new Date(expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    }
    // Signed in with a different active paid plan — same flow, different label.
    const label = currentPlanType ? 'Switch to this plan' : 'Subscribe';
    return <JobPlanPayButton planId={planId} highlight={highlight} label={label} />;
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📮</span>
        <h2 className="text-lg font-semibold text-gray-900">Job Posting Rates</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PlanCard
          title="Free"
          price="₦0"
          features={[
            `${FREE_ACTIVE_JOB_LIMIT} active job listing at a time`,
            'No expiry while active',
            'Standard visibility in listings',
            'Shared across our WhatsApp, Telegram, LinkedIn & Facebook groups, plus other job sites',
          ]}
          cta={
            <Link
              href="/submit"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm border"
              style={{ borderColor: theme.colors.primary.DEFAULT, color: theme.colors.primary.DEFAULT }}
            >
              Post a Job
            </Link>
          }
        />
        <PlanCard
          title={JOB_POSTING_PLANS.starter_monthly.label}
          price={`₦${JOB_POSTING_PLANS.starter_monthly.amount.toLocaleString()}`}
          sublabel="per month"
          features={[
            'Same active-job limit as Free',
            'Free Talent Pool access included',
            'Shared across our WhatsApp, Telegram, LinkedIn & Facebook groups, plus other job sites',
          ]}
          cta={renderCta('starter_monthly')}
        />
        <PlanCard
          title={JOB_POSTING_PLANS.basic_monthly.label}
          price={`₦${JOB_POSTING_PLANS.basic_monthly.amount.toLocaleString()}`}
          sublabel="per month"
          features={[
            'Free Talent Pool access included',
            'Renews monthly',
            'Shared across our WhatsApp, Telegram, LinkedIn & Facebook groups, plus other job sites',
          ]}
          highlight
          cta={renderCta('basic_monthly', true)}
        />
        <PlanCard
          title={JOB_POSTING_PLANS.unlimited_monthly.label}
          price={`₦${JOB_POSTING_PLANS.unlimited_monthly.amount.toLocaleString()}`}
          sublabel="per month"
          features={[
            'No cap on active jobs',
            'Free Talent Pool access included',
            'Best for high-volume hiring',
            'Shared across our WhatsApp, Telegram, LinkedIn & Facebook groups, plus other job sites',
          ]}
          cta={renderCta('unlimited_monthly')}
        />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
        <Sparkles size={13} style={{ color: theme.colors.accent.gold }} />
        Any paid job posting plan also unlocks free, unlimited Talent Pool access — no separate fee.
      </p>
    </section>
  );
}

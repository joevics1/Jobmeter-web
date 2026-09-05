import { createClient } from '@supabase/supabase-js';
import { FREE_ACTIVE_JOB_LIMIT, JOB_POSTING_PLANS } from '@/lib/constants/jobPricing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Submission states that still "count" against the limit even though they
// aren't a live job yet — otherwise a user could queue up unlimited pending
// submissions to dodge the cap while waiting on processing/review.
const PENDING_SUBMISSION_STATUSES = ['pending', 'processing', 'ai_processed'];

export interface JobQuota {
  activeCount: number;
  pendingCount: number;
  used: number;
  planCap: number; // Number.POSITIVE_INFINITY if unlimited subscription
  unlimited: boolean;
  subscriptionPlan: 'job_posting_basic' | 'job_posting_unlimited' | null;
  availableCredits: number;
  canPublish: boolean;
  // true when publishing would consume a single-post credit rather than
  // fit within the free/subscribed cap
  willUseCredit: boolean;
}

export async function getJobQuota(userId: string): Promise<JobQuota> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const [{ data: profile }, { data: activeJobs }, { data: pendingSubmissions }, { data: subscription }] =
    await Promise.all([
      supabase.from('profiles').select('extra_job_slots').eq('id', userId).maybeSingle(),
      supabase
        .from('jobs')
        .select('duplicate_check')
        .eq('posted_by_user_id', userId)
        .eq('status', 'active'),
      supabase
        .from('user_submitted_jobs')
        .select('duplicate_check')
        .eq('user_id', userId)
        .in('status', PENDING_SUBMISSION_STATUSES),
      supabase
        .from('user_subscriptions')
        .select('plan_type, expires_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .in('plan_type', ['job_posting_basic', 'job_posting_unlimited'])
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const activeCount = activeJobs?.length || 0;

  // Nothing currently flips a user_submitted_jobs row's status away from
  // pending/processing/ai_processed once it goes live as a real job — so
  // without this check, a published job keeps counting a second time via
  // its now-stale submission row. Match the two by duplicate_check.hash,
  // the same hash process-submission already uses for duplicate detection,
  // and drop any submission that has a live job counterpart.
  const activeHashes = new Set(
    (activeJobs || [])
      .map((j: any) => j.duplicate_check?.hash)
      .filter(Boolean)
  );
  const pendingCount = (pendingSubmissions || []).filter(
    (s: any) => !s.duplicate_check?.hash || !activeHashes.has(s.duplicate_check.hash)
  ).length;

  const unlimited = subscription?.plan_type === 'job_posting_unlimited';
  const planCap = unlimited
    ? Number.POSITIVE_INFINITY
    : subscription?.plan_type === 'job_posting_basic'
      ? FREE_ACTIVE_JOB_LIMIT + JOB_POSTING_PLANS.basic_monthly.extraActiveJobSlots
      : FREE_ACTIVE_JOB_LIMIT;

  const availableCredits = profile?.extra_job_slots ?? 0;
  const used = activeCount + pendingCount;
  const withinPlan = unlimited || used < planCap;
  const willUseCredit = !unlimited && !withinPlan && availableCredits > 0;

  return {
    activeCount: activeCount || 0,
    pendingCount: pendingCount || 0,
    used,
    planCap,
    unlimited,
    subscriptionPlan: (subscription?.plan_type as any) || null,
    availableCredits,
    canPublish: unlimited || withinPlan || availableCredits > 0,
    willUseCredit,
  };
}

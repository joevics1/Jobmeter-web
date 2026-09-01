// Pricing for job-posting quota and featured placement.
// All amounts are in Naira (NGN), charged via Paystack.
//
// Model:
// - Free: 2 concurrent active job listings, no expiry.
// - single_post: one-time NGN 2,000 payment = +1 consumable credit. Lets you
//   publish exactly one job beyond your plan limit. The credit is consumed
//   at publish time and is gone for good — it does not return when that
//   job later expires/closes.
// - basic_monthly / unlimited_monthly: recurring monthly subscriptions
//   (30 days per payment) that raise the concurrent-active-job cap for as
//   long as the subscription is active. Tracked in user_subscriptions,
//   same pattern as the existing talent_unlimited plan.
export const JOB_POSTING_PLANS = {
  single_post: {
    amount: 2000,
    kind: 'credit' as const,
    label: '1 extra job post',
    sublabel: 'One-time — for this job only',
  },
  basic_monthly: {
    amount: 5000,
    kind: 'subscription' as const,
    activeJobCap: 3,
    label: 'Up to 3 active jobs',
    sublabel: '₦5,000/month',
  },
  unlimited_monthly: {
    amount: 20000,
    kind: 'subscription' as const,
    activeJobCap: null, // unlimited
    label: 'Unlimited active jobs',
    sublabel: '₦20,000/month',
  },
} as const;

export type JobPostingPlanId = keyof typeof JOB_POSTING_PLANS;

export const FEATURED_JOB_PRICE = {
  amount: 5000,
  durationDays: 7,
} as const;

export const FREE_ACTIVE_JOB_LIMIT = 2;
export const SUBSCRIPTION_DURATION_DAYS = 30;

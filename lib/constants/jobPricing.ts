// Pricing for job-posting quota and featured placement.
// All amounts are in Naira (NGN), charged via Paystack.
//
// Model:
// - Free: 1 concurrent active job listing, no expiry.
// - starter_monthly / basic_monthly / unlimited_monthly: one-time payments
//   that unlock a 30-day window (tracked in user_subscriptions, same pattern
//   as talent_unlimited) during which the concurrent-active-job cap is
//   raised. "Monthly" describes the window length, not real recurring
//   billing — paying again extends it another 30 days.
//   Slots stack ON TOP of the free FREE_ACTIVE_JOB_LIMIT the same way a
//   legacy single-post credit stacks on top rather than replacing it.
//   Once the window expires, the cap reverts to FREE_ACTIVE_JOB_LIMIT — any
//   jobs already live over that stay live, but no new ones can be
//   published until the count drops back under it.
// - Any active starter/basic/unlimited plan also unlocks free Talent Pool
//   access (see /api/talent's isUnlimited check) — that's the starter
//   plan's main selling point, since it doesn't add extra job slots.
export const JOB_POSTING_PLANS = {
  starter_monthly: {
    amount: 2000,
    kind: 'subscription' as const,
    extraActiveJobSlots: 0, // same job cap as free — the real benefit is free Talent Pool access
    label: '1 active job',
    sublabel: '₦2,000/month',
  },
  basic_monthly: {
    amount: 5000,
    kind: 'subscription' as const,
    extraActiveJobSlots: 2, // on top of FREE_ACTIVE_JOB_LIMIT, not a total
    label: 'Up to 3 active jobs',
    sublabel: '₦5,000/month',
  },
  unlimited_monthly: {
    amount: 20000,
    kind: 'subscription' as const,
    extraActiveJobSlots: null, // unlimited
    label: 'Unlimited active jobs',
    sublabel: '₦20,000/month',
  },
} as const;

export type JobPostingPlanId = keyof typeof JOB_POSTING_PLANS;

export const FEATURED_JOB_PRICE = {
  amount: 5000,
  durationDays: 7,
} as const;

export const FREE_ACTIVE_JOB_LIMIT = 1;
export const SUBSCRIPTION_DURATION_DAYS = 30;

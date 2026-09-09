-- New ₦2,000/month "starter" job posting tier: same 1-active-job cap as free,
-- but bundles free Talent Pool access (see /api/talent's isUnlimited check).
ALTER TABLE user_subscriptions DROP CONSTRAINT user_subscriptions_plan_type_check;
ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_plan_type_check
  CHECK (plan_type = ANY (ARRAY['Pro'::text, 'Max'::text, 'Elite'::text, 'talent_unlimited'::text, 'job_posting_starter'::text, 'job_posting_basic'::text, 'job_posting_unlimited'::text]));

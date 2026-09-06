import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializePayment } from '@/lib/services/paymentService';
import { JOB_POSTING_PLANS, FEATURED_JOB_PRICE, JobPostingPlanId } from '@/lib/constants/jobPricing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, userId, paymentType, planId, planType, creditAmount, callback_url, metadata } = body;

    if (!email || !amount || !userId || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields: email, amount, userId, paymentType' },
        { status: 400 }
      );
    }

    // SECURITY: verify the caller actually is the userId they claim to be,
    // using their own Supabase access token — not just whatever the request
    // body says. Without this, anyone could POST here with someone else's
    // userId and have a payment credited to that person's account instead
    // of their own.
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user: verifiedUser }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !verifiedUser || verifiedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (paymentType === 'subscription' && (!planId || !planType)) {
      return NextResponse.json(
        { error: 'Subscription payments require planId and planType' },
        { status: 400 }
      );
    }

    if (paymentType === 'credits' && !creditAmount) {
      return NextResponse.json(
        { error: 'Credit purchases require creditAmount' },
        { status: 400 }
      );
    }

    // SECURITY: never trust a client-supplied amount for payment types we
    // define pricing for ourselves — recompute it from the same constants
    // the paywall UI uses. Without this, a request crafted directly against
    // this endpoint (bypassing the UI) could set amount to anything —
    // e.g. pay ₦1 and still receive an unlimited job-posting subscription
    // or a featured placement, since the webhook applies whatever
    // paymentType/planType is in the metadata regardless of what was
    // actually charged.
    let verifiedAmount: number;
    if (paymentType === 'job_listing') {
      const plan = JOB_POSTING_PLANS[planType as JobPostingPlanId];
      if (!plan) {
        return NextResponse.json({ error: 'Unknown job listing plan' }, { status: 400 });
      }
      verifiedAmount = plan.amount;
    } else if (paymentType === 'featured_job') {
      if (!metadata?.job_id) {
        return NextResponse.json({ error: 'Featured job payments require metadata.job_id' }, { status: 400 });
      }
      // Ownership check — without this, anyone could pay to feature a job
      // that isn't theirs (e.g. a competitor's listing).
      const supabaseCheck = createClient(supabaseUrl, supabaseAnonKey);
      const { data: job } = await supabaseCheck
        .from('jobs')
        .select('posted_by_user_id')
        .eq('id', metadata.job_id)
        .maybeSingle();
      if (!job || job.posted_by_user_id !== userId) {
        return NextResponse.json({ error: 'You can only feature your own job listings' }, { status: 403 });
      }
      verifiedAmount = FEATURED_JOB_PRICE.amount;
    } else {
      // subscription / credits (legacy paths) still trust the client amount —
      // same class of risk applies here too, flagged separately.
      verifiedAmount = amount;
    }

    const result = await initializePayment({
      email,
      amount: verifiedAmount,
      userId,
      paymentType,
      planId,
      planType,
      creditAmount,
      callback_url,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      reference: result.reference,
      authorizationUrl: result.authorizationUrl,
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
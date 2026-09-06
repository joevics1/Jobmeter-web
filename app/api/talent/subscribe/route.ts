import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializePayment } from '@/lib/services/paymentService';
import { JOB_POSTING_PLANS, JobPostingPlanId } from '@/lib/constants/jobPricing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const planType = body.planType as JobPostingPlanId;
    if (planType !== 'basic_monthly' && planType !== 'unlimited_monthly') {
      return NextResponse.json({ error: 'planType must be basic_monthly or unlimited_monthly' }, { status: 400 });
    }
    const plan = JOB_POSTING_PLANS[planType];

    const result = await initializePayment({
      email: user.email,
      amount: plan.amount,
      userId: user.id,
      paymentType: 'job_listing',
      planType,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?redirect=${encodeURIComponent('/talent?upgraded=1')}`,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to start checkout' }, { status: 400 });
    }

    return NextResponse.json({ authorizationUrl: result.authorizationUrl });
  } catch (err: any) {
    console.error('POST /api/talent/subscribe error:', err);
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 });
  }
}

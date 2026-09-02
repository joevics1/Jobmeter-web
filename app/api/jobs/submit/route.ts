import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getJobQuota } from '@/lib/services/jobQuotaService';
import { safeSubmitLimit, getClientIp } from '@/lib/rate-limit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This sits in front of the submit-job edge function so we can enforce the
// active-job limit BEFORE any AI processing happens (checking after would
// waste the user's time), and so we can reliably consume a single-post
// credit only once the job submission actually succeeds.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = await safeSubmitLimit(`${ip}:submit`);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'RATE_LIMITED', message: 'Too many job submissions — please slow down and try again shortly.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const userId = body?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const quota = await getJobQuota(userId);

    if (!quota.canPublish) {
      return NextResponse.json(
        {
          error: 'JOB_LIMIT_REACHED',
          message: "You've reached your active job limit.",
          used: quota.used,
          planCap: quota.unlimited ? null : quota.planCap,
          unlimited: quota.unlimited,
          availableCredits: quota.availableCredits,
        },
        { status: 403 }
      );
    }

    const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/submit-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
    });

    const result = await edgeResponse.json();

    if (!edgeResponse.ok) {
      return NextResponse.json(result, { status: edgeResponse.status });
    }

    // Only consume the credit once the submission actually went through.
    if (quota.willUseCredit) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: profile } = await supabase
        .from('profiles')
        .select('extra_job_slots')
        .eq('id', userId)
        .maybeSingle();
      const remaining = Math.max(0, (profile?.extra_job_slots || 0) - 1);
      await supabase.from('profiles').update({ extra_job_slots: remaining }).eq('id', userId);
    }

    return NextResponse.json(result, { status: edgeResponse.status });
  } catch (err: any) {
    console.error('Job submit proxy error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getJobQuota } from '@/lib/services/jobQuotaService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const quota = await getJobQuota(userId);

    return NextResponse.json({
      canPublish: quota.canPublish,
      willUseCredit: quota.willUseCredit,
      activeCount: quota.activeCount,
      pendingCount: quota.pendingCount,
      used: quota.used,
      planCap: quota.unlimited ? null : quota.planCap,
      unlimited: quota.unlimited,
      subscriptionPlan: quota.subscriptionPlan,
      availableCredits: quota.availableCredits,
    });
  } catch (err: any) {
    console.error('check-limit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

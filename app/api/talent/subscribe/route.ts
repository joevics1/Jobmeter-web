import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializePayment } from '@/lib/services/paymentService';
import { TALENT_UNLIMITED_PLAN_TYPE, TALENT_UNLIMITED_PRICE_NAIRA } from '@/lib/talent';

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

    const result = await initializePayment({
      email: user.email,
      amount: TALENT_UNLIMITED_PRICE_NAIRA,
      userId: user.id,
      paymentType: 'subscription',
      planType: TALENT_UNLIMITED_PLAN_TYPE,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/talent?upgraded=1`,
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

import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/services/paymentService';

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

    if (paymentType === 'job_listing' && !planType) {
      return NextResponse.json(
        { error: 'Job listing payments require planType (slots_1, slots_3, or unlimited)' },
        { status: 400 }
      );
    }

    if (paymentType === 'featured_job' && !metadata?.jobId) {
      return NextResponse.json(
        { error: 'Featured job payments require metadata.jobId' },
        { status: 400 }
      );
    }

    const result = await initializePayment({
      email,
      amount,
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
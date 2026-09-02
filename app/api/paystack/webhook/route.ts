import { NextRequest, NextResponse } from 'next/server';
import { handlePaystackWebhook } from '@/lib/services/paystackWebhookHandler';

// Deprecated alias for app/api/payment/webhook — kept only in case this is
// the URL currently configured in the Paystack dashboard. Both routes now
// share one implementation (see paystackWebhookHandler.ts) instead of two
// copies drifting apart. Once you've confirmed which URL Paystack is
// actually calling, point it at /api/payment/webhook and delete this file.
export async function POST(req: NextRequest) {
  const body = await req.text();
  await handlePaystackWebhook(body, req.headers.get('x-paystack-signature'));
  return new NextResponse('Webhook Received', { status: 200 });
}

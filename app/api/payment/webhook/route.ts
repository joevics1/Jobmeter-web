import { NextRequest, NextResponse } from 'next/server';
import { handlePaystackWebhook } from '@/lib/services/paystackWebhookHandler';

// Canonical Paystack webhook endpoint. Point Paystack's dashboard webhook
// URL at this route. app/api/paystack/webhook is kept as an alias only for
// backward compatibility in case that's what's currently configured —
// both now share the exact same handler (see paystackWebhookHandler.ts).
export async function POST(req: NextRequest) {
  const body = await req.text();
  await handlePaystackWebhook(body, req.headers.get('x-paystack-signature'));

  // Always 200 — see handlePaystackWebhook's doc comment for why.
  return new NextResponse('Webhook Received', { status: 200 });
}

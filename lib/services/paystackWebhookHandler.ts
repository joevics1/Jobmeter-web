import crypto from 'crypto';
import { handleSuccessfulPayment } from '@/lib/services/paymentService';

// Previously duplicated near-identically across app/api/payment/webhook and
// app/api/paystack/webhook (plus a third, empty, never-deployed Supabase
// edge function). Consolidated here so there's one place to fix if Paystack
// changes their webhook contract. Both routes now just call this.
//
// Always resolves without throwing, and the caller should always respond
// 200 to Paystack regardless of outcome — returning a non-200 makes
// Paystack retry the webhook, and handleSuccessfulPayment's idempotency
// check means a retry can't double-credit anyone, so there's no upside to
// signaling failure back to Paystack, only the downside of retry noise.
export async function handlePaystackWebhook(rawBody: string, signature: string | null): Promise<void> {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex');

  if (hash !== signature) {
    console.warn('[paystack-webhook] Invalid signature — possible spoofed request');
    return;
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    console.log('[paystack-webhook] charge.success received for reference:', event.data?.reference);
    try {
      await handleSuccessfulPayment(event.data);
    } catch (err) {
      console.error('[paystack-webhook] handleSuccessfulPayment failed:', err);
    }
  }
}

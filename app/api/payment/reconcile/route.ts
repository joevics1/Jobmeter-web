import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { handleSuccessfulPayment } from '@/lib/services/paymentService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Runs daily via Vercel Cron (see vercel.json). Catches the case where
// Paystack successfully charged someone but our webhook never processed
// it — a deploy happening mid-request, a transient network blip, etc.
// handleSuccessfulPayment is idempotent (checked by reference), so it's
// always safe to call again for a transaction we've already processed.
export async function GET(req: NextRequest) {
  // Protect against public abuse — this does real DB writes.
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // TEMP (2026-09-07): widened from 3 to 30 days to catch a specific
  // featured-job payment stuck from before the metadata.job_id fix, which
  // predates the normal 3-day window. Revert to 3 days once confirmed
  // fixed — no reason to make Paystack return a month of transactions on
  // every hourly run once this one-off case is cleared.
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let page = 1;
  let reconciled = 0;
  let checked = 0;
  const errors: string[] = [];

  try {
    while (true) {
      const res = await fetch(
        `https://api.paystack.co/transaction?status=success&from=${encodeURIComponent(from)}&perPage=100&page=${page}`,
        { headers: { Authorization: `Bearer ${secretKey}` } }
      );

      if (!res.ok) {
        errors.push(`Paystack API error: ${res.status}`);
        break;
      }

      const body = await res.json();
      const transactions: any[] = body.data || [];
      if (transactions.length === 0) break;

      for (const txn of transactions) {
        checked++;
        const { data: existing } = await supabase
          .from('payment_transactions')
          .select('status')
          .eq('reference', txn.reference)
          .maybeSingle();

        if (existing?.status === 'completed') continue;

        // Paystack confirms this was paid, but we don't have it marked
        // completed (or don't have a record at all) — process it now.
        try {
          await handleSuccessfulPayment(txn);
          reconciled++;
          console.log(`[reconcile] Processed missed payment: ${txn.reference}`);
        } catch (err: any) {
          errors.push(`${txn.reference}: ${err.message}`);
        }
      }

      if (!body.meta || page >= Math.ceil((body.meta.total || 0) / 100)) break;
      page++;
    }

    return NextResponse.json({ checked, reconciled, errors });
  } catch (err: any) {
    console.error('[reconcile] Fatal error:', err);
    return NextResponse.json({ error: err.message, checked, reconciled, errors }, { status: 500 });
  }
}

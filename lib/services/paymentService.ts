// lib/services/paymentService.ts

import { supabaseAdmin } from '@/lib/supabase-server';

// Guard: fail loudly at module load time if the service role key is missing.
// Without this, all supabaseAdmin queries silently fail with an auth error,
// causing the webhook to return 400 with no useful log output.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    '[supabase-server] SUPABASE_SERVICE_ROLE_KEY is not set. ' +
    'Add it to your .env.local and your deployment environment variables.'
  );
}

export interface InitializePaymentParams {
  email: string;
  amount: number;
  userId: string;
  paymentType: 'subscription' | 'credits';
  planId?: string;
  planType?: string;
  creditAmount?: number;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  authorizationUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Initializes a transaction with Paystack and records a pending transaction in Supabase.
 * Includes a fix for the 22P02 UUID error by validating the planId format.
 */
export async function initializePayment(params: InitializePaymentParams): Promise<PaymentResult> {
  const { email, amount, userId, paymentType, planId, planType, creditAmount, metadata, callback_url } = params;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error('[initializePayment] PAYSTACK_SECRET_KEY is not set in environment variables.');
    return { success: false, error: 'Payment service is not configured. Please contact support.' };
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('[initializePayment] NEXT_PUBLIC_APP_URL is not set in environment variables.');
    return { success: false, error: 'App URL is not configured. Please contact support.' };
  }

  try {
    const reference = `JP_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        reference,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          user_id: userId,
          payment_type: paymentType,
          plan_type: planType,
          plan_slug: planId,
          credit_amount: creditAmount,
          ...metadata,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('[initializePayment] Paystack rejected the request:', {
        message: data.message,
        httpStatus: response.status,
      });
      return { success: false, error: data.message || 'Paystack declined the request' };
    }

    if (!data.data?.authorization_url) {
      console.error('[initializePayment] Paystack returned no authorization_url:', data);
      return { success: false, error: 'No checkout URL returned by Paystack' };
    }

    // Validate if planId is a valid UUID before inserting into the plan_id column.
    // If it's a slug like 'pro' or 'apply-for-me', we leave plan_id null to avoid DB rejection.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId || '');

    const { error: dbError } = await supabaseAdmin.from('payment_transactions').insert({
      user_id: userId,
      reference: data.data.reference,
      amount,
      payment_type: paymentType,
      status: 'pending',
      plan_id: isUuid ? planId : null,
      plan_type: planType,
      credit_amount: creditAmount,
    });

    if (dbError) {
      console.error('[initializePayment] Database error:', dbError);
      throw new Error(`Failed to record transaction: ${dbError.message}`);
    }

    return {
      success: true,
      reference: data.data.reference,
      authorizationUrl: data.data.authorization_url,
    };
  } catch (error: any) {
    console.error('[initializePayment] Unexpected error:', error);
    return { success: false, error: error.message || 'Failed to initialize payment' };
  }
}

/**
 * Verifies the transaction status with Paystack using the reference.
 */
export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status) {
      console.error('[verifyPayment] Paystack verification failed:', data.message);
      return { success: false, error: data.message };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error('[verifyPayment] Error:', error);
    return { success: false, error: error.message || 'Failed to verify payment' };
  }
}

/**
 * Updates user credits and marks the transaction as completed.
 * Uses plan_type to determine how many credits to award.
 *
 * Idempotent: if the reference has already been marked 'completed',
 * this function returns early without double-crediting the user.
 * This handles Paystack retries when a previous webhook attempt returned non-200.
 */
export async function handleSuccessfulPayment(paymentData: any) {
  const metadata = paymentData.metadata || {};
  const userId = metadata.user_id;
  const paymentType = metadata.payment_type;
  const planType = metadata.plan_type;

  console.log('[handleSuccessfulPayment] Processing:', { userId, paymentType, planType });
  console.log('[handleSuccessfulPayment] Service role key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!userId) {
    throw new Error('No user_id found in payment metadata');
  }

  // --- Idempotency check ---
  // Paystack retries webhooks if we return non-200. Guard against double-crediting
  // by checking whether this reference was already processed successfully.
  const { data: existingTx, error: txLookupError } = await supabaseAdmin
    .from('payment_transactions')
    .select('status')
    .eq('reference', paymentData.reference)
    .single();

  if (txLookupError && txLookupError.code !== 'PGRST116') {
    throw new Error(`Error looking up transaction: ${txLookupError.message}`);
  }

  if (existingTx?.status === 'completed') {
    console.log('[handleSuccessfulPayment] Already processed, skipping:', paymentData.reference);
    return { success: true };
  }
  // --- End idempotency check ---

  // Talent Pool "unlimited" recruiter subscription — ₦10,000 for 30 days
  // of unlimited talent-profile views. Separate from the job-seeker
  // credits model below, so it's handled and returned early here.
  if (planType === 'talent_unlimited') {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: existingSub } = await supabaseAdmin
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('plan_type', 'talent_unlimited')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSub) {
      const { error: subUpdateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({ is_active: true, started_at: new Date().toISOString(), expires_at: expiresAt.toISOString(), canceled_at: null })
        .eq('id', existingSub.id);
      if (subUpdateError) throw new Error(`Subscription update failed: ${subUpdateError.message}`);
    } else {
      const { error: subInsertError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_type: 'talent_unlimited',
          is_active: true,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        });
      if (subInsertError) throw new Error(`Subscription insert failed: ${subInsertError.message}`);
    }

    const { error: txError } = await supabaseAdmin
      .from('payment_transactions')
      .update({ status: 'completed' })
      .eq('reference', paymentData.reference);
    if (txError) console.error('[handleSuccessfulPayment] Transaction status update failed:', txError);

    return { success: true };
  }

  let creditsToAdd = 0;
  let allocation = 5;

  if (planType === 'apply_for_me') {
    creditsToAdd = 15;
    allocation = 15;
  } else if (planType === 'pro') {
    creditsToAdd = 30;
    allocation = 30;
  } else if (paymentType === 'credits') {
    creditsToAdd = metadata.credit_amount || 0;
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('user_credits')
    .select('credits_remaining, plan_allocation')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Error fetching user credits: ${fetchError.message}`);
  }

  if (existing) {
    const newAllocation = (planType === 'pro' || planType === 'apply_for_me')
      ? allocation
      : (existing.plan_allocation ?? 5);

    const { error: updateError } = await supabaseAdmin
      .from('user_credits')
      .update({
        credits_remaining: (existing.credits_remaining ?? 0) + creditsToAdd,
        plan_allocation: newAllocation,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) throw new Error(`Update failed: ${updateError.message}`);
  } else {
    const { error: insertError } = await supabaseAdmin
      .from('user_credits')
      .insert({
        user_id: userId,
        credits_remaining: creditsToAdd + 5,
        plan_allocation: allocation,
        welcome_credits_assigned: true,
      });

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
  }

  const { error: txError } = await supabaseAdmin
    .from('payment_transactions')
    .update({ status: 'completed' })
    .eq('reference', paymentData.reference);

  if (txError) {
    console.error('[handleSuccessfulPayment] Transaction status update failed:', txError);
  }

  return { success: true };
}
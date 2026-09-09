"use client";

import React from 'react';
import { X, Star, Users, ArrowRight, Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePaystack } from '@/hooks/usePaystack';
import { JOB_POSTING_PLANS, FEATURED_JOB_PRICE } from '@/lib/constants/jobPricing';

interface PostSubmitUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function PostSubmitUpsellModal({ isOpen, onClose, email }: PostSubmitUpsellModalProps) {
  const { initializePayment, loading, error } = usePaystack();

  if (!isOpen) return null;

  const goFeature = () => {
    // The job is still pending review, so it isn't in `jobs` yet — feature
    // it from the jobs list once it's live and the Feature button there
    // (FeatureJobModal) is what actually charges for it. The parent's
    // onClose already navigates there.
    onClose();
  };

  const handleUnlockTalent = async () => {
    await initializePayment({
      email,
      amount: JOB_POSTING_PLANS.starter_monthly.amount,
      paymentType: 'job_listing',
      planType: 'starter_monthly',
      callback_url: `${window.location.origin}/payment/callback?redirect=${encodeURIComponent('/talent')}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-1 pr-6">Want more applicants?</h2>
        <p className="text-sm text-gray-500 mb-5">Two quick ways to get your job in front of more people.</p>

        <div className="space-y-3 mb-4">
          <button
            onClick={goFeature}
            className="w-full text-left p-4 rounded-xl border-2 hover:shadow-sm transition-shadow"
            style={{ borderColor: theme.colors.accent.gold + '50', backgroundColor: theme.colors.accent.gold + '08' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} style={{ color: theme.colors.accent.gold }} fill="currentColor" />
              <span className="font-semibold text-sm text-gray-900">Feature this job</span>
            </div>
            <p className="text-xs text-gray-600">
              Pin it to the top of the jobs list for {FEATURED_JOB_PRICE.durationDays} days —
              ₦{FEATURED_JOB_PRICE.amount.toLocaleString()}, once it&apos;s approved and live.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium mt-2" style={{ color: theme.colors.primary.DEFAULT }}>
              Go to my jobs to feature <ArrowRight size={12} />
            </span>
          </button>

          <button
            onClick={handleUnlockTalent}
            disabled={loading}
            className="w-full text-left p-4 rounded-xl border-2 hover:shadow-sm transition-shadow disabled:opacity-60"
            style={{ borderColor: theme.colors.primary.DEFAULT + '40', backgroundColor: theme.colors.primary.DEFAULT + '08' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} style={{ color: theme.colors.primary.DEFAULT }} />
              <span className="font-semibold text-sm text-gray-900">Search the Talent Pool</span>
            </div>
            <p className="text-xs text-gray-600">
              Don&apos;t just wait for applicants — search candidates directly. Included free with any paid
              job posting plan, starting at ₦{JOB_POSTING_PLANS.starter_monthly.amount.toLocaleString()}/month.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium mt-2" style={{ color: theme.colors.primary.DEFAULT }}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : null}
              {loading ? 'Redirecting to Paystack...' : <>Subscribe from ₦{JOB_POSTING_PLANS.starter_monthly.amount.toLocaleString()}/month <ArrowRight size={12} /></>}
            </span>
          </button>
        </div>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button onClick={onClose} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1">
          Maybe later
        </button>
      </div>
    </div>
  );
}

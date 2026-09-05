"use client";

import React from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePaystack } from '@/hooks/usePaystack';
import { FEATURED_JOB_PRICE } from '@/lib/constants/jobPricing';

interface FeatureJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  jobId: string;
  jobTitle: string;
}

export default function FeatureJobModal({ isOpen, onClose, email, jobId, jobTitle }: FeatureJobModalProps) {
  const { initializePayment, loading, error } = usePaystack();

  if (!isOpen) return null;

  const handlePay = async () => {
    await initializePayment({
      email,
      amount: FEATURED_JOB_PRICE.amount,
      paymentType: 'featured_job',
      metadata: { jobId },
      callback_url: `${window.location.origin}/payment/callback?redirect=${encodeURIComponent('/dashboard/recruiter')}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Star size={20} className="text-amber-600" fill="currentColor" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Feature this job</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-1 font-medium truncate">{jobTitle}</p>
        <p className="text-sm text-gray-600 mb-5">
          Show this job at the top of /jobs for {FEATURED_JOB_PRICE.durationDays} days, ahead of the
          regular listings.
        </p>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 mb-5"
          style={{ borderColor: theme.colors.primary.DEFAULT, backgroundColor: `${theme.colors.primary.DEFAULT}08` }}
        >
          <span className="text-sm font-medium text-gray-900">
            {FEATURED_JOB_PRICE.durationDays} days featured placement
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ₦{FEATURED_JOB_PRICE.amount.toLocaleString()}
          </span>
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.colors.primary.DEFAULT }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {loading ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
        </button>
      </div>
    </div>
  );
}

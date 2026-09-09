"use client";

import React from 'react';
import { X, Star, ArrowRight } from 'lucide-react';
import { theme } from '@/lib/theme';
import { FEATURED_JOB_PRICE } from '@/lib/constants/jobPricing';

interface FeatureUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Shown to recruiters who already have a paid job-posting plan (and
// therefore already have free Talent Pool access — no point pitching that).
// Featured placement is never bundled into any plan, so it's always worth
// nudging, even for a paying customer.
export default function FeatureUpsellModal({ isOpen, onClose }: FeatureUpsellModalProps) {
  if (!isOpen) return null;

  const goFeature = () => {
    // The job is still pending review, so it isn't in `jobs` yet — feature
    // it from the jobs list once it's live, where the existing Feature
    // button (FeatureJobModal) actually takes the payment. The parent's
    // onClose already navigates there.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: theme.colors.accent.gold + '15' }}>
          <Star size={20} style={{ color: theme.colors.accent.gold }} fill="currentColor" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">Want more applicants?</h2>
        <p className="text-sm text-gray-600 mb-5">
          Pin this job to the top of the jobs list for {FEATURED_JOB_PRICE.durationDays} days, ahead of every
          regular listing — ₦{FEATURED_JOB_PRICE.amount.toLocaleString()}, once it's approved and live. Pay per
          job, no plan change needed.
        </p>

        <button
          onClick={goFeature}
          className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.colors.primary.DEFAULT }}
        >
          Go to my jobs to feature <ArrowRight size={15} />
        </button>
        <button onClick={onClose} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 mt-1">
          Maybe later
        </button>
      </div>
    </div>
  );
}

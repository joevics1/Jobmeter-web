"use client";

import React, { useState } from 'react';
import { X, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { usePaystack } from '@/hooks/usePaystack';
import { JOB_POSTING_PLANS, JobPostingPlanId, FREE_ACTIVE_JOB_LIMIT } from '@/lib/constants/jobPricing';

interface JobLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  used: number;
  planCap: number | null; // null = unlimited
}

const PLAN_ORDER: JobPostingPlanId[] = ['single_post', 'basic_monthly', 'unlimited_monthly'];

export default function JobLimitModal({ isOpen, onClose, email, used, planCap }: JobLimitModalProps) {
  const { initializePayment, loading, error } = usePaystack();
  const [selectedPlan, setSelectedPlan] = useState<JobPostingPlanId>('basic_monthly');

  if (!isOpen) return null;

  const handlePay = async () => {
    const plan = JOB_POSTING_PLANS[selectedPlan];
    await initializePayment({
      email,
      amount: plan.amount,
      paymentType: 'job_listing',
      planType: selectedPlan,
      callback_url: `${window.location.origin}/submit`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Briefcase size={22} className="text-gray-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">You&apos;ve hit your job limit</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          Free accounts can have {FREE_ACTIVE_JOB_LIMIT} active job listings at a time
          {planCap && planCap > FREE_ACTIVE_JOB_LIMIT ? ` (your plan currently allows ${planCap})` : ''}.
          You currently have {used}. Close an existing job from{' '}
          <a href="/dashboard/recruiter" className="underline font-medium">My Jobs</a> to free up a
          slot, or unlock more below.
        </p>

        <div className="space-y-2 mb-5">
          {PLAN_ORDER.map((planId) => {
            const plan = JOB_POSTING_PLANS[planId];
            const isSelected = selectedPlan === planId;
            return (
              <button
                key={planId}
                onClick={() => setSelectedPlan(planId)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 text-left transition-colors"
                style={{
                  borderColor: isSelected ? theme.colors.primary.DEFAULT : theme.colors.border.DEFAULT,
                  backgroundColor: isSelected ? `${theme.colors.primary.DEFAULT}08` : 'white',
                }}
              >
                <span className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 size={16} style={{ color: theme.colors.primary.DEFAULT }} />}
                  <span>
                    <span className="block text-sm font-medium text-gray-900">{plan.label}</span>
                    <span className="block text-xs text-gray-500">{plan.sublabel}</span>
                  </span>
                </span>
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  ₦{plan.amount.toLocaleString()}
                </span>
              </button>
            );
          })}
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

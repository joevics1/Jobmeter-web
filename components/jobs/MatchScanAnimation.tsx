"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Reading your skills & experience',
  'Comparing salary expectations',
  'Checking location & work-type fit',
  'Ranking your best-fit roles',
];

const STEP_DURATION_MS = 1100;

/**
 * Multi-step "scanning" animation shown while match scores are being
 * calculated. Cycles through illustrative steps so the calculation feels
 * alive instead of a bare spinner with static text.
 */
export default function MatchScanAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="relative w-14 h-14 mb-7">
        <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#DBEAFE' }} />
        <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: '#2563EB' }} />
      </div>
      <div className="space-y-3 w-full max-w-xs px-4">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={step}
              className="flex items-center gap-3 transition-opacity duration-300"
              style={{ opacity: done ? 0.5 : active ? 1 : 0.35 }}
            >
              {done ? (
                <CheckCircle2 size={17} className="flex-shrink-0" style={{ color: '#2563EB' }} />
              ) : (
                <div
                  className="w-[17px] h-[17px] rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                  style={{ borderColor: active ? '#2563EB' : '#CBD5E1' }}
                >
                  {active && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2563EB' }} />}
                </div>
              )}
              <span
                className="text-sm"
                style={{ color: active ? '#1E293B' : '#94A3B8', fontWeight: active ? 600 : 400 }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

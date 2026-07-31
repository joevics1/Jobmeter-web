// app/tools/_shared/GratuityCalculatorShell.tsx
// Shared UI shell for Oman / Kuwait / Bahrain / Qatar end-of-service gratuity
// calculators. Each country page supplies its own GULF_GRATUITY_RULES entry;
// only the underlying formula differs, not the interaction pattern.
'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calculator, AlertTriangle } from 'lucide-react';
import { GULF_GRATUITY_RULES, type GratuityCountry, type TerminationReason } from '@/lib/gulfGratuityRules';

interface Props {
  country: GratuityCountry;
}

export default function GratuityCalculatorShell({ country }: Props) {
  const config = GULF_GRATUITY_RULES[country];

  const [form, setForm] = useState({
    monthlyBasicWage: 1000,
    startDate: '2020-01-01',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    unpaidDays: 0,
    terminationReason: 'employer_termination' as TerminationReason,
  });

  const result = useMemo(() => {
    if (!form.startDate || !form.endDate || form.monthlyBasicWage <= 0) return null;
    return config.calculate(form);
  }, [form, config]);

  const update = (updates: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...updates }));

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <Calculator size={22} className="text-emerald-600" /> Your Details
        </h3>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Monthly basic wage ({config.currency})
          </label>
          <input
            type="number"
            min="0"
            value={form.monthlyBasicWage}
            onChange={(e) => update({ monthlyBasicWage: Math.max(0, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-400 mt-1">Use your basic salary, not total package with allowances.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Start date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update({ startDate: e.target.value })}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">End date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => update({ endDate: e.target.value })}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Unpaid leave days (excluded from service)</label>
          <input
            type="number"
            min="0"
            value={form.unpaidDays}
            onChange={(e) => update({ unpaidDays: Math.max(0, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">How is employment ending?</label>
          <select
            value={form.terminationReason}
            onChange={(e) => update({ terminationReason: e.target.value as TerminationReason })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="employer_termination">Employer termination / layoff</option>
            <option value="resignation">Resignation</option>
            <option value="contract_end">Fixed-term contract ended naturally</option>
          </select>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Estimated Gratuity</h3>

        {result ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Years of service</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{result.totalYearsOfService.toFixed(2)}</p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-2xl p-5">
                <p className="text-xs text-violet-700 dark:text-violet-400 font-medium mb-1">Final gratuity</p>
                <p className="text-3xl font-bold text-violet-900 dark:text-violet-300">
                  {config.currency} {result.finalGratuity.toLocaleString()}
                </p>
              </div>
            </div>

            {result.finalGratuity !== result.grossGratuity && (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 mb-6">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Gross gratuity before reduction: {config.currency} {result.grossGratuity.toLocaleString()}.
                  {result.cappedApplied && ' A statutory cap was applied. '}
                  {result.resignationReductionApplied && ' A resignation-based reduction was applied.'}
                </p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{result.breakdownNote}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Enter your wage and dates to see your estimate.</p>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Legal basis: {config.legalBasis}. This is an estimate based on publicly reported labor law provisions —
          actual settlements can include unused leave, notice pay, and other components not modeled here. Verify with
          your country's Ministry of Labour before relying on this figure. Not legal or financial advice.
        </p>
      </div>
    </div>
  );
}

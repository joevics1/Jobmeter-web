// app/tools/oman-resident-card-cost-calculator/OmanResidentCardCostCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateOmanResidency, type OmanInput, type OmanCardDuration } from '@/lib/gulfResidencyCostRules';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function OmanResidentCardCostCalculator() {
  const [form, setForm] = useState<OmanInput>({ cardDurationYears: 2, workerType: 'nonCatering', monthsLate: 0 });
  const result = useMemo(() => calculateOmanResidency(form), [form]);
  const update = (u: Partial<OmanInput>) => setForm((p) => ({ ...p, ...u }));

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Your Resident Card</h3>
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Card validity</label>
          <select
            value={form.cardDurationYears}
            onChange={(e) => update({ cardDurationYears: Number(e.target.value) as OmanCardDuration })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value={1}>1 year — RO 5</option>
            <option value={2}>2 years — RO 10</option>
            <option value={3}>3 years — RO 15</option>
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Medical fitness test</label>
          <select
            value={form.workerType}
            onChange={(e) => update({ workerType: e.target.value as OmanInput['workerType'] })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="none">Not required this renewal</option>
            <option value="nonCatering">Required — non-catering worker (OMR 30)</option>
            <option value="catering">Required — catering worker (OMR 40)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Months late (if renewing past expiry)</label>
          <input
            type="number" min="0" value={form.monthsLate}
            onChange={(e) => update({ monthsLate: Math.max(0, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Estimated Total</h3>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 mb-6">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Total</p>
          <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">OMR {result.total.toLocaleString()}</p>
        </div>

        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={result.breakdown} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {result.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `OMR ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {result.breakdown.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{b.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">OMR {b.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">{result.note} Based on ROP Decision No. 78/2025 as publicly reported — verify current fees on the ROP e-services portal. Not official guidance.</p>
      </div>
    </div>
  );
}

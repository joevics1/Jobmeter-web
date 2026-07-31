// app/tools/qatar-qid-cost-calculator/QatarQIDCostCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateQatarQID, type QatarInput } from '@/lib/gulfResidencyCostRules';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function QatarQIDCostCalculator() {
  const [form, setForm] = useState<QatarInput>({
    durationYears: 1,
    dependents: 0,
    homeDelivery: false,
    includeMedical: true,
    daysLate: 0,
  });

  const result = useMemo(() => calculateQatarQID(form), [form]);
  const update = (u: Partial<QatarInput>) => setForm((p) => ({ ...p, ...u }));

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Your QID Renewal</h3>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Renewal duration</label>
          <select
            value={form.durationYears}
            onChange={(e) => update({ durationYears: Number(e.target.value) as 1 | 3 })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value={1}>1 year — QAR 500</option>
            <option value={3}>3 years — QAR 900</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Family members also renewing</label>
          <input
            type="number" min="0" value={form.dependents}
            onChange={(e) => update({ dependents: Math.max(0, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Days late (if any, after 90-day grace period)</label>
          <input
            type="number" min="0" value={form.daysLate}
            onChange={(e) => update({ daysLate: Math.max(0, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input type="checkbox" checked={form.includeMedical} onChange={(e) => update({ includeMedical: e.target.checked })} className="w-5 h-5 rounded accent-emerald-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include medical fitness test (QAR 100)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.homeDelivery} onChange={(e) => update({ homeDelivery: e.target.checked })} className="w-5 h-5 rounded accent-emerald-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Home delivery via Q-Post (QAR 20)</span>
        </label>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Estimated Total</h3>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 mb-6">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Total cost</p>
          <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">QAR {result.total.toLocaleString()}</p>
        </div>

        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={result.breakdown} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {result.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `QAR ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {result.breakdown.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{b.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">QAR {b.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">{result.note} Fees set by Qatar's Ministry of Interior and confirmed via Metrash2/MOI portal — verify current amounts before paying. Not official guidance.</p>
      </div>
    </div>
  );
}

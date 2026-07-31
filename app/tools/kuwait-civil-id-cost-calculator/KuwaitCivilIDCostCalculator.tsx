// app/tools/kuwait-civil-id-cost-calculator/KuwaitCivilIDCostCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateKuwaitResidency, type KuwaitResidencyInput, type KuwaitResidencyCategory } from '@/lib/gulfResidencyCostRules';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const CATEGORY_LABELS: Record<KuwaitResidencyCategory, string> = {
  investorPartnerOwner: 'Investor / partner / property owner',
  selfSponsored: 'Self-sponsored (Article 24)',
  domesticWorkerYear1: 'Domestic worker — first year',
  domesticWorkerRenewal: 'Domestic worker — renewal (year 2+)',
};

export default function KuwaitCivilIDCostCalculator() {
  const [form, setForm] = useState<KuwaitResidencyInput>({
    category: 'investorPartnerOwner',
    includeHealthInsurance: true,
  });

  const result = useMemo(() => calculateKuwaitResidency(form), [form]);
  const update = (u: Partial<KuwaitResidencyInput>) => setForm((p) => ({ ...p, ...u }));

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Your Residency Category</h3>
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => update({ category: e.target.value as KuwaitResidencyCategory })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.includeHealthInsurance} onChange={(e) => update({ includeHealthInsurance: e.target.checked })} className="w-5 h-5 rounded accent-emerald-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include mandatory health insurance (KWD 100/yr)</span>
        </label>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Estimated Annual Cost</h3>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 mb-6">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Total</p>
          <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">KWD {result.total.toLocaleString()}</p>
        </div>

        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={result.breakdown} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {result.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `KWD ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {result.breakdown.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{b.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">KWD {b.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">{result.note} Based on Kuwait's Dec 2025/2026 residency reform (Ministerial Resolution No. 2249 of 2025) as publicly reported — verify current fees with PACI/MOI. Not official guidance.</p>
      </div>
    </div>
  );
}

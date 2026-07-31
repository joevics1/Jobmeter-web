// app/tools/kuwait-dependent-fee-calculator/KuwaitDependentFeeCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  calculateKuwaitDependentFee,
  KUWAIT_FAMILY_PRESETS,
  SPONSOR_CATEGORY_LABELS,
  type KuwaitFamilyProfile,
  type SponsorCategory,
} from '@/lib/kuwaitDependentFeeUtils';

const COLORS = ['#10b981', '#8b5cf6', '#0ea5e9'];

export default function KuwaitDependentFeeCalculator() {
  const [profile, setProfile] = useState<KuwaitFamilyProfile>({
    sponsorCategory: 'standard',
    spouseCount: 1,
    childrenCount: 2,
    parentsOrOtherCount: 0,
    years: 1,
    includeHealthInsurance: true,
  });

  const result = useMemo(() => calculateKuwaitDependentFee(profile), [profile]);

  const update = (updates: Partial<KuwaitFamilyProfile>) =>
    setProfile((prev) => ({ ...prev, ...updates }));

  const pieData = [
    ...result.breakdown.map((b) => ({ name: b.category, value: b.annualTotalKWD })),
    ...(result.healthInsuranceAnnualKWD > 0
      ? [{ name: 'Health insurance', value: result.healthInsuranceAnnualKWD }]
      : []),
  ].filter((d) => d.value > 0);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Family Profile</h3>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">PRESETS</p>
          <div className="grid grid-cols-3 gap-2">
            {KUWAIT_FAMILY_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() =>
                  update({
                    sponsorCategory: preset.sponsorCategory,
                    spouseCount: preset.spouseCount,
                    childrenCount: preset.childrenCount,
                    parentsOrOtherCount: preset.parentsOrOtherCount,
                  })
                }
                className="text-xs py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <span className="block text-lg mb-0.5">{preset.icon}</span>
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Sponsor category
          </label>
          <select
            value={profile.sponsorCategory}
            onChange={(e) => update({ sponsorCategory: e.target.value as SponsorCategory })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            {Object.entries(SPONSOR_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Spouse', key: 'spouseCount' as const },
            { label: 'Children', key: 'childrenCount' as const },
            { label: 'Parents/Other', key: 'parentsOrOtherCount' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                {label}
              </label>
              <input
                type="number"
                min="0"
                value={profile[key]}
                onChange={(e) => update({ [key]: Math.max(0, Number(e.target.value)) } as any)}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Years to project
          </label>
          <input
            type="number"
            min="1"
            value={profile.years}
            onChange={(e) => update({ years: Math.max(1, Number(e.target.value)) })}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.includeHealthInsurance}
            onChange={(e) => update({ includeHealthInsurance: e.target.checked })}
            className="w-5 h-5 rounded accent-emerald-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Include mandatory health insurance (~KWD 100/year per resident)
          </span>
        </label>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Estimated Cost</h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Annual dependent fees</p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">KWD {result.annualTotalKWD.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">≈ ${result.annualTotalUSD.toLocaleString()} USD</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded-2xl p-5">
            <p className="text-xs text-violet-700 dark:text-violet-400 font-medium mb-1">Total incl. health insurance</p>
            <p className="text-3xl font-bold text-violet-900 dark:text-violet-300">KWD {result.grandTotalWithInsuranceKWD.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">≈ ${result.grandTotalWithInsuranceUSD.toLocaleString()} USD</p>
          </div>
        </div>

        {profile.years > 1 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Over {profile.years} years, dependent fees alone total{' '}
              <strong className="text-gray-900 dark:text-white">KWD {result.multiYearTotalKWD.toLocaleString()}</strong>
              {' '}(≈ ${Math.round(result.multiYearTotalKWD * 3.26).toLocaleString()} USD), not counting insurance or renewal admin costs.
            </p>
          </div>
        )}

        {pieData.length > 0 && (
          <div className="h-56 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `KWD ${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-2">
          {result.breakdown.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{b.category} ({b.count} × KWD {b.annualRateKWD}/yr)</span>
              <span className="font-semibold text-gray-900 dark:text-white">KWD {b.annualTotalKWD.toLocaleString()}</span>
            </div>
          ))}
          {result.healthInsuranceAnnualKWD > 0 && (
            <div className="flex justify-between items-center py-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Health insurance (mandatory)</span>
              <span className="font-semibold text-gray-900 dark:text-white">KWD {result.healthInsuranceAnnualKWD.toLocaleString()}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Based on Kuwait's residency reform effective 23 Dec 2025 (Ministerial Resolution No. 2249 of 2025).
          Fee schedules are set by executive by-law and can change — verify current rates with Kuwait's
          Ministry of Interior before relying on this for anything official. Not legal or financial advice.
        </p>
      </div>
    </div>
  );
}

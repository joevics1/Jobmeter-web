// app/tools/saudi-dependent-levy/SaudiDependentLevyTool.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateLevy, FAMILY_PRESETS, FamilyProfile } from '@/lib/levyUtils';

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b'];

export default function SaudiDependentLevyTool() {
  const [profile, setProfile] = useState<FamilyProfile>({
    spouse: 1,
    childrenUnder18: 2,
    adultChildren: 0,
    parents: 0,
    other: 0,
    months: 12,
    monthlySalary: 15000,
    applyExemptions: false,
    includeRelatedCosts: true,
  });

  const result = useMemo(() => calculateLevy(profile), [profile]);

  const pieData = [
    { name: 'Dependent Levy', value: result.monthlyLevy, fill: '#10b981' },
    { name: 'Iqama & Related', value: result.iqamaEstimate / 12, fill: '#8b5cf6' },
  ].filter(item => item.value > 0);

  const usdRate = 0.266;

  const updateProfile = (updates: Partial<FamilyProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const loadPreset = (preset: typeof FAMILY_PRESETS[0]) => {
    setProfile(prev => ({
      ...prev,
      spouse: preset.spouse,
      childrenUnder18: preset.childrenUnder18,
      adultChildren: preset.adultChildren,
      parents: preset.parents,
      other: preset.other,
    }));
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Compact Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Family Profile</h3>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">PRESETS</p>
          <div className="grid grid-cols-3 gap-2">
            {FAMILY_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => loadPreset(preset)}
                className="text-xs py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <span className="block text-lg mb-0.5">{preset.icon}</span>
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Family Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Spouse', key: 'spouse' as const },
            { label: 'Children <18', key: 'childrenUnder18' as const },
            { label: 'Adult Children', key: 'adultChildren' as const },
            { label: 'Parents', key: 'parents' as const },
            { label: 'Other', key: 'other' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                {label}
              </label>
              <input
                type="number"
                min="0"
                value={profile[key]}
                onChange={(e) => updateProfile({ [key]: Math.max(0, Number(e.target.value)) })}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg text-center focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        {/* Duration & Salary */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Duration: <span className="font-semibold text-sm">{profile.months} months</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={profile.months}
              onChange={(e) => updateProfile({ months: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Monthly Salary (SAR)
            </label>
            <input
              type="number"
              value={profile.monthlySalary}
              onChange={(e) => updateProfile({ monthlySalary: Number(e.target.value) || 0 })}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg"
            />
          </div>

          <div className="flex flex-col gap-3 text-sm pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.applyExemptions}
                onChange={(e) => updateProfile({ applyExemptions: e.target.checked })}
                className="w-4 h-4 accent-emerald-600"
              />
              Apply exemptions
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.includeRelatedCosts}
                onChange={(e) => updateProfile({ includeRelatedCosts: e.target.checked })}
                className="w-4 h-4 accent-emerald-600"
              />
              Include Iqama & related costs
            </label>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 lg:p-10">
          <p className="uppercase text-xs tracking-widest text-gray-500 mb-3">2026 RATE • SAR 400 / MONTH</p>
          <h4 className="text-3xl font-bold mb-1">Dependent Levy</h4>
          <p className="text-gray-600 dark:text-gray-400">Kingdom of Saudi Arabia</p>

          <div className="my-8">
            <div className="text-6xl font-bold text-emerald-600">
              {result.monthlyLevy.toLocaleString()}
              <span className="text-3xl font-normal text-gray-400"> SAR</span>
            </div>
            <p className="text-2xl mt-1">
              ≈ ${(result.monthlyLevy * usdRate).toFixed(0)} USD / month
            </p>
          </div>

          {/* Salary Impact Bar */}
          {profile.monthlySalary > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Impact on Salary</span>
                <span className="font-semibold">{result.salaryImpactPercent}%</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all"
                  style={{ width: `${Math.min(result.salaryImpactPercent, 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-semibold text-3xl">{result.effectiveDependents}</div>
              <div className="text-xs text-gray-500">Dependents</div>
            </div>
            <div>
              <div className="font-semibold text-3xl">{result.periodTotal.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{profile.months} months</div>
            </div>
            <div>
              <div className="font-semibold text-3xl">{result.annualLevy.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Annual</div>
            </div>
            <div>
              <div className="font-semibold text-3xl text-emerald-600">{result.totalWithRelated.toLocaleString()}</div>
              <div className="text-xs text-gray-500">With Related Costs</div>
            </div>
          </div>
        </div>

        {/* Pie Chart + Breakdown remain the same but feel free to adjust */}
        {pieData.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <h5 className="font-semibold text-xl mb-6">Monthly Breakdown</h5>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} SAR`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Keep the table and insights as before */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold text-xl mb-6">Detailed Breakdown</h5>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left">Category</th>
                <th className="pb-4 text-right">Count</th>
                <th className="pb-4 text-right">Monthly</th>
                <th className="pb-4 text-right">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.breakdown.map((item, i) => (
                <tr key={i}>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4 text-right">{item.count}</td>
                  <td className="py-4 text-right">{item.monthly}</td>
                  <td className="py-4 text-right">{item.annual}</td>
                </tr>
              ))}
              <tr className="font-bold bg-emerald-50 dark:bg-emerald-950">
                <td className="py-4">TOTAL</td>
                <td className="py-4 text-right">{result.totalDependents}</td>
                <td className="py-4 text-right">{result.monthlyLevy}</td>
                <td className="py-4 text-right">{result.annualLevy}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// app/tools/_shared/LocalizationQuotaCalculator.tsx
// Shared UI shell for Qatar / Oman / Kuwait / Bahrain workforce localization
// quota calculators. Each page supplies its own GULF_LOCALIZATION_RULES entry.
'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { GULF_LOCALIZATION_RULES, type LocalizationCountry } from '@/lib/gulfLocalizationRules';

interface Props {
  country: LocalizationCountry;
}

export default function LocalizationQuotaCalculator({ country }: Props) {
  const config = GULF_LOCALIZATION_RULES[country];

  const [totalWorkforce, setTotalWorkforce] = useState(50);
  const [nationalEmployees, setNationalEmployees] = useState(5);
  const [sectorIndex, setSectorIndex] = useState(0);

  const sector = config.sectorTargets[sectorIndex];

  const currentPercent = useMemo(() => {
    if (totalWorkforce <= 0) return 0;
    return (nationalEmployees / totalWorkforce) * 100;
  }, [totalWorkforce, nationalEmployees]);

  const hasTarget = typeof sector.targetPercent === 'number';
  const gap = hasTarget ? (sector.targetPercent as number) - currentPercent : null;
  const isCompliant = hasTarget ? currentPercent >= (sector.targetPercent as number) : null;
  const nationalsNeeded = hasTarget && gap !== null && gap > 0
    ? Math.ceil((sector.targetPercent as number) / 100 * totalWorkforce - nationalEmployees)
    : 0;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Your Workforce</h3>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Total employees</label>
          <input
            type="number"
            min="1"
            value={totalWorkforce}
            onChange={(e) => setTotalWorkforce(Math.max(1, Number(e.target.value)))}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            {config.name} national employees
          </label>
          <input
            type="number"
            min="0"
            value={nationalEmployees}
            onChange={(e) => setNationalEmployees(Math.max(0, Number(e.target.value)))}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sector</label>
          <select
            value={sectorIndex}
            onChange={(e) => setSectorIndex(Number(e.target.value))}
            className="w-full p-3 border rounded-2xl dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            {config.sectorTargets.map((s, i) => (
              <option key={i} value={i}>{s.sector}{typeof s.targetPercent === 'number' ? ` (target: ${s.targetPercent}%)` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-5">Your {config.programName} Ratio</h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">Current ratio</p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{currentPercent.toFixed(1)}%</p>
          </div>
          {hasTarget ? (
            <div className={`rounded-2xl p-5 ${isCompliant ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
              <p className={`text-xs font-medium mb-1 ${isCompliant ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                Sector target
              </p>
              <p className={`text-3xl font-bold ${isCompliant ? 'text-emerald-900 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'}`}>
                {sector.targetPercent}%
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Sector target</p>
              <p className="text-lg font-semibold text-gray-500">Not publicly standardized</p>
            </div>
          )}
        </div>

        {hasTarget && (
          <div className={`flex items-start gap-3 rounded-2xl p-4 mb-6 ${isCompliant ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
            {isCompliant ? (
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${isCompliant ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>
              {isCompliant
                ? `You're at or above the ${sector.targetPercent}% target for this sector.`
                : `You're ${Math.abs(gap ?? 0).toFixed(1)} percentage points below target — that's roughly ${nationalsNeeded} more ${config.name} national${nationalsNeeded === 1 ? '' : 's'} to reach ${sector.targetPercent}% at your current headcount.`}
            </p>
          </div>
        )}

        {!hasTarget && (
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6">
            <HelpCircle size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{sector.note}</p>
          </div>
        )}

        {hasTarget && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">{sector.note}</p>
          </div>
        )}

        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">How it's enforced:</strong> {config.enforcementNote}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Non-compliance:</strong> {config.penaltyNote}</p>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Legal basis: {config.legalBasis}. This is a self-reported estimate — {config.name} does not run a public
          per-company lookup for {config.programName.toLowerCase()} status the way Saudi Arabia's Nitaqat system
          does. Confirm your specific obligations with the relevant ministry. Not legal advice.
        </p>
      </div>
    </div>
  );
}

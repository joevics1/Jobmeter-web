// app/tools/saudi-eosb-calculator/SaudiEOSBCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calculator, AlertTriangle } from 'lucide-react';

interface FormData {
  employeeType: 'expat' | 'saudi';
  actualWage: number;
  contractType: 'fixed' | 'unlimited' | 'parttime';
  partTimePercent: number;
  startDate: string;
  endDate: string;
  unpaidDays: number;
  reason: string;
  probationCompleted: boolean;
  unusedLeaveDays: number;
}

export default function SaudiEOSBCalculator() {
  const [form, setForm] = useState<FormData>({
    employeeType: 'expat',
    actualWage: 6500,
    contractType: 'unlimited',
    partTimePercent: 100,
    startDate: '2022-01-01',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    unpaidDays: 0,
    reason: 'employer_termination',
    probationCompleted: true,
    unusedLeaveDays: 25,
  });

  const result = useMemo(() => {
    if (!form.startDate || !form.endDate || form.actualWage <= 0) return null;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    let totalDays = differenceInDays(end, start) + 1;
    if (totalDays < 0) totalDays = 0;

    const effectiveDays = Math.max(0, totalDays - form.unpaidDays);
    const years = effectiveDays / 365.25;
    const fullYears = Math.floor(years);
    const fractional = years - fullYears;

    let baseGratuity = 0;
    const first5 = Math.min(5, fullYears);
    baseGratuity += first5 * 0.5 * form.actualWage;
    if (fullYears > 5) baseGratuity += (fullYears - 5) * form.actualWage;
    const rate = fullYears >= 5 ? 1 : 0.5;
    baseGratuity += fractional * rate * form.actualWage;

    let multiplier = 1;
    let warning = '';

    if (form.reason === 'resignation') {
      if (years < 2) { multiplier = 0; warning = 'No entitlement before 2 years (Resignation)'; }
      else if (years < 5) multiplier = 1 / 3;
      else if (years < 10) multiplier = 2 / 3;
    } else if (form.reason === 'gross_misconduct') {
      multiplier = 0;
      warning = 'Usually forfeited under Article 80';
    }

    let finalEOSB = Math.round(baseGratuity * multiplier);
    if (form.contractType === 'parttime') {
      finalEOSB = Math.round(finalEOSB * (form.partTimePercent / 100));
    }
    if (!form.probationCompleted && form.reason !== 'resignation') finalEOSB = 0;

    const leavePay = Math.round((form.unusedLeaveDays / 30) * form.actualWage);

    return {
      years: years.toFixed(2),
      effectiveYears: (effectiveDays / 365.25).toFixed(2),
      baseGratuity: Math.round(baseGratuity),
      finalEOSB,
      multiplier,
      leavePay,
      totalSettlement: finalEOSB + leavePay,
      warning,
    };
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const employerFees = form.employeeType === 'expat' 
    ? Math.round(parseFloat(result?.years || '0') * 10250) 
    : 0;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Compact Inputs */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Calculator className="w-7 h-7 text-emerald-600" /> Your Details
        </h3>

        <div className="space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium">Employee Type</label>
              <select name="employeeType" value={form.employeeType} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800">
                <option value="expat">Expatriate</option>
                <option value="saudi">Saudi National</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium">Contract Type</label>
              <select name="contractType" value={form.contractType} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800">
                <option value="unlimited">Unlimited</option>
                <option value="fixed">Fixed-term</option>
                <option value="parttime">Part-time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-medium">Actual Monthly Wage (SAR)</label>
            <input type="number" name="actualWage" value={form.actualWage} onChange={handleChange}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div>
              <label className="block mb-1.5 font-medium">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium">Unpaid Days</label>
              <input type="number" name="unpaidDays" value={form.unpaidDays} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div>
              <label className="block mb-1.5 font-medium">Unused Leave Days</label>
              <input type="number" name="unusedLeaveDays" value={form.unusedLeaveDays} onChange={handleChange}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-medium">Reason for Termination</label>
            <select name="reason" value={form.reason} onChange={handleChange}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800">
              <option value="employer_termination">Employer Termination / Contract End</option>
              <option value="resignation">Employee Resignation</option>
              <option value="mutual">Mutual Agreement</option>
              <option value="gross_misconduct">Gross Misconduct (Art 80)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="probation" checked={form.probationCompleted}
              onChange={(e) => setForm(p => ({ ...p, probationCompleted: e.target.checked }))} />
            <label htmlFor="probation">Probation Completed</label>
          </div>
        </div>
      </div>

      {/* Visual Results */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 border border-gray-100 dark:border-gray-800 text-center">
          <p className="uppercase tracking-widest text-xs text-gray-500 mb-2">YOUR ENTITLEMENT</p>
          
          {result ? (
            <div className="mb-8">
              <div className="text-7xl font-bold text-emerald-600 tracking-tighter">
                {result.finalEOSB.toLocaleString()}
              </div>
              <p className="text-2xl text-gray-600 dark:text-gray-400">SAR Gratuity</p>
            </div>
          ) : (
            <div className="py-16 text-gray-400">Fill the form to see your gratuity</div>
          )}

          {result?.warning && (
            <div className="mx-auto max-w-md flex gap-3 bg-amber-50 dark:bg-amber-950 p-4 rounded-2xl text-left">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
              <p className="text-sm">{result.warning}</p>
            </div>
          )}
        </div>

        {/* Visual Breakdown Cards */}
        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold mb-4">Service Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Service</span>
                  <span className="font-medium">{result.years} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Effective Service</span>
                  <span className="font-medium">{result.effectiveYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base Amount</span>
                  <span>{result.baseGratuity.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold mb-4">Final Settlement</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>EOSB Gratuity</span>
                  <span className="font-semibold">{result.finalEOSB.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span>Unused Leave</span>
                  <span className="font-semibold">{result.leavePay.toLocaleString()} SAR</span>
                </div>
                <div className="pt-4 border-t flex justify-between text-lg font-bold">
                  <span>Total Payout</span>
                  <span>{result.totalSettlement.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employer Insight */}
        {result && form.employeeType === 'expat' && employerFees > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
            <p className="text-emerald-700 dark:text-emerald-300">
              <strong>Employer Insight:</strong> Company likely spent ~{employerFees.toLocaleString()} SAR on government fees (Iqama + Work Permit) during this period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const nitaqatTiers = [
  { value: 'platinum', label: 'Platinum', levyMonthly: 600 },
  { value: 'high_green', label: 'High Green', levyMonthly: 700 },
  { value: 'medium_green', label: 'Medium Green', levyMonthly: 800 },
  { value: 'low_green', label: 'Low Green', levyMonthly: 900 },
  { value: 'red', label: 'Red', levyMonthly: 9600 / 12 },
];

const workerCategories = [
  { value: 'company', label: 'Company / Institution Worker' },
  { value: 'agricultural', label: 'Agricultural Worker' },
  { value: 'domestic', label: 'Domestic Worker' },
];

export default function IqamaCalculatorClient() {
  const [category, setCategory] = useState('company');
  const [nitaqatTier, setNitaqatTier] = useState('medium_green');
  const [isIndustrial, setIsIndustrial] = useState(false);
  const [periodMonths, setPeriodMonths] = useState(12);
  const [dependents, setDependents] = useState(0);
  const [insurancePerPerson, setInsurancePerPerson] = useState(1200);
  const [lateRenewal, setLateRenewal] = useState(false);

  const currentTier = nitaqatTiers.find(t => t.value === nitaqatTier)!;

  const calculation = useMemo(() => {
    const baseIqama = category === 'domestic' ? 600 : 650;
    let workPermitLevy = currentTier.levyMonthly * periodMonths;

    if (isIndustrial) workPermitLevy = 0; // Industrial exemption

    const dependentLevy = dependents * 4800 * (periodMonths / 12);
    const baseIqamaTotal = (baseIqama / 12) * periodMonths;
    const insuranceTotal = (insurancePerPerson * (1 + dependents)) * (periodMonths / 12);

    const absherFee = 52;
    const medicalExam = 350;
    const lateFine = lateRenewal ? (periodMonths > 6 ? 1000 : 500) : 0;

    const employerPaid = Math.round(baseIqamaTotal + workPermitLevy + insuranceTotal * 0.7 + absherFee + medicalExam);
    const employeePaid = Math.round(dependentLevy + insuranceTotal * 0.3 + lateFine);

    const grandTotal = employerPaid + employeePaid;

    return {
      grandTotal,
      employerPaid,
      employeePaid,
      breakdown: [
        { name: 'Base Iqama', value: Math.round(baseIqamaTotal), fill: '#10b981' },
        { name: 'Work Permit Levy', value: Math.round(workPermitLevy), fill: '#3b82f6' },
        { name: 'Dependent Levies', value: Math.round(dependentLevy), fill: '#8b5cf6' },
        { name: 'Health Insurance', value: Math.round(insuranceTotal), fill: '#f59e0b' },
        { name: 'Other Fees', value: Math.round(absherFee + medicalExam + lateFine), fill: '#ef4444' },
      ]
    };
  }, [category, nitaqatTier, isIndustrial, periodMonths, dependents, insurancePerPerson, lateRenewal]);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl p-8 border">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span>Calculate Your Iqama Cost</span>
        </h3>

        <div className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-2">Worker Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 border rounded-2xl text-lg">
              {workerCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nitaqat Tier</label>
            <select value={nitaqatTier} onChange={(e) => setNitaqatTier(e.target.value)} className="w-full p-4 border rounded-2xl text-lg">
              {nitaqatTiers.map(tier => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={isIndustrial} onChange={(e) => setIsIndustrial(e.target.checked)} className="w-5 h-5" />
            <label className="text-sm">Industrial / Exempt Sector</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Renewal Period: <span className="font-semibold">{periodMonths} months</span></label>
            <input
              type="range"
              min="3"
              max="12"
              step="3"
              value={periodMonths}
              onChange={(e) => setPeriodMonths(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Dependents</label>
            <input
              type="number"
              min="0"
              value={dependents}
              onChange={(e) => setDependents(Math.max(0, Number(e.target.value)))}
              className="w-full p-4 border rounded-2xl text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Health Insurance per Person (SAR/year): <span className="font-semibold">{insurancePerPerson}</span>
            </label>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={insurancePerPerson}
              onChange={(e) => setInsurancePerPerson(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={lateRenewal} onChange={(e) => setLateRenewal(e.target.checked)} className="w-5 h-5" />
            <label className="text-sm">Simulate Late Renewal Fine</label>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-10 shadow-xl">
          <p className="uppercase tracking-widest text-emerald-100 text-sm mb-2">ESTIMATED TOTAL COST</p>
          <div className="text-6xl font-bold mb-1">
            {calculation.grandTotal.toLocaleString()} <span className="text-3xl">SAR</span>
          </div>
          <p className="text-emerald-100">for {periodMonths} months renewal</p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div>
              <div className="text-emerald-100 text-sm">Employer Pays</div>
              <div className="text-3xl font-semibold">{calculation.employerPaid.toLocaleString()} SAR</div>
            </div>
            <div>
              <div className="text-emerald-100 text-sm">You / Sponsor Pays</div>
              <div className="text-3xl font-semibold">{calculation.employeePaid.toLocaleString()} SAR</div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h4 className="font-semibold text-xl mb-6">Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={calculation.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                dataKey="value"
              >
                {calculation.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} SAR`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h4 className="font-semibold text-xl mb-6">Detailed Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-4">Item</th>
                  <th className="pb-4 text-right">Amount (SAR)</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {calculation.breakdown.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4">{item.name}</td>
                    <td className="py-4 text-right font-medium">{item.value.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold text-lg border-t-2">
                  <td className="pt-6">Grand Total</td>
                  <td className="pt-6 text-right">{calculation.grandTotal.toLocaleString()} SAR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
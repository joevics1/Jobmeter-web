'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { gulfColData } from '@/lib/gulfColData';

const countries = [
  { code: 'UAE', name: 'UAE', flag: '🇦🇪', currency: 'AED' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR' },
  { code: 'Qatar', name: 'Qatar', flag: '🇶🇦', currency: 'QAR' },
  { code: 'Kuwait', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD' },
  { code: 'Bahrain', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD' },
  { code: 'Oman', name: 'Oman', flag: '🇴🇲', currency: 'OMR' },
];

const usdRates: Record<string, number> = {
  AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.385,
};

function calculateGratuity(country: string, baseMonthly: number, years: number): number {
  const baseAnnual = baseMonthly * 12;
  if (['UAE', 'Qatar', 'Saudi Arabia'].includes(country)) {
    const first5 = Math.min(years, 5) * 21;
    const after5 = Math.max(0, years - 5) * 30;
    return Math.round(((first5 + after5) / 365) * baseAnnual);
  }
  return Math.round((21 / 365) * baseAnnual * years);
}

export default function JobOfferEvaluator() {
  const [activeOffer, setActiveOffer] = useState<'A' | 'B'>('A');

  const [offerA, setOfferA] = useState({
    name: 'Offer A',
    country: 'UAE',
    city: 'Dubai',
    baseSalary: 28000,
    housingAllowance: 12000,
    transport: 2000,
    otherAllowances: 3000,
    annualBonusPercent: 15,
    contractYears: 2,
    familyStatus: 'family' as 'single' | 'married' | 'family',
    numChildren: 2,
    annualFlights: 2,
    medicalTier: 'premium' as 'standard' | 'premium',
    companyHousing: false,
  });

  const [offerB, setOfferB] = useState({
    name: 'Offer B',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    baseSalary: 22000,
    housingAllowance: 9000,
    transport: 1800,
    otherAllowances: 2500,
    annualBonusPercent: 12,
    contractYears: 3,
    familyStatus: 'family' as 'single' | 'married' | 'family',
    numChildren: 1,
    annualFlights: 1,
    medicalTier: 'standard' as 'standard' | 'premium',
    companyHousing: false,
  });

  const currentOffer = activeOffer === 'A' ? offerA : offerB;
  const setCurrentOffer = activeOffer === 'A' ? setOfferA : setOfferB;

  const cityData = useMemo(() => {
    return gulfColData.find(
      (c: any) => c.Country === currentOffer.country && c.City === currentOffer.city
    ) || gulfColData[0];
  }, [currentOffer.country, currentOffer.city]);

  const calculations = useMemo(() => {
    const {
      baseSalary, housingAllowance, transport, otherAllowances,
      annualBonusPercent, contractYears, familyStatus, numChildren,
      annualFlights, companyHousing, medicalTier
    } = currentOffer;

    const monthlyGross = baseSalary +
      (companyHousing ? 0 : housingAllowance) +
      transport + otherAllowances;

    const annualGross = monthlyGross * 12;
    const annualBonus = annualGross * (annualBonusPercent / 100);
    const gratuity = calculateGratuity(currentOffer.country, baseSalary, contractYears);

    // Family COL Multiplier
    let familyMultiplier = familyStatus === 'single' ? 0.55 : familyStatus === 'married' ? 0.8 : 1.0;
    const childMultiplier = 1 + Math.max(0, numChildren - 2) * 0.22;

    const monthlyCOL =
      (companyHousing ? 0 : Number(cityData['Rent 3BR (Monthly)'] || 8000)) +
      Number(cityData['Groceries (Family 4/Mo)'] || 3500) * familyMultiplier * childMultiplier +
      Number(cityData['Utilities & Internet'] || 1000) +
      Number(cityData['Schooling (Per Child/Mo)'] || 3000) * numChildren +
      Number(cityData['Transport (Monthly)'] || 800);

    const flightsValueAnnual = annualFlights * 950;
    const medicalValueAnnual = medicalTier === 'premium' ? 5200 : 2800;

    const totalAnnualValue = annualGross + annualBonus + gratuity + flightsValueAnnual + medicalValueAnnual;
    const effectiveMonthly = monthlyGross - (monthlyCOL / 12);

    const qualityScore = Math.min(98, Math.max(45,
      45 + (monthlyGross / 25000) * 28 + (contractYears * 9) + (annualBonusPercent * 1.1) + (annualFlights * 4)
    ));

    const pieData = [
      { name: 'Base + Allowances', value: Math.round(monthlyGross), fill: '#2563eb' },
      { name: 'Bonus (avg monthly)', value: Math.round(annualBonus / 12), fill: '#10b981' },
      { name: 'Benefits (Flights + Medical)', value: Math.round((flightsValueAnnual + medicalValueAnnual) / 12), fill: '#8b5cf6' },
    ];

    const totalPie = pieData.reduce((sum, item) => sum + item.value, 0);
    const pieWithPercent = pieData.map(item => ({
      ...item,
      percent: totalPie > 0 ? Math.round((item.value / totalPie) * 100) : 0
    }));

    return {
      monthlyGross: Math.round(monthlyGross),
      totalAnnualValue: Math.round(totalAnnualValue),
      gratuity: Math.round(gratuity),
      qualityScore: Math.round(qualityScore),
      effectiveMonthly: Math.round(effectiveMonthly),
      monthlyCOL: Math.round(monthlyCOL),
      usdTotalAnnual: Math.round(totalAnnualValue / (usdRates[cityData.Currency] || 3.67)),
      pieData: pieWithPercent,
    };
  }, [currentOffer, cityData]);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-6">Offer Details</h3>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveOffer('A')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${activeOffer === 'A' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'}`}
          >
            Offer A
          </button>
          <button
            onClick={() => setActiveOffer('B')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${activeOffer === 'B' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'}`}
          >
            Offer B
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Offer Name</label>
            <input
              type="text"
              value={currentOffer.name}
              onChange={(e) => setCurrentOffer({ ...currentOffer, name: e.target.value })}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={currentOffer.country}
                onChange={(e) => setCurrentOffer({ ...currentOffer, country: e.target.value, city: '' })}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                value={currentOffer.city}
                onChange={(e) => setCurrentOffer({ ...currentOffer, city: e.target.value })}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                {gulfColData
                  .filter((c: any) => c.Country === currentOffer.country)
                  .map((c: any) => (
                    <option key={c.City} value={c.City}>{c.City}</option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Monthly Base Salary ({cityData.Currency}): <span className="font-semibold">{currentOffer.baseSalary.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="8000"
              max="80000"
              step="500"
              value={currentOffer.baseSalary}
              onChange={(e) => setCurrentOffer({ ...currentOffer, baseSalary: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Housing Allowance (Monthly)</label>
            <input
              type="range"
              min="0"
              max="35000"
              step="500"
              value={currentOffer.housingAllowance}
              onChange={(e) => setCurrentOffer({ ...currentOffer, housingAllowance: Number(e.target.value) })}
              className="w-full accent-emerald-600"
              disabled={currentOffer.companyHousing}
            />
            <div className="text-center text-sm font-medium mt-1">
              {currentOffer.housingAllowance.toLocaleString()} {cityData.Currency}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={currentOffer.companyHousing}
              onChange={(e) => setCurrentOffer({ ...currentOffer, companyHousing: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="text-sm font-medium">Company-Provided Housing (No allowance)</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contract Length: {currentOffer.contractYears} years</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={currentOffer.contractYears}
              onChange={(e) => setCurrentOffer({ ...currentOffer, contractYears: Number(e.target.value) })}
              className="w-full accent-violet-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Family Status</label>
            <select
              value={currentOffer.familyStatus}
              onChange={(e) => setCurrentOffer({ ...currentOffer, familyStatus: e.target.value as any })}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800"
            >
              <option value="single">Single</option>
              <option value="married">Married (No Children)</option>
              <option value="family">Family with Children</option>
            </select>
          </div>

          {currentOffer.familyStatus === 'family' && (
            <div>
              <label className="block text-sm font-medium mb-2">Number of Children</label>
              <input
                type="number"
                min="0"
                max="6"
                value={currentOffer.numChildren}
                onChange={(e) => setCurrentOffer({ ...currentOffer, numChildren: Number(e.target.value) })}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Annual Bonus: {currentOffer.annualBonusPercent}%</label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={currentOffer.annualBonusPercent}
              onChange={(e) => setCurrentOffer({ ...currentOffer, annualBonusPercent: Number(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Annual Flights (Employee + Family)</label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={currentOffer.annualFlights}
              onChange={(e) => setCurrentOffer({ ...currentOffer, annualFlights: Number(e.target.value) })}
              className="w-full accent-rose-600"
            />
            <div className="text-center font-semibold">{currentOffer.annualFlights} round trips</div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10">
          <p className="uppercase text-xs tracking-widest text-gray-500 mb-1">{currentOffer.name}</p>
          <h4 className="text-3xl font-bold mb-1">{currentOffer.city}, {currentOffer.country}</h4>

          <div className="mt-6 mb-8">
            <div className="text-6xl font-bold text-emerald-600">
              {calculations.monthlyGross.toLocaleString()} {cityData.Currency}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Monthly Gross</p>
            <p className="text-xl mt-1">
              ≈ ${Math.round(calculations.monthlyGross / (usdRates[cityData.Currency] || 3.67)).toLocaleString()} USD
            </p>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <span className="text-5xl font-bold text-violet-600">{calculations.qualityScore}</span>
              <span className="text-sm ml-2 text-gray-500">Quality Score</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-lg">Gratuity: {calculations.gratuity.toLocaleString()} {cityData.Currency}</div>
              <div className="text-sm text-gray-500">over {currentOffer.contractYears} years</div>
            </div>
          </div>

          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={calculations.pieData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={115}
                dataKey="value"
              >
                {calculations.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with Percentages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {calculations.pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ backgroundColor: item.fill }} />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-2xl font-bold">{item.percent}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
            <h5 className="font-semibold text-lg mb-3">Total Annual Compensation</h5>
            <div className="text-4xl font-bold mb-1">{calculations.totalAnnualValue.toLocaleString()} {cityData.Currency}</div>
            <div className="text-xl">≈ ${calculations.usdTotalAnnual.toLocaleString()} USD</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8">
            <h5 className="font-semibold text-lg mb-3">Effective Monthly Take-Home</h5>
            <div className="text-4xl font-bold text-emerald-600">
              {calculations.effectiveMonthly.toLocaleString()} {cityData.Currency}
            </div>
            <p className="text-sm text-gray-500 mt-2">After estimated family living costs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
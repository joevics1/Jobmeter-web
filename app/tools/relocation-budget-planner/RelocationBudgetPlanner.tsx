// app/tools/relocation-budget-planner/RelocationBudgetPlanner.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  calculateRelocationCosts, 
  GCC_COUNTRIES, 
  CITY_DATA, 
  type Currency 
} from '@/lib/relocationUtils';

const PIE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function RelocationBudgetPlanner() {
  const [countryCode, setCountryCode] = useState('UAE');
  const [city, setCity] = useState('Dubai');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [housingType, setHousingType] = useState<'Studio' | '1BR' | '2BR' | '3BR'>('1BR');
  const [lifestyle, setLifestyle] = useState<'Budget' | 'Mid-range' | 'Comfort/Luxury'>('Mid-range');
  const [shipping, setShipping] = useState(false);
  const [employerFlights, setEmployerFlights] = useState(false);
  const [employerHousing, setEmployerHousing] = useState(false);
  const [employerVisa, setEmployerVisa] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  const result = useMemo(() => 
    calculateRelocationCosts({
      countryCode,
      city,
      adults,
      children,
      housingType,
      lifestyle,
      shipping,
      employerFlights,
      employerHousing,
      employerVisa,
      currency: selectedCurrency,
    }), 
    [
      countryCode, city, adults, children, housingType, lifestyle,
      shipping, employerFlights, employerHousing, employerVisa, selectedCurrency
    ]
  );

  const pieData = Object.entries(result.breakdown).map(([key, value], index) => {
    const name = key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace('visaMedicals', 'Visa & Medicals')
      .replace('furnishingShipping', 'Furnishing & Shipping')
      .replace('housingSetup', 'Housing Setup');

    return {
      name,
      value: value as number,
      color: PIE_COLORS[index % PIE_COLORS.length],
      percent: result.oneTimeTotal > 0 
        ? ((value as number / result.oneTimeTotal) * 100).toFixed(1) 
        : '0',
    };
  });

  const availableCities = Object.keys(CITY_DATA[countryCode] || {});

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Your Relocation Profile</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destination Country</label>
              <select
                value={countryCode}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  setCountryCode(newCountry);
                  setCity(Object.keys(CITY_DATA[newCountry])[0]);
                }}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                {GCC_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Adults</label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Children</label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Housing Type</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value as 'Studio' | '1BR' | '2BR' | '3BR')}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800"
            >
              <option value="Studio">Studio</option>
              <option value="1BR">1 Bedroom</option>
              <option value="2BR">2 Bedroom</option>
              <option value="3BR">3 Bedroom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lifestyle Level</label>
            <select
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value as 'Budget' | 'Mid-range' | 'Comfort/Luxury')}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800"
            >
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Comfort/Luxury">Comfort / Luxury</option>
            </select>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={shipping} onChange={(e) => setShipping(e.target.checked)} className="w-5 h-5" />
              <span>Shipping personal belongings</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={employerFlights} onChange={(e) => setEmployerFlights(e.target.checked)} className="w-5 h-5" />
              <span>Employer covers flights</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={employerHousing} onChange={(e) => setEmployerHousing(e.target.checked)} className="w-5 h-5" />
              <span>Employer provides housing</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={employerVisa} onChange={(e) => setEmployerVisa(e.target.checked)} className="w-5 h-5" />
              <span>Employer sponsors visa & medicals</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {(['USD', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'NGN'] as const).map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 text-center">
          <p className="uppercase text-xs tracking-widest text-emerald-600 mb-3">
            ESTIMATED RELOCATION BUDGET
          </p>
          <div className="text-6xl font-bold text-emerald-600 mb-2">
            {result.oneTimeTotal.toLocaleString()} {selectedCurrency}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            One-time + First 2 Months Setup
          </p>
          <p className="text-lg mt-2">
            + {result.monthlyTotal.toLocaleString()} {selectedCurrency}/month ongoing
          </p>
        </div>

        {/* Pie Chart + Legend */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold text-xl mb-6">Cost Breakdown</h5>
          
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={135}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${selectedCurrency}`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-8 space-y-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-lg flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{item.value.toLocaleString()} {selectedCurrency}</span>
                  <span className="text-sm text-gray-500 ml-3">({item.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
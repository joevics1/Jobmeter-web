// app/tools/cost-of-living/CostOfLivingTool.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { GCC_CITIES_DATA, CURRENCY_INFO, calculateMonthlyCosts } from '@/lib/costOfLivingData';

const householdTypes = [
  { label: 'Single', value: 'single' },
  { label: 'Couple', value: 'couple' },
  { label: 'Family (2 Adults + 1 Child)', value: 'family1' },
  { label: 'Family (2 Adults + 2 Children)', value: 'family2' },
];

const lifestyleLevels = [
  { label: 'Budget', multiplier: 0.85, color: '#10b981' },
  { label: 'Moderate', multiplier: 1, color: '#3b82f6' },
  { label: 'Premium', multiplier: 1.35, color: '#8b5cf6' },
];

export default function CostOfLivingTool() {
  const [selectedCities, setSelectedCities] = useState<string[]>(['Dubai', 'Riyadh']);
  const [household, setHousehold] = useState('single');
  const [lifestyle, setLifestyle] = useState(1); // index
  const [numChildren, setNumChildren] = useState(1);
  const [housingType, setHousingType] = useState('1br'); // 1br, 2br, 3br
  const [locationType, setLocationType] = useState('center'); // center / outskirts
  const [hasCar, setHasCar] = useState(false);
  const [internationalSchool, setInternationalSchool] = useState(true);
  const [monthlySalary, setMonthlySalary] = useState(20000);

  const currentLifestyle = lifestyleLevels[lifestyle];

  const results = useMemo(() => {
    return selectedCities.map(city => {
      const baseData = GCC_CITIES_DATA[city] || GCC_CITIES_DATA['Dubai'];
      return calculateMonthlyCosts(
        city,
        baseData,
        household,
        numChildren,
        housingType,
        locationType,
        hasCar,
        internationalSchool,
        currentLifestyle.multiplier
      );
    });
  }, [selectedCities, household, numChildren, housingType, locationType, hasCar, internationalSchool, currentLifestyle.multiplier]);

  const primaryResult = results[0];

  const pieData = primaryResult ? [
    { name: 'Housing', value: primaryResult.housing, fill: '#2563eb' },
    { name: 'Food', value: primaryResult.food, fill: '#10b981' },
    { name: 'Utilities', value: primaryResult.utilities, fill: '#f59e0b' },
    { name: 'Transport', value: primaryResult.transport, fill: '#8b5cf6' },
    { name: 'Education', value: primaryResult.education, fill: '#ec4899' },
    { name: 'Misc', value: primaryResult.misc, fill: '#64748b' },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border">
        <h3 className="text-2xl font-bold mb-8">Your Situation</h3>

        <div className="space-y-8">
          {/* Cities */}
          <div>
            <label className="block text-sm font-medium mb-3">Compare Cities (select 1-3)</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(GCC_CITIES_DATA).map(city => (
                <button
                  key={city}
                  onClick={() => {
                    if (selectedCities.includes(city)) {
                      if (selectedCities.length > 1) setSelectedCities(selectedCities.filter(c => c !== city));
                    } else if (selectedCities.length < 3) {
                      setSelectedCities([...selectedCities, city]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCities.includes(city)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Household Type</label>
            <select
              value={household}
              onChange={(e) => setHousehold(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800"
            >
              {householdTypes.map(h => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          {household.includes('family') && (
            <div>
              <label className="block text-sm font-medium mb-2">Number of Children: {numChildren}</label>
              <input
                type="range"
                min="1"
                max="4"
                value={numChildren}
                onChange={(e) => setNumChildren(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Lifestyle</label>
            <div className="flex gap-2">
              {lifestyleLevels.map((l, i) => (
                <button
                  key={i}
                  onClick={() => setLifestyle(i)}
                  className={`flex-1 py-3 rounded-2xl font-medium ${lifestyle === i ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Housing</label>
            <div className="grid grid-cols-3 gap-3">
              {['1br', '2br', '3br'].map((type) => (
                <button
                  key={type}
                  onClick={() => setHousingType(type)}
                  className={`py-3 rounded-2xl ${housingType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full mt-3 p-4 border rounded-2xl dark:bg-gray-800"
            >
              <option value="center">City Centre</option>
              <option value="outskirts">Outskirts / Suburbs</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label>Own a Car</label>
            <input
              type="checkbox"
              checked={hasCar}
              onChange={(e) => setHasCar(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <label>International School</label>
            <input
              type="checkbox"
              checked={internationalSchool}
              onChange={(e) => setInternationalSchool(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Monthly Salary (AED/SAR/etc): {monthlySalary.toLocaleString()}
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              step="500"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-7 space-y-8">
        {results.map((res, idx) => {
          const city = selectedCities[idx];
          const surplus = monthlySalary - res.totalMonthly;
          return (
            <div key={city} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-3xl font-bold">{city}</h4>
                  <p className="text-gray-500">2026 Estimate • {currentLifestyle.label} Lifestyle</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-emerald-600">
                    {Math.round(res.totalMonthly)}
                  </div>
                  <p className="text-sm text-gray-500">AED / month</p>
                </div>
              </div>

              <div className="mb-8">
                <div className={`inline-flex px-4 py-1 rounded-full text-sm font-medium ${surplus >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {surplus >= 0 ? `+${surplus} AED surplus` : `${surplus} AED deficit`}
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(res).filter(([k]) => !['totalMonthly'].includes(k)).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{Math.round(value as number)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Comparison Table */}
        {results.length > 1 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 overflow-x-auto">
            <h5 className="font-semibold text-xl mb-6">City Comparison</h5>
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Category</th>
                  {selectedCities.map(c => <th key={c} className="text-center py-3">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {['housing', 'food', 'utilities', 'transport', 'education', 'misc', 'totalMonthly'].map(cat => (
                  <tr key={cat} className="border-b">
                    <td className="py-3 font-medium capitalize">{cat.replace('totalMonthly', 'Total')}</td>
                    {results.map((r, i) => (
                      <td key={i} className="text-center py-3 font-semibold">
                        {Math.round((r as any)[cat])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-sm">
          <h5 className="font-semibold mb-4">Pro Tips for GCC Expats</h5>
          <ul className="space-y-2">
            <li>• Company housing allowance can cover 30-50% of rent in many packages.</li>
            <li>• International schools are the biggest family expense — budget early.</li>
            <li>• Fuel is very cheap across the region. Owning a car is often affordable.</li>
            <li>• Shop at hypermarkets (Carrefour, Lulu) and cook at home to save significantly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
// app/tools/remittance-estimator/RemittanceEstimatorTool.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type GulfCountry = 'UAE' | 'Saudi Arabia' | 'Qatar';
type HomeCountry = 'India' | 'Pakistan' | 'Philippines' | 'Nigeria' | 'Bangladesh' | 'Egypt';

const GULF_COUNTRIES: Record<GulfCountry, { flag: string; currency: string; code: string }> = {
  'UAE': { flag: '🇦🇪', currency: 'AED', code: 'AED' },
  'Saudi Arabia': { flag: '🇸🇦', currency: 'SAR', code: 'SAR' },
  'Qatar': { flag: '🇶🇦', currency: 'QAR', code: 'QAR' },
};

const HOME_COUNTRIES: Record<HomeCountry, { flag: string; currency: string }> = {
  'India': { flag: '🇮🇳', currency: 'INR' },
  'Pakistan': { flag: '🇵🇰', currency: 'PKR' },
  'Philippines': { flag: '🇵🇭', currency: 'PHP' },
  'Nigeria': { flag: '🇳🇬', currency: 'NGN' },
  'Bangladesh': { flag: '🇧🇩', currency: 'BDT' },
  'Egypt': { flag: '🇪🇬', currency: 'EGP' },
};

const LIFESTYLES = [
  { value: 'single-bachelor', label: 'Single / Bachelor (Shared)' },
  { value: 'single-professional', label: 'Single Professional (1-Bed)' },
  { value: 'couple', label: 'Couple / Married No Kids' },
  { value: 'family', label: 'Family with 1-2 Kids' },
];

interface ExpenseCategory {
  name: string;
  default: number;
  min: number;
  max: number;
  step: number;
}

export default function RemittanceEstimatorTool() {
  const [gulfCountry, setGulfCountry] = useState<GulfCountry>('UAE');
  const [city, setCity] = useState('Dubai');
  const [salary, setSalary] = useState(8000);
  const [lifestyle, setLifestyle] = useState('single-professional');
  const [homeCountry, setHomeCountry] = useState<HomeCountry>('India');
  
  // Editable expenses (will be populated based on lifestyle)
  const [expenses, setExpenses] = useState<Record<string, number>>({});

  const [scenario, setScenario] = useState<'aggressive' | 'balanced' | 'family'>('balanced');
  const [transferProvider, setTransferProvider] = useState<'wise' | 'bank' | 'remitly'>('wise');

  // Approximate live rates (in real app, fetch from API)
  const exchangeRates: Record<HomeCountry, number> = {
    'India': 22.8,      // 1 AED ≈ 22.8 INR (approx 2026)
    'Pakistan': 78.5,
    'Philippines': 15.2,
    'Nigeria': 1350,
    'Bangladesh': 28.5,
    'Egypt': 52,
  };

  // Default expense templates
  const getDefaultExpenses = (life: string, gulf: GulfCountry): Record<string, number> => {
    const base = gulf === 'UAE' ? 1 : gulf === 'Saudi Arabia' ? 0.95 : 1.05;
    
    const templates: Record<string, Record<string, number>> = {
      'single-bachelor': {
        Housing: Math.round(1500 * base),
        Food: 900,
        Utilities: 450,
        Transport: 400,
        Mobile: 150,
        Healthcare: 200,
        Misc: 600,
      },
      'single-professional': {
        Housing: Math.round(4500 * base),
        Food: 1400,
        Utilities: 700,
        Transport: 600,
        Mobile: 200,
        Healthcare: 300,
        Misc: 900,
      },
      'couple': {
        Housing: Math.round(6500 * base),
        Food: 2200,
        Utilities: 900,
        Transport: 800,
        Mobile: 300,
        Healthcare: 500,
        Misc: 1200,
      },
      'family': {
        Housing: Math.round(9500 * base),
        Food: 3200,
        Utilities: 1200,
        Transport: 1100,
        Mobile: 400,
        Healthcare: 800,
        Misc: 1500,
        Education: 3500,
      },
    };
    return templates[life] || templates['single-professional'];
  };

  // Initialize expenses when lifestyle changes
  React.useEffect(() => {
    setExpenses(getDefaultExpenses(lifestyle, gulfCountry));
  }, [lifestyle, gulfCountry]);

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce((sum, val) => sum + val, 0);
  }, [expenses]);

  const remittanceAed = Math.max(salary - totalExpenses, 0);
  const buffer = Math.round(remittanceAed * 0.1); // 10% buffer
  const netRemittance = Math.max(remittanceAed - buffer, 0);

  // Fee estimates
  const getTransferFee = (amount: number, provider: string, home: HomeCountry) => {
    if (provider === 'wise') return Math.round(amount * 0.005 + 20); // ~0.5% + fixed
    if (provider === 'remitly') return Math.round(amount * 0.015);
    return Math.round(amount * 0.04); // bank ~4%
  };

  const fee = getTransferFee(netRemittance, transferProvider, homeCountry);
  const receivedAfterFee = netRemittance - fee;
  const homeCurrencyAmount = Math.round(receivedAfterFee * exchangeRates[homeCountry]);

  const pieData = [
    { name: 'Housing', value: expenses.Housing || 0, fill: '#3b82f6' },
    { name: 'Food', value: expenses.Food || 0, fill: '#10b981' },
    { name: 'Utilities', value: expenses.Utilities || 0, fill: '#f59e0b' },
    { name: 'Other', value: (totalExpenses - (expenses.Housing || 0) - (expenses.Food || 0) - (expenses.Utilities || 0)) || 0, fill: '#8b5cf6' },
  ].filter(d => d.value > 0);

  const updateExpense = (category: string, value: number) => {
    setExpenses(prev => ({ ...prev, [category]: Math.max(0, value) }));
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border">
        <h3 className="text-2xl font-bold mb-8">Your Situation</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Gulf Country</label>
            <select value={gulfCountry} onChange={(e) => setGulfCountry(e.target.value as GulfCountry)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 text-lg">
              {Object.entries(GULF_COUNTRIES).map(([code, data]) => (
                <option key={code} value={code}>{data.flag} {code}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800">
              {gulfCountry === 'UAE' && ['Dubai', 'Abu Dhabi', 'Sharjah'].map(c => <option key={c} value={c}>{c}</option>)}
              {gulfCountry === 'Saudi Arabia' && ['Riyadh', 'Jeddah', 'Dammam'].map(c => <option key={c} value={c}>{c}</option>)}
              {gulfCountry === 'Qatar' && ['Doha'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Monthly Gross Salary ({GULF_COUNTRIES[gulfCountry].currency})</label>
            <input type="number" value={salary} onChange={(e) => setSalary(Math.max(1000, Number(e.target.value)))}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 text-2xl font-semibold" />
            <input type="range" min="2000" max="30000" step="100" value={salary} onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full mt-3 accent-emerald-600" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lifestyle Profile</label>
            <select value={lifestyle} onChange={(e) => setLifestyle(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800">
              {LIFESTYLES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Home Country</label>
            <select value={homeCountry} onChange={(e) => setHomeCountry(e.target.value as HomeCountry)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800">
              {Object.entries(HOME_COUNTRIES).map(([code, data]) => (
                <option key={code} value={code}>{data.flag} {code}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Transfer Provider (for fee estimate)</label>
            <div className="flex gap-3">
              {['wise', 'remitly', 'bank'].map(p => (
                <button key={p} onClick={() => setTransferProvider(p as any)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium ${transferProvider === p ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  {p === 'wise' ? 'Wise' : p === 'remitly' ? 'Remitly' : 'Bank'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-600 font-semibold">ESTIMATED MONTHLY REMITTANCE</p>
              <div className="text-6xl font-bold text-emerald-600 mt-2">
                {netRemittance.toLocaleString()} {GULF_COUNTRIES[gulfCountry].currency}
              </div>
              <p className="text-2xl mt-1 text-gray-600 dark:text-gray-400">
                ≈ {homeCurrencyAmount.toLocaleString()} {HOME_COUNTRIES[homeCountry].currency}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              After ~10% buffer
            </div>
          </div>

          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" 
                 style={{ width: `${Math.min((netRemittance / salary) * 100, 100)}%` }} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold">{salary.toLocaleString()}</div>
              <div className="text-gray-500">Gross Salary</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">{totalExpenses.toLocaleString()}</div>
              <div className="text-gray-500">Est. Expenses</div>
            </div>
            <div>
              <div className="font-semibold text-emerald-600">{netRemittance.toLocaleString()}</div>
              <div className="text-gray-500">Remittable</div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold text-xl mb-6">Monthly Expenses (Edit Sliders)</h5>
          
          <div className="space-y-5">
            {Object.entries(expenses).map(([cat, val]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{cat}</span>
                  <span className="font-medium">{val} {GULF_COUNTRIES[gulfCountry].currency}</span>
                </div>
                <input 
                  type="range" 
                  min={Math.max(100, val - 3000)} 
                  max={val + 5000} 
                  value={val}
                  onChange={(e) => updateExpense(cat, Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t text-lg font-semibold flex justify-between">
            <span>Total Expenses</span>
            <span>{totalExpenses.toLocaleString()} {GULF_COUNTRIES[gulfCountry].currency}</span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold mb-6">Expense Allocation</h5>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 rounded-3xl p-8">
          <h5 className="font-semibold mb-4">Optimization Insights</h5>
          <ul className="space-y-3 text-sm">
            <li>• Housing is typically 40-55% of expenses. Shared accommodation saves the most.</li>
            <li>• Using Wise usually offers the lowest total cost for these corridors.</li>
            <li>• Cooking at home can reduce food costs by 30-50%.</li>
            <li>• Current approx. rate: 1 {GULF_COUNTRIES[gulfCountry].currency} ≈ {exchangeRates[homeCountry]} {HOME_COUNTRIES[homeCountry].currency}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBenchmark, getAllowancesBreakdown, GCC_CURRENCIES } from '@/lib/salaryUtils';
import { GCC_COUNTRIES, GCC_SALARY_DATA, ALL_ROLES } from '@/lib/salaryData';

const seniorityLevels = [
  'Junior (0-3 years)',
  'Mid-Level (3-8 years)',
  'Senior (8+ years)',
  'Lead / Manager',
  'Director',
  'C-Level / Executive'
];

export default function SalaryBenchmarkTool() {
  const [country, setCountry] = useState('UAE');
  const [city, setCity] = useState('Dubai');
  const [role, setRole] = useState('Software Engineer');
  const [seniority, setSeniority] = useState('Mid-Level (3-8 years)');
  const [yearsExp, setYearsExp] = useState(6);
  const [gccExp, setGccExp] = useState(2);
  const [skillsPremium, setSkillsPremium] = useState(10);

  const currentCountryData = GCC_SALARY_DATA[country];
  const availableCities = currentCountryData?.cities || ['Main City'];

  const result = useMemo(() => {
    return calculateBenchmark(
      country,
      role,
      seniority,
      yearsExp,
      gccExp,
      skillsPremium / 100
    );
  }, [country, role, seniority, yearsExp, gccExp, skillsPremium]);

  const currencyInfo = GCC_CURRENCIES[country] || GCC_CURRENCIES['UAE'];
  const allowances = getAllowancesBreakdown(result.adjustedSalary.median);

  const pieData = [
    { name: 'Base Salary', value: result.adjustedSalary.median, fill: '#2563eb' },
    { name: 'Allowances', value: result.monthlyAllowances, fill: '#10b981' },
    { name: 'Estimated Bonus', value: result.estimatedBonusMonthly, fill: '#8b5cf6' },
  ];

  const isCustomRole = !ALL_ROLES.includes(role as any);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* === INPUT PANEL === */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Build Your Salary Benchmark</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => {
                const newCountry = e.target.value;
                setCountry(newCountry);
                setCity(GCC_SALARY_DATA[newCountry].cities[0]);
              }}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-blue-500"
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
              {availableCities.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Searchable Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Title / Role</label>
            <input
              list="role-list"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="Type to search roles..."
            />
            <datalist id="role-list">
              {ALL_ROLES.map((r) => (
                <option key={r} value={r} />
              ))}
              <option value="Other / Custom Role" />
            </datalist>
            <p className="text-xs text-gray-500 mt-1.5">
              120+ roles available • Start typing to search
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Seniority Level</label>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {seniorityLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Years of Experience: <span className="font-semibold">{yearsExp}</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={yearsExp}
              onChange={(e) => setYearsExp(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Years in GCC: <span className="font-semibold">{gccExp}</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={gccExp}
              onChange={(e) => setGccExp(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Skills Premium: <span className="font-semibold">+{skillsPremium}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={skillsPremium}
              onChange={(e) => setSkillsPremium(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <p className="text-xs text-gray-500 mt-1">AI/ML, Arabic, PMP, ERP, etc.</p>
          </div>
        </div>
      </div>

      {/* === RESULTS PANEL === */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10">
          <p className="uppercase text-xs tracking-widest text-gray-500 mb-3">2025–2026 Market Benchmark</p>
          <h4 className="text-3xl font-bold mb-1">{role}</h4>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{city}, {country}</p>

          <div className="mb-8">
            <div className="text-6xl font-bold text-emerald-600">
              {result.adjustedSalary.median.toLocaleString()}
              <span className="text-3xl font-normal text-gray-400 ml-2">{currencyInfo.code}</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Median Monthly Base Salary</p>
            <p className="text-2xl font-medium mt-1 text-emerald-700">
              ≈ ${result.usdEquivalent.monthlyMedian.toLocaleString()} USD
            </p>
          </div>

          {/* Salary Range Bar */}
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-500"
              style={{ left: '22%', width: '53%' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold text-xl">{result.adjustedSalary.low.toLocaleString()}</div>
              <div className="text-xs text-gray-500">25th Percentile</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-emerald-600">{result.adjustedSalary.median.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Median</div>
            </div>
            <div>
              <div className="font-semibold text-xl">{result.adjustedSalary.high.toLocaleString()}</div>
              <div className="text-xs text-gray-500">75th Percentile</div>
            </div>
          </div>
        </div>

        {/* Compensation Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold text-xl mb-6">Monthly Compensation Breakdown</h5>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
          <h5 className="font-semibold mb-4">Key Insights</h5>
          <ul className="space-y-3 text-sm">
            <li>• Housing allowance typically represents 25-35% of total package in {city}</li>
            <li>• {country === 'Saudi Arabia' ? 'Vision 2030' : 'Strong market demand'} continues to drive competitive pay in this sector</li>
            <li>• End-of-Service Gratuity adds significant long-term value (est. {Math.round(result.gratuityEstimate / 12).toLocaleString()} {currencyInfo.code}/month equivalent)</li>
            {skillsPremium > 15 && <li>• Your selected skills premium significantly boosts the expected offer</li>}
            {isCustomRole && <li>• Custom role using general market average — actual range may vary</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
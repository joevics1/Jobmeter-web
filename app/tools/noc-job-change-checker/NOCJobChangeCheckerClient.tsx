// app/tools/noc-job-change-checker/NOCJobChangeCheckerClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { calculateEligibility, type UserInputs } from '@/lib/gcc-rules';

export default function NOCJobChangeCheckerClient() {
  const [country, setCountry] = useState<string>('');
  const [inputs, setInputs] = useState<UserInputs>({
    contractType: 'fixed',
    monthsServed: 12,
    status: 'active',
    sector: 'professional',
    newSectorSame: true,
  });

  const result = useMemo(() => {
    if (!country) return null;
    return calculateEligibility(inputs, country);
  }, [country, inputs]);

  const countries = [
    { code: 'uae', name: '🇦🇪 United Arab Emirates' },
    { code: 'ksa', name: '🇸🇦 Saudi Arabia' },
    { code: 'qatar', name: '🇶🇦 Qatar' },
    { code: 'kuwait', name: '🇰🇼 Kuwait' },
    { code: 'bahrain', name: '🇧🇭 Bahrain' },
    { code: 'oman', name: '🇴🇲 Oman' },
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Your Current Situation</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Select Country</label>
            <div className="grid grid-cols-2 gap-3">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className={`p-4 rounded-2xl text-left border transition-all text-sm ${
                    country === c.code
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 font-medium'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {country && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Contract Type</label>
                <select
                  value={inputs.contractType}
                  onChange={(e) => setInputs({ ...inputs, contractType: e.target.value })}
                  className="w-full p-4 border rounded-2xl dark:bg-gray-800"
                >
                  <option value="fixed">Fixed-term</option>
                  <option value="unlimited">Unlimited</option>
                  <option value="probation">Probation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Months Served: <span className="font-semibold">{inputs.monthsServed}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={inputs.monthsServed}
                  onChange={(e) => setInputs({ ...inputs, monthsServed: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Status</label>
                <select
                  value={inputs.status}
                  onChange={(e) => setInputs({ ...inputs, status: e.target.value })}
                  className="w-full p-4 border rounded-2xl dark:bg-gray-800"
                >
                  <option value="active">Contract Active</option>
                  <option value="notice">In Notice Period</option>
                  <option value="expired">Contract Expired</option>
                  <option value="unpaid_wages">Unpaid Wages / Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sector</label>
                <select
                  value={inputs.sector}
                  onChange={(e) => setInputs({ ...inputs, sector: e.target.value })}
                  className="w-full p-4 border rounded-2xl dark:bg-gray-800"
                >
                  <option value="professional">Professional / Technical</option>
                  <option value="domestic">Domestic Worker</option>
                  <option value="security">Security / Driver</option>
                  <option value="project">Project / Construction</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-7">
        {!country ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-16 text-center">
            <p className="text-xl text-gray-500">Select a country to get your eligibility result</p>
          </div>
        ) : result ? (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10">
              <div className={`text-5xl font-bold mb-6 ${result.color === 'emerald' ? 'text-emerald-600' : result.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
                {result.verdict}
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
                {result.summary}
              </p>

              <div>
                <h4 className="font-semibold mb-5">Recommended Next Steps</h4>
                <div className="space-y-6">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 font-medium flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.links.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
                <h4 className="font-semibold mb-4">Official Resources</h4>
                {result.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block py-3 text-blue-600 hover:underline">
                    → {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
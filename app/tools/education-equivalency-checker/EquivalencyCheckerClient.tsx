'use client';

import { useState } from 'react';
import { popularCountries, calculateLikelihood, type DegreeLevel } from '@/lib/equivalency-data';

const degreeLevels: DegreeLevel[] = ['High School / Grade 12', 'Diploma', 'Bachelor’s', 'Master’s', 'PhD / Doctorate', 'Other'];
const studyModes = ['Full-time', 'Online', 'Distance', 'Blended'];
const targets = ['UAE', 'Saudi Arabia', 'Both'] as const;

export default function EquivalencyCheckerClient() {
  const [target, setTarget] = useState<'UAE' | 'Saudi Arabia' | 'Both'>('UAE');
  const [country, setCountry] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('Bachelor’s');
  const [studyMode, setStudyMode] = useState('Full-time');
  const [accredited, setAccredited] = useState('Yes');
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    if (!country) {
      alert('Please select a country of study');
      return;
    }

    // Convert 'Saudi Arabia' to 'Saudi' to match the expected parameter type of calculateLikelihood
    const apiTarget = target === 'Saudi Arabia' ? 'Saudi' : target;
    const calc = calculateLikelihood(country, degreeLevel, studyMode, accredited, apiTarget);
    
    setResult({ ...calc, country, target, degreeLevel, studyMode });
  };

  const reset = () => setResult(null);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Real-Time Equivalency Self-Assessment</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Based on latest MoHESR / Saudi MOE rules (2026). This is guidance only.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8 bg-white p-8 rounded-3xl border">
          <div>
            <label className="block text-sm font-medium mb-3">Target Country / Region</label>
            <div className="flex flex-wrap gap-3">
              {targets.map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                    target === t 
                      ? 'bg-teal-600 text-white shadow' 
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country of Study / Institution</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-4 border rounded-2xl text-lg focus:border-teal-500 focus:ring-0"
            >
              <option value="">Select Country</option>
              {popularCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Degree Level</label>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
              className="w-full p-4 border rounded-2xl text-lg focus:border-teal-500"
            >
              {degreeLevels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Study Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {studyModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setStudyMode(mode)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    studyMode === mode ? 'border-teal-600 bg-teal-50' : 'hover:border-gray-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Was the institution officially accredited / recognized in the home country at time of study?</label>
            <div className="flex gap-3">
              {['Yes', 'No', 'Unsure'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAccredited(opt)}
                  className={`flex-1 py-4 rounded-2xl border font-medium ${
                    accredited === opt ? 'bg-teal-600 text-white' : ''
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCheck}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:brightness-110 transition text-white py-6 rounded-3xl text-xl font-semibold"
          >
            Calculate Likelihood →
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-3xl p-8 sticky top-8">
            {!result ? (
              <div className="h-96 flex items-center justify-center text-center text-gray-500">
                Select options and click Calculate
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="text-sm text-teal-600 font-medium">
                    {result.target} • {result.country} • {result.degreeLevel}
                  </div>
                  <div className={`mt-3 inline-block px-8 py-3 rounded-3xl text-3xl font-bold ${
                    result.likelihood === 'High' ? 'bg-green-100 text-green-700' :
                    result.likelihood === 'Good' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {result.likelihood} Chance ({result.score}%)
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Important Notes</h4>
                  <ul className="space-y-3 text-[15px]">
                    {result.notes.map((note: string, i: number) => (
                      <li key={i} className="flex gap-2 leading-relaxed">• {note}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Recommended Checklist</h4>
                  <ul className="space-y-3">
                    {result.checklist.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 accent-teal-600" defaultChecked={i < 2} />
                        <span className="text-[15px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-teal-200">
                  <p className="font-medium text-teal-800">Next Steps:</p>
                  <p className="text-teal-700 mt-2 leading-relaxed">{result.nextSteps}</p>
                </div>

                <button
                  onClick={reset}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Start New Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
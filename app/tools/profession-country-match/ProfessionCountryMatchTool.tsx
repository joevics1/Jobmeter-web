// app/tools/profession-country-match/ProfessionCountryMatchTool.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  GCC_COUNTRIES, 
  ALL_ROLES, 
  ALL_SKILLS, 
  getRoleData 
} from '@/lib/gccMatchData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const experienceLevels = [
  'Entry Level (0-3 years)',
  'Mid-Level (3-8 years)',
  'Senior (8-15 years)',
  'Executive / Director'
];

export default function ProfessionCountryMatchTool() {
  const [selectedRole, setSelectedRole] = useState(ALL_ROLES[0].role);
  const [experience, setExperience] = useState('Mid-Level (3-8 years)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['AI/ML', 'Python']);
  const [preference, setPreference] = useState<'salary' | 'growth' | 'lifestyle'>('growth');

  const currentRole = useMemo(() => getRoleData(selectedRole), [selectedRole]);

  const results = useMemo(() => {
    return GCC_COUNTRIES.map((country) => {
      const baseDemand = currentRole.demand[country.code as keyof typeof currentRole.demand] || 7;

      let score = baseDemand * 0.38;

      // Experience boost
      if (experience.includes('Senior') || experience.includes('Executive')) {
        score += 1.4;
      } else if (experience.includes('Mid')) {
        score += 0.6;
      }

      // Skills synergy
      const skillBonus = selectedSkills.filter(skill =>
        currentRole.keySkills.some(k => 
          k.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(k.toLowerCase())
        )
      ).length * 0.85;
      score += skillBonus;

      // Preference weighting
      if (preference === 'salary') score += (currentRole.salaries.mid / 1400) * 0.35;
      if (preference === 'growth') score += country.growthPotential * 0.42;
      if (preference === 'lifestyle') score += country.lifestyle * 0.45;

      const finalScore = Math.min(9.9, Math.max(5.5, Math.round(score * 10) / 10));

      return {
        ...country,
        matchScore: finalScore,
        demand: baseDemand,
        monthlySalary: Math.round(currentRole.salaries.mid),
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [currentRole, experience, selectedSkills, preference]);

  const topMatch = results[0];

  const radarData = results.slice(0, 3).map(r => ({
    country: r.name.split(' ')[0],
    Demand: r.demand,
    Salary: Math.round(r.monthlySalary / 1000),
    Growth: Math.round(r.growthPotential * 10) / 10,
    Lifestyle: Math.round(r.lifestyle * 10) / 10,
  }));

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Your Profile</h3>

        <div className="space-y-8">
          {/* Profession Dropdown - 200+ Roles */}
          <div>
            <label className="block text-sm font-medium mb-2">Profession / Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {ALL_ROLES.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.role} • {r.sector}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1.5">Over 200 roles available</p>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Key Skills - Expanded Multi-select Chips */}
          <div>
            <label className="block text-sm font-medium mb-3">Key Skills / Specializations</label>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
              {ALL_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSkills(prev => prev.filter(s => s !== skill));
                      } else {
                        setSelectedSkills(prev => [...prev, skill]);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all border ${
                      isSelected 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">Select all that apply</p>
          </div>

          {/* Preference */}
          <div>
            <label className="block text-sm font-medium mb-3">What matters most to you?</label>
            <div className="grid grid-cols-3 gap-3">
              {(['salary', 'growth', 'lifestyle'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreference(p)}
                  className={`p-4 rounded-2xl text-center capitalize font-medium transition-all ${
                    preference === p 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        {/* Top Recommendation */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl p-10 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="uppercase tracking-[3px] text-emerald-100 text-sm font-medium">YOUR BEST MATCH</p>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">{topMatch.name}</h2>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold">{topMatch.matchScore}</div>
              <div className="text-sm -mt-1 opacity-75">/10</div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-8 text-xl">
            <div>
              <span className="font-mono text-3xl">≈ ${topMatch.monthlySalary.toLocaleString()}</span>
              <span className="block text-sm opacity-75">Monthly (Tax-Free)</span>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div>Demand: <span className="font-semibold">{topMatch.demand}/10</span></div>
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
          <h5 className="p-8 pb-5 font-semibold text-xl border-b dark:border-gray-800">Full GCC Ranking</h5>
          <div className="divide-y dark:divide-gray-800">
            {results.map((country, idx) => (
              <div key={idx} className="p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <div className="font-semibold text-lg">{country.name}</div>
                    <div className="text-sm text-gray-500">≈ ${country.monthlySalary.toLocaleString()} / month</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">{country.matchScore}</div>
                  <div className="text-xs text-gray-500 tracking-widest">MATCH SCORE</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold mb-6">Top 3 Comparison Radar</h5>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="country" />
              <PolarRadiusAxis angle={90} domain={[0, 10]} />
              <Radar name="Demand" dataKey="Demand" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              <Radar name="Salary" dataKey="Salary" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Growth" dataKey="Growth" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
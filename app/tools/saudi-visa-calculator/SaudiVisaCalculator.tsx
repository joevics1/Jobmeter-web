'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  SECTOR_THRESHOLDS, 
  calculateSalaryPoints, 
  getTierRecommendation, 
  getOccupationGroupLabel,
  type Sector 
} from '@/lib/saudiVisaUtils';

const sscoGroups = [
  { value: '1-3', label: 'Groups 1-3 (Managers, Specialists, Technicians)' },
  { value: '4-8', label: 'Groups 4-8 (Skilled Occupations)' },
  { value: '9', label: 'Group 9 (Elementary Occupations)' },
];

const educationOptions = [
  { value: 0, label: 'No formal / High School', points: 0 },
  { value: 1, label: 'Diploma / Vocational', points: 15 },
  { value: 2, label: "Bachelor’s Degree", points: 35 },
  { value: 3, label: 'Master’s / Doctorate / Top University', points: 50 },
];

const sectors: Sector[] = [
  'IT & Technology', 'Engineering & Construction', 'Healthcare', 
  'Finance & Banking', 'Oil & Gas / Energy', 'Education', 
  'Marketing & Sales', 'Logistics & Transportation', 
  'Hospitality & Tourism', 'General'
];

export default function SaudiVisaCalculator() {
  const [age, setAge] = useState(32);
  const [sector, setSector] = useState<Sector>('IT & Technology');
  const [sscoGroup, setSscoGroup] = useState('1-3');
  const [monthlySalary, setMonthlySalary] = useState(18000);
  const [educationLevel, setEducationLevel] = useState(2);
  const [yearsExp, setYearsExp] = useState(6);
  const [svpPassed, setSvpPassed] = useState(true);
  const [topUniversity, setTopUniversity] = useState(false);

  const result = useMemo(() => {
    let eduPoints = educationOptions.find(e => e.value === educationLevel)?.points || 0;
    if (topUniversity && educationLevel >= 2) eduPoints += 10;

    const salaryPoints = calculateSalaryPoints(monthlySalary, sector);

    let expPoints = 5;
    if (yearsExp >= 10) expPoints = 35;
    else if (yearsExp >= 7) expPoints = 30;
    else if (yearsExp >= 4) expPoints = 25;
    else if (yearsExp >= 2) expPoints = 15;

    let agePoints = 0;
    if (age >= 25 && age <= 45) agePoints = 12;
    else if (age >= 46 && age <= 55) agePoints = 5;
    else if (age > 55) agePoints = -10;

    const skillsPoints = svpPassed ? 18 : 0;

    const totalPoints = Math.max(0, Math.min(135, 
      eduPoints + salaryPoints + expPoints + agePoints + skillsPoints
    ));

    const recommendation = getTierRecommendation(totalPoints, sscoGroup, monthlySalary, sector);

    return {
      totalPoints,
      tier: recommendation.tier,
      message: recommendation.message,
      breakdown: {
        education: eduPoints,
        salary: salaryPoints,
        experience: expPoints,
        age: Math.max(0, agePoints),
        skills: skillsPoints,
      }
    };
  }, [age, sector, sscoGroup, monthlySalary, educationLevel, yearsExp, svpPassed, topUniversity]);

  const pieData = [
    { name: 'Salary', value: result.breakdown.salary, fill: '#10b981' },
    { name: 'Education', value: result.breakdown.education, fill: '#3b82f6' },
    { name: 'Experience', value: result.breakdown.experience, fill: '#8b5cf6' },
    { name: 'Age & Skills', value: result.breakdown.age + result.breakdown.skills, fill: '#f59e0b' },
  ].filter(item => item.value > 0);

  // Calculate dynamic percentages
  const totalCategoryPoints = result.totalPoints || 1;
  const legendItems = [
    { 
      label: 'Salary', 
      color: '#10b981', 
      points: result.breakdown.salary,
      percent: Math.round((result.breakdown.salary / totalCategoryPoints) * 100),
      description: 'Higher salary significantly boosts your eligibility for High-Skilled tier'
    },
    { 
      label: 'Education', 
      color: '#3b82f6', 
      points: result.breakdown.education,
      percent: Math.round((result.breakdown.education / totalCategoryPoints) * 100),
      description: 'Higher qualifications (especially Bachelor’s and above) add strong points'
    },
    { 
      label: 'Experience', 
      color: '#8b5cf6', 
      points: result.breakdown.experience,
      percent: Math.round((result.breakdown.experience / totalCategoryPoints) * 100),
      description: 'Relevant professional experience is heavily weighted'
    },
    { 
      label: 'Age & Skills', 
      color: '#f59e0b', 
      points: result.breakdown.age + result.breakdown.skills,
      percent: Math.round(((result.breakdown.age + result.breakdown.skills) / totalCategoryPoints) * 100),
      description: 'Prime working age and verified skills give you an advantage'
    },
  ].filter(item => item.points > 0);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel - unchanged */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Your Profile</h3>

        <div className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-2">Sector</label>
            <select 
              value={sector} 
              onChange={(e) => setSector(e.target.value as Sector)} 
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Occupation Group</label>
            <select 
              value={sscoGroup} 
              onChange={(e) => setSscoGroup(e.target.value)} 
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              {sscoGroups.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Salary (SAR): <span className="font-semibold text-emerald-600">{monthlySalary.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="3000"
              max="70000"
              step="500"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Education Level</label>
            <select 
              value={educationLevel} 
              onChange={(e) => setEducationLevel(Number(e.target.value))} 
              className="w-full p-4 border rounded-2xl dark:bg-gray-800"
            >
              {educationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={topUniversity} 
              onChange={(e) => setTopUniversity(e.target.checked)} 
            />
            Degree from Top University (QS Top 200)
          </label>

          <div>
            <label className="block text-sm font-medium mb-1">
              Years of Experience: <span className="font-semibold">{yearsExp}</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={yearsExp} 
              onChange={(e) => setYearsExp(Number(e.target.value))} 
              className="w-full accent-emerald-600" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Age: <span className="font-semibold">{age}</span>
            </label>
            <input 
              type="range" 
              min="20" 
              max="60" 
              value={age} 
              onChange={(e) => setAge(Number(e.target.value))} 
              className="w-full accent-emerald-600" 
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={svpPassed} 
              onChange={(e) => setSvpPassed(e.target.checked)} 
            />
            Passed Skills Verification Test (SVT)
          </label>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 text-center">
          <p className="uppercase text-xs tracking-widest text-gray-500 mb-1">ESTIMATED POINTS</p>
          <div className="text-7xl font-bold text-emerald-600 my-3">{result.totalPoints}</div>
          
          <div className={`text-3xl font-bold px-8 py-3 rounded-2xl inline-block mb-6
            ${result.tier === 'High-Skilled' ? 'bg-emerald-100 text-emerald-700' : 
              result.tier === 'Skilled' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {result.tier} Tier
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300">{result.message}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h5 className="font-semibold text-xl mb-6">Points Breakdown</h5>
          
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={125}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Enhanced Dynamic Legend */}
          <div className="mt-8 space-y-4">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div 
                  className="w-5 h-5 rounded mt-0.5 flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {item.points} pts ({item.percent}%)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { Users, Briefcase, Home, TrendingUp, ShieldCheck, Heart, Award, Plane } from 'lucide-react';
import { GCC_SALARY_DATA, getSalaryRange, GCC_COUNTRIES } from '@/lib/gccData';

const metrics = [
  { key: 'salary', label: 'Monthly Salary (Median)', icon: Briefcase },
  { key: 'colSingle', label: 'Cost of Living - Single', icon: Home },
  { key: 'colFamily', label: 'Cost of Living - Family of 4', icon: Users },
  { key: 'savings', label: 'Est. Monthly Savings', icon: TrendingUp },
  { key: 'visaEase', label: 'Visa / Expat Ease (1-10)', icon: ShieldCheck },
  { key: 'familySponsor', label: 'Family Sponsorship Threshold', icon: Heart },
  { key: 'gratuity', label: 'End-of-Service Gratuity', icon: Award },
  { key: 'expatScore', label: 'Overall Expat Score', icon: Plane },
];

const commonRoles = [
  "Software Engineer", "Senior Software Engineer", "Full Stack Developer", "Backend Developer",
  "Frontend Developer", "Mobile App Developer", "DevOps Engineer", "Cloud Engineer", "Data Scientist",
  "Machine Learning Engineer", "AI Engineer", "Cybersecurity Engineer", "IT Project Manager",
  "Product Manager", "Technical Architect", "Solutions Architect", "QA Engineer", "Business Analyst",
  "Financial Analyst", "Senior Financial Analyst", "Finance Manager", "Financial Controller", "CFO",
  "Accountant", "Senior Accountant", "Project Manager", "Construction Project Manager", 
  "Operations Manager", "General Manager", "Marketing Manager", "Digital Marketing Manager",
  "Sales Manager", "Key Account Manager", "HR Manager", "Talent Acquisition Manager",
  "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "HSE Manager", 
  "Supply Chain Manager", "Procurement Manager", "Registered Nurse", "Doctor", 
  "Legal Counsel", "Compliance Manager", "Teacher", "Other"
];

const nationalities = ["Indian", "Nigerian", "Filipino", "Pakistani", "Egyptian", "Bangladeshi", "Other"];

export default function GCCComparisonTool() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['UAE', 'KSA', 'Qatar']);
  const [profile, setProfile] = useState({
    role: "Software Engineer",
    seniority: "Mid-Level (3-8 years)",
    familyStatus: "Single",
    nationality: "Indian",
  });

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      if (selectedCountries.length > 2) {
        setSelectedCountries(prev => prev.filter(c => c !== code));
      }
    } else {
      setSelectedCountries(prev => [...prev, code].slice(0, 6));
    }
  };

  const displayedData = useMemo(() => {
    return selectedCountries.map(code => {
      const country = GCC_SALARY_DATA[code];
      if (!country) return null;

      const salaryBand = getSalaryRange(code, profile.role, profile.seniority);
      const monthlySalary = salaryBand.median;

      const familyMultiplier = profile.familyStatus === "Family" ? 2.1 : 
                               profile.familyStatus === "Married" ? 1.6 : 1.0;

      const adjustedCol = Math.round(country.colSingle * familyMultiplier);
      const estSavings = Math.max(0, Math.round(monthlySalary * 0.48 - adjustedCol * 0.65));

      return {
        code,
        ...country,
        metrics: {
          salary: { value: monthlySalary.toLocaleString(), note: country.currency },
          colSingle: { value: adjustedCol.toLocaleString(), note: 'AED equiv.' },
          colFamily: { value: country.colFamily.toLocaleString(), note: 'AED equiv.' },
          savings: { value: estSavings.toLocaleString(), note: country.currency },
          visaEase: { 
            value: country.visaEase, 
            note: country.visaEase <= 4 ? 'Easy' : country.visaEase <= 6 ? 'Moderate' : 'Challenging' 
          },
          familySponsor: { value: country.familySponsorMin, note: '' },
          gratuity: { value: country.gratuity.split('•')[0].trim().slice(0, 70) + (country.gratuity.length > 70 ? '...' : ''), note: '' },
          expatScore: { value: country.expatScore, note: '/100' },
        }
      };
    }).filter(Boolean) as any[];
  }, [selectedCountries, profile]);

  return (
    <div className="space-y-10">
      {/* Tool Explanation */}
      <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-4">GCC Country Comparison Tool 2026</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Compare salaries, cost of living, savings potential, visa difficulty, family sponsorship, 
          and gratuity across the 6 Gulf countries. Everything updates live as you change your profile.
        </p>
      </div>

      {/* Profile Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Users className="w-7 h-7 text-emerald-600" /> Personalize Your Profile
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <label className="block font-medium mb-2">Job Role</label>
            <select
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full p-3.5 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              {commonRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Seniority Level</label>
            <select
              value={profile.seniority}
              onChange={(e) => setProfile({ ...profile, seniority: e.target.value })}
              className="w-full p-3.5 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Junior (0-3 years)">Junior (0-3 years)</option>
              <option value="Mid-Level (3-8 years)">Mid-Level (3-8 years)</option>
              <option value="Senior (8+ years)">Senior (8+ years)</option>
              <option value="Lead / Manager">Lead / Manager</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Family Status</label>
            <select
              value={profile.familyStatus}
              onChange={(e) => setProfile({ ...profile, familyStatus: e.target.value })}
              className="w-full p-3.5 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Single">Single</option>
              <option value="Married">Married (no kids)</option>
              <option value="Family">Family with kids</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Nationality</label>
            <select
              value={profile.nationality}
              onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
              className="w-full p-3.5 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              {nationalities.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Country Selector */}
      <div>
        <p className="text-sm text-gray-500 mb-3">Select Countries to Compare (2–6)</p>
        <div className="flex flex-wrap gap-3">
          {GCC_COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => toggleCountry(country.code)}
              className={`px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all border ${
                selectedCountries.includes(country.code)
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {country.flag} {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-950">
                <th className="sticky left-0 bg-white dark:bg-gray-900 p-5 text-left w-72 z-20">Metric</th>
                {displayedData.map((c) => (
                  <th key={c.code} className="p-5 text-center border-l">
                    <div className="text-4xl mb-2">{c.flag}</div>
                    <div className="font-semibold">{c.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => (
                <tr key={metric.key} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-950' : ''}>
                  <td className="sticky left-0 bg-white dark:bg-gray-900 p-5 font-medium flex items-center gap-3 border-r">
                    <metric.icon className="w-4 h-4 text-emerald-600" />
                    {metric.label}
                  </td>
                  {displayedData.map((country) => {
                    const m = country.metrics[metric.key as keyof typeof country.metrics];
                    return (
                      <td key={country.code} className="p-5 text-center border-l">
                        <div className="font-semibold text-base">{m.value}</div>
                        {m.note && <div className="text-xs text-gray-500 mt-1">{m.note}</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        Data is based on 2025–2026 market research. Family status dynamically affects cost of living and savings.
      </p>
    </div>
  );
}
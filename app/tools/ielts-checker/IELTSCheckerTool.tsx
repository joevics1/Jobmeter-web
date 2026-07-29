'use client';

import React, { useState, useMemo } from 'react';
import { ieltsData } from '@/lib/ieltsData';
import { Search } from 'lucide-react';

const countries = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'Qatar', name: 'Qatar', flag: '🇶🇦' },
  { code: 'Oman', name: 'Oman', flag: '🇴🇲' },
  { code: 'Kuwait', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'Bahrain', name: 'Bahrain', flag: '🇧🇭' },
];

const experienceLevels = ['Junior', 'Mid-Level', 'Senior', 'Manager'];

// Popular job titles for dropdown (you can expand this)
const commonJobTitles = [
  "Registered Nurse",
  "Specialist Nurse (ICU, ER, etc.)",
  "Physician (General Practitioner)",
  "Specialist Physician",
  "Pharmacist",
  "Dentist",
  "Physiotherapist",
  "Medical Laboratory Technologist",
  "Radiographer",
  "Civil Engineer",
  "Mechanical Engineer",
  "Petroleum Engineer",
  "Drilling Engineer (Oil & Gas)",
  "Software Engineer / Developer",
  "Cybersecurity Analyst",
  "IT Project Manager",
  "Secondary School Teacher (English)",
  "Secondary School Teacher (Science/Maths)",
  "Chartered Accountant",
  "Hotel Operations Manager",
  "HR Manager",
  "Project Manager (Construction)",
  "Marketing Manager",
];

export default function IELTSCheckerTool() {
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [country, setCountry] = useState('UAE');
  const [expLevel, setExpLevel] = useState('Mid-Level');

  const jobTitle = selectedJobTitle === 'Other' ? customJobTitle : selectedJobTitle;

  const results = useMemo(() => {
    if (!jobTitle.trim()) return [];

    return ieltsData.filter(item => 
      item.country === country && 
      item.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
    );
  }, [jobTitle, country]);

  const selectedResult = results[0] || null;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Check Your Requirements</h3>

        <div className="space-y-6">
          {/* Job Title Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Title / Role</label>
            <select
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a job title...</option>
              {commonJobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
              <option value="Other">Other / Custom Role</option>
            </select>

            {/* Custom Input - Shown only when "Other" is selected */}
            {selectedJobTitle === 'Other' && (
              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={customJobTitle}
                    onChange={(e) => setCustomJobTitle(e.target.value)}
                    placeholder="Type your exact job title..."
                    className="w-full pl-12 p-4 border rounded-2xl dark:bg-gray-800 text-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <div className="grid grid-cols-3 gap-3">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    country === c.code 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-sm font-medium">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <select
              value={expLevel}
              onChange={(e) => setExpLevel(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        {jobTitle.length > 1 && results.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center">
            <p className="text-xl text-gray-500">No exact match found for this role.</p>
            <p className="text-sm mt-2">Requirements may be employer-dependent. Try searching similar roles.</p>
          </div>
        )}

        {selectedResult && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🇦🇪🇸🇦🇶🇦</span>
              <div>
                <h4 className="text-3xl font-bold">{selectedResult.jobTitle}</h4>
                <p className="text-xl text-gray-600 dark:text-gray-400">{selectedResult.country}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-5xl font-bold ${
                !selectedResult.minOverall || selectedResult.minOverall === "Not Required" 
                  ? 'text-emerald-600' 
                  : 'text-blue-600'
              }`}>
                {!selectedResult.minOverall || selectedResult.minOverall === "Not Required" 
                  ? "Not Required" 
                  : `${selectedResult.minOverall} IELTS`}
              </div>
              <p className="text-sm uppercase tracking-widest text-gray-500 mt-2">MINIMUM OVERALL SCORE</p>
            </div>

            {selectedResult.minBand && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-8">
                <p className="font-medium">Band Requirements:</p>
                <p className="text-lg">{selectedResult.minBand}</p>
              </div>
            )}

            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                <p className="font-semibold text-gray-500">Regulatory Body / Visa Type</p>
                <p>{selectedResult.visaTypeOrRegulatoryBody}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Notes</p>
                <p>{selectedResult.notes}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Last Updated</p>
                <p>{selectedResult.lastUpdated}</p>
              </div>

              {selectedResult.officialSource && (
                <a 
                  href={selectedResult.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  View Official Source →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Popular Searches (when nothing selected) */}
        {!jobTitle && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8">
            <h5 className="font-semibold mb-4">Popular Roles</h5>
            <div className="flex flex-wrap gap-3">
              {commonJobTitles.slice(0, 8).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedJobTitle(role)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
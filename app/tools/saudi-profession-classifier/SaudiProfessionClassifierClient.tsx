'use client';

import React, { useState, useMemo } from 'react';
import { classifyOccupation, type ClassificationResult } from '@/lib/sscoData';

const commonJobTitles = [
  "Software Engineer", "Senior Software Engineer", "Full Stack Developer", 
  "Backend Developer", "Frontend Developer", "Mobile App Developer", 
  "DevOps Engineer", "Cloud Engineer", "Data Scientist", "Data Analyst",
  "Machine Learning Engineer", "AI Engineer", "Cybersecurity Engineer",
  "IT Project Manager", "Project Manager", "Product Manager", 
  "Technical Architect", "Solutions Architect", "Civil Engineer",
  "Mechanical Engineer", "Electrical Engineer", "Construction Project Manager",
  "Finance Manager", "Financial Analyst", "Financial Controller", "CFO",
  "Accountant", "Senior Accountant", "Auditor", "HR Manager",
  "Talent Acquisition Manager", "Operations Manager", "Marketing Manager",
  "Sales Manager", "Teacher", "Doctor", "Nurse", "Electrician",
  "Administrative Assistant", "Driver", "Cleaner"
].sort();

const educationOptions = ['High School', 'Diploma', 'Bachelor Degree', "Master's", 'PhD / Doctorate'];
const salaryBands = ['< 5,000 SAR', '5,000 - 8,000 SAR', '8,000 - 15,000 SAR', '15,000 - 30,000 SAR', '> 30,000 SAR'];

export function SaudiProfessionClassifierClient() {
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [education, setEducation] = useState('Bachelor Degree');
  const [yearsExp, setYearsExp] = useState(6);
  const [salaryBand, setSalaryBand] = useState('15,000 - 30,000 SAR');
  const [age, setAge] = useState(34);

  const result: ClassificationResult = useMemo(() => {
    return classifyOccupation(jobTitle, education, yearsExp, salaryBand, age);
  }, [jobTitle, education, yearsExp, salaryBand, age]);

  return (
    <div className="p-8 lg:p-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Check Your Job Classification</h2>
        <p className="text-gray-600 dark:text-gray-400">Personalized assessment based on Saudi SSCO (2025)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Job Title Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 text-lg"
          >
            {commonJobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Highest Education</label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            {educationOptions.map((edu) => (
              <option key={edu} value={edu}>{edu}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Monthly Salary (SAR)</label>
          <select
            value={salaryBand}
            onChange={(e) => setSalaryBand(e.target.value)}
            className="w-full p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            {salaryBands.map((band) => (
              <option key={band} value={band}>{band}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Years of Experience: <span className="font-semibold">{yearsExp} years</span>
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
          <label className="block text-sm font-medium mb-2">
            Age: <span className="font-semibold">{age} years</span>
          </label>
          <input
            type="range"
            min="22"
            max="65"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-3xl p-10">
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center gap-4 px-10 py-4 rounded-2xl text-3xl font-bold ${
            result.category === 'High-Skilled' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900' :
            result.category === 'Skilled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900' :
            'bg-orange-100 text-orange-700 dark:bg-orange-900'
          }`}>
            {result.category}
            <span className="text-base font-normal">({result.confidence}% confidence)</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-2xl font-semibold">{result.occupation}</p>
          <p className="text-gray-500">SSCO Group {result.group} • Code {result.code}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Education Impact', value: result.educationImpact },
            { label: 'Salary Impact', value: result.salaryImpact },
            { label: 'Experience Impact', value: result.expImpact },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl text-center shadow-sm">
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="font-semibold text-lg mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-lg">Key Implications &amp; Next Steps</h4>
          <ul className="space-y-3 text-[15px]">
            {result.implications.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-emerald-500 mt-1">→</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a 
            href="https://qiwa.sa" 
            target="_blank" 
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition"
          >
            Verify on Qiwa →
          </a>
          <a 
            href="https://hrsd.gov.sa" 
            target="_blank" 
            className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Official HRSD Guidelines
          </a>
        </div>
      </div>
    </div>
  );
}
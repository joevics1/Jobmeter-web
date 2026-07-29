// app/tools/uae-job-seeker-visa/UAEJobSeekerVisaTool.tsx
'use client';

import React, { useState } from 'react';

interface FormData {
  nationality: string;
  age: number;
  passportValidityMonths: number;
  highestDegree: string;
  graduationYear: number;
  university: string;
  yearsOfExperience: number;
  currentJobTitle: string;
  industry: string;
  mohreSkillLevel: string;
  estimatedBankBalance: number;
  hasHealthInsurance: boolean;
  documentsAttested: boolean;
}

const degreeOptions = ['Bachelor', 'Master', 'PhD', 'Diploma / Equivalent'];
const industries = ['IT & Software', 'Engineering', 'Finance', 'Healthcare', 'Marketing', 'Construction', 'Education', 'Oil & Gas', 'Other'];

const mohreLevels = [
  { value: 'Level 1', label: 'Level 1 - Legislators, Managers, Executives', desc: 'CEOs, Directors, Senior Managers' },
  { value: 'Level 2', label: 'Level 2 - Professionals', desc: 'Engineers, Doctors, IT Specialists, Teachers, Accountants, etc.' },
  { value: 'Level 3', label: 'Level 3 - Technicians', desc: 'Skilled technicians in scientific/technical fields' },
  { value: 'Level 4', label: 'Level 4 - Clerical / Sales', desc: 'Usually not eligible' },
];

export default function UAEJobSeekerVisaTool() {
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<FormData>({
    nationality: 'India',
    age: 28,
    passportValidityMonths: 12,
    highestDegree: 'Bachelor',
    graduationYear: 2023,
    university: '',
    yearsOfExperience: 5,
    currentJobTitle: 'Software Engineer',
    industry: 'IT & Software',
    mohreSkillLevel: 'Level 2',
    estimatedBankBalance: 15000,
    hasHealthInsurance: true,
    documentsAttested: false,
  });

  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateForm = (key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const calculateEligibility = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      let score = 0;
      const reasons: string[] = [];
      const warnings: string[] = [];

      // Age
      if (form.age >= 21) score += 10;
      else if (form.age >= 18) score += 5;
      else warnings.push("You must be at least 18 years old");

      // Passport
      if (form.passportValidityMonths >= 6) score += 10;
      else warnings.push("Passport must be valid for at least 6 months");

      // Education
      const yearsSinceGrad = currentYear - form.graduationYear;
      if (['Bachelor', 'Master', 'PhD'].includes(form.highestDegree)) {
        score += 25;
        if (yearsSinceGrad <= 2) {
          score += 20;
          reasons.push("✅ Qualifies under Recent Graduate Path");
        } else if (form.yearsOfExperience >= 2) {
          score += 15;
          reasons.push("✅ Qualifies under Skilled Professional Path");
        } else {
          warnings.push("Graduated more than 2 years ago and low experience may weaken application");
        }
      } else {
        warnings.push("Diploma holders have very limited chances");
      }

      // Experience
      if (form.yearsOfExperience >= 5) score += 20;
      else if (form.yearsOfExperience >= 3) score += 15;
      else if (form.yearsOfExperience >= 1) score += 8;

      // MOHRE Skill Level
      if (form.mohreSkillLevel === 'Level 1') score += 20;
      else if (form.mohreSkillLevel === 'Level 2') score += 18;
      else if (form.mohreSkillLevel === 'Level 3') score += 12;
      else warnings.push("MOHRE Level 4 is generally not eligible");

      // Financial
      if (form.estimatedBankBalance >= 20000) score += 12;
      else if (form.estimatedBankBalance >= 12000) score += 8;
      else warnings.push("Higher bank balance / proof of funds improves chances");

      // Other
      if (form.hasHealthInsurance) score += 5;
      if (form.documentsAttested) score += 8;

      // Final Assessment
      let status: string;
      let color: string;

      if (score >= 85) {
        status = "Highly Eligible";
        color = "emerald";
      } else if (score >= 70) {
        status = "Likely Eligible";
        color = "emerald";
      } else if (score >= 55) {
        status = "Possible with Strong Profile";
        color = "amber";
      } else {
        status = "Low Eligibility";
        color = "red";
      }

      const recommendedDurations = score >= 80 ? ['120 days', '90 days'] : score >= 60 ? ['90 days', '60 days'] : ['60 days'];

      const estimatedCost = {
        visaFee: 250,
        securityDeposit: 1000,
        medicalTest: 400,
        typingService: 150,
        insurance: form.hasHealthInsurance ? 0 : 800,
        totalLow: 1400,
        totalHigh: 2800,
      };

      setResult({
        status,
        score: Math.min(Math.round(score), 100),
        color,
        reasons,
        warnings,
        recommendedDurations,
        estimatedCost,
        checklist: [
          "Valid passport (min 6 months validity)",
          "Attested educational certificates (via MOE + Embassy)",
          "Recent passport-size photos",
          "Medical fitness certificate",
          "Proof of funds / bank statements",
          "Security deposit (refundable)",
          "Health insurance (recommended)",
        ],
        nextSteps: [
          "Apply via ICP Smart Services portal",
          "Book medical test after initial approval",
          "Pay security deposit",
          "Collect visa sticker at airport or typing center"
        ]
      });
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 sticky top-8 self-start">
        <h3 className="text-2xl font-bold mb-6">Personal & Professional Details</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nationality</label>
            <select value={form.nationality} onChange={(e) => updateForm('nationality', e.target.value)}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800">
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Egypt">Egypt</option>
              <option value="Philippines">Philippines</option>
              <option value="Jordan">Jordan</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input type="number" value={form.age} onChange={(e) => updateForm('age', Number(e.target.value))}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Passport Validity (months)</label>
              <input type="number" value={form.passportValidityMonths} onChange={(e) => updateForm('passportValidityMonths', Number(e.target.value))}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Highest Degree</label>
            <select value={form.highestDegree} onChange={(e) => updateForm('highestDegree', e.target.value)}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800">
              {degreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Graduation Year</label>
              <input type="number" value={form.graduationYear} onChange={(e) => updateForm('graduationYear', Number(e.target.value))}
                className="w-full p-3 border rounded-2xl dark:bg-gray-800" max={currentYear} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">University (Optional)</label>
              <input type="text" value={form.university} onChange={(e) => updateForm('university', e.target.value)}
                placeholder="e.g. IIT Bombay" className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Years of Professional Experience</label>
            <input type="range" min="0" max="20" value={form.yearsOfExperience} 
              onChange={(e) => updateForm('yearsOfExperience', Number(e.target.value))}
              className="w-full accent-emerald-600" />
            <div className="text-center font-semibold">{form.yearsOfExperience} years</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current / Last Job Title</label>
            <input type="text" value={form.currentJobTitle} onChange={(e) => updateForm('currentJobTitle', e.target.value)}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select value={form.industry} onChange={(e) => updateForm('industry', e.target.value)}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800">
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MOHRE Skill Level (Best Match)</label>
            <select value={form.mohreSkillLevel} onChange={(e) => updateForm('mohreSkillLevel', e.target.value)}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800">
              {mohreLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {mohreLevels.find(l => l.value === form.mohreSkillLevel)?.desc}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Estimated Bank Balance (USD)</label>
            <input type="number" value={form.estimatedBankBalance} 
              onChange={(e) => updateForm('estimatedBankBalance', Number(e.target.value))}
              className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.hasHealthInsurance} 
              onChange={(e) => updateForm('hasHealthInsurance', e.target.checked)} />
            <label>I have / can arrange health insurance</label>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.documentsAttested} 
              onChange={(e) => updateForm('documentsAttested', e.target.checked)} />
            <label>My educational documents are attested</label>
          </div>
        </div>

        <button
          onClick={calculateEligibility}
          disabled={isCalculating}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 hover:brightness-110 text-white py-4 rounded-2xl text-lg font-semibold transition"
        >
          {isCalculating ? 'Calculating...' : 'Check My Eligibility'}
        </button>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-8">
        {!result ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-16 text-center">
            <div className="text-6xl mb-6">🇦🇪</div>
            <h3 className="text-2xl font-semibold mb-3">Ready to check your eligibility?</h3>
            <p className="text-gray-600 dark:text-gray-400">Fill the form on the left and click the button above</p>
          </div>
        ) : (
          <>
            {/* Main Result */}
            <div className={`rounded-3xl p-10 border-2 ${result.color === 'emerald' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-amber-500 bg-amber-50 dark:bg-amber-950'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="uppercase tracking-widest text-sm font-medium">Your Result</span>
                  <h2 className={`text-5xl font-bold mt-2 ${result.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.status}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold text-gray-300">{result.score}</div>
                  <div className="text-sm -mt-2">/100</div>
                </div>
              </div>
            </div>

            {/* Cost Estimator */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
              <h4 className="font-semibold text-xl mb-6">Estimated Cost Breakdown</h4>
              <div className="space-y-4">
                <div className="flex justify-between"><span>Visa Fee</span><span>AED {result.estimatedCost.visaFee}</span></div>
                <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span>AED {result.estimatedCost.securityDeposit}</span></div>
                <div className="flex justify-between"><span>Medical Test</span><span>AED {result.estimatedCost.medicalTest}</span></div>
                <div className="flex justify-between"><span>Typing + Service</span><span>AED {result.estimatedCost.typingService}</span></div>
                <div className="flex justify-between border-t pt-4 font-semibold">
                  <span>Total Estimated Cost</span>
                  <span>AED {result.estimatedCost.totalLow} – {result.estimatedCost.totalHigh}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6">* Amounts are approximate and may vary by nationality and service provider.</p>
            </div>

            {/* Checklist & Recommendations */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
              <h4 className="font-semibold text-xl mb-6">Required Documents Checklist</h4>
              <ul className="space-y-3">
                {result.checklist.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-600 mt-0.5">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.reasons.length > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
                <h4 className="font-semibold mb-4">Positive Factors</h4>
                <ul className="space-y-2">
                  {result.reasons.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-3xl p-8">
                <h4 className="font-semibold mb-4 text-amber-700 dark:text-amber-400">Areas of Concern</h4>
                <ul className="space-y-2">
                  {result.warnings.map((w: string, i: number) => <li key={i}>⚠️ {w}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
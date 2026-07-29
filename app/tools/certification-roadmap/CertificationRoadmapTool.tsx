'use client';

import React, { useState, useMemo } from 'react';
import { allCertifications, allRoles, SECTORS, GCC_COUNTRIES, certificationMap } from '@/lib/certificationData';

export default function CertificationRoadmapTool() {
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [yearsExp, setYearsExp] = useState(5);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Project Management']);
  const [targetCountry, setTargetCountry] = useState('UAE');
  const [showResults, setShowResults] = useState(false);

  const recommendedCerts = useMemo(() => {
    const relevantRoles = allRoles.filter(role => 
      selectedSectors.includes(role.sector)
    );

    const certIds = new Set<string>();
    relevantRoles.forEach(role => {
      role.recommendedCerts.forEach(id => certIds.add(id));
    });

    return allCertifications
      .filter(cert => certIds.has(cert.id))
      .sort((a, b) => b.roiScore - a.roiScore)
      .slice(0, 12); // Top recommendations
  }, [selectedSectors]);

  const tieredRoadmap = useMemo(() => {
    const foundation = recommendedCerts.filter(c => c.level === 'Foundation');
    const core = recommendedCerts.filter(c => c.level === 'Core');
    const advanced = recommendedCerts.filter(c => c.level === 'Advanced' || c.level === 'Specialized');

    return { foundation, core, advanced };
  }, [recommendedCerts]);

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 lg:p-12">
      <h2 className="text-4xl font-bold text-center mb-10">Build Your GCC Certification Roadmap</h2>

      {!showResults ? (
        <div className="space-y-12">
          {/* Step 1: Profile */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Your Professional Profile</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 font-medium">Experience Level</label>
                <select 
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-4 rounded-2xl border dark:bg-gray-800"
                >
                  {['Entry-Level', 'Mid-Level', 'Senior', 'Leadership'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Years of Experience: <span className="font-bold">{yearsExp}</span></label>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={yearsExp}
                  onChange={(e) => setYearsExp(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Targets */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Target Sectors & Country</h3>
            
            <div className="mb-8">
              <label className="block mb-4 font-medium">Select Sectors (up to 3)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTORS.map(sector => (
                  <button
                    key={sector}
                    onClick={() => {
                      if (selectedSectors.includes(sector)) {
                        setSelectedSectors(selectedSectors.filter(s => s !== sector));
                      } else if (selectedSectors.length < 3) {
                        setSelectedSectors([...selectedSectors, sector]);
                      }
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedSectors.includes(sector) 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 font-medium' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Primary Target Country</label>
              <select 
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full p-4 rounded-2xl border dark:bg-gray-800 text-lg"
              >
                {GCC_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={() => setShowResults(true)}
            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-semibold rounded-3xl hover:brightness-110 transition"
          >
            Generate My Personalized Roadmap →
          </button>
        </div>
      ) : (
        /* === RESULTS SECTION === */
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-emerald-600">Your GCC Certification Roadmap</h3>
            <p className="text-xl mt-3 text-gray-600 dark:text-gray-400">
              {selectedSectors.join(' + ')} • {targetCountry} • {experienceLevel} ({yearsExp} years)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 bg-emerald-50 dark:bg-emerald-950 p-8 rounded-3xl text-center">
            <div>
              <div className="text-5xl font-bold text-emerald-600">20-45%</div>
              <div className="mt-2">Avg. Salary Uplift</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-emerald-600">6-18</div>
              <div className="mt-2">Months Timeline</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-emerald-600">$3k-$12k</div>
              <div className="mt-2">Est. Investment</div>
            </div>
          </div>

          {(['Foundation', 'Core', 'Advanced'] as const).map((tier, index) => {
            const certs = tieredRoadmap[tier.toLowerCase() as keyof typeof tieredRoadmap] || [];
            if (certs.length === 0) return null;

            return (
              <div key={tier} className="border border-gray-200 dark:border-gray-700 rounded-3xl p-8">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  {tier} Level 
                  <span className="text-sm font-normal text-gray-500">({certs.length} recommendations)</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {certs.map(cert => (
                    <div key={cert.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border hover:shadow-md transition">
                      <div className="font-bold text-xl">{cert.name}</div>
                      <div className="text-emerald-600 font-medium">{cert.issuer} • {cert.level}</div>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{cert.description}</p>
                      
                      <div className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
                        <div><strong>Cost:</strong> ${cert.costRangeUSD}</div>
                        <div><strong>Duration:</strong> {cert.durationMonths} months</div>
                        <div><strong>Uplift:</strong> {cert.salaryUplift}</div>
                        <div><strong>ROI:</strong> {cert.roiScore}/10</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <button 
            onClick={() => setShowResults(false)}
            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ← Refine Profile &amp; Generate New Roadmap
          </button>
        </div>
      )}
    </div>
  );
}
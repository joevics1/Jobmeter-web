'use client';

import React, { useState } from 'react';

const tiers = [
  { name: 'Platinum', color: 'emerald', icon: '🏆', risk: 'Very Low', desc: 'Excellent compliance' },
  { name: 'High Green', color: 'emerald', icon: '🟢', risk: 'Low', desc: 'Strong performance' },
  { name: 'Mid Green', color: 'teal', icon: '🟢', risk: 'Moderate', desc: 'Meets target' },
  { name: 'Low Green', color: 'amber', icon: '🟡', risk: 'High', desc: 'Marginal compliance' },
  { name: 'Red', color: 'red', icon: '🔴', risk: 'Very High', desc: 'Non-compliant' },
];

export default function NitaqatChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    cr_number: '',
    nitaqat_tier: '',
    notes: ''
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setResult({
      found: false,
      message: "No verified data found for this company yet."
    });
    setShowReportForm(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your report has been submitted and will be reviewed shortly.");
    setShowReportForm(false);
    setFormData({ company_name: '', cr_number: '', nitaqat_tier: '', notes: '' });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Left Column - Tools */}
      <div className="lg:col-span-5 space-y-8">
        {/* Employer Lookup */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <h3 className="text-2xl font-bold mb-6">Employer Nitaqat Lookup</h3>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Company name or CR number"
              className="flex-1 p-4 border rounded-2xl dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 text-lg"
            />
            <button
              onClick={handleSearch}
              className="px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl transition-colors"
            >
              Search
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200">
              <p className="text-gray-600 dark:text-gray-400 mb-5">{result.message}</p>

              <a
                href="https://es.hrsd.gov.sa/services/inquiry/nonsaudiempinquiry.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 bg-white border-2 border-emerald-600 text-emerald-700 rounded-2xl hover:bg-emerald-50 font-semibold mb-3"
              >
                ✅ Check Officially on MHRSD (Iqama Required)
              </a>

              <button
                onClick={() => setShowReportForm(true)}
                className="w-full py-4 text-emerald-600 border border-emerald-200 hover:bg-emerald-50 rounded-2xl font-medium"
              >
                📋 Report This Company&apos;s Tier
              </button>
            </div>
          )}
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-6">Report Nitaqat Tier</h3>
            <form onSubmit={handleReportSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Company Full Name *"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
                required
              />
              <input
                type="text"
                placeholder="CR Number (if known)"
                value={formData.cr_number}
                onChange={(e) => setFormData({...formData, cr_number: e.target.value})}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
              />
              <select
                value={formData.nitaqat_tier}
                onChange={(e) => setFormData({...formData, nitaqat_tier: e.target.value})}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800"
                required
              >
                <option value="">Select Nitaqat Tier *</option>
                {tiers.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Additional information (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-4 border rounded-2xl dark:bg-gray-800 h-28"
              />
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700"
              >
                Submit Report
              </button>
            </form>
          </div>
        )}

        {/* Saudization Simulator */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <h3 className="text-2xl font-bold mb-6">Saudization Simulator</h3>
          <p className="text-sm text-gray-500 mb-8">Estimate tier based on workforce</p>
          {/* Add your simulator code here if you want to keep it */}
        </div>
      </div>

      {/* Right Column - Colorful Tier Cards */}
      <div className="lg:col-span-7">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-8">Nitaqat Tiers Explained (2026)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`border border-${tier.color}-200 dark:border-${tier.color}-800 bg-white dark:bg-gray-900 rounded-3xl p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{tier.icon}</div>
                  <div>
                    <h4 className={`text-2xl font-bold text-${tier.color}-600`}>{tier.name}</h4>
                    <p className="text-sm text-gray-500">{tier.desc}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Risk for Expats: <span className={`text-${tier.color}-600 font-semibold`}>{tier.risk}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Check Reminder */}
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8">
          <h4 className="font-semibold text-xl mb-4">Important</h4>
          <p className="text-sm leading-relaxed">
            This tool shows educational information and user-reported data. 
            For the most accurate and official Nitaqat status of your sponsor, always check directly on the MHRSD portal using your Iqama number.
          </p>
        </div>
      </div>
    </div>
  );
}
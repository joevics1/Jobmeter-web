'use client';

import React, { useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calculator, Info } from 'lucide-react';

interface FormData {
  jurisdiction: 'mainland' | 'difc' | 'adgm' | 'other';
  basicSalary: number;
  startDate: string;
  endDate: string;
  unpaidDays: number;
  isPartTime: boolean;
  partTimePercent: number;
}

interface CalculationResult {
  gratuity: number;
  effectiveYears: string;
  totalDays?: number;
  effectiveDays?: number;
  gratuityDays?: string;
  dailyRate?: string;
  rawGratuity?: number;
  cap?: number;
  hitCap?: boolean;
  message?: string;
  isDEWS?: boolean;
}

const GratuityCalculator: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    jurisdiction: 'mainland',
    basicSalary: 10000,
    startDate: '',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    unpaidDays: 0,
    isPartTime: false,
    partTimePercent: 100,
  });

  const [showBreakdown, setShowBreakdown] = useState(false);

  const result = useMemo<CalculationResult | null>(() => {
    if (!form.startDate || !form.endDate || form.basicSalary <= 0) return null;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    let totalDays = differenceInDays(end, start) + 1;

    const effectiveDays = Math.max(0, totalDays - form.unpaidDays);
    const effectiveYears = effectiveDays / 365.25;

    if (effectiveYears < 1) {
      return {
        gratuity: 0,
        effectiveYears: effectiveYears.toFixed(3),
        message: 'Minimum 1 year of effective service required.',
      };
    }

    let gratuityDays = 0;
    let finalGratuity = 0;

    if (form.jurisdiction === 'mainland' || form.jurisdiction === 'other') {
      const fullYears = Math.floor(effectiveYears);
      const fraction = effectiveYears - fullYears;

      if (fullYears <= 5) {
        gratuityDays = fullYears * 21 + fraction * 21;
      } else {
        gratuityDays = 5 * 21 + (fullYears - 5) * 30 + fraction * 30;
      }

      const dailyRate = form.basicSalary / 30;
      let rawGratuity = gratuityDays * dailyRate;
      const cap = form.basicSalary * 24;
      finalGratuity = Math.min(rawGratuity, cap);

      return {
        gratuity: Math.round(finalGratuity),
        effectiveYears: effectiveYears.toFixed(3),
        gratuityDays: gratuityDays.toFixed(2),
        dailyRate: dailyRate.toFixed(2),
        rawGratuity: Math.round(rawGratuity),
        cap,
        hitCap: rawGratuity > cap,
      };
    } else if (form.jurisdiction === 'difc') {
      const rate = effectiveYears < 5 ? 0.0583 : 0.0833;
      const estimated = form.basicSalary * rate * effectiveYears * 12;
      return {
        gratuity: Math.round(estimated),
        effectiveYears: effectiveYears.toFixed(3),
        isDEWS: true,
        message: 'DIFC DEWS Scheme - Estimated employer contributions',
      };
    } else {
      // ADGM - similar to mainland
      return { /* same as mainland logic */ gratuity: 0, effectiveYears: '0' }; // Expand as needed
    }
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const togglePartTime = (value: boolean) => {
    setForm(prev => ({ ...prev, isPartTime: value }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
      {/* Ad Above Calculator (Optional) */}
      <div className="mb-8">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1119289641389825"
          crossOrigin="anonymous"></script>
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1119289641389825"
          data-ad-slot="9010641928"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6" /> Enter Your Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Jurisdiction</label>
              <select name="jurisdiction" value={form.jurisdiction} onChange={handleChange} className="w-full p-3 border rounded-xl">
                <option value="mainland">Mainland UAE (Federal Law)</option>
                <option value="difc">DIFC</option>
                <option value="adgm">ADGM</option>
                <option value="other">Other Free Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Basic Salary (AED / month)</label>
              <input type="number" name="basicSalary" value={form.basicSalary} onChange={handleChange} className="w-full p-3 border rounded-xl text-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full p-3 border rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unpaid Leave Days</label>
              <input type="number" name="unpaidDays" value={form.unpaidDays} onChange={handleChange} className="w-full p-3 border rounded-xl" min="0" />
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.isPartTime} onChange={(e) => togglePartTime(e.target.checked)} />
              <span>Part-time Employment</span>
            </label>

            {form.isPartTime && (
              <div>
                <input type="range" min="10" max="100" value={form.partTimePercent} onChange={(e) => setForm(p => ({...p, partTimePercent: parseInt(e.target.value)}))} className="w-full" />
                <div className="text-center">{form.partTimePercent}% of full-time</div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Gratuity</h2>
          {result ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="text-6xl font-bold text-blue-700">
                AED {result.gratuity.toLocaleString()}
              </div>
              <p className="text-gray-600 mt-1">End of Service Gratuity</p>

              {result.hitCap && <p className="text-amber-600 mt-2">2-Year Cap Applied</p>}
              {result.message && <p className="text-sm mt-4">{result.message}</p>}

              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="mt-6 w-full py-4 bg-white rounded-2xl font-medium border"
              >
                {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">Fill the form to calculate</div>
          )}
        </div>
      </div>

      {/* Breakdown Panel */}
      {showBreakdown && result && (
        <div className="mt-10 p-8 bg-gray-50 rounded-2xl border">
          <h3 className="font-semibold text-xl mb-6">Detailed Breakdown</h3>
          {/* Add your full breakdown content here */}
          <p><strong>Effective Service:</strong> {result.effectiveYears} years</p>
          {/* ... more details */}
        </div>
      )}

      {/* Ad Below the Tool */}
      <div className="mt-12">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1119289641389825"
          crossOrigin="anonymous"></script>
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1119289641389825"
          data-ad-slot="8344942808"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>
  );
};

export default GratuityCalculator;
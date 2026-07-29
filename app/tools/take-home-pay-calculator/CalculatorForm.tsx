'use client';

import React from 'react';
import { TakeHomeFormData } from './TakeHomePayCalculator';
import { GCC_SALARY_DATA, GCC_COUNTRIES } from '@/lib/salaryData';

interface Props {
  formData: TakeHomeFormData;
  setFormData: React.Dispatch<React.SetStateAction<TakeHomeFormData>>;
}

export function CalculatorForm({ formData, setFormData }: Props) {
  const currentCountryData = GCC_SALARY_DATA[formData.country] || GCC_SALARY_DATA['UAE'];
  const availableCities = currentCountryData?.cities || ['Dubai'];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-8">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">Job Offer Details</h3>

      <div className="space-y-8">
        {/* Country & City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => {
                const newCountry = e.target.value;
                const newCities = GCC_SALARY_DATA[newCountry]?.cities || ['Main City'];
                setFormData(prev => ({
                  ...prev,
                  country: newCountry,
                  city: newCities[0],
                }));
              }}
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {GCC_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {availableCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Salary Package */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Monthly Salary Package</h4>
          <div className="space-y-5">
            {[
              { label: 'Basic Salary', key: 'basicSalary' as const, placeholder: '15000' },
              { label: 'Housing Allowance', key: 'housingAllowance' as const, placeholder: '7000' },
              { label: 'Transport Allowance', key: 'transportAllowance' as const, placeholder: '2000' },
              { label: 'Other Allowances', key: 'otherAllowance' as const, placeholder: '1500' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <input
                  type="number"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, [key]: Number(e.target.value) || 0 }))
                  }
                  placeholder={placeholder}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Annual Bonus / Incentives
              </label>
              <input
                type="number"
                value={formData.annualBonus}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, annualBonus: Number(e.target.value) || 0 }))
                }
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Employment Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Years of Service (for Gratuity) — <span className="font-semibold text-emerald-600">{formData.yearsOfService} years</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={formData.yearsOfService}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, yearsOfService: Number(e.target.value) }))
            }
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 year</span>
            <span>10 years</span>
          </div>
        </div>

        {/* Cost of Living */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Estimated Monthly Cost of Living</h4>
          <div className="space-y-5">
            {[
              { label: 'Rent (1-3 bedroom)', key: 'monthlyRent' as const },
              { label: 'Utilities & Internet', key: 'monthlyUtilities' as const },
              { label: 'Groceries & Dining', key: 'monthlyGroceries' as const },
              { label: 'Transport (Taxi/Fuel)', key: 'monthlyTransport' as const },
              { label: 'Education (School Fees)', key: 'monthlyEducation' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-700">{label}</span>
                <input
                  type="number"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, [key]: Number(e.target.value) || 0 }))
                  }
                  className="w-40 p-3 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Deductions */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Monthly Deductions & Mandatory Costs</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Health Insurance (Self)</label>
              <input
                type="number"
                value={formData.healthInsuranceSelf}
                onChange={(e) => setFormData(prev => ({ ...prev, healthInsuranceSelf: Number(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Health Insurance (Dependents)</label>
              <input
                type="number"
                value={formData.healthInsuranceDependents}
                onChange={(e) => setFormData(prev => ({ ...prev, healthInsuranceDependents: Number(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Annual Visa / Iqama Fees</label>
            <input
              type="number"
              value={formData.visaFeesAnnual}
              onChange={(e) => setFormData(prev => ({ ...prev, visaFeesAnnual: Number(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
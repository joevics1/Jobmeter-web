'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TakeHomeFormData } from './TakeHomePayCalculator';

interface ResultsPanelProps {
  formData: TakeHomeFormData;
  results: {
    grossMonthly: number;
    netMonthlyCash: number;
    monthlyCOL: number;
    trueDisposable: number;
    gratuity: number;
    annualNet: number;
    effectivePackage: number;
    savingsRate: number;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export function ResultsPanel({ formData, results }: ResultsPanelProps) {
  const grossMonthly = formData.basicSalary + formData.housingAllowance + 
                      formData.transportAllowance + formData.otherAllowance;

  const pieData = [
    { name: 'Basic Salary', value: formData.basicSalary, fill: '#10b981' },
    { name: 'Housing', value: formData.housingAllowance, fill: '#3b82f6' },
    { name: 'Transport', value: formData.transportAllowance, fill: '#8b5cf6' },
    { name: 'Other Allowances', value: formData.otherAllowance, fill: '#f59e0b' },
  ].filter(item => item.value > 0);

  const expenseData = [
    { name: 'Rent', value: formData.monthlyRent },
    { name: 'Utilities', value: formData.monthlyUtilities },
    { name: 'Groceries', value: formData.monthlyGroceries },
    { name: 'Transport', value: formData.monthlyTransport },
    { name: 'Education', value: formData.monthlyEducation },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Main Results Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-emerald-400 text-sm font-medium tracking-widest">YOUR REAL TAKE-HOME</p>
            <div className="text-5xl font-bold mt-2">
              {results.netMonthlyCash.toLocaleString()}
              <span className="text-2xl font-normal text-slate-400 ml-2">
                {formData.country === 'UAE' ? 'AED' : 
                 formData.country === 'KSA' ? 'SAR' : 'Local'}
              </span>
            </div>
            <p className="text-slate-400">Monthly Net Cash After Deductions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold text-emerald-400">
              {results.savingsRate}%
            </div>
            <p className="text-sm text-slate-400">Savings Rate</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Gross Monthly</p>
            <p className="text-2xl font-semibold mt-1">{results.grossMonthly.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-xs text-slate-400">True Disposable</p>
            <p className="text-2xl font-semibold mt-1 text-emerald-400">
              {results.trueDisposable.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Monthly COL</p>
            <p className="text-2xl font-semibold mt-1">{results.monthlyCOL.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Gratuity (End of Service)</p>
            <p className="text-2xl font-semibold mt-1 text-violet-400">
              {results.gratuity.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">after {formData.yearsOfService} years</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Salary Breakdown */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="font-semibold text-lg mb-6">Salary Package Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="font-semibold text-lg mb-6">Monthly Expenses Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annual & Gratuity Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="font-semibold text-lg mb-6">Annual Summary & Gratuity Projection</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm">Annual Net Cash</p>
            <p className="text-3xl font-bold mt-2">{results.annualNet.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Effective Annual Package</p>
            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {results.effectivePackage.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">(incl. prorated gratuity)</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Gratuity</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">
              {results.gratuity.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">after {formData.yearsOfService} years</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-400 mb-3">💡 Key Insight</p>
          <p className="text-slate-300 leading-relaxed">
            Your housing allowance covers approximately{' '}
            <span className="font-semibold text-emerald-400">
              {formData.monthlyRent > 0 
                ? Math.round((formData.housingAllowance / formData.monthlyRent) * 100) 
                : 0}%
            </span>{' '}
            of your estimated rent in {formData.city}. 
            Gratuity is calculated on <strong>Basic Salary only</strong>.
          </p>
        </div>
      </div>

      {/* Home Country Comparison */}
      <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border border-emerald-500/20 rounded-3xl p-8">
        <h3 className="font-semibold text-lg mb-4">Home Country Comparison</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 text-center">
            <p className="text-slate-400">Gulf Net Monthly</p>
            <p className="text-4xl font-bold text-emerald-400 mt-2">
              {results.netMonthlyCash.toLocaleString()}
            </p>
          </div>
          <div className="text-4xl text-slate-500">→</div>
          <div className="flex-1 text-center">
            <p className="text-slate-400">Your Home Net Monthly</p>
            <p className="text-4xl font-bold mt-2">
              {formData.homeNetMonthly.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">({formData.homeCountry})</p>
          </div>
        </div>
        <p className="text-center text-sm text-emerald-400 mt-6">
          You are effectively earning more in the Gulf even after higher living costs.
        </p>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsPanel } from './ResultsPanel';
import { GCC_SALARY_DATA, GCC_COUNTRIES } from '@/lib/salaryData';
import { calculateGratuity } from '@/lib/salaryUtils';   // ← This was missing

export interface TakeHomeFormData {
  country: string;
  city: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  annualBonus: number;
  yearsOfService: number;
  healthInsuranceSelf: number;
  healthInsuranceDependents: number;
  visaFeesAnnual: number;
  monthlyRent: number;
  monthlyUtilities: number;
  monthlyGroceries: number;
  monthlyTransport: number;
  monthlyEducation: number;
  homeCountry: string;
  homeNetMonthly: number;
}

const defaultValues: TakeHomeFormData = {
  country: 'UAE',
  city: 'Dubai',
  basicSalary: 18000,
  housingAllowance: 8000,
  transportAllowance: 2000,
  otherAllowance: 1500,
  annualBonus: 24000,
  yearsOfService: 3,
  healthInsuranceSelf: 450,
  healthInsuranceDependents: 800,
  visaFeesAnnual: 1200,
  monthlyRent: 6000,
  monthlyUtilities: 900,
  monthlyGroceries: 1600,
  monthlyTransport: 700,
  monthlyEducation: 0,
  homeCountry: 'India',
  homeNetMonthly: 70000,
};

export function TakeHomePayCalculator() {
  const [formData, setFormData] = useState<TakeHomeFormData>(defaultValues);

  const results = useMemo(() => {
    const grossMonthly = 
      formData.basicSalary + 
      formData.housingAllowance + 
      formData.transportAllowance + 
      formData.otherAllowance;

    const monthlyDeductions = 
      formData.healthInsuranceSelf + 
      formData.healthInsuranceDependents + 
      (formData.visaFeesAnnual / 12);

    const netMonthlyCash = grossMonthly - monthlyDeductions;

    const monthlyCOL = 
      formData.monthlyRent + 
      formData.monthlyUtilities + 
      formData.monthlyGroceries + 
      formData.monthlyTransport + 
      formData.monthlyEducation;

    const trueDisposable = Math.max(0, netMonthlyCash - monthlyCOL);

    // Now properly imported
    const gratuity = calculateGratuity(formData.basicSalary, formData.yearsOfService);

    const annualNet = netMonthlyCash * 12 + formData.annualBonus;
    const effectivePackage = annualNet + (gratuity / Math.max(1, formData.yearsOfService));

    return {
      grossMonthly: Math.round(grossMonthly),
      netMonthlyCash: Math.round(netMonthlyCash),
      monthlyCOL: Math.round(monthlyCOL),
      trueDisposable: Math.round(trueDisposable),
      gratuity: Math.round(gratuity),
      annualNet: Math.round(annualNet),
      effectivePackage: Math.round(effectivePackage),
      savingsRate: netMonthlyCash > 0 ? Math.round((trueDisposable / netMonthlyCash) * 100) : 0,
    };
  }, [formData]);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <CalculatorForm formData={formData} setFormData={setFormData} />
      </div>

      <div className="lg:col-span-7">
        <ResultsPanel formData={formData} results={results} />
      </div>
    </div>
  );
}
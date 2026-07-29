// lib/salaryUtils.ts
import { getSalaryRange } from './salaryData';

export interface BenchmarkResult {
  baseSalary: any;
  adjustedSalary: any;
  monthlyAllowances: number;
  totalCashMonthly: number;
  estimatedBonusMonthly: number;
  annualTotalCompensation: number;
  gratuityEstimate: number;
  usdEquivalent: { monthlyMedian: number; annualTotal: number };
  currency: string;
}

export const GCC_CURRENCIES: Record<string, { code: string; symbol: string; usdRate: number }> = {
  'UAE': { code: 'AED', symbol: 'د.إ', usdRate: 0.2723 },
  'Saudi Arabia': { code: 'SAR', symbol: 'ر.س', usdRate: 0.2666 },
  'Qatar': { code: 'QAR', symbol: 'ر.ق', usdRate: 0.2747 },
  'Kuwait': { code: 'KWD', symbol: 'د.ك', usdRate: 3.26 },
  'Bahrain': { code: 'BHD', symbol: 'د.ب', usdRate: 2.6596 },
  'Oman': { code: 'OMR', symbol: 'ر.ع', usdRate: 2.5974 },
};

export function calculateBenchmark(
  country: string,
  role: string,
  seniority: string,
  yearsOfExperience: number,
  gccExperience: number = 0,
  skillsPremium: number = 0
) {
  const levelKey = seniority.toLowerCase().includes('junior') ? 'junior' :
                   seniority.toLowerCase().includes('senior') ? 'senior' : 'mid';

  const base = getSalaryRange(country, role, levelKey as any);

  let multiplier = 1 + (yearsOfExperience - 5) * 0.045;
  if (gccExperience > 0) multiplier += Math.min(gccExperience * 0.025, 0.12);
  if (skillsPremium > 0) multiplier += skillsPremium;

  if (seniority.includes('Senior')) multiplier *= 1.25;
  if (seniority.includes('Lead') || seniority.includes('Manager')) multiplier *= 1.45;
  if (seniority.includes('Director')) multiplier *= 1.75;
  if (seniority.includes('C-Level')) multiplier *= 2.2;

  const adjusted = {
    low: Math.round(base.low * multiplier),
    median: Math.round(base.median * multiplier),
    high: Math.round(base.high * multiplier),
  };

  const monthlyAllowances = Math.round(adjusted.median * 0.32); // Housing + transport + others
  const estimatedBonusMonthly = Math.round(adjusted.median * 0.12);

  const totalCashMonthly = adjusted.median + monthlyAllowances;
  const gratuity = calculateGratuity(adjusted.median, Math.max(yearsOfExperience, 1));

  const annualTotal = (totalCashMonthly + estimatedBonusMonthly) * 12 + gratuity;

  const currencyInfo = GCC_CURRENCIES[country] || GCC_CURRENCIES['UAE'];

  return {
    baseSalary: base,
    adjustedSalary: adjusted,
    monthlyAllowances,
    totalCashMonthly,
    estimatedBonusMonthly,
    annualTotalCompensation: Math.round(annualTotal),
    gratuityEstimate: gratuity,
    usdEquivalent: {
      monthlyMedian: Math.round(adjusted.median * currencyInfo.usdRate),
      annualTotal: Math.round(annualTotal * currencyInfo.usdRate),
    },
    currency: currencyInfo.code,
  };
}

export function calculateGratuity(basicMonthly: number, years: number): number {
  if (years < 1) return 0;
  const rate = years <= 5 ? 21 : 30;
  return Math.round((basicMonthly * 12 / 365) * rate * years);
}

export function getAllowancesBreakdown(monthlyBase: number) {
  return {
    housing: Math.round(monthlyBase * 0.25),
    transport: Math.round(monthlyBase * 0.05),
    education: Math.round(monthlyBase * 0.07),
    other: Math.round(monthlyBase * 0.05),
    total: Math.round(monthlyBase * 0.32),
  };
}
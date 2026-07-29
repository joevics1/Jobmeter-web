// lib/saudiVisaUtils.ts
export type Sector = 
  | 'IT & Technology' 
  | 'Engineering & Construction' 
  | 'Healthcare' 
  | 'Finance & Banking' 
  | 'Oil & Gas / Energy' 
  | 'Education' 
  | 'Marketing & Sales' 
  | 'Logistics & Transportation' 
  | 'Hospitality & Tourism' 
  | 'General';

export interface SalaryThresholds {
  highSkilledMin: number;     // SAR per month
  exceptional: number;        // Top tier
  skilledMin: number;
  basicMax: number;
}

export const SECTOR_THRESHOLDS: Record<Sector, SalaryThresholds> = {
  'IT & Technology': {
    highSkilledMin: 16000,
    exceptional: 35000,
    skilledMin: 8000,
    basicMax: 6000,
  },
  'Engineering & Construction': {
    highSkilledMin: 15000,
    exceptional: 30000,
    skilledMin: 7500,
    basicMax: 5500,
  },
  'Healthcare': {
    highSkilledMin: 18000,
    exceptional: 45000,
    skilledMin: 9000,
    basicMax: 7000,
  },
  'Finance & Banking': {
    highSkilledMin: 17000,
    exceptional: 40000,
    skilledMin: 8500,
    basicMax: 6500,
  },
  'Oil & Gas / Energy': {
    highSkilledMin: 20000,
    exceptional: 50000,
    skilledMin: 10000,
    basicMax: 8000,
  },
  'Education': {
    highSkilledMin: 14000,
    exceptional: 28000,
    skilledMin: 7000,
    basicMax: 5000,
  },
  'Marketing & Sales': {
    highSkilledMin: 13000,
    exceptional: 25000,
    skilledMin: 6500,
    basicMax: 5000,
  },
  'Logistics & Transportation': {
    highSkilledMin: 12000,
    exceptional: 22000,
    skilledMin: 6000,
    basicMax: 4500,
  },
  'Hospitality & Tourism': {
    highSkilledMin: 11000,
    exceptional: 20000,
    skilledMin: 5500,
    basicMax: 4000,
  },
  'General': {
    highSkilledMin: 15000,
    exceptional: 28000,
    skilledMin: 7000,
    basicMax: 5000,
  },
};

export const calculateSalaryPoints = (monthlySalary: number, sector: Sector): number => {
  const thresholds = SECTOR_THRESHOLDS[sector] || SECTOR_THRESHOLDS['General'];

  if (monthlySalary >= thresholds.exceptional) return 50;
  if (monthlySalary >= thresholds.highSkilledMin) return 35;
  if (monthlySalary >= thresholds.skilledMin) return 20;
  if (monthlySalary >= 4000) return 10;
  return 5;
};

export const getTierRecommendation = (
  totalPoints: number,
  sscoGroup: string,
  monthlySalary: number,
  sector: Sector
) => {
  const thresholds = SECTOR_THRESHOLDS[sector] || SECTOR_THRESHOLDS['General'];

  if (sscoGroup === '1-3' && totalPoints >= 70 && monthlySalary >= thresholds.highSkilledMin) {
    return {
      tier: 'High-Skilled',
      confidence: totalPoints >= 90 ? 'Very High' : totalPoints >= 80 ? 'High' : 'Good',
      color: 'emerald',
      message: 'Strong candidate for High-Skilled Work Permit. Proceed with Professional Accreditation.',
    };
  }

  if (sscoGroup !== '9' && monthlySalary >= thresholds.skilledMin) {
    return {
      tier: 'Skilled',
      confidence: 'Moderate',
      color: 'amber',
      message: 'Eligible for Skilled tier. Consider increasing salary or qualifications for High-Skilled.',
    };
  }

  return {
    tier: 'Basic',
    confidence: 'Low',
    color: 'red',
    message: 'Currently qualifies for Basic tier. Significant improvements needed in salary, education, or occupation group.',
  };
};

export const getOccupationGroupLabel = (group: string) => {
  if (group === '1-3') return 'Groups 1-3 (Managers, Specialists, Technicians) — High-Skilled Eligible';
  if (group === '4-8') return 'Groups 4-8 (Skilled Occupations)';
  return 'Group 9 (Elementary Occupations) — Basic Tier';
};
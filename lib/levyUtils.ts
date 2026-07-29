// lib/levyUtils.ts
export const DEPENDENT_RATE = 400; // SAR per month per dependent

export interface FamilyProfile {
  spouse: number;
  childrenUnder18: number;
  adultChildren: number;
  parents: number;
  other: number;
  months: number;
  monthlySalary: number;
  applyExemptions: boolean;
  includeRelatedCosts: boolean;
}

export interface LevyCalculation {
  totalDependents: number;
  effectiveDependents: number;
  monthlyLevy: number;
  periodTotal: number;
  annualLevy: number;
  totalWithRelated: number;
  salaryImpactPercent: number;
  iqamaEstimate: number;
  breakdown: Array<{
    category: string;
    count: number;
    monthly: number;
    annual: number;
  }>;
}

export const calculateLevy = (profile: FamilyProfile): LevyCalculation => {
  const {
    spouse,
    childrenUnder18,
    adultChildren,
    parents,
    other,
    months,
    monthlySalary,
    applyExemptions,
    includeRelatedCosts,
  } = profile;

  const totalDependents = spouse + childrenUnder18 + adultChildren + parents + other;

  // Simple exemption logic (can be expanded later)
  let effectiveDependents = totalDependents;
  if (applyExemptions) {
    effectiveDependents = Math.max(0, totalDependents - 1);
  }

  const monthlyLevy = effectiveDependents * DEPENDENT_RATE;
  const periodTotal = monthlyLevy * months;
  const annualLevy = monthlyLevy * 12;

  const iqamaEstimate = includeRelatedCosts ? totalDependents * 650 : 0; // annual estimate
  const relatedForPeriod = (iqamaEstimate * months) / 12;
  const totalWithRelated = Math.round(periodTotal + relatedForPeriod);

  const salaryImpactPercent = monthlySalary > 0 
    ? Math.round((monthlyLevy / monthlySalary) * 100) 
    : 0;

  const breakdown = [
    { category: 'Spouse', count: spouse, monthly: spouse * DEPENDENT_RATE, annual: spouse * DEPENDENT_RATE * 12 },
    { category: 'Children < 18', count: childrenUnder18, monthly: childrenUnder18 * DEPENDENT_RATE, annual: childrenUnder18 * DEPENDENT_RATE * 12 },
    { category: 'Adult Children', count: adultChildren, monthly: adultChildren * DEPENDENT_RATE, annual: adultChildren * DEPENDENT_RATE * 12 },
    { category: 'Parents / Others', count: parents + other, monthly: (parents + other) * DEPENDENT_RATE, annual: (parents + other) * DEPENDENT_RATE * 12 },
  ];

  return {
    totalDependents,
    effectiveDependents,
    monthlyLevy,
    periodTotal: Math.round(periodTotal),
    annualLevy: Math.round(annualLevy),
    totalWithRelated,
    salaryImpactPercent,
    iqamaEstimate,
    breakdown,
  };
};

export const FAMILY_PRESETS = [
  { name: 'Single', icon: '👤', spouse: 0, childrenUnder18: 0, adultChildren: 0, parents: 0, other: 0 },
  { name: 'Couple', icon: '👫', spouse: 1, childrenUnder18: 0, adultChildren: 0, parents: 0, other: 0 },
  { name: 'Couple + 1', icon: '👨‍👩‍👦', spouse: 1, childrenUnder18: 1, adultChildren: 0, parents: 0, other: 0 },
  { name: 'Couple + 2', icon: '👨‍👩‍👧‍👦', spouse: 1, childrenUnder18: 2, adultChildren: 0, parents: 0, other: 0 },
  { name: 'Couple + 2 + Parents', icon: '👨‍👩‍👧‍👦👴', spouse: 1, childrenUnder18: 2, adultChildren: 0, parents: 2, other: 0 },
  { name: 'Large Family', icon: '👨‍👩‍👦‍👦', spouse: 1, childrenUnder18: 3, adultChildren: 1, parents: 1, other: 0 },
];
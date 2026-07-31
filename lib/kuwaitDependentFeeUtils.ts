// lib/kuwaitDependentFeeUtils.ts
// Based on Kuwait's Residency Law reforms (Ministerial Resolution No. 2249 of 2025,
// effective 23 Dec 2025), which unified family residency under Article 22 and
// restructured dependent fees by sponsor category.
// Verify current figures with Kuwait's Ministry of Interior before relying on this
// for anything official — fee schedules are set by executive by-law and can change.

export type SponsorCategory =
  | 'standard'      // Article 18 private-sector employees (most expats)
  | 'investor'      // investors, partners, property owners, religious figures
  | 'selfSponsored'; // Article 24 self-sponsored residents

export interface KuwaitFamilyProfile {
  sponsorCategory: SponsorCategory;
  spouseCount: number;       // 0 or 1 in practice, kept flexible
  childrenCount: number;     // spouse + children share the same fee tier
  parentsOrOtherCount: number; // parents / extended family — separate, higher tier
  years: number;
  includeHealthInsurance: boolean;
}

export interface KuwaitFeeBreakdown {
  category: string;
  count: number;
  annualRateKWD: number;
  annualTotalKWD: number;
}

export interface KuwaitFeeResult {
  breakdown: KuwaitFeeBreakdown[];
  annualTotalKWD: number;
  multiYearTotalKWD: number;
  healthInsuranceAnnualKWD: number;
  grandTotalWithInsuranceKWD: number;
  annualTotalUSD: number;
  grandTotalWithInsuranceUSD: number;
}

// KWD 1 ≈ USD 3.26 (Kuwaiti Dinar is pegged to a currency basket, rate is stable
// but should be checked periodically)
export const KWD_TO_USD = 3.26;

// Annual dependent fee per spouse/child, by sponsor category (KWD/year)
const SPOUSE_CHILD_RATE: Record<SponsorCategory, number> = {
  standard: 20,
  investor: 40,
  selfSponsored: 100,
};

// Annual fee for parents / other extended family dependents (KWD/year) —
// flat regardless of sponsor category per the 2025/2026 reform
const PARENT_OTHER_RATE = 300;

// Mandatory annual health insurance per long-term resident (KWD/year) — applies
// per dependent as well as the sponsor themselves under the reformed rules
const HEALTH_INSURANCE_RATE = 100;

export function calculateKuwaitDependentFee(profile: KuwaitFamilyProfile): KuwaitFeeResult {
  const spouseChildCount = Math.max(0, profile.spouseCount) + Math.max(0, profile.childrenCount);
  const parentOtherCount = Math.max(0, profile.parentsOrOtherCount);
  const years = Math.max(1, profile.years || 1);

  const spouseChildRate = SPOUSE_CHILD_RATE[profile.sponsorCategory];

  const breakdown: KuwaitFeeBreakdown[] = [];

  if (spouseChildCount > 0) {
    breakdown.push({
      category: 'Spouse & children',
      count: spouseChildCount,
      annualRateKWD: spouseChildRate,
      annualTotalKWD: spouseChildCount * spouseChildRate,
    });
  }

  if (parentOtherCount > 0) {
    breakdown.push({
      category: 'Parents / other dependents',
      count: parentOtherCount,
      annualRateKWD: PARENT_OTHER_RATE,
      annualTotalKWD: parentOtherCount * PARENT_OTHER_RATE,
    });
  }

  const annualTotalKWD = breakdown.reduce((sum, b) => sum + b.annualTotalKWD, 0);
  const totalDependents = spouseChildCount + parentOtherCount;
  const healthInsuranceAnnualKWD = profile.includeHealthInsurance
    ? totalDependents * HEALTH_INSURANCE_RATE
    : 0;

  const grandAnnual = annualTotalKWD + healthInsuranceAnnualKWD;

  return {
    breakdown,
    annualTotalKWD,
    multiYearTotalKWD: annualTotalKWD * years,
    healthInsuranceAnnualKWD,
    grandTotalWithInsuranceKWD: grandAnnual,
    annualTotalUSD: Math.round(annualTotalKWD * KWD_TO_USD),
    grandTotalWithInsuranceUSD: Math.round(grandAnnual * KWD_TO_USD),
  };
}

export const KUWAIT_FAMILY_PRESETS = [
  { name: 'Spouse only', icon: '💑', sponsorCategory: 'standard' as SponsorCategory, spouseCount: 1, childrenCount: 0, parentsOrOtherCount: 0 },
  { name: 'Spouse + 2 kids', icon: '👨‍👩‍👧‍👦', sponsorCategory: 'standard' as SponsorCategory, spouseCount: 1, childrenCount: 2, parentsOrOtherCount: 0 },
  { name: 'Family + parent', icon: '👴', sponsorCategory: 'standard' as SponsorCategory, spouseCount: 1, childrenCount: 2, parentsOrOtherCount: 1 },
];

export const SPONSOR_CATEGORY_LABELS: Record<SponsorCategory, string> = {
  standard: 'Standard private-sector employee (Article 18)',
  investor: 'Investor / partner / property owner / religious figure',
  selfSponsored: 'Self-sponsored resident (Article 24)',
};

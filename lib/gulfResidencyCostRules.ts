// lib/gulfResidencyCostRules.ts
// Residency/ID card cost calculators for Qatar (QID), Kuwait (Civil ID/Iqama),
// Bahrain (CPR/work permit), and Oman (Resident Card).
// Figures drawn from official fee schedules as publicly reported in 2026.
// These change periodically (Bahrain's LMRA and Oman's ROP have both revised
// fees within the last year) — always confirm the current amount on the
// relevant government portal before budgeting off this.

export interface CostLineItem {
  label: string;
  amount: number;
}

export interface CostResult {
  breakdown: CostLineItem[];
  total: number;
  currency: string;
  note: string;
}

// ---------------------------------------------------------------------------
// QATAR — QID (Qatar ID / residence permit), Ministry of Interior
// ---------------------------------------------------------------------------
export interface QatarInput {
  durationYears: 1 | 3;
  dependents: number;
  homeDelivery: boolean;
  includeMedical: boolean;
  daysLate: number;
}

export function calculateQatarQID(input: QatarInput): CostResult {
  const breakdown: CostLineItem[] = [];
  const renewalFee = input.durationYears === 1 ? 500 : 900;
  breakdown.push({ label: `Your QID renewal (${input.durationYears} yr${input.durationYears > 1 ? 's' : ''})`, amount: renewalFee });

  if (input.dependents > 0) {
    const familyFeeFor3yr = 1200; // family member 3-yr rate
    const perDependent = input.durationYears === 1 ? Math.round(familyFeeFor3yr / 3) : familyFeeFor3yr;
    breakdown.push({ label: `Family member QID × ${input.dependents}`, amount: perDependent * input.dependents });
  }

  if (input.includeMedical) breakdown.push({ label: 'Medical fitness test (per person)', amount: 100 });
  if (input.homeDelivery) breakdown.push({ label: 'Q-Post home delivery', amount: 20 });
  if (input.daysLate > 0) breakdown.push({ label: `Late renewal fine (${input.daysLate} days × QAR 10)`, amount: input.daysLate * 10 });

  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  return {
    breakdown, total, currency: 'QAR',
    note: 'Work-sponsored QID renewal is usually paid by your employer — this estimate is useful for family/self-sponsored residents or to sanity-check what your employer should be covering.',
  };
}

// ---------------------------------------------------------------------------
// KUWAIT — Civil ID (PACI) + residency, under the Dec 2025/2026 reform
// ---------------------------------------------------------------------------
export type KuwaitResidencyCategory = 'investorPartnerOwner' | 'selfSponsored' | 'domesticWorkerYear1' | 'domesticWorkerRenewal';

export interface KuwaitResidencyInput {
  category: KuwaitResidencyCategory;
  includeHealthInsurance: boolean;
}

export function calculateKuwaitResidency(input: KuwaitResidencyInput): CostResult {
  const breakdown: CostLineItem[] = [];

  if (input.category === 'investorPartnerOwner') {
    breakdown.push({ label: 'Residency fee (investor / partner / property owner)', amount: 50 });
    breakdown.push({ label: 'Civil ID card', amount: 3 });
  } else if (input.category === 'selfSponsored') {
    breakdown.push({ label: 'Residency fee (self-sponsored, Article 24)', amount: 500 });
    breakdown.push({ label: 'Civil ID card', amount: 3 });
  } else if (input.category === 'domesticWorkerYear1') {
    breakdown.push({ label: 'Article 20 residency fee (one-time)', amount: 200 });
    breakdown.push({ label: 'Medical fitness test', amount: 15 });
    breakdown.push({ label: 'Civil ID card', amount: 3 });
    breakdown.push({ label: 'Iqama issuance', amount: 20 });
  } else {
    breakdown.push({ label: 'Iqama renewal (from year 2)', amount: 20 });
    breakdown.push({ label: 'Civil ID card', amount: 3 });
  }

  if (input.includeHealthInsurance) {
    breakdown.push({ label: 'Mandatory health insurance (annual, post-Dec 2025 rate)', amount: 100 });
  }

  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  return {
    breakdown, total, currency: 'KWD',
    note: "Standard private-sector employees (Article 18) don't typically pay a separate large annual residency fee themselves — it's bundled into the employer's work-permit process, which is why that category isn't shown as a standalone applicant cost here. Health insurance became mandatory for nearly all categories under the 2025/2026 reform.",
  };
}

// ---------------------------------------------------------------------------
// BAHRAIN — CPR (IGA) + Work Permit (LMRA)
// ---------------------------------------------------------------------------
export type BahrainDuration = 0.5 | 1 | 2;

export interface BahrainInput {
  durationYears: BahrainDuration;
  dependents: number;
}

const BAHRAIN_WORK_PERMIT: Record<BahrainDuration, number> = { 0.5: 52.5, 1: 105, 2: 210 };
const BAHRAIN_HEALTHCARE: Record<BahrainDuration, number> = { 0.5: 45, 1: 90, 2: 180 };

export function calculateBahrainResidency(input: BahrainInput): CostResult {
  const breakdown: CostLineItem[] = [
    { label: `Work permit renewal (${input.durationYears === 0.5 ? '6 months' : `${input.durationYears} year${input.durationYears > 1 ? 's' : ''}`})`, amount: BAHRAIN_WORK_PERMIT[input.durationYears] },
    { label: 'Basic healthcare fee', amount: BAHRAIN_HEALTHCARE[input.durationYears] },
    { label: 'CPR card renewal (flat rate)', amount: 10 },
  ];

  if (input.dependents > 0) {
    breakdown.push({ label: `Dependent permit renewal × ${input.dependents} (flat, regardless of your permit length)`, amount: 90 * input.dependents });
  }

  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  return {
    breakdown, total, currency: 'BHD',
    note: 'Work permit fees are usually paid by the employer; CPR and dependent fees are commonly the resident\'s own responsibility. Confirm the split with your employer.',
  };
}

// ---------------------------------------------------------------------------
// OMAN — Resident Card (ROP) + visa renewal
// ---------------------------------------------------------------------------
export type OmanCardDuration = 1 | 2 | 3;

export interface OmanInput {
  cardDurationYears: OmanCardDuration;
  workerType: 'catering' | 'nonCatering' | 'none';
  monthsLate: number;
}

const OMAN_CARD_FEE: Record<OmanCardDuration, number> = { 1: 5, 2: 10, 3: 15 };

export function calculateOmanResidency(input: OmanInput): CostResult {
  const breakdown: CostLineItem[] = [
    { label: `Resident card (${input.cardDurationYears} yr${input.cardDurationYears > 1 ? 's' : ''} validity)`, amount: OMAN_CARD_FEE[input.cardDurationYears] },
    { label: 'Visa/residency renewal fee', amount: 11 },
  ];

  if (input.workerType === 'catering') breakdown.push({ label: 'Medical fitness test (catering worker)', amount: 40 });
  if (input.workerType === 'nonCatering') breakdown.push({ label: 'Medical fitness test (non-catering worker)', amount: 30 });
  if (input.monthsLate > 0) breakdown.push({ label: `Late renewal fine (${input.monthsLate} months × RO 5)`, amount: input.monthsLate * 5 });

  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  return {
    breakdown, total, currency: 'OMR',
    note: 'Resident card renewal (ROP) is separate from any labor/work permit renewal with the Ministry of Labour — this covers the ID card and visa renewal fee only.',
  };
}

// lib/gulfGratuityRules.ts
// End-of-service gratuity/indemnity calculators for Oman, Kuwait, Bahrain, and Qatar.
// Mirrors the existing per-country pattern used in gcc-rules.ts (NOC checker).
//
// IMPORTANT: these formulas are drawn from each country's labor law as publicly
// reported. Bahrain in particular is mid-reform (a savings-based scheme has been
// discussed alongside the traditional formula) — treat these as estimates and
// verify with the relevant Ministry of Labour before relying on them for anything
// official.

export type GratuityCountry = 'oman' | 'kuwait' | 'bahrain' | 'qatar';

export type TerminationReason = 'resignation' | 'employer_termination' | 'contract_end';

export interface GratuityInput {
  monthlyBasicWage: number;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  unpaidDays: number;
  terminationReason: TerminationReason;
}

export interface GratuityResult {
  totalYearsOfService: number;
  grossGratuity: number;
  finalGratuity: number;
  cappedApplied: boolean;
  resignationReductionApplied: boolean;
  breakdownNote: string;
  currency: string;
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function yearsOfService(input: GratuityInput): number {
  const totalDays = daysBetween(input.startDate, input.endDate) - Math.max(0, input.unpaidDays);
  return Math.max(0, totalDays / 365.25);
}

// ---------------------------------------------------------------------------
// OMAN — Royal Decree 53/2023, Article 61, effective 31 July 2023.
// Old law (RD 35/2003): 15 days' basic wage/year for first 3 years, then 1
// month's basic wage/year. New law: 1 full month's basic wage per year of
// service, unified regardless of nationality, no minimum service requirement
// for the new-law portion. Service is split at the 31 July 2023 cutoff.
// ---------------------------------------------------------------------------
const OMAN_CUTOFF = '2023-07-31';

function calculateOman(input: GratuityInput): GratuityResult {
  const dailyRate = input.monthlyBasicWage / 30;
  const cutoff = new Date(OMAN_CUTOFF);
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  let preCutoffGratuity = 0;
  let postCutoffGratuity = 0;
  let note = '';

  if (start < cutoff) {
    const preCutoffEnd = end < cutoff ? end : cutoff;
    const preDays = daysBetween(input.startDate, preCutoffEnd.toISOString().slice(0, 10));
    const preYears = preDays / 365.25;
    const firstThree = Math.min(preYears, 3);
    const beyondThree = Math.max(0, preYears - 3);
    preCutoffGratuity = firstThree * 15 * dailyRate + beyondThree * input.monthlyBasicWage;
    note += `Service before 31 Jul 2023 calculated under the old formula (15 days/yr for first 3 years, then 1 month/yr). `;
  }

  if (end > cutoff) {
    const postCutoffStart = start > cutoff ? start : cutoff;
    const postDays = daysBetween(postCutoffStart.toISOString().slice(0, 10), input.endDate);
    const postYears = postDays / 365.25;
    postCutoffGratuity = postYears * input.monthlyBasicWage;
    note += `Service from 31 Jul 2023 onward calculated under the new formula (1 month's basic wage per year, no minimum service requirement).`;
  }

  const gross = preCutoffGratuity + postCutoffGratuity;
  // Under the new law, gratuity is paid regardless of termination reason.
  // Under the transitional old-law portion, resignation before 1 year (very
  // rare given eliminated minimum) doesn't reduce further — Oman's reform
  // removed most resignation penalties compared to other GCC states.
  return {
    totalYearsOfService: yearsOfService(input),
    grossGratuity: Math.round(gross),
    finalGratuity: Math.round(gross),
    cappedApplied: false,
    resignationReductionApplied: false,
    breakdownNote: note || 'All service falls under the new formula (1 month\'s basic wage per year).',
    currency: 'OMR',
  };
}

// ---------------------------------------------------------------------------
// KUWAIT — Kuwait Labour Law (Law No. 6 of 2010, Art. 51): 15 days' wage/year
// for first 5 years, 1 month's wage/year beyond that. Total gratuity is
// generally capped at 1.5 years' total wage. Resignation reduces the payout:
// under 3 years = none, 3–5 years = 1/2, 5–10 years = 2/3, 10+ years = full.
// ---------------------------------------------------------------------------
function calculateKuwait(input: GratuityInput): GratuityResult {
  const dailyRate = input.monthlyBasicWage / 30;
  const years = yearsOfService(input);

  const firstFive = Math.min(years, 5);
  const beyondFive = Math.max(0, years - 5);
  let gross = firstFive * 15 * dailyRate + beyondFive * input.monthlyBasicWage;

  const cap = input.monthlyBasicWage * 18; // ~1.5 years' wage
  const cappedApplied = gross > cap;
  gross = Math.min(gross, cap);

  let final = gross;
  let resignationReductionApplied = false;
  let note = '';

  if (input.terminationReason === 'resignation') {
    resignationReductionApplied = true;
    if (years < 3) {
      final = 0;
      note = 'Resignation with under 3 years of service typically forfeits gratuity entirely.';
    } else if (years < 5) {
      final = gross * 0.5;
      note = 'Resignation with 3–5 years of service typically reduces gratuity to half.';
    } else if (years < 10) {
      final = gross * (2 / 3);
      note = 'Resignation with 5–10 years of service typically reduces gratuity to two-thirds.';
    } else {
      note = 'Resignation with 10+ years of service is generally paid in full.';
    }
  } else {
    note = 'Termination by employer or natural contract end is generally paid in full.';
  }

  return {
    totalYearsOfService: years,
    grossGratuity: Math.round(gross),
    finalGratuity: Math.round(final),
    cappedApplied,
    resignationReductionApplied,
    breakdownNote: note,
    currency: 'KWD',
  };
}

// ---------------------------------------------------------------------------
// BAHRAIN — traditional formula: half a month's wage per year for the first 3
// years, 1 month's wage per year after that. Bahrain has been moving toward a
// savings-based/unemployment-insurance-style scheme (SIO reforms) — this
// remains the reported baseline formula, but verify current status before
// relying on it; this is the most likely of the four to have changed by the
// time you're reading this.
// ---------------------------------------------------------------------------
function calculateBahrain(input: GratuityInput): GratuityResult {
  const years = yearsOfService(input);
  const firstThree = Math.min(years, 3);
  const beyondThree = Math.max(0, years - 3);
  const gross = firstThree * 0.5 * input.monthlyBasicWage + beyondThree * input.monthlyBasicWage;

  let final = gross;
  let resignationReductionApplied = false;
  let note = 'Calculated under the traditional half-month/month formula.';

  if (input.terminationReason === 'resignation' && years < 3) {
    resignationReductionApplied = true;
    final = 0;
    note = 'Resignation with under 3 years of service typically forfeits gratuity entirely under the traditional formula.';
  }

  return {
    totalYearsOfService: years,
    grossGratuity: Math.round(gross),
    finalGratuity: Math.round(final),
    cappedApplied: false,
    resignationReductionApplied,
    breakdownNote: note + ' Bahrain has been reforming its end-of-service system (SIO-linked changes) — confirm current rules before relying on this figure.',
    currency: 'BHD',
  };
}

// ---------------------------------------------------------------------------
// QATAR — Qatar Labour Law No. 14 of 2004: 3 weeks' basic wage per year of
// service, the simplest formula of the four. Generally requires at least 1
// year of continuous service.
// ---------------------------------------------------------------------------
function calculateQatar(input: GratuityInput): GratuityResult {
  const dailyRate = input.monthlyBasicWage / 30;
  const years = yearsOfService(input);
  const gross = years * 21 * dailyRate; // 3 weeks = 21 days

  let final = gross;
  let note = "Calculated at 3 weeks' basic wage per year of service under Qatar Labour Law No. 14 of 2004.";
  let resignationReductionApplied = false;

  if (years < 1) {
    resignationReductionApplied = input.terminationReason === 'resignation';
    final = 0;
    note = 'Under 1 year of service generally does not qualify for end-of-service gratuity.';
  }

  return {
    totalYearsOfService: years,
    grossGratuity: Math.round(gross),
    finalGratuity: Math.round(final),
    cappedApplied: false,
    resignationReductionApplied,
    breakdownNote: note,
    currency: 'QAR',
  };
}

export interface CountryGratuityConfig {
  name: string;
  currency: string;
  calculate: (input: GratuityInput) => GratuityResult;
  legalBasis: string;
}

export const GULF_GRATUITY_RULES: Record<GratuityCountry, CountryGratuityConfig> = {
  oman: {
    name: 'Oman',
    currency: 'OMR',
    calculate: calculateOman,
    legalBasis: "Royal Decree 53/2023, Article 61 (new formula from 31 Jul 2023); Royal Decree 35/2003 (old formula, service before that date)",
  },
  kuwait: {
    name: 'Kuwait',
    currency: 'KWD',
    calculate: calculateKuwait,
    legalBasis: 'Kuwait Labour Law No. 6 of 2010, Article 51',
  },
  bahrain: {
    name: 'Bahrain',
    currency: 'BHD',
    calculate: calculateBahrain,
    legalBasis: "Bahrain Labour Law for the Private Sector (traditional formula; system under active SIO reform)",
  },
  qatar: {
    name: 'Qatar',
    currency: 'QAR',
    calculate: calculateQatar,
    legalBasis: 'Qatar Labour Law No. 14 of 2004',
  },
};

// lib/gulfLocalizationRules.ts
// Workforce nationalization (localization) quota reference data for Qatar,
// Oman, Kuwait, and Bahrain.
//
// IMPORTANT CALIBRATION NOTE: unlike Saudi Arabia's Nitaqat, none of these
// four countries run a public, per-company, color-coded tier lookup system.
// Their programs are real and legally enforced, but mechanically different —
// mostly percentage quotas checked administratively through the work-permit
// approval/renewal process, not something a company can "look up" the way
// Nitaqat's portal allows. So these tools are framed as compliance
// calculators (you enter your own workforce numbers), not company lookups.
//
// Where a country doesn't publish one clean national or sector percentage,
// that's reflected honestly below rather than invented.

export type LocalizationCountry = 'qatar' | 'oman' | 'kuwait' | 'bahrain';

export interface SectorTarget {
  sector: string;
  targetPercent?: number; // undefined = no single published figure, guidance-only
  note: string;
}

export interface LocalizationCountryConfig {
  name: string;
  programName: string;
  legalBasis: string;
  sectorTargets: SectorTarget[];
  enforcementNote: string;
  penaltyNote: string;
}

export const GULF_LOCALIZATION_RULES: Record<LocalizationCountry, LocalizationCountryConfig> = {
  qatar: {
    name: 'Qatar',
    programName: 'Qatarization',
    legalBasis: 'Qatarization Law No. 12 of 2024, effective April 2025',
    sectorTargets: [
      {
        sector: 'Private & mixed sector (national target)',
        targetPercent: 20,
        note: "Qatar's Ministry of Labour targets 20% Qatari participation in private and mixed-sector employment by 2030 — up from roughly 17% currently. This is the one clear published national figure across these four countries.",
      },
      {
        sector: 'Energy, aviation, finance, infrastructure (priority sectors)',
        targetPercent: 20,
        note: 'Same national target applies, but these sectors face more active Ministry of Labour field inspections under Law No. 12 of 2024.',
      },
    ],
    enforcementNote: 'Enforced through Ministry of Labour field inspections under Law No. 12 of 2024, which came into effect in April 2025.',
    penaltyNote: 'Fines range from QAR 10,000 to QAR 100,000 per violation, escalating for repeat violations, plus visa-processing restrictions and government-contract limitations for non-compliant firms.',
  },
  oman: {
    name: 'Oman',
    programName: 'Omanisation',
    legalBasis: "Ministry of Labour (MOL) foreign labour clearance system; Ministerial Decision 602/2025",
    sectorTargets: [
      {
        sector: 'Banking & financial services',
        targetPercent: 85,
        note: 'Reported range of 80–90%+ in customer-facing and administrative roles — the highest localization target of any sector in Oman.',
      },
      {
        sector: 'General private sector (typical baseline)',
        targetPercent: 35,
        note: 'Reported baseline commonly cited around 35% for many general private-sector activities, but your actual target is set per activity code by MOL and can differ — this is a rough baseline, not your specific figure.',
      },
    ],
    enforcementNote: "Enforced directly through MOL's foreign labour clearance system — your Omanisation ratio affects your ability to obtain, renew, or amend expatriate work visas, continuously, not just at annual review.",
    penaltyNote: 'Ministerial Decision 602/2025 gives compliant employers a 30% discount on expatriate work-permit fees; non-compliant employers face doubled fees.',
  },
  kuwait: {
    name: 'Kuwait',
    programName: 'Kuwaitization',
    legalBasis: "Set sector-by-sector by Kuwait's National Committee for the Organization of the Demographic Structure (Prime Ministerial Resolution No. 392)",
    sectorTargets: [
      {
        sector: 'Private sector (general)',
        targetPercent: undefined,
        note: "Kuwait doesn't publish one uniform private-sector percentage the way Qatar does. Quotas are set sector-by-sector and have been tightening since a policy update in October 2023. Confirm your specific sector's quota directly with your PRO or Kuwait's Public Authority of Manpower.",
      },
    ],
    enforcementNote: 'Enforced through the work-permit approval and renewal process rather than a single public target — sector committees set and adjust quotas administratively.',
    penaltyNote: 'Non-compliant firms risk restrictions on new work-permit issuance and renewals. Specific fine schedules vary by sector.',
  },
  bahrain: {
    name: 'Bahrain',
    programName: 'Bahrainisation',
    legalBasis: 'Labour Market Regulatory Authority (LMRA); Tamkeen-linked training and wage-support programs',
    sectorTargets: [
      {
        sector: 'Private sector (general)',
        targetPercent: undefined,
        note: "Bahrain leans more on skills development and training incentives through Tamkeen than on strict hard quotas, and generally has lower mandated percentages than its GCC neighbors. There isn't one clean published national number — confirm your specific requirement with LMRA.",
      },
    ],
    enforcementNote: 'Enforced by LMRA, with more emphasis on training and wage-support incentives (via Tamkeen) than blunt quota enforcement compared to other GCC states.',
    penaltyNote: "Specific fine schedules are set by LMRA and vary by sector — Bahrain relies more on positive incentives (subsidized training, wage support) than punitive fines relative to its neighbors.",
  },
};

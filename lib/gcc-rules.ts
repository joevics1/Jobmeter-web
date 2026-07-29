// lib/gcc-rules.ts
export interface UserInputs {
  contractType: string;
  monthsServed: number;
  status: string;
  sector: string;
  newSectorSame: boolean;
}

export interface EligibilityResult {
  verdict: string;
  canChange: boolean;
  summary: string;
  steps: string[];
  links: { name: string; url: string }[];
  specialNotes?: string;
  color: 'emerald' | 'amber' | 'red';
}

export const gccJobChangeRules = {
  uae: {
    country: "United Arab Emirates",
    generalRule: "NOC largely eliminated since 2022 for most professionals.",
    minimumMonths: 3,
    verdictBase: "You can generally change jobs without NOC",
    process: [
      "Receive formal job offer from new employer",
      "New employer initiates transfer via MoHRE portal",
      "Serve your notice period",
      "Complete visa cancellation and transfer"
    ],
    links: [
      { name: "MoHRE Official Portal", url: "https://www.mohre.gov.ae" },
      { name: "MOHRE Smart Services", url: "https://smart.mohre.gov.ae" }
    ]
  },
  ksa: {
    country: "Saudi Arabia",
    generalRule: "Transfers managed through Qiwa platform under Labor Reform.",
    minimumMonths: 12,
    verdictBase: "Eligible for transfer via Qiwa",
    process: [
      "New employer starts transfer request on Qiwa",
      "Provide digital consent",
      "Complete any required approvals",
      "Transfer Iqama to new sponsor"
    ],
    links: [
      { name: "Qiwa Platform", url: "https://qiwa.sa" }
    ]
  },
  qatar: {
    country: "Qatar",
    generalRule: "NOC abolished for most workers since 2020 reforms.",
    minimumMonths: 1,
    verdictBase: "NOC is not required in most cases",
    process: [
      "New employer applies for transfer",
      "Serve notice period",
      "Complete process via Ministry of Labour"
    ],
    links: [
      { name: "Ministry of Labour Qatar", url: "https://www.mol.gov.qa" }
    ]
  },
  kuwait: {
    country: "Kuwait",
    generalRule: "Still relatively restrictive under Kafala system.",
    minimumMonths: 36,
    verdictBase: "NOC is generally required",
    process: [
      "Obtain NOC from current employer",
      "New employer submits transfer application",
      "Complete medical & security clearance"
    ],
    links: []
  },
  bahrain: {
    country: "Bahrain",
    generalRule: "One of the most flexible GCC countries with Flexible Work Permits.",
    minimumMonths: 1,
    verdictBase: "High mobility available",
    process: [
      "Apply for transfer or Flexible Work Permit",
      "Complete LMRA procedures"
    ],
    links: [
      { name: "LMRA Bahrain", url: "https://www.lmra.bh" }
    ]
  },
  oman: {
    country: "Oman",
    generalRule: "NOC usually required unless contract is completed.",
    minimumMonths: 24,
    verdictBase: "NOC is typically required",
    process: [
      "Request NOC from current sponsor",
      "New employer submits transfer request",
      "Complete Ministry of Labour formalities"
    ],
    links: []
  }
};

export function calculateEligibility(inputs: UserInputs, countryCode: string): EligibilityResult {
  const rules = gccJobChangeRules[countryCode as keyof typeof gccJobChangeRules];
  
  if (!rules) {
    return {
      verdict: "Country not supported",
      canChange: false,
      summary: "Please select a valid GCC country.",
      steps: [],
      links: [],
      color: 'red'
    };
  }

  const { monthsServed, status, sector } = inputs;
  let canChange = false;
  let verdict = rules.verdictBase;
  let color: 'emerald' | 'amber' | 'red' = 'emerald';

  // Core Logic
  if (status === 'unpaid_wages' || status === 'expired') {
    canChange = true;
    verdict = `✅ Eligible due to ${status.replace('_', ' ')}`;
  } else if (monthsServed >= rules.minimumMonths) {
    canChange = true;
  } else {
    color = 'amber';
    verdict = `⏳ Need ${rules.minimumMonths} months or special condition`;
  }

  // Sector restrictions
  if (sector === 'domestic') {
    canChange = false;
    color = 'amber';
    verdict = "⚠️ Domestic workers follow different rules";
  }

  return {
    verdict,
    canChange,
    summary: rules.generalRule,
    steps: rules.process,
    links: rules.links,
    specialNotes: sector === 'domestic' ? "Domestic workers often need Ministry approval." : undefined,
    color
  };
}
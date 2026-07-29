// lib/equivalency-data.ts
export type Country = string;
export type DegreeLevel = 'High School / Grade 12' | 'Diploma' | 'Bachelor’s' | 'Master’s' | 'PhD / Doctorate' | 'Other';

export interface CountryData {
  name: string;
  uae: {
    baseScore: number;        // 0-100
    accreditationNote: string;
    commonIssues: string[];
    studyModeMultiplier: { [key: string]: number }; // Full-time, Online, etc.
    recommendedFirstStep: string;
  };
  saudi: {
    baseScore: number;
    accreditationNote: string;
    commonIssues: string[];
    studyModeMultiplier: { [key: string]: number };
    recommendedFirstStep: string;
  };
  highSchoolNotes?: string;
}

export const equivalencyData: Record<Country, CountryData> = {
  India: {
    name: "India",
    uae: {
      baseScore: 85,
      accreditationNote: "UGC + AICTE (for technical) recognition strongly preferred.",
      commonIssues: ["Internal vs External marks confusion (resolved in most cases)", "Distance education restrictions in regulated fields"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.75, "Distance": 0.65, "Blended": 0.85 },
      recommendedFirstStep: "DataFlow Primary Source Verification → MoHESR Recognition",
    },
    saudi: {
      baseScore: 78,
      accreditationNote: "UGC/AICTE accredited institutions generally accepted.",
      commonIssues: ["Regular attendance proof required", "Some distance programs restricted"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.60, "Distance": 0.50, "Blended": 0.75 },
      recommendedFirstStep: "Attestation via Indian authorities → Saudi Embassy",
    },
    highSchoolNotes: "CBSE / ISC / State Board certificates usually accepted after MoE equivalency.",
  },

  Pakistan: {
    name: "Pakistan",
    uae: {
      baseScore: 82,
      accreditationNote: "HEC recognized universities.",
      commonIssues: ["HEC attestation mandatory"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.70, "Distance": 0.60, "Blended": 0.80 },
      recommendedFirstStep: "DataFlow Verification",
    },
    saudi: {
      baseScore: 75,
      accreditationNote: "HEC recognition required.",
      commonIssues: ["Regular attendance documentation"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.55, "Distance": 0.45, "Blended": 0.70 },
      recommendedFirstStep: "HEC + MOFA Pakistan → Saudi Cultural Attaché",
    },
  },

  Nigeria: {
    name: "Nigeria",
    uae: {
      baseScore: 78,
      accreditationNote: "NUC (National Universities Commission) accredited institutions.",
      commonIssues: ["Verification delays common due to university response time", "Some private institutions face extra scrutiny"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.65, "Distance": 0.55, "Blended": 0.75 },
      recommendedFirstStep: "DataFlow Verification (longer processing for Nigerian institutions)",
    },
    saudi: {
      baseScore: 72,
      accreditationNote: "NUC accredited.",
      commonIssues: ["Regular attendance proof", "Transcript authenticity"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.50, "Distance": 0.40, "Blended": 0.65 },
      recommendedFirstStep: "Federal Ministry of Education attestation",
    },
  },

  Egypt: {
    name: "Egypt",
    uae: {
      baseScore: 88,
      accreditationNote: "Supreme Council of Universities recognized.",
      commonIssues: ["Fewer issues compared to others"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.80, "Distance": 0.70, "Blended": 0.85 },
      recommendedFirstStep: "DataFlow Verification",
    },
    saudi: {
      baseScore: 85,
      accreditationNote: "Strong recognition historically.",
      commonIssues: ["Arabic documents need translation"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.70, "Distance": 0.60, "Blended": 0.80 },
      recommendedFirstStep: "Egyptian Ministry of Higher Education attestation",
    },
  },

  Philippines: {
    name: "Philippines",
    uae: {
      baseScore: 84,
      accreditationNote: "CHED recognized.",
      commonIssues: ["Nursing & healthcare degrees often need extra board verification"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.75, "Distance": 0.65, "Blended": 0.80 },
      recommendedFirstStep: "DataFlow",
    },
    saudi: {
      baseScore: 80,
      accreditationNote: "CHED accredited.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.65, "Distance": 0.55, "Blended": 0.75 },
      recommendedFirstStep: "CHED + DFA attestation",
    },
  },

  Kenya: {
    name: "Kenya",
    uae: {
      baseScore: 76,
      accreditationNote: "Commission for University Education (CUE).",
      commonIssues: ["Verification can take longer"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.60, "Distance": 0.50, "Blended": 0.70 },
      recommendedFirstStep: "DataFlow Verification",
    },
    saudi: {
      baseScore: 70,
      accreditationNote: "CUE recognized.",
      commonIssues: ["Regular attendance required"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.45, "Distance": 0.40, "Blended": 0.60 },
      recommendedFirstStep: "Kenyan Ministry attestation",
    },
  },

  Bangladesh: {
    name: "Bangladesh",
    uae: {
      baseScore: 79,
      accreditationNote: "UGC Bangladesh.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.65, "Distance": 0.55, "Blended": 0.75 },
      recommendedFirstStep: "DataFlow",
    },
    saudi: {
      baseScore: 73,
      accreditationNote: "UGC recognized.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.55, "Distance": 0.45, "Blended": 0.70 },
      recommendedFirstStep: "UGC + MOFA Bangladesh",
    },
  },

  Jordan: {
    name: "Jordan",
    uae: {
      baseScore: 90,
      accreditationNote: "Very good recognition.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.85, "Distance": 0.75, "Blended": 0.90 },
      recommendedFirstStep: "DataFlow",
    },
    saudi: {
      baseScore: 87,
      accreditationNote: "Strong recognition.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.75, "Distance": 0.65, "Blended": 0.85 },
      recommendedFirstStep: "Jordanian Ministry attestation",
    },
  },

  Lebanon: {
    name: "Lebanon",
    uae: {
      baseScore: 89,
      accreditationNote: "Strong historical recognition.",
      commonIssues: ["Current situation may cause delays in verification"],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.80, "Distance": 0.70, "Blended": 0.85 },
      recommendedFirstStep: "DataFlow",
    },
    saudi: {
      baseScore: 84,
      accreditationNote: "Good recognition.",
      commonIssues: [],
      studyModeMultiplier: { "Full-time": 1.0, "Online": 0.70, "Distance": 0.60, "Blended": 0.80 },
      recommendedFirstStep: "Lebanese authorities attestation",
    },
  },
};

export const popularCountries = Object.keys(equivalencyData);

export function calculateLikelihood(
  country: Country,
  degreeLevel: DegreeLevel,
  studyMode: string,
  accredited: string,
  target: 'UAE' | 'Saudi' | 'Both'
) {
  const data = equivalencyData[country];
  if (!data) return { likelihood: 'Medium', score: 65, notes: [], checklist: [], nextSteps: '' };

  let score = target === 'UAE' ? data.uae.baseScore : data.saudi.baseScore;
  if (target === 'Both') score = Math.floor((data.uae.baseScore + data.saudi.baseScore) / 2);

  // Study mode impact
  const multiplier = (target === 'UAE' ? data.uae.studyModeMultiplier : data.saudi.studyModeMultiplier)[studyMode] || 0.7;
  score = Math.floor(score * multiplier);

  // Accreditation impact
  if (accredited === 'Yes') score = Math.min(98, score + 8);
  else if (accredited === 'Unsure') score = Math.max(50, score - 10);

  // Degree level minor adjustment
  if (degreeLevel === 'PhD / Doctorate') score = Math.min(98, score + 5);
  if (degreeLevel === 'High School / Grade 12') score = Math.max(65, Math.floor(score * 0.92));

  let likelihood = 'Medium';
  if (score >= 85) likelihood = 'High';
  else if (score >= 70) likelihood = 'Good';
  else if (score < 55) likelihood = 'Low';

  const notes = [];
  const countryData = target === 'UAE' ? data.uae : data.saudi;
  
  if (studyMode !== 'Full-time') {
    notes.push(`⚠️ ${studyMode} mode may face additional scrutiny or require extra proof of equivalence.`);
  }
  notes.push(...countryData.commonIssues.map(issue => `• ${issue}`));

  const checklist = [
    "Original degree certificate + full transcripts",
    target === 'UAE' ? "DataFlow / QuadraBay Primary Source Verification" : "Home country Ministry + MOFA attestation",
    "Passport copy",
    accredited === 'Yes' ? "Accreditation / recognition letter from home authority" : "Proof of institution accreditation",
    studyMode !== 'Full-time' ? "Proof of physical attendance or university recognition letter" : null,
  ].filter(Boolean);

  const nextSteps = target === 'UAE' 
    ? "Start with DataFlow verification → Apply for MoHESR Recognition Report (usually 2 working days after verification)"
    : "Complete full attestation chain → Submit to Saudi MOE for equivalency";

  return { likelihood, score: Math.min(99, Math.max(40, score)), notes, checklist, nextSteps };
}
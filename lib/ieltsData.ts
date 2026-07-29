// lib/ieltsData.ts

export type IELTSRequirement = {
  jobTitle: string;
  country: string;
  minOverall: number | string | null;
  minBand: string | null;
  isMandatory: boolean | string; // true, false, or "Employer Dependent"
  visaTypeOrRegulatoryBody: string;
  notes: string;
  officialSource?: string;
  lastUpdated: string;
  alternatives?: string[]; // OET, TOEFL, etc.
};

export const ieltsData: IELTSRequirement[] = [
  // ====================== UAE ======================
  {
    jobTitle: "Registered Nurse",
    country: "UAE",
    minOverall: 5.0,
    minBand: "No specific per band (if required)",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / DOH / MOHAP (Unified PQR)",
    notes: "Mainly required if education was not in English. OET Grade C is widely accepted. International hospitals often request 6.0+.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026",
    alternatives: ["OET C+", "TOEFL iBT 79+"]
  },
  {
    jobTitle: "Specialist Nurse (ICU, ER, Oncology)",
    country: "UAE",
    minOverall: 5.5,
    minBand: "No specific per band",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / DOH",
    notes: "Higher scores preferred in premium facilities.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026",
    alternatives: ["OET"]
  },
  {
    jobTitle: "Midwife",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / MOHAP",
    notes: "Allied Health PQR standards apply.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Pharmacist",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / DOH",
    notes: "Required if degree is from non-English speaking country.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Medical Laboratory Technologist",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA",
    notes: "Allied health licensing requirements.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Radiographer / Radiologic Technologist",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA",
    notes: "Standard for imaging professionals.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Physiotherapist",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / DOH",
    notes: "Allied health licensing.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Dentist (General)",
    country: "UAE",
    minOverall: 5.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA",
    notes: "Prometric + credentials evaluation.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Physician (General Practitioner)",
    country: "UAE",
    minOverall: 6.0,
    minBand: "No band below 6.0",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "DHA / DOH",
    notes: "Higher for specialists. English-medium graduates often exempt.",
    officialSource: "https://www.dha.gov.ae",
    lastUpdated: "May 2026",
    alternatives: ["OET B"]
  },
  {
    jobTitle: "Secondary School Teacher (English)",
    country: "UAE",
    minOverall: 7.0,
    minBand: "No band below 6.0",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "MOE / Emirate Licensing",
    notes: "High standard for English teachers.",
    officialSource: "https://www.moe.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Secondary School Teacher (Science/Maths)",
    country: "UAE",
    minOverall: 6.0,
    minBand: "No band below 5.5",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "MOE / Employer",
    notes: "Required when teaching in English.",
    officialSource: "https://www.moe.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Civil Engineer",
    country: "UAE",
    minOverall: 5.5,
    minBand: "No band below 5.0",
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Not mandatory for visa but common in government & large projects.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Mechanical Engineer",
    country: "UAE",
    minOverall: 5.5,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Especially in oil & gas and manufacturing.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Petroleum Engineer",
    country: "UAE",
    minOverall: 6.0,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE / ADNOC",
    notes: "Strong English required for multinational teams.",
    officialSource: "https://www.adnoc.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Software Engineer / Developer",
    country: "UAE",
    minOverall: 5.5,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE / Free Zones",
    notes: "Dubai Internet City & tech firms often request good communication skills.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Cybersecurity Analyst",
    country: "UAE",
    minOverall: 6.0,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "High demand in finance and government sectors.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Chartered Accountant",
    country: "UAE",
    minOverall: 5.5,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Big 4 firms often require strong English.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Project Manager (Construction)",
    country: "UAE",
    minOverall: 6.0,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Excellent communication is essential.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Hotel Manager",
    country: "UAE",
    minOverall: null,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "International chains may request IELTS 5.5–6.0.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },

  // ====================== SAUDI ARABIA ======================
  {
    jobTitle: "Registered Nurse",
    country: "Saudi Arabia",
    minOverall: null,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "SCFHS (Mumaris+)",
    notes: "No strict national IELTS requirement but most hospitals (especially international) request 5.5–6.5.",
    officialSource: "https://www.scfhs.org.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Specialist Physician",
    country: "Saudi Arabia",
    minOverall: 6.0,
    minBand: "No band below 5.5",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "SCFHS",
    notes: "Prometric + English proficiency for licensing.",
    officialSource: "https://www.scfhs.org.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Clinical Pharmacist",
    country: "Saudi Arabia",
    minOverall: null,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "SCFHS",
    notes: "Often requested by employers.",
    officialSource: "https://www.scfhs.org.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Civil Engineer",
    country: "Saudi Arabia",
    minOverall: null,
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "HRSD / Employer",
    notes: "Vision 2030 projects often require good English.",
    officialSource: "https://www.hrsd.gov.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Software Developer",
    country: "Saudi Arabia",
    minOverall: null,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "HRSD",
    notes: "Multinationals and NEOM projects may require IELTS 5.5–6.5.",
    officialSource: "https://www.hrsd.gov.sa",
    lastUpdated: "May 2026"
  },

  // ====================== QATAR ======================
  {
    jobTitle: "Registered Nurse",
    country: "Qatar",
    minOverall: 5.5,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "QCHP / DHP",
    notes: "English proficiency required for licensing.",
    officialSource: "https://www.qchp.org.qa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "General Practitioner",
    country: "Qatar",
    minOverall: 6.0,
    minBand: null,
    isMandatory: true,
    visaTypeOrRegulatoryBody: "QCHP",
    notes: "Demonstrated via test or education.",
    officialSource: "https://www.qchp.org.qa",
    lastUpdated: "May 2026"
  },

  // Add more entries for Oman, Kuwait, Bahrain similarly...

  // ====================== GENERAL / OTHER ROLES ======================
  {
    jobTitle: "HR Manager",
    country: "UAE",
    minOverall: 5.5,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Saudization / Emiratization context makes strong English valuable.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Marketing Manager",
    country: "UAE",
    minOverall: 6.0,
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE",
    notes: "Strong communication skills essential.",
    officialSource: "https://www.mohre.gov.ae",
    lastUpdated: "May 2026"
  },

  // ====================== OMAN ======================
  {
    jobTitle: "Registered Nurse",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Oman Ministry of Health / OMSB pathway",
    notes: "English-language testing is not uniformly mandated; some employers and MoH-linked SOPs accept Pearson VUE-style English-language checks instead of IELTS. International hires may still be asked for IELTS 6.0+ by hospitals, but this is employer-driven.",
    officialSource: "https://nursehubgcc.com/blogs/qualifications-to-work-nurse-oman",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Physician (General Practitioner)",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Oman Medical Specialty Board (OMSB)",
    notes: "OMSB does not impose a fixed IELTS requirement. For local employment, MoH and employers may ask for IELTS 6.0–6.5 depending on facility.",
    officialSource: "https://www.scribd.com/document/465973049/OMSB-Training-Abroad-Guide-5th-Edition",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Pharmacist",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Oman Ministry of Health",
    notes: "No published IELTS requirement. Large hospitals may ask for IELTS 5.5–6.0 for international hires.",
    officialSource: "https://nursehubgcc.com/blogs/qualifications-to-work-nurse-oman",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Civil Engineer",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Ministry of Manpower (MOM) / Employer Sponsorship",
    notes: "Requirements are based on qualifications and employer sponsorship. Some infrastructure firms may require IELTS 5.5–6.0.",
    officialSource: "https://ielts.idp.com/oman/about/who-accepts-ielts-scores",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Software Developer",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Manpower (MOM) / Employer Sponsorship",
    notes: "No national requirement. Multinationals and government-affiliated firms may ask for IELTS 5.5–6.5.",
    officialSource: "https://ielts.idp.com/oman/about/who-accepts-ielts-scores",
    lastUpdated: "May 2026"
  },

  // ====================== KUWAIT ======================
  {
    jobTitle: "Registered Nurse",
    country: "Kuwait",
    minOverall: 6.0,
    minBand: "No band below 5.5",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "Ministry of Health (MOH)",
    notes: "IELTS Academic 6.0 is required for many nursing recruitment pathways for non-Arabic-qualified applicants.",
    officialSource: "https://www.moh.gov.kw",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Physician (General Practitioner)",
    country: "Kuwait",
    minOverall: 6.0,
    minBand: "No band below 5.5",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "Ministry of Health (MOH)",
    notes: "IELTS 6.0 is commonly required for non-Arabic-speaking-country graduates.",
    officialSource: "https://www.moh.gov.kw",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Civil Engineer",
    country: "Kuwait",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Public Authority for Manpower (PAM) / Employer Sponsorship",
    notes: "No IELTS requirement in visa law. Some large projects may request 5.5–6.0.",
    officialSource: "https://ielts.idp.com/kuwait/about/which-test-do-i-take",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Software Developer",
    country: "Kuwait",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Public Authority for Manpower (PAM) / Employer Sponsorship",
    notes: "Employers may request IELTS 5.5–6.0 for English-dominant roles.",
    officialSource: "https://ielts.idp.com/kuwait/about/which-test-do-i-take",
    lastUpdated: "May 2026"
  },

  // ====================== BAHRAIN ======================
  {
    jobTitle: "Registered Nurse",
    country: "Bahrain",
    minOverall: 6.0,
    minBand: "No band below 5.5",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "National Health Regulatory Authority (NHRA)",
    notes: "NHRA requires English proficiency. IELTS Academic 6.0 or TOEFL commonly accepted.",
    officialSource: "https://www.nhra.bh",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Physician (General Practitioner)",
    country: "Bahrain",
    minOverall: 6.5,
    minBand: "No band below 6.0",
    isMandatory: true,
    visaTypeOrRegulatoryBody: "National Health Regulatory Authority (NHRA)",
    notes: "IELTS 6.5 often required for non-Arabic-speaking-country trained doctors.",
    officialSource: "https://www.nhra.bh",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Civil Engineer",
    country: "Bahrain",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: false,
    visaTypeOrRegulatoryBody: "Ministry of Labour (MLSD) / Employer Sponsorship",
    notes: "No national requirement. Some government-linked projects may request 5.5–6.0.",
    officialSource: "https://www.mlsd.gov.bh",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Software Developer",
    country: "Bahrain",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Labour (MLSD) / Employer Sponsorship",
    notes: "Employers in fintech and government-linked firms may request IELTS 5.5–6.5.",
    officialSource: "https://www.mlsd.gov.bh",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Accountant (Audit / Tax)",
    country: "Bahrain",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Labour (MLSD) / Employer Sponsorship",
    notes: "Big 4 firms often request IELTS 5.5–6.5 for English-language reporting.",
    officialSource: "https://www.mlsd.gov.bh",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Hotel Operations Manager",
    country: "Bahrain",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Labour (MLSD) / Employer Sponsorship",
    notes: "International hotel groups may require IELTS 5.5–6.0 for managerial roles.",
    officialSource: "https://www.mlsd.gov.bh",
    lastUpdated: "May 2026"
  },

  // ====================== OIL & GAS / SPECIALIZED ======================
  {
    jobTitle: "Drilling Engineer (Oil & Gas)",
    country: "UAE",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE / Employer Sponsorship",
    notes: "Employers may set internal benchmarks (often 5.5–6.0) for HSE and technical reporting.",
    officialSource: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-working-in-the-uae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Drilling Engineer (Oil & Gas)",
    country: "Saudi Arabia",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "HRSD / Employer Sponsorship",
    notes: "Large operators may require IELTS 5.5–6.0 for English-heavy technical roles.",
    officialSource: "https://www.hrsd.gov.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Drilling Engineer (Oil & Gas)",
    country: "Oman",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Manpower (MOM) / Employer Sponsorship",
    notes: "Employers may request IELTS 5.5–6.0 for safety and technical documentation.",
    officialSource: "https://ielts.idp.com/oman/about/who-accepts-ielts-scores",
    lastUpdated: "May 2026"
  },

  // ====================== IT / MANAGEMENT ======================
  {
    jobTitle: "IT Project Manager",
    country: "UAE",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "MOHRE / Employer Sponsorship",
    notes: "Multinational tech firms may require IELTS 6.0+ for client-facing senior roles.",
    officialSource: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-working-in-the-uae",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "IT Project Manager",
    country: "Saudi Arabia",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "HRSD / Employer Sponsorship",
    notes: "Employers may request IELTS 5.5–6.0 for English-language stakeholders.",
    officialSource: "https://www.hrsd.gov.sa",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "IT Project Manager",
    country: "Qatar",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Interior (MOI) / Employer Sponsorship",
    notes: "Some employers require IELTS 5.5–6.0 for English-heavy project management.",
    officialSource: "https://ielts.idp.com",
    lastUpdated: "May 2026"
  },
  {
    jobTitle: "Chartered Accountant",
    country: "Qatar",
    minOverall: "Not Required",
    minBand: null,
    isMandatory: "Employer Dependent",
    visaTypeOrRegulatoryBody: "Ministry of Labour / Employer Sponsorship",
    notes: "International firms often request strong English proficiency.",
    officialSource: "https://ielts.idp.com",
    lastUpdated: "May 2026"
  }
];

// Helper function for easy searching
export const getRequirements = (jobTitle: string, country: string) => {
  return ieltsData.filter(item =>
    item.country === country &&
    item.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
  );
};
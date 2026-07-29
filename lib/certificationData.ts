// lib/certificationData.ts

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  category: string;
  level: 'Foundation' | 'Core' | 'Advanced' | 'Specialized';
  costRangeUSD: string;
  durationMonths: number;
  validityYears: number;
  salaryUplift: string;
  gulfRecognition: string;
  prerequisites: string;
  description: string;
  providersGCC: string[];
  examFormat: string;
  roiScore: number;
};

export type Role = {
  id: string;
  title: string;
  sector: string;
  demandLevel: 'High' | 'Very High' | 'Medium';
  recommendedCerts: string[];
};

export const GCC_COUNTRIES = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] as const;

export const SECTORS = [
  'Project Management',
  'Finance & Accounting',
  'IT & Technology',
  'Cybersecurity',
  'Engineering',
  'HR & Talent Management',
  'Procurement & Supply Chain',
  'Oil & Gas / Energy',
  'Construction & Real Estate',
  'Marketing & Digital',
] as const;

export const allCertifications: Certification[] = [
  // ==================== PROJECT MANAGEMENT ====================
  {
    id: 'pmp', name: 'Project Management Professional (PMP)', issuer: 'PMI', category: 'Project Management',
    level: 'Core', costRangeUSD: '800-1800', durationMonths: 3, validityYears: 3, salaryUplift: '25-45%',
    gulfRecognition: 'Gold standard for Vision 2030, NEOM, and all giga-projects',
    prerequisites: '36 months project leadership + 35 PDUs', description: 'The most demanded certification in GCC infrastructure and transformation projects.',
    providersGCC: ['Knowledge Academy', 'Zabeel Institute', 'PMI Partners'], examFormat: '180 MCQs', roiScore: 9.8
  },
  {
    id: 'capm', name: 'Certified Associate in Project Management (CAPM)', issuer: 'PMI', category: 'Project Management',
    level: 'Foundation', costRangeUSD: '300-600', durationMonths: 2, validityYears: 5, salaryUplift: '15-25%',
    gulfRecognition: 'Ideal entry point for juniors in KSA/UAE projects', prerequisites: 'Secondary education',
    description: 'Foundation certification for aspiring project professionals.', providersGCC: ['Online + Local Centers'], examFormat: '150 MCQs', roiScore: 8.5
  },
  {
    id: 'pmi-rmp', name: 'PMI Risk Management Professional (PMI-RMP)', issuer: 'PMI', category: 'Project Management',
    level: 'Advanced', costRangeUSD: '700-1400', durationMonths: 2, validityYears: 3, salaryUplift: '20-35%',
    gulfRecognition: 'Critical for large-scale giga-projects', prerequisites: 'Project experience', description: 'Risk management specialization.',
    providersGCC: ['Knowledge Academy'], examFormat: 'Computer-based', roiScore: 9.2
  },
  {
    id: 'prince2', name: 'PRINCE2 Practitioner', issuer: 'AXELOS', category: 'Project Management',
    level: 'Core', costRangeUSD: '600-1200', durationMonths: 2, validityYears: 3, salaryUplift: '18-30%',
    gulfRecognition: 'Widely accepted in government and UK-linked projects', prerequisites: 'Foundation level', description: 'Process-based project management.',
    providersGCC: ['ILX Group'], examFormat: 'Objective testing', roiScore: 8.8
  },
  {
    id: 'pmi-acp', name: 'PMI Agile Certified Practitioner (PMI-ACP)', issuer: 'PMI', category: 'Project Management',
    level: 'Core', costRangeUSD: '500-1100', durationMonths: 2, validityYears: 3, salaryUplift: '22-38%',
    gulfRecognition: 'Rising demand with agile transformation', prerequisites: 'Agile experience', description: 'Agile project management.',
    providersGCC: ['Various'], examFormat: '120 MCQs', roiScore: 9.0
  },

  // ==================== FINANCE & ACCOUNTING ====================
  {
    id: 'acca', name: 'ACCA (Association of Chartered Certified Accountants)', issuer: 'ACCA', category: 'Finance & Accounting',
    level: 'Core', costRangeUSD: '1200-2800', durationMonths: 12, validityYears: 0, salaryUplift: '30-50%',
    gulfRecognition: 'Highly valued across UAE, KSA, and Qatar finance sectors', prerequisites: 'Degree or equivalent', description: 'Global professional accounting body.',
    providersGCC: ['BPP Dubai', 'Kaplan'], examFormat: 'Multiple papers', roiScore: 9.5
  },
  {
    id: 'cfa', name: 'Chartered Financial Analyst (CFA)', issuer: 'CFA Institute', category: 'Finance & Accounting',
    level: 'Advanced', costRangeUSD: '2500-5000', durationMonths: 18, validityYears: 0, salaryUplift: '35-60%',
    gulfRecognition: 'Preferred in investment banks and asset management in DIFC and Riyadh', prerequisites: 'Bachelor’s degree', description: 'Premier investment management credential.',
    providersGCC: ['CFA Society UAE'], examFormat: '3 Level Exams', roiScore: 9.7
  },
  {
    id: 'cma', name: 'Certified Management Accountant (CMA)', issuer: 'IMA', category: 'Finance & Accounting',
    level: 'Core', costRangeUSD: '800-1500', durationMonths: 6, validityYears: 3, salaryUplift: '25-40%',
    gulfRecognition: 'Strong demand in corporate finance and management accounting', prerequisites: 'Degree + experience', description: 'Management accounting and financial strategy.',
    providersGCC: ['Becker'], examFormat: 'Two parts', roiScore: 9.3
  },
  {
    id: 'cpa', name: 'Certified Public Accountant (CPA)', issuer: 'AICPA', category: 'Finance & Accounting',
    level: 'Advanced', costRangeUSD: '1500-3000', durationMonths: 8, validityYears: 0, salaryUplift: '28-45%',
    gulfRecognition: 'Valued in auditing and Big 4 firms', prerequisites: '150 credit hours', description: 'US professional accounting license.',
    providersGCC: ['Becker, Wiley'], examFormat: '4 sections', roiScore: 9.0
  },
  {
    id: 'cia', name: 'Certified Internal Auditor (CIA)', issuer: 'IIA', category: 'Finance & Accounting',
    level: 'Core', costRangeUSD: '800-1600', durationMonths: 6, validityYears: 3, salaryUplift: '22-38%',
    gulfRecognition: 'High demand in internal audit departments', prerequisites: 'Degree', description: 'Internal auditing standards.',
    providersGCC: ['Local partners'], examFormat: '3 parts', roiScore: 8.9
  },

  // ==================== IT & TECHNOLOGY ====================
  {
    id: 'aws-sa', name: 'AWS Certified Solutions Architect – Associate', issuer: 'AWS', category: 'IT & Technology',
    level: 'Core', costRangeUSD: '150-300', durationMonths: 2, validityYears: 3, salaryUplift: '25-45%',
    gulfRecognition: 'Extremely high demand due to cloud migration in GCC', prerequisites: 'Basic IT knowledge', description: 'Most popular cloud certification in the region.',
    providersGCC: ['AWS Official Partners'], examFormat: '65 MCQs', roiScore: 9.6
  },
  {
    id: 'azure-architect', name: 'Azure Solutions Architect Expert', issuer: 'Microsoft', category: 'IT & Technology',
    level: 'Advanced', costRangeUSD: '200-400', durationMonths: 3, validityYears: 2, salaryUplift: '30-50%',
    gulfRecognition: 'Strong in government and enterprise projects', prerequisites: 'Azure Administrator', description: 'Advanced Azure cloud architecture.',
    providersGCC: ['Microsoft Learning Partners'], examFormat: 'Case studies', roiScore: 9.4
  },
  {
    id: 'gcp-architect', name: 'Google Cloud Professional Cloud Architect', issuer: 'Google', category: 'IT & Technology',
    level: 'Core', costRangeUSD: '180-350', durationMonths: 2, validityYears: 2, salaryUplift: '24-42%',
    gulfRecognition: 'Growing fast in KSA digital transformation', prerequisites: 'Cloud experience', description: 'Google Cloud Platform architecture.',
    providersGCC: ['Google Cloud Partners'], examFormat: 'Multiple choice', roiScore: 9.1
  },
  {
    id: 'ckad', name: 'Certified Kubernetes Application Developer', issuer: 'CNCF', category: 'IT & Technology',
    level: 'Advanced', costRangeUSD: '300-500', durationMonths: 2, validityYears: 3, salaryUplift: '30-50%',
    gulfRecognition: 'High demand in DevOps and container roles', prerequisites: 'Kubernetes knowledge', description: 'Kubernetes application development.',
    providersGCC: ['Various'], examFormat: 'Performance-based', roiScore: 9.3
  },
  {
    id: 'itil', name: 'ITIL 4 Foundation', issuer: 'AXELOS', category: 'IT & Technology',
    level: 'Foundation', costRangeUSD: '400-800', durationMonths: 1, validityYears: 3, salaryUplift: '15-30%',
    gulfRecognition: 'Popular in IT service management', prerequisites: 'None',
    description: 'IT Service Management best practices.', providersGCC: ['Various'], examFormat: 'Multiple choice', roiScore: 8.7
  },

  // ==================== CYBERSECURITY ====================
  {
    id: 'cissp', name: 'CISSP', issuer: 'ISC²', category: 'Cybersecurity',
    level: 'Advanced', costRangeUSD: '800-1500', durationMonths: 4, validityYears: 3, salaryUplift: '30-55%',
    gulfRecognition: 'Top cybersecurity certification in the GCC', prerequisites: '5 years experience', description: 'Information security leadership.',
    providersGCC: ['EC-Council Partners'], examFormat: 'Adaptive', roiScore: 9.5
  },
  {
    id: 'ceh', name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', category: 'Cybersecurity',
    level: 'Core', costRangeUSD: '600-1200', durationMonths: 3, validityYears: 3, salaryUplift: '25-45%',
    gulfRecognition: 'High demand in banking and government', prerequisites: 'Networking knowledge', description: 'Ethical hacking and penetration testing.',
    providersGCC: ['Many local centers'], examFormat: 'MCQ + practical', roiScore: 9.2
  },
  {
    id: 'cism', name: 'CISM', issuer: 'ISACA', category: 'Cybersecurity',
    level: 'Advanced', costRangeUSD: '700-1400', durationMonths: 4, validityYears: 3, salaryUplift: '28-50%',
    gulfRecognition: 'Management level security certification', prerequisites: 'Security management experience', description: 'Information security management.',
    providersGCC: ['ISACA'], examFormat: '150 questions', roiScore: 9.4
  },

  // ==================== HR & TALENT MANAGEMENT ====================
  {
    id: 'cipd-l5', name: 'CIPD Level 5 Intermediate Diploma', issuer: 'CIPD', category: 'HR & Talent Management',
    level: 'Core', costRangeUSD: '1500-3000', durationMonths: 8, validityYears: 0, salaryUplift: '25-40%',
    gulfRecognition: 'Most recognized HR qualification in GCC', prerequisites: 'HR experience', description: 'People management and development.',
    providersGCC: ['Zabeel Institute'], examFormat: 'Assignments', roiScore: 9.4
  },
  {
    id: 'shrm-cp', name: 'SHRM Certified Professional (SHRM-CP)', issuer: 'SHRM', category: 'HR & Talent Management',
    level: 'Core', costRangeUSD: '600-1200', durationMonths: 3, validityYears: 3, salaryUplift: '20-35%',
    gulfRecognition: 'Popular in private sector and Saudization initiatives', prerequisites: 'HR knowledge', description: 'HR competency-based certification.',
    providersGCC: ['Local providers'], examFormat: 'MCQs', roiScore: 8.9
  },

  // ==================== PROCUREMENT & SUPPLY CHAIN ====================
  {
    id: 'cips-l6', name: 'CIPS Level 6 Professional Diploma', issuer: 'CIPS', category: 'Procurement & Supply Chain',
    level: 'Advanced', costRangeUSD: '1200-2500', durationMonths: 12, validityYears: 5, salaryUplift: '28-45%',
    gulfRecognition: 'Gold standard for procurement in GCC logistics and construction', prerequisites: 'Prior CIPS levels', description: 'Strategic procurement management.',
    providersGCC: ['WingsWay Training', 'Zabeel'], examFormat: 'Exams + assignments', roiScore: 9.6
  },
  {
    id: 'cscp', name: 'Certified Supply Chain Professional (CSCP)', issuer: 'APICS', category: 'Procurement & Supply Chain',
    level: 'Core', costRangeUSD: '800-1500', durationMonths: 6, validityYears: 3, salaryUplift: '22-38%',
    gulfRecognition: 'Strong for supply chain roles in KSA and UAE', prerequisites: 'Supply chain experience', description: 'End-to-end supply chain management.',
    providersGCC: ['Local APICS partners'], examFormat: 'Computer-based', roiScore: 9.0
  },

  // ==================== ENGINEERING ====================
  {
    id: 'leed', name: 'LEED Green Associate', issuer: 'USGBC', category: 'Engineering',
    level: 'Core', costRangeUSD: '300-600', durationMonths: 2, validityYears: 2, salaryUplift: '15-30%',
    gulfRecognition: 'Highly valued in sustainable construction across UAE and KSA', prerequisites: 'None',
    description: 'Sustainability and green building certification.', providersGCC: ['USGBC Partners Dubai'], examFormat: 'Multiple choice', roiScore: 8.7
  },
  {
    id: 'sce', name: 'Saudi Council of Engineers Registration', issuer: 'SCE', category: 'Engineering',
    level: 'Foundation', costRangeUSD: '200-500', durationMonths: 1, validityYears: 5, salaryUplift: '10-25%',
    gulfRecognition: 'Mandatory for practicing engineers in KSA', prerequisites: 'Engineering degree',
    description: 'Local professional engineering license.', providersGCC: ['Saudi Council of Engineers'], examFormat: 'Interview + documents', roiScore: 8.8
  },

  // ==================== OIL & GAS / ENERGY ====================
  {
    id: 'nebosh', name: 'NEBOSH International General Certificate', issuer: 'NEBOSH', category: 'Oil & Gas / Energy',
    level: 'Core', costRangeUSD: '800-1500', durationMonths: 3, validityYears: 0, salaryUplift: '20-35%',
    gulfRecognition: 'Essential safety certification in Oil & Gas sector', prerequisites: 'None',
    description: 'Occupational health and safety.', providersGCC: ['British Safety Council'], examFormat: 'Exams', roiScore: 9.1
  },
  {
    id: 'iosh', name: 'IOSH Managing Safely', issuer: 'IOSH', category: 'Oil & Gas / Energy',
    level: 'Foundation', costRangeUSD: '400-800', durationMonths: 1, validityYears: 3, salaryUplift: '12-25%',
    gulfRecognition: 'Widely required in energy and construction', prerequisites: 'None',
    description: 'Safety management for supervisors.', providersGCC: ['Local training centers'], examFormat: 'Project + exam', roiScore: 8.6
  },

  // ==================== CONSTRUCTION & REAL ESTATE ====================
  {
    id: 'rics', name: 'RICS Professional Qualification', issuer: 'RICS', category: 'Construction & Real Estate',
    level: 'Advanced', costRangeUSD: '1500-3500', durationMonths: 12, validityYears: 0, salaryUplift: '25-45%',
    gulfRecognition: 'Gold standard for quantity surveyors and real estate professionals', prerequisites: 'Relevant degree',
    description: 'Chartered surveying qualification.', providersGCC: ['RICS Accredited Partners'], examFormat: 'Competency assessment', roiScore: 9.2
  },

  // ==================== MARKETING & DIGITAL ====================
  {
    id: 'google-ads', name: 'Google Ads Certification', issuer: 'Google', category: 'Marketing & Digital',
    level: 'Foundation', costRangeUSD: 'Free-150', durationMonths: 1, validityYears: 1, salaryUplift: '10-25%',
    gulfRecognition: 'Very useful for digital marketing roles in GCC', prerequisites: 'None',
    description: 'Paid advertising on Google platforms.', providersGCC: ['Google Skillshop'], examFormat: 'Online assessment', roiScore: 8.2
  },
  {
    id: 'facebook-blueprint', name: 'Meta Blueprint Certification', issuer: 'Meta', category: 'Marketing & Digital',
    level: 'Foundation', costRangeUSD: 'Free-200', durationMonths: 1, validityYears: 1, salaryUplift: '12-28%',
    gulfRecognition: 'High demand for social media marketing', prerequisites: 'None',
    description: 'Facebook & Instagram advertising.', providersGCC: ['Meta Blueprint'], examFormat: 'Online', roiScore: 8.4
  },
  {
    id: 'google-analytics', name: 'Google Analytics Individual Qualification', issuer: 'Google', category: 'Marketing & Digital',
    level: 'Core', costRangeUSD: 'Free-100', durationMonths: 1, validityYears: 1, salaryUplift: '15-30%',
    gulfRecognition: 'Essential for data-driven marketing roles', prerequisites: 'None',
    description: 'Web analytics and data interpretation.', providersGCC: ['Google Skillshop'], examFormat: 'Online exam', roiScore: 8.8
  },

  // ==================== ADDITIONAL CERTIFICATIONS ====================
  {
    id: 'six-sigma', name: 'Six Sigma Green Belt', issuer: 'ASQ', category: 'Cross-Cutting',
    level: 'Core', costRangeUSD: '500-1200', durationMonths: 3, validityYears: 3, salaryUplift: '18-35%',
    gulfRecognition: 'Strong in process improvement and quality roles', prerequisites: 'Basic statistics',
    description: 'Process improvement methodology.', providersGCC: ['ASQ Partners'], examFormat: 'Exam + project', roiScore: 9.0
  }
];

export const allRoles: Role[] = [
  // Project Management
  { id: 'pm1', title: 'Project Manager', sector: 'Project Management', demandLevel: 'Very High', recommendedCerts: ['pmp', 'pmi-rmp'] },
  { id: 'pm2', title: 'Senior Project Manager', sector: 'Project Management', demandLevel: 'Very High', recommendedCerts: ['pmp', 'prince2'] },
  { id: 'pm3', title: 'Program Manager', sector: 'Project Management', demandLevel: 'Very High', recommendedCerts: ['pmp'] },
  { id: 'pm4', title: 'Project Coordinator', sector: 'Project Management', demandLevel: 'High', recommendedCerts: ['capm'] },
  { id: 'pm5', title: 'Project Director', sector: 'Project Management', demandLevel: 'Very High', recommendedCerts: ['pmp', 'pmi-rmp'] },

  // Finance & Accounting
  { id: 'fa1', title: 'Financial Analyst', sector: 'Finance & Accounting', demandLevel: 'Very High', recommendedCerts: ['cfa', 'acca'] },
  { id: 'fa2', title: 'Finance Manager', sector: 'Finance & Accounting', demandLevel: 'Very High', recommendedCerts: ['acca', 'cma'] },
  { id: 'fa3', title: 'Internal Auditor', sector: 'Finance & Accounting', demandLevel: 'High', recommendedCerts: ['cia', 'cpa'] },
  { id: 'fa4', title: 'Finance Controller', sector: 'Finance & Accounting', demandLevel: 'Very High', recommendedCerts: ['acca', 'cpa'] },
  { id: 'fa5', title: 'Investment Analyst', sector: 'Finance & Accounting', demandLevel: 'High', recommendedCerts: ['cfa'] },
  { id: 'fa6', title: 'Treasury Manager', sector: 'Finance & Accounting', demandLevel: 'High', recommendedCerts: ['cfa'] },

  // IT & Technology
  { id: 'it1', title: 'Cloud Solutions Architect', sector: 'IT & Technology', demandLevel: 'Very High', recommendedCerts: ['aws-sa', 'azure-architect'] },
  { id: 'it2', title: 'DevOps Engineer', sector: 'IT & Technology', demandLevel: 'Very High', recommendedCerts: ['ckad'] },
  { id: 'it3', title: 'Software Engineer', sector: 'IT & Technology', demandLevel: 'High', recommendedCerts: ['aws-sa'] },
  { id: 'it4', title: 'Data Scientist', sector: 'IT & Technology', demandLevel: 'Very High', recommendedCerts: ['google-analytics'] },
  { id: 'it5', title: 'IT Project Manager', sector: 'IT & Technology', demandLevel: 'Very High', recommendedCerts: ['pmp', 'aws-sa'] },
  { id: 'it6', title: 'Systems Administrator', sector: 'IT & Technology', demandLevel: 'High', recommendedCerts: ['itil'] },

  // Cybersecurity
  { id: 'cy1', title: 'Cybersecurity Analyst', sector: 'Cybersecurity', demandLevel: 'Very High', recommendedCerts: ['ceh', 'cissp'] },
  { id: 'cy2', title: 'Information Security Manager', sector: 'Cybersecurity', demandLevel: 'Very High', recommendedCerts: ['cism', 'cissp'] },
  { id: 'cy3', title: 'Penetration Tester', sector: 'Cybersecurity', demandLevel: 'High', recommendedCerts: ['ceh'] },
  { id: 'cy4', title: 'Security Operations Center Analyst', sector: 'Cybersecurity', demandLevel: 'Very High', recommendedCerts: ['ceh'] },

  // Engineering
  { id: 'eng1', title: 'Civil Engineer', sector: 'Engineering', demandLevel: 'Very High', recommendedCerts: ['leed', 'pmp'] },
  { id: 'eng2', title: 'Mechanical Engineer', sector: 'Engineering', demandLevel: 'High', recommendedCerts: ['pmp'] },
  { id: 'eng3', title: 'Electrical Engineer', sector: 'Engineering', demandLevel: 'Very High', recommendedCerts: ['pmp'] },
  { id: 'eng4', title: 'Structural Engineer', sector: 'Engineering', demandLevel: 'Very High', recommendedCerts: ['pmp', 'leed'] },
  { id: 'eng5', title: 'Environmental Engineer', sector: 'Engineering', demandLevel: 'High', recommendedCerts: ['leed'] },

  // HR & Talent Management
  { id: 'hr1', title: 'HR Manager', sector: 'HR & Talent Management', demandLevel: 'Very High', recommendedCerts: ['cipd-l5', 'shrm-cp'] },
  { id: 'hr2', title: 'Talent Acquisition Manager', sector: 'HR & Talent Management', demandLevel: 'High', recommendedCerts: ['cipd-l5'] },
  { id: 'hr3', title: 'Learning & Development Manager', sector: 'HR & Talent Management', demandLevel: 'High', recommendedCerts: ['cipd-l5'] },
  { id: 'hr4', title: 'HR Business Partner', sector: 'HR & Talent Management', demandLevel: 'Very High', recommendedCerts: ['cipd-l5'] },

  // Procurement & Supply Chain
  { id: 'proc1', title: 'Procurement Manager', sector: 'Procurement & Supply Chain', demandLevel: 'Very High', recommendedCerts: ['cips-l6'] },
  { id: 'proc2', title: 'Senior Procurement Specialist', sector: 'Procurement & Supply Chain', demandLevel: 'Very High', recommendedCerts: ['cips-l6'] },
  { id: 'proc3', title: 'Supply Chain Manager', sector: 'Procurement & Supply Chain', demandLevel: 'High', recommendedCerts: ['cips-l6', 'cscp'] },
  { id: 'proc4', title: 'Contracts Manager', sector: 'Procurement & Supply Chain', demandLevel: 'Very High', recommendedCerts: ['cips-l6', 'pmp'] },
  { id: 'proc5', title: 'Purchasing Manager', sector: 'Procurement & Supply Chain', demandLevel: 'High', recommendedCerts: ['cips-l6'] },
  { id: 'proc6', title: 'Category Manager', sector: 'Procurement & Supply Chain', demandLevel: 'High', recommendedCerts: ['cips-l6'] },
  { id: 'proc7', title: 'Logistics Manager', sector: 'Procurement & Supply Chain', demandLevel: 'High', recommendedCerts: ['cscp'] },
  { id: 'proc8', title: 'Strategic Sourcing Manager', sector: 'Procurement & Supply Chain', demandLevel: 'Very High', recommendedCerts: ['cips-l6'] },

  // Oil & Gas / Energy
  { id: 'og1', title: 'Petroleum Engineer', sector: 'Oil & Gas / Energy', demandLevel: 'Very High', recommendedCerts: ['pmp', 'nebosh'] },
  { id: 'og2', title: 'Drilling Engineer', sector: 'Oil & Gas / Energy', demandLevel: 'High', recommendedCerts: ['pmp'] },
  { id: 'og3', title: 'HSSE Manager', sector: 'Oil & Gas / Energy', demandLevel: 'Very High', recommendedCerts: ['nebosh'] },
  { id: 'og4', title: 'Reservoir Engineer', sector: 'Oil & Gas / Energy', demandLevel: 'High', recommendedCerts: ['pmp'] },

  // Construction & Real Estate
  { id: 'const1', title: 'Civil Site Engineer', sector: 'Construction & Real Estate', demandLevel: 'Very High', recommendedCerts: ['leed', 'pmp'] },
  { id: 'const2', title: 'Project Director - Construction', sector: 'Construction & Real Estate', demandLevel: 'Very High', recommendedCerts: ['pmp'] },
  { id: 'const3', title: 'Quantity Surveyor', sector: 'Construction & Real Estate', demandLevel: 'High', recommendedCerts: ['rics', 'pmp'] },
  { id: 'const4', title: 'Construction Manager', sector: 'Construction & Real Estate', demandLevel: 'Very High', recommendedCerts: ['pmp'] },

  // Marketing & Digital
  { id: 'mkt1', title: 'Digital Marketing Manager', sector: 'Marketing & Digital', demandLevel: 'High', recommendedCerts: ['google-ads', 'facebook-blueprint'] },
  { id: 'mkt2', title: 'SEO Specialist', sector: 'Marketing & Digital', demandLevel: 'Medium', recommendedCerts: ['google-analytics'] },
  { id: 'mkt3', title: 'Content Marketing Manager', sector: 'Marketing & Digital', demandLevel: 'Medium', recommendedCerts: ['google-analytics'] },
];

// ==================== ADDITIONAL GENERAL & HIGH-DEMAND CERTIFICATIONS (Batch 2) ================
export const batch2Certifications: Certification[] = [
  {
    id: 'google-data-analytics', name: 'Google Data Analytics Professional Certificate', issuer: 'Google', category: 'IT & Technology',
    level: 'Foundation', costRangeUSD: 'Free-300', durationMonths: 3, validityYears: 0, salaryUplift: '18-35%',
    gulfRecognition: 'Rising demand in data-driven roles across GCC', prerequisites: 'None',
    description: 'Comprehensive data analytics and visualization skills.', providersGCC: ['Coursera + Local Partners'], examFormat: 'Course assessments', roiScore: 8.9
  },
  {
    id: 'pmp-sp', name: 'PMI Scheduling Professional (PMI-SP)', issuer: 'PMI', category: 'Project Management',
    level: 'Advanced', costRangeUSD: '600-1300', durationMonths: 2, validityYears: 3, salaryUplift: '20-38%',
    gulfRecognition: 'Highly valued for planning roles in giga-projects', prerequisites: 'Project experience',
    description: 'Advanced project scheduling and time management.', providersGCC: ['Knowledge Academy'], examFormat: 'Computer-based', roiScore: 9.1
  },
  {
    id: 'frm', name: 'Financial Risk Manager (FRM)', issuer: 'GARP', category: 'Finance & Accounting',
    level: 'Advanced', costRangeUSD: '800-1800', durationMonths: 6, validityYears: 0, salaryUplift: '25-45%',
    gulfRecognition: 'Important for risk management in banks and finance firms', prerequisites: 'Degree',
    description: 'Global standard in financial risk management.', providersGCC: ['GARP Partners'], examFormat: 'Two parts', roiScore: 9.2
  },
  {
    id: 'comp-tia-sec', name: 'CompTIA Security+', issuer: 'CompTIA', category: 'Cybersecurity',
    level: 'Foundation', costRangeUSD: '300-600', durationMonths: 2, validityYears: 3, salaryUplift: '15-30%',
    gulfRecognition: 'Excellent entry-level cybersecurity certification', prerequisites: 'Basic IT knowledge',
    description: 'Core cybersecurity skills and best practices.', providersGCC: ['Local training centers'], examFormat: 'Multiple choice', roiScore: 8.8
  },
  {
    id: 'aws-devops', name: 'AWS Certified DevOps Engineer – Professional', issuer: 'AWS', category: 'IT & Technology',
    level: 'Advanced', costRangeUSD: '300-500', durationMonths: 3, validityYears: 3, salaryUplift: '30-50%',
    gulfRecognition: 'Premium certification for senior DevOps roles', prerequisites: 'AWS Associate',
    description: 'Advanced DevOps practices on AWS.', providersGCC: ['AWS Partners'], examFormat: 'Multiple choice + labs', roiScore: 9.5
  },
  {
    id: 'cbap', name: 'Certified Business Analysis Professional (CBAP)', issuer: 'IIBA', category: 'Project Management',
    level: 'Advanced', costRangeUSD: '600-1200', durationMonths: 4, validityYears: 3, salaryUplift: '22-40%',
    gulfRecognition: 'Strong demand in business transformation projects', prerequisites: 'Work experience',
    description: 'Business analysis and requirements management.', providersGCC: ['IIBA Partners'], examFormat: 'Case study based', roiScore: 9.0
  },
  {
    id: 'chrm', name: 'Certified Human Resources Manager (CHRM)', issuer: 'Various', category: 'HR & Talent Management',
    level: 'Core', costRangeUSD: '400-900', durationMonths: 2, validityYears: 2, salaryUplift: '18-32%',
    gulfRecognition: 'Useful for mid-level HR roles in GCC', prerequisites: 'HR experience',
    description: 'Advanced HR management practices.', providersGCC: ['Zabeel Institute'], examFormat: 'Exam', roiScore: 8.5
  },
  {
    id: 'cismp', name: 'CIPS Level 4 Diploma in Procurement', issuer: 'CIPS', category: 'Procurement & Supply Chain',
    level: 'Foundation', costRangeUSD: '800-1500', durationMonths: 6, validityYears: 5, salaryUplift: '20-35%',
    gulfRecognition: 'Entry to mid-level procurement qualification', prerequisites: 'None',
    description: 'Procurement and supply fundamentals.', providersGCC: ['WingsWay Training'], examFormat: 'Exams', roiScore: 9.0
  },
  {
    id: 'azure-fundamentals', name: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', category: 'IT & Technology',
    level: 'Foundation', costRangeUSD: '100-200', durationMonths: 1, validityYears: 1, salaryUplift: '12-25%',
    gulfRecognition: 'Great starting point for Microsoft cloud careers', prerequisites: 'None',
    description: 'Cloud concepts and Azure services.', providersGCC: ['Microsoft Learning'], examFormat: 'Multiple choice', roiScore: 8.6
  },
  {
    id: 'lean-six-sigma', name: 'Lean Six Sigma Black Belt', issuer: 'ASQ / IASSC', category: 'Cross-Cutting',
    level: 'Advanced', costRangeUSD: '800-2000', durationMonths: 4, validityYears: 3, salaryUplift: '25-45%',
    gulfRecognition: 'Highly respected in quality and operations roles', prerequisites: 'Green Belt',
    description: 'Advanced process excellence and leadership.', providersGCC: ['Local partners'], examFormat: 'Exam + project', roiScore: 9.3
  },
  {
    id: 'toefl', name: 'TOEFL iBT', issuer: 'ETS', category: 'Cross-Cutting',
    level: 'Foundation', costRangeUSD: '200-300', durationMonths: 1, validityYears: 2, salaryUplift: '5-15%',
    gulfRecognition: 'Required for many job applications and visas', prerequisites: 'None',
    description: 'English language proficiency.', providersGCC: ['British Council, IDP'], examFormat: 'Computer-based', roiScore: 7.5
  },
  {
    id: 'ielts', name: 'IELTS Academic / General', issuer: 'British Council', category: 'Cross-Cutting',
    level: 'Foundation', costRangeUSD: '200-300', durationMonths: 1, validityYears: 2, salaryUplift: '5-15%',
    gulfRecognition: 'Widely accepted across all GCC countries', prerequisites: 'None',
    description: 'International English Language Testing.', providersGCC: ['British Council'], examFormat: 'Paper / Computer', roiScore: 7.6
  },
  {
    id: 'scr', name: 'Sustainability and Climate Risk (SCR)', issuer: 'GARP', category: 'Cross-Cutting',
    level: 'Core', costRangeUSD: '600-1200', durationMonths: 3, validityYears: 0, salaryUplift: '15-30%',
    gulfRecognition: 'Growing importance with net-zero goals', prerequisites: 'Basic finance',
    description: 'Sustainability and climate risk management.', providersGCC: ['GARP'], examFormat: 'Exam', roiScore: 8.8
  },
  {
    id: 'prince2-agile', name: 'PRINCE2 Agile Practitioner', issuer: 'AXELOS', category: 'Project Management',
    level: 'Core', costRangeUSD: '700-1400', durationMonths: 2, validityYears: 3, salaryUplift: '20-35%',
    gulfRecognition: 'Popular hybrid methodology in GCC projects', prerequisites: 'PRINCE2 Foundation',
    description: 'Combining PRINCE2 with Agile.', providersGCC: ['ILX Group'], examFormat: 'Objective testing', roiScore: 8.9
  },
  {
    id: 'power-bi', name: 'Microsoft Power BI Data Analyst', issuer: 'Microsoft', category: 'IT & Technology',
    level: 'Core', costRangeUSD: '200-400', durationMonths: 2, validityYears: 2, salaryUplift: '20-38%',
    gulfRecognition: 'High demand for business intelligence roles', prerequisites: 'Basic Excel',
    description: 'Data visualization and reporting with Power BI.', providersGCC: ['Microsoft Partners'], examFormat: 'Exam', roiScore: 9.1
  },
  {
    id: 'cissp-issap', name: 'CISSP-ISSAP', issuer: 'ISC²', category: 'Cybersecurity',
    level: 'Specialized', costRangeUSD: '900-1600', durationMonths: 4, validityYears: 3, salaryUplift: '28-50%',
    gulfRecognition: 'For senior architecture roles', prerequisites: 'CISSP',
    description: 'Information Systems Security Architecture Professional.', providersGCC: ['ISC²'], examFormat: 'Exam', roiScore: 9.4
  }
];

// ==================== UNIFIED CERTIFICATION MERGER ====================

// Merges Batch 1 and Batch 2 seamlessly into a complete listing array
export const totalCertificationsList: Certification[] = [
  ...allCertifications,
  ...batch2Certifications
];

// Export standard Map generated dynamically from the unified collection
export const certificationMap = new Map<string, Certification>(
  totalCertificationsList.map(cert => [cert.id, cert])
);
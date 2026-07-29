// lib/salaryData.ts

export interface SalaryRange {
  low: number;    // 25th percentile
  median: number; // Market median
  high: number;   // 75th percentile
}

export const ALL_ROLES = [
  // Technology & Digital
  "Software Engineer", "Senior Software Engineer", "Full Stack Developer", "Backend Developer",
  "Frontend Developer", "Mobile App Developer (iOS/Android)", "DevOps Engineer", "Cloud Engineer",
  "Data Scientist", "Data Analyst", "Machine Learning Engineer", "AI Engineer",
  "Cybersecurity Engineer", "Cybersecurity Analyst", "IT Project Manager", "Product Manager",
  "Technical Architect", "Solutions Architect", "QA Engineer", "Business Analyst (IT)",
  "Digital Transformation Manager", "ERP Consultant (SAP/Oracle)",

  // Finance & Accounting
  "Financial Analyst", "Senior Financial Analyst", "Finance Manager", "Financial Controller",
  "CFO", "Accountant", "Senior Accountant", "Auditor", "Risk Manager", "Investment Analyst",
  "Treasury Manager", "FP&A Manager", "Tax Manager",

  // Management & Operations
  "Project Manager", "Senior Project Manager", "Program Manager", "Operations Manager",
  "General Manager", "Business Development Manager", "Strategy Manager", "Management Consultant",

  // Marketing & Sales
  "Marketing Manager", "Digital Marketing Manager", "Brand Manager", "Content Marketing Manager",
  "SEO Specialist", "Sales Manager", "Key Account Manager", "Regional Sales Director",

  // HR & Talent
  "HR Manager", "Talent Acquisition Manager", "HR Business Partner", "Compensation & Benefits Manager",
  "Learning & Development Manager",

  // Engineering & Construction
  "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Construction Project Manager",
  "Quantity Surveyor", "HSE Manager", "Architect", "Structural Engineer",

  // Other Common Roles
  "Supply Chain Manager", "Logistics Manager", "Procurement Manager", "Legal Counsel",
  "Compliance Manager", "Sustainability Manager", "Healthcare Administrator", "Registered Nurse",
] as const;

export const GCC_SALARY_DATA: Record<string, any> = {
  'UAE': {
    currency: 'AED',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
    roles: {
      "Software Engineer": {
        junior: { low: 12000, median: 17500, high: 24000 },
        mid: { low: 22000, median: 29500, high: 39000 },
        senior: { low: 35000, median: 48000, high: 65000 },
      },
      "Senior Software Engineer": {
        junior: { low: 18000, median: 25000, high: 32000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 45000, median: 58000, high: 75000 },
      },
      "Full Stack Developer": {
        junior: { low: 13000, median: 19000, high: 25000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 48000, high: 65000 },
      },
      "Backend Developer": {
        junior: { low: 11000, median: 17000, high: 23000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 32000, median: 45000, high: 62000 },
      },
      "Frontend Developer": {
        junior: { low: 10000, median: 16000, high: 21000 },
        mid: { low: 18000, median: 25000, high: 34000 },
        senior: { low: 28000, median: 42000, high: 58000 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 32000, median: 50000, high: 68000 },
      },
      "DevOps Engineer": {
        junior: { low: 14000, median: 22000, high: 30000 },
        mid: { low: 24000, median: 33000, high: 44000 },
        senior: { low: 40000, median: 60000, high: 80000 },
      },
      "Cloud Engineer": {
        junior: { low: 13000, median: 21000, high: 28000 },
        mid: { low: 22000, median: 31000, high: 42000 },
        senior: { low: 35000, median: 55000, high: 75000 },
      },
      "Data Scientist": {
        junior: { low: 15000, median: 22000, high: 29000 },
        mid: { low: 28000, median: 38000, high: 52000 },
        senior: { low: 45000, median: 58000, high: 78000 },
      },
      "Data Analyst": {
        junior: { low: 7000, median: 10000, high: 13500 },
        mid: { low: 12000, median: 17000, high: 23000 },
        senior: { low: 22000, median: 30000, high: 42000 },
      },
      "Machine Learning Engineer": {
        junior: { low: 16000, median: 25000, high: 35000 },
        mid: { low: 28000, median: 40000, high: 55000 },
        senior: { low: 50000, median: 80000, high: 110000 },
      },
      "AI Engineer": {
        junior: { low: 18000, median: 26000, high: 34000 },
        mid: { low: 32000, median: 45000, high: 60000 },
        senior: { low: 55000, median: 70000, high: 90000 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 25000, median: 34000, high: 45000 },
        senior: { low: 40000, median: 52000, high: 70000 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 18000, median: 25000, high: 33000 },
        senior: { low: 30000, median: 48000, high: 65000 },
      },
      "IT Project Manager": {
        junior: { low: 14000, median: 22000, high: 30000 },
        mid: { low: 24000, median: 33000, high: 44000 },
        senior: { low: 40000, median: 60000, high: 80000 },
      },
      "Product Manager": {
        junior: { low: 16000, median: 25000, high: 35000 },
        mid: { low: 28000, median: 40000, high: 55000 },
        senior: { low: 45000, median: 75000, high: 100000 },
      },
      "Technical Architect": {
        junior: { low: 20000, median: 30000, high: 42000 },
        mid: { low: 35000, median: 50000, high: 68000 },
        senior: { low: 55000, median: 95000, high: 130000 },
      },
      "Solutions Architect": {
        junior: { low: 20000, median: 29000, high: 42000 },
        mid: { low: 32000, median: 48000, high: 65000 },
        senior: { low: 50000, median: 90000, high: 125000 },
      },
      "QA Engineer": {
        junior: { low: 5000, median: 7500, high: 9500 },
        mid: { low: 9000, median: 13000, high: 18000 },
        senior: { low: 15000, median: 22000, high: 32000 },
      },
      "Business Analyst (IT)": {
        junior: { low: 7000, median: 9500, high: 13000 },
        mid: { low: 12000, median: 17000, high: 24000 },
        senior: { low: 18000, median: 28000, high: 40000 },
      },
      "Digital Transformation Manager": {
        junior: { low: 15000, median: 22000, high: 28000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 35000, median: 45000, high: 60000 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 18000, median: 26000, high: 36000 },
        senior: { low: 30000, median: 45000, high: 62000 },
      },
      "Financial Analyst": {
        junior: { low: 8000, median: 12500, high: 16500 },
        mid: { low: 14500, median: 19500, high: 26000 },
        senior: { low: 23000, median: 29500, high: 38000 },
      },
      "Senior Financial Analyst": {
        junior: { low: 12000, median: 18000, high: 25000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 32000, median: 50000, high: 70000 },
      },
      "Finance Manager": {
        junior: { low: 18000, median: 24000, high: 30000 },
        mid: { low: 25000, median: 32000, high: 42000 },
        senior: { low: 38000, median: 48000, high: 65000 },
      },
      "Financial Controller": {
        junior: { low: 15000, median: 26000, high: 35000 },
        mid: { low: 28000, median: 38000, high: 52000 },
        senior: { low: 45000, median: 70000, high: 95000 },
      },
      "CFO": {
        junior: { low: 45000, median: 65000, high: 85000 },
        mid: { low: 70000, median: 90000, high: 120000 },
        senior: { low: 100000, median: 140000, high: 200000 },
      },
      "Accountant": {
        junior: { low: 5000, median: 8000, high: 11000 },
        mid: { low: 9000, median: 13000, high: 18000 },
        senior: { low: 15000, median: 22000, high: 32000 },
      },
      "Senior Accountant": {
        junior: { low: 7000, median: 11000, high: 15000 },
        mid: { low: 12000, median: 17000, high: 24000 },
        senior: { low: 20000, median: 30000, high: 42000 },
      },
      "Auditor": {
        junior: { low: 5000, median: 7500, high: 10000 },
        mid: { low: 9000, median: 13000, high: 18000 },
        senior: { low: 15000, median: 22000, high: 32000 },
      },
      "Risk Manager": {
        junior: { low: 15000, median: 26000, high: 35000 },
        mid: { low: 28000, median: 38000, high: 52000 },
        senior: { low: 45000, median: 65000, high: 88000 },
      },
      "Investment Analyst": {
        junior: { low: 10000, median: 17000, high: 23000 },
        mid: { low: 18000, median: 26000, high: 36000 },
        senior: { low: 30000, median: 48000, high: 65000 },
      },
      "Treasury Manager": {
        junior: { low: 14000, median: 24000, high: 32000 },
        mid: { low: 26000, median: 36000, high: 48000 },
        senior: { low: 42000, median: 60000, high: 82000 },
      },
      "FP&A Manager": {
        junior: { low: 18000, median: 28000, high: 38000 },
        mid: { low: 30000, median: 42000, high: 58000 },
        senior: { low: 50000, median: 75000, high: 102000 },
      },
      "Tax Manager": {
        junior: { low: 16000, median: 26000, high: 35000 },
        mid: { low: 28000, median: 38000, high: 52000 },
        senior: { low: 45000, median: 65000, high: 88000 },
      },
      "Project Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 23000, median: 31000, high: 41000 },
        senior: { low: 35000, median: 46000, high: 62000 },
      },
      "Senior Project Manager": {
        junior: { low: 20000, median: 32000, high: 42000 },
        mid: { low: 35000, median: 48000, high: 62000 },
        senior: { low: 55000, median: 80000, high: 108000 },
      },
      "Program Manager": {
        junior: { low: 18000, median: 30000, high: 40000 },
        mid: { low: 32000, median: 45000, high: 60000 },
        senior: { low: 50000, median: 75000, high: 102000 },
      },
      "Operations Manager": {
        junior: { low: 15000, median: 25000, high: 33000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 42000, median: 62000, high: 85000 },
      },
      "General Manager": {
        junior: { low: 25000, median: 40000, high: 55000 },
        mid: { low: 45000, median: 62000, high: 85000 },
        senior: { low: 70000, median: 120000, high: 170000 },
      },
      "Business Development Manager": {
        junior: { low: 12000, median: 20000, high: 28000 },
        mid: { low: 22000, median: 32000, high: 44000 },
        senior: { low: 38000, median: 60000, high: 82000 },
      },
      "Strategy Manager": {
        junior: { low: 18000, median: 30000, high: 40000 },
        mid: { low: 32000, median: 46000, high: 62000 },
        senior: { low: 50000, median: 75000, high: 102000 },
      },
      "Management Consultant": {
        junior: { low: 16000, median: 28000, high: 38000 },
        mid: { low: 30000, median: 44000, high: 60000 },
        senior: { low: 50000, median: 85000, high: 120000 },
      },
      "Marketing Manager": {
        junior: { low: 12000, median: 19000, high: 26000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 55000, high: 76000 },
      },
      "Digital Marketing Manager": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 48000, high: 66000 },
      },
      "Brand Manager": {
        junior: { low: 12000, median: 20000, high: 28000 },
        mid: { low: 22000, median: 32000, high: 44000 },
        senior: { low: 38000, median: 58000, high: 80000 },
      },
      "Content Marketing Manager": {
        junior: { low: 9000, median: 15000, high: 20000 },
        mid: { low: 16000, median: 23000, high: 32000 },
        senior: { low: 28000, median: 42000, high: 58000 },
      },
      "SEO Specialist": {
        junior: { low: 6000, median: 10000, high: 14000 },
        mid: { low: 12000, median: 18000, high: 24000 },
        senior: { low: 20000, median: 32000, high: 45000 },
      },
      "Sales Manager": {
        junior: { low: 10000, median: 18000, high: 25000 },
        mid: { low: 20000, median: 30000, high: 42000 },
        senior: { low: 35000, median: 60000, high: 85000 },
      },
      "Key Account Manager": {
        junior: { low: 9000, median: 15000, high: 22000 },
        mid: { low: 17000, median: 25000, high: 35000 },
        senior: { low: 30000, median: 50000, high: 70000 },
      },
      "Regional Sales Director": {
        junior: { low: 20000, median: 38000, high: 55000 },
        mid: { low: 42000, median: 62000, high: 85000 },
        senior: { low: 70000, median: 120000, high: 170000 },
      },
      "HR Manager": {
        junior: { low: 12000, median: 16000, high: 21000 },
        mid: { low: 18000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 35000, high: 48000 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 10000, median: 17000, high: 23000 },
        mid: { low: 18000, median: 26000, high: 35000 },
        senior: { low: 32000, median: 50000, high: 70000 },
      },
      "HR Business Partner": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 17000, median: 25000, high: 34000 },
        senior: { low: 30000, median: 48000, high: 66000 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 14000, median: 24000, high: 32000 },
        mid: { low: 26000, median: 36000, high: 48000 },
        senior: { low: 42000, median: 62000, high: 85000 },
      },
      "Learning & Development Manager": {
        junior: { low: 11000, median: 18000, high: 24000 },
        mid: { low: 19000, median: 28000, high: 38000 },
        senior: { low: 32000, median: 48000, high: 66000 },
      },
      "Civil Engineer": {
        junior: { low: 9000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 45000, high: 62000 },
      },
      "Mechanical Engineer": {
        junior: { low: 9000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 44000, high: 60000 },
      },
      "Electrical Engineer": {
        junior: { low: 9000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 45000, high: 62000 },
      },
      "Construction Project Manager": {
        junior: { low: 15000, median: 22000, high: 28000 },
        mid: { low: 25000, median: 34000, high: 45000 },
        senior: { low: 40000, median: 52000, high: 70000 },
      },
      "Quantity Surveyor": {
        junior: { low: 8000, median: 14000, high: 19000 },
        mid: { low: 16000, median: 23000, high: 32000 },
        senior: { low: 28000, median: 42000, high: 58000 },
      },
      "HSE Manager": {
        junior: { low: 12000, median: 22000, high: 30000 },
        mid: { low: 24000, median: 34000, high: 46000 },
        senior: { low: 40000, median: 62000, high: 85000 },
      },
      "Architect": {
        junior: { low: 12000, median: 20000, high: 28000 },
        mid: { low: 22000, median: 32000, high: 44000 },
        senior: { low: 38000, median: 60000, high: 82000 },
      },
      "Structural Engineer": {
        junior: { low: 11000, median: 19000, high: 26000 },
        mid: { low: 20000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 55000, high: 76000 },
      },
      "Supply Chain Manager": {
        junior: { low: 14000, median: 24000, high: 32000 },
        mid: { low: 26000, median: 36000, high: 48000 },
        senior: { low: 42000, median: 65000, high: 88000 },
      },
      "Logistics Manager": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 18000, median: 26000, high: 36000 },
        senior: { low: 30000, median: 48000, high: 66000 },
      },
      "Procurement Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 34000, median: 52000, high: 72000 },
      },
      "Legal Counsel": {
        junior: { low: 16000, median: 24000, high: 32000 },
        mid: { low: 28000, median: 40000, high: 54000 },
        senior: { low: 45000, median: 70000, high: 98000 },
      },
      "Compliance Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 34000, median: 52000, high: 72000 },
      },
      "Sustainability Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 34000, median: 50000, high: 70000 },
      },
      "Healthcare Administrator": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 34000 },
        senior: { low: 30000, median: 45000, high: 62000 },
      },
      "Registered Nurse": {
        junior: { low: 8000, median: 11000, high: 14000 },
        mid: { low: 13000, median: 18000, high: 24000 },
        senior: { low: 20000, median: 28000, high: 38000 },
      },
    }
  },

  'Saudi Arabia': {
    currency: 'SAR',
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah'],
    roles: {
      "Software Engineer": {
        junior: { low: 9500, median: 15500, high: 22000 },
        mid: { low: 18000, median: 26500, high: 36000 },
        senior: { low: 32000, median: 45000, high: 62000 },
      },
      "Senior Software Engineer": {
        junior: { low: 15000, median: 22000, high: 30000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 45000, median: 58000, high: 75000 },
      },
      "Full Stack Developer": {
        junior: { low: 8500, median: 14000, high: 20000 },
        mid: { low: 16000, median: 23000, high: 32000 },
        senior: { low: 30000, median: 42000, high: 58000 },
      },
      "Backend Developer": {
        junior: { low: 8000, median: 13500, high: 19000 },
        mid: { low: 15000, median: 22000, high: 30000 },
        senior: { low: 28000, median: 40000, high: 55000 },
      },
      "Frontend Developer": {
        junior: { low: 7500, median: 12500, high: 17500 },
        mid: { low: 14000, median: 20000, high: 28000 },
        senior: { low: 26000, median: 36000, high: 50000 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 8000, median: 13000, high: 18500 },
        mid: { low: 15000, median: 22000, high: 30000 },
        senior: { low: 28000, median: 38000, high: 52000 },
      },
      "DevOps Engineer": {
        junior: { low: 10000, median: 15500, high: 22000 },
        mid: { low: 18000, median: 26000, high: 35000 },
        senior: { low: 35000, median: 48000, high: 65000 },
      },
      "Cloud Engineer": {
        junior: { low: 9500, median: 14500, high: 20500 },
        mid: { low: 17000, median: 24500, high: 33000 },
        senior: { low: 32000, median: 44000, high: 60000 },
      },
      "Data Scientist": {
        junior: { low: 12000, median: 19000, high: 26000 },
        mid: { low: 24000, median: 34000, high: 47000 },
        senior: { low: 40000, median: 52000, high: 70000 },
      },
      "Data Analyst": {
        junior: { low: 8000, median: 12500, high: 17500 },
        mid: { low: 15000, median: 21000, high: 28500 },
        senior: { low: 28000, median: 38000, high: 52000 },
      },
      "Machine Learning Engineer": {
        junior: { low: 11000, median: 17000, high: 24000 },
        mid: { low: 22000, median: 31000, high: 42000 },
        senior: { low: 38000, median: 52000, high: 72000 },
      },
      "AI Engineer": {
        junior: { low: 12000, median: 18500, high: 26000 },
        mid: { low: 24000, median: 34000, high: 46000 },
        senior: { low: 42000, median: 58000, high: 80000 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 10000, median: 15500, high: 22000 },
        mid: { low: 19000, median: 27000, high: 37000 },
        senior: { low: 35000, median: 48000, high: 68000 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 7500, median: 11500, high: 16000 },
        mid: { low: 14000, median: 19500, high: 26500 },
        senior: { low: 25000, median: 34000, high: 46000 },
      },
      "IT Project Manager": {
        junior: { low: 12000, median: 18000, high: 25000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 46000, high: 62000 },
      },
      "Product Manager": {
        junior: { low: 13000, median: 19500, high: 26500 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 38000, median: 52000, high: 70000 },
      },
      "Technical Architect": {
        junior: { low: 18000, median: 26000, high: 35000 },
        mid: { low: 30000, median: 42000, high: 56000 },
        senior: { low: 50000, median: 68000, high: 90000 },
      },
      "Solutions Architect": {
        junior: { low: 17000, median: 25000, high: 33000 },
        mid: { low: 28000, median: 39000, high: 52000 },
        senior: { low: 48000, median: 65000, high: 88000 },
      },
      "QA Engineer": {
        junior: { low: 5500, median: 8000, high: 11000 },
        mid: { low: 10000, median: 14000, high: 19000 },
        senior: { low: 18000, median: 25000, high: 35000 },
      },
      "Business Analyst (IT)": {
        junior: { low: 7000, median: 10500, high: 14500 },
        mid: { low: 13000, median: 18000, high: 24500 },
        senior: { low: 24000, median: 32000, high: 43000 },
      },
      "Digital Transformation Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 38000, median: 52000, high: 70000 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 10000, median: 14500, high: 19500 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 42000, high: 58000 },
      },
      "Financial Analyst": {
        junior: { low: 7000, median: 10500, high: 14500 },
        mid: { low: 13000, median: 18500, high: 24500 },
        senior: { low: 20000, median: 27500, high: 36000 },
      },
      "Senior Financial Analyst": {
        junior: { low: 10500, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 33000 },
        senior: { low: 30000, median: 42000, high: 56000 },
      },
      "Finance Manager": {
        junior: { low: 15000, median: 21000, high: 27000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 40000, median: 55000, high: 75000 },
      },
      "Financial Controller": {
        junior: { low: 18000, median: 25000, high: 32000 },
        mid: { low: 30000, median: 40000, high: 52000 },
        senior: { low: 50000, median: 68000, high: 90000 },
      },
      "CFO": {
        junior: { low: 40000, median: 55000, high: 75000 },
        mid: { low: 60000, median: 80000, high: 110000 },
        senior: { low: 90000, median: 130000, high: 180000 },
      },
      "Accountant": {
        junior: { low: 4500, median: 6500, high: 9000 },
        mid: { low: 8500, median: 11500, high: 15500 },
        senior: { low: 16000, median: 22000, high: 30000 },
      },
      "Senior Accountant": {
        junior: { low: 6500, median: 9000, high: 12000 },
        mid: { low: 11000, median: 15000, high: 20000 },
        senior: { low: 20000, median: 27000, high: 36000 },
      },
      "Auditor": {
        junior: { low: 5000, median: 7000, high: 9500 },
        mid: { low: 9000, median: 12500, high: 17000 },
        senior: { low: 17000, median: 23000, high: 32000 },
      },
      "Risk Manager": {
        junior: { low: 14000, median: 19500, high: 26000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 42000, median: 58000, high: 80000 },
      },
      "Investment Analyst": {
        junior: { low: 9500, median: 14000, high: 19000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 42000, high: 58000 },
      },
      "Treasury Manager": {
        junior: { low: 13000, median: 18000, high: 24000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 40000, median: 55000, high: 75000 },
      },
      "FP&A Manager": {
        junior: { low: 16000, median: 22000, high: 29000 },
        mid: { low: 26000, median: 35000, high: 46000 },
        senior: { low: 45000, median: 62000, high: 85000 },
      },
      "Tax Manager": {
        junior: { low: 15000, median: 20500, high: 27000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 42000, median: 58000, high: 80000 },
      },
      "Project Manager": {
        junior: { low: 12000, median: 18000, high: 25000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 32000, median: 42000, high: 55000 },
      },
      "Senior Project Manager": {
        junior: { low: 18000, median: 24000, high: 31000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 45000, median: 60000, high: 80000 },
      },
      "Program Manager": {
        junior: { low: 16000, median: 22000, high: 29000 },
        mid: { low: 26000, median: 35000, high: 46000 },
        senior: { low: 42000, median: 58000, high: 78000 },
      },
      "Operations Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 38000, median: 52000, high: 70000 },
      },
      "General Manager": {
        junior: { low: 22000, median: 32000, high: 42000 },
        mid: { low: 38000, median: 52000, high: 70000 },
        senior: { low: 65000, median: 95000, high: 135000 },
      },
      "Business Development Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 50000, high: 70000 },
      },
      "Strategy Manager": {
        junior: { low: 16000, median: 22000, high: 29000 },
        mid: { low: 26000, median: 36000, high: 48000 },
        senior: { low: 45000, median: 65000, high: 90000 },
      },
      "Management Consultant": {
        junior: { low: 15000, median: 21000, high: 28000 },
        mid: { low: 24000, median: 34000, high: 46000 },
        senior: { low: 42000, median: 65000, high: 92000 },
      },
      "Marketing Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 32000, median: 48000, high: 68000 },
      },
      "Digital Marketing Manager": {
        junior: { low: 8500, median: 13000, high: 18000 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 26000, median: 40000, high: 56000 },
      },
      "Brand Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 32000, median: 48000, high: 68000 },
      },
      "Content Marketing Manager": {
        junior: { low: 7500, median: 11500, high: 15500 },
        mid: { low: 13000, median: 18000, high: 24000 },
        senior: { low: 24000, median: 36000, high: 50000 },
      },
      "SEO Specialist": {
        junior: { low: 5500, median: 8500, high: 12000 },
        mid: { low: 10000, median: 14000, high: 19000 },
        senior: { low: 18000, median: 28000, high: 40000 },
      },
      "Sales Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 32000, median: 50000, high: 72000 },
      },
      "Key Account Manager": {
        junior: { low: 9000, median: 13500, high: 18000 },
        mid: { low: 15000, median: 21000, high: 28000 },
        senior: { low: 26000, median: 40000, high: 58000 },
      },
      "Regional Sales Director": {
        junior: { low: 18000, median: 28000, high: 38000 },
        mid: { low: 35000, median: 50000, high: 68000 },
        senior: { low: 60000, median: 95000, high: 135000 },
      },
      "HR Manager": {
        junior: { low: 10000, median: 14500, high: 19500 },
        mid: { low: 16000, median: 22000, high: 30000 },
        senior: { low: 28000, median: 40000, high: 56000 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 9000, median: 13000, high: 17500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 25000, median: 36000, high: 50000 },
      },
      "HR Business Partner": {
        junior: { low: 9000, median: 13000, high: 17500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 25000, median: 36000, high: 50000 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 12000, median: 17000, high: 22000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 36000, median: 52000, high: 72000 },
      },
      "Learning & Development Manager": {
        junior: { low: 10000, median: 14000, high: 18500 },
        mid: { low: 16000, median: 22000, high: 30000 },
        senior: { low: 28000, median: 42000, high: 58000 },
      },
      "Civil Engineer": {
        junior: { low: 8000, median: 12000, high: 16500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Mechanical Engineer": {
        junior: { low: 8000, median: 12000, high: 16500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Electrical Engineer": {
        junior: { low: 8000, median: 12000, high: 16500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Construction Project Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 50000, high: 68000 },
      },
      "Quantity Surveyor": {
        junior: { low: 7000, median: 10500, high: 14000 },
        mid: { low: 13000, median: 18000, high: 24000 },
        senior: { low: 24000, median: 35000, high: 48000 },
      },
      "HSE Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 45000, high: 62000 },
      },
      "Architect": {
        junior: { low: 8000, median: 12500, high: 17000 },
        mid: { low: 15000, median: 22000, high: 30000 },
        senior: { low: 28000, median: 42000, high: 58000 },
      },
      "Structural Engineer": {
        junior: { low: 8000, median: 12000, high: 16500 },
        mid: { low: 14000, median: 20000, high: 27000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Supply Chain Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 52000, high: 72000 },
      },
      "Logistics Manager": {
        junior: { low: 9000, median: 13500, high: 18000 },
        mid: { low: 15000, median: 21000, high: 28000 },
        senior: { low: 26000, median: 40000, high: 56000 },
      },
      "Procurement Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 44000, high: 62000 },
      },
      "Legal Counsel": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 22000, median: 32000, high: 44000 },
        senior: { low: 40000, median: 60000, high: 85000 },
      },
      "Compliance Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 44000, high: 62000 },
      },
      "Sustainability Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 44000, high: 62000 },
      },
      "Healthcare Administrator": {
        junior: { low: 8000, median: 12000, high: 16000 },
        mid: { low: 14000, median: 19500, high: 26000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Registered Nurse": {
        junior: { low: 6000, median: 9000, high: 12000 },
        mid: { low: 11000, median: 15000, high: 20000 },
        senior: { low: 18000, median: 26000, high: 36000 },
      },
    }
  },

  'Qatar': {
    currency: 'QAR',
    cities: ['Doha', 'Al Rayyan', 'Lusail', 'Al Wakrah'],
    roles: {
      "Software Engineer": {
        junior: { low: 10500, median: 16500, high: 23000 },
        mid: { low: 20000, median: 27500, high: 37000 },
        senior: { low: 34000, median: 46000, high: 62000 },
      },
      "Senior Software Engineer": {
        junior: { low: 18000, median: 25000, high: 32000 },
        mid: { low: 28000, median: 38000, high: 48000 },
        senior: { low: 42000, median: 55000, high: 72000 },
      },
      "Full Stack Developer": {
        junior: { low: 9500, median: 15000, high: 21000 },
        mid: { low: 18000, median: 25000, high: 34000 },
        senior: { low: 30000, median: 42000, high: 58000 },
      },
      "Backend Developer": {
        junior: { low: 9000, median: 14500, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 40000, high: 55000 },
      },
      "Frontend Developer": {
        junior: { low: 8500, median: 13500, high: 18500 },
        mid: { low: 15000, median: 21000, high: 29000 },
        senior: { low: 26000, median: 37000, high: 51000 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 9000, median: 14500, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 40000, high: 55000 },
      },
      "DevOps Engineer": {
        junior: { low: 13000, median: 19000, high: 26000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 38000, median: 50000, high: 66000 },
      },
      "Cloud Engineer": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 48000, high: 64000 },
      },
      "Data Scientist": {
        junior: { low: 12000, median: 18000, high: 25000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 45000, high: 60000 },
      },
      "Data Analyst": {
        junior: { low: 8000, median: 12000, high: 16000 },
        mid: { low: 15000, median: 20000, high: 27000 },
        senior: { low: 23000, median: 30000, high: 40000 },
      },
      "Machine Learning Engineer": {
        junior: { low: 13000, median: 19000, high: 26000 },
        mid: { low: 24000, median: 33000, high: 44000 },
        senior: { low: 38000, median: 52000, high: 70000 },
      },
      "AI Engineer": {
        junior: { low: 14000, median: 21000, high: 28000 },
        mid: { low: 26000, median: 35000, high: 48000 },
        senior: { low: 45000, median: 58000, high: 75000 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 25000, median: 34000, high: 45000 },
        senior: { low: 40000, median: 52000, high: 70000 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 33000 },
        senior: { low: 30000, median: 40000, high: 54000 },
      },
      "IT Project Manager": {
        junior: { low: 13000, median: 19000, high: 26000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 48000, high: 64000 },
      },
      "Product Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 35000, median: 46000, high: 60000 },
      },
      "Technical Architect": {
        junior: { low: 18000, median: 26000, high: 34000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 45000, median: 60000, high: 80000 },
      },
      "Solutions Architect": {
        junior: { low: 17000, median: 25000, high: 33000 },
        mid: { low: 27000, median: 37000, high: 49000 },
        senior: { low: 42000, median: 58000, high: 78000 },
      },
      "QA Engineer": {
        junior: { low: 6000, median: 9000, high: 12000 },
        mid: { low: 11000, median: 15000, high: 20000 },
        senior: { low: 18000, median: 26000, high: 36000 },
      },
      "Business Analyst (IT)": {
        junior: { low: 8000, median: 12000, high: 16000 },
        mid: { low: 14000, median: 19000, high: 26000 },
        senior: { low: 24000, median: 33000, high: 45000 },
      },
      "Digital Transformation Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 48000, high: 64000 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 17000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 40000, high: 55000 },
      },
      "Financial Analyst": {
        junior: { low: 8000, median: 12500, high: 17000 },
        mid: { low: 15000, median: 21000, high: 28000 },
        senior: { low: 23000, median: 30000, high: 40000 },
      },
      "Senior Financial Analyst": {
        junior: { low: 12000, median: 17000, high: 22000 },
        mid: { low: 20000, median: 27000, high: 36000 },
        senior: { low: 32000, median: 44000, high: 60000 },
      },
      "Finance Manager": {
        junior: { low: 18000, median: 24000, high: 30000 },
        mid: { low: 25000, median: 32000, high: 42000 },
        senior: { low: 38000, median: 48000, high: 65000 },
      },
      "Financial Controller": {
        junior: { low: 20000, median: 27000, high: 35000 },
        mid: { low: 28000, median: 36000, high: 48000 },
        senior: { low: 42000, median: 55000, high: 75000 },
      },
      "CFO": {
        junior: { low: 45000, median: 65000, high: 85000 },
        mid: { low: 70000, median: 90000, high: 120000 },
        senior: { low: 100000, median: 140000, high: 200000 },
      },
      "Accountant": {
        junior: { low: 5000, median: 7500, high: 10000 },
        mid: { low: 9500, median: 13000, high: 17500 },
        senior: { low: 16000, median: 22000, high: 30000 },
      },
      "Senior Accountant": {
        junior: { low: 7000, median: 10500, high: 14000 },
        mid: { low: 13000, median: 18000, high: 24000 },
        senior: { low: 22000, median: 30000, high: 42000 },
      },
      "Auditor": {
        junior: { low: 6000, median: 9000, high: 12000 },
        mid: { low: 11000, median: 15000, high: 20000 },
        senior: { low: 18000, median: 26000, high: 36000 },
      },
      "Risk Manager": {
        junior: { low: 15000, median: 22000, high: 29000 },
        mid: { low: 25000, median: 34000, high: 46000 },
        senior: { low: 40000, median: 55000, high: 75000 },
      },
      "Investment Analyst": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 34000 },
        senior: { low: 28000, median: 40000, high: 56000 },
      },
      "Treasury Manager": {
        junior: { low: 14000, median: 20000, high: 27000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 36000, median: 50000, high: 68000 },
      },
      "FP&A Manager": {
        junior: { low: 17000, median: 24000, high: 32000 },
        mid: { low: 26000, median: 35000, high: 46000 },
        senior: { low: 42000, median: 58000, high: 80000 },
      },
      "Tax Manager": {
        junior: { low: 15000, median: 20000, high: 26000 },
        mid: { low: 22000, median: 29000, high: 38000 },
        senior: { low: 34000, median: 44000, high: 58000 },
      },
      "Project Manager": {
        junior: { low: 12000, median: 18000, high: 25000 },
        mid: { low: 22000, median: 30000, high: 40000 },
        senior: { low: 35000, median: 46000, high: 60000 },
      },
      "Senior Project Manager": {
        junior: { low: 18000, median: 25000, high: 32000 },
        mid: { low: 28000, median: 38000, high: 50000 },
        senior: { low: 44000, median: 58000, high: 76000 },
      },
      "Program Manager": {
        junior: { low: 16000, median: 22000, high: 29000 },
        mid: { low: 25000, median: 34000, high: 45000 },
        senior: { low: 40000, median: 55000, high: 74000 },
      },
      "Operations Manager": {
        junior: { low: 14000, median: 19000, high: 25000 },
        mid: { low: 22000, median: 30000, high: 38000 },
        senior: { low: 35000, median: 45000, high: 58000 },
      },
      "General Manager": {
        junior: { low: 22000, median: 32000, high: 42000 },
        mid: { low: 38000, median: 52000, high: 70000 },
        senior: { low: 65000, median: 95000, high: 135000 },
      },
      "Business Development Manager": {
        junior: { low: 12000, median: 18000, high: 24000 },
        mid: { low: 20000, median: 28000, high: 38000 },
        senior: { low: 35000, median: 50000, high: 68000 },
      },
      "Strategy Manager": {
        junior: { low: 16000, median: 22000, high: 29000 },
        mid: { low: 25000, median: 34000, high: 46000 },
        senior: { low: 40000, median: 58000, high: 80000 },
      },
      "Management Consultant": {
        junior: { low: 14000, median: 21000, high: 28000 },
        mid: { low: 24000, median: 33000, high: 44000 },
        senior: { low: 40000, median: 60000, high: 85000 },
      },
      "Marketing Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 32000 },
        senior: { low: 30000, median: 40000, high: 52000 },
      },
      "Digital Marketing Manager": {
        junior: { low: 9000, median: 14000, high: 18000 },
        mid: { low: 17000, median: 23000, high: 30000 },
        senior: { low: 28000, median: 37000, high: 48000 },
      },
      "Brand Manager": {
        junior: { low: 10000, median: 15000, high: 20000 },
        mid: { low: 18000, median: 25000, high: 32000 },
        senior: { low: 30000, median: 42000, high: 56000 },
      },
      "Content Marketing Manager": {
        junior: { low: 8000, median: 12000, high: 16000 },
        mid: { low: 14000, median: 19000, high: 26000 },
        senior: { low: 24000, median: 34000, high: 46000 },
      },
      "SEO Specialist": {
        junior: { low: 6000, median: 9000, high: 12000 },
        mid: { low: 11000, median: 15000, high: 20000 },
        senior: { low: 18000, median: 28000, high: 40000 },
      },
      "Sales Manager": {
        junior: { low: 10000, median: 16000, high: 22000 },
        mid: { low: 19000, median: 26000, high: 35000 },
        senior: { low: 32000, median: 42000, high: 55000 },
      },
      "Key Account Manager": {
        junior: { low: 9000, median: 14000, high: 19000 },
        mid: { low: 16000, median: 22000, high: 30000 },
        senior: { low: 26000, median: 38000, high: 52000 },
      },
      "Regional Sales Director": {
        junior: { low: 18000, median: 28000, high: 38000 },
        mid: { low: 35000, median: 50000, high: 68000 },
        senior: { low: 60000, median: 90000, high: 130000 },
      },
      "HR Manager": {
        junior: { low: 12000, median: 16000, high: 21000 },
        mid: { low: 18000, median: 24000, high: 32000 },
        senior: { low: 28000, median: 35000, high: 48000 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 10000, median: 14000, high: 18000 },
        mid: { low: 17000, median: 23000, high: 30000 },
        senior: { low: 26000, median: 34000, high: 45000 },
      },
      "HR Business Partner": {
        junior: { low: 10000, median: 14000, high: 18000 },
        mid: { low: 16000, median: 22000, high: 29000 },
        senior: { low: 25000, median: 34000, high: 46000 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 14000, median: 20000, high: 26000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 38000, median: 48000, high: 65000 },
      },
      "Learning & Development Manager": {
        junior: { low: 10000, median: 14000, high: 18000 },
        mid: { low: 16000, median: 22000, high: 29000 },
        senior: { low: 26000, median: 36000, high: 48000 },
      },
      "Civil Engineer": {
        junior: { low: 9000, median: 13000, high: 17000 },
        mid: { low: 16000, median: 22000, high: 28000 },
        senior: { low: 28000, median: 36000, high: 48000 },
      },
      "Mechanical Engineer": {
        junior: { low: 9000, median: 13000, high: 18000 },
        mid: { low: 17000, median: 23000, high: 30000 },
        senior: { low: 30000, median: 38000, high: 50000 },
      },
      "Electrical Engineer": {
        junior: { low: 9000, median: 13000, high: 18000 },
        mid: { low: 17000, median: 23000, high: 30000 },
        senior: { low: 30000, median: 38000, high: 50000 },
      },
      "Construction Project Manager": {
        junior: { low: 15000, median: 22000, high: 28000 },
        mid: { low: 25000, median: 34000, high: 45000 },
        senior: { low: 40000, median: 52000, high: 70000 },
      },
      "Quantity Surveyor": {
        junior: { low: 8000, median: 12000, high: 16000 },
        mid: { low: 15000, median: 21000, high: 28000 },
        senior: { low: 26000, median: 36000, high: 50000 },
      },
      "HSE Manager": {
        junior: { low: 12000, median: 17000, high: 22000 },
        mid: { low: 20000, median: 27000, high: 35000 },
        senior: { low: 32000, median: 42000, high: 55000 },
      },
      "Architect": {
        junior: { low: 9000, median: 14000, high: 19000 },
        mid: { low: 16000, median: 23000, high: 31000 },
        senior: { low: 28000, median: 40000, high: 56000 },
      },
      "Structural Engineer": {
        junior: { low: 9000, median: 13000, high: 18000 },
        mid: { low: 16000, median: 22000, high: 29000 },
        senior: { low: 28000, median: 38000, high: 52000 },
      },
      "Supply Chain Manager": {
        junior: { low: 12000, median: 17000, high: 23000 },
        mid: { low: 20000, median: 27000, high: 35000 },
        senior: { low: 32000, median: 42000, high: 55000 },
      },
      "Logistics Manager": {
        junior: { low: 9000, median: 13000, high: 17000 },
        mid: { low: 15000, median: 21000, high: 28000 },
        senior: { low: 26000, median: 36000, high: 50000 },
      },
      "Procurement Manager": {
        junior: { low: 11000, median: 16000, high: 21000 },
        mid: { low: 18000, median: 24000, high: 32000 },
        senior: { low: 30000, median: 40000, high: 52000 },
      },
      "Legal Counsel": {
        junior: { low: 14000, median: 20000, high: 26000 },
        mid: { low: 24000, median: 32000, high: 42000 },
        senior: { low: 38000, median: 48000, high: 65000 },
      },
      "Compliance Manager": {
        junior: { low: 13000, median: 18000, high: 24000 },
        mid: { low: 22000, median: 29000, high: 38000 },
        senior: { low: 35000, median: 45000, high: 58000 },
      },
      "Sustainability Manager": {
        junior: { low: 12000, median: 17000, high: 22000 },
        mid: { low: 20000, median: 27000, high: 36000 },
        senior: { low: 32000, median: 44000, high: 60000 },
      },
      "Healthcare Administrator": {
        junior: { low: 9000, median: 13000, high: 17000 },
        mid: { low: 16000, median: 22000, high: 28000 },
        senior: { low: 28000, median: 36000, high: 48000 },
      },
      "Registered Nurse": {
        junior: { low: 8000, median: 11000, high: 14000 },
        mid: { low: 13000, median: 17000, high: 22000 },
        senior: { low: 20000, median: 26000, high: 34000 },
      },
    }
  },

  'Kuwait': {
    currency: 'KWD',
    cities: ['Kuwait City', 'Hawally', 'Salmiya', 'Farwaniya'],
    roles: {
      "Software Engineer": {
        junior: { low: 750, median: 1150, high: 1550 },
        mid: { low: 1350, median: 1850, high: 2550 },
        senior: { low: 2200, median: 2950, high: 4000 },
      },
      "Senior Software Engineer": {
        junior: { low: 1200, median: 1700, high: 2200 },
        mid: { low: 2000, median: 2700, high: 3500 },
        senior: { low: 3200, median: 4200, high: 5600 },
      },
      "Full Stack Developer": {
        junior: { low: 650, median: 1000, high: 1400 },
        mid: { low: 1200, median: 1650, high: 2200 },
        senior: { low: 2000, median: 2700, high: 3600 },
      },
      "Backend Developer": {
        junior: { low: 600, median: 950, high: 1300 },
        mid: { low: 1100, median: 1550, high: 2050 },
        senior: { low: 1850, median: 2550, high: 3400 },
      },
      "Frontend Developer": {
        junior: { low: 550, median: 880, high: 1200 },
        mid: { low: 1000, median: 1400, high: 1900 },
        senior: { low: 1700, median: 2300, high: 3100 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 600, median: 950, high: 1300 },
        mid: { low: 1100, median: 1550, high: 2050 },
        senior: { low: 1850, median: 2550, high: 3400 },
      },
      "DevOps Engineer": {
        junior: { low: 750, median: 1100, high: 1500 },
        mid: { low: 1500, median: 2000, high: 2700 },
        senior: { low: 2600, median: 3400, high: 4600 },
      },
      "Cloud Engineer": {
        junior: { low: 700, median: 1050, high: 1450 },
        mid: { low: 1400, median: 1900, high: 2550 },
        senior: { low: 2400, median: 3200, high: 4300 },
      },
      "Data Scientist": {
        junior: { low: 600, median: 850, high: 1100 },
        mid: { low: 1000, median: 1400, high: 1900 },
        senior: { low: 1800, median: 2400, high: 3200 },
      },
      "Data Analyst": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1750 },
        senior: { low: 1500, median: 2000, high: 2600 },
      },
      "Machine Learning Engineer": {
        junior: { low: 700, median: 1000, high: 1350 },
        mid: { low: 1300, median: 1800, high: 2400 },
        senior: { low: 2200, median: 3000, high: 4000 },
      },
      "AI Engineer": {
        junior: { low: 800, median: 1150, high: 1500 },
        mid: { low: 1500, median: 2000, high: 2700 },
        senior: { low: 2600, median: 3400, high: 4500 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 800, median: 1150, high: 1550 },
        mid: { low: 1600, median: 2200, high: 3000 },
        senior: { low: 2800, median: 3600, high: 4800 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 600, median: 850, high: 1150 },
        mid: { low: 1100, median: 1550, high: 2050 },
        senior: { low: 1900, median: 2600, high: 3500 },
      },
      "IT Project Manager": {
        junior: { low: 750, median: 1050, high: 1450 },
        mid: { low: 1350, median: 1850, high: 2500 },
        senior: { low: 2200, median: 3000, high: 4000 },
      },
      "Product Manager": {
        junior: { low: 800, median: 1200, high: 1600 },
        mid: { low: 1500, median: 2000, high: 2700 },
        senior: { low: 2600, median: 3400, high: 4500 },
      },
      "Technical Architect": {
        junior: { low: 1000, median: 1450, high: 1950 },
        mid: { low: 1900, median: 2600, high: 3400 },
        senior: { low: 3200, median: 4300, high: 5700 },
      },
      "Solutions Architect": {
        junior: { low: 950, median: 1400, high: 1850 },
        mid: { low: 1800, median: 2450, high: 3250 },
        senior: { low: 3000, median: 4100, high: 5500 },
      },
      "QA Engineer": {
        junior: { low: 400, median: 550, high: 750 },
        mid: { low: 700, median: 950, high: 1300 },
        senior: { low: 1200, median: 1600, high: 2200 },
      },
      "Business Analyst (IT)": {
        junior: { low: 500, median: 700, high: 950 },
        mid: { low: 900, median: 1200, high: 1600 },
        senior: { low: 1500, median: 2000, high: 2700 },
      },
      "Digital Transformation Manager": {
        junior: { low: 850, median: 1200, high: 1600 },
        mid: { low: 1500, median: 2000, high: 2700 },
        senior: { low: 2500, median: 3300, high: 4400 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 650, median: 900, high: 1200 },
        mid: { low: 1100, median: 1500, high: 2000 },
        senior: { low: 1900, median: 2600, high: 3500 },
      },
      "Financial Analyst": {
        junior: { low: 550, median: 750, high: 950 },
        mid: { low: 850, median: 1050, high: 1350 },
        senior: { low: 1300, median: 1700, high: 2200 },
      },
      "Senior Financial Analyst": {
        junior: { low: 750, median: 1000, high: 1300 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2700, high: 3600 },
      },
      "Finance Manager": {
        junior: { low: 1200, median: 1600, high: 2000 },
        mid: { low: 1800, median: 2400, high: 3200 },
        senior: { low: 2800, median: 3600, high: 4800 },
      },
      "Financial Controller": {
        junior: { low: 1100, median: 1500, high: 1900 },
        mid: { low: 1700, median: 2300, high: 3000 },
        senior: { low: 2600, median: 3400, high: 4500 },
      },
      "CFO": {
        junior: { low: 3500, median: 4800, high: 6500 },
        mid: { low: 5500, median: 7000, high: 9500 },
        senior: { low: 8000, median: 11000, high: 15000 },
      },
      "Accountant": {
        junior: { low: 350, median: 480, high: 650 },
        mid: { low: 600, median: 800, high: 1050 },
        senior: { low: 950, median: 1300, high: 1750 },
      },
      "Senior Accountant": {
        junior: { low: 450, median: 620, high: 820 },
        mid: { low: 780, median: 1050, high: 1400 },
        senior: { low: 1250, median: 1700, high: 2250 },
      },
      "Auditor": {
        junior: { low: 380, median: 520, high: 700 },
        mid: { low: 650, median: 880, high: 1150 },
        senior: { low: 1050, median: 1450, high: 1950 },
      },
      "Risk Manager": {
        junior: { low: 900, median: 1200, high: 1600 },
        mid: { low: 1500, median: 2000, high: 2700 },
        senior: { low: 2600, median: 3500, high: 4700 },
      },
      "Investment Analyst": {
        junior: { low: 650, median: 900, high: 1200 },
        mid: { low: 1100, median: 1550, high: 2100 },
        senior: { low: 1900, median: 2700, high: 3700 },
      },
      "Treasury Manager": {
        junior: { low: 850, median: 1150, high: 1500 },
        mid: { low: 1400, median: 1900, high: 2500 },
        senior: { low: 2300, median: 3100, high: 4200 },
      },
      "FP&A Manager": {
        junior: { low: 1000, median: 1400, high: 1850 },
        mid: { low: 1650, median: 2200, high: 2950 },
        senior: { low: 2700, median: 3700, high: 5000 },
      },
      "Tax Manager": {
        junior: { low: 750, median: 1000, high: 1300 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Project Manager": {
        junior: { low: 700, median: 950, high: 1300 },
        mid: { low: 1300, median: 1700, high: 2300 },
        senior: { low: 2200, median: 2900, high: 3800 },
      },
      "Senior Project Manager": {
        junior: { low: 1000, median: 1400, high: 1850 },
        mid: { low: 1800, median: 2400, high: 3200 },
        senior: { low: 3000, median: 4000, high: 5300 },
      },
      "Program Manager": {
        junior: { low: 900, median: 1250, high: 1650 },
        mid: { low: 1600, median: 2150, high: 2850 },
        senior: { low: 2700, median: 3600, high: 4800 },
      },
      "Operations Manager": {
        junior: { low: 750, median: 1000, high: 1350 },
        mid: { low: 1300, median: 1750, high: 2300 },
        senior: { low: 2200, median: 2900, high: 3800 },
      },
      "General Manager": {
        junior: { low: 1500, median: 2100, high: 2800 },
        mid: { low: 2700, median: 3700, high: 5000 },
        senior: { low: 4500, median: 6500, high: 9000 },
      },
      "Business Development Manager": {
        junior: { low: 700, median: 1000, high: 1350 },
        mid: { low: 1300, median: 1750, high: 2350 },
        senior: { low: 2200, median: 3100, high: 4200 },
      },
      "Strategy Manager": {
        junior: { low: 900, median: 1250, high: 1650 },
        mid: { low: 1600, median: 2200, high: 2950 },
        senior: { low: 2700, median: 3700, high: 5000 },
      },
      "Management Consultant": {
        junior: { low: 850, median: 1200, high: 1600 },
        mid: { low: 1500, median: 2050, high: 2750 },
        senior: { low: 2500, median: 3600, high: 5000 },
      },
      "Marketing Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1100, median: 1400, high: 1900 },
        senior: { low: 1800, median: 2400, high: 3200 },
      },
      "Digital Marketing Manager": {
        junior: { low: 600, median: 850, high: 1100 },
        mid: { low: 1000, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Brand Manager": {
        junior: { low: 650, median: 900, high: 1200 },
        mid: { low: 1100, median: 1450, high: 1950 },
        senior: { low: 1800, median: 2500, high: 3300 },
      },
      "Content Marketing Manager": {
        junior: { low: 500, median: 700, high: 950 },
        mid: { low: 850, median: 1150, high: 1550 },
        senior: { low: 1400, median: 1900, high: 2600 },
      },
      "SEO Specialist": {
        junior: { low: 350, median: 500, high: 680 },
        mid: { low: 650, median: 880, high: 1200 },
        senior: { low: 1100, median: 1550, high: 2100 },
      },
      "Sales Manager": {
        junior: { low: 700, median: 950, high: 1300 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Key Account Manager": {
        junior: { low: 600, median: 850, high: 1150 },
        mid: { low: 1050, median: 1400, high: 1900 },
        senior: { low: 1700, median: 2300, high: 3100 },
      },
      "Regional Sales Director": {
        junior: { low: 1200, median: 1750, high: 2400 },
        mid: { low: 2200, median: 3000, high: 4100 },
        senior: { low: 3800, median: 5500, high: 7800 },
      },
      "HR Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 1000, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2000, high: 2600 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1650 },
        senior: { low: 1500, median: 1950, high: 2600 },
      },
      "HR Business Partner": {
        junior: { low: 580, median: 780, high: 1020 },
        mid: { low: 920, median: 1220, high: 1620 },
        senior: { low: 1450, median: 1900, high: 2550 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 750, median: 1000, high: 1300 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2700, high: 3600 },
      },
      "Learning & Development Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1650 },
        senior: { low: 1500, median: 2000, high: 2700 },
      },
      "Civil Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Mechanical Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Electrical Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Construction Project Manager": {
        junior: { low: 800, median: 1050, high: 1400 },
        mid: { low: 1400, median: 1900, high: 2500 },
        senior: { low: 2400, median: 3200, high: 4200 },
      },
      "Quantity Surveyor": {
        junior: { low: 500, median: 680, high: 900 },
        mid: { low: 820, median: 1100, high: 1480 },
        senior: { low: 1350, median: 1850, high: 2500 },
      },
      "HSE Manager": {
        junior: { low: 700, median: 900, high: 1200 },
        mid: { low: 1100, median: 1500, high: 2000 },
        senior: { low: 1800, median: 2400, high: 3200 },
      },
      "Architect": {
        junior: { low: 580, median: 780, high: 1050 },
        mid: { low: 950, median: 1300, high: 1750 },
        senior: { low: 1600, median: 2200, high: 3000 },
      },
      "Structural Engineer": {
        junior: { low: 580, median: 780, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Supply Chain Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Logistics Manager": {
        junior: { low: 580, median: 780, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Procurement Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 1000, median: 1350, high: 1800 },
        senior: { low: 1700, median: 2300, high: 3000 },
      },
      "Legal Counsel": {
        junior: { low: 800, median: 1100, high: 1400 },
        mid: { low: 1400, median: 1900, high: 2500 },
        senior: { low: 2400, median: 3200, high: 4200 },
      },
      "Compliance Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Sustainability Manager": {
        junior: { low: 650, median: 880, high: 1150 },
        mid: { low: 1050, median: 1400, high: 1850 },
        senior: { low: 1750, median: 2350, high: 3100 },
      },
      "Healthcare Administrator": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Registered Nurse": {
        junior: { low: 550, median: 700, high: 900 },
        mid: { low: 850, median: 1100, high: 1400 },
        senior: { low: 1300, median: 1700, high: 2200 },
      },
    }
  },

  'Bahrain': {
    currency: 'BHD',
    cities: ['Manama', 'Riffa', 'Muharraq'],
    roles: {
      "Software Engineer": {
        junior: { low: 650, median: 1050, high: 1450 },
        mid: { low: 1250, median: 1750, high: 2350 },
        senior: { low: 2000, median: 2700, high: 3700 },
      },
      "Senior Software Engineer": {
        junior: { low: 1000, median: 1500, high: 2000 },
        mid: { low: 1800, median: 2400, high: 3200 },
        senior: { low: 2800, median: 3600, high: 4800 },
      },
      "Full Stack Developer": {
        junior: { low: 600, median: 950, high: 1300 },
        mid: { low: 1100, median: 1550, high: 2100 },
        senior: { low: 1800, median: 2500, high: 3400 },
      },
      "Backend Developer": {
        junior: { low: 550, median: 880, high: 1200 },
        mid: { low: 1000, median: 1450, high: 1950 },
        senior: { low: 1650, median: 2300, high: 3150 },
      },
      "Frontend Developer": {
        junior: { low: 500, median: 800, high: 1100 },
        mid: { low: 900, median: 1300, high: 1750 },
        senior: { low: 1500, median: 2100, high: 2850 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 550, median: 880, high: 1200 },
        mid: { low: 1000, median: 1450, high: 1950 },
        senior: { low: 1650, median: 2300, high: 3150 },
      },
      "DevOps Engineer": {
        junior: { low: 650, median: 900, high: 1200 },
        mid: { low: 1150, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3500 },
      },
      "Cloud Engineer": {
        junior: { low: 600, median: 850, high: 1150 },
        mid: { low: 1050, median: 1500, high: 2000 },
        senior: { low: 1850, median: 2500, high: 3350 },
      },
      "Data Scientist": {
        junior: { low: 550, median: 750, high: 950 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Data Analyst": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 1000, high: 1300 },
        senior: { low: 1200, median: 1600, high: 2100 },
      },
      "Machine Learning Engineer": {
        junior: { low: 600, median: 850, high: 1150 },
        mid: { low: 1100, median: 1550, high: 2050 },
        senior: { low: 1850, median: 2500, high: 3350 },
      },
      "AI Engineer": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1200, median: 1700, high: 2300 },
        senior: { low: 2200, median: 2900, high: 3800 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1200, median: 1650, high: 2200 },
        senior: { low: 2100, median: 2700, high: 3600 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 500, median: 700, high: 950 },
        mid: { low: 850, median: 1200, high: 1600 },
        senior: { low: 1450, median: 2000, high: 2700 },
      },
      "IT Project Manager": {
        junior: { low: 650, median: 900, high: 1200 },
        mid: { low: 1100, median: 1550, high: 2050 },
        senior: { low: 1850, median: 2500, high: 3350 },
      },
      "Product Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Technical Architect": {
        junior: { low: 900, median: 1250, high: 1650 },
        mid: { low: 1600, median: 2200, high: 2950 },
        senior: { low: 2700, median: 3600, high: 4800 },
      },
      "Solutions Architect": {
        junior: { low: 850, median: 1200, high: 1600 },
        mid: { low: 1500, median: 2050, high: 2750 },
        senior: { low: 2500, median: 3400, high: 4600 },
      },
      "QA Engineer": {
        junior: { low: 350, median: 480, high: 650 },
        mid: { low: 600, median: 820, high: 1100 },
        senior: { low: 1000, median: 1400, high: 1900 },
      },
      "Business Analyst (IT)": {
        junior: { low: 420, median: 580, high: 780 },
        mid: { low: 750, median: 1020, high: 1380 },
        senior: { low: 1250, median: 1750, high: 2350 },
      },
      "Digital Transformation Manager": {
        junior: { low: 750, median: 1000, high: 1350 },
        mid: { low: 1250, median: 1700, high: 2250 },
        senior: { low: 2100, median: 2800, high: 3750 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 550, median: 750, high: 1000 },
        mid: { low: 900, median: 1250, high: 1650 },
        senior: { low: 1550, median: 2150, high: 2900 },
      },
      "Financial Analyst": {
        junior: { low: 450, median: 600, high: 750 },
        mid: { low: 700, median: 900, high: 1150 },
        senior: { low: 1100, median: 1400, high: 1800 },
      },
      "Senior Financial Analyst": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1300, high: 1700 },
        senior: { low: 1600, median: 2100, high: 2800 },
      },
      "Finance Manager": {
        junior: { low: 900, median: 1200, high: 1500 },
        mid: { low: 1400, median: 1800, high: 2300 },
        senior: { low: 2200, median: 2800, high: 3600 },
      },
      "Financial Controller": {
        junior: { low: 800, median: 1100, high: 1400 },
        mid: { low: 1300, median: 1700, high: 2200 },
        senior: { low: 2100, median: 2700, high: 3500 },
      },
      "CFO": {
        junior: { low: 2500, median: 3200, high: 4200 },
        mid: { low: 3800, median: 4800, high: 6200 },
        senior: { low: 5500, median: 7000, high: 9000 },
      },
      "Accountant": {
        junior: { low: 280, median: 380, high: 520 },
        mid: { low: 480, median: 650, high: 880 },
        senior: { low: 800, median: 1100, high: 1500 },
      },
      "Senior Accountant": {
        junior: { low: 360, median: 490, high: 660 },
        mid: { low: 620, median: 850, high: 1150 },
        senior: { low: 1050, median: 1450, high: 1950 },
      },
      "Auditor": {
        junior: { low: 300, median: 410, high: 560 },
        mid: { low: 520, median: 710, high: 960 },
        senior: { low: 880, median: 1220, high: 1650 },
      },
      "Risk Manager": {
        junior: { low: 750, median: 1000, high: 1300 },
        mid: { low: 1200, median: 1600, high: 2100 },
        senior: { low: 2000, median: 2650, high: 3550 },
      },
      "Investment Analyst": {
        junior: { low: 550, median: 750, high: 980 },
        mid: { low: 880, median: 1200, high: 1600 },
        senior: { low: 1500, median: 2050, high: 2800 },
      },
      "Treasury Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1150, median: 1550, high: 2050 },
        senior: { low: 1900, median: 2550, high: 3400 },
      },
      "FP&A Manager": {
        junior: { low: 820, median: 1100, high: 1450 },
        mid: { low: 1320, median: 1780, high: 2350 },
        senior: { low: 2200, median: 2950, high: 3950 },
      },
      "Tax Manager": {
        junior: { low: 600, median: 800, high: 1000 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1600, median: 2100, high: 2700 },
      },
      "Project Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "Senior Project Manager": {
        junior: { low: 850, median: 1150, high: 1500 },
        mid: { low: 1350, median: 1800, high: 2350 },
        senior: { low: 2150, median: 2850, high: 3800 },
      },
      "Program Manager": {
        junior: { low: 800, median: 1050, high: 1400 },
        mid: { low: 1250, median: 1700, high: 2250 },
        senior: { low: 2000, median: 2700, high: 3600 },
      },
      "Operations Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "General Manager": {
        junior: { low: 1200, median: 1650, high: 2200 },
        mid: { low: 2000, median: 2750, high: 3700 },
        senior: { low: 3200, median: 4500, high: 6200 },
      },
      "Business Development Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1650 },
        senior: { low: 1550, median: 2100, high: 2850 },
      },
      "Strategy Manager": {
        junior: { low: 800, median: 1050, high: 1400 },
        mid: { low: 1250, median: 1700, high: 2250 },
        senior: { low: 2000, median: 2700, high: 3600 },
      },
      "Management Consultant": {
        junior: { low: 750, median: 1000, high: 1350 },
        mid: { low: 1200, median: 1650, high: 2200 },
        senior: { low: 2000, median: 2800, high: 3800 },
      },
      "Marketing Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "Digital Marketing Manager": {
        junior: { low: 500, median: 700, high: 900 },
        mid: { low: 850, median: 1100, high: 1400 },
        senior: { low: 1300, median: 1600, high: 2100 },
      },
      "Brand Manager": {
        junior: { low: 580, median: 780, high: 1030 },
        mid: { low: 920, median: 1230, high: 1630 },
        senior: { low: 1480, median: 1980, high: 2630 },
      },
      "Content Marketing Manager": {
        junior: { low: 420, median: 580, high: 780 },
        mid: { low: 720, median: 970, high: 1300 },
        senior: { low: 1150, median: 1600, high: 2150 },
      },
      "SEO Specialist": {
        junior: { low: 300, median: 420, high: 580 },
        mid: { low: 550, median: 750, high: 1020 },
        senior: { low: 900, median: 1280, high: 1750 },
      },
      "Sales Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "Key Account Manager": {
        junior: { low: 520, median: 720, high: 960 },
        mid: { low: 830, median: 1120, high: 1500 },
        senior: { low: 1320, median: 1800, high: 2420 },
      },
      "Regional Sales Director": {
        junior: { low: 1000, median: 1400, high: 1900 },
        mid: { low: 1750, median: 2400, high: 3250 },
        senior: { low: 2900, median: 4200, high: 5800 },
      },
      "HR Manager": {
        junior: { low: 550, median: 750, high: 950 },
        mid: { low: 850, median: 1100, high: 1400 },
        senior: { low: 1300, median: 1700, high: 2200 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 950, high: 1200 },
        senior: { low: 1100, median: 1400, high: 1800 },
      },
      "HR Business Partner": {
        junior: { low: 480, median: 630, high: 830 },
        mid: { low: 720, median: 930, high: 1180 },
        senior: { low: 1070, median: 1380, high: 1780 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 650, median: 880, high: 1150 },
        mid: { low: 1050, median: 1400, high: 1850 },
        senior: { low: 1700, median: 2250, high: 3000 },
      },
      "Learning & Development Manager": {
        junior: { low: 500, median: 670, high: 880 },
        mid: { low: 780, median: 1050, high: 1400 },
        senior: { low: 1250, median: 1700, high: 2300 },
      },
      "Civil Engineer": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 1000, high: 1300 },
        senior: { low: 1200, median: 1500, high: 2000 },
      },
      "Mechanical Engineer": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 1000, high: 1300 },
        senior: { low: 1200, median: 1500, high: 2000 },
      },
      "Electrical Engineer": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 1000, high: 1300 },
        senior: { low: 1200, median: 1500, high: 2000 },
      },
      "Construction Project Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 1000, median: 1400, high: 1800 },
        senior: { low: 1800, median: 2400, high: 3100 },
      },
      "Quantity Surveyor": {
        junior: { low: 420, median: 570, high: 760 },
        mid: { low: 660, median: 900, high: 1210 },
        senior: { low: 1050, median: 1450, high: 1950 },
      },
      "HSE Manager": {
        junior: { low: 550, median: 700, high: 900 },
        mid: { low: 850, median: 1100, high: 1400 },
        senior: { low: 1300, median: 1700, high: 2200 },
      },
      "Architect": {
        junior: { low: 480, median: 640, high: 850 },
        mid: { low: 730, median: 1000, high: 1340 },
        senior: { low: 1180, median: 1650, high: 2250 },
      },
      "Structural Engineer": {
        junior: { low: 480, median: 640, high: 850 },
        mid: { low: 730, median: 1000, high: 1300 },
        senior: { low: 1180, median: 1550, high: 2100 },
      },
      "Supply Chain Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "Logistics Manager": {
        junior: { low: 480, median: 650, high: 860 },
        mid: { low: 760, median: 1030, high: 1380 },
        senior: { low: 1220, median: 1680, high: 2260 },
      },
      "Procurement Manager": {
        junior: { low: 550, median: 700, high: 900 },
        mid: { low: 800, median: 1050, high: 1350 },
        senior: { low: 1200, median: 1600, high: 2100 },
      },
      "Legal Counsel": {
        junior: { low: 700, median: 900, high: 1150 },
        mid: { low: 1100, median: 1400, high: 1800 },
        senior: { low: 1800, median: 2400, high: 3100 },
      },
      "Compliance Manager": {
        junior: { low: 550, median: 750, high: 950 },
        mid: { low: 900, median: 1150, high: 1500 },
        senior: { low: 1400, median: 1800, high: 2300 },
      },
      "Sustainability Manager": {
        junior: { low: 520, median: 700, high: 920 },
        mid: { low: 830, median: 1100, high: 1460 },
        senior: { low: 1350, median: 1800, high: 2400 },
      },
      "Healthcare Administrator": {
        junior: { low: 450, median: 600, high: 750 },
        mid: { low: 700, median: 900, high: 1150 },
        senior: { low: 1100, median: 1400, high: 1800 },
      },
      "Registered Nurse": {
        junior: { low: 400, median: 500, high: 650 },
        mid: { low: 600, median: 750, high: 950 },
        senior: { low: 850, median: 1100, high: 1400 },
      },
    }
  },

  'Oman': {
    currency: 'OMR',
    cities: ['Muscat', 'Salalah', 'Sohar'],
    roles: {
      "Software Engineer": {
        junior: { low: 750, median: 1250, high: 1750 },
        mid: { low: 1350, median: 1950, high: 2700 },
        senior: { low: 2100, median: 3100, high: 4300 },
      },
      "Senior Software Engineer": {
        junior: { low: 1100, median: 1600, high: 2100 },
        mid: { low: 1800, median: 2500, high: 3300 },
        senior: { low: 2800, median: 3800, high: 5200 },
      },
      "Full Stack Developer": {
        junior: { low: 680, median: 1100, high: 1550 },
        mid: { low: 1220, median: 1780, high: 2450 },
        senior: { low: 1950, median: 2850, high: 3950 },
      },
      "Backend Developer": {
        junior: { low: 620, median: 1020, high: 1440 },
        mid: { low: 1120, median: 1640, high: 2270 },
        senior: { low: 1800, median: 2650, high: 3680 },
      },
      "Frontend Developer": {
        junior: { low: 580, median: 950, high: 1340 },
        mid: { low: 1030, median: 1510, high: 2090 },
        senior: { low: 1650, median: 2430, high: 3380 },
      },
      "Mobile App Developer (iOS/Android)": {
        junior: { low: 620, median: 1020, high: 1440 },
        mid: { low: 1120, median: 1640, high: 2270 },
        senior: { low: 1800, median: 2650, high: 3680 },
      },
      "DevOps Engineer": {
        junior: { low: 750, median: 1050, high: 1400 },
        mid: { low: 1250, median: 1750, high: 2400 },
        senior: { low: 2200, median: 3000, high: 4000 },
      },
      "Cloud Engineer": {
        junior: { low: 700, median: 1000, high: 1350 },
        mid: { low: 1170, median: 1650, high: 2280 },
        senior: { low: 2050, median: 2850, high: 3850 },
      },
      "Data Scientist": {
        junior: { low: 600, median: 900, high: 1200 },
        mid: { low: 1100, median: 1500, high: 2000 },
        senior: { low: 1900, median: 2500, high: 3300 },
      },
      "Data Analyst": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 900, median: 1200, high: 1600 },
        senior: { low: 1400, median: 1800, high: 2400 },
      },
      "Machine Learning Engineer": {
        junior: { low: 680, median: 980, high: 1320 },
        mid: { low: 1220, median: 1720, high: 2360 },
        senior: { low: 2050, median: 2900, high: 3950 },
      },
      "AI Engineer": {
        junior: { low: 800, median: 1100, high: 1450 },
        mid: { low: 1400, median: 1900, high: 2600 },
        senior: { low: 2400, median: 3200, high: 4300 },
      },
      "Cybersecurity Engineer": {
        junior: { low: 800, median: 1100, high: 1450 },
        mid: { low: 1400, median: 1900, high: 2600 },
        senior: { low: 2400, median: 3200, high: 4300 },
      },
      "Cybersecurity Analyst": {
        junior: { low: 580, median: 820, high: 1100 },
        mid: { low: 1020, median: 1440, high: 1980 },
        senior: { low: 1730, median: 2430, high: 3320 },
      },
      "IT Project Manager": {
        junior: { low: 720, median: 1020, high: 1380 },
        mid: { low: 1220, median: 1730, high: 2380 },
        senior: { low: 2050, median: 2900, high: 3950 },
      },
      "Product Manager": {
        junior: { low: 750, median: 1050, high: 1400 },
        mid: { low: 1250, median: 1750, high: 2400 },
        senior: { low: 2200, median: 3000, high: 4000 },
      },
      "Technical Architect": {
        junior: { low: 950, median: 1350, high: 1800 },
        mid: { low: 1700, median: 2350, high: 3150 },
        senior: { low: 2850, median: 3950, high: 5350 },
      },
      "Solutions Architect": {
        junior: { low: 900, median: 1280, high: 1720 },
        mid: { low: 1620, median: 2250, high: 3020 },
        senior: { low: 2700, median: 3780, high: 5130 },
      },
      "QA Engineer": {
        junior: { low: 380, median: 530, high: 720 },
        mid: { low: 660, median: 920, high: 1250 },
        senior: { low: 1100, median: 1550, high: 2120 },
      },
      "Business Analyst (IT)": {
        junior: { low: 460, median: 650, high: 880 },
        mid: { low: 820, median: 1160, high: 1580 },
        senior: { low: 1400, median: 1980, high: 2720 },
      },
      "Digital Transformation Manager": {
        junior: { low: 800, median: 1100, high: 1480 },
        mid: { low: 1380, median: 1920, high: 2620 },
        senior: { low: 2320, median: 3220, high: 4380 },
      },
      "ERP Consultant (SAP/Oracle)": {
        junior: { low: 600, median: 850, high: 1150 },
        mid: { low: 1000, median: 1420, high: 1940 },
        senior: { low: 1720, median: 2440, high: 3340 },
      },
      "Financial Analyst": {
        junior: { low: 500, median: 700, high: 900 },
        mid: { low: 800, median: 1050, high: 1350 },
        senior: { low: 1200, median: 1600, high: 2000 },
      },
      "Senior Financial Analyst": {
        junior: { low: 660, median: 920, high: 1200 },
        mid: { low: 1060, median: 1440, high: 1900 },
        senior: { low: 1700, median: 2300, high: 3100 },
      },
      "Finance Manager": {
        junior: { low: 1000, median: 1400, high: 1800 },
        mid: { low: 1600, median: 2100, high: 2700 },
        senior: { low: 2400, median: 3100, high: 4000 },
      },
      "Financial Controller": {
        junior: { low: 900, median: 1200, high: 1500 },
        mid: { low: 1400, median: 1800, high: 2300 },
        senior: { low: 2100, median: 2700, high: 3500 },
      },
      "CFO": {
        junior: { low: 2800, median: 3600, high: 4600 },
        mid: { low: 4200, median: 5200, high: 6600 },
        senior: { low: 6000, median: 7600, high: 9800 },
      },
      "Accountant": {
        junior: { low: 320, median: 440, high: 600 },
        mid: { low: 560, median: 770, high: 1050 },
        senior: { low: 950, median: 1320, high: 1800 },
      },
      "Senior Accountant": {
        junior: { low: 420, median: 580, high: 790 },
        mid: { low: 740, median: 1020, high: 1390 },
        senior: { low: 1260, median: 1750, high: 2390 },
      },
      "Auditor": {
        junior: { low: 350, median: 490, high: 670 },
        mid: { low: 620, median: 860, high: 1170 },
        senior: { low: 1050, median: 1460, high: 2000 },
      },
      "Risk Manager": {
        junior: { low: 800, median: 1100, high: 1450 },
        mid: { low: 1350, median: 1850, high: 2500 },
        senior: { low: 2250, median: 3050, high: 4150 },
      },
      "Investment Analyst": {
        junior: { low: 600, median: 840, high: 1120 },
        mid: { low: 1000, median: 1400, high: 1900 },
        senior: { low: 1700, median: 2380, high: 3280 },
      },
      "Treasury Manager": {
        junior: { low: 760, median: 1060, high: 1400 },
        mid: { low: 1280, median: 1780, high: 2420 },
        senior: { low: 2150, median: 2950, high: 4000 },
      },
      "FP&A Manager": {
        junior: { low: 880, median: 1240, high: 1640 },
        mid: { low: 1480, median: 2040, high: 2760 },
        senior: { low: 2500, median: 3400, high: 4600 },
      },
      "Tax Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 1000, median: 1300, high: 1600 },
        senior: { low: 1600, median: 2100, high: 2700 },
      },
      "Project Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1100, median: 1450, high: 1900 },
        senior: { low: 1800, median: 2400, high: 3100 },
      },
      "Senior Project Manager": {
        junior: { low: 950, median: 1320, high: 1750 },
        mid: { low: 1580, median: 2180, high: 2900 },
        senior: { low: 2650, median: 3650, high: 4950 },
      },
      "Program Manager": {
        junior: { low: 880, median: 1230, high: 1630 },
        mid: { low: 1480, median: 2040, high: 2740 },
        senior: { low: 2480, median: 3430, high: 4660 },
      },
      "Operations Manager": {
        junior: { low: 700, median: 950, high: 1250 },
        mid: { low: 1100, median: 1450, high: 1900 },
        senior: { low: 1800, median: 2400, high: 3100 },
      },
      "General Manager": {
        junior: { low: 1400, median: 1950, high: 2600 },
        mid: { low: 2350, median: 3250, high: 4400 },
        senior: { low: 3950, median: 5650, high: 7900 },
      },
      "Business Development Manager": {
        junior: { low: 680, median: 950, high: 1260 },
        mid: { low: 1140, median: 1580, high: 2140 },
        senior: { low: 1920, median: 2700, high: 3700 },
      },
      "Strategy Manager": {
        junior: { low: 880, median: 1230, high: 1630 },
        mid: { low: 1480, median: 2040, high: 2740 },
        senior: { low: 2480, median: 3430, high: 4660 },
      },
      "Management Consultant": {
        junior: { low: 820, median: 1160, high: 1550 },
        mid: { low: 1390, median: 1940, high: 2640 },
        senior: { low: 2350, median: 3320, high: 4580 },
      },
      "Marketing Manager": {
        junior: { low: 650, median: 900, high: 1150 },
        mid: { low: 1000, median: 1300, high: 1700 },
        senior: { low: 1700, median: 2200, high: 2800 },
      },
      "Digital Marketing Manager": {
        junior: { low: 550, median: 750, high: 950 },
        mid: { low: 850, median: 1100, high: 1400 },
        senior: { low: 1400, median: 1800, high: 2300 },
      },
      "Brand Manager": {
        junior: { low: 620, median: 870, high: 1160 },
        mid: { low: 1020, median: 1380, high: 1840 },
        senior: { low: 1740, median: 2360, high: 3140 },
      },
      "Content Marketing Manager": {
        junior: { low: 460, median: 650, high: 870 },
        mid: { low: 760, median: 1040, high: 1400 },
        senior: { low: 1280, median: 1780, high: 2420 },
      },
      "SEO Specialist": {
        junior: { low: 320, median: 460, high: 640 },
        mid: { low: 580, median: 820, high: 1130 },
        senior: { low: 1000, median: 1450, high: 2020 },
      },
      "Sales Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1600, median: 2100, high: 2700 },
      },
      "Key Account Manager": {
        junior: { low: 560, median: 780, high: 1050 },
        mid: { low: 860, median: 1170, high: 1580 },
        senior: { low: 1460, median: 2020, high: 2780 },
      },
      "Regional Sales Director": {
        junior: { low: 1100, median: 1580, high: 2160 },
        mid: { low: 1960, median: 2800, high: 3900 },
        senior: { low: 3380, median: 5020, high: 7180 },
      },
      "HR Manager": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 950, median: 1200, high: 1550 },
        senior: { low: 1500, median: 1900, high: 2400 },
      },
      "Talent Acquisition Manager": {
        junior: { low: 550, median: 700, high: 900 },
        mid: { low: 800, median: 1050, high: 1350 },
        senior: { low: 1200, median: 1600, high: 2000 },
      },
      "HR Business Partner": {
        junior: { low: 530, median: 680, high: 880 },
        mid: { low: 770, median: 1030, high: 1330 },
        senior: { low: 1160, median: 1580, high: 2060 },
      },
      "Compensation & Benefits Manager": {
        junior: { low: 700, median: 970, high: 1300 },
        mid: { low: 1160, median: 1600, high: 2160 },
        senior: { low: 1960, median: 2700, high: 3680 },
      },
      "Learning & Development Manager": {
        junior: { low: 560, median: 760, high: 1010 },
        mid: { low: 860, median: 1170, high: 1580 },
        senior: { low: 1460, median: 2020, high: 2760 },
      },
      "Civil Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 900, median: 1200, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2500 },
      },
      "Mechanical Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 900, median: 1200, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2500 },
      },
      "Electrical Engineer": {
        junior: { low: 600, median: 800, high: 1050 },
        mid: { low: 900, median: 1200, high: 1600 },
        senior: { low: 1500, median: 1900, high: 2500 },
      },
      "Construction Project Manager": {
        junior: { low: 750, median: 1000, high: 1300 },
        mid: { low: 1150, median: 1500, high: 2000 },
        senior: { low: 2000, median: 2600, high: 3400 },
      },
      "Quantity Surveyor": {
        junior: { low: 480, median: 660, high: 900 },
        mid: { low: 780, median: 1080, high: 1480 },
        senior: { low: 1320, median: 1840, high: 2560 },
      },
      "HSE Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1600, median: 2000, high: 2600 },
      },
      "Architect": {
        junior: { low: 560, median: 760, high: 1030 },
        mid: { low: 860, median: 1180, high: 1620 },
        senior: { low: 1480, median: 2100, high: 2920 },
      },
      "Structural Engineer": {
        junior: { low: 560, median: 760, high: 1030 },
        mid: { low: 860, median: 1180, high: 1580 },
        senior: { low: 1480, median: 2000, high: 2740 },
      },
      "Supply Chain Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1600, median: 2000, high: 2600 },
      },
      "Logistics Manager": {
        junior: { low: 520, median: 720, high: 980 },
        mid: { low: 820, median: 1140, high: 1560 },
        senior: { low: 1400, median: 1960, high: 2720 },
      },
      "Procurement Manager": {
        junior: { low: 600, median: 750, high: 950 },
        mid: { low: 800, median: 1050, high: 1400 },
        senior: { low: 1300, median: 1700, high: 2200 },
      },
      "Legal Counsel": {
        junior: { low: 750, median: 1050, high: 1400 },
        mid: { low: 1250, median: 1700, high: 2300 },
        senior: { low: 2150, median: 2950, high: 4000 },
      },
      "Compliance Manager": {
        junior: { low: 650, median: 850, high: 1100 },
        mid: { low: 950, median: 1250, high: 1600 },
        senior: { low: 1600, median: 2000, high: 2600 },
      },
      "Sustainability Manager": {
        junior: { low: 620, median: 830, high: 1100 },
        mid: { low: 920, median: 1240, high: 1660 },
        senior: { low: 1560, median: 2120, high: 2900 },
      },
      "Healthcare Administrator": {
        junior: { low: 500, median: 650, high: 850 },
        mid: { low: 750, median: 1000, high: 1300 },
        senior: { low: 1200, median: 1500, high: 2000 },
      },
      "Registered Nurse": {
        junior: { low: 450, median: 550, high: 700 },
        mid: { low: 650, median: 800, high: 1000 },
        senior: { low: 900, median: 1150, high: 1500 },
      },
    }
  },
};

// Fallback for any missing role
export const DEFAULT_SALARY_RANGE: SalaryRange = { low: 12000, median: 20000, high: 28000 };

export const GCC_COUNTRIES = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'Qatar', name: 'Qatar', flag: '🇶🇦' },
  { code: 'Kuwait', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'Bahrain', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'Oman', name: 'Oman', flag: '🇴🇲' },
];

export function getSalaryRange(country: string, role: string, level: string): SalaryRange {
  const countryData = GCC_SALARY_DATA[country];
  if (!countryData) return DEFAULT_SALARY_RANGE;

  const roleData = countryData.roles[role];
  if (!roleData) return DEFAULT_SALARY_RANGE;

  const levelKey = level.toLowerCase().includes('junior') ? 'junior' :
                   level.toLowerCase().includes('senior') ? 'senior' : 'mid';

  return roleData[levelKey] || DEFAULT_SALARY_RANGE;
}
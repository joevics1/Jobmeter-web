// lib/gccData.ts
export type SalaryBand = {
  low: number;
  median: number;
  high: number;
};

export type RoleData = {
  junior: SalaryBand;
  mid: SalaryBand;
  senior: SalaryBand;
};

export type CountryData = {
  name: string;
  flag: string;
  currency: string;
  cities: string[];
  defaults: SalaryBand;
  colSingle: number;        // Monthly COL estimate (excl. rent)
  colFamily: number;
  visaEase: number;         // 1-10 (lower = easier)
  familySponsorMin: string;
  gratuity: string;
  expatScore: number;
  roles: Record<string, RoleData>;
};

export const GCC_SALARY_DATA: Record<string, CountryData> = {
  'UAE': {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    defaults: { low: 10000, median: 15000, high: 22000 },
    colSingle: 6500,
    colFamily: 14500,
    visaEase: 3,
    familySponsorMin: 'AED 4,000',
    gratuity: '21 days (1-5 yrs) → 30 days (5+ yrs), capped at 2 years',
    expatScore: 92,
    roles: {
      "Software Engineer": { junior: {low:12000,median:17500,high:22000}, mid:{low:18000,median:22000,high:35000}, senior:{low:35000,median:45000,high:65000} },
      "Senior Software Engineer": { junior: {low:18000,median:25000,high:35000}, mid:{low:28000,median:35000,high:50000}, senior:{low:45000,median:58000,high:75000} },
      "Full Stack Developer": { junior: {low:13000,median:19000,high:25000}, mid:{low:20000,median:25000,high:32000}, senior:{low:32000,median:40000,high:48000} },
      "Backend Developer": { junior: {low:11000,median:17000,high:23000}, mid:{low:18000,median:23000,high:30000}, senior:{low:30000,median:38000,high:45000} },
      "Frontend Developer": { junior: {low:10000,median:16000,high:21000}, mid:{low:17000,median:21000,high:28000}, senior:{low:28000,median:35000,high:42000} },
      "Mobile App Developer": { junior: {low:12000,median:18000,high:24000}, mid:{low:19000,median:24000,high:32000}, senior:{low:32000,median:41000,high:50000} },
      "DevOps Engineer": { junior: {low:14000,median:22000,high:30000}, mid:{low:23000,median:30000,high:40000}, senior:{low:40000,median:50000,high:60000} },
      "Cloud Engineer": { junior: {low:13000,median:21000,high:28000}, mid:{low:22000,median:28000,high:35000}, senior:{low:35000,median:45000,high:55000} },
      "Data Scientist": { junior: {low:15000,median:22000,high:30000}, mid:{low:22000,median:30000,high:45000}, senior:{low:45000,median:60000,high:70000} },
      "Machine Learning Engineer": { junior: {low:16000,median:25000,high:35000}, mid:{low:25000,median:35000,high:50000}, senior:{low:50000,median:65000,high:80000} },
      "AI Engineer": { junior: {low:18000,median:28000,high:40000}, mid:{low:28000,median:40000,high:60000}, senior:{low:55000,median:75000,high:90000} },
      "Cybersecurity Engineer": { junior: {low:14000,median:22000,high:32000}, mid:{low:23000,median:32000,high:45000}, senior:{low:40000,median:55000,high:70000} },
      "IT Project Manager": { junior: {low:14000,median:22000,high:30000}, mid:{low:23000,median:30000,high:40000}, senior:{low:40000,median:50000,high:60000} },
      "Product Manager": { junior: {low:16000,median:25000,high:35000}, mid:{low:26000,median:35000,high:45000}, senior:{low:45000,median:60000,high:75000} },
      "Financial Analyst": { junior: {low:8000,median:12500,high:16000}, mid:{low:13000,median:18000,high:25000}, senior:{low:20000,median:28000,high:35000} },
      "Finance Manager": { junior: {low:12000,median:20000,high:28000}, mid:{low:21000,median:28000,high:38000}, senior:{low:38000,median:48000,high:55000} },
      "Project Manager": { junior: {low:14000,median:22000,high:30000}, mid:{low:23000,median:32000,high:42000}, senior:{low:40000,median:52000,high:62000} },
      "Marketing Manager": { junior: {low:12000,median:19000,high:26000}, mid:{low:20000,median:26000,high:35000}, senior:{low:35000,median:45000,high:55000} },
      "HR Manager": { junior: {low:12000,median:19000,high:25000}, mid:{low:20000,median:25000,high:35000}, senior:{low:35000,median:45000,high:52000} },
      "Civil Engineer": { junior: {low:9000,median:15000,high:20000}, mid:{low:16000,median:20000,high:28000}, senior:{low:28000,median:37000,high:45000} },
      // Add more as needed from your full list
    }
  },

  'KSA': {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    cities: ['Riyadh', 'Jeddah', 'Dammam'],
    defaults: { low: 8500, median: 13000, high: 19000 },
    colSingle: 5800,
    colFamily: 13200,
    visaEase: 5,
    familySponsorMin: 'SAR 5,000+',
    gratuity: '15–30 days based on service length',
    expatScore: 86,
    roles: {
      "Software Engineer": { junior: {low:9500,median:15500,high:22000}, mid:{low:18000,median:26500,high:36000}, senior:{low:32000,median:45000,high:62000} },
      "Senior Software Engineer": { junior: {low:15000,median:22000,high:30000}, mid:{low:28000,median:38000,high:50000}, senior:{low:45000,median:58000,high:75000} },
      "Full Stack Developer": { junior: {low:8500,median:14000,high:20000}, mid:{low:16000,median:23000,high:32000}, senior:{low:30000,median:42000,high:58000} },
      "Data Scientist": { junior: {low:12000,median:19000,high:26000}, mid:{low:24000,median:34000,high:47000}, senior:{low:40000,median:52000,high:70000} },
      "AI Engineer": { junior: {low:12000,median:18500,high:26000}, mid:{low:24000,median:34000,high:46000}, senior:{low:42000,median:58000,high:80000} },
      "Financial Analyst": { junior: {low:7000,median:10500,high:14500}, mid:{low:13000,median:18500,high:24500}, senior:{low:20000,median:27500,high:36000} },
      "Finance Manager": { junior: {low:15000,median:21000,high:27000}, mid:{low:24000,median:32000,high:42000}, senior:{low:40000,median:55000,high:75000} },
      // ... (you can continue expanding)
    }
  },

  'Qatar': {
    name: 'Qatar',
    flag: '🇶🇦',
    currency: 'QAR',
    cities: ['Doha', 'Al Rayyan', 'Lusail'],
    defaults: { low: 10000, median: 15000, high: 22000 },
    colSingle: 6200,
    colFamily: 13800,
    visaEase: 4,
    familySponsorMin: 'QAR 10,000',
    gratuity: '21 days per year',
    expatScore: 88,
    roles: {
      "Software Engineer": { junior: {low:10500,median:16500,high:23000}, mid:{low:20000,median:27500,high:37000}, senior:{low:34000,median:46000,high:62000} },
      "AI Engineer": { junior: {low:14000,median:21000,high:28000}, mid:{low:26000,median:35000,high:48000}, senior:{low:45000,median:58000,high:75000} },
      "Finance Manager": { junior: {low:18000,median:24000,high:30000}, mid:{low:25000,median:32000,high:42000}, senior:{low:38000,median:48000,high:65000} },
      // Add remaining from your Qatar block
    }
  },

  'Kuwait': {
    name: 'Kuwait',
    flag: '🇰🇼',
    currency: 'KWD',
    cities: ['Kuwait City', 'Hawally', 'Salmiya'],
    defaults: { low: 550, median: 700, high: 1200 },
    colSingle: 5500,
    colFamily: 12500,
    visaEase: 6,
    familySponsorMin: 'High threshold',
    gratuity: '30 days per year (generous)',
    expatScore: 78,
    roles: {
      "Software Engineer": { junior: {low:750,median:1150,high:1550}, mid:{low:1350,median:1850,high:2550}, senior:{low:2200,median:2950,high:4000} },
      // ... (rest from your Kuwait block)
    }
  },

  'Oman': {
    name: 'Oman',
    flag: '🇴🇲',
    currency: 'OMR',
    cities: ['Muscat', 'Salalah'],
    defaults: { low: 600, median: 900, high: 1400 },
    colSingle: 4200,
    colFamily: 9800,
    visaEase: 4,
    familySponsorMin: 'OMR 600+',
    gratuity: '30 days per year (very generous)',
    expatScore: 84,
    roles: {
      "Software Engineer": { junior: {low:750,median:1250,high:1750}, mid:{low:1350,median:1950,high:2700}, senior:{low:2100,median:3100,high:4300} },
      // ... (rest from your Oman block)
    }
  },

  'Bahrain': {
    name: 'Bahrain',
    flag: '🇧🇭',
    currency: 'BHD',
    cities: ['Manama', 'Riffa'],
    defaults: { low: 400, median: 600, high: 1000 },
    colSingle: 4800,
    colFamily: 11000,
    visaEase: 3,
    familySponsorMin: 'BHD 800+',
    gratuity: '30 days per year',
    expatScore: 87,
    roles: {
      "Software Engineer": { junior: {low:650,median:1050,high:1450}, mid:{low:1250,median:1750,high:2350}, senior:{low:2000,median:2700,high:3700} },
      // ... (rest from your Bahrain block)
    }
  },
};

export const GCC_COUNTRIES = Object.entries(GCC_SALARY_DATA).map(([code, data]) => ({
  code,
  ...data,
}));

export function getSalaryRange(country: string, role: string, seniority: string): SalaryBand {
  const countryData = GCC_SALARY_DATA[country];
  if (!countryData) return { low: 8000, median: 12000, high: 18000 };

  const roleData = countryData.roles[role];
  if (!roleData) return countryData.defaults;

  const level = seniority.toLowerCase().includes('junior') 
    ? 'junior' 
    : seniority.toLowerCase().includes('senior') || seniority.includes('Lead') || seniority.includes('Director')
    ? 'senior' 
    : 'mid';

  return roleData[level] || countryData.defaults;
}
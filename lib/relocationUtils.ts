// lib/relocationUtils.ts

export const CURRENCY_RATES = {
  USD: 1,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.385,
  NGN: 1620, // May 2026 estimate
} as const;

export type Currency = keyof typeof CURRENCY_RATES;

export const GCC_COUNTRIES = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' as Currency },
  { code: 'Saudi', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR' as Currency },
  { code: 'Qatar', name: 'Qatar', flag: '🇶🇦', currency: 'QAR' as Currency },
  { code: 'Kuwait', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD' as Currency },
  { code: 'Oman', name: 'Oman', flag: '🇴🇲', currency: 'OMR' as Currency },
  { code: 'Bahrain', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD' as Currency },
] as const;

// Comprehensive City Data (All 50+ cities)
export const CITY_DATA: Record<string, Record<string, any>> = {
  UAE: {
    Dubai: { monthlyExclRent: 1130, rent1BR: 2368, rent3BR: 16540 / 3.67 },
    'Abu Dhabi': { monthlyExclRent: 1050, rent1BR: 1950, rent3BR: 14200 / 3.67 },
    Sharjah: { monthlyExclRent: 850, rent1BR: 1150, rent3BR: 7800 / 3.67 },
    Ajman: { monthlyExclRent: 780, rent1BR: 900, rent3BR: 5500 / 3.67 },
    'Ras Al Khaimah': { monthlyExclRent: 800, rent1BR: 850, rent3BR: 6200 / 3.67 },
    'Al Ain': { monthlyExclRent: 820, rent1BR: 1050, rent3BR: 8200 / 3.67 },
    Fujairah: { monthlyExclRent: 750, rent1BR: 800, rent3BR: 5200 / 3.67 },
    'Umm Al Quwain': { monthlyExclRent: 720, rent1BR: 700, rent3BR: 4800 / 3.67 },
  },
  Saudi: {
    Riyadh: { monthlyExclRent: 820, rent1BR: 1250, rent3BR: 10500 / 3.75 },
    Jeddah: { monthlyExclRent: 790, rent1BR: 950, rent3BR: 8900 / 3.75 },
    Dammam: { monthlyExclRent: 740, rent1BR: 750, rent3BR: 7200 / 3.75 },
    'Al Khobar': { monthlyExclRent: 760, rent1BR: 850, rent3BR: 7900 / 3.75 },
    Medina: { monthlyExclRent: 680, rent1BR: 600, rent3BR: 6500 / 3.75 },
    Mecca: { monthlyExclRent: 710, rent1BR: 700, rent3BR: 8500 / 3.75 },
    Abha: { monthlyExclRent: 620, rent1BR: 500, rent3BR: 4500 / 3.75 },
    Tabuk: { monthlyExclRent: 640, rent1BR: 550, rent3BR: 4200 / 3.75 },
    Jubail: { monthlyExclRent: 730, rent1BR: 800, rent3BR: 5800 / 3.75 },
    Yanbu: { monthlyExclRent: 690, rent1BR: 650, rent3BR: 5200 / 3.75 },
    'Al-Ahsa': { monthlyExclRent: 630, rent1BR: 500, rent3BR: 4800 / 3.75 },
    Taif: { monthlyExclRent: 660, rent1BR: 580, rent3BR: 4800 / 3.75 },
    Buraidah: { monthlyExclRent: 610, rent1BR: 480, rent3BR: 3800 / 3.75 },
    Hail: { monthlyExclRent: 600, rent1BR: 450, rent3BR: 3700 / 3.75 },
    Jazan: { monthlyExclRent: 620, rent1BR: 500, rent3BR: 4000 / 3.75 },
    Najran: { monthlyExclRent: 600, rent1BR: 480, rent3BR: 3600 / 3.75 },
  },
  Qatar: {
    Doha: { monthlyExclRent: 1020, rent1BR: 1850, rent3BR: 14000 / 3.64 },
    'Al Wakrah': { monthlyExclRent: 880, rent1BR: 1200, rent3BR: 9500 / 3.64 },
    'Al Khor': { monthlyExclRent: 850, rent1BR: 1100, rent3BR: 8800 / 3.64 },
    'Al Rayyan': { monthlyExclRent: 920, rent1BR: 1400, rent3BR: 11000 / 3.64 },
    Lusail: { monthlyExclRent: 1050, rent1BR: 2100, rent3BR: 16000 / 3.64 },
    Mesaieed: { monthlyExclRent: 820, rent1BR: 1000, rent3BR: 7500 / 3.64 },
    'Madinat ash Shamal': { monthlyExclRent: 780, rent1BR: 850, rent3BR: 6800 / 3.64 },
  },
  Kuwait: {
    'Kuwait City': { monthlyExclRent: 850, rent1BR: 1150, rent3BR: 850 / 0.31 },
    Salmiya: { monthlyExclRent: 800, rent1BR: 1050, rent3BR: 720 / 0.31 },
    Hawally: { monthlyExclRent: 740, rent1BR: 850, rent3BR: 600 / 0.31 },
    Farwaniya: { monthlyExclRent: 700, rent1BR: 750, rent3BR: 550 / 0.31 },
    Ahmadi: { monthlyExclRent: 720, rent1BR: 800, rent3BR: 550 / 0.31 },
    Jahra: { monthlyExclRent: 680, rent1BR: 700, rent3BR: 480 / 0.31 },
    Fahaheel: { monthlyExclRent: 710, rent1BR: 780, rent3BR: 520 / 0.31 },
  },
  Oman: {
    Muscat: { monthlyExclRent: 720, rent1BR: 850, rent3BR: 820 / 0.385 },
    Salalah: { monthlyExclRent: 610, rent1BR: 500, rent3BR: 550 / 0.385 },
    Sohar: { monthlyExclRent: 630, rent1BR: 550, rent3BR: 600 / 0.385 },
    Nizwa: { monthlyExclRent: 580, rent1BR: 450, rent3BR: 480 / 0.385 },
    Sur: { monthlyExclRent: 590, rent1BR: 480, rent3BR: 450 / 0.385 },
    Seeb: { monthlyExclRent: 680, rent1BR: 700, rent3BR: 650 / 0.385 },
    Duqm: { monthlyExclRent: 750, rent1BR: 900, rent3BR: 750 / 0.385 },
  },
  Bahrain: {
    Manama: { monthlyExclRent: 840, rent1BR: 1100, rent3BR: 750 / 0.38 },
    Riffa: { monthlyExclRent: 780, rent1BR: 900, rent3BR: 620 / 0.38 },
    Muharraq: { monthlyExclRent: 760, rent1BR: 850, rent3BR: 580 / 0.38 },
    'Hamad Town': { monthlyExclRent: 690, rent1BR: 650, rent3BR: 450 / 0.38 },
    'Isa Town': { monthlyExclRent: 710, rent1BR: 700, rent3BR: 480 / 0.38 },
  },
};

// Advanced Relocation Cost Calculator
export interface RelocationInputs {
  countryCode: string;
  city: string;
  adults: number;
  children: number;
  housingType: 'Studio' | '1BR' | '2BR' | '3BR';
  lifestyle: 'Budget' | 'Mid-range' | 'Comfort/Luxury';
  shipping: boolean;
  employerFlights: boolean;
  employerHousing: boolean;
  employerVisa: boolean;
  currency: Currency;
}

export function calculateRelocationCosts(inputs: RelocationInputs) {
  const {
    countryCode,
    city,
    adults = 1,
    children = 0,
    housingType = '1BR',
    lifestyle = 'Mid-range',
    shipping = false,
    employerFlights = false,
    employerHousing = false,
    employerVisa = true,
    currency = 'USD',
  } = inputs;

  const cityInfo = CITY_DATA[countryCode]?.[city] || CITY_DATA.UAE.Dubai;
  const familyMultiplier = adults + children * 0.8; // Children cost ~80% of adult
  const lifestyleMultiplier = lifestyle === 'Budget' ? 0.78 : lifestyle === 'Comfort/Luxury' ? 1.45 : 1.0;

  // ==================== ONE-TIME COSTS (USD) ====================
  let flights = 980 * familyMultiplier;                    // Average international flight
  if (employerFlights) flights = Math.round(flights * 0.25);

  let visaMedicalsDocs = 1350 * familyMultiplier;          // Visa, medical, attestation, etc.
  if (employerVisa) visaMedicalsDocs = Math.round(visaMedicalsDocs * 0.35);

  // Housing Setup (deposits, agency fees, first few cheques)
  let housingSetup = employerHousing 
    ? 650 
    : (cityInfo.rent1BR || 1200) * 3.8; 
  const housingSizeMultiplier = housingType === '3BR' ? 1.85 : housingType === '2BR' ? 1.45 : 1.0;
  housingSetup = Math.round(housingSetup * housingSizeMultiplier);

  let furnishingShipping = 1950 * lifestyleMultiplier;
  if (shipping) furnishingShipping += 1650;

  const oneTimeTotalUSD = Math.round(
    flights + visaMedicalsDocs + housingSetup + furnishingShipping
  );

  // ==================== MONTHLY RECURRING (USD) ====================
  let monthlyLiving = cityInfo.monthlyExclRent * lifestyleMultiplier * familyMultiplier;
  let rent = employerHousing ? 0 : (
    housingType === '3BR' 
      ? (cityInfo.rent3BR || cityInfo.rent1BR * 1.85) 
      : cityInfo.rent1BR
  );

  const monthlyTotalUSD = Math.round(monthlyLiving + rent);

  // Convert to selected currency
  const rate = CURRENCY_RATES[currency];
  const oneTimeConverted = Math.round(oneTimeTotalUSD * rate);
  const monthlyConverted = Math.round(monthlyTotalUSD * rate);

  return {
    oneTimeTotal: oneTimeConverted,
    monthlyTotal: monthlyConverted,
    oneTimeTotalUSD,
    monthlyTotalUSD,
    breakdown: {
      flights: Math.round(flights * rate),
      visaMedicals: Math.round(visaMedicalsDocs * rate),
      housingSetup: Math.round(housingSetup * rate),
      furnishingShipping: Math.round(furnishingShipping * rate),
      buffer: Math.round(monthlyTotalUSD * 2 * rate), // 2 months safety buffer
    },
    currency,
    cityInfo,
    familyMultiplier: Math.round(familyMultiplier * 10) / 10,
  };
}
// lib/costOfLivingData.ts
// Extended GCC_CITIES_DATA with more accurate values based on recent 2026 data (Numbeo, Expatistan, local rental sites).
// Covers major and secondary cities across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman.

export const GCC_CITIES_DATA: Record<string, any> = {
  Dubai: {
    currency: 'AED',
    housing: {
      center1br: 8600,
      outskirts1br: 5300,
      center3br: 15300,
      outskirts3br: 11000
    },
    foodSingle: 1500,
    foodFamily: 3500,
    utilities: 900,
    transportPublic: 350,
    transportCar: 1200,
    schoolMonthlyPerChild: 5500, // prorated international
    misc: 1200
  },
  'Abu Dhabi': {
    currency: 'AED',
    housing: {
      center1br: 7300,
      outskirts1br: 4900,
      center3br: 13600,
      outskirts3br: 10300
    },
    foodSingle: 1400,
    foodFamily: 3200,
    utilities: 850,
    transportPublic: 300,
    transportCar: 1100,
    schoolMonthlyPerChild: 5200,
    misc: 1100
  },
  'Ras Al Khaimah': {
    currency: 'AED',
    housing: {
      center1br: 2900,
      outskirts1br: 2300,
      center3br: 6000,
      outskirts3br: 4600
    },
    foodSingle: 1100,
    foodFamily: 2700,
    utilities: 650,
    transportPublic: 250,
    transportCar: 950,
    schoolMonthlyPerChild: 3800,
    misc: 900
  },
  Sharjah: {
    currency: 'AED',
    housing: {
      center1br: 2800, // Significantly cheaper than Dubai
      outskirts1br: 2200,
      center3br: 5500,
      outskirts3br: 4200
    },
    foodSingle: 1150,
    foodFamily: 2800,
    utilities: 750,
    transportPublic: 200,
    transportCar: 950,
    schoolMonthlyPerChild: 3500,
    misc: 850
  },
  'Al Ain': {
    currency: 'AED',
    housing: {
      center1br: 2600,
      outskirts1br: 2100,
      center3br: 5800,
      outskirts3br: 4300
    },
    foodSingle: 1050,
    foodFamily: 2600,
    utilities: 700,
    transportPublic: 220,
    transportCar: 900,
    schoolMonthlyPerChild: 3600,
    misc: 800
  },
  Fujairah: {
    currency: 'AED',
    housing: {
      center1br: 2500,
      outskirts1br: 1800,
      center3br: 5200,
      outskirts3br: 3800
    },
    foodSingle: 1000,
    foodFamily: 2500,
    utilities: 600,
    transportPublic: 180,
    transportCar: 850,
    schoolMonthlyPerChild: 3200,
    misc: 750
  },
  Riyadh: {
    currency: 'SAR',
    housing: {
      center1br: 4250,
      outskirts1br: 3200,
      center3br: 7500,
      outskirts3br: 4500
    },
    foodSingle: 1100,
    foodFamily: 2800,
    utilities: 370,
    transportPublic: 200,
    transportCar: 900,
    schoolMonthlyPerChild: 3800,
    misc: 900
  },
  Jeddah: {
    currency: 'SAR',
    housing: {
      center1br: 2800,
      outskirts1br: 2000,
      center3br: 5200,
      outskirts3br: 3500
    },
    foodSingle: 1050,
    foodFamily: 2650,
    utilities: 380,
    transportPublic: 180,
    transportCar: 850,
    schoolMonthlyPerChild: 4200,
    misc: 850
  },
  Dammam: {
    currency: 'SAR',
    housing: {
      center1br: 2170,
      outskirts1br: 1390,
      center3br: 3720,
      outskirts3br: 2490
    },
    foodSingle: 950,
    foodFamily: 2500,
    utilities: 350,
    transportPublic: 180,
    transportCar: 800,
    schoolMonthlyPerChild: 3500,
    misc: 800
  },
  'Al Khobar': {
    currency: 'SAR',
    housing: {
      center1br: 2380,
      outskirts1br: 1890,
      center3br: 4430,
      outskirts3br: 3250
    },
    foodSingle: 1000,
    foodFamily: 2550,
    utilities: 370,
    transportPublic: 190,
    transportCar: 820,
    schoolMonthlyPerChild: 3600,
    misc: 820
  },
  Doha: {
    currency: 'QAR',
    housing: {
      center1br: 7600,
      outskirts1br: 4800,
      center3br: 13600,
      outskirts3br: 9800
    },
    foodSingle: 1300,
    foodFamily: 3100,
    utilities: 800,
    transportPublic: 250,
    transportCar: 1000,
    schoolMonthlyPerChild: 5300,
    misc: 1150
  },
  'Kuwait City': {
    currency: 'KWD',
    housing: {
      center1br: 285,
      outskirts1br: 204,
      center3br: 596,
      outskirts3br: 414
    },
    foodSingle: 750,
    foodFamily: 1900,
    utilities: 450,
    transportPublic: 180,
    transportCar: 650,
    schoolMonthlyPerChild: 4200,
    misc: 800
  },
  Manama: {
    currency: 'BHD',
    housing: {
      center1br: 375,
      outskirts1br: 237,
      center3br: 757,
      outskirts3br: 518
    },
    foodSingle: 800,
    foodFamily: 2100,
    utilities: 580,
    transportPublic: 140,
    transportCar: 700,
    schoolMonthlyPerChild: 4100,
    misc: 850
  },
  Muscat: {
    currency: 'OMR',
    housing: {
      center1br: 262,
      outskirts1br: 163,
      center3br: 504,
      outskirts3br: 292
    },
    foodSingle: 650,
    foodFamily: 1700,
    utilities: 550,
    transportPublic: 300,
    transportCar: 650,
    schoolMonthlyPerChild: 3500,
    misc: 700
  },
  Sohar: {
    currency: 'OMR',
    housing: {
      center1br: 180,
      outskirts1br: 120,
      center3br: 350,
      outskirts3br: 220
    },
    foodSingle: 550,
    foodFamily: 1450,
    utilities: 480,
    transportPublic: 250,
    transportCar: 580,
    schoolMonthlyPerChild: 2800,
    misc: 600
  }
};

export const CURRENCY_INFO = {
  AED: { symbol: 'AED', usdRate: 0.272 },
  SAR: { symbol: 'SAR', usdRate: 0.266 },
  QAR: { symbol: 'QAR', usdRate: 0.274 },
  KWD: { symbol: 'KWD', usdRate: 3.25 },
  BHD: { symbol: 'BHD', usdRate: 2.65 },
  OMR: { symbol: 'OMR', usdRate: 2.60 },
};

export function calculateMonthlyCosts(
  city: string,
  data: any,
  household: string,
  numChildren: number,
  housingType: string,
  location: string = 'center',
  hasCar: boolean = false,
  intlSchool: boolean = false,
  multiplier: number = 1
) {
  const hKey = `${location}${housingType}` as keyof typeof data.housing;
  let housing = (data.housing[hKey] || 6000);

  let food = household.includes('single') ? data.foodSingle : data.foodFamily;
  if (household.includes('family')) {
    food = Math.round(food * (1 + (numChildren - 1) * 0.4));
  }

  let transport = hasCar ? data.transportCar : data.transportPublic;

  let education = 0;
  if (intlSchool && numChildren > 0) {
    education = data.schoolMonthlyPerChild * numChildren;
  }

  const utilities = data.utilities;
  const misc = data.misc;

  let total = housing + food + utilities + transport + education + misc;
  total = Math.round(total * multiplier);

  return {
    housing: Math.round(housing * multiplier),
    food: Math.round(food * multiplier),
    utilities: Math.round(utilities * multiplier),
    transport: Math.round(transport * multiplier),
    education: Math.round(education * multiplier),
    misc: Math.round(misc * multiplier),
    totalMonthly: total
  };
}
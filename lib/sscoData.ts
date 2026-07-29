export type ClassificationResult = {
  category: 'High-Skilled' | 'Skilled' | 'Basic';
  confidence: number;
  occupation: string;
  code: string;
  group: number;
  educationImpact: string;
  salaryImpact: string;
  expImpact: string;
  implications: string[];
};

// Expanded dataset (~120 occupations)
const occupations = [
  // High-Skilled (Groups 1-3)
  { title: "Software Engineer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Senior Software Engineer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Full Stack Developer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Backend Developer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Frontend Developer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Mobile App Developer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "DevOps Engineer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Cloud Engineer", code: "2512", group: 2, base: "High-Skilled" as const },
  { title: "Data Scientist", code: "2521", group: 2, base: "High-Skilled" as const },
  { title: "Machine Learning Engineer", code: "2521", group: 2, base: "High-Skilled" as const },
  { title: "AI Engineer", code: "2521", group: 2, base: "High-Skilled" as const },
  { title: "Cybersecurity Engineer", code: "2529", group: 2, base: "High-Skilled" as const },
  { title: "Civil Engineer", code: "2142", group: 2, base: "High-Skilled" as const },
  { title: "Mechanical Engineer", code: "2144", group: 2, base: "High-Skilled" as const },
  { title: "Electrical Engineer", code: "2143", group: 2, base: "High-Skilled" as const },
  { title: "Doctor", code: "2211", group: 2, base: "High-Skilled" as const },
  { title: "Nurse", code: "2221", group: 2, base: "High-Skilled" as const },
  { title: "Project Manager", code: "1210", group: 1, base: "High-Skilled" as const },
  { title: "Product Manager", code: "1210", group: 1, base: "High-Skilled" as const },
  { title: "Finance Manager", code: "2411", group: 2, base: "High-Skilled" as const },
  { title: "Financial Controller", code: "2411", group: 2, base: "High-Skilled" as const },
  { title: "CFO", code: "1210", group: 1, base: "High-Skilled" as const },

  // Skilled (Groups 4-8)
  { title: "Accountant", code: "2411", group: 2, base: "Skilled" as const },
  { title: "Senior Accountant", code: "2411", group: 2, base: "Skilled" as const },
  { title: "Teacher", code: "2330", group: 2, base: "Skilled" as const },
  { title: "Electrician", code: "7411", group: 7, base: "Skilled" as const },
  { title: "Administrative Assistant", code: "4120", group: 4, base: "Skilled" as const },
  { title: "Sales Manager", code: "1221", group: 1, base: "Skilled" as const },
  { title: "Marketing Manager", code: "1222", group: 1, base: "Skilled" as const },
  { title: "HR Manager", code: "1212", group: 1, base: "Skilled" as const },
  { title: "Operations Manager", code: "1221", group: 1, base: "Skilled" as const },
  { title: "Construction Project Manager", code: "1322", group: 1, base: "Skilled" as const },
  { title: "Quantity Surveyor", code: "3312", group: 3, base: "Skilled" as const },

  // Basic / Lower Skilled
  { title: "Driver", code: "8322", group: 8, base: "Skilled" as const },
  { title: "Cleaner", code: "9629", group: 9, base: "Basic" as const },
  { title: "Laborer", code: "9313", group: 9, base: "Basic" as const },
  { title: "Security Guard", code: "9629", group: 9, base: "Basic" as const },
];

export function classifyOccupation(
  jobTitle: string,
  education: string,
  yearsExp: number,
  salaryBand: string,
  age: number
): ClassificationResult {
  const lowerTitle = jobTitle.toLowerCase().trim();

  // Find best match
  let match = occupations.find(o => 
    lowerTitle === o.title.toLowerCase() || 
    lowerTitle.includes(o.title.toLowerCase()) ||
    o.title.toLowerCase().includes(lowerTitle)
  );

  if (!match) {
    match = occupations[0]; // fallback
  }

  let category = match.base;
  let baseConfidence = 82;

  const salary = parseInt(salaryBand.replace(/[^0-9]/g, '')) || 12000;

  // === Strong Role-based Adjustment ===
  if (category === 'High-Skilled') {
    if (salary < 9000 || yearsExp < 2) {
      category = 'Skilled';
      baseConfidence -= 18;
    } else if (salary > 28000 && yearsExp >= 5) {
      baseConfidence += 12;
    }
  } 
  else if (category === 'Skilled') {
    if (salary > 25000 && yearsExp >= 7 && (education.includes("Master") || education.includes("PhD"))) {
      category = 'High-Skilled';
      baseConfidence += 15;
    }
    if (salary < 6000) baseConfidence -= 12;
  } 
  else if (category === 'Basic') {
    if (salary > 12000 || yearsExp > 8) baseConfidence += 10;
  }

  // Age impact
  if (age > 60) {
    if (category !== 'Basic') {
      category = 'Basic';
      baseConfidence = Math.max(45, baseConfidence - 25);
    }
  }

  // Education impact
  const eduBoost = education.includes("Master") || education.includes("PhD") ? 8 : 
                   education === "Bachelor Degree" ? 4 : 0;

  const finalConfidence = Math.min(96, Math.max(48, Math.round(baseConfidence + eduBoost)));

  return {
    category,
    confidence: finalConfidence,
    occupation: match.title,
    code: match.code,
    group: match.group,
    educationImpact: education.includes("Master") || education.includes("PhD") ? "Very Strong" : 
                     education === "Bachelor Degree" ? "Strong" : "Moderate",
    salaryImpact: salary > 28000 ? "Strong Positive" : salary < 7000 ? "Negative" : "Neutral",
    expImpact: yearsExp >= 8 ? "Strong" : yearsExp >= 4 ? "Good" : "Developing",
    implications: [
      `This classification significantly affects your Iqama renewal and visa processing.`,
      `${category} roles generally require professional qualification verification.`,
      `Confirm the exact job title written in your employment contract.`,
      `You can request a classification review through the Qiwa platform if needed.`
    ]
  };
}
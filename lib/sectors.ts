// Canonical sector list — used by the public "Submit a Job" form and by
// category-page filtering/matching (see app/category/[slug]/client.tsx).
//
// This is mirrored into the jobpilot-pro repo at src/lib/sectors.ts (that's a
// separate app with no shared package). If you change this list, update that
// copy too — a mismatch means jobs get tagged with a sector a category page
// can never match, or vice versa.

export const SECTORS: string[] = [
  'Information Technology & Software',
  'Engineering & Manufacturing',
  'Finance & Banking',
  'Healthcare & Medical',
  'Education & Training',
  'Sales & Marketing',
  'Human Resources & Recruitment',
  'Customer Service & Support',
  'Media, Advertising & Communications',
  'Design, Arts & Creative',
  'Construction & Real Estate',
  'Logistics, Transport & Supply Chain',
  'Agriculture & Agribusiness',
  'Energy & Utilities (Oil, Gas, Renewable Energy)',
  'Legal & Compliance',
  'Government & Public Administration',
  'Retail & E-commerce',
  'Hospitality & Tourism',
  'Science & Research',
  'Security & Defense',
  'Telecommunications',
  'Nonprofit & NGO',
  'Environment & Sustainability',
  'Product Management & Operations',
  'Data & Analytics',
];

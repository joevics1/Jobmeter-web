// lib/document-types.ts
// Dropdown source for the AI Document Writer. Add new document types here —
// the generator itself needs no code changes to support a new entry.
//
// `tier` is informational for now (everything currently runs through the
// AI-assembled generator). It marks which documents are good future
// candidates for the fixed Template tier (low variability, high volume)
// vs. which genuinely need per-deal AI clause assembly. Doesn't change
// runtime behavior yet — it's groundwork for when the Template tier is built.

export interface DocumentTypeDef {
  slug: string;
  label: string;
  description: string;
  tier: 'template' | 'ai';
  category: string;
  popular: boolean;
}

export const DOCUMENT_TYPES: DocumentTypeDef[] = [
  // No document types yet — the previous list (57 vehicle-related
  // documents, inherited from naira.autos) has been removed as it doesn't
  // fit a job platform. Add JobMeter-relevant document types here, e.g.:
  // { slug: 'employment-offer-letter', label: 'Employment Offer Letter', description: '...', tier: 'ai', category: 'Employment', popular: true },
];

export function getDocumentType(slug: string): DocumentTypeDef | undefined {
  return DOCUMENT_TYPES.find(d => d.slug === slug);
}

// Flat, ungrouped ordering for the dropdown: popular documents first
// (alphabetical among themselves), then everything else alphabetically.
export const DOCUMENT_TYPES_SORTED: DocumentTypeDef[] = [
  ...DOCUMENT_TYPES.filter(d => d.popular).sort((a, b) => a.label.localeCompare(b.label)),
  ...DOCUMENT_TYPES.filter(d => !d.popular).sort((a, b) => a.label.localeCompare(b.label)),
];
export const DOCUMENT_TYPES_POPULAR_COUNT = DOCUMENT_TYPES.filter(d => d.popular).length;

// Countries the generator supports. Grounded research means this can cover
// far more markets than the fixed calculators. `region` is kept as data
// (useful elsewhere) but the dropdown itself is a flat list now: popular
// countries first, then everything else alphabetically — no optgroup
// segmentation.
export interface DocumentCountryDef {
  code: string;   // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  region: string;
  popular: boolean;
}

export const DOCUMENT_COUNTRIES: DocumentCountryDef[] = [
  // Africa
  { code: 'ng', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}', region: 'Africa', popular: true },
  { code: 'za', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', region: 'Africa', popular: true },
  { code: 'gh', name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', region: 'Africa', popular: true },
  { code: 'ke', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', region: 'Africa', popular: false },
  { code: 'eg', name: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', region: 'Africa', popular: false },
  { code: 'ma', name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', region: 'Africa', popular: false },
  { code: 'et', name: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}', region: 'Africa', popular: false },
  { code: 'tz', name: 'Tanzania', flag: '\u{1F1F9}\u{1F1FF}', region: 'Africa', popular: false },
  { code: 'ug', name: 'Uganda', flag: '\u{1F1FA}\u{1F1EC}', region: 'Africa', popular: false },
  { code: 'rw', name: 'Rwanda', flag: '\u{1F1F7}\u{1F1FC}', region: 'Africa', popular: false },
  { code: 'sn', name: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}', region: 'Africa', popular: false },
  { code: 'ci', name: 'Ivory Coast', flag: '\u{1F1E8}\u{1F1EE}', region: 'Africa', popular: false },
  { code: 'cm', name: 'Cameroon', flag: '\u{1F1E8}\u{1F1F2}', region: 'Africa', popular: false },
  { code: 'zm', name: 'Zambia', flag: '\u{1F1FF}\u{1F1F2}', region: 'Africa', popular: false },
  { code: 'zw', name: 'Zimbabwe', flag: '\u{1F1FF}\u{1F1FC}', region: 'Africa', popular: false },
  { code: 'dz', name: 'Algeria', flag: '\u{1F1E9}\u{1F1FF}', region: 'Africa', popular: false },
  { code: 'tn', name: 'Tunisia', flag: '\u{1F1F9}\u{1F1F3}', region: 'Africa', popular: false },
  { code: 'ly', name: 'Libya', flag: '\u{1F1F1}\u{1F1FE}', region: 'Africa', popular: false },
  { code: 'sd', name: 'Sudan', flag: '\u{1F1F8}\u{1F1E9}', region: 'Africa', popular: false },
  { code: 'mz', name: 'Mozambique', flag: '\u{1F1F2}\u{1F1FF}', region: 'Africa', popular: false },
  { code: 'bw', name: 'Botswana', flag: '\u{1F1E7}\u{1F1FC}', region: 'Africa', popular: false },
  { code: 'na', name: 'Namibia', flag: '\u{1F1F3}\u{1F1E6}', region: 'Africa', popular: false },
  { code: 'mw', name: 'Malawi', flag: '\u{1F1F2}\u{1F1FC}', region: 'Africa', popular: false },
  { code: 'bj', name: 'Benin', flag: '\u{1F1E7}\u{1F1EF}', region: 'Africa', popular: false },
  { code: 'tg', name: 'Togo', flag: '\u{1F1F9}\u{1F1EC}', region: 'Africa', popular: false },
  { code: 'ml', name: 'Mali', flag: '\u{1F1F2}\u{1F1F1}', region: 'Africa', popular: false },
  { code: 'bf', name: 'Burkina Faso', flag: '\u{1F1E7}\u{1F1EB}', region: 'Africa', popular: false },
  { code: 'ne', name: 'Niger', flag: '\u{1F1F3}\u{1F1EA}', region: 'Africa', popular: false },
  { code: 'gn', name: 'Guinea', flag: '\u{1F1EC}\u{1F1F3}', region: 'Africa', popular: false },
  { code: 'sl', name: 'Sierra Leone', flag: '\u{1F1F8}\u{1F1F1}', region: 'Africa', popular: false },
  { code: 'lr', name: 'Liberia', flag: '\u{1F1F1}\u{1F1F7}', region: 'Africa', popular: false },
  { code: 'td', name: 'Chad', flag: '\u{1F1F9}\u{1F1E9}', region: 'Africa', popular: false },
  { code: 'so', name: 'Somalia', flag: '\u{1F1F8}\u{1F1F4}', region: 'Africa', popular: false },
  { code: 'ao', name: 'Angola', flag: '\u{1F1E6}\u{1F1F4}', region: 'Africa', popular: false },
  { code: 'cd', name: 'DR Congo', flag: '\u{1F1E8}\u{1F1E9}', region: 'Africa', popular: false },
  { code: 'cg', name: 'Republic of the Congo', flag: '\u{1F1E8}\u{1F1EC}', region: 'Africa', popular: false },
  { code: 'ga', name: 'Gabon', flag: '\u{1F1EC}\u{1F1E6}', region: 'Africa', popular: false },
  { code: 'ls', name: 'Lesotho', flag: '\u{1F1F1}\u{1F1F8}', region: 'Africa', popular: false },
  { code: 'sz', name: 'Eswatini', flag: '\u{1F1F8}\u{1F1FF}', region: 'Africa', popular: false },
  { code: 'mu', name: 'Mauritius', flag: '\u{1F1F2}\u{1F1FA}', region: 'Africa', popular: false },
  { code: 'mg', name: 'Madagascar', flag: '\u{1F1F2}\u{1F1EC}', region: 'Africa', popular: false },
  { code: 'gm', name: 'Gambia', flag: '\u{1F1EC}\u{1F1F2}', region: 'Africa', popular: false },
  { code: 'gw', name: 'Guinea-Bissau', flag: '\u{1F1EC}\u{1F1FC}', region: 'Africa', popular: false },
  { code: 'gq', name: 'Equatorial Guinea', flag: '\u{1F1EC}\u{1F1F6}', region: 'Africa', popular: false },
  { code: 'cf', name: 'Central African Republic', flag: '\u{1F1E8}\u{1F1EB}', region: 'Africa', popular: false },
  { code: 'ss', name: 'South Sudan', flag: '\u{1F1F8}\u{1F1F8}', region: 'Africa', popular: false },
  { code: 'km', name: 'Comoros', flag: '\u{1F1F0}\u{1F1F2}', region: 'Africa', popular: false },
  { code: 'cv', name: 'Cape Verde', flag: '\u{1F1E8}\u{1F1FB}', region: 'Africa', popular: false },
  { code: 'dj', name: 'Djibouti', flag: '\u{1F1E9}\u{1F1EF}', region: 'Africa', popular: false },
  { code: 'er', name: 'Eritrea', flag: '\u{1F1EA}\u{1F1F7}', region: 'Africa', popular: false },
  { code: 'bi', name: 'Burundi', flag: '\u{1F1E7}\u{1F1EE}', region: 'Africa', popular: false },
  { code: 'mr', name: 'Mauritania', flag: '\u{1F1F2}\u{1F1F7}', region: 'Africa', popular: false },
  { code: 'st', name: 'Sao Tome and Principe', flag: '\u{1F1F8}\u{1F1F9}', region: 'Africa', popular: false },
  { code: 'sc', name: 'Seychelles', flag: '\u{1F1F8}\u{1F1E8}', region: 'Africa', popular: false },

  // Americas
  { code: 'us', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', region: 'Americas', popular: true },
  { code: 'ca', name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', region: 'Americas', popular: true },
  { code: 'mx', name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', region: 'Americas', popular: false },
  { code: 'br', name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', region: 'Americas', popular: false },
  { code: 'ar', name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}', region: 'Americas', popular: false },
  { code: 'co', name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', region: 'Americas', popular: false },
  { code: 'cl', name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', region: 'Americas', popular: false },
  { code: 'pe', name: 'Peru', flag: '\u{1F1F5}\u{1F1EA}', region: 'Americas', popular: false },
  { code: 'ec', name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', region: 'Americas', popular: false },
  { code: 've', name: 'Venezuela', flag: '\u{1F1FB}\u{1F1EA}', region: 'Americas', popular: false },
  { code: 'uy', name: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}', region: 'Americas', popular: false },
  { code: 'py', name: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}', region: 'Americas', popular: false },
  { code: 'bo', name: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}', region: 'Americas', popular: false },
  { code: 'pa', name: 'Panama', flag: '\u{1F1F5}\u{1F1E6}', region: 'Americas', popular: false },
  { code: 'cr', name: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', region: 'Americas', popular: false },
  { code: 'gt', name: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}', region: 'Americas', popular: false },
  { code: 'hn', name: 'Honduras', flag: '\u{1F1ED}\u{1F1F3}', region: 'Americas', popular: false },
  { code: 'sv', name: 'El Salvador', flag: '\u{1F1F8}\u{1F1FB}', region: 'Americas', popular: false },
  { code: 'ni', name: 'Nicaragua', flag: '\u{1F1F3}\u{1F1EE}', region: 'Americas', popular: false },
  { code: 'do', name: 'Dominican Republic', flag: '\u{1F1E9}\u{1F1F4}', region: 'Americas', popular: false },
  { code: 'jm', name: 'Jamaica', flag: '\u{1F1EF}\u{1F1F2}', region: 'Americas', popular: false },
  { code: 'tt', name: 'Trinidad and Tobago', flag: '\u{1F1F9}\u{1F1F9}', region: 'Americas', popular: false },
  { code: 'bs', name: 'Bahamas', flag: '\u{1F1E7}\u{1F1F8}', region: 'Americas', popular: false },
  { code: 'bz', name: 'Belize', flag: '\u{1F1E7}\u{1F1FF}', region: 'Americas', popular: false },
  { code: 'gy', name: 'Guyana', flag: '\u{1F1EC}\u{1F1FE}', region: 'Americas', popular: false },
  { code: 'sr', name: 'Suriname', flag: '\u{1F1F8}\u{1F1F7}', region: 'Americas', popular: false },

  // Europe
  { code: 'gb', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', region: 'Europe', popular: true },
  { code: 'de', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', region: 'Europe', popular: true },
  { code: 'fr', name: 'France', flag: '\u{1F1EB}\u{1F1F7}', region: 'Europe', popular: false },
  { code: 'es', name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', region: 'Europe', popular: false },
  { code: 'it', name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', region: 'Europe', popular: false },
  { code: 'nl', name: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}', region: 'Europe', popular: false },
  { code: 'pt', name: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', region: 'Europe', popular: false },
  { code: 'ie', name: 'Ireland', flag: '\u{1F1EE}\u{1F1EA}', region: 'Europe', popular: false },
  { code: 'be', name: 'Belgium', flag: '\u{1F1E7}\u{1F1EA}', region: 'Europe', popular: false },
  { code: 'ch', name: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}', region: 'Europe', popular: false },
  { code: 'se', name: 'Sweden', flag: '\u{1F1F8}\u{1F1EA}', region: 'Europe', popular: false },
  { code: 'no', name: 'Norway', flag: '\u{1F1F3}\u{1F1F4}', region: 'Europe', popular: false },
  { code: 'pl', name: 'Poland', flag: '\u{1F1F5}\u{1F1F1}', region: 'Europe', popular: false },
  { code: 'at', name: 'Austria', flag: '\u{1F1E6}\u{1F1F9}', region: 'Europe', popular: false },
  { code: 'dk', name: 'Denmark', flag: '\u{1F1E9}\u{1F1F0}', region: 'Europe', popular: false },
  { code: 'fi', name: 'Finland', flag: '\u{1F1EB}\u{1F1EE}', region: 'Europe', popular: false },
  { code: 'gr', name: 'Greece', flag: '\u{1F1EC}\u{1F1F7}', region: 'Europe', popular: false },
  { code: 'cz', name: 'Czech Republic', flag: '\u{1F1E8}\u{1F1FF}', region: 'Europe', popular: false },
  { code: 'hu', name: 'Hungary', flag: '\u{1F1ED}\u{1F1FA}', region: 'Europe', popular: false },
  { code: 'ro', name: 'Romania', flag: '\u{1F1F7}\u{1F1F4}', region: 'Europe', popular: false },
  { code: 'bg', name: 'Bulgaria', flag: '\u{1F1E7}\u{1F1EC}', region: 'Europe', popular: false },
  { code: 'hr', name: 'Croatia', flag: '\u{1F1ED}\u{1F1F7}', region: 'Europe', popular: false },
  { code: 'sk', name: 'Slovakia', flag: '\u{1F1F8}\u{1F1F0}', region: 'Europe', popular: false },
  { code: 'si', name: 'Slovenia', flag: '\u{1F1F8}\u{1F1EE}', region: 'Europe', popular: false },
  { code: 'rs', name: 'Serbia', flag: '\u{1F1F7}\u{1F1F8}', region: 'Europe', popular: false },
  { code: 'ua', name: 'Ukraine', flag: '\u{1F1FA}\u{1F1E6}', region: 'Europe', popular: false },
  { code: 'is', name: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}', region: 'Europe', popular: false },
  { code: 'lu', name: 'Luxembourg', flag: '\u{1F1F1}\u{1F1FA}', region: 'Europe', popular: false },
  { code: 'mt', name: 'Malta', flag: '\u{1F1F2}\u{1F1F9}', region: 'Europe', popular: false },
  { code: 'cy', name: 'Cyprus', flag: '\u{1F1E8}\u{1F1FE}', region: 'Europe', popular: false },
  { code: 'ee', name: 'Estonia', flag: '\u{1F1EA}\u{1F1EA}', region: 'Europe', popular: false },
  { code: 'lv', name: 'Latvia', flag: '\u{1F1F1}\u{1F1FB}', region: 'Europe', popular: false },
  { code: 'lt', name: 'Lithuania', flag: '\u{1F1F1}\u{1F1F9}', region: 'Europe', popular: false },
  { code: 'al', name: 'Albania', flag: '\u{1F1E6}\u{1F1F1}', region: 'Europe', popular: false },
  { code: 'ba', name: 'Bosnia and Herzegovina', flag: '\u{1F1E7}\u{1F1E6}', region: 'Europe', popular: false },
  { code: 'mk', name: 'North Macedonia', flag: '\u{1F1F2}\u{1F1F0}', region: 'Europe', popular: false },
  { code: 'me', name: 'Montenegro', flag: '\u{1F1F2}\u{1F1EA}', region: 'Europe', popular: false },
  { code: 'md', name: 'Moldova', flag: '\u{1F1F2}\u{1F1E9}', region: 'Europe', popular: false },

  // Middle East
  { code: 'ae', name: 'United Arab Emirates', flag: '\u{1F1E6}\u{1F1EA}', region: 'Middle East', popular: true },
  { code: 'sa', name: 'Saudi Arabia', flag: '\u{1F1F8}\u{1F1E6}', region: 'Middle East', popular: false },
  { code: 'qa', name: 'Qatar', flag: '\u{1F1F6}\u{1F1E6}', region: 'Middle East', popular: false },
  { code: 'kw', name: 'Kuwait', flag: '\u{1F1F0}\u{1F1FC}', region: 'Middle East', popular: false },
  { code: 'bh', name: 'Bahrain', flag: '\u{1F1E7}\u{1F1ED}', region: 'Middle East', popular: false },
  { code: 'om', name: 'Oman', flag: '\u{1F1F4}\u{1F1F2}', region: 'Middle East', popular: false },
  { code: 'il', name: 'Israel', flag: '\u{1F1EE}\u{1F1F1}', region: 'Middle East', popular: false },
  { code: 'tr', name: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}', region: 'Middle East', popular: false },
  { code: 'iq', name: 'Iraq', flag: '\u{1F1EE}\u{1F1F6}', region: 'Middle East', popular: false },
  { code: 'jo', name: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}', region: 'Middle East', popular: false },
  { code: 'lb', name: 'Lebanon', flag: '\u{1F1F1}\u{1F1E7}', region: 'Middle East', popular: false },
  { code: 'ye', name: 'Yemen', flag: '\u{1F1FE}\u{1F1EA}', region: 'Middle East', popular: false },
  { code: 'ps', name: 'Palestine', flag: '\u{1F1F5}\u{1F1F8}', region: 'Middle East', popular: false },

  // Asia
  { code: 'in', name: 'India', flag: '\u{1F1EE}\u{1F1F3}', region: 'Asia', popular: false },
  { code: 'pk', name: 'Pakistan', flag: '\u{1F1F5}\u{1F1F0}', region: 'Asia', popular: false },
  { code: 'cn', name: 'China', flag: '\u{1F1E8}\u{1F1F3}', region: 'Asia', popular: false },
  { code: 'jp', name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', region: 'Asia', popular: false },
  { code: 'kr', name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}', region: 'Asia', popular: false },
  { code: 'sg', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', region: 'Asia', popular: false },
  { code: 'my', name: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}', region: 'Asia', popular: false },
  { code: 'id', name: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', region: 'Asia', popular: false },
  { code: 'ph', name: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}', region: 'Asia', popular: false },
  { code: 'th', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', region: 'Asia', popular: false },
  { code: 'vn', name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}', region: 'Asia', popular: false },
  { code: 'bd', name: 'Bangladesh', flag: '\u{1F1E7}\u{1F1E9}', region: 'Asia', popular: false },
  { code: 'lk', name: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}', region: 'Asia', popular: false },
  { code: 'np', name: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', region: 'Asia', popular: false },
  { code: 'mm', name: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}', region: 'Asia', popular: false },
  { code: 'kh', name: 'Cambodia', flag: '\u{1F1F0}\u{1F1ED}', region: 'Asia', popular: false },
  { code: 'la', name: 'Laos', flag: '\u{1F1F1}\u{1F1E6}', region: 'Asia', popular: false },
  { code: 'mn', name: 'Mongolia', flag: '\u{1F1F2}\u{1F1F3}', region: 'Asia', popular: false },
  { code: 'kz', name: 'Kazakhstan', flag: '\u{1F1F0}\u{1F1FF}', region: 'Asia', popular: false },
  { code: 'uz', name: 'Uzbekistan', flag: '\u{1F1FA}\u{1F1FF}', region: 'Asia', popular: false },
  { code: 'tw', name: 'Taiwan', flag: '\u{1F1F9}\u{1F1FC}', region: 'Asia', popular: false },
  { code: 'hk', name: 'Hong Kong', flag: '\u{1F1ED}\u{1F1F0}', region: 'Asia', popular: false },
  { code: 'bn', name: 'Brunei', flag: '\u{1F1E7}\u{1F1F3}', region: 'Asia', popular: false },

  // Oceania
  { code: 'au', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', region: 'Oceania', popular: false },
  { code: 'nz', name: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}', region: 'Oceania', popular: false },
  { code: 'fj', name: 'Fiji', flag: '\u{1F1EB}\u{1F1EF}', region: 'Oceania', popular: false },
  { code: 'pg', name: 'Papua New Guinea', flag: '\u{1F1F5}\u{1F1EC}', region: 'Oceania', popular: false },
];

export function getDocumentCountry(code: string): DocumentCountryDef | undefined {
  return DOCUMENT_COUNTRIES.find(c => c.code === code);
}

// Flat, ungrouped ordering for the dropdown: popular countries first
// (alphabetical among themselves), then everything else alphabetically.
export const DOCUMENT_COUNTRIES_SORTED: DocumentCountryDef[] = [
  ...DOCUMENT_COUNTRIES.filter(c => c.popular).sort((a, b) => a.name.localeCompare(b.name)),
  ...DOCUMENT_COUNTRIES.filter(c => !c.popular).sort((a, b) => a.name.localeCompare(b.name)),
];
export const DOCUMENT_COUNTRIES_POPULAR_COUNT = DOCUMENT_COUNTRIES.filter(c => c.popular).length;

// Document types flagged as higher legal risk — shown with a stronger
// warning since AI-assembled/grounded content alone shouldn't be trusted
// for these without real local legal review.
export const HIGH_RISK_DOCUMENT_TYPES = new Set<string>([
  // No entries yet — the previous vehicle-related slugs (inherited from
  // naira.autos) have been removed. Add slugs here for document types
  // that warrant a stronger "get this reviewed" warning.
]);

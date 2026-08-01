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
  // ── Sale & Ownership Transfer ──────────────────────────────────────────
  { slug: 'vehicle-bill-of-sale', label: 'Vehicle Bill of Sale', description: 'Transfers ownership of a vehicle from seller to buyer.', tier: 'template', category: 'Sale & Ownership Transfer', popular: true },
  { slug: 'vehicle-purchase-agreement', label: 'Vehicle Purchase Agreement (Detailed)', description: 'A fuller sale agreement with payment terms, as-is clauses, and defect disclosures.', tier: 'ai', category: 'Sale & Ownership Transfer', popular: true },
  { slug: 'installment-payment-agreement', label: 'Vehicle Installment Payment Agreement', description: 'A payment plan for a vehicle purchase spread over time.', tier: 'ai', category: 'Sale & Ownership Transfer', popular: true },
  { slug: 'deposit-reservation-agreement', label: 'Deposit / Reservation Agreement', description: 'Buyer pays a deposit to hold a vehicle before completing full payment.', tier: 'template', category: 'Sale & Ownership Transfer', popular: false },
  { slug: 'vehicle-trade-in-agreement', label: 'Vehicle Trade-In / Swap Agreement', description: 'A vehicle traded in as part or full payment toward another vehicle.', tier: 'ai', category: 'Sale & Ownership Transfer', popular: false },
  { slug: 'change-of-ownership-agreement', label: 'Change of Ownership Agreement', description: 'A broader transfer deed, also used for gifts or family transfers.', tier: 'template', category: 'Sale & Ownership Transfer', popular: false },
  { slug: 'as-is-sale-agreement', label: 'As-Is Vehicle Sale Agreement', description: 'A sale with no warranties — the buyer accepts the vehicle in its current condition.', tier: 'ai', category: 'Sale & Ownership Transfer', popular: true },

  // ── Hire, Lease & Rental ────────────────────────────────────────────────
  { slug: 'vehicle-lease-agreement', label: 'Vehicle Lease Agreement', description: 'Terms for leasing a vehicle over a fixed period.', tier: 'ai', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'ride-hailing-hire-purchase-agreement', label: 'Uber/Bolt Driver Hire-Purchase Agreement', description: 'Lease-to-own terms for a ride-hailing driver, with ownership transferring on completion.', tier: 'ai', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'ride-hailing-rental-agreement', label: 'Uber/Bolt Straight Rental Agreement', description: 'Fixed daily or weekly rental with no ownership change.', tier: 'template', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'dispatch-rider-hire-agreement', label: 'Dispatch Rider / Logistics Bike Hire Agreement', description: 'Hire terms for a delivery motorcycle.', tier: 'template', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'keke-lease-purchase-agreement', label: 'Keke (Tricycle) Lease-Purchase Agreement', description: 'Lease-to-own terms for a tricycle/keke.', tier: 'ai', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'peer-to-peer-rental-agreement', label: 'Peer-to-Peer Car Rental Agreement', description: 'Short-term rental of a vehicle between individuals.', tier: 'template', category: 'Hire, Lease & Rental', popular: false },
  { slug: 'fleet-lease-agreement', label: 'Fleet / Multi-Vehicle Lease Agreement', description: 'Negotiated lease terms for someone leasing several vehicles to an operator.', tier: 'ai', category: 'Hire, Lease & Rental', popular: false },

  // ── Ownership Structures & Finance ──────────────────────────────────────
  { slug: 'co-ownership-partnership-agreement', label: 'Co-Ownership / Partnership Agreement', description: 'Terms for two or more people jointly owning one vehicle.', tier: 'ai', category: 'Ownership Structures & Finance', popular: false },
  { slug: 'vehicle-loan-security-agreement', label: 'Vehicle Loan & Security Agreement', description: 'A loan used to buy a vehicle, with the vehicle pledged as collateral.', tier: 'ai', category: 'Ownership Structures & Finance', popular: true },
  { slug: 'private-loan-lien-agreement', label: 'Private Loan / Lien Agreement', description: 'One person financing another\u2019s car purchase, with the car as collateral.', tier: 'ai', category: 'Ownership Structures & Finance', popular: false },
  { slug: 'consignment-agreement', label: 'Consignment Agreement', description: 'Owner allows a dealer or agent to sell the car on their behalf for a commission.', tier: 'template', category: 'Ownership Structures & Finance', popular: false },
  { slug: 'lien-release-letter', label: 'Lien Release / Lien Satisfaction Letter', description: 'Confirms a vehicle loan has been paid off and the lien is released.', tier: 'template', category: 'Ownership Structures & Finance', popular: false },
  { slug: 'vehicle-repossession-notice', label: 'Vehicle Repossession Notice', description: 'A lender\u2019s formal notice of intent to repossess a vehicle after loan default.', tier: 'ai', category: 'Ownership Structures & Finance', popular: false },

  // ── Protection & Disputes ────────────────────────────────────────────────
  { slug: 'vehicle-condition-inspection-report', label: 'Vehicle Condition / Inspection Report', description: 'Signed at handover to record the vehicle\u2019s condition, protecting both sides.', tier: 'template', category: 'Protection & Disputes', popular: true },
  { slug: 'indemnity-liability-waiver', label: 'Indemnity & Liability Waiver', description: 'For test drives or temporary use of a vehicle.', tier: 'template', category: 'Protection & Disputes', popular: false },
  { slug: 'warranty-disclaimer-as-is-statement', label: 'Warranty Disclaimer / "Sold As-Is" Statement', description: 'A standalone statement disclaiming warranties, attached to any sale.', tier: 'template', category: 'Protection & Disputes', popular: false },
  { slug: 'affidavit-of-ownership', label: 'Affidavit of Ownership (Private)', description: 'A sworn statement affirming you are the rightful owner before a sale.', tier: 'template', category: 'Protection & Disputes', popular: false },
  { slug: 'storage-custody-agreement', label: 'Storage / Custody Agreement', description: 'Terms for leaving a vehicle with someone — a mechanic, friend, or dealer — for a period.', tier: 'template', category: 'Protection & Disputes', popular: false },
  { slug: 'purchase-contingency-addendum', label: 'Purchase Contingency Addendum', description: 'Makes a sale conditional on financing approval or a passed inspection.', tier: 'ai', category: 'Protection & Disputes', popular: false },
  { slug: 'cancellation-rescission-agreement', label: 'Cancellation / Rescission of Sale Agreement', description: 'Unwinds a sale during a cooling-off period.', tier: 'template', category: 'Protection & Disputes', popular: false },
  { slug: 'dispute-resolution-addendum', label: 'Dispute Resolution / Arbitration Clause Addendum', description: 'Sets how disputes arising from the sale will be resolved.', tier: 'ai', category: 'Protection & Disputes', popular: false },
  { slug: 'cross-border-sale-addendum', label: 'Cross-Border Sale Addendum', description: 'Covers currency, export paperwork, and shipping risk for an international private sale.', tier: 'ai', category: 'Protection & Disputes', popular: false },

  // ── Disclosure & Compliance ──────────────────────────────────────────────
  { slug: 'odometer-disclosure-statement', label: 'Odometer Disclosure Statement', description: 'Certifies the vehicle mileage at the time of sale.', tier: 'template', category: 'Disclosure & Compliance', popular: true },
  { slug: 'damage-accident-disclosure', label: 'Damage / Accident History Disclosure', description: 'Discloses known prior damage or accident history.', tier: 'ai', category: 'Disclosure & Compliance', popular: false },
  { slug: 'salvage-title-disclosure', label: 'Salvage / Rebuilt Title Disclosure', description: 'Discloses a salvage or rebuilt title status.', tier: 'ai', category: 'Disclosure & Compliance', popular: false },
  { slug: 'emissions-safety-inspection-disclosure', label: 'Emissions / Safety Inspection Disclosure', description: 'Discloses emissions or safety inspection status, where required.', tier: 'ai', category: 'Disclosure & Compliance', popular: false },
  { slug: 'ev-battery-health-disclosure', label: 'EV Battery Health / Warranty Disclosure', description: 'Discloses an EV\u2019s battery health and any remaining warranty.', tier: 'ai', category: 'Disclosure & Compliance', popular: false },
  { slug: 'telematics-gps-consent-form', label: 'Telematics / GPS Tracker Consent Form', description: 'Records consent to a vehicle tracker or telematics device.', tier: 'template', category: 'Disclosure & Compliance', popular: false },

  // ── Ownership Edge Cases ──────────────────────────────────────────────────
  { slug: 'vehicle-gift-affidavit', label: 'Vehicle Gift Affidavit', description: 'Documents a vehicle given as a gift with no money changing hands.', tier: 'template', category: 'Ownership Edge Cases', popular: true },
  { slug: 'deceased-owner-transfer-affidavit', label: 'Deceased Owner Transfer / Inheritance Affidavit', description: 'Transfers a vehicle from a deceased owner to an heir.', tier: 'ai', category: 'Ownership Edge Cases', popular: false },
  { slug: 'spousal-co-owner-consent', label: 'Spousal or Co-Owner Consent to Sell', description: 'Records a co-owner or spouse\u2019s consent to sell a jointly held vehicle.', tier: 'template', category: 'Ownership Edge Cases', popular: false },
  { slug: 'corporate-authorization-letter', label: 'Corporate Authorization Letter', description: 'Authorizes a signatory to sell a vehicle on a company\u2019s behalf.', tier: 'template', category: 'Ownership Edge Cases', popular: false },
  { slug: 'vehicle-power-of-attorney', label: 'Vehicle Power of Attorney', description: 'Authorizes someone else to handle vehicle transactions on your behalf.', tier: 'ai', category: 'Ownership Edge Cases', popular: true },
  { slug: 'release-of-liability', label: 'Release of Liability (Notice of Sale)', description: 'Notifies of a completed sale to release the seller from future liability.', tier: 'template', category: 'Ownership Edge Cases', popular: true },
  { slug: 'vehicle-donation-agreement', label: 'Vehicle Donation Agreement', description: 'Documents a vehicle donated to a charity or organization, with no payment involved.', tier: 'template', category: 'Ownership Edge Cases', popular: false },

  // ── Fleet & Business Use ───────────────────────────────────────────────────
  { slug: 'company-car-policy', label: 'Company Car Policy / Use Agreement', description: 'Sets terms for an employee\u2019s use of a company vehicle.', tier: 'template', category: 'Fleet & Business Use', popular: false },
  { slug: 'fleet-sale-nda', label: 'NDA for Bulk/Fleet Sale Negotiations', description: 'Confidentiality agreement for negotiating a bulk or fleet vehicle sale.', tier: 'template', category: 'Fleet & Business Use', popular: false },
  { slug: 'fleet-vehicle-assignment-agreement', label: 'Fleet Vehicle Assignment Agreement', description: 'Assigns a specific company vehicle to an employee or driver, with terms of use.', tier: 'template', category: 'Fleet & Business Use', popular: false },

  // ── Other vehicle types ─────────────────────────────────────────────────
  { slug: 'motorcycle-bill-of-sale', label: 'Motorcycle Bill of Sale', description: 'Transfers ownership of a motorcycle.', tier: 'template', category: 'Other Vehicle Types', popular: false },
  { slug: 'trailer-equipment-bill-of-sale', label: 'Trailer / Equipment Bill of Sale', description: 'Transfers ownership of a trailer or heavy equipment.', tier: 'template', category: 'Other Vehicle Types', popular: false },
  { slug: 'salvage-yard-purchase-agreement', label: 'Salvage Yard Vehicle Purchase Agreement', description: 'A sale of a vehicle sold for parts or scrap through a salvage yard.', tier: 'template', category: 'Other Vehicle Types', popular: false },

  // ── Registration & Compliance ──────────────────────────────────────────
  { slug: 'duplicate-title-affidavit', label: 'Duplicate Title / Lost Registration Affidavit', description: 'A sworn statement to request a replacement for a lost vehicle title or registration.', tier: 'template', category: 'Registration & Compliance', popular: false },
  { slug: 'insurance-claim-authorization-letter', label: 'Vehicle Insurance Claim Authorization Letter', description: 'Authorizes someone else to file or handle a vehicle insurance claim on your behalf.', tier: 'template', category: 'Registration & Compliance', popular: false },
  { slug: 'vehicle-import-declaration', label: 'Vehicle Import Declaration Letter', description: 'Declares a vehicle being imported, its origin, value, and specification for customs.', tier: 'ai', category: 'Registration & Compliance', popular: false },
  { slug: 'customs-clearance-authorization', label: 'Customs Clearance Authorization Letter', description: 'Authorizes an agent or clearing agent to clear a vehicle through customs on your behalf.', tier: 'template', category: 'Registration & Compliance', popular: false },
  { slug: 'vehicle-impound-release-authorization', label: 'Vehicle Impound Release Authorization', description: 'Authorizes someone else to collect an impounded vehicle on the owner\u2019s behalf.', tier: 'template', category: 'Registration & Compliance', popular: false },
  { slug: 'roadworthiness-certificate-request', label: 'Roadworthiness Certificate Request Letter', description: 'A formal request for a roadworthiness or safety inspection certificate.', tier: 'template', category: 'Registration & Compliance', popular: false },

  // ── Repair & Service ────────────────────────────────────────────────────
  { slug: 'auto-repair-authorization-form', label: 'Auto Repair Authorization & Estimate Form', description: 'Authorizes a repair shop to carry out specific work at an agreed estimated cost.', tier: 'template', category: 'Repair & Service', popular: false },
  { slug: 'extended-warranty-agreement', label: 'Extended Warranty Purchase Agreement', description: 'Terms for a vehicle warranty purchased beyond the manufacturer\u2019s original coverage.', tier: 'ai', category: 'Repair & Service', popular: false },
  { slug: 'rental-car-damage-waiver', label: 'Rental Car Damage Waiver Agreement', description: 'Terms under which a renter is or isn\u2019t liable for damage to a rented vehicle.', tier: 'template', category: 'Repair & Service', popular: false },
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
export const HIGH_RISK_DOCUMENT_TYPES = new Set([
  'vehicle-loan-security-agreement',
  'private-loan-lien-agreement',
  'vehicle-power-of-attorney',
  'vehicle-repossession-notice',
]);

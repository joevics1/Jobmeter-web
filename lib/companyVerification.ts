// Auto-verifies a company when the poster's own email domain matches the
// company's stated website/email domain — a real (if imperfect) signal
// they actually work there, versus anyone just typing a company name.
// Free/personal email providers never count as a match. Anything that
// doesn't match stays unverified for admin review at /admin/companies
// rather than silently trusting the claim.
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'aol.com', 'protonmail.com', 'live.com', 'mail.com',
]);

function extractDomain(value: string | null | undefined): string | null {
  if (!value) return null;
  const emailMatch = value.match(/@([\w.-]+\.\w+)/);
  if (emailMatch) return emailMatch[1].toLowerCase();
  try {
    const url = value.startsWith('http') ? value : `https://${value}`;
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

export function shouldAutoVerifyCompany(
  userEmail: string | null | undefined,
  companyWebsiteUrl: string | null | undefined,
  companyEmail: string | null | undefined
): boolean {
  const userDomain = extractDomain(userEmail);
  const companyDomain = extractDomain(companyWebsiteUrl) || extractDomain(companyEmail);
  return !!userDomain && !!companyDomain && userDomain === companyDomain && !PERSONAL_EMAIL_DOMAINS.has(userDomain);
}

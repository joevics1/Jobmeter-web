// Pure-JS CIDR matching — safe for the Edge runtime (no Node `net`/`Buffer`,
// which aren't available there). IPv4 uses plain 32-bit arithmetic; IPv6
// uses BigInt since a full address doesn't fit in a JS number.

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    result = (result << 8) | n;
  }
  return result >>> 0;
}

function ipv6ToBigInt(ip: string): bigint | null {
  // Expand "::" shorthand, then parse each 16-bit group.
  if (ip.includes('.')) return null; // skip IPv4-mapped forms, not needed here
  const [head, tail] = ip.split('::');
  const headParts = head ? head.split(':').filter(Boolean) : [];
  const tailParts = tail ? tail.split(':').filter(Boolean) : [];
  const missing = 8 - (headParts.length + tailParts.length);
  if (ip.includes('::')) {
    if (missing < 0) return null;
  } else if (headParts.length !== 8) {
    return null;
  }
  const groups = ip.includes('::')
    ? [...headParts, ...Array(missing).fill('0'), ...tailParts]
    : headParts;
  if (groups.length !== 8) return null;

  let result = BigInt(0);
  for (const g of groups) {
    const n = parseInt(g, 16);
    if (Number.isNaN(n) || n < 0 || n > 0xffff) return null;
    result = (result << BigInt(16)) | BigInt(n);
  }
  return result;
}

/** Returns true if `ip` falls inside the given CIDR block (e.g. "66.249.64.0/19"). */
export function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split('/');
  const bits = Number(bitsStr);
  if (Number.isNaN(bits)) return false;

  const isV6 = ip.includes(':') || range.includes(':');
  if (isV6) {
    const ipNum = ipv6ToBigInt(ip);
    const rangeNum = ipv6ToBigInt(range);
    if (ipNum === null || rangeNum === null) return false;
    const shift = BigInt(128 - bits);
    const full = (BigInt(1) << BigInt(128)) - BigInt(1);
    const mask = shift >= BigInt(128) ? BigInt(0) : (~BigInt(0) << shift) & full;
    return (ipNum & mask) === (rangeNum & mask);
  }

  const ipNum = ipv4ToInt(ip);
  const rangeNum = ipv4ToInt(range);
  if (ipNum === null || rangeNum === null) return false;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipNum & mask) === (rangeNum & mask);
}

/** Returns true if `ip` falls inside ANY of the given CIDR blocks. */
export function ipInAnyCidr(ip: string, cidrs: string[]): boolean {
  return cidrs.some((c) => ipInCidr(ip, c));
}

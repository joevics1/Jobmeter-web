import { ROLE_LIBRARY, RoleDefinition, Seniority } from '@/lib/data/roles';

export interface MatchedRole {
  role: string;
  seniority: Seniority;
  description: string;
  requiredSkills: string[];
  skillGaps: string[];
  certifications: string[];
  salaryRange: string;
  matchScore: number;
}

export interface RoleFinderResult {
  roles: MatchedRole[];
  summary: string;
  totalSkillsMatched: number;
}

// Typical years-of-experience window for each seniority tier — used only to
// nudge scores toward roles that fit the person's stated experience, not to
// hard-filter results.
const SENIORITY_YEARS: Record<Seniority, [number, number]> = {
  Entry: [0, 1],
  Junior: [0, 2],
  Mid: [2, 5],
  Senior: [5, 9],
  Lead: [8, 14],
  Principal: [12, 99],
};

const MAX_RESULTS = 12;
const MIN_RESULTS = 6;
const MIN_SCORE_PREFERRED = 50;
const MIN_SCORE_FALLBACK = 25;

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

// Loose match so "React.js" matches "React", "JS" overlaps "JavaScript", etc.
function skillsMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.includes(nb) || nb.includes(na);
}

function currency(salaryRangeNGN: string, salaryRangeUSD: string): string {
  return `${salaryRangeNGN} (or ${salaryRangeUSD} for remote/international roles)`;
}

interface ScoredRole {
  def: RoleDefinition;
  matchScore: number;
  matchedSkills: string[];
}

export function findMatchingRoles(
  userSkills: string[],
  tools: string[] | undefined,
  yearsOfExperience: number | null | undefined
): RoleFinderResult {
  const userTerms = [...userSkills, ...(tools || [])].filter(Boolean);

  const scored: ScoredRole[] = [];

  for (const def of ROLE_LIBRARY) {
    const matchedSkills = def.requiredSkills.filter((rs) =>
      userTerms.some((u) => skillsMatch(u, rs))
    );
    if (matchedSkills.length === 0) continue;

    let score = Math.round((matchedSkills.length / def.requiredSkills.length) * 100);

    if (yearsOfExperience != null) {
      const [min, max] = SENIORITY_YEARS[def.seniority];
      if (yearsOfExperience < min - 1 || yearsOfExperience > max + 3) {
        score -= 20;
      } else {
        score += 5;
      }
    }

    score = Math.max(0, Math.min(99, score));
    scored.push({ def, matchScore: score, matchedSkills });
  }

  // Keep only the best-scoring seniority tier per role family, so we don't
  // show "Junior/Mid/Senior Software Engineer" all at once.
  const bestByFamily = new Map<string, ScoredRole>();
  for (const s of scored) {
    const existing = bestByFamily.get(s.def.family);
    if (!existing || s.matchScore > existing.matchScore) {
      bestByFamily.set(s.def.family, s);
    }
  }

  let candidates = Array.from(bestByFamily.values()).sort(
    (a, b) => b.matchScore - a.matchScore || b.matchedSkills.length - a.matchedSkills.length
  );

  let preferred = candidates.filter((c) => c.matchScore >= MIN_SCORE_PREFERRED);
  if (preferred.length < MIN_RESULTS) {
    preferred = candidates.filter((c) => c.matchScore >= MIN_SCORE_FALLBACK);
  }

  const top = preferred.slice(0, MAX_RESULTS);

  const roles: MatchedRole[] = top.map(({ def, matchScore, matchedSkills }) => ({
    role: def.role,
    seniority: def.seniority,
    description: def.description,
    requiredSkills: def.requiredSkills,
    skillGaps: def.requiredSkills.filter((rs) => !matchedSkills.includes(rs)).slice(0, 4),
    certifications: def.certifications,
    salaryRange: currency(def.salaryRangeNGN, def.salaryRangeUSD),
    matchScore,
  }));

  const matchedUserSkillSet = new Set<string>();
  for (const { def, matchedSkills } of top) {
    for (const rs of def.requiredSkills) {
      if (matchedSkills.includes(rs)) {
        const hit = userTerms.find((u) => skillsMatch(u, rs));
        if (hit) matchedUserSkillSet.add(normalize(hit));
      }
    }
  }

  const topCategories = Array.from(
    top.reduce((acc, { def }) => {
      acc.set(def.category, (acc.get(def.category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  const summary =
    roles.length > 0
      ? `Based on your skills, you're best positioned for roles in ${topCategories
          .slice(0, 2)
          .map(([c]) => c)
          .join(' and ')}. ${roles.length} role${roles.length === 1 ? '' : 's'} matched your profile.`
      : `We couldn't find a strong match for those skills yet. Try adding a few more skills or tools.`;

  return {
    roles,
    summary,
    totalSkillsMatched: matchedUserSkillSet.size,
  };
}

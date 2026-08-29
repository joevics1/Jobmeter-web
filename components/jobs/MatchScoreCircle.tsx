"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

interface MatchScoreCircleProps {
  /** Match percentage (0-100). Pass null while unknown / not yet computed. */
  score: number | null;
  /** True while a logged-in user's score is being computed. */
  loading?: boolean;
  /** Whether the visitor is logged in. Controls the placeholder state. */
  loggedIn: boolean;
  onClick: () => void;
  className?: string;
}

/** Same 3-tier system used on job cards: green (good) / yellow (average) / red (low). */
function getMatchColors(score: number) {
  if (score >= 50) return { text: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
  if (score >= 31) return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
  return { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
}

export default function MatchScoreCircle({
  score,
  loading = false,
  loggedIn,
  onClick,
  className = '',
}: MatchScoreCircleProps) {
  // Logged in but score still being computed
  if (loggedIn && (loading || score === null)) {
    return (
      <button
        type="button"
        disabled
        aria-label="Calculating your match score"
        className={`flex-shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center ${className}`}
        style={{ borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }}
      >
        <Loader2 size={18} className="animate-spin" style={{ color: '#94A3B8' }} />
      </button>
    );
  }

  // Logged out shows a 0% placeholder — clicking prompts login instead of a real score
  const displayScore = loggedIn ? (score as number) : 0;
  const { text, bg, border } = getMatchColors(displayScore);
  const label = loggedIn ? `${displayScore}% match — tap for details` : 'Sign in to see your match score';

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex-shrink-0 w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center leading-none transition-transform hover:scale-105 ${className}`}
      style={{ borderColor: border, backgroundColor: bg }}
    >
      <span className="text-base font-bold" style={{ color: text }}>
        {displayScore}%
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: text }}>
        Match
      </span>
    </button>
  );
}

"use client";

import React from 'react';
import { Loader2, Target } from 'lucide-react';

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
  // Logged out — neutral placeholder, click prompts login
  if (!loggedIn) {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Sign in to see your match score"
        aria-label="Sign in to see your match score"
        className={`flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105 ${className}`}
        style={{ borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }}
      >
        <Target size={16} style={{ color: '#94A3B8' }} />
      </button>
    );
  }

  // Logged in but score still being computed
  if (loading || score === null) {
    return (
      <button
        type="button"
        disabled
        aria-label="Calculating your match score"
        className={`flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center ${className}`}
        style={{ borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }}
      >
        <Loader2 size={16} className="animate-spin" style={{ color: '#94A3B8' }} />
      </button>
    );
  }

  const { text, bg, border } = getMatchColors(score);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${score}% match — tap for details`}
      aria-label={`${score}% match — tap for details`}
      className={`flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105 ${className}`}
      style={{ borderColor: border, backgroundColor: bg }}
    >
      <span className="text-[11px] font-bold leading-none" style={{ color: text }}>
        {score}%
      </span>
    </button>
  );
}

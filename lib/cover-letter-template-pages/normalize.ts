// lib/cover-letter-template-pages/normalize.ts
// Cover letter sample data (preview_cover_letter_data, generated once per
// role by generate-cover-letter-template-page and stored in the DB) can go
// stale or come out slightly off — an AI-written date that isn't today,
// or occasionally a salutation that isn't a clean "Dear ___,". Rather than
// regenerate ~500 stored rows, this normalizes the three fields that
// should never look stale or unprofessional at the moment a NEW letter
// session starts (Quick Create / Edit / Clear). Never applied to a saved
// history entry — those are the user's own edited letters and shouldn't
// be silently rewritten.

import type { CoverLetterData } from './cover-letter-data-types';

const LOOKS_PROFESSIONAL = /^dear\s+.+,\s*$/i;

export function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function normalizeForNewSession(data: CoverLetterData): CoverLetterData {
  const salutation = data.salutation && LOOKS_PROFESSIONAL.test(data.salutation.trim())
    ? data.salutation
    : `Dear ${data.recipient?.hiringManagerName || 'Hiring Manager'},`;

  return {
    ...data,
    date: todayFormatted(),
    salutation,
    signOff: data.signOff?.trim() || 'Sincerely,',
  };
}

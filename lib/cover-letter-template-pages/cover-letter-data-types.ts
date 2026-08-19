// Cover Letter Data Types - Structured data format for cover letter
// storage and rendering. Deliberately a much flatter shape than CVData:
// a cover letter is prose (a handful of paragraphs), not a list of
// sections, so there's no accordion of repeatable entries here.

export interface CoverLetterData {
  personalDetails: {
    name: string;
    title: string; // Professional title, shown under the name in the header
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  date: string; // e.g. "August 19, 2026" — free text, not a <date> input
  recipient: {
    hiringManagerName?: string; // falls back to "Hiring Manager" if empty
    companyName: string;
    companyAddress?: string;
  };
  salutation: string; // e.g. "Dear Hiring Manager," — editable, not auto-derived
  openingParagraph: string; // hook + which role you're applying for
  bodyParagraphs: string[]; // 1-3 paragraphs connecting experience to the role
  closingParagraph: string; // call to action / availability
  signOff: string; // e.g. "Sincerely,"
}

// The design list for this feature lives in ./design-list.ts
// (COVER_LETTER_PAGE_DESIGNS) — each `id` must have a matching case in
// cover-letter-renderer.ts.

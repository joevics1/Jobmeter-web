// lib/cover-letter-template-pages/design-list.ts
// Placeholder design list for the Cover Letter Templates feature, same
// pattern as lib/cv-template-pages/design-list.ts. Each `id` must have a
// matching case in cover-letter-renderer.ts. Replace/extend once real
// designs are shared — CVs started at 8, this starts smaller since letters
// are a single flowing document rather than a multi-section layout.

export interface CoverLetterPageDesign {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const COVER_LETTER_PAGE_DESIGNS: CoverLetterPageDesign[] = [
  { id: 'cl-template-1', name: 'Classic Block', description: 'Traditional left-aligned business letter format', category: 'Professional' },
  { id: 'cl-template-2', name: 'Modern Header', description: 'Bold name header with a colored accent rule', category: 'Modern' },
  { id: 'cl-template-3', name: 'Minimal Serif', description: 'Understated serif typography, generous whitespace', category: 'Minimal' },
  { id: 'cl-template-4', name: 'Sidebar Contact', description: 'Contact details in a slim colored sidebar', category: 'Creative' },
  { id: 'cl-template-5', name: 'Executive', description: 'Centered header, formal tone for senior roles', category: 'Executive' },
];

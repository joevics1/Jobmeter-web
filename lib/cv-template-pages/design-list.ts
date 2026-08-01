// lib/cv-template-pages/design-list.ts
// Placeholder design list for the CV Templates feature — copied from the
// existing CV_TEMPLATES as a starting point only. Replace with the actual
// designs once shared; each `id` must have a matching case in cv-renderer.ts.

export interface CVPageDesign {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const CV_PAGE_DESIGNS: CVPageDesign[] = [
  { id: 'template-1', name: 'Purple Classic', description: 'Traditional professional layout with clean typography', category: 'Professional' },
  { id: 'template-2', name: 'Burgundy Elegant', description: 'Bold colors and contemporary design', category: 'Creative' },
  { id: 'template-3', name: 'Purple Modern', description: 'Simple, elegant design focusing on content', category: 'Minimal' },
  { id: 'template-5', name: 'Blue Professional', description: 'Sophisticated layout for senior leadership', category: 'Executive' },
  { id: 'template-6', name: 'Clean Professional', description: 'Academic-focused design', category: 'Academic' },
];

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
  { id: 'template-5', name: 'Blue Professional', description: 'Sophisticated layout for senior leadership', category: 'Executive' },
  { id: 'template-6', name: 'Clean Professional', description: 'Academic-focused design', category: 'Academic' },
  { id: 'template-7', name: 'Executive Leadership', description: 'Comprehensive format for senior positions', category: 'Executive' },
  { id: 'template-8', name: 'Gray Serif', description: 'Two-column layout with a vertical divider', category: 'Professional' },
  { id: 'template-9', name: 'Modern Minimal', description: 'Clean minimal design with rounded section headers', category: 'Minimal' },
  { id: 'template-10', name: 'Color Sidebar', description: 'Grid layout with a colored sidebar', category: 'Creative' },
  { id: 'template-11', name: 'Creative Layout', description: 'Grid layout with a dark blue sidebar', category: 'Creative' },
  { id: 'template-12', name: 'Startup Bold', description: 'Two-column layout with an initials background', category: 'Bold' },
];

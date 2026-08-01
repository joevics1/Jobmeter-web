// app/cv-templates/build/page.tsx
// Standalone CV builder for the CV Templates feature. Reads ?role=&country=
// from the landing pages. Fully isolated from /cv/create — no imports from
// the existing CV/cover-letter code, only lib/cv-template-pages/*.

import BuildClient from './client';

export const metadata = {
  title: 'Build Your CV | JobMeter',
  description: 'Fill in your details, pick a design, and generate your CV in minutes.',
};

export default function BuildPage() {
  return <BuildClient />;
}

// lib/cv-template-pages/cv-docx-export.ts
// Word (.docx) export for the CV Templates feature. Isolated file — mirrors
// the pattern used by naira-autos' DocumentEditor.downloadDocx (dynamic
// import of `docx`, build paragraphs, Packer.toBlob, trigger download).
// Does not import or modify any existing CV/document export code.

import type { CVData } from './cv-data-types';

export async function downloadCVAsDocx(data: CVData, fileNamePrefix: string) {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
  } = await import('docx');

  const children: any[] = [
    new Paragraph({
      text: data.personalDetails.name,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: [
            data.personalDetails.title,
            data.personalDetails.email,
            data.personalDetails.phone,
            data.personalDetails.location,
          ].filter(Boolean).join('  |  '),
          size: 20,
          color: '555555',
        }),
      ],
    }),
  ];

  if (data.summary) {
    children.push(
      new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ text: data.summary, spacing: { after: 200 } }),
    );
  }

  if (data.skills?.length) {
    children.push(
      new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ text: data.skills.join(', '), spacing: { after: 200 } }),
    );
  }

  if (data.experience?.length) {
    children.push(new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const exp of data.experience) {
      children.push(
        new Paragraph({
          spacing: { before: 150, after: 50 },
          children: [
            new TextRun({ text: `${exp.role} — ${exp.company}`, bold: true }),
            new TextRun({ text: `   ${exp.years}`, italics: true, color: '666666' }),
          ],
        }),
      );
      for (const bullet of exp.bullets || []) {
        children.push(new Paragraph({ text: `•  ${bullet}`, spacing: { after: 50 } }));
      }
    }
  }

  if (data.education?.length) {
    children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const edu of data.education) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: `${edu.degree}, ${edu.institution}`, bold: true }),
            new TextRun({ text: `   ${edu.years}`, italics: true, color: '666666' }),
          ],
        }),
      );
    }
  }

  if (data.certifications?.length) {
    children.push(
      new Paragraph({ text: 'CERTIFICATIONS', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({
        text: data.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(', ')).join('  |  '),
        spacing: { after: 200 },
      }),
    );
  }

  if (data.languages?.length) {
    children.push(
      new Paragraph({ text: 'LANGUAGES', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ text: data.languages.join(', '), spacing: { after: 200 } }),
    );
  }

  // A subtle divider before the end, matching naira-autos' visual convention
  children.push(new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } }, spacing: { before: 300 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix.replace(/\s+/g, '-').toLowerCase()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

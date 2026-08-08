// lib/cv-template-pages/cv-docx-export.ts
// Word (.docx) export for the CV Templates feature. Isolated file — mirrors
// the pattern used by naira-autos' DocumentEditor.downloadDocx (dynamic
// import of `docx`, build paragraphs, Packer.toBlob, trigger download).
// Does not import or modify any existing CV/document export code.
//
// Section order and headings match cv-renderer.ts so the Word download
// never has less content than the PDF/preview: Summary, Roles, Experience,
// Education, Projects, Accomplishments, Awards, Certifications, Skills,
// Languages, Interests, Publications, Volunteer Work, Additional Sections.

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

  // Social/portfolio links — previously dropped entirely from the Word export.
  const links = [data.personalDetails.linkedin, data.personalDetails.github, data.personalDetails.portfolio].filter(Boolean);
  if (links.length) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: links.join('  |  '), size: 18, color: '2563EB' })],
      }),
    );
  }

  const heading = (text: string) =>
    new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } });

  if (data.summary) {
    children.push(heading('PROFESSIONAL SUMMARY'), new Paragraph({ text: data.summary, spacing: { after: 200 } }));
  }

  if (data.roles?.length) {
    children.push(heading('PROFESSIONAL ROLES'));
    for (const role of data.roles) {
      children.push(new Paragraph({ text: `•  ${role}`, spacing: { after: 50 } }));
    }
  }

  if (data.experience?.length) {
    children.push(heading('WORK EXPERIENCE'));
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
    children.push(heading('EDUCATION'));
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

  if (data.projects?.length) {
    children.push(heading('PROJECTS'));
    for (const p of data.projects) {
      children.push(
        new Paragraph({ spacing: { before: 100, after: 30 }, children: [new TextRun({ text: p.title, bold: true })] }),
      );
      if (p.description) children.push(new Paragraph({ text: p.description, spacing: { after: 100 } }));
    }
  }

  if (data.accomplishments?.length) {
    children.push(heading('KEY ACCOMPLISHMENTS'));
    for (const a of data.accomplishments) {
      children.push(new Paragraph({ text: `•  ${a}`, spacing: { after: 50 } }));
    }
  }

  if (data.awards?.length) {
    children.push(heading('AWARDS'));
    for (const a of data.awards) {
      children.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({ text: a.title, bold: true }),
            ...(a.issuer || a.year
              ? [new TextRun({ text: `   ${[a.issuer, a.year].filter(Boolean).join(', ')}`, italics: true, color: '666666' })]
              : []),
          ],
        }),
      );
    }
  }

  if (data.certifications?.length) {
    children.push(
      heading('CERTIFICATIONS'),
      new Paragraph({
        text: data.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(', ')).join('  |  '),
        spacing: { after: 200 },
      }),
    );
  }

  if (data.skills?.length) {
    children.push(heading('SKILLS'), new Paragraph({ text: data.skills.join(', '), spacing: { after: 200 } }));
  }

  if (data.languages?.length) {
    children.push(heading('LANGUAGES'), new Paragraph({ text: data.languages.join(', '), spacing: { after: 200 } }));
  }

  if (data.interests?.length) {
    children.push(heading('INTERESTS'), new Paragraph({ text: data.interests.join(', '), spacing: { after: 200 } }));
  }

  if (data.publications?.length) {
    children.push(heading('PUBLICATIONS'));
    for (const p of data.publications) {
      children.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({ text: p.title, bold: true }),
            ...(p.journal || p.year
              ? [new TextRun({ text: `   ${[p.journal, p.year].filter(Boolean).join(', ')}`, italics: true, color: '666666' })]
              : []),
          ],
        }),
      );
    }
  }

  if (data.volunteerWork?.length) {
    children.push(heading('VOLUNTEER WORK'));
    for (const v of data.volunteerWork) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            new TextRun({ text: [v.organization, v.role].filter(Boolean).join(' — '), bold: true }),
            ...(v.duration ? [new TextRun({ text: `   ${v.duration}`, italics: true, color: '666666' })] : []),
          ],
        }),
      );
      if (v.description) children.push(new Paragraph({ text: v.description, spacing: { after: 100 } }));
    }
  }

  if (data.additionalSections?.length) {
    for (const s of data.additionalSections) {
      children.push(heading(s.sectionName.toUpperCase()), new Paragraph({ text: s.content, spacing: { after: 200 } }));
    }
  }

  if (data.references?.length) {
    children.push(new Paragraph({ text: 'REFERENCES', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const ref of data.references) {
      children.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({ text: [ref.name, ref.title, ref.company].filter(Boolean).join(', '), bold: true }),
          ],
        }),
        new Paragraph({ text: [ref.phone, ref.email].filter(Boolean).join('  |  '), spacing: { after: 100 } }),
      );
    }
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

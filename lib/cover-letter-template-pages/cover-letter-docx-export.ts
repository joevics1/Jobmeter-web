// lib/cover-letter-template-pages/cover-letter-docx-export.ts
// Word (.docx) export for the Cover Letter Templates feature — same
// pattern as lib/cv-template-pages/cv-docx-export.ts (dynamic import of
// `docx`, build paragraphs, Packer.toBlob, trigger download). Isolated
// file, not imported from/into the CV export.

import type { CoverLetterData } from './cover-letter-data-types';

export async function downloadCoverLetterAsDocx(data: CoverLetterData, fileNamePrefix: string) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');

  const { personalDetails } = data;
  const children: any[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({ text: personalDetails.name, bold: true, size: 28 })],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: [personalDetails.email, personalDetails.phone, personalDetails.location, personalDetails.linkedin, personalDetails.portfolio]
            .filter(Boolean)
            .join('  |  '),
          size: 20,
          color: '555555',
        }),
      ],
    }),
    new Paragraph({ text: data.date, spacing: { after: 300 } }),
  ];

  const recipientLines = [data.recipient.hiringManagerName, data.recipient.companyName, data.recipient.companyAddress].filter(Boolean);
  for (const line of recipientLines) {
    children.push(new Paragraph({ text: line as string, spacing: { after: 40 } }));
  }
  if (recipientLines.length) children.push(new Paragraph({ text: '', spacing: { after: 260 } }));

  const salutation = data.salutation || `Dear ${data.recipient.hiringManagerName || 'Hiring Manager'},`;
  children.push(new Paragraph({ text: salutation, spacing: { after: 260 } }));

  const addParagraphText = (text: string) => {
    for (const p of text.split(/\n+/).map((s) => s.trim()).filter(Boolean)) {
      children.push(new Paragraph({ text: p, spacing: { after: 220 } }));
    }
  };

  if (data.openingParagraph) addParagraphText(data.openingParagraph);
  for (const p of data.bodyParagraphs || []) addParagraphText(p);
  if (data.closingParagraph) addParagraphText(data.closingParagraph);

  children.push(
    new Paragraph({ text: data.signOff || 'Sincerely,', spacing: { before: 200, after: 500 } }),
    new Paragraph({ children: [new TextRun({ text: personalDetails.name, bold: true })] }),
  );

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix.replace(/\s+/g, '-').toLowerCase()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

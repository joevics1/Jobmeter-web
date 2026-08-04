// lib/document-docx-export.ts
//
// Shared "build a .docx from a GeneratedDocument and trigger a download"
// helper. Extracted out of DocumentEditor so the same logic can be reused
// anywhere a document (real or placeholder-filled preview) needs to be
// downloaded as Word — e.g. the result screen, and the Screen 1 preview
// on /documents/[type]/[country].

import { GeneratedDocument, sanitizeDocument } from '@/lib/document-format';

export async function downloadDocx(document: GeneratedDocument, fileNamePrefix: string): Promise<void> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
  } = await import('docx');

  const doc = sanitizeDocument(document);
  const children: any[] = [
    new Paragraph({
      text: doc.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
  ];

  if (doc.intro) {
    children.push(new Paragraph({ text: doc.intro, spacing: { after: 300 } }));
  }

  for (const section of doc.sections) {
    children.push(new Paragraph({
      text: section.heading,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }));
    for (const para of section.body.split(/\n\n+/)) {
      if (para.trim()) {
        children.push(new Paragraph({ text: para.trim(), spacing: { after: 150 } }));
      }
    }
  }

  children.push(new Paragraph({
    text: 'SIGNATURES',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 300 },
  }));

  for (const sig of doc.signatures) {
    children.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' } },
        spacing: { before: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `${sig.role} — Signature`, size: 18, color: '666666' })],
        spacing: { after: 300 },
      }),
      new Paragraph({ text: `${sig.role} — Printed Name: ________________________   Date: ______________`, spacing: { after: 300 } }),
    );
  }

  const docxDoc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(docxDoc);
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix.replace(/\s+/g, '-').toLowerCase()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

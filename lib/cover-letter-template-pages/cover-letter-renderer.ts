// Cover Letter Template Renderer - Renders structured CoverLetterData to
// HTML for different designs. All designs enforce strict 1-page A4 format,
// same convention as lib/cv-template-pages/cv-renderer.ts.

import type { CoverLetterData } from './cover-letter-data-types';

function htmlEscape(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Paragraph text may contain literal newlines from a textarea — turn each
// into its own <p>, and escape first so nothing in the text can break out.
function paragraphsHtml(text: string | undefined, className = 'body-para'): string {
  if (!text) return '';
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p class="${className}">${htmlEscape(p)}</p>`)
    .join('');
}

function recipientLine(data: CoverLetterData): string {
  const { hiringManagerName, companyName, companyAddress } = data.recipient;
  const lines = [hiringManagerName, companyName, companyAddress].filter(Boolean).map(htmlEscape);
  return lines.map((l) => `<div>${l}</div>`).join('');
}

function salutationOrDefault(data: CoverLetterData): string {
  return htmlEscape(data.salutation) || `Dear ${htmlEscape(data.recipient.hiringManagerName) || 'Hiring Manager'},`;
}

const PAGE_SHELL_OPEN = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cover Letter</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
@page { size: A4; margin: 0; }
body { font-family: Arial, Helvetica, sans-serif; background: #fff; }
.page { width: 210mm; min-height: 297mm; max-height: 297mm; background: #fff; padding: 18mm 20mm; overflow: hidden; }
.body-para { font-size: 12px; line-height: 1.7; color: #2d2d2d; margin-bottom: 12px; }
</style>
</head>
<body>`;
const PAGE_SHELL_CLOSE = `</body></html>`;

function renderClassicBlock(data: CoverLetterData): string {
  const { personalDetails } = data;
  const contact = [personalDetails.email, personalDetails.phone, personalDetails.location, personalDetails.linkedin, personalDetails.portfolio]
    .filter(Boolean).map(htmlEscape).join(' | ');

  return `${PAGE_SHELL_OPEN}
<style>
  .name { font-size: 22px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; }
  .contact { font-size: 11px; color: #555; margin-bottom: 24px; }
  .date { font-size: 12px; color: #333; margin-bottom: 16px; }
  .recipient { font-size: 12px; color: #333; margin-bottom: 16px; line-height: 1.5; }
  .salutation { font-size: 12px; color: #1a1a1a; margin-bottom: 14px; }
  .signoff { font-size: 12px; margin-top: 20px; }
  .signoff-name { font-size: 13px; font-weight: bold; margin-top: 32px; }
</style>
<div class="page">
  <div class="name">${htmlEscape(personalDetails.name)}</div>
  <div class="contact">${contact}</div>
  <div class="date">${htmlEscape(data.date)}</div>
  <div class="recipient">${recipientLine(data)}</div>
  <div class="salutation">${salutationOrDefault(data)}</div>
  ${paragraphsHtml(data.openingParagraph)}
  ${(data.bodyParagraphs || []).map((p) => paragraphsHtml(p)).join('')}
  ${paragraphsHtml(data.closingParagraph)}
  <div class="signoff">${htmlEscape(data.signOff) || 'Sincerely,'}</div>
  <div class="signoff-name">${htmlEscape(personalDetails.name)}</div>
</div>
${PAGE_SHELL_CLOSE}`;
}

function renderModernHeader(data: CoverLetterData): string {
  const { personalDetails } = data;
  const contact = [personalDetails.email, personalDetails.phone, personalDetails.location]
    .filter(Boolean).map(htmlEscape).join('  •  ');

  return `${PAGE_SHELL_OPEN}
<style>
  .header { border-bottom: 3px solid #2563EB; padding-bottom: 14px; margin-bottom: 24px; }
  .name { font-size: 26px; font-weight: bold; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px; }
  .title { font-size: 13px; color: #2563EB; font-weight: 600; margin-top: 2px; }
  .contact { font-size: 11px; color: #555; margin-top: 8px; }
  .date { font-size: 12px; color: #333; margin-bottom: 16px; }
  .recipient { font-size: 12px; color: #333; margin-bottom: 16px; line-height: 1.5; }
  .salutation { font-size: 12px; color: #1a1a1a; margin-bottom: 14px; font-weight: 600; }
  .signoff { font-size: 12px; margin-top: 20px; }
  .signoff-name { font-size: 13px; font-weight: bold; color: #2563EB; margin-top: 32px; }
</style>
<div class="page">
  <div class="header">
    <div class="name">${htmlEscape(personalDetails.name)}</div>
    ${personalDetails.title ? `<div class="title">${htmlEscape(personalDetails.title)}</div>` : ''}
    <div class="contact">${contact}</div>
  </div>
  <div class="date">${htmlEscape(data.date)}</div>
  <div class="recipient">${recipientLine(data)}</div>
  <div class="salutation">${salutationOrDefault(data)}</div>
  ${paragraphsHtml(data.openingParagraph)}
  ${(data.bodyParagraphs || []).map((p) => paragraphsHtml(p)).join('')}
  ${paragraphsHtml(data.closingParagraph)}
  <div class="signoff">${htmlEscape(data.signOff) || 'Sincerely,'}</div>
  <div class="signoff-name">${htmlEscape(personalDetails.name)}</div>
</div>
${PAGE_SHELL_CLOSE}`;
}

function renderMinimalSerif(data: CoverLetterData): string {
  const { personalDetails } = data;
  const contact = [personalDetails.email, personalDetails.phone, personalDetails.location]
    .filter(Boolean).map(htmlEscape).join('   ·   ');

  return `${PAGE_SHELL_OPEN}
<style>
  body { font-family: Georgia, 'Times New Roman', serif; }
  .name { font-size: 24px; color: #1a1a1a; margin-bottom: 3px; }
  .contact { font-size: 11px; color: #777; margin-bottom: 30px; letter-spacing: 0.3px; }
  .date { font-size: 12px; color: #333; margin-bottom: 18px; }
  .recipient { font-size: 12px; color: #333; margin-bottom: 18px; line-height: 1.6; }
  .salutation { font-size: 12px; color: #1a1a1a; margin-bottom: 16px; font-style: italic; }
  .body-para { font-family: Georgia, serif; }
  .signoff { font-size: 12px; margin-top: 22px; font-style: italic; }
  .signoff-name { font-size: 13px; margin-top: 34px; }
</style>
<div class="page">
  <div class="name">${htmlEscape(personalDetails.name)}</div>
  <div class="contact">${contact}</div>
  <div class="date">${htmlEscape(data.date)}</div>
  <div class="recipient">${recipientLine(data)}</div>
  <div class="salutation">${salutationOrDefault(data)}</div>
  ${paragraphsHtml(data.openingParagraph)}
  ${(data.bodyParagraphs || []).map((p) => paragraphsHtml(p)).join('')}
  ${paragraphsHtml(data.closingParagraph)}
  <div class="signoff">${htmlEscape(data.signOff) || 'Sincerely,'}</div>
  <div class="signoff-name">${htmlEscape(personalDetails.name)}</div>
</div>
${PAGE_SHELL_CLOSE}`;
}

function renderSidebarContact(data: CoverLetterData): string {
  const { personalDetails } = data;

  return `${PAGE_SHELL_OPEN}
<style>
  .page { padding: 0; display: flex; }
  .sidebar { width: 55mm; background: #1e3a8a; color: #fff; padding: 18mm 8mm; flex-shrink: 0; }
  .sidebar .name { font-size: 18px; font-weight: bold; margin-bottom: 4px; line-height: 1.3; }
  .sidebar .title { font-size: 11px; opacity: 0.85; margin-bottom: 20px; }
  .sidebar .contact-item { font-size: 10px; opacity: 0.9; margin-bottom: 8px; word-break: break-word; }
  .main { padding: 18mm 15mm; flex: 1; min-width: 0; }
  .date { font-size: 12px; color: #333; margin-bottom: 16px; }
  .recipient { font-size: 12px; color: #333; margin-bottom: 16px; line-height: 1.5; }
  .salutation { font-size: 12px; color: #1a1a1a; margin-bottom: 14px; }
  .signoff { font-size: 12px; margin-top: 20px; }
  .signoff-name { font-size: 13px; font-weight: bold; color: #1e3a8a; margin-top: 32px; }
</style>
<div class="page">
  <div class="sidebar">
    <div class="name">${htmlEscape(personalDetails.name)}</div>
    ${personalDetails.title ? `<div class="title">${htmlEscape(personalDetails.title)}</div>` : ''}
    ${personalDetails.email ? `<div class="contact-item">${htmlEscape(personalDetails.email)}</div>` : ''}
    ${personalDetails.phone ? `<div class="contact-item">${htmlEscape(personalDetails.phone)}</div>` : ''}
    ${personalDetails.location ? `<div class="contact-item">${htmlEscape(personalDetails.location)}</div>` : ''}
    ${personalDetails.linkedin ? `<div class="contact-item">${htmlEscape(personalDetails.linkedin)}</div>` : ''}
  </div>
  <div class="main">
    <div class="date">${htmlEscape(data.date)}</div>
    <div class="recipient">${recipientLine(data)}</div>
    <div class="salutation">${salutationOrDefault(data)}</div>
    ${paragraphsHtml(data.openingParagraph)}
    ${(data.bodyParagraphs || []).map((p) => paragraphsHtml(p)).join('')}
    ${paragraphsHtml(data.closingParagraph)}
    <div class="signoff">${htmlEscape(data.signOff) || 'Sincerely,'}</div>
    <div class="signoff-name">${htmlEscape(personalDetails.name)}</div>
  </div>
</div>
${PAGE_SHELL_CLOSE}`;
}

function renderExecutive(data: CoverLetterData): string {
  const { personalDetails } = data;
  const contact = [personalDetails.email, personalDetails.phone, personalDetails.location]
    .filter(Boolean).map(htmlEscape).join('   |   ');

  return `${PAGE_SHELL_OPEN}
<style>
  .header { text-align: center; padding-bottom: 16px; margin-bottom: 26px; border-bottom: 1px solid #ccc; }
  .name { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase; }
  .title { font-size: 12px; color: #666; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }
  .contact { font-size: 10.5px; color: #777; margin-top: 8px; }
  .date { font-size: 12px; color: #333; margin-bottom: 16px; }
  .recipient { font-size: 12px; color: #333; margin-bottom: 16px; line-height: 1.5; }
  .salutation { font-size: 12px; color: #1a1a1a; margin-bottom: 14px; }
  .signoff { font-size: 12px; margin-top: 22px; }
  .signoff-name { font-size: 13px; font-weight: bold; margin-top: 34px; text-align: left; }
</style>
<div class="page">
  <div class="header">
    <div class="name">${htmlEscape(personalDetails.name)}</div>
    ${personalDetails.title ? `<div class="title">${htmlEscape(personalDetails.title)}</div>` : ''}
    <div class="contact">${contact}</div>
  </div>
  <div class="date">${htmlEscape(data.date)}</div>
  <div class="recipient">${recipientLine(data)}</div>
  <div class="salutation">${salutationOrDefault(data)}</div>
  ${paragraphsHtml(data.openingParagraph)}
  ${(data.bodyParagraphs || []).map((p) => paragraphsHtml(p)).join('')}
  ${paragraphsHtml(data.closingParagraph)}
  <div class="signoff">${htmlEscape(data.signOff) || 'Sincerely,'}</div>
  <div class="signoff-name">${htmlEscape(personalDetails.name)}</div>
</div>
${PAGE_SHELL_CLOSE}`;
}

export function renderCoverLetterTemplate(designId: string, data: CoverLetterData): string {
  switch (designId) {
    case 'cl-template-1': return renderClassicBlock(data);
    case 'cl-template-2': return renderModernHeader(data);
    case 'cl-template-3': return renderMinimalSerif(data);
    case 'cl-template-4': return renderSidebarContact(data);
    case 'cl-template-5': return renderExecutive(data);
    default: return renderClassicBlock(data);
  }
}

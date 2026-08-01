// lib/document-tokenizer.ts
//
// Feature A: when the AI Writer is used with placeholders for a
// Template-tier document type, its output already looks like a template —
// it just uses bracketed prose like [SELLER'S FULL NAME] instead of real
// {{tokens}}. This converts that output into the same shape as a hand-built
// Template row (tokenized body text + a matching `fields` schema), so it
// can seed a draft for you to review and publish — no re-writing needed.

import { DocumentTemplateField } from './document-templates-data';

interface TokenizableDoc {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export interface TokenizedResult {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  fields: DocumentTemplateField[];
}

function toFieldId(label: string): string {
  const words = label
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const id = words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('');
  return id || 'field';
}

function toNiceLabel(rawLabel: string): string {
  return rawLabel
    .trim()
    .split(/\s+/)
    .map(w => (w.length <= 3 ? w : w[0] + w.slice(1).toLowerCase()))
    .join(' ');
}

function guessFieldType(label: string): DocumentTemplateField['type'] {
  const l = label.toLowerCase();
  if (l.includes('date')) return 'date';
  if (l.includes('address') || l.includes('description') || l.includes('terms') || l.includes('notes')) return 'textarea';
  return 'text';
}

export function tokenizeGeneratedDocument(doc: TokenizableDoc): TokenizedResult {
  const labelToId = new Map<string, string>();
  const fields: DocumentTemplateField[] = [];

  const replace = (text: string): string => {
    if (!text) return text;
    return text.replace(/\[([A-Z0-9 '&\-/.]{2,60})\]/g, (_match, rawLabel: string) => {
      const key = rawLabel.trim().toUpperCase();
      let id = labelToId.get(key);
      if (!id) {
        id = toFieldId(rawLabel);
        let uniqueId = id;
        let n = 2;
        while (fields.some(f => f.id === uniqueId)) uniqueId = `${id}${n++}`;
        id = uniqueId;
        labelToId.set(key, id);
        fields.push({
          id,
          label: toNiceLabel(rawLabel),
          type: guessFieldType(rawLabel),
          placeholder: '',
          required: true,
        });
      }
      return `{{${id}}}`;
    });
  };

  return {
    title: replace(doc.title),
    intro: replace(doc.intro),
    sections: doc.sections.map(s => ({ heading: replace(s.heading), body: replace(s.body) })),
    fields,
  };
}

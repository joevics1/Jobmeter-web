'use client';

// app/cover-letter-templates/_components/cover-letter-inline-editor.tsx
// Click-to-edit rendering of CoverLetterData — same contentEditable +
// onBlur pattern as components/documents/DocumentEditor.tsx (native
// contentEditable, plain textContent extraction, no rich-text library).
// This is an ADDITION alongside the structured form editor
// (cover-letter-fields-editor.tsx), not a replacement — the result
// screen offers both: click text here to tweak it in place, or use
// "Edit" to go back to the structured form.

import type { CoverLetterData } from '@/lib/cover-letter-template-pages/cover-letter-data-types';

const editableClass = 'outline-none focus:ring-1 focus:ring-blue-400 rounded px-1';

interface Props {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
}

export default function CoverLetterInlineEditor({ data, onChange }: Props) {
  const updatePersonal = (key: keyof CoverLetterData['personalDetails'], value: string) =>
    onChange({ ...data, personalDetails: { ...data.personalDetails, [key]: value } });
  const updateRecipient = (key: keyof CoverLetterData['recipient'], value: string) =>
    onChange({ ...data, recipient: { ...data.recipient, [key]: value } });
  const updateBodyParagraph = (i: number, value: string) => {
    const bodyParagraphs = [...(data.bodyParagraphs || [])];
    bodyParagraphs[i] = value;
    onChange({ ...data, bodyParagraphs });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground no-print">
        Click any text in the letter below to edit it directly.
      </p>

      <div
        id="cl-print-area"
        className="bg-white text-black mx-auto max-w-[210mm] shadow-lg rounded-sm p-[15mm] sm:p-[20mm]"
      >
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePersonal('name', e.currentTarget.textContent || '')}
          className={`text-xl sm:text-2xl font-bold mb-1 ${editableClass}`}
        >
          {data.personalDetails.name}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePersonal('title', e.currentTarget.textContent || '')}
          className={`text-sm text-gray-600 mb-3 ${editableClass}`}
        >
          {data.personalDetails.title}
        </p>

        <div className="flex flex-wrap gap-x-1 text-xs text-gray-500 mb-6">
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonal('email', e.currentTarget.textContent || '')} className={editableClass}>
            {data.personalDetails.email}
          </span>
          <span>·</span>
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonal('phone', e.currentTarget.textContent || '')} className={editableClass}>
            {data.personalDetails.phone}
          </span>
          <span>·</span>
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonal('location', e.currentTarget.textContent || '')} className={editableClass}>
            {data.personalDetails.location}
          </span>
        </div>

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...data, date: e.currentTarget.textContent || '' })}
          className={`text-sm mb-4 ${editableClass}`}
        >
          {data.date}
        </p>

        <div className="text-sm mb-4 leading-relaxed">
          {data.recipient.hiringManagerName !== undefined && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateRecipient('hiringManagerName', e.currentTarget.textContent || '')}
              className={editableClass}
            >
              {data.recipient.hiringManagerName}
            </div>
          )}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateRecipient('companyName', e.currentTarget.textContent || '')}
            className={editableClass}
          >
            {data.recipient.companyName}
          </div>
          {data.recipient.companyAddress !== undefined && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateRecipient('companyAddress', e.currentTarget.textContent || '')}
              className={editableClass}
            >
              {data.recipient.companyAddress}
            </div>
          )}
        </div>

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...data, salutation: e.currentTarget.textContent || '' })}
          className={`text-sm mb-4 ${editableClass}`}
        >
          {data.salutation}
        </p>

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...data, openingParagraph: e.currentTarget.innerText || '' })}
          className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap ${editableClass}`}
        >
          {data.openingParagraph}
        </p>

        {(data.bodyParagraphs || []).map((p, i) => (
          <p
            key={i}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateBodyParagraph(i, e.currentTarget.innerText || '')}
            className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap ${editableClass}`}
          >
            {p}
          </p>
        ))}

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...data, closingParagraph: e.currentTarget.innerText || '' })}
          className={`text-sm leading-relaxed mb-6 whitespace-pre-wrap ${editableClass}`}
        >
          {data.closingParagraph}
        </p>

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...data, signOff: e.currentTarget.textContent || '' })}
          className={`text-sm mb-8 ${editableClass}`}
        >
          {data.signOff}
        </p>
        <p className="text-sm font-semibold">{data.personalDetails.name}</p>
      </div>
    </div>
  );
}

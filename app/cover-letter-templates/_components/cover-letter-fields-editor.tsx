'use client';

// app/cover-letter-templates/_components/cover-letter-fields-editor.tsx
// Editor for CoverLetterData. Deliberately NOT the accordion-of-repeatable-
// sections pattern cv-fields-editor.tsx uses — a cover letter is a handful
// of prose fields, not a list of jobs/awards/certifications, so this is
// just one flat form.

import type { CoverLetterData } from '@/lib/cover-letter-template-pages/cover-letter-data-types';

const inputClass = 'border border-border rounded px-3 py-2 text-sm w-full bg-card';
const labelClass = 'block text-xs font-medium text-muted-foreground mb-1';

export default function CoverLetterFieldsEditor({
  data,
  setData,
}: {
  data: CoverLetterData;
  setData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
}) {
  function updatePersonal<K extends keyof CoverLetterData['personalDetails']>(key: K, value: string) {
    setData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, [key]: value } }));
  }
  function updateRecipient<K extends keyof CoverLetterData['recipient']>(key: K, value: string) {
    setData((prev) => ({ ...prev, recipient: { ...prev.recipient, [key]: value } }));
  }
  function updateBodyParagraph(index: number, value: string) {
    setData((prev) => {
      const bodyParagraphs = [...(prev.bodyParagraphs || [])];
      bodyParagraphs[index] = value;
      return { ...prev, bodyParagraphs };
    });
  }
  function addBodyParagraph() {
    setData((prev) => ({ ...prev, bodyParagraphs: [...(prev.bodyParagraphs || []), ''] }));
  }
  function removeBodyParagraph(index: number) {
    setData((prev) => ({ ...prev, bodyParagraphs: (prev.bodyParagraphs || []).filter((_, i) => i !== index) }));
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold mb-2">Your Details</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={data.personalDetails.name} onChange={(e) => updatePersonal('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Professional Title</label>
            <input className={inputClass} value={data.personalDetails.title} onChange={(e) => updatePersonal('title', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={data.personalDetails.email} onChange={(e) => updatePersonal('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={data.personalDetails.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={data.personalDetails.location} onChange={(e) => updatePersonal('location', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn (optional)</label>
            <input className={inputClass} value={data.personalDetails.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Recipient</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className={labelClass}>Company Name</label>
            <input className={inputClass} value={data.recipient.companyName} onChange={(e) => updateRecipient('companyName', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Hiring Manager (optional)</label>
            <input className={inputClass} value={data.recipient.hiringManagerName || ''} onChange={(e) => updateRecipient('hiringManagerName', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Company Address (optional)</label>
            <input className={inputClass} value={data.recipient.companyAddress || ''} onChange={(e) => updateRecipient('companyAddress', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input className={inputClass} value={data.date} onChange={(e) => setData((p) => ({ ...p, date: e.target.value }))} />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Salutation</label>
        <input className={inputClass} placeholder="Dear Hiring Manager," value={data.salutation} onChange={(e) => setData((p) => ({ ...p, salutation: e.target.value }))} />
      </div>

      <div>
        <label className={labelClass}>Opening Paragraph</label>
        <textarea className={inputClass} rows={3} placeholder="Hook the reader and state the role you're applying for"
          value={data.openingParagraph} onChange={(e) => setData((p) => ({ ...p, openingParagraph: e.target.value }))} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass + ' mb-0'}>Body Paragraphs</label>
          <button onClick={addBodyParagraph} type="button" className="text-sm text-blue-600 font-medium">+ Add paragraph</button>
        </div>
        <div className="space-y-2">
          {(data.bodyParagraphs || []).map((p, i) => (
            <div key={i} className="relative">
              <textarea className={inputClass} rows={3} placeholder="Connect your experience to what this role needs"
                value={p} onChange={(e) => updateBodyParagraph(i, e.target.value)} />
              <button onClick={() => removeBodyParagraph(i)} type="button" className="text-xs text-red-600 mt-1">Remove</button>
            </div>
          ))}
          {(data.bodyParagraphs || []).length === 0 && (
            <p className="text-xs text-muted-foreground">No body paragraphs yet — add one above.</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Closing Paragraph</label>
        <textarea className={inputClass} rows={2} placeholder="Call to action, availability, thanks"
          value={data.closingParagraph} onChange={(e) => setData((p) => ({ ...p, closingParagraph: e.target.value }))} />
      </div>

      <div>
        <label className={labelClass}>Sign-off</label>
        <input className={inputClass} placeholder="Sincerely," value={data.signOff} onChange={(e) => setData((p) => ({ ...p, signOff: e.target.value }))} />
      </div>
    </div>
  );
}

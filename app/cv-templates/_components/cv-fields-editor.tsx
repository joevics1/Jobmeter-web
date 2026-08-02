'use client';

// app/cv-templates/_components/cv-fields-editor.tsx
// Shared, reusable accordion-style CVData editor — used by both the
// CV builder (app/cv-templates/build) and the Settings "Edit Profile"
// page, since both need the exact same set of fields. Isolated: only
// depends on lib/cv-template-pages/cv-data-types.

import { useState } from 'react';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';

function csv(value?: string[]): string {
  return (value || []).join(', ');
}
function fromCsv(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function CVFieldsEditor({
  cvData,
  setCvData,
  defaultOpenSections = ['personal', 'summary'],
}: {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  defaultOpenSections?: string[];
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(defaultOpenSections));

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function updatePersonal<K extends keyof CVData['personalDetails']>(key: K, value: string) {
    setCvData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, [key]: value } }));
  }
  function updateExperience(index: number, field: 'role' | 'company' | 'years', value: string) {
    setCvData((prev) => {
      const experience = [...(prev.experience || [])];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  }
  function updateExperienceBullets(index: number, value: string) {
    setCvData((prev) => {
      const experience = [...(prev.experience || [])];
      experience[index] = { ...experience[index], bullets: value.split('\n').map((b) => b.trim()).filter(Boolean) };
      return { ...prev, experience };
    });
  }
  function addExperience() {
    setCvData((prev) => ({ ...prev, experience: [...(prev.experience || []), { role: '', company: '', years: '', bullets: [] }] }));
  }
  function removeExperience(index: number) {
    setCvData((prev) => ({ ...prev, experience: (prev.experience || []).filter((_, i) => i !== index) }));
  }

  function updateEducation(index: number, field: 'degree' | 'institution' | 'years', value: string) {
    setCvData((prev) => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  }
  function addEducation() {
    setCvData((prev) => ({ ...prev, education: [...(prev.education || []), { degree: '', institution: '', years: '' }] }));
  }
  function removeEducation(index: number) {
    setCvData((prev) => ({ ...prev, education: (prev.education || []).filter((_, i) => i !== index) }));
  }

  function updateAward(index: number, field: 'title' | 'issuer' | 'year', value: string) {
    setCvData((prev) => {
      const awards = [...(prev.awards || [])];
      awards[index] = { ...awards[index], [field]: value };
      return { ...prev, awards };
    });
  }
  function addAward() {
    setCvData((prev) => ({ ...prev, awards: [...(prev.awards || []), { title: '' }] }));
  }
  function removeAward(index: number) {
    setCvData((prev) => ({ ...prev, awards: (prev.awards || []).filter((_, i) => i !== index) }));
  }

  function updateCertification(index: number, field: 'name' | 'issuer' | 'year', value: string) {
    setCvData((prev) => {
      const certifications = [...(prev.certifications || [])];
      certifications[index] = { ...certifications[index], [field]: value };
      return { ...prev, certifications };
    });
  }
  function addCertification() {
    setCvData((prev) => ({ ...prev, certifications: [...(prev.certifications || []), { name: '' }] }));
  }
  function removeCertification(index: number) {
    setCvData((prev) => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== index) }));
  }

  function updatePublication(index: number, field: 'title' | 'journal' | 'year', value: string) {
    setCvData((prev) => {
      const publications = [...(prev.publications || [])];
      publications[index] = { ...publications[index], [field]: value };
      return { ...prev, publications };
    });
  }
  function addPublication() {
    setCvData((prev) => ({ ...prev, publications: [...(prev.publications || []), { title: '' }] }));
  }
  function removePublication(index: number) {
    setCvData((prev) => ({ ...prev, publications: (prev.publications || []).filter((_, i) => i !== index) }));
  }

  function updateProject(index: number, field: 'title' | 'description', value: string) {
    setCvData((prev) => {
      const projects = [...(prev.projects || [])];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  }
  function addProject() {
    setCvData((prev) => ({ ...prev, projects: [...(prev.projects || []), { title: '', description: '' }] }));
  }
  function removeProject(index: number) {
    setCvData((prev) => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
  }

  function updateVolunteer(index: number, field: 'organization' | 'role' | 'duration' | 'description', value: string) {
    setCvData((prev) => {
      const volunteerWork = [...(prev.volunteerWork || [])];
      volunteerWork[index] = { ...volunteerWork[index], [field]: value };
      return { ...prev, volunteerWork };
    });
  }
  function addVolunteer() {
    setCvData((prev) => ({ ...prev, volunteerWork: [...(prev.volunteerWork || []), { organization: '' }] }));
  }
  function removeVolunteer(index: number) {
    setCvData((prev) => ({ ...prev, volunteerWork: (prev.volunteerWork || []).filter((_, i) => i !== index) }));
  }

  function updateAdditionalSection(index: number, field: 'sectionName' | 'content', value: string) {
    setCvData((prev) => {
      const additionalSections = [...(prev.additionalSections || [])];
      additionalSections[index] = { ...additionalSections[index], [field]: value };
      return { ...prev, additionalSections };
    });
  }
  function addAdditionalSection() {
    setCvData((prev) => ({ ...prev, additionalSections: [...(prev.additionalSections || []), { sectionName: '', content: '' }] }));
  }
  function removeAdditionalSection(index: number) {
    setCvData((prev) => ({ ...prev, additionalSections: (prev.additionalSections || []).filter((_, i) => i !== index) }));
  }

  function SectionShell({ sectionKey, label, children }: { sectionKey: string; label: string; children: React.ReactNode }) {
    const isOpen = openSections.has(sectionKey);
    return (
      <div className="border rounded-lg mb-3 overflow-hidden">
        <button type="button" onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left font-semibold">
          {label}
          <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && <div className="p-4 space-y-3">{children}</div>}
      </div>
    );
  }

  return (
    <div>
      <SectionShell sectionKey="personal" label="Personal Details">
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Full name" value={cvData.personalDetails.name} onChange={(e) => updatePersonal('name', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Title" value={cvData.personalDetails.title} onChange={(e) => updatePersonal('title', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Email" value={cvData.personalDetails.email} onChange={(e) => updatePersonal('email', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={cvData.personalDetails.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
        </div>
        <input className="border rounded px-3 py-2 w-full" placeholder="Location" value={cvData.personalDetails.location} onChange={(e) => updatePersonal('location', e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="LinkedIn (optional)" value={cvData.personalDetails.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="GitHub (optional)" value={cvData.personalDetails.github || ''} onChange={(e) => updatePersonal('github', e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Portfolio (optional)" value={cvData.personalDetails.portfolio || ''} onChange={(e) => updatePersonal('portfolio', e.target.value)} />
      </SectionShell>

      <SectionShell sectionKey="summary" label="Summary">
        <textarea className="border rounded px-3 py-2 w-full" rows={5} placeholder="Professional summary"
          value={cvData.summary} onChange={(e) => setCvData((p) => ({ ...p, summary: e.target.value }))} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Professional roles (comma separated, optional)"
          value={csv(cvData.roles)} onChange={(e) => setCvData((p) => ({ ...p, roles: fromCsv(e.target.value) }))} />
      </SectionShell>

      <SectionShell sectionKey="skills" label="Skills & Languages">
        <input className="border rounded px-3 py-2 w-full" placeholder="Skills (comma separated)"
          value={csv(cvData.skills)} onChange={(e) => setCvData((p) => ({ ...p, skills: fromCsv(e.target.value) }))} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Languages (comma separated, optional)"
          value={csv(cvData.languages)} onChange={(e) => setCvData((p) => ({ ...p, languages: fromCsv(e.target.value) }))} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Interests (comma separated, optional)"
          value={csv(cvData.interests)} onChange={(e) => setCvData((p) => ({ ...p, interests: fromCsv(e.target.value) }))} />
      </SectionShell>

      <SectionShell sectionKey="experience" label={`Experience${(cvData.experience || []).length ? ` (${cvData.experience!.length})` : ''}`}>
        <button onClick={addExperience} type="button" className="text-sm text-blue-700 font-medium">+ Add role</button>
        {(cvData.experience || []).map((exp, i) => (
          <div key={i} className="border rounded p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1.5 text-sm" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} />
              <input className="border rounded px-2 py-1.5 text-sm" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
            </div>
            <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Years (e.g. 2022 - Present)" value={exp.years} onChange={(e) => updateExperience(i, 'years', e.target.value)} />
            <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={3} placeholder="One bullet per line" value={(exp.bullets || []).join('\n')} onChange={(e) => updateExperienceBullets(i, e.target.value)} />
            <button onClick={() => removeExperience(i)} type="button" className="text-xs text-red-600">Remove</button>
          </div>
        ))}
      </SectionShell>

      <SectionShell sectionKey="education" label={`Education${(cvData.education || []).length ? ` (${cvData.education!.length})` : ''}`}>
        <button onClick={addEducation} type="button" className="text-sm text-blue-700 font-medium">+ Add education</button>
        {(cvData.education || []).map((edu, i) => (
          <div key={i} className="border rounded p-3 space-y-2">
            <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1.5 text-sm" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
              <input className="border rounded px-2 py-1.5 text-sm" placeholder="Years" value={edu.years} onChange={(e) => updateEducation(i, 'years', e.target.value)} />
            </div>
            <button onClick={() => removeEducation(i)} type="button" className="text-xs text-red-600">Remove</button>
          </div>
        ))}
      </SectionShell>

      <SectionShell sectionKey="achievements" label="Achievements">
        <div>
          <h4 className="text-sm font-semibold mb-1">Accomplishments</h4>
          <textarea className="border rounded px-3 py-2 w-full text-sm" rows={2} placeholder="One per line"
            value={(cvData.accomplishments || []).join('\n')}
            onChange={(e) => setCvData((p) => ({ ...p, accomplishments: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Awards</h4><button onClick={addAward} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.awards || []).map((a, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Award title" value={a.title} onChange={(e) => updateAward(i, 'title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Issuer (optional)" value={a.issuer || ''} onChange={(e) => updateAward(i, 'issuer', e.target.value)} />
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Year (optional)" value={a.year || ''} onChange={(e) => updateAward(i, 'year', e.target.value)} />
              </div>
              <button onClick={() => removeAward(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Certifications</h4><button onClick={addCertification} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.certifications || []).map((c, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Certification name" value={c.name} onChange={(e) => updateCertification(i, 'name', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Issuer (optional)" value={c.issuer || ''} onChange={(e) => updateCertification(i, 'issuer', e.target.value)} />
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Year (optional)" value={c.year || ''} onChange={(e) => updateCertification(i, 'year', e.target.value)} />
              </div>
              <button onClick={() => removeCertification(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Publications</h4><button onClick={addPublication} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.publications || []).map((p, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Title" value={p.title} onChange={(e) => updatePublication(i, 'title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Journal/venue (optional)" value={p.journal || ''} onChange={(e) => updatePublication(i, 'journal', e.target.value)} />
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Year (optional)" value={p.year || ''} onChange={(e) => updatePublication(i, 'year', e.target.value)} />
              </div>
              <button onClick={() => removePublication(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell sectionKey="more" label="Projects & More">
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Projects</h4><button onClick={addProject} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.projects || []).map((p, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Project title" value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
              <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={2} placeholder="Description" value={p.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
              <button onClick={() => removeProject(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Volunteer Work</h4><button onClick={addVolunteer} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.volunteerWork || []).map((v, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Organization" value={v.organization} onChange={(e) => updateVolunteer(i, 'organization', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Role (optional)" value={v.role || ''} onChange={(e) => updateVolunteer(i, 'role', e.target.value)} />
                <input className="border rounded px-2 py-1.5 text-sm" placeholder="Duration (optional)" value={v.duration || ''} onChange={(e) => updateVolunteer(i, 'duration', e.target.value)} />
              </div>
              <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={2} placeholder="Description (optional)" value={v.description || ''} onChange={(e) => updateVolunteer(i, 'description', e.target.value)} />
              <button onClick={() => removeVolunteer(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><h4 className="text-sm font-semibold">Additional Sections</h4><button onClick={addAdditionalSection} type="button" className="text-sm text-blue-700 font-medium">+ Add</button></div>
          {(cvData.additionalSections || []).map((s, i) => (
            <div key={i} className="border rounded p-3 mb-2 space-y-2">
              <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Section name" value={s.sectionName} onChange={(e) => updateAdditionalSection(i, 'sectionName', e.target.value)} />
              <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={2} placeholder="Content" value={s.content} onChange={(e) => updateAdditionalSection(i, 'content', e.target.value)} />
              <button onClick={() => removeAdditionalSection(i)} type="button" className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

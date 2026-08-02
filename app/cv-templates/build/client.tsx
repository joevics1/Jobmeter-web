'use client';

// app/cv-templates/build/client.tsx
// Entry point is decided on the role/country page now (the static action
// bar) via ?start=quick|fetch|blank|sample — this page no longer shows a
// chooser. It resolves the initial CVData immediately, then shows ONE
// screen with expandable/collapsible sections (not a paginated wizard),
// then the render/download step.

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { downloadCVAsDocx } from '@/lib/cv-template-pages/cv-docx-export';
import { fetchOnboardingData, mapOnboardingToCVData } from '@/lib/cv-template-pages/onboarding-fetch';
import { getHistoryEntry, saveToHistory } from '@/lib/cv-template-pages/cv-history';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';
import BackButton from '../_components/back-button';

type Stage = 'loading' | 'form' | 'result';
type StartMode = 'quick' | 'fetch' | 'blank' | 'sample' | 'history';

const SECTIONS = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'summary', label: 'Summary' },
  { key: 'skills', label: 'Skills & Languages' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'more', label: 'Projects & More' },
] as const;

function emptyCV(roleLabel: string): CVData {
  return {
    personalDetails: { name: '', title: roleLabel || '', email: '', phone: '', location: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
  };
}
function csv(value?: string[]): string {
  return (value || []).join(', ');
}
function fromCsv(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function BuildClient({
  roleSlug,
  countryCode,
  roleLabel,
  countryLabel,
  sampleCvData,
  start,
  historyId,
}: {
  roleSlug: string;
  countryCode: string;
  roleLabel: string;
  countryLabel: string;
  sampleCvData: CVData | null;
  start: StartMode;
  historyId?: string;
}) {
  const [stage, setStage] = useState<Stage>('loading');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData>(emptyCV(roleLabel));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['personal', 'summary']));

  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // Resolve the initial CVData based on ?start= as soon as we land.
  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      if (cancelled) return;
      setUserId(uid);

      if (start === 'history') {
        const entry = historyId ? getHistoryEntry(historyId) : null;
        if (!entry) {
          setError('That saved CV could not be found on this device.');
          setCvData(emptyCV(roleLabel));
          setStage('form');
          return;
        }
        setCvData(entry.cvData);
        setSelectedDesign(entry.designId);
        setStage('result');
        return;
      }

      if (start === 'sample') {
        setCvData(sampleCvData || emptyCV(roleLabel));
        setStage('form');
        return;
      }

      if (start === 'fetch') {
        if (!uid) {
          setError('Please log in to fetch your details.');
          setCvData(emptyCV(roleLabel));
          setStage('form');
          return;
        }
        const row = await fetchOnboardingData(uid);
        if (cancelled) return;
        if (!row) {
          setError('No saved profile found. Try Quick Create later, or fill the form manually.');
          setCvData(emptyCV(roleLabel));
        } else {
          setCvData(mapOnboardingToCVData(row));
          // With real data pulled in, keep the form collapsed by default — this is
          // the "expandable sections" review case, not a blank-form fill.
          setOpenSections(new Set(['personal']));
        }
        setStage('form');
        return;
      }

      if (start === 'quick') {
        if (!uid) {
          setError('Please log in to use Quick Create.');
          setCvData(emptyCV(roleLabel));
          setStage('form');
          return;
        }
        try {
          const { data: fnData, error: fnError } = await supabase.functions.invoke('tailor-cv-template-page', {
            body: { userId: uid, roleLabel, countryLabel },
          });
          if (cancelled) return;
          if (fnError) throw new Error(fnError.message);
          if (!fnData?.success || !fnData?.data) throw new Error(fnData?.error || 'Quick Create failed.');
          setCvData(fnData.data as CVData);
          setOpenSections(new Set(['personal']));
        } catch (err: any) {
          if (!cancelled) {
            setError(err.message || 'Quick Create failed. You can fill the form manually instead.');
            setCvData(emptyCV(roleLabel));
          }
        }
        setStage('form');
        return;
      }

      // start === 'blank'
      setCvData(emptyCV(roleLabel));
      setStage('form');
    }

    resolve();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // ── Field helpers (same as before) ──────────────────────────────

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

  // ── Result step ──────────────────────────────────────────────────

  const previewHtml = useMemo(() => renderCVTemplate(selectedDesign, cvData, 'view'), [cvData, selectedDesign]);

  function handlePrint() {
    const iframe = document.getElementById('cv-preview-frame') as HTMLIFrameElement | null;
    iframe?.contentWindow?.print();
  }
  async function handleDownloadDocx() {
    setDownloadingDocx(true);
    try {
      await downloadCVAsDocx(cvData, `${cvData.personalDetails.name || 'my'}-CV`);
    } catch (err: any) {
      setError(err.message || 'Could not build the Word file.');
    } finally {
      setDownloadingDocx(false);
    }
  }
  async function handleSave() {
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('cv_template_generations').insert({
        user_id: userId,
        role_slug: roleSlug || roleLabel.toLowerCase().replace(/\s+/g, '-'),
        country_code: countryCode || countryLabel.toLowerCase(),
        design_id: selectedDesign,
        cv_data: cvData,
      });
      if (insertError) throw insertError;
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Could not save your CV.');
    } finally {
      setSaving(false);
    }
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
    <>
      <BackButton title={`Build Your ${roleLabel} CV`} href={roleSlug && countryCode ? `/cv-templates/${roleSlug}/${countryCode}` : '/cv-templates'} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">{countryLabel}</p>
          <Link href="/cv-templates/history" className="text-sm text-blue-700 font-medium">CV History</Link>
        </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {stage === 'loading' && <p className="text-gray-400">Preparing your form…</p>}

      {stage === 'form' && (
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

          <button onClick={() => {
            saveToHistory({
              roleSlug: roleSlug || roleLabel.toLowerCase().replace(/\s+/g, '-'),
              roleLabel,
              countryCode: countryCode || countryLabel.toLowerCase(),
              countryLabel,
              designId: selectedDesign,
              cvData,
            });
            setStage('result');
          }} type="button" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full mt-2">
            Generate CV
          </button>
        </div>
      )}

      {stage === 'result' && (
        <div>
          <div className="flex gap-2 mb-3 overflow-x-auto flex-nowrap pb-1">
            {CV_PAGE_DESIGNS.map((d) => (
              <button key={d.id} onClick={() => setSelectedDesign(d.id)}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${selectedDesign === d.id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'}`}>
                {d.name}
              </button>
            ))}
          </div>
          <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 mb-3">
            <iframe id="cv-preview-frame" title="CV preview" srcDoc={previewHtml} className="w-full" style={{ height: '900px', border: 'none' }} />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setStage('form')} className="border px-4 py-2 rounded-lg font-medium">Edit</button>
            <button onClick={handlePrint} className="border px-4 py-2 rounded-lg font-medium">Print / Save as PDF</button>
            <button onClick={handleDownloadDocx} disabled={downloadingDocx} className="border px-4 py-2 rounded-lg font-medium disabled:opacity-50">
              {downloadingDocx ? 'Preparing…' : 'Download as Word'}
            </button>
            <button onClick={handleSave} disabled={saving} className="border px-4 py-2 rounded-lg font-medium disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save this CV'}
            </button>
          </div>
        </div>
      )}
      </main>
    </>
  );
}

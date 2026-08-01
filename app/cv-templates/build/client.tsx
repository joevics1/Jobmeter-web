'use client';

// app/cv-templates/build/client.tsx
// Full CV creation flow, as a multi-screen wizard (one section per screen,
// not one long page). Isolated: only imports from lib/cv-template-pages/*
// and the generic app-wide lib/supabase client.

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { downloadCVAsDocx } from '@/lib/cv-template-pages/cv-docx-export';
import { fetchOnboardingData, mapOnboardingToCVData } from '@/lib/cv-template-pages/onboarding-fetch';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';

type Stage = 'chooser' | 'form' | 'result';

const FORM_SCREENS = [
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
}: {
  roleSlug: string;
  countryCode: string;
  roleLabel: string;
  countryLabel: string;
  sampleCvData: CVData | null;
}) {
  const [stage, setStage] = useState<Stage>('chooser');
  const [screenIndex, setScreenIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingChoice, setLoadingChoice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cvData, setCvData] = useState<CVData>(emptyCV(roleLabel));
  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });
  }, []);

  // ── Chooser actions ──────────────────────────────────────────────

  function startForm() {
    setScreenIndex(0);
    setStage('form');
  }

  function chooseFillBlank() {
    setCvData(emptyCV(roleLabel));
    startForm();
  }

  function chooseEditSample() {
    setCvData(sampleCvData || emptyCV(roleLabel));
    startForm();
  }

  async function chooseFetchDetails() {
    if (!userId) return;
    setLoadingChoice('fetch');
    setError(null);
    try {
      const row = await fetchOnboardingData(userId);
      if (!row) {
        setError('No saved profile found. Try Quick Create later, or fill the form manually.');
        setCvData(emptyCV(roleLabel));
      } else {
        setCvData(mapOnboardingToCVData(row));
      }
      startForm();
    } finally {
      setLoadingChoice(null);
    }
  }

  async function chooseQuickCreate() {
    if (!userId) return;
    setLoadingChoice('quick');
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('tailor-cv-template-page', {
        body: { userId, roleLabel, countryLabel },
      });
      if (fnError) throw new Error(fnError.message);
      if (!data?.success || !data?.data) throw new Error(data?.error || 'Quick Create failed.');
      setCvData(data.data as CVData);
      startForm();
    } catch (err: any) {
      setError(err.message || 'Quick Create failed. You can fill the form manually instead.');
    } finally {
      setLoadingChoice(null);
    }
  }

  // ── Field helpers ────────────────────────────────────────────────

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

  const currentScreen = FORM_SCREENS[screenIndex];
  const isLastScreen = screenIndex === FORM_SCREENS.length - 1;

  function goNext() {
    if (isLastScreen) setStage('result');
    else setScreenIndex((i) => i + 1);
  }
  function goBack() {
    if (screenIndex === 0) setStage('chooser');
    else setScreenIndex((i) => i - 1);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Build Your {roleLabel} CV</h1>
      <p className="text-gray-500 mb-6">{countryLabel}</p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {stage === 'chooser' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {!authChecked ? (
            <p className="text-gray-400">Checking your account…</p>
          ) : userId ? (
            <>
              <button onClick={chooseQuickCreate} disabled={!!loadingChoice} className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">{loadingChoice === 'quick' ? 'Generating…' : 'Quick Create'}</h3>
                <p className="text-sm text-gray-500">Use your saved profile, tailored to this role automatically</p>
              </button>
              <button onClick={chooseFetchDetails} disabled={!!loadingChoice} className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">{loadingChoice === 'fetch' ? 'Fetching…' : 'Fetch My Details'}</h3>
                <p className="text-sm text-gray-500">Pull your saved profile in as-is, then edit it yourself</p>
              </button>
              <button onClick={chooseFillBlank} disabled={!!loadingChoice} className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">Fill Out Form</h3>
                <p className="text-sm text-gray-500">Start from a blank form</p>
              </button>
            </>
          ) : (
            <>
              <button onClick={chooseEditSample} className="border rounded-lg p-5 text-left hover:border-purple-600">
                <h3 className="font-semibold mb-1">Edit Sample Document</h3>
                <p className="text-sm text-gray-500">Start from this page's example CV and edit it</p>
              </button>
              <button onClick={chooseFillBlank} className="border rounded-lg p-5 text-left hover:border-purple-600">
                <h3 className="font-semibold mb-1">Empty Form</h3>
                <p className="text-sm text-gray-500">Start from scratch</p>
              </button>
              <p className="sm:col-span-2 text-sm text-gray-500 mt-1">
                <a href={`/auth/login?redirect=${encodeURIComponent(`/cv-templates/build?role=${roleSlug}&country=${countryCode}`)}`} className="text-purple-700 font-medium">Log in</a> to fetch your saved profile or use Quick Create.
              </p>
            </>
          )}
        </div>
      )}

      {stage === 'form' && (
        <div>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            Step {screenIndex + 1} of {FORM_SCREENS.length} — <span className="font-semibold text-gray-800">{currentScreen.label}</span>
          </div>

          {currentScreen.key === 'personal' && (
            <div className="space-y-3">
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
            </div>
          )}

          {currentScreen.key === 'summary' && (
            <div className="space-y-3">
              <textarea className="border rounded px-3 py-2 w-full" rows={5} placeholder="Professional summary"
                value={cvData.summary} onChange={(e) => setCvData((p) => ({ ...p, summary: e.target.value }))} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Professional roles (comma separated, optional)"
                value={csv(cvData.roles)} onChange={(e) => setCvData((p) => ({ ...p, roles: fromCsv(e.target.value) }))} />
            </div>
          )}

          {currentScreen.key === 'skills' && (
            <div className="space-y-3">
              <input className="border rounded px-3 py-2 w-full" placeholder="Skills (comma separated)"
                value={csv(cvData.skills)} onChange={(e) => setCvData((p) => ({ ...p, skills: fromCsv(e.target.value) }))} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Languages (comma separated, optional)"
                value={csv(cvData.languages)} onChange={(e) => setCvData((p) => ({ ...p, languages: fromCsv(e.target.value) }))} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Interests (comma separated, optional)"
                value={csv(cvData.interests)} onChange={(e) => setCvData((p) => ({ ...p, interests: fromCsv(e.target.value) }))} />
            </div>
          )}

          {currentScreen.key === 'experience' && (
            <div>
              <button onClick={addExperience} type="button" className="text-sm text-purple-700 font-medium mb-3">+ Add role</button>
              {(cvData.experience || []).map((exp, i) => (
                <div key={i} className="border rounded p-3 mb-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="border rounded px-2 py-1.5 text-sm" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} />
                    <input className="border rounded px-2 py-1.5 text-sm" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                  </div>
                  <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Years (e.g. 2022 - Present)" value={exp.years} onChange={(e) => updateExperience(i, 'years', e.target.value)} />
                  <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={3} placeholder="One bullet per line" value={(exp.bullets || []).join('\n')} onChange={(e) => updateExperienceBullets(i, e.target.value)} />
                  <button onClick={() => removeExperience(i)} type="button" className="text-xs text-red-600">Remove</button>
                </div>
              ))}
              {(cvData.experience || []).length === 0 && <p className="text-sm text-gray-400">No experience added yet.</p>}
            </div>
          )}

          {currentScreen.key === 'education' && (
            <div>
              <button onClick={addEducation} type="button" className="text-sm text-purple-700 font-medium mb-3">+ Add education</button>
              {(cvData.education || []).map((edu, i) => (
                <div key={i} className="border rounded p-3 mb-3 space-y-2">
                  <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="border rounded px-2 py-1.5 text-sm" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                    <input className="border rounded px-2 py-1.5 text-sm" placeholder="Years" value={edu.years} onChange={(e) => updateEducation(i, 'years', e.target.value)} />
                  </div>
                  <button onClick={() => removeEducation(i)} type="button" className="text-xs text-red-600">Remove</button>
                </div>
              ))}
              {(cvData.education || []).length === 0 && <p className="text-sm text-gray-400">No education added yet.</p>}
            </div>
          )}

          {currentScreen.key === 'achievements' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Accomplishments</h3>
                <textarea className="border rounded px-3 py-2 w-full text-sm" rows={2} placeholder="One per line"
                  value={(cvData.accomplishments || []).join('\n')}
                  onChange={(e) => setCvData((p) => ({ ...p, accomplishments: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Awards</h3><button onClick={addAward} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
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
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Certifications</h3><button onClick={addCertification} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
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
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Publications</h3><button onClick={addPublication} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
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
            </div>
          )}

          {currentScreen.key === 'more' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Projects</h3><button onClick={addProject} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
                {(cvData.projects || []).map((p, i) => (
                  <div key={i} className="border rounded p-3 mb-2 space-y-2">
                    <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Project title" value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
                    <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={2} placeholder="Description" value={p.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
                    <button onClick={() => removeProject(i)} type="button" className="text-xs text-red-600">Remove</button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Volunteer Work</h3><button onClick={addVolunteer} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
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
                <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Additional Sections</h3><button onClick={addAdditionalSection} type="button" className="text-sm text-purple-700 font-medium">+ Add</button></div>
                {(cvData.additionalSections || []).map((s, i) => (
                  <div key={i} className="border rounded p-3 mb-2 space-y-2">
                    <input className="border rounded px-2 py-1.5 text-sm w-full" placeholder="Section name (e.g. Publications, References)" value={s.sectionName} onChange={(e) => updateAdditionalSection(i, 'sectionName', e.target.value)} />
                    <textarea className="border rounded px-2 py-1.5 text-sm w-full" rows={2} placeholder="Content" value={s.content} onChange={(e) => updateAdditionalSection(i, 'content', e.target.value)} />
                    <button onClick={() => removeAdditionalSection(i)} type="button" className="text-xs text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={goBack} type="button" className="border px-4 py-2 rounded-lg font-medium">Back</button>
            <button onClick={goNext} type="button" className="bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
              {isLastScreen ? 'Generate CV' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {CV_PAGE_DESIGNS.map((d) => (
              <button key={d.id} onClick={() => setSelectedDesign(d.id)}
                className={`px-3 py-1.5 rounded-full text-sm border ${selectedDesign === d.id ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-700 border-gray-300'}`}>
                {d.name}
              </button>
            ))}
          </div>
          <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 mb-3">
            <iframe id="cv-preview-frame" title="CV preview" srcDoc={previewHtml} className="w-full" style={{ height: '900px', border: 'none' }} />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { setScreenIndex(0); setStage('form'); }} className="border px-4 py-2 rounded-lg font-medium">Edit</button>
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
  );
}

'use client';

// app/cv-templates/build/client.tsx
// Full CV creation flow. Isolated: only imports from lib/cv-template-pages/*
// and the generic app-wide lib/supabase client.
//
// Signed-in chooser: Fill Out Form (blank) / Quick Create (AI tailor from
//   onboarding_data) / Fetch My Details (raw onboarding_data, no AI)
// Signed-out chooser: Edit Sample Document (this page's preview CV) / Empty Form
// Both converge on the same structured form, then the same render/download step.

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { downloadCVAsDocx } from '@/lib/cv-template-pages/cv-docx-export';
import { fetchOnboardingData, mapOnboardingToCVData } from '@/lib/cv-template-pages/onboarding-fetch';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';

type Step = 'chooser' | 'form' | 'result';

function emptyCV(roleLabel: string): CVData {
  return {
    personalDetails: { name: '', title: roleLabel || '', email: '', phone: '', location: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
  };
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
  const [step, setStep] = useState<Step>('chooser');
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

  function chooseFillBlank() {
    setCvData(emptyCV(roleLabel));
    setStep('form');
  }

  function chooseEditSample() {
    setCvData(sampleCvData || emptyCV(roleLabel));
    setStep('form');
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
      setStep('form');
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
      setStep('form');
    } catch (err: any) {
      setError(err.message || 'Quick Create failed. You can fill the form manually instead.');
    } finally {
      setLoadingChoice(null);
    }
  }

  // ── Form field helpers ───────────────────────────────────────────

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
    setCvData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { role: '', company: '', years: '', bullets: [] }],
    }));
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

  // ── Result step ──────────────────────────────────────────────────

  const previewHtml = useMemo(() => {
    return renderCVTemplate(selectedDesign, cvData, 'view');
  }, [cvData, selectedDesign]);

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

  // ── Render ───────────────────────────────────────────────────────

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Build Your {roleLabel} CV</h1>
      <p className="text-gray-500 mb-6">{countryLabel}</p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {step === 'chooser' && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {!authChecked ? (
            <p className="text-gray-400">Checking your account…</p>
          ) : userId ? (
            <>
              <button onClick={chooseQuickCreate} disabled={!!loadingChoice}
                className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">{loadingChoice === 'quick' ? 'Generating…' : 'Quick Create'}</h3>
                <p className="text-sm text-gray-500">Use your saved profile, tailored to this role automatically</p>
              </button>
              <button onClick={chooseFetchDetails} disabled={!!loadingChoice}
                className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">{loadingChoice === 'fetch' ? 'Fetching…' : 'Fetch My Details'}</h3>
                <p className="text-sm text-gray-500">Pull your saved profile in as-is, then edit it yourself</p>
              </button>
              <button onClick={chooseFillBlank} disabled={!!loadingChoice}
                className="border rounded-lg p-5 text-left hover:border-purple-600 disabled:opacity-50">
                <h3 className="font-semibold mb-1">Fill Out Form</h3>
                <p className="text-sm text-gray-500">Start from a blank form</p>
              </button>
            </>
          ) : (
            <>
              <button onClick={chooseEditSample}
                className="border rounded-lg p-5 text-left hover:border-purple-600">
                <h3 className="font-semibold mb-1">Edit Sample Document</h3>
                <p className="text-sm text-gray-500">Start from this page's example CV and edit it</p>
              </button>
              <button onClick={chooseFillBlank}
                className="border rounded-lg p-5 text-left hover:border-purple-600">
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

      {step === 'form' && (
        <div className="max-w-2xl space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Full name" value={cvData.personalDetails.name} onChange={(e) => updatePersonal('name', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Title" value={cvData.personalDetails.title} onChange={(e) => updatePersonal('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Email" value={cvData.personalDetails.email} onChange={(e) => updatePersonal('email', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={cvData.personalDetails.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
          </div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Location" value={cvData.personalDetails.location} onChange={(e) => updatePersonal('location', e.target.value)} />

          <textarea className="border rounded px-3 py-2 w-full" rows={3} placeholder="Summary"
            value={cvData.summary} onChange={(e) => setCvData((p) => ({ ...p, summary: e.target.value }))} />

          <input className="border rounded px-3 py-2 w-full" placeholder="Skills (comma separated)"
            value={(cvData.skills || []).join(', ')}
            onChange={(e) => setCvData((p) => ({ ...p, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Experience</h3>
              <button onClick={addExperience} type="button" className="text-sm text-purple-700 font-medium">+ Add</button>
            </div>
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Education</h3>
              <button onClick={addEducation} type="button" className="text-sm text-purple-700 font-medium">+ Add</button>
            </div>
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
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('chooser')} type="button" className="border px-4 py-2 rounded-lg font-medium">Back</button>
            <button onClick={() => setStep('result')} type="button" className="bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
              Generate CV
            </button>
          </div>
        </div>
      )}

      {step === 'result' && (
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
            <button onClick={() => setStep('form')} className="border px-4 py-2 rounded-lg font-medium">Edit</button>
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

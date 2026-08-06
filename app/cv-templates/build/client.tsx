'use client';

// app/cv-templates/build/client.tsx
// Entry point is decided on the role/country page (the static action bar)
// via ?start=quick|fetch|blank|sample|history. Quick Create resolves and
// renders the CV directly — no form step. Everything else resolves initial
// CVData, then shows one screen (CVFieldsEditor) with a paste-to-parse box
// at the top, then the render/download step.

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import { downloadCVAsDocx } from '@/lib/cv-template-pages/cv-docx-export';
import { mapCVDataToOnboardingUpdate, insertOnboardingData } from '@/lib/cv-template-pages/onboarding-fetch';
import { getHistoryEntry, saveToHistory } from '@/lib/cv-template-pages/cv-history';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';
import BackButton from '../_components/back-button';
import CVFieldsEditor from '../_components/cv-fields-editor';
import GeneratingAnimation from '../_components/generating-animation';

type Stage = 'loading' | 'form' | 'signup-gate' | 'result';
type StartMode = 'quick' | 'sample' | 'blank' | 'history';

function emptyCV(roleLabel: string): CVData {
  return {
    personalDetails: { name: '', title: roleLabel || '', email: '', phone: '', location: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
  };
}

const QUICK_CREATE_MESSAGES = ['Fetching your profile…', 'Tailoring your CV…', 'Almost done…'];
const FETCH_MESSAGES = ['Fetching your saved details…'];

export default function BuildClient({
  roleSlug,
  roleLabel,
  sampleCvData,
  start,
  historyId,
}: {
  roleSlug: string;
  roleLabel: string;
  sampleCvData: CVData | null;
  start: StartMode;
  historyId?: string;
}) {
  const [stage, setStage] = useState<Stage>('loading');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData>(emptyCV(roleLabel));
  const [defaultOpen, setDefaultOpen] = useState<string[]>(['personal', 'summary']);

  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  const [pasteText, setPasteText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [gateEmail, setGateEmail] = useState('');
  const [gatePassword, setGatePassword] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  function checkOverflow() {
    try {
      const doc = previewFrameRef.current?.contentDocument;
      const content = doc?.querySelector('.content') as HTMLElement | null;
      if (!content) {
        setIsOverflowing(false);
        return;
      }
      setIsOverflowing(content.scrollHeight > content.clientHeight + 3);
    } catch {
      setIsOverflowing(false);
    }
  }

  function finishAndShowResult(data: CVData, designId: string) {
    saveToHistory({
      roleSlug: roleSlug || roleLabel.toLowerCase().replace(/\s+/g, '-'),
      roleLabel,
      designId,
      cvData: data,
    });
    setStage('result');
  }

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

      if (start === 'quick') {
        if (!uid) {
          setError('Please log in to use Quick Create.');
          setCvData(emptyCV(roleLabel));
          setStage('form');
          return;
        }
        try {
          const { data: fnData, error: fnError } = await supabase.functions.invoke('tailor-cv-template-page', {
            body: { userId: uid, roleLabel },
          });
          if (cancelled) return;
          if (fnError) throw new Error(fnError.message);
          if (!fnData?.success || !fnData?.data) throw new Error(fnData?.error || 'Quick Create failed.');
          const generated = fnData.data as CVData;
          setCvData(generated);
          // Quick Create is fully AI-generated — go straight to the result,
          // no review form (that's what makes it different from Edit/fetch).
          finishAndShowResult(generated, selectedDesign);
        } catch (err: any) {
          if (!cancelled) {
            setError(err.message || 'Quick Create failed. You can fill the form manually instead.');
            setCvData(emptyCV(roleLabel));
            setStage('form');
          }
        }
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

  async function handleParse() {
    if (pasteText.trim().length < 10) {
      setError('Paste a bit more detail before parsing.');
      return;
    }
    setParsing(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('parse-cv-template-form', {
        body: { rawText: pasteText },
      });
      if (fnError) throw new Error(fnError.message);
      if (!data?.success || !data?.data) throw new Error(data?.error || 'Could not parse that text.');
      const p = data.data;
      setCvData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          name: p.name || prev.personalDetails.name,
          title: p.title || prev.personalDetails.title,
          email: p.email || prev.personalDetails.email,
          phone: p.phone || prev.personalDetails.phone,
          location: p.location || prev.personalDetails.location,
        },
        summary: p.summary || prev.summary,
        skills: p.skills?.length ? p.skills : prev.skills,
        experience: p.experience?.length ? p.experience : prev.experience,
        education: p.education?.length ? p.education : prev.education,
      }));
      setPasteText('');
      if (userId) {
        setDefaultOpen(['personal']);
      } else {
        // Not signed in — the parsed CV is ready, but stays hidden until
        // they create an account.
        setStage('signup-gate');
      }
    } catch (err: any) {
      setError(err.message || 'Could not parse that text.');
    } finally {
      setParsing(false);
    }
  }

  async function handleGateSignup(e: React.FormEvent) {
    e.preventDefault();
    setGateLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: gateEmail.trim(),
        password: gatePassword,
      });
      if (signUpError) throw signUpError;
      const newUserId = data.user?.id;
      if (!newUserId) throw new Error('Could not create your account. Please try again.');

      setUserId(newUserId);
      const updates = mapCVDataToOnboardingUpdate(cvData);
      const result = await insertOnboardingData(newUserId, updates);
      if (!result.success) throw new Error(result.error || 'Account created, but saving your CV failed.');

      setDefaultOpen(['personal']);
      setStage('form');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setGateLoading(false);
    }
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
        country_code: '', // country omitted from the UI for now; column is NOT NULL
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

  return (
    <>
      <BackButton title={`Build Your ${roleLabel} CV`} href={roleSlug ? `/cv-templates/${roleSlug}` : '/cv-templates'} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-end mb-4">
          <Link href="/cv-templates/history" className="text-sm text-blue-700 font-medium">CV History</Link>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {stage === 'loading' && (
          <GeneratingAnimation messages={start === 'quick' ? QUICK_CREATE_MESSAGES : FETCH_MESSAGES} />
        )}

        {stage === 'form' && (
          <div>
            {/* Autofill from an existing CV — for people building a CV for someone else */}
            <div className="border rounded-lg p-3 mb-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-2">Autofill from a CV</p>
              <textarea
                className="border rounded px-3 py-2 w-full text-sm bg-white"
                rows={3}
                placeholder="Paste CV or resume text here to auto-fill the form below (optional)"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
              />
              <button
                onClick={handleParse}
                disabled={parsing || pasteText.trim().length === 0}
                type="button"
                className="mt-2 text-sm bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium disabled:opacity-50"
              >
                {parsing ? 'Reading…' : 'Autofill'}
              </button>
            </div>

            <CVFieldsEditor cvData={cvData} setCvData={setCvData} defaultOpenSections={defaultOpen} />

            <button onClick={() => finishAndShowResult(cvData, selectedDesign)} type="button" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full mt-2">
              Generate CV
            </button>
          </div>
        )}

        {stage === 'signup-gate' && (
          <form onSubmit={handleGateSignup} className="max-w-sm mx-auto pt-10">
            <h2 className="text-xl font-bold text-center mb-6">Sign up to view CV/Resume</h2>
            <div className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <button
                type="submit"
                disabled={gateLoading}
                className="bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold w-full disabled:opacity-50"
              >
                {gateLoading ? 'Creating account…' : 'Sign Up'}
              </button>
            </div>
          </form>
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
            {isOverflowing && (
              <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <span>⚠️</span>
                <span>This CV looks longer than one page — some content at the bottom may be cut off. Try trimming a bullet point or shortening a section, then check again.</span>
              </div>
            )}
            <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 mb-3">
              <iframe
                ref={previewFrameRef}
                id="cv-preview-frame"
                title="CV preview"
                srcDoc={previewHtml}
                onLoad={checkOverflow}
                className="w-full"
                style={{ height: '900px', border: 'none' }}
              />
            </div>
            <div className="h-20" />
          </div>
        )}
      </main>

      {stage === 'result' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto flex-nowrap">
            <button onClick={() => setStage('form')} className="shrink-0 border px-4 py-2 rounded-lg font-medium text-sm">Edit</button>
            <button onClick={handlePrint} className="shrink-0 border px-4 py-2 rounded-lg font-medium text-sm">Print / PDF</button>
            <button onClick={handleDownloadDocx} disabled={downloadingDocx} className="shrink-0 border px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50">
              {downloadingDocx ? 'Preparing…' : 'Download as Word'}
            </button>
            <button onClick={handleSave} disabled={saving} className="shrink-0 border px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save this CV'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

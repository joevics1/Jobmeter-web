'use client';

// app/cover-letter-templates/build/client.tsx
// Entry point is decided on the role page's static action bar via
// ?start=quick|blank|sample|history.
//
// Quick Create is functionally restricted to signed-in users — if no
// userId is present when this resolves, it opens the onboarding modal
// instead of proceeding (same gate as CV templates' paste-to-parse box).
// Unlike CV's Quick Create (a raw, non-AI reshape of onboarding_data),
// this one always calls Gemini (tailor-cover-letter-template-page),
// because a cover letter has to be WRITTEN, not just reformatted.

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { renderCoverLetterTemplate } from '@/lib/cover-letter-template-pages/cover-letter-renderer';
import { COVER_LETTER_PAGE_DESIGNS } from '@/lib/cover-letter-template-pages/design-list';
import { downloadCoverLetterAsDocx } from '@/lib/cover-letter-template-pages/cover-letter-docx-export';
import { getHistoryEntry, saveToHistory } from '@/lib/cover-letter-template-pages/cover-letter-history';
import { useCoverLetterOverflowCheck } from '@/lib/cover-letter-template-pages/use-cover-letter-overflow';
import type { CoverLetterData } from '@/lib/cover-letter-template-pages/cover-letter-data-types';
import { Download } from 'lucide-react';
import BackButton from '../_components/back-button';
import CoverLetterPreviewFrame from '../_components/cover-letter-preview-frame';
import CoverLetterFieldsEditor from '../_components/cover-letter-fields-editor';
import GeneratingAnimation from '../_components/generating-animation';
import CoverLetterOnboardingModal from '../_components/cover-letter-onboarding-modal';

type Stage = 'loading' | 'form' | 'result';
type StartMode = 'quick' | 'sample' | 'blank' | 'history';

// Same reasoning as app/cv-templates/build/client.tsx's getFnErrorMessage —
// supabase-js's functions.invoke() doesn't auto-parse a non-2xx body.
async function getFnErrorMessage(fnError: any, fallback: string): Promise<string> {
  try {
    if (fnError?.context?.json) {
      const body = await fnError.context.json();
      if (body?.error) return body.error;
    }
  } catch {
    // fall through to generic message below
  }
  return fnError?.message || fallback;
}

function emptyCoverLetter(roleLabel: string): CoverLetterData {
  return {
    personalDetails: { name: '', title: roleLabel || '', email: '', phone: '', location: '' },
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    recipient: { companyName: '' },
    salutation: 'Dear Hiring Manager,',
    openingParagraph: '',
    bodyParagraphs: [''],
    closingParagraph: '',
    signOff: 'Sincerely,',
  };
}

const QUICK_CREATE_MESSAGES = ['Reading your profile…', 'Writing your cover letter…', 'Almost done…'];

export default function BuildClient({
  roleSlug,
  roleLabel,
  sampleCoverLetterData,
  start,
  historyId,
}: {
  roleSlug: string;
  roleLabel: string;
  sampleCoverLetterData: CoverLetterData | null;
  start: StartMode;
  historyId?: string;
}) {
  const [stage, setStage] = useState<Stage>('loading');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [letterData, setLetterData] = useState<CoverLetterData>(emptyCoverLetter(roleLabel));

  const [selectedDesign, setSelectedDesign] = useState(COVER_LETTER_PAGE_DESIGNS[0]?.id ?? 'cl-template-1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  const [pasteText, setPasteText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'autofill' | 'customize'>('autofill');
  const [jobDescText, setJobDescText] = useState('');
  const [customizing, setCustomizing] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const { previewFrameRef, isOverflowing, checkOverflow } = useCoverLetterOverflowCheck();

  function finishAndShowResult(data: CoverLetterData, designId: string) {
    saveToHistory({
      roleSlug: roleSlug || roleLabel.toLowerCase().replace(/\s+/g, '-'),
      roleLabel,
      designId,
      coverLetterData: data,
    });
    setStage('result');
  }

  // Resolve the initial CoverLetterData based on ?start= as soon as we land.
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
          setError('That saved cover letter could not be found on this device.');
          setLetterData(emptyCoverLetter(roleLabel));
          setStage('form');
          return;
        }
        setLetterData(entry.coverLetterData);
        setSelectedDesign(entry.designId);
        setStage('result');
        return;
      }

      if (start === 'sample') {
        setLetterData(sampleCoverLetterData || emptyCoverLetter(roleLabel));
        setStage('form');
        return;
      }

      if (start === 'quick') {
        // Functional login gate — Quick Create never proceeds without a
        // real userId, since the AI call needs onboarding_data server-side.
        if (!uid) {
          setLetterData(emptyCoverLetter(roleLabel));
          setStage('form');
          setShowOnboardingModal(true);
          return;
        }
        setStage('loading');
        try {
          const { data: fnData, error: fnError } = await supabase.functions.invoke('tailor-cover-letter-template-page', {
            body: { userId: uid, roleLabel },
          });
          if (cancelled) return;
          if (fnError) throw new Error(await getFnErrorMessage(fnError, 'Quick Create failed.'));
          if (!fnData?.success || !fnData?.data) throw new Error(fnData?.error || 'Quick Create failed.');
          const generated = fnData.data as CoverLetterData;
          setLetterData(generated);
          finishAndShowResult(generated, selectedDesign);
        } catch (err: any) {
          if (!cancelled) {
            setError(err.message || 'Quick Create failed. You can fill the form manually instead.');
            setLetterData(sampleCoverLetterData || emptyCoverLetter(roleLabel));
            setStage('form');
          }
        }
        return;
      }

      // start === 'blank'
      setLetterData(emptyCoverLetter(roleLabel));
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
    if (!userId) {
      setShowOnboardingModal(true);
      return;
    }
    setParsing(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('parse-cover-letter-template-form', {
        body: { rawText: pasteText },
      });
      if (fnError) throw new Error(await getFnErrorMessage(fnError, 'Could not parse that text.'));
      if (!data?.success || !data?.data) throw new Error(data?.error || 'Could not parse that text.');
      const p = data.data;
      setLetterData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          name: p.name || prev.personalDetails.name,
          title: p.title || prev.personalDetails.title,
          email: p.email || prev.personalDetails.email,
          phone: p.phone || prev.personalDetails.phone,
          location: p.location || prev.personalDetails.location,
        },
        recipient: {
          ...prev.recipient,
          companyName: p.companyName || prev.recipient.companyName,
          hiringManagerName: p.hiringManagerName || prev.recipient.hiringManagerName,
        },
        salutation: p.salutation || prev.salutation,
        openingParagraph: p.openingParagraph || prev.openingParagraph,
        bodyParagraphs: p.bodyParagraphs?.length ? p.bodyParagraphs : prev.bodyParagraphs,
        closingParagraph: p.closingParagraph || prev.closingParagraph,
        signOff: p.signOff || prev.signOff,
      }));
      setPasteText('');
    } catch (err: any) {
      setError(err.message || 'Could not parse that text.');
    } finally {
      setParsing(false);
    }
  }

  async function handleCustomizeForJob() {
    if (jobDescText.trim().length < 20) {
      setError('Paste a fuller job description before customizing.');
      return;
    }
    if (!userId) {
      setShowOnboardingModal(true);
      return;
    }
    setCustomizing(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('customize-cover-letter-for-job', {
        body: { coverLetterData: letterData, jobDescription: jobDescText },
      });
      if (fnError) throw new Error(await getFnErrorMessage(fnError, 'Could not customize for that job.'));
      if (!data?.success || !data?.data) throw new Error(data?.error || 'Could not customize for that job.');
      setLetterData(data.data as CoverLetterData);
      setJobDescText('');
    } catch (err: any) {
      setError(err.message || 'Could not customize for that job.');
    } finally {
      setCustomizing(false);
    }
  }

  // ── Result step ──────────────────────────────────────────────────

  const previewHtml = useMemo(
    () => renderCoverLetterTemplate(selectedDesign, letterData),
    [letterData, selectedDesign]
  );

  function handlePrint() {
    previewFrameRef.current?.contentWindow?.print();
  }
  async function handleDownloadDocx() {
    setDownloadingDocx(true);
    try {
      await downloadCoverLetterAsDocx(letterData, `${letterData.personalDetails.name || 'my'}-Cover-Letter`);
    } catch (err: any) {
      setError(err.message || 'Could not build the Word file.');
    } finally {
      setDownloadingDocx(false);
    }
  }
  async function handleSave() {
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('cover_letter_template_generations').insert({
        user_id: userId,
        role_slug: roleSlug || roleLabel.toLowerCase().replace(/\s+/g, '-'),
        country_code: '',
        design_id: selectedDesign,
        cover_letter_data: letterData,
      });
      if (insertError) throw insertError;
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Could not save your cover letter.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <BackButton title={`Build Your ${roleLabel} Cover Letter`} href={roleSlug ? `/cover-letter-templates/${roleSlug}` : '/cover-letter-templates'} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-end mb-4">
          <Link href="/cover-letter-templates/history" className="text-sm text-blue-600 font-medium">Cover Letter History</Link>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
            {error.includes('No profile data found') && (
              <> <Link href="/edit" className="underline font-medium">Complete your profile</Link> to use Quick Create.</>
            )}
          </p>
        )}

        {stage === 'loading' && (
          <GeneratingAnimation messages={QUICK_CREATE_MESSAGES} />
        )}

        {stage === 'form' && (
          <div>
            <div className="border border-border rounded-lg mb-4 bg-muted overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('autofill')}
                  className={`flex-1 py-2.5 text-sm font-semibold ${activeTab === 'autofill' ? 'bg-card text-blue-600 border-b-2 border-blue-600' : 'text-muted-foreground'}`}
                >
                  Autofill from Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('customize')}
                  className={`flex-1 py-2.5 text-sm font-semibold ${activeTab === 'customize' ? 'bg-card text-blue-600 border-b-2 border-blue-600' : 'text-muted-foreground'}`}
                >
                  Customize for a Job
                </button>
              </div>

              {activeTab === 'autofill' && (
                <div className="p-3">
                  <textarea
                    className="border border-border rounded px-3 py-2 w-full text-sm bg-card"
                    rows={3}
                    placeholder="Paste a draft or old cover letter here to auto-fill the form below (optional)"
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                  />
                  <button
                    onClick={handleParse}
                    disabled={parsing || pasteText.trim().length === 0}
                    type="button"
                    className="mt-2 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium disabled:opacity-50"
                  >
                    {parsing ? 'Reading…' : 'Autofill'}
                  </button>
                </div>
              )}

              {activeTab === 'customize' && (
                <div className="p-3">
                  <textarea
                    className="border border-border rounded px-3 py-2 w-full text-sm bg-card"
                    rows={3}
                    placeholder="Paste the job description here to tailor your letter toward it (optional)"
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                  />
                  <button
                    onClick={handleCustomizeForJob}
                    disabled={customizing || jobDescText.trim().length === 0}
                    type="button"
                    className="mt-2 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium disabled:opacity-50"
                  >
                    {customizing ? 'Customizing…' : 'Customize'}
                  </button>
                </div>
              )}
            </div>

            <CoverLetterFieldsEditor data={letterData} setData={setLetterData} />

            <button
              onClick={() => finishAndShowResult(letterData, selectedDesign)}
              disabled={!letterData.personalDetails.name.trim()}
              type="button"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Cover Letter
            </button>
            {!letterData.personalDetails.name.trim() && (
              <p className="text-xs text-muted-foreground text-center mt-1.5">Add your name above to generate the cover letter.</p>
            )}
          </div>
        )}

        {stage === 'result' && (
          <div>
            <div className="flex gap-2 mb-3 overflow-x-auto flex-nowrap pb-1">
              {COVER_LETTER_PAGE_DESIGNS.map((d) => (
                <button key={d.id} onClick={() => setSelectedDesign(d.id)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${selectedDesign === d.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-card text-foreground border-border'}`}>
                  {d.name}
                </button>
              ))}
            </div>

            {isOverflowing && (
              <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <span>⚠️</span>
                <span>This letter looks longer than one page — some content at the bottom may be cut off. Try shortening a paragraph.</span>
              </div>
            )}
            <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-muted mb-3">
              <CoverLetterPreviewFrame ref={previewFrameRef} title="Cover letter preview" html={previewHtml} onLoad={checkOverflow} />
            </div>
            <div className="h-20" />
          </div>
        )}
      </main>

      {stage === 'result' && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto flex-nowrap">
            <button onClick={() => setStage('form')} className="shrink-0 border border-border px-4 py-2 rounded-lg font-medium text-sm text-foreground">Edit</button>
            <button onClick={handlePrint} className="shrink-0 flex items-center gap-1.5 border border-border px-4 py-2 rounded-lg font-medium text-sm text-foreground">
              PDF <Download size={15} />
            </button>
            <button onClick={handleDownloadDocx} disabled={downloadingDocx} className="shrink-0 flex items-center gap-1.5 border border-border px-4 py-2 rounded-lg font-medium text-sm text-foreground disabled:opacity-50">
              {downloadingDocx ? 'Preparing…' : (<>Word Docx <Download size={15} /></>)}
            </button>
            <button onClick={handleSave} disabled={saving} className="shrink-0 border border-border px-4 py-2 rounded-lg font-medium text-sm text-foreground disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>
      )}
      <CoverLetterOnboardingModal open={showOnboardingModal} onOpenChange={setShowOnboardingModal} />
    </>
  );
}

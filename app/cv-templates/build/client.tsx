'use client';

// app/cv-templates/build/client.tsx
// Form -> calls the isolated generate-cv-template-page edge function ->
// renders result with the copied renderer, design switcher, print/save.
// Uses the app-wide lib/supabase client (generic infra, not CV-specific
// code) — everything CV-specific here is new/isolated.

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { renderCVTemplate } from '@/lib/cv-template-pages/cv-renderer';
import { CV_PAGE_DESIGNS } from '@/lib/cv-template-pages/design-list';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';

export default function BuildClient() {
  const searchParams = useSearchParams();
  const roleSlug = searchParams.get('role') || '';
  const countryCode = searchParams.get('country') || '';

  const [roleLabel, setRoleLabel] = useState(roleSlug.replace(/-/g, ' '));
  const [countryLabel, setCountryLabel] = useState(countryCode.toUpperCase());
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [summaryHint, setSummaryHint] = useState('');
  const [skillsText, setSkillsText] = useState('');

  const [userId, setUserId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedDesign, setSelectedDesign] = useState(CV_PAGE_DESIGNS[0]?.id ?? 'template-1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
  }, []);

  const previewHtml = useMemo(() => {
    if (!cvData) return null;
    return renderCVTemplate(selectedDesign, cvData, 'view');
  }, [cvData, selectedDesign]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !roleLabel.trim() || !countryLabel.trim()) {
      setError('Name, role, and country are required.');
      return;
    }
    setError(null);
    setGenerating(true);
    setSaved(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-cv-template-page', {
        body: {
          roleLabel,
          countryLabel,
          fullName,
          email: email || undefined,
          phone: phone || undefined,
          yearsExperience: yearsExperience || undefined,
          summaryHint: summaryHint || undefined,
          skills: skillsText ? skillsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          userId: userId || undefined,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success || !data?.data) throw new Error(data?.error || 'Generation failed');

      setCvData(data.data as CVData);
    } catch (err: any) {
      setError(err.message || 'Something went wrong generating your CV.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!cvData) return;
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('cv_template_generations').insert({
        user_id: userId, // null is fine — anonymous inserts allowed
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

  function handlePrint() {
    const iframe = document.getElementById('cv-preview-frame') as HTMLIFrameElement | null;
    iframe?.contentWindow?.print();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <section>
        <h1 className="text-2xl font-bold mb-6">Build Your CV</h1>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Target role" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value)} required />
            <input className="border rounded px-3 py-2" placeholder="Country" value={countryLabel} onChange={(e) => setCountryLabel(e.target.value)} required />
          </div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Years of experience" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
          <input className="border rounded px-3 py-2 w-full" placeholder="Skills (comma separated, optional)" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
          <textarea className="border rounded px-3 py-2 w-full" rows={4} placeholder="Anything else about your background? (optional)" value={summaryHint} onChange={(e) => setSummaryHint(e.target.value)} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={generating} className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">
            {generating ? 'Generating…' : 'Generate CV'}
          </button>
        </form>
      </section>

      <section>
        {cvData ? (
          <>
            <div className="flex gap-2 mb-3 flex-wrap">
              {CV_PAGE_DESIGNS.map((d) => (
                <button key={d.id} onClick={() => setSelectedDesign(d.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${selectedDesign === d.id ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-700 border-gray-300'}`}>
                  {d.name}
                </button>
              ))}
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 mb-3">
              <iframe id="cv-preview-frame" title="CV preview" srcDoc={previewHtml ?? ''} className="w-full" style={{ height: '900px', border: 'none' }} />
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="border px-4 py-2 rounded-lg font-medium">Print / Save as PDF</button>
              <button onClick={handleSave} disabled={saving} className="border px-4 py-2 rounded-lg font-medium disabled:opacity-50">
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save this CV'}
              </button>
            </div>
          </>
        ) : (
          <div className="border rounded-lg h-full min-h-[400px] flex items-center justify-center text-gray-400">
            Your CV preview will appear here
          </div>
        )}
      </section>
    </main>
  );
}

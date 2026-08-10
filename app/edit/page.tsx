'use client';

// app/edit/page.tsx
// Dedicated "Edit Profile" page — Full Name / Email (profiles table) plus
// the full CV field set (onboarding_data), reusing the same CVFieldsEditor
// built for the CV Templates feature. Opened from /settings via the
// profile card's Edit button, as its own page rather than an inline panel.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  fetchOnboardingData,
  mapOnboardingToCVData,
  mapCVDataToOnboardingUpdate,
  updateOnboardingData,
} from '@/lib/cv-template-pages/onboarding-fetch';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';
import CVFieldsEditor from '@/app/cv-templates/_components/cv-fields-editor';
import BackButton from '@/app/cv-templates/_components/back-button';
import { computeNextMonday } from '@/lib/talent';

interface ProfileData {
  full_name: string | null;
  email: string;
}

function emptyCVProfile(): CVData {
  return {
    personalDetails: { name: '', title: '', email: '', phone: '', location: '' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
  };
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({ full_name: '', email: '' });
  const [cvData, setCvData] = useState<CVData>(emptyCVProfile());
  const [talentPool, setTalentPool] = useState(false);
  const [wasTalentPool, setWasTalentPool] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [profileWasEmpty, setProfileWasEmpty] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/settings');
        return;
      }
      setUserId(authUser.id);
      setUserEmail(authUser.email ?? null);

      const [{ data: profile }, onboardingRow] = await Promise.all([
        supabase.from('profiles').select('full_name, email, role').eq('id', authUser.id).single(),
        fetchOnboardingData(authUser.id),
      ]);

      const nextCvData = onboardingRow ? mapOnboardingToCVData(onboardingRow) : emptyCVProfile();
      setProfileData({ full_name: profile?.full_name || null, email: profile?.email || authUser.email || '' });
      setCvData(nextCvData);
      setProfileWasEmpty(
        !nextCvData.personalDetails.name &&
        !nextCvData.summary &&
        (nextCvData.experience || []).length === 0
      );
      setTalentPool(!!onboardingRow?.talent_pool);
      setWasTalentPool(!!onboardingRow?.talent_pool);
      setLoading(false);
    })();
  }, [router]);

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
      setProfileWasEmpty(false);
    } catch (err: any) {
      setError(err.message || 'Could not parse that text.');
    } finally {
      setParsing(false);
    }
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const { error: profileError } = await supabase.from('profiles').upsert(
        { id: userId, full_name: profileData.full_name, email: profileData.email, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      if (profileError) throw profileError;

      if (profileData.email !== userEmail) {
        const { error: authError } = await supabase.auth.updateUser({ email: profileData.email });
        if (authError) console.error('Error updating auth email:', authError);
      }

      const updates = mapCVDataToOnboardingUpdate(cvData);
      // Only stamp a new visibility date the moment someone turns this on —
      // that's what makes the list update in a weekly Monday batch instead
      // of live per opt-in. Turning it off just hides them again immediately.
      const talentUpdates: Record<string, any> = { talent_pool: talentPool };
      if (talentPool && !wasTalentPool) {
        talentUpdates.talent_visible_from = computeNextMonday().toISOString();
      } else if (!talentPool) {
        talentUpdates.talent_visible_from = null;
      }
      const cvResult = await updateOnboardingData(userId, { ...updates, ...talentUpdates });
      if (!cvResult.success) throw new Error(cvResult.error || 'Could not save your CV details.');

      setWasTalentPool(talentPool);
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <BackButton title="Edit Profile" href="/settings" />
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          <p className="text-gray-400">Loading your profile…</p>
        ) : (
          <>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {profileWasEmpty && (
              <div className="border rounded-lg p-3 mb-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">Have a CV already? Upload it to autofill</p>
                <textarea
                  className="border rounded px-3 py-2 w-full text-sm bg-white"
                  rows={3}
                  placeholder="Paste your CV or resume text here to auto-fill the form below"
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
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.full_name || ''}
                  onChange={(e) => setProfileData((p) => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-700 mb-2 px-1">CV Details</h2>
            <p className="text-xs text-gray-500 mb-3 px-1">Used to fill and tailor CVs across JobMeter.</p>
            <CVFieldsEditor cvData={cvData} setCvData={setCvData} defaultOpenSections={['personal']} />

            <div className="bg-white rounded-xl border border-gray-100 p-4 mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="edit-talent-pool"
                checked={talentPool}
                onChange={(e) => setTalentPool(e.target.checked)}
                className="h-5 w-5 rounded cursor-pointer mt-0.5 accent-blue-600"
              />
              <div>
                <label htmlFor="edit-talent-pool" className="font-semibold text-sm cursor-pointer text-gray-900">
                  Join the Talent Pool
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Join the Talent Pool and let verified recruiters find and contact you directly for job opportunities.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-700 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

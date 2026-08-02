'use client';

// app/settings/edit-profile/page.tsx
// Lets a signed-in user view/edit their full onboarding_data profile in one
// long form, reusing the same CVFieldsEditor built for the CV Templates
// feature (same normalized field shapes). Reads and writes onboarding_data
// directly — an existing table, no schema change, standard update via RLS.

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

function emptyCV(): CVData {
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
  const [cvData, setCvData] = useState<CVData>(emptyCV());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      if (!uid) {
        router.push(`/auth/login?redirect=${encodeURIComponent('/settings/edit-profile')}`);
        return;
      }
      setUserId(uid);
      const row = await fetchOnboardingData(uid);
      if (row) setCvData(mapOnboardingToCVData(row));
      setLoading(false);
    })();
  }, [router]);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updates = mapCVDataToOnboardingUpdate(cvData);
      const result = await updateOnboardingData(userId, updates);
      if (!result.success) throw new Error(result.error || 'Could not save your profile.');
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
            <CVFieldsEditor cvData={cvData} setCvData={setCvData} defaultOpenSections={['personal']} />
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

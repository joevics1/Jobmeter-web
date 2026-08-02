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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push(`/auth/login?redirect=${encodeURIComponent('/edit')}`);
        return;
      }
      setUserId(authUser.id);
      setUserEmail(authUser.email ?? null);

      const [{ data: profile }, onboardingRow] = await Promise.all([
        supabase.from('profiles').select('full_name, email, role').eq('id', authUser.id).single(),
        fetchOnboardingData(authUser.id),
      ]);

      setProfileData({ full_name: profile?.full_name || null, email: profile?.email || authUser.email || '' });
      setCvData(onboardingRow ? mapOnboardingToCVData(onboardingRow) : emptyCVProfile());
      setLoading(false);
    })();
  }, [router]);

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
      const cvResult = await updateOnboardingData(userId, updates);
      if (!cvResult.success) throw new Error(cvResult.error || 'Could not save your CV details.');

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

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const SECTORS = [
  'Information Technology & Software', 'Engineering & Manufacturing', 'Finance & Banking',
  'Healthcare & Medical', 'Education & Training', 'Sales & Marketing',
  'Human Resources & Recruitment', 'Customer Service & Support',
  'Media, Advertising & Communications', 'Design, Arts & Creative',
  'Construction & Real Estate', 'Logistics, Transport & Supply Chain',
  'Agriculture & Agribusiness', 'Energy & Utilities (Oil, Gas, Renewable Energy)',
  'Legal & Compliance', 'Government & Public Administration', 'Retail & E-commerce',
  'Hospitality & Tourism', 'Science & Research', 'Security & Defense',
  'Telecommunications', 'Nonprofit & NGO', 'Environment & Sustainability',
  'Product Management & Operations', 'Data & Analytics',
];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

// The underlying jsonb fields aren't 100% guaranteed to be arrays vs strings
// (this table is also written to by an external pipeline) — read defensively.
const toLines = (v: any): string => (Array.isArray(v) ? v.join('\n') : (v || ''));
const toCsv = (v: any): string => (Array.isArray(v) ? v.join(', ') : (v || ''));
const linesToArray = (s: string): string[] => s.split('\n').map((x) => x.trim()).filter(Boolean);
const csvToArray = (s: string): string[] => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function EditSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: '', sector: '', city: '', state: '', remote: false,
    employmentType: '', skills: '', experienceLevel: '',
    salaryMin: '', salaryMax: '', currency: 'NGN', period: 'annually',
    description: '', responsibilities: '', qualifications: '', benefits: '',
    applicationUrl: '', applicationEmail: '', applicationPhone: '', deadline: '',
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/auth?redirect=/dashboard/recruiter/edit/${id}`);
        return;
      }
      setUserId(session.user.id);

      const res = await fetch(`/api/recruiter/edit-submission?id=${id}&userId=${session.user.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load this submission');
        setLoading(false);
        return;
      }

      const s = data.submission;
      setForm({
        title: s.title || '',
        sector: s.sector || SECTORS[0],
        city: s.location?.city || '',
        state: s.location?.state || '',
        remote: !!s.location?.remote,
        employmentType: s.employment_type || EMPLOYMENT_TYPES[0],
        skills: toCsv(s.skills_required),
        experienceLevel: s.experience_level || '',
        salaryMin: s.salary_range?.min != null ? String(s.salary_range.min) : '',
        salaryMax: s.salary_range?.max != null ? String(s.salary_range.max) : '',
        currency: s.salary_range?.currency || 'NGN',
        period: s.salary_range?.period || 'annually',
        description: s.description || '',
        responsibilities: toLines(s.responsibilities),
        qualifications: toLines(s.qualifications),
        benefits: toLines(s.benefits),
        applicationUrl: s.application?.url || '',
        applicationEmail: s.application?.email || '',
        applicationPhone: s.application?.phone || '',
        deadline: s.deadline || '',
      });
      setLoading(false);
    };
    init();
  }, [id, router]);

  const handleSave = async () => {
    if (!userId) return;
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/recruiter/edit-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          userId,
          updates: {
            title: form.title.trim(),
            sector: form.sector,
            employment_type: form.employmentType,
            experience_level: form.experienceLevel,
            description: form.description.trim(),
            deadline: form.deadline || null,
            location: { city: form.city.trim(), state: form.state.trim(), remote: form.remote },
            skills_required: csvToArray(form.skills),
            responsibilities: linesToArray(form.responsibilities),
            qualifications: linesToArray(form.qualifications),
            benefits: linesToArray(form.benefits),
            salary_range: {
              min: form.salaryMin ? Number(form.salaryMin) : null,
              max: form.salaryMax ? Number(form.salaryMax) : null,
              currency: form.currency,
              period: form.period,
            },
            application: {
              url: form.applicationUrl.trim() || null,
              email: form.applicationEmail.trim() || null,
              phone: form.applicationPhone.trim() || null,
            },
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Failed to save changes');
        setSaving(false);
        return;
      }
      setSaved(true);
    } catch (e) {
      setError('Something went wrong saving your changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} color={theme.colors.primary.DEFAULT} />
      </div>
    );
  }

  if (error && !saved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: theme.colors.primary.DEFAULT + '15' }}
          >
            <CheckCircle2 size={28} style={{ color: theme.colors.primary.DEFAULT }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Changes submitted for review</h1>
          <p className="text-gray-600 mb-6">
            Your edits won't go live until they're reviewed again, even if this job was already live before.
          </p>
          <a
            href="/dashboard/recruiter"
            className="inline-block px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            Back to your jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <a href="/dashboard/recruiter" className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:underline">
          <ArrowLeft size={15} /> Back to your jobs
        </a>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7 space-y-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Edit job</h1>
          <p className="text-sm text-gray-500 mb-4">
            Saving sends this back for admin review — changes won't appear live until approved.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Job title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Sector</label>
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              >
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Employment type</label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              >
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">State/Region</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Skills (comma-separated)</label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Responsibilities (one per line)</label>
            <textarea
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Salary min</label>
              <input
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Salary max</label>
              <input
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Application email</label>
              <input
                value={form.applicationEmail}
                onChange={(e) => setForm({ ...form, applicationEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Application URL</label>
              <input
                value={form.applicationUrl}
                onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Application phone</label>
              <input
                value={form.applicationPhone}
                onChange={(e) => setForm({ ...form, applicationPhone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-60"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Mail, Phone, ChevronRight, EyeOff, Eye, ArrowUpDown } from 'lucide-react';

interface Applicant {
  id: string;
  applicantId: string;
  coverLetter: string | null;
  applicationMethod: string;
  createdAt: string;
  hiddenAt: string | null;
  applicant: { full_name: string; email: string; phone: string } | null;
  screening: {
    mcq_score: number;
    written_score: number | null;
    passed: boolean;
    time_taken_seconds: number;
  } | null;
}

type SortOption = 'newest' | 'oldest' | 'score';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  score: 'Screening score',
};

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [screeningEnabled, setScreeningEnabled] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [sort, setSort] = useState<SortOption>('newest');
  const [view, setView] = useState<'visible' | 'hidden'>('visible');
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = async (uid: string, sortOpt: SortOption, viewOpt: 'visible' | 'hidden') => {
    setLoading(true);
    const res = await fetch(
      `/api/recruiter/applicants?jobId=${jobId}&userId=${uid}&sort=${sortOpt}&view=${viewOpt}`
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to load applicants');
      setLoading(false);
      return;
    }
    setJobTitle(data.jobTitle);
    setScreeningEnabled(!!data.screeningEnabled);
    setApplicants(data.applicants);
    setHiddenCount(data.hiddenCount || 0);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth?redirect=/dashboard/recruiter/jobs');
        return;
      }
      setUserId(session.user.id);
      await load(session.user.id, sort, view);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, router]);

  useEffect(() => {
    if (userId) load(userId, sort, view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, view]);

  const toggleHidden = async (e: React.MouseEvent, applicant: Applicant) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId || pendingId) return;
    setPendingId(applicant.id);
    const nextHidden = !applicant.hiddenAt;
    const res = await fetch(`/api/recruiter/applicants/${applicant.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, hidden: nextHidden }),
    });
    if (res.ok) {
      // Item no longer belongs in the current view, so just drop it locally.
      setApplicants((prev) => prev.filter((a) => a.id !== applicant.id));
      setHiddenCount((prev) => Math.max(0, prev + (nextHidden ? 1 : -1)));
    }
    setPendingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} color={theme.colors.primary.DEFAULT} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/recruiter" className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:underline">
          <ArrowLeft size={15} /> Back to dashboard
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Applicants — {jobTitle}
        </h1>

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 text-sm">
            <button
              onClick={() => setView('visible')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${view === 'visible' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Applicants
            </button>
            <button
              onClick={() => setView('hidden')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${view === 'hidden' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Hidden ({hiddenCount})
            </button>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-8 pr-8 py-1.5 text-sm font-medium text-gray-700"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              {screeningEnabled && <option value="score">Screening score</option>}
            </select>
            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            {view === 'hidden' ? 'No hidden applicants.' : 'No applicants yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.map((a) => (
              <Link
                key={a.id}
                href={`/dashboard/recruiter/jobs/${jobId}/applicants/${a.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-gray-900">
                      {a.applicant?.full_name || 'Applicant'}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {a.applicant?.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {a.applicant.email}
                        </span>
                      )}
                      {a.applicant?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {a.applicant.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.screening && (
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {a.screening.passed ? (
                          <CheckCircle2 size={14} color="#16A34A" />
                        ) : (
                          <XCircle size={14} color="#DC2626" />
                        )}
                        <span className={a.screening.passed ? 'text-green-700' : 'text-red-600'}>
                          {a.screening.mcq_score}%
                          {a.screening.written_score !== null && a.screening.written_score !== undefined
                            ? ` MCQ / ${a.screening.written_score}% written`
                            : ' MCQ'}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleHidden(e, a)}
                      disabled={pendingId === a.id}
                      title={view === 'hidden' ? 'Restore to applicants list' : 'Hide from applicants list'}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {view === 'hidden' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </div>
                {a.applicationMethod && a.applicationMethod !== 'in_app' && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded px-2 py-1 inline-block">
                    Applied via {a.applicationMethod === 'email' ? 'email' : a.applicationMethod === 'phone' ? 'WhatsApp/phone' : 'external link'} — no in-app details, this is a click-through record
                  </p>
                )}
                {a.coverLetter && (
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap border-t border-gray-100 pt-3 line-clamp-2">
                    {a.coverLetter}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  Applied {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

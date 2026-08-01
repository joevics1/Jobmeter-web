"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { CheckCircle2, Loader2, ClipboardList } from 'lucide-react';

interface JobSummary {
  id: string;
  title: string;
  company: any;
  apply_in_app: boolean;
  screening_enabled: boolean;
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobSummary | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [screeningAttempt, setScreeningAttempt] = useState<any>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/auth?redirect=/apply/${jobId}`);
        return;
      }
      setUserId(session.user.id);

      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('id, title, company, apply_in_app, screening_enabled')
        .eq('id', jobId)
        .maybeSingle();

      if (jobError || !jobData || !jobData.apply_in_app) {
        setError('This job is not available for in-app applications.');
        setLoading(false);
        return;
      }
      setJob(jobData as JobSummary);

      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('applicant_id', session.user.id)
        .maybeSingle();
      if (existingApp) setAlreadyApplied(true);

      if (jobData.screening_enabled) {
        const { data: attempt } = await supabase
          .from('screening_attempts')
          .select('id, passed, mcq_score, written_score')
          .eq('job_id', jobId)
          .eq('applicant_id', session.user.id)
          .maybeSingle();
        setScreeningAttempt(attempt);
      }

      setLoading(false);
    };
    init();
  }, [jobId, router]);

  const handleSubmit = async () => {
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          userId,
          coverLetter,
          screeningAttemptId: screeningAttempt?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit application');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} color={theme.colors.primary.DEFAULT} />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-center">{error}</p>
      </div>
    );
  }

  if (!job) return null;

  const companyName = typeof job.company === 'object' ? job.company?.name : job.company;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="mx-auto mb-4" size={48} color={theme.colors.primary.DEFAULT} />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Application submitted</h1>
          <p className="text-gray-600 mb-6">
            Your application for <span className="font-medium">{job.title}</span>
            {companyName ? ` at ${companyName}` : ''} has been sent.
          </p>
          <Link href="/jobs" className="text-blue-600 font-medium hover:underline">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="mx-auto mb-4" size={48} color={theme.colors.primary.DEFAULT} />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">You've already applied</h1>
          <p className="text-gray-600 mb-6">
            You already have an application on file for <span className="font-medium">{job.title}</span>.
          </p>
          <Link href="/jobs" className="text-blue-600 font-medium hover:underline">
            Browse more jobs
          </Link>
        </div>
      </div>
    );
  }

  // Screening required but not yet passed
  if (job.screening_enabled && (!screeningAttempt || !screeningAttempt.passed)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ClipboardList className="mx-auto mb-4" size={48} color={theme.colors.primary.DEFAULT} />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Screening quiz required</h1>
          <p className="text-gray-600 mb-6">
            This employer requires applicants to pass a short screening quiz for{' '}
            <span className="font-medium">{job.title}</span> before applying.
          </p>
          <Link
            href={`/screening/${jobId}`}
            className="inline-block px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            Start screening quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Apply for {job.title}</h1>
        {companyName && <p className="text-gray-500 mb-6">{companyName}</p>}

        {screeningAttempt?.passed && (
          <div className="mb-6 text-sm bg-green-50 text-green-700 rounded-lg px-4 py-3">
            You passed the screening quiz ({screeningAttempt.mcq_score}% MCQ
            {screeningAttempt.written_score !== null && screeningAttempt.written_score !== undefined
              ? `, ${screeningAttempt.written_score}% written`
              : ''}
            ).
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover letter <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={8}
          placeholder="Tell the employer why you're a good fit for this role..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: theme.colors.primary.DEFAULT }}
        >
          {submitting ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    </div>
  );
}

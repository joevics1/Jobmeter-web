"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { CheckCircle2, Loader2, ClipboardList, User, Mail, Phone } from 'lucide-react';

interface JobSummary {
  id: string;
  title: string;
  company: any;
  apply_in_app: boolean;
  screening_enabled: boolean;
  status: string;
  application_questions?: string[];
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
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
        .select('id, title, company, apply_in_app, screening_enabled, status, application_questions')
        .eq('id', jobId)
        .maybeSingle();

      if (jobError || !jobData || !jobData.apply_in_app) {
        setError('This job is not available for in-app applications.');
        setLoading(false);
        return;
      }
      if (jobData.status !== 'active') {
        setError('This job is no longer accepting applications.');
        setLoading(false);
        return;
      }
      setJob(jobData as JobSummary);
      setAnswers(new Array((jobData.application_questions || []).length).fill(''));

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

      // Pre-fill from the candidate's existing profile/CV so they're not
      // retyping details JobMeter already has — they can still edit any of it.
      const [{ data: profile }, { data: onboarding }] = await Promise.all([
        supabase.from('profiles').select('full_name, email, phone').eq('id', session.user.id).maybeSingle(),
        supabase.from('onboarding_data').select('cv_name').eq('user_id', session.user.id).maybeSingle(),
      ]);
      setName(profile?.full_name || onboarding?.cv_name || '');
      setEmail(profile?.email || session.user.email || '');
      setPhone(profile?.phone || '');

      setLoading(false);
    };
    init();
  }, [jobId, router]);

  const questions = job?.application_questions || [];

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
          applicantName: name.trim(),
          applicantEmail: email.trim(),
          applicantPhone: phone.trim(),
          answers: questions.map((q, i) => ({ question: q, answer: answers[i] || '' })),
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
          <Link href="/dashboard/applications" className="text-blue-600 font-medium hover:underline">
            View your applications
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
          <h1 className="text-xl font-semibold text-gray-900 mb-2">You&apos;ve already applied</h1>
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

  const canSubmit = name.trim() && email.trim() && questions.every((_, i) => (answers[i] || '').trim());

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

        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-gray-700">Your details <span className="text-gray-400 font-normal">(pulled from your profile — feel free to edit)</span></p>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1"><User size={13} /> Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1"><Mail size={13} /> Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1"><Phone size={13} /> Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover letter <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={7}
          placeholder="Tell the employer why you're a good fit for this role..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {questions.length > 0 && (
          <div className="space-y-4 mb-4">
            <p className="text-sm font-medium text-gray-700">Questions from the employer</p>
            {questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm text-gray-800 mb-1.5">{i + 1}. {q}</label>
                <textarea
                  value={answers[i] || ''}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || !canSubmit}
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: theme.colors.primary.DEFAULT }}
        >
          {submitting ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    </div>
  );
}


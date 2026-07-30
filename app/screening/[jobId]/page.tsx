"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface McqQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface WrittenQuestion {
  id: string;
  question_text: string;
}

const SPEED_SECONDS_PER_QUESTION = 20;

export default function ScreeningPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'standard' | 'speed'>('standard');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [mcq, setMcq] = useState<McqQuestion[]>([]);
  const [written, setWritten] = useState<WrittenQuestion[]>([]);

  const [existingAttempt, setExistingAttempt] = useState<any>(null);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(SPEED_SECONDS_PER_QUESTION);
  const startTimeRef = useRef<number>(0);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const allQuestions = [
    ...mcq.map((q) => ({ type: 'mcq' as const, q })),
    ...written.map((q) => ({ type: 'written' as const, q })),
  ];

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/auth?redirect=/screening/${jobId}`);
        return;
      }
      setUserId(session.user.id);

      const { data: attempt } = await supabase
        .from('screening_attempts')
        .select('id, passed, mcq_score, written_score')
        .eq('job_id', jobId)
        .eq('applicant_id', session.user.id)
        .maybeSingle();
      if (attempt) setExistingAttempt(attempt);

      const res = await fetch(`/api/screening/${jobId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'This job does not have a screening quiz.');
        setLoading(false);
        return;
      }
      setMode(data.mode);
      setDurationMinutes(data.durationMinutes);
      setMcq(data.mcq || []);
      setWritten(data.written || []);
      setSecondsLeft(data.durationMinutes * 60);
      setLoading(false);
    };
    init();
  }, [jobId, router]);

  // Overall countdown
  useEffect(() => {
    if (!started || result) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, result]);

  // Per-question countdown, only for 'speed' mode
  useEffect(() => {
    if (!started || result || mode !== 'speed') return;
    setQuestionSecondsLeft(SPEED_SECONDS_PER_QUESTION);
    const interval = setInterval(() => {
      setQuestionSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          goNext();
          return SPEED_SECONDS_PER_QUESTION;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, mode, currentIndex, result]);

  const startQuiz = () => {
    startTimeRef.current = Date.now();
    setStarted(true);
  };

  const goNext = () => {
    setCurrentIndex((i) => {
      if (i + 1 >= allQuestions.length) {
        handleSubmit();
        return i;
      }
      return i + 1;
    });
  };

  const handleSubmit = async () => {
    if (submitting || result || !userId) return;
    setSubmitting(true);
    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await fetch('/api/screening/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          userId,
          timeTakenSeconds,
          mcqAnswers,
          writtenAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit quiz');
        setSubmitting(false);
        return;
      }
      setResult(data);
    } catch (e) {
      setError('Something went wrong submitting your quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
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

  if (existingAttempt && !started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {existingAttempt.passed ? (
            <CheckCircle2 className="mx-auto mb-4" size={48} color="#16A34A" />
          ) : (
            <XCircle className="mx-auto mb-4" size={48} color="#DC2626" />
          )}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {existingAttempt.passed ? 'You already passed this quiz' : "You didn't pass last time"}
          </h1>
          <p className="text-gray-600 mb-6">
            MCQ score: {existingAttempt.mcq_score}%
            {existingAttempt.written_score !== null && existingAttempt.written_score !== undefined
              ? ` · Written: ${existingAttempt.written_score}%`
              : ''}
          </p>
          {existingAttempt.passed ? (
            <Link
              href={`/apply/${jobId}`}
              className="inline-block px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              Continue to application
            </Link>
          ) : (
            <button
              onClick={() => {
                setExistingAttempt(null);
                setCurrentIndex(0);
                setMcqAnswers({});
                setWrittenAnswers({});
              }}
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              Retake quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {result.passed ? (
            <CheckCircle2 className="mx-auto mb-4" size={48} color="#16A34A" />
          ) : (
            <XCircle className="mx-auto mb-4" size={48} color="#DC2626" />
          )}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {result.passed ? 'You passed!' : "You didn't quite pass"}
          </h1>
          <p className="text-gray-600 mb-2">
            MCQ score: {result.mcqScore}%
            {result.writtenScore !== null && result.writtenScore !== undefined
              ? ` · Written: ${result.writtenScore}%`
              : ''}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Overall: {result.overallScore}% (pass mark: {result.passMark}%)
          </p>
          {result.passed ? (
            <Link
              href={`/apply/${jobId}`}
              className="inline-block px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              Continue to application
            </Link>
          ) : (
            <Link href="/jobs" className="text-blue-600 font-medium hover:underline">
              Browse more jobs
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Screening quiz</h1>
          <p className="text-gray-600 mb-1">
            {mcq.length} multiple choice question{mcq.length !== 1 ? 's' : ''}
            {written.length > 0 ? ` + ${written.length} written question${written.length !== 1 ? 's' : ''}` : ''}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            You'll have {durationMinutes} minutes in total.
            {mode === 'speed' ? ` This is a speed round — about ${SPEED_SECONDS_PER_QUESTION}s per question.` : ''}
          </p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            Start quiz
          </button>
        </div>
      </div>
    );
  }

  const current = allQuestions[currentIndex];
  if (!current) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>
            Question {currentIndex + 1} of {allQuestions.length}
          </span>
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <Clock size={14} /> {formatTime(secondsLeft)}
            {mode === 'speed' && (
              <span className="ml-2 text-orange-600">({questionSecondsLeft}s)</span>
            )}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-900 font-medium mb-5">{current.q.question_text}</p>

          {current.type === 'mcq' ? (
            <div className="space-y-3">
              {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                const label = (current.q as McqQuestion)[`option_${opt}` as const];
                if (!label) return null;
                const selected = mcqAnswers[current.q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() =>
                      setMcqAnswers((prev) => ({ ...prev, [current.q.id]: opt }))
                    }
                    className={`w-full text-left border rounded-lg px-4 py-3 text-sm transition ${
                      selected
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={writtenAnswers[current.q.id] || ''}
              onChange={(e) =>
                setWrittenAnswers((prev) => ({ ...prev, [current.q.id]: e.target.value }))
              }
              rows={6}
              placeholder="Type your answer..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={goNext}
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-60"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              {currentIndex + 1 >= allQuestions.length
                ? submitting
                  ? 'Submitting...'
                  : 'Submit quiz'
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

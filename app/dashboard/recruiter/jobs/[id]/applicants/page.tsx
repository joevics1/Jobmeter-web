"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';

interface Applicant {
  id: string;
  applicantId: string;
  coverLetter: string | null;
  createdAt: string;
  applicant: { full_name: string; email: string; phone: string } | null;
  screening: {
    mcq_score: number;
    written_score: number | null;
    passed: boolean;
    time_taken_seconds: number;
  } | null;
}

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth?redirect=/dashboard/recruiter');
        return;
      }

      const res = await fetch(
        `/api/recruiter/applicants?jobId=${jobId}&userId=${session.user.id}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load applicants');
        setLoading(false);
        return;
      }
      setJobTitle(data.jobTitle);
      setApplicants(data.applicants);
      setLoading(false);
    };
    init();
  }, [jobId, router]);

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
          <ArrowLeft size={15} /> Back to your jobs
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Applicants — {jobTitle}
        </h1>

        {applicants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No applicants yet.
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
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
                </div>
                {a.coverLetter && (
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap border-t border-gray-100 pt-3">
                    {a.coverLetter}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  Applied {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

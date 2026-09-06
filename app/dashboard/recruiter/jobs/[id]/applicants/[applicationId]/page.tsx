"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Github,
  Linkedin,
} from 'lucide-react';

interface Detail {
  jobTitle: string;
  applicant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    roles: string[];
    skills: string[];
    experienceLevel: string;
    sector: string;
    workExperience: any[];
    education: any[];
    linkedin: string;
    github: string;
    portfolio: string;
  };
  application: {
    id: string;
    applicationMethod: string;
    createdAt: string;
    coverLetter: string | null;
    answers: { question: string; answer: string }[];
  };
  screening: {
    mcq_score: number;
    written_score: number | null;
    passed: boolean;
    time_taken_seconds: number;
  } | null;
}

export default function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const applicationId = params.applicationId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth?redirect=/dashboard/recruiter');
        return;
      }
      const res = await fetch(`/api/recruiter/applicants/${applicationId}?userId=${session.user.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load applicant');
        setLoading(false);
        return;
      }
      setDetail(data);
      setLoading(false);
    };
    init();
  }, [applicationId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} color={theme.colors.primary.DEFAULT} />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-gray-600">{error || 'Applicant not found'}</p>
      </div>
    );
  }

  const { applicant, application, screening, jobTitle } = detail;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/recruiter/jobs/${jobId}/applicants`}
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:underline"
        >
          <ArrowLeft size={15} /> Back to applicants
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{applicant.name}</h1>
              <p className="text-sm text-gray-500">Applied for {jobTitle}</p>
            </div>
            {screening && (
              <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                {screening.passed ? (
                  <CheckCircle2 size={14} color="#16A34A" />
                ) : (
                  <XCircle size={14} color="#DC2626" />
                )}
                <span className={screening.passed ? 'text-green-700' : 'text-red-600'}>
                  {screening.mcq_score}%
                  {screening.written_score !== null && screening.written_score !== undefined
                    ? ` MCQ / ${screening.written_score}% written`
                    : ' MCQ'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-600">
            {applicant.email && (
              <a href={`mailto:${applicant.email}`} className="flex items-center gap-1.5 hover:underline">
                <Mail size={14} /> {applicant.email}
              </a>
            )}
            {applicant.phone && (
              <a href={`tel:${applicant.phone}`} className="flex items-center gap-1.5 hover:underline">
                <Phone size={14} /> {applicant.phone}
              </a>
            )}
            {applicant.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {applicant.location}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            {applicant.linkedin && (
              <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {applicant.github && (
              <a href={applicant.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <Github size={14} /> GitHub
              </a>
            )}
            {applicant.portfolio && (
              <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <LinkIcon size={14} /> Portfolio
              </a>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Applied {new Date(application.createdAt).toLocaleDateString()} via{' '}
            {application.applicationMethod === 'in_app' ? 'JobMeter' : application.applicationMethod}
          </p>
        </div>

        {applicant.summary && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Summary</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{applicant.summary}</p>
          </div>
        )}

        {(applicant.roles?.length > 0 || applicant.skills?.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            {applicant.roles?.length > 0 && (
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5"><Briefcase size={14} /> Roles</h2>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.roles.map((r, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {applicant.skills?.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1.5">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.skills.map((s, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {applicant.education?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5"><GraduationCap size={14} /> Education</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {applicant.education.map((ed: any, i: number) => (
                <p key={i}>{typeof ed === 'string' ? ed : JSON.stringify(ed)}</p>
              ))}
            </div>
          </div>
        )}

        {application.coverLetter && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Cover letter</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
          </div>
        )}

        {application.answers?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Application questions</h2>
            <div className="space-y-4">
              {application.answers.map((a, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-gray-800">{i + 1}. {a.question}</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.answer || <span className="text-gray-400 italic">No answer</span>}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

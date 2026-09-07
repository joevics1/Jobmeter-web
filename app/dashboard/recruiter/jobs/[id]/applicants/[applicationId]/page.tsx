"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import type { CVData } from '@/lib/cv-template-pages/cv-data-types';
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
  FolderGit2,
  Award,
  BadgeCheck,
  Languages,
  Heart,
  BookOpen,
  HandHeart,
  FileText,
} from 'lucide-react';

interface Detail {
  jobTitle: string;
  applicant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    experienceLevel: string;
    sector: string;
    cv: CVData | null;
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

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
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
  const cv = applicant.cv;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/recruiter/jobs/${jobId}/applicants`}
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:underline"
        >
          <ArrowLeft size={15} /> Back to applicants
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{applicant.name}</h1>
              <p className="text-sm text-gray-500">
                {cv?.personalDetails.title ? `${cv.personalDetails.title} · ` : ''}Applied for {jobTitle}
              </p>
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
            {cv?.personalDetails.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {cv.personalDetails.location}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            {cv?.personalDetails.linkedin && (
              <a href={cv.personalDetails.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {cv?.personalDetails.github && (
              <a href={cv.personalDetails.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <Github size={14} /> GitHub
              </a>
            )}
            {cv?.personalDetails.portfolio && (
              <a href={cv.personalDetails.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <LinkIcon size={14} /> Portfolio
              </a>
            )}
          </div>

          {(applicant.experienceLevel || applicant.sector) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {applicant.experienceLevel && (
                <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">{applicant.experienceLevel}</span>
              )}
              {applicant.sector && (
                <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">{applicant.sector}</span>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Applied {new Date(application.createdAt).toLocaleDateString()} via{' '}
            {application.applicationMethod === 'in_app' ? 'JobMeter' : application.applicationMethod}
          </p>
        </div>

        {!cv && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-4 mb-4">
            This candidate hasn&apos;t completed their CV profile yet — only their submitted application details are shown below.
          </div>
        )}

        {cv?.summary && (
          <Section icon={<FileText size={14} />} title="Summary">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{cv.summary}</p>
          </Section>
        )}

        {((cv?.roles?.length ?? 0) > 0 || (cv?.skills?.length ?? 0) > 0) && (
          <Section icon={<Briefcase size={14} />} title="Roles & Skills">
            {(cv?.roles?.length ?? 0) > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {cv!.roles!.map((r, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {(cv?.skills?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {cv!.skills.map((s, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {(cv?.experience?.length ?? 0) > 0 && (
          <Section icon={<Briefcase size={14} />} title="Work Experience">
            <div className="space-y-4">
              {cv!.experience!.map((exp, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-gray-900">{exp.role}{exp.company ? ` — ${exp.company}` : ''}</p>
                  {exp.years && <p className="text-xs text-gray-400">{exp.years}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-0.5">
                      {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {(cv?.education?.length ?? 0) > 0 && (
          <Section icon={<GraduationCap size={14} />} title="Education">
            <div className="space-y-2">
              {cv!.education!.map((ed, i) => (
                <div key={i} className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{ed.degree}</p>
                  <p>{ed.institution}{ed.years ? ` · ${ed.years}` : ''}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(cv?.projects?.length ?? 0) > 0 && (
          <Section icon={<FolderGit2 size={14} />} title="Projects">
            <div className="space-y-2">
              {cv!.projects!.map((p, i) => (
                <div key={i} className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  {p.description && <p>{p.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {(cv?.certifications?.length ?? 0) > 0 && (
          <Section icon={<BadgeCheck size={14} />} title="Certifications">
            <div className="flex flex-wrap gap-1.5">
              {cv!.certifications!.map((c, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">
                  {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(cv?.awards?.length ?? 0) > 0 && (
          <Section icon={<Award size={14} />} title="Awards">
            <div className="flex flex-wrap gap-1.5">
              {cv!.awards!.map((a, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">
                  {a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.year ? ` (${a.year})` : ''}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(cv?.accomplishments?.length ?? 0) > 0 && (
          <Section icon={<Award size={14} />} title="Accomplishments">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
              {cv!.accomplishments!.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </Section>
        )}

        {(cv?.publications?.length ?? 0) > 0 && (
          <Section icon={<BookOpen size={14} />} title="Publications">
            <div className="space-y-1.5 text-sm text-gray-600">
              {cv!.publications!.map((p, i) => (
                <p key={i}>{p.title}{p.journal ? ` — ${p.journal}` : ''}{p.year ? ` (${p.year})` : ''}</p>
              ))}
            </div>
          </Section>
        )}

        {(cv?.volunteerWork?.length ?? 0) > 0 && (
          <Section icon={<HandHeart size={14} />} title="Volunteer Work">
            <div className="space-y-2 text-sm text-gray-600">
              {cv!.volunteerWork!.map((v, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-900">{v.organization}{v.role ? ` — ${v.role}` : ''}</p>
                  {v.duration && <p className="text-xs text-gray-400">{v.duration}</p>}
                  {v.description && <p>{v.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {((cv?.languages?.length ?? 0) > 0 || (cv?.interests?.length ?? 0) > 0) && (
          <Section icon={<Languages size={14} />} title="Languages & Interests">
            {(cv?.languages?.length ?? 0) > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 mb-1">Languages</p>
                <p className="text-sm text-gray-600">{cv!.languages!.join(', ')}</p>
              </div>
            )}
            {(cv?.interests?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Heart size={12} /> Interests</p>
                <p className="text-sm text-gray-600">{cv!.interests!.join(', ')}</p>
              </div>
            )}
          </Section>
        )}

        {(cv?.additionalSections?.length ?? 0) > 0 && cv!.additionalSections!.map((s, i) => (
          <Section key={i} icon={<FileText size={14} />} title={s.sectionName}>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{s.content}</p>
          </Section>
        ))}

        {application.coverLetter && (
          <Section icon={<FileText size={14} />} title="Cover Letter">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
          </Section>
        )}

        {application.answers?.length > 0 && (
          <Section icon={<FileText size={14} />} title="Application Questions">
            <div className="space-y-4">
              {application.answers.map((a, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-gray-800">{i + 1}. {a.question}</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.answer || <span className="text-gray-400 italic">No answer</span>}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}


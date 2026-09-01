"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Loader2, Users, Plus, Pencil, Star, XCircle } from 'lucide-react';
import FeatureJobModal from '@/components/jobs/FeatureJobModal';

interface RecruiterJob {
  submissionId: string;
  jobId: string | null;
  jobStatus: string | null;
  title: string;
  statusLabel: string;
  statusColor: string;
  rejectionReason: string | null;
  applyInApp: boolean;
  screeningEnabled: boolean;
  applicantCount: number;
  createdAt: string;
  canEdit: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [closingJobId, setClosingJobId] = useState<string | null>(null);
  const [featureModalJob, setFeatureModalJob] = useState<{ id: string; title: string } | null>(null);

  const loadJobs = async (uid: string) => {
    const res = await fetch(`/api/recruiter/my-jobs?userId=${uid}`);
    const data = await res.json();
    if (res.ok) setJobs(data.jobs || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth?redirect=/dashboard/recruiter');
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');
      await loadJobs(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleCloseJob = async (jobId: string) => {
    if (!confirm('Close this job? It will stop appearing on /jobs and will free up a slot in your job limit. This cannot be undone.')) {
      return;
    }
    setClosingJobId(jobId);
    try {
      const res = await fetch('/api/jobs/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId }),
      });
      if (res.ok) {
        await loadJobs(userId);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to close job');
      }
    } finally {
      setClosingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} color={theme.colors.primary.DEFAULT} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Your jobs</h1>
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            <Plus size={16} /> Post a job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            You haven&apos;t posted any jobs yet.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.submissionId}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-gray-900">{job.title}</h2>
                    <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${job.statusColor}15`, color: job.statusColor }}
                      >
                        {job.statusLabel}
                      </span>
                      {job.isFeatured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      )}
                      <span className="text-gray-500">
                        {job.applyInApp
                          ? (job.screeningEnabled ? 'In-app + quiz' : 'In-app apply')
                          : 'External application'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Link
                      href={`/dashboard/recruiter/edit/${job.submissionId}`}
                      className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                    {job.jobId && (
                      <Link
                        href={`/dashboard/recruiter/jobs/${job.jobId}/applicants`}
                        className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <Users size={15} />
                        {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                      </Link>
                    )}
                    {job.jobId && job.jobStatus === 'active' && !job.isFeatured && (
                      <button
                        onClick={() => setFeatureModalJob({ id: job.jobId!, title: job.title })}
                        className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        <Star size={14} /> Feature
                      </button>
                    )}
                    {job.jobId && job.jobStatus === 'active' && (
                      <button
                        onClick={() => handleCloseJob(job.jobId!)}
                        disabled={closingJobId === job.jobId}
                        className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-60"
                      >
                        {closingJobId === job.jobId ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                        Close
                      </button>
                    )}
                  </div>
                </div>
                {job.statusLabel === 'Rejected' && job.rejectionReason && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 rounded-lg px-3 py-2">
                    {job.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {featureModalJob && (
        <FeatureJobModal
          isOpen={!!featureModalJob}
          onClose={() => setFeatureModalJob(null)}
          email={userEmail}
          jobId={featureModalJob.id}
          jobTitle={featureModalJob.title}
        />
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { getCountrySlug } from '@/lib/countrySlugMap';
import { Loader2, Mail, Phone, ExternalLink, FileCheck, ArrowLeft } from 'lucide-react';

interface Application {
  id: string;
  appliedAt: string;
  method: 'in_app' | 'email' | 'phone' | 'link';
  hasCoverLetter: boolean;
  job: {
    id: string;
    title: string;
    company: string | null;
    slug: string;
    country: string[] | null;
    status: string;
  } | null;
}

function buildJobUrl(slug: string, country?: string[] | null): string {
  const first = (country || []).find((c) => c.toLowerCase() !== 'global');
  if (!first) return `/jobs/${slug}`;
  return `/jobs/${getCountrySlug(first)}/${slug}`;
}

const METHOD_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  in_app: { label: 'In-app', icon: FileCheck },
  email: { label: 'Email', icon: Mail },
  phone: { label: 'WhatsApp', icon: Phone },
  link: { label: 'External site', icon: ExternalLink },
};

export default function MyApplicationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth?redirect=/dashboard/applications'); return; }
      const res = await fetch(`/api/applications/mine?userId=${session.user.id}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setLoading(false);
    };
    init();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#EEF1F7' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-gray-200/50">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
            You haven&apos;t applied to any jobs yet.{' '}
            <Link href="/jobs" className="font-medium underline" style={{ color: theme.colors.primary.DEFAULT }}>
              Browse jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const methodInfo = METHOD_LABELS[app.method] || METHOD_LABELS.link;
              const MethodIcon = methodInfo.icon;
              const jobIsLive = app.job?.status === 'active';
              return (
                <div key={app.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {app.job ? (
                      <Link href={buildJobUrl(app.job.slug, app.job.country)} className="font-medium text-gray-900 hover:underline truncate block">
                        {app.job.title}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-400">Job no longer available</span>
                    )}
                    <div className="text-sm text-gray-500 truncate">
                      {app.job?.company || 'Confidential Employer'}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span>{new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {app.job && !jobIsLive && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Job closed</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600">
                    <MethodIcon size={13} />
                    {methodInfo.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

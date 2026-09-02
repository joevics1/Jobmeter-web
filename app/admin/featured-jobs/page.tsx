"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Star, Loader2, Search, X } from 'lucide-react';

interface FeaturedJob {
  id: string;
  title: string;
  company: string | null;
  status: string;
  is_featured: boolean;
  featured_at: string;
  featured_until: string;
  currentlyFeatured: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  company: string | null;
  is_featured: boolean;
}

export default function AdminFeaturedJobsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [jobs, setJobs] = useState<FeaturedJob[]>([]);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [featuringId, setFeaturingId] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const loadJobs = async (uid: string) => {
    const res = await fetch(`/api/admin/featured-jobs?userId=${uid}`);
    if (res.status === 403) { setForbidden(true); return; }
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth?redirect=/admin/featured-jobs'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'admin') { setForbidden(true); setLoading(false); return; }
      setUserId(session.user.id);
      await loadJobs(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`/api/admin/jobs/search?userId=${userId}&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.jobs || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, userId]);

  const handleFeature = async (jobId: string) => {
    setFeaturingId(jobId);
    try {
      const res = await fetch('/api/admin/featured-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId, days }),
      });
      if (res.ok) {
        setQuery('');
        setResults([]);
        await loadJobs(userId);
      }
    } finally {
      setFeaturingId(null);
    }
  };

  const handleRevoke = async (jobId: string) => {
    if (!confirm('Revoke featured placement for this job now?')) return;
    setRevokingId(jobId);
    try {
      const res = await fetch(`/api/admin/featured-jobs?userId=${userId}&jobId=${jobId}`, { method: 'DELETE' });
      if (res.ok) await loadJobs(userId);
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-gray-500">You don&apos;t have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#EEF1F7' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Star size={22} className="text-amber-500" fill="currentColor" />
          <h1 className="text-2xl font-bold text-gray-900">Featured Jobs</h1>
        </div>

        {/* Manually feature a job */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Manually feature a job</h2>
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50/70 focus:bg-white transition-colors"
              />
            </div>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-20 px-2 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50/70"
              title="Days"
            />
          </div>
          {searching && <p className="text-xs text-gray-400">Searching...</p>}
          {results.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {results.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{r.title}</span>
                    {r.company && <span className="text-gray-500"> · {r.company}</span>}
                    {r.is_featured && <span className="ml-2 text-xs text-amber-600">already featured</span>}
                  </div>
                  <button
                    onClick={() => handleFeature(r.id)}
                    disabled={featuringId === r.id}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg text-white disabled:opacity-60"
                    style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                  >
                    {featuringId === r.id ? '...' : `Feature for ${days}d`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Current + recent featured jobs */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Featured (last 30 days)</h2>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">No featured jobs in the last 30 days.</p>
          ) : (
            <div className="space-y-2">
              {jobs.map((j) => (
                <div key={j.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{j.title}</div>
                    <div className="text-xs text-gray-500">
                      {j.company || 'Confidential'} · {j.currentlyFeatured ? (
                        <span className="text-green-600 font-medium">Live until {new Date(j.featured_until).toLocaleDateString()}</span>
                      ) : (
                        <span>Expired {new Date(j.featured_until).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  {j.currentlyFeatured && (
                    <button
                      onClick={() => handleRevoke(j.id)}
                      disabled={revokingId === j.id}
                      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <X size={12} /> Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

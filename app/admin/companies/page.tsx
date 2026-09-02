"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, ShieldCheck, ShieldX, ExternalLink } from 'lucide-react';

interface UnverifiedCompany {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  email: string | null;
  user_id: string;
  posterEmail: string | null;
  jobCount: number;
  created_at: string;
}

function domainsLikelyMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const norm = (v: string) => v.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('@').pop()?.toLowerCase();
  return norm(a) === norm(b);
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [companies, setCompanies] = useState<UnverifiedCompany[]>([]);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadCompanies = async (uid: string) => {
    const res = await fetch(`/api/admin/companies?userId=${uid}`);
    if (res.status === 403) { setForbidden(true); return; }
    const data = await res.json();
    setCompanies(data.companies || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth?redirect=/admin/companies'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'admin') { setForbidden(true); setLoading(false); return; }
      setUserId(session.user.id);
      await loadCompanies(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleAction = async (companyId: string, action: 'verify' | 'reject') => {
    setActingId(companyId);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, companyId, action }),
      });
      if (res.ok) setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } finally {
      setActingId(null);
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
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Unverified Companies</h1>
        <p className="text-sm text-gray-500 -mt-2">
          Auto-verification only happens when the poster&apos;s email domain matches the company&apos;s
          website/email domain. Anything below didn&apos;t match — check for yourself before verifying.
        </p>

        {companies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
            Nothing pending review.
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map((c) => {
              const domainMatch = domainsLikelyMatch(c.posterEmail, c.website_url || c.email);
              return (
                <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{c.name}</span>
                        {c.website_url && (
                          <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {domainMatch && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">domain looks close — double check</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        <div>Posted by: {c.posterEmail || 'unknown'}</div>
                        <div>Company contact: {c.email || c.website_url || '—'}</div>
                        <div>{c.jobCount} job{c.jobCount !== 1 ? 's' : ''} posted · {new Date(c.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAction(c.id, 'verify')}
                        disabled={actingId === c.id}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-60"
                      >
                        <ShieldCheck size={13} /> Verify
                      </button>
                      <button
                        onClick={() => handleAction(c.id, 'reject')}
                        disabled={actingId === c.id}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        <ShieldX size={13} /> Unpublish
                      </button>
                    </div>
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

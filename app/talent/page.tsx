'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, Lock, X, Loader2, Users, Sparkles,
  Mail, Phone, Briefcase, GraduationCap, Send, CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';

interface Candidate {
  id: string;
  name: string;
  roles: string[];
  skills: string[];
  location: string;
  summary: string;
  sector: string;
  experienceLevel: string;
  category: 'intern' | 'available';
  lastUpdated: string;
}

interface CandidateDetail extends Candidate {
  email: string;
  phone: string;
  workExperience: any[];
  education: any[];
  linkedin: string;
  github: string;
  portfolio: string;
}

interface RecruiterJob {
  jobId: string | null;
  title: string;
  statusLabel: string;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || 'JM';
}

export default function TalentPoolPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [category, setCategory] = useState<'all' | 'intern'>('all');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [viewsUsedToday, setViewsUsedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);

  const [selected, setSelected] = useState<CandidateDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const [recruiterJobs, setRecruiterJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [invitingLoading, setInvitingLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setAuthChecked(true); return; }
      setToken(session.access_token);

      const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).single();
      if (profile?.user_type === 'recruiter') {
        setIsRecruiter(true);
        setAuthChecked(true);
        return;
      }

      // profiles.user_type can be missing or stale even for a genuine
      // recruiter — it's only set at signup, and that write can silently
      // fail, or the account may have posted jobs (which never checks
      // user_type at all) without ever going through the recruiter signup
      // flow that sets it. A companies row is a much harder signal to end
      // up with by accident, so fall back to checking that.
      const { data: companies } = await supabase.from('companies').select('id').eq('user_id', session.user.id).limit(1);
      if (companies && companies.length > 0) {
        setIsRecruiter(true);
        supabase.from('profiles').update({ user_type: 'recruiter' }).eq('id', session.user.id).then(() => {});
      }
      setAuthChecked(true);
    })();
  }, []);

  const loadCandidates = useCallback(async (pageToLoad: number, append: boolean) => {
    if (!token) return;
    if (append) setIsLoadingMore(true); else setIsLoading(true);
    try {
      const params = new URLSearchParams({ category, keyword, location, page: String(pageToLoad) });
      const res = await fetch(`/api/talent?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCandidates((prev: Candidate[]) => (append ? [...prev, ...(data.candidates || [])] : (data.candidates || [])));
        setTotal(data.total || 0);
        setPageSize(data.pageSize || 20);
        setPage(pageToLoad);
        setIsUnlimited(!!data.isUnlimited);
        setViewsUsedToday(data.viewsUsedToday || 0);
        setDailyLimit(data.dailyViewLimit || 5);
      }
    } finally {
      if (append) setIsLoadingMore(false); else setIsLoading(false);
    }
  }, [token, category, keyword, location]);

  // Any filter change (or auth becoming ready) starts back at page 1 and
  // replaces the list rather than appending to it.
  useEffect(() => { loadCandidates(1, false); }, [token, category, keyword, location]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (isLoading || isLoadingMore) return;
    loadCandidates(page + 1, true);
  };

  const hasMore = candidates.length < total;

  const openCandidate = async (id: string) => {
    if (!token) return;
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/talent/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.status === 402) {
        setShowUpgrade(true);
        return;
      }
      if (res.ok) {
        setSelected(data.candidate);
        // Refresh the views-used banner without resetting/truncating the
        // already-loaded candidate list back to page 1.
        try {
          const params = new URLSearchParams({ category, keyword, location, page: '1' });
          const r = await fetch(`/api/talent?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
          const d = await r.json();
          if (r.ok) {
            setIsUnlimited(!!d.isUnlimited);
            setViewsUsedToday(d.viewsUsedToday || 0);
            setDailyLimit(d.dailyViewLimit || 5);
          }
        } catch {}
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const startUpgrade = async (planType: 'basic_monthly' | 'unlimited_monthly') => {
    if (!token) return;
    setUpgrading(true);
    try {
      const res = await fetch('/api/talent/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (data.authorizationUrl) window.location.href = data.authorizationUrl;
      else setUpgrading(false);
    } catch {
      setUpgrading(false);
    }
  };

  const openInvite = async (candidate: CandidateDetail) => {
    setShowInvite(true);
    setInviteSent(false);
    setSelectedJobId('');
    setInviteMessage('');
    if (!token) return;
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/recruiter/my-jobs?userId=${session?.user.id}`);
    const data = await res.json();
    setRecruiterJobs((data.jobs || []).filter((j: any) => j.jobId && j.statusLabel === 'Live'));
  };

  const sendInvite = async () => {
    if (!token || !selected || !selectedJobId) return;
    setInvitingLoading(true);
    try {
      const res = await fetch('/api/talent/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ candidateId: selected.id, jobId: selectedJobId, message: inviteMessage }),
      });
      if (res.ok) setInviteSent(true);
    } finally {
      setInvitingLoading(false);
    }
  };

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" style={{ color: theme.colors.primary.DEFAULT }} /></div>;
  }

  if (!token || !isRecruiter) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: theme.colors.primary.DEFAULT + '15' }}>
            <Users className="h-7 w-7" style={{ color: theme.colors.primary.DEFAULT }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>Talent Pool is for recruiters</h1>
          <p className="text-sm mb-6" style={{ color: theme.colors.text.secondary }}>
            {token
              ? "Your account isn't set up as a recruiter. Sign in with a recruiter account to browse candidates."
              : 'Sign in as a recruiter to search candidates who are open to work.'}
          </p>
          <p className="text-xs" style={{ color: theme.colors.text.muted }}>
            Looking to get discovered instead? Turn on "Join the Talent Pool" from your{' '}
            <Link href="/edit" className="underline" style={{ color: theme.colors.primary.DEFAULT }}>profile</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>Talent Pool</h1>
          <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
            Candidates who've opted in to be discovered. Updated every Monday morning with new signups.
            {total > 0 && <span className="ml-1 font-medium">{total} candidates match.</span>}
          </p>
        </div>

        {/* Usage banner */}
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ backgroundColor: isUnlimited ? theme.colors.success + '10' : theme.colors.primary.DEFAULT + '10', border: `1px solid ${isUnlimited ? theme.colors.success + '40' : theme.colors.primary.DEFAULT + '30'}` }}
        >
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: isUnlimited ? theme.colors.success : theme.colors.primary.DEFAULT }}>
            {isUnlimited ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {isUnlimited
              ? 'Unlimited access active — view any profile'
              : `${viewsUsedToday} of ${dailyLimit} free profile views used today`}
          </div>
          {!isUnlimited && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              Upgrade
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'intern'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={category === c
                ? { backgroundColor: theme.colors.primary.DEFAULT, color: '#fff' }
                : { backgroundColor: '#fff', color: theme.colors.text.secondary, border: `1px solid ${theme.colors.border.DEFAULT}` }}
            >
              {c === 'all' ? 'All' : 'Intern'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by role, skill, or name"
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: theme.colors.border.DEFAULT }}
            />
          </div>
          <div className="relative flex-1 min-w-[160px]">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: theme.colors.border.DEFAULT }}
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 h-40 animate-pulse border" style={{ borderColor: theme.colors.border.DEFAULT }} />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border" style={{ borderColor: theme.colors.border.DEFAULT }}>
            <Users className="h-8 w-8 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-500">No candidates match right now — try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => openCandidate(c.id)}
                className="text-left bg-white rounded-xl p-4 border hover:shadow-md transition-shadow"
                style={{ borderColor: theme.colors.border.DEFAULT }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm" style={{ backgroundColor: theme.colors.primary.DEFAULT + '15', color: theme.colors.primary.DEFAULT }}>
                    {getInitials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: theme.colors.text.primary }}>{c.name}</p>
                    {c.location && <p className="text-xs flex items-center gap-1 text-gray-500"><MapPin className="h-3 w-3" />{c.location}</p>}
                  </div>
                </div>
                {c.roles.length > 0 && (
                  <p className="text-xs font-medium mb-2" style={{ color: theme.colors.primary.DEFAULT }}>{c.roles.slice(0, 2).join(' • ')}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="flex justify-center pt-2">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-5 py-2 rounded-lg text-sm font-medium border disabled:opacity-60 flex items-center gap-2"
              style={{ borderColor: theme.colors.border.DEFAULT, color: theme.colors.text.secondary }}
            >
              {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoadingMore ? 'Loading…' : `Load more (${candidates.length} of ${total})`}
            </button>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {(detailLoading || selected) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => !detailLoading && setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color: theme.colors.primary.DEFAULT }} /></div>
            ) : selected && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: theme.colors.primary.DEFAULT + '15', color: theme.colors.primary.DEFAULT }}>
                      {getInitials(selected.name)}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: theme.colors.text.primary }}>{selected.name}</h2>
                      {selected.location && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{selected.location}</p>}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-gray-400" /></button>
                </div>

                <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                  {selected.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{selected.email}</span>}
                  {selected.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{selected.phone}</span>}
                </div>

                {selected.summary && <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>{selected.summary}</p>}

                {selected.roles.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Target roles</p>
                    <p className="text-sm">{selected.roles.join(', ')}</p>
                  </div>
                )}

                {selected.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.skills.map((s) => <span key={s} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{s}</span>)}
                    </div>
                  </div>
                )}

                {selected.workExperience?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1.5 flex items-center gap-1"><Briefcase className="h-3 w-3" />Experience</p>
                    {selected.workExperience.slice(0, 3).map((exp: any, i: number) => (
                      <p key={i} className="text-sm mb-1">{exp.title || exp.role} — {exp.company}</p>
                    ))}
                  </div>
                )}

                {selected.education?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1.5 flex items-center gap-1"><GraduationCap className="h-3 w-3" />Education</p>
                    {selected.education.slice(0, 2).map((edu: any, i: number) => (
                      <p key={i} className="text-sm mb-1">{edu.degree} — {edu.institution}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => openInvite(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium text-sm"
                  style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                >
                  <Send className="h-4 w-4" />
                  Invite to apply
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUpgrade(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: theme.colors.primary.DEFAULT + '15' }}>
              <Lock className="h-6 w-6" style={{ color: theme.colors.primary.DEFAULT }} />
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: theme.colors.text.primary }}>You've hit today's free limit</h3>
            <p className="text-sm text-gray-500 mb-5">
              Free access includes {dailyLimit} full profile views a day. Any paid job-posting plan
              gives you unlimited views, all month.
            </p>
            <button
              onClick={() => startUpgrade('basic_monthly')}
              disabled={upgrading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm mb-2 disabled:opacity-60"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              {upgrading ? 'Redirecting to Paystack…' : 'Basic plan — ₦5,000/month'}
            </button>
            <button
              onClick={() => startUpgrade('unlimited_monthly')}
              disabled={upgrading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm mb-2 border disabled:opacity-60"
              style={{ borderColor: theme.colors.primary.DEFAULT, color: theme.colors.primary.DEFAULT }}
            >
              {upgrading ? 'Redirecting to Paystack…' : 'Unlimited plan — ₦20,000/month'}
            </button>
            <button onClick={() => setShowUpgrade(false)} className="text-sm text-gray-500">Maybe later</button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            {inviteSent ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" style={{ color: theme.colors.success }} />
                <p className="font-semibold" style={{ color: theme.colors.text.primary }}>Invite sent</p>
                <p className="text-sm text-gray-500 mt-1">{selected.name} will see this on their invitations.</p>
                <button onClick={() => setShowInvite(false)} className="mt-4 text-sm font-medium" style={{ color: theme.colors.primary.DEFAULT }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold mb-3" style={{ color: theme.colors.text.primary }}>Invite {selected.name} to apply</h3>
                {recruiterJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">You don't have any live in-app jobs to invite candidates to yet.</p>
                ) : (
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
                    style={{ borderColor: theme.colors.border.DEFAULT }}
                  >
                    <option value="">Select a job…</option>
                    {recruiterJobs.map((j) => <option key={j.jobId} value={j.jobId!}>{j.title}</option>)}
                  </select>
                )}
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a short personal note (optional)"
                  className="w-full px-3 py-2 rounded-lg border text-sm mb-4 resize-none"
                  rows={3}
                  style={{ borderColor: theme.colors.border.DEFAULT }}
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowInvite(false)} className="flex-1 py-2 rounded-lg text-sm border" style={{ borderColor: theme.colors.border.DEFAULT }}>Cancel</button>
                  <button
                    onClick={sendInvite}
                    disabled={!selectedJobId || invitingLoading}
                    className="flex-1 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-50"
                    style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                  >
                    {invitingLoading ? 'Sending…' : 'Send invite'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

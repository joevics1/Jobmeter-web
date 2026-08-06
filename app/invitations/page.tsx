'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Mail, CheckCircle2, XCircle, ExternalLink, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import BackButton from '@/app/cv-templates/_components/back-button';

interface Invitation {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string | null;
  createdAt: string;
  job: { id: string; title: string; companyName: string; shortCode: string; isLive: boolean } | null;
}

export default function InvitationsPage() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setToken(session.access_token);
      const res = await fetch('/api/invitations', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await res.json();
      if (res.ok) setInvitations(data.invitations || []);
      setLoading(false);
    })();
  }, []);

  const respond = async (id: string, status: 'accepted' | 'declined') => {
    if (!token) return;
    setRespondingId(id);
    try {
      const res = await fetch(`/api/invitations/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInvitations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
      }
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <>
      <BackButton title="Invitations" href="/settings" />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color: theme.colors.primary.DEFAULT }} /></div>
        ) : !token ? (
          <p className="text-sm text-gray-500 text-center py-12">Sign in to see your invitations.</p>
        ) : invitations.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 mb-1">No invitations yet</p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Recruiters browsing the Talent Pool can invite you to apply directly. Make sure "Join the Talent Pool" is turned on in your{' '}
              <Link href="/edit" className="underline" style={{ color: theme.colors.primary.DEFAULT }}>profile</Link>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="bg-white rounded-xl border p-4" style={{ borderColor: theme.colors.border.DEFAULT }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.colors.text.primary }}>
                      {inv.job?.title || 'A job at JobMeter'}
                    </p>
                    {inv.job?.companyName && <p className="text-xs text-gray-500">{inv.job.companyName}</p>}
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                    style={
                      inv.status === 'accepted' ? { backgroundColor: theme.colors.success + '15', color: theme.colors.success }
                      : inv.status === 'declined' ? { backgroundColor: '#FEE2E2', color: '#DC2626' }
                      : { backgroundColor: theme.colors.primary.DEFAULT + '15', color: theme.colors.primary.DEFAULT }
                    }
                  >
                    {inv.status === 'pending' ? 'New invite' : inv.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>

                {inv.message && (
                  <p className="text-sm text-gray-600 mt-2 flex items-start gap-1.5">
                    <Mail className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                    {inv.message}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-3">
                  {inv.job?.shortCode && (
                    <a
                      href={`/s/${inv.job.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: theme.colors.border.DEFAULT, color: theme.colors.text.secondary }}
                    >
                      View job <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {inv.status === 'pending' && (
                    <>
                      <button
                        onClick={() => respond(inv.id, 'accepted')}
                        disabled={respondingId === inv.id}
                        className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                        style={{ backgroundColor: theme.colors.success }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => respond(inv.id, 'declined')}
                        disabled={respondingId === inv.id}
                        className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border text-red-600 disabled:opacity-50"
                        style={{ borderColor: '#FEE2E2' }}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

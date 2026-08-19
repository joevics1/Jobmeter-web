'use client';

// app/cover-letter-templates/history/page.tsx
// Dedicated history page, local-only (never sent to the server) — same
// pattern as app/cv-templates/history/page.tsx. Isolated: only reads
// lib/cover-letter-template-pages/cover-letter-history.ts.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, Trash2, ShieldAlert } from 'lucide-react';
import { getHistory, deleteFromHistory, clearHistory, CoverLetterHistoryEntry } from '@/lib/cover-letter-template-pages/cover-letter-history';
import BackButton from '../_components/back-button';

export default function CoverLetterHistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<CoverLetterHistoryEntry[] | null>(null);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  function openEntry(entry: CoverLetterHistoryEntry) {
    router.push(`/cover-letter-templates/build?role=${entry.roleSlug}&start=history&historyId=${entry.id}`);
  }

  return (
    <>
      <BackButton title="Cover Letter History" href="/cover-letter-templates" />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted border border-border rounded-lg px-3 py-2 mb-4">
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>Saved only on this device/browser — never sent to our servers. Clear it before using a shared or public computer.</span>
        </div>

        {entries === null ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <History className="mx-auto mb-2" size={28} />
            <p>No saved cover letters yet on this device.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 border border-border rounded-lg px-3 py-2.5 hover:border-foreground/40 transition-colors">
                  <button onClick={() => openEntry(entry)} className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{entry.roleLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </button>
                  <button
                    onClick={() => setEntries(deleteFromHistory(entry.id))}
                    className="text-muted-foreground hover:text-red-500 p-1.5 transition-colors shrink-0"
                    aria-label="Delete this saved cover letter"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => { clearHistory(); setEntries([]); }}
              className="text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors"
            >
              Clear all saved cover letters
            </button>
          </>
        )}
      </main>
    </>
  );
}

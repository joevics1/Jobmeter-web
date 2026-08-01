'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, Trash2, ShieldAlert } from 'lucide-react';
import { DocumentHistoryEntry, getHistory, deleteFromHistory, clearHistory } from '@/lib/document-history';

interface DocumentHistoryListProps {
  onOpen: (entry: DocumentHistoryEntry) => void;
  filterSource?: 'ai' | 'template';
}

export default function DocumentHistoryList({ onOpen, filterSource }: DocumentHistoryListProps) {
  const [entries, setEntries] = useState<DocumentHistoryEntry[] | null>(null);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  if (!entries || entries.length === 0) return null;

  const visible = filterSource ? entries.filter(e => e.source === filterSource) : entries;
  if (visible.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 no-print">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Your saved documents</h2>
        </div>
        <Link href="/documents/my-documents" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0">
          View all →
        </Link>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background border border-border rounded-lg px-3 py-2">
        <ShieldAlert className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
        <span>Saved only on this device/browser — never sent to our servers. Clear it before using a shared or public computer.</span>
      </div>

      <div className="space-y-2">
        {visible.map(entry => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 border border-border rounded-lg px-3 py-2.5 hover:border-foreground/30 transition-colors"
          >
            <button
              onClick={() => onOpen(entry)}
              className="flex-1 text-left min-w-0"
            >
              <p className="text-sm font-medium text-foreground truncate">{entry.documentTypeLabel} — {entry.countryLabel}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                {' · '}{entry.source === 'ai' ? 'AI Writer' : 'Template'}
              </p>
            </button>
            <button
              onClick={() => setEntries(deleteFromHistory(entry.id))}
              className="text-muted-foreground hover:text-red-500 p-1.5 transition-colors flex-shrink-0"
              aria-label="Delete this saved document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => { clearHistory(); setEntries([]); }}
        className="text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors"
      >
        Clear all saved documents
      </button>
    </div>
  );
}

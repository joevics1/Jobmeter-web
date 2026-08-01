'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, X, Trash2, ShieldAlert, FileText, Sparkles, ArrowLeft,
} from 'lucide-react';
import {
  DocumentHistoryEntry, getHistory, deleteFromHistory, clearHistory,
} from '@/lib/document-history';
import { sanitizeDocument } from '@/lib/document-format';
import DocumentEditor from '@/components/documents/DocumentEditor';

type SortMode = 'latest' | 'oldest' | 'country' | 'type';
type SourceFilter = 'all' | 'template' | 'ai';

export default function MyDocumentsClient() {
  const [entries, setEntries] = useState<DocumentHistoryEntry[] | null>(null);
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('latest');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [openEntry, setOpenEntry] = useState<DocumentHistoryEntry | null>(null);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    let list = entries;
    if (sourceFilter !== 'all') list = list.filter(e => e.source === sourceFilter);
    if (q) {
      list = list.filter(e =>
        e.documentTypeLabel.toLowerCase().includes(q) ||
        e.countryLabel.toLowerCase().includes(q) ||
        e.document.title.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sortMode) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'country':
        sorted.sort((a, b) => a.countryLabel.localeCompare(b.countryLabel));
        break;
      case 'type':
        sorted.sort((a, b) => a.documentTypeLabel.localeCompare(b.documentTypeLabel));
        break;
      case 'latest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return sorted;
  }, [entries, query, sortMode, sourceFilter]);

  // ── Viewing a single saved document ──
  if (openEntry) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-6 space-y-4">
          <button
            onClick={() => setOpenEntry(null)}
            className="no-print flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Documents
          </button>
          <DocumentEditor
            document={openEntry.document}
            onChange={(doc) => setOpenEntry({ ...openEntry, document: doc })}
            isHighRisk={openEntry.isHighRisk}
            fileNamePrefix={openEntry.documentTypeLabel}
            onReset={() => setOpenEntry(null)}
            resetLabel="Back to My Documents"
          />
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6 space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/documents" className="hover:text-foreground">Documents</Link>
          <span>/</span>
          <span className="text-foreground font-medium">My Documents</span>
        </nav>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Documents</h1>
          <p className="text-muted-foreground leading-relaxed">
            Every document you&apos;ve filled in or generated on this browser, in one place.
          </p>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2.5">
          <ShieldAlert className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>Saved only on this device/browser — never sent to our servers. Clear it before using a shared or public computer.</span>
        </div>

        {entries === null ? null : entries.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">You haven&apos;t saved any documents on this browser yet.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/documents" className="text-sm font-semibold text-blue-500 hover:underline">Browse Templates</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/tools/document-generator" className="text-sm font-semibold text-blue-500 hover:underline">Try AI Writer</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search + sort + source filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search your saved documents..."
                  className="w-full bg-card border border-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground sm:w-48"
              >
                <option value="latest">Sort: Latest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="country">Sort: Country A–Z</option>
                <option value="type">Sort: Document Type A–Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {([
                { key: 'all', label: 'All' },
                { key: 'template', label: 'Templates' },
                { key: 'ai', label: 'AI Writer' },
              ] as { key: SourceFilter; label: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSourceFilter(opt.key)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    sourceFilter === opt.key
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved documents match &quot;{query}&quot;.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between gap-3 bg-card border border-border hover:border-foreground/30 rounded-xl px-4 py-3 transition-colors"
                  >
                    <button
                      onClick={() => setOpenEntry({ ...entry, document: sanitizeDocument(entry.document) })}
                      className="flex-1 text-left min-w-0 flex items-start gap-2.5"
                    >
                      {entry.source === 'ai' ? (
                        <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{entry.documentTypeLabel}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.countryLabel}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' · '}{entry.source === 'ai' ? 'AI Writer' : 'Template'}
                        </p>
                      </span>
                    </button>
                    <button
                      onClick={() => setEntries(deleteFromHistory(entry.id))}
                      className="text-muted-foreground hover:text-red-500 p-1 transition-colors flex-shrink-0"
                      aria-label="Delete this saved document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { clearHistory(); setEntries([]); }}
              className="text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors"
            >
              Clear all saved documents
            </button>
          </>
        )}
      </div>
    </div>
  );
}

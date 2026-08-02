'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, History, X } from 'lucide-react';
import { DocumentTemplateRow } from '@/lib/document-templates-data';
import { getDocumentType, getDocumentCountry } from '@/lib/document-types';

type SortMode = 'category' | 'country' | 'latest';

interface DocumentsIndexClientProps {
  templates: DocumentTemplateRow[];
}

interface EnrichedTemplate {
  row: DocumentTemplateRow;
  label: string;
  category: string;
  countryFlag: string;
  countryName: string;
}

export default function DocumentsIndexClient({ templates }: DocumentsIndexClientProps) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('category');

  const enriched: EnrichedTemplate[] = useMemo(() => templates.map(t => {
    const docType = getDocumentType(t.document_type);
    const docCountry = getDocumentCountry(t.country);
    return {
      row: t,
      label: docType?.label || t.title,
      category: docType?.category || 'Other',
      countryFlag: docCountry?.flag || '\u{1F30D}',
      countryName: docCountry?.name || t.country.toUpperCase(),
    };
  }), [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter(e =>
      e.label.toLowerCase().includes(q) ||
      e.countryName.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }, [enriched, query]);

  // Grouped view — used for 'category' and 'country' sort modes.
  const grouped = useMemo(() => {
    if (sortMode === 'latest') return null;
    const key = sortMode === 'country' ? 'countryName' : 'category';
    const map = new Map<string, EnrichedTemplate[]>();
    for (const e of filtered) {
      const k = e[key];
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered, sortMode]);

  // Flat, most-recently-updated-first view — used for 'latest' sort mode.
  const flatLatest = useMemo(() => {
    if (sortMode !== 'latest') return null;
    return [...filtered].sort((a, b) =>
      new Date(b.row.updated_at).getTime() - new Date(a.row.updated_at).getTime()
    );
  }, [filtered, sortMode]);

  return (
    <div className="space-y-6">
      {/* My Documents entry point */}
      <div className="flex justify-end">
        <Link
          href="/documents/my-documents"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 border border-blue-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          <History className="h-4 w-4" />
          My Documents
        </Link>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search templates by name or country..."
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
          className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground sm:w-52"
        >
          <option value="category">Sort: Category</option>
          <option value="country">Sort: Country A–Z</option>
          <option value="latest">Sort: Latest Updated</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No templates match &quot;{query}&quot;.</p>
      )}

      {/* Grouped (category or country) */}
      {grouped && (
        <div className="space-y-8">
          {grouped.map(([groupName, items]) => (
            <section key={groupName}>
              <h2 className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-3">{groupName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map(e => (
                  <TemplateCard key={e.row.id} e={e} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Flat, latest-first */}
      {flatLatest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {flatLatest.map(e => (
            <TemplateCard key={e.row.id} e={e} showUpdated />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ e, showUpdated }: { e: EnrichedTemplate; showUpdated?: boolean }) {
  return (
    <Link
      href={`/documents/${e.row.document_type}/${e.row.country}`}
      className="bg-card border border-border hover:border-foreground/30 rounded-xl p-4 transition-colors"
    >
      <p className="font-semibold text-foreground text-sm">{e.label}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {e.countryFlag} {e.countryName}
        {showUpdated && (
          <>
            {' · '}
            Updated {new Date(e.row.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </>
        )}
      </p>
    </Link>
  );
}

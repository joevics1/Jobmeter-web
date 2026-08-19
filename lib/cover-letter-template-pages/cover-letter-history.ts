// lib/cover-letter-template-pages/cover-letter-history.ts
// Local-only cover letter history, same pattern as
// lib/cv-template-pages/cv-history.ts. Never sent to the server: capped
// entry count, auto-expiring, every read/write guarded against private
// browsing / full or disabled storage.

import type { CoverLetterData } from './cover-letter-data-types';

const HISTORY_KEY = 'jobmeter-cover-letter-template-history';
const MAX_ENTRIES = 20;
const MAX_AGE_DAYS = 60;

export interface CoverLetterHistoryEntry {
  id: string;
  createdAt: string; // ISO
  roleSlug: string;
  roleLabel: string;
  countryCode?: string;
  countryLabel?: string;
  designId: string;
  coverLetterData: CoverLetterData;
}

function prune(entries: CoverLetterHistoryEntry[]): CoverLetterHistoryEntry[] {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return entries
    .filter((e) => new Date(e.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_ENTRIES);
}

export function getHistory(): CoverLetterHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const pruned = prune(parsed);
    if (pruned.length !== parsed.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return [];
  }
}

export function getHistoryEntry(id: string): CoverLetterHistoryEntry | null {
  return getHistory().find((e) => e.id === id) || null;
}

export function saveToHistory(entry: Omit<CoverLetterHistoryEntry, 'id' | 'createdAt'>): void {
  try {
    const existing = getHistory();
    const newEntry: CoverLetterHistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = prune([newEntry, ...existing]);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Storage full/unavailable — fine, the current session still works.
  }
}

export function deleteFromHistory(id: string): CoverLetterHistoryEntry[] {
  const updated = getHistory().filter((e) => e.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

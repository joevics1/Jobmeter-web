// lib/cv-template-pages/cv-history.ts
// Local-only CV history, same pattern as naira-autos' document-history.ts
// (copied/adapted, not imported — that's a different repo). Never sent to
// the server: capped entry count, auto-expiring, every read/write guarded
// against private browsing / full or disabled storage.

import type { CVData } from './cv-data-types';

const HISTORY_KEY = 'jobmeter-cv-template-history';
const MAX_ENTRIES = 20;
const MAX_AGE_DAYS = 60;

export interface CVHistoryEntry {
  id: string;
  createdAt: string; // ISO
  roleSlug: string;
  roleLabel: string;
  countryCode?: string;
  countryLabel?: string;
  designId: string;
  cvData: CVData;
  fontScale?: number; // text size multiplier, default 1 — optional/backward compatible
  lineScale?: number; // line spacing multiplier, default 1 — optional/backward compatible
}

function prune(entries: CVHistoryEntry[]): CVHistoryEntry[] {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return entries
    .filter((e) => new Date(e.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_ENTRIES);
}

export function getHistory(): CVHistoryEntry[] {
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

export function getHistoryEntry(id: string): CVHistoryEntry | null {
  return getHistory().find((e) => e.id === id) || null;
}

export function saveToHistory(entry: Omit<CVHistoryEntry, 'id' | 'createdAt'>): void {
  try {
    const existing = getHistory();
    const newEntry: CVHistoryEntry = {
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

export function deleteFromHistory(id: string): CVHistoryEntry[] {
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

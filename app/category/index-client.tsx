'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { GroupedCategories, CategoryPageMeta } from './page';

type TypeFilter = 'all' | 'location' | 'role';

// ─── One row in the directory ──────────────────────────────────────────────
// Each category page is a single line of real information (what it's
// filtered by, and its title) — a list row is honest to that, where a big
// marketing-style card would just be mostly empty space around one line of
// text.
function CategoryRow({ page }: { page: CategoryPageMeta }) {
  const isRole = page.page_type === 'role_in_location';
  const facet = isRole
    ? [page.filter_role, page.filter_city ?? page.filter_country].filter(Boolean).join(', ')
    : [page.filter_city, page.filter_country].filter(Boolean).join(', ') || page.filter_country;

  return (
    <Link
      href={`/category/${page.slug}`}
      className="group flex items-center gap-4 py-3.5 px-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <span className="hidden sm:flex items-center gap-1 shrink-0 w-8 text-gray-300 group-hover:text-gray-400">
        {isRole ? <Briefcase size={14} /> : <MapPin size={14} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
          {page.h1}
        </span>
        {facet && (
          <span className="block text-xs text-gray-400 truncate">{facet}</span>
        )}
      </span>
      <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

// ─── One country's block of rows ──────────────────────────────────────────
function CountryBlock({ group, searchQuery, typeFilter }: {
  group: GroupedCategories; searchQuery: string; typeFilter: TypeFilter;
}) {
  const q = searchQuery.toLowerCase();
  const pages = [...group.locationPages, ...group.rolePages].filter((p) => {
    if (typeFilter === 'location' && p.page_type !== 'jobs_in_location') return false;
    if (typeFilter === 'role' && p.page_type !== 'role_in_location') return false;
    return !q || p.h1.toLowerCase().includes(q);
  });

  if (pages.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{group.country}</h2>
        <span className="text-xs text-gray-400">{pages.length}</span>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4">
        {pages.map((p) => <CategoryRow key={p.slug} page={p} />)}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function CategoryIndexClient({ groups }: { groups: GroupedCategories[] }) {
  const [search, setSearch] = useState('');
  const [activeCountry, setActiveCountry] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const countries = useMemo(() => groups.map((g) => g.country), [groups]);
  const totalCategories = useMemo(
    () => groups.reduce((sum, g) => sum + g.locationPages.length + g.rolePages.length, 0),
    [groups]
  );

  const visibleGroups = useMemo(() => {
    return groups.filter((g) => activeCountry === 'All' || g.country === activeCountry);
  }, [groups, activeCountry]);

  const hasAnyResults = useMemo(() => {
    const q = search.toLowerCase();
    return visibleGroups.some((g) =>
      [...g.locationPages, ...g.rolePages].some((p) => {
        if (typeFilter === 'location' && p.page_type !== 'jobs_in_location') return false;
        if (typeFilter === 'role' && p.page_type !== 'role_in_location') return false;
        return !q || p.h1.toLowerCase().includes(q);
      })
    );
  }, [visibleGroups, search, typeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Categories</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Browse Jobs by Category & Location
        </h1>
        <p className="text-gray-500 mb-6">
          {totalCategories} categor{totalCategories === 1 ? 'y' : 'ies'} across every country JobMeter covers —
          find openings by city, country, or role.
        </p>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search a city, role, or country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={activeCountry}
            onChange={(e) => setActiveCountry(e.target.value)}
            className="h-10 px-3 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-sm">
            {(['all', 'location', 'role'] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 h-9 rounded-md font-medium transition-colors ${
                  typeFilter === t ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t === 'all' ? 'All' : t === 'location' ? 'By Location' : 'By Role'}
              </button>
            ))}
          </div>
        </div>

        {!hasAnyResults ? (
          <div className="text-center py-16 rounded-lg border border-dashed border-gray-300 bg-white">
            <Search size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">No categories match your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCountry('All'); setTypeFilter('all'); }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          visibleGroups.map((group) => (
            <CountryBlock key={group.country} group={group} searchQuery={search} typeFilter={typeFilter} />
          ))
        )}

        {/* Footer CTA */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-bold text-gray-900">Looking for something specific?</h2>
            <p className="text-sm text-gray-500">Browse every open role on the job board, updated daily.</p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
          >
            Go to the job board <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

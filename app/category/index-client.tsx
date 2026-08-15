'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ArrowRight, MapPin, Briefcase, Plane } from 'lucide-react';
import { GroupedCategories, CategoryPageMeta } from './page';

// ─── Guide card ───────────────────────────────────────────────────────────
// Styled like a torn boarding-pass stub: a colored spine marks whether this
// guide is a location page or a role page, an eyebrow states the facet
// (country/city, or role/city), and a dashed perforation in the hero echoes
// the travel/relocation subject without leaning on cliché iconography.
function CategoryCard({ page }: { page: CategoryPageMeta }) {
  const isRolePage = page.page_type === 'role_in_location';
  const eyebrow = isRolePage
    ? [page.filter_role, page.filter_city ?? page.filter_country].filter(Boolean).join(' · ')
    : [page.filter_city, page.filter_country].filter(Boolean).join(', ') || page.filter_country;

  return (
    <Link
      href={`/category/${page.slug}`}
      className="group relative flex overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200"
    >
      <div className={`w-1.5 shrink-0 ${isRolePage ? 'bg-amber-500' : 'bg-blue-600'}`} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {isRolePage ? <Briefcase size={12} /> : <MapPin size={12} />}
          {eyebrow || (isRolePage ? 'Role guide' : 'Location guide')}
        </div>
        <h3 className="font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {page.h1}
        </h3>
        <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
          Read the guide
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

// ─── Country section ──────────────────────────────────────────────────────
function CountrySection({ group, searchQuery }: { group: GroupedCategories; searchQuery: string }) {
  const q = searchQuery.toLowerCase();
  const filteredPages = [...group.locationPages, ...group.rolePages].filter(
    (p) => !q || p.h1.toLowerCase().includes(q)
  );

  if (filteredPages.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex items-baseline gap-3 mb-5 px-0.5">
        <span className="text-2xl leading-none">{group.flag}</span>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">{group.country}</h2>
        <span className="text-xs font-semibold text-gray-400">{filteredPages.length} guide{filteredPages.length === 1 ? '' : 's'}</span>
        <div className="flex-1 h-px bg-gray-200 ml-1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((p) => (
          <CategoryCard key={p.slug} page={p} />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function CategoryIndexClient({ groups }: { groups: GroupedCategories[] }) {
  const [search, setSearch] = useState('');
  const [activeCountry, setActiveCountry] = useState<string>('All');

  const countries = useMemo(() => groups.map((g) => g.country), [groups]);
  const totalGuides = useMemo(
    () => groups.reduce((sum, g) => sum + g.locationPages.length + g.rolePages.length, 0),
    [groups]
  );

  const visibleGroups = useMemo(() => {
    return groups.filter((g) => {
      if (activeCountry !== 'All' && g.country !== activeCountry) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        g.country.toLowerCase().includes(q) ||
        g.locationPages.some((p) => p.h1.toLowerCase().includes(q)) ||
        g.rolePages.some((p) => p.h1.toLowerCase().includes(q))
      );
    });
  }, [groups, search, activeCountry]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero: dark band, mirrors the existing dark CTA at the page's
             foot so the page reads as a single bookended strip ── */}
      <div className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-10">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">Guides</span>
          </nav>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Plane size={14} />
            Relocation & career guides
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3 max-w-2xl">
            Everything you need to work in the Gulf
          </h1>
          <p className="text-slate-400 max-w-xl text-base md:text-lg leading-relaxed">
            {totalGuides} in-depth guide{totalGuides === 1 ? '' : 's'} on salaries, visas and hiring by
            country, city and role — built from live job data, updated as the market moves.
          </p>
        </div>

        {/* ── Boarding-pass style search strip, perforated where it meets
               the content below ── */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row rounded-t-2xl bg-white shadow-xl overflow-hidden border border-b-0 border-gray-200">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search a city, role, or country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200 my-2.5" />
            <div className="flex overflow-x-auto sm:overflow-visible">
              {['All', ...countries].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className={`shrink-0 px-4 h-14 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    activeCountry === c
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-800'
                  }`}
                >
                  {c === 'All' ? 'All countries' : c}
                </button>
              ))}
            </div>
          </div>
          {/* perforation */}
          <div className="h-0 border-t-2 border-dashed border-gray-300" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        {visibleGroups.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white">
            <Search size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No guides match "{search}"</h3>
            <p className="text-sm text-gray-500 mt-1">Try a different city, role, or country.</p>
            <button
              onClick={() => { setSearch(''); setActiveCountry('All'); }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          visibleGroups.map((group) => (
            <CountrySection key={group.country} group={group} searchQuery={search} />
          ))
        )}

        {/* ── Footer CTA ── */}
        <div className="mt-8 rounded-2xl bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Ready to see live openings?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Our job board updates daily with vacancies across the Gulf.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
            >
              Go to the job board <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Sparkles, Award, TrendingUp, Loader2, Search, Briefcase, ShieldCheck, Zap, Check, Target } from 'lucide-react';
import { theme } from '@/lib/theme';
import { SKILLS_CATEGORIES, POPULAR_TOOLS, ALL_SKILLS } from '@/lib/constants/skills';
import { findMatchingRoles, RoleFinderResult } from '@/lib/utils/roleMatching';
import AdUnit from '@/components/ads/AdUnit';

const EXPERIENCE_LEVELS = [
  { value: 0, label: 'Less than 1 year' },
  { value: 1, label: '1 year' }, { value: 2, label: '2 years' }, { value: 3, label: '3 years' },
  { value: 4, label: '4 years' }, { value: 5, label: '5 years' }, { value: 6, label: '6 years' },
  { value: 7, label: '7 years' }, { value: 8, label: '8 years' }, { value: 9, label: '9 years' },
  { value: 10, label: '10+ years' },
];

const CATEGORY_NAMES = Object.keys(SKILLS_CATEGORIES);

export default function RoleFinderClient() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_NAMES[0]);

  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [customTool, setCustomTool] = useState('');
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  const [yearsOfExperience, setYearsOfExperience] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<RoleFinderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredSkillSuggestions = useMemo(() => {
    if (!skillQuery.trim()) return [];
    const q = skillQuery.toLowerCase();
    return ALL_SKILLS.filter((s) => s.toLowerCase().includes(q) && !selectedSkills.includes(s)).slice(0, 8);
  }, [skillQuery, selectedSkills]);

  const filteredTools = useMemo(() => {
    if (!customTool) return POPULAR_TOOLS.filter((t) => !selectedTools.includes(t));
    return POPULAR_TOOLS.filter((t) => t.toLowerCase().includes(customTool.toLowerCase()) && !selectedTools.includes(t));
  }, [customTool, selectedTools]);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) setSelectedSkills([...selectedSkills, skill]);
    setSkillQuery('');
    setShowSkillDropdown(false);
  };
  const removeSkill = (skill: string) => setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  const addCustomSkill = () => {
    const skill = skillQuery.trim();
    if (skill && !selectedSkills.includes(skill)) setSelectedSkills([...selectedSkills, skill]);
    setSkillQuery('');
    setShowSkillDropdown(false);
  };

  const addTool = (tool: string) => { if (!selectedTools.includes(tool)) setSelectedTools([...selectedTools, tool]); setCustomTool(''); setShowToolDropdown(false); };
  const removeTool = (tool: string) => setSelectedTools(selectedTools.filter((t) => t !== tool));
  const addCustomTool = () => {
    if (customTool.trim()) { const tool = customTool.trim(); if (!selectedTools.includes(tool)) setSelectedTools([...selectedTools, tool]); setCustomTool(''); }
  };

  const findRoles = async () => {
    if (selectedSkills.length === 0) { setError('Please select at least one skill'); return; }
    setIsSearching(true); setError(null); setResult(null);
    try {
      // Instant client-side matching against lib/data/roles.ts — no network
      // call. A tiny artificial delay keeps the loading state feeling
      // intentional rather than an instant flash.
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = findMatchingRoles(selectedSkills, selectedTools, yearsOfExperience);
      if (data.roles.length === 0) throw new Error('No matching roles found. Try adding more skills.');
      setResult(data);
    } catch (err: any) { console.error('Role finder error:', err); setError(err.message || 'Failed to find roles. Please try again.'); }
    finally { setIsSearching(false); }
  };

  const getMatchStyle = (score: number) => {
    if (score >= 80) return { color: theme.colors.match.good, bg: '#ECFDF5' };
    if (score >= 60) return { color: theme.colors.match.average, bg: '#FFFBEB' };
    return { color: theme.colors.match.bad, bg: '#FEF2F2' };
  };

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── Main form ── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>

          {/* Skills — search-first, browse-by-category is optional/collapsed */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Select your skills <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Search for a skill, or browse by category below</p>

            <div className="relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={skillQuery}
                  onChange={(e) => { setSkillQuery(e.target.value); setShowSkillDropdown(true); }}
                  onFocus={() => setShowSkillDropdown(true)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                  placeholder="e.g. Python, Excel, Project Management..."
                  className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: theme.colors.border.DEFAULT }}
                />
              </div>
              {showSkillDropdown && skillQuery.trim() && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto" style={{ borderColor: theme.colors.border.DEFAULT }}>
                  {filteredSkillSuggestions.map((skill) => (
                    <button key={skill} onClick={() => addSkill(skill)} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm text-gray-700">
                      {skill}
                    </button>
                  ))}
                  <button onClick={addCustomSkill} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm text-blue-600 font-medium border-t" style={{ borderColor: theme.colors.border.light }}>
                    Add &quot;{skillQuery.trim()}&quot; as a custom skill
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setBrowseOpen(!browseOpen)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
            >
              {browseOpen ? 'Hide' : 'Browse'} skill categories
              <ChevronDown size={16} className={`transition-transform ${browseOpen ? 'rotate-180' : ''}`} />
            </button>

            {browseOpen && (
              <div className="mt-3 border rounded-lg overflow-hidden" style={{ borderColor: theme.colors.border.DEFAULT }}>
                {/* Step 1: category tabs — underline style, deliberately NOT chip-shaped
                    so they read as "tabs" rather than "things you can select as skills" */}
                <div className="px-3 pt-3" style={{ backgroundColor: theme.colors.background.muted }}>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">1. Choose a category</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pb-3">
                    {CATEGORY_NAMES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-sm pb-1 border-b-2 transition-colors whitespace-nowrap ${
                          activeCategory === cat
                            ? 'border-blue-600 text-blue-700 font-semibold'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: skill chips for the active category — rounded pills with a
                    checkmark on selection, visually distinct from the tabs above */}
                <div className="p-3 bg-white border-t" style={{ borderColor: theme.colors.border.DEFAULT }}>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    2. Tap to add skills in {activeCategory}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_CATEGORIES[activeCategory as keyof typeof SKILLS_CATEGORIES].map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          disabled={isSelected}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white cursor-default'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Selected skills — shown here (below search + browse) so users
                see their picks update in place instead of scrolling back up */}
            {selectedSkills.length > 0 && (
              <div className="mt-4 pt-3 border-t" style={{ borderColor: theme.colors.border.light }}>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Selected skills ({selectedSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-blue-900"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border.light }}>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Tools & software you use</label>
            <p className="text-xs text-gray-500 mb-3">Optional — add tools like Excel, Figma, etc.</p>
            {selectedTools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTools.map((tool) => (
                  <span key={tool} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                    {tool}
                    <button onClick={() => removeTool(tool)} className="hover:text-blue-900"><X size={14} /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={customTool}
                onChange={(e) => { setCustomTool(e.target.value); setShowToolDropdown(true); }}
                onFocus={() => setShowToolDropdown(true)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomTool()}
                placeholder="Type a tool and press Enter"
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: theme.colors.border.DEFAULT }}
              />
              {showToolDropdown && filteredTools.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ borderColor: theme.colors.border.DEFAULT }}>
                  {filteredTools.slice(0, 8).map((tool) => (
                    <button key={tool} onClick={() => addTool(tool)} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm text-gray-700">{tool}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border.light }}>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Years of experience</label>
            <p className="text-xs text-gray-500 mb-3">Optional — helps refine role recommendations</p>
            <select
              value={yearsOfExperience ?? ''}
              onChange={(e) => setYearsOfExperience(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              style={{ borderColor: theme.colors.border.DEFAULT }}
            >
              <option value="">Select years of experience</option>
              {EXPERIENCE_LEVELS.map((level) => (<option key={level.value} value={level.value}>{level.label}</option>))}
            </select>
          </div>

          {error && <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button
            onClick={findRoles}
            disabled={isSearching || selectedSkills.length === 0}
            className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            {isSearching ? <><Loader2 className="animate-spin" size={20} />Finding your ideal roles...</> : <><Sparkles size={20} />Find Alternative Roles</>}
          </button>
        </div>

        {/* ── Sidebar (desktop only — stacks below form on mobile) ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Why this works</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Zap size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Instant results — matched against 200+ real role profiles, no waiting</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>100% free, no CV upload or account needed</span>
              </li>
              <li className="flex items-start gap-2">
                <Briefcase size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Covers tech, business, healthcare, education, and more</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderLeft: `4px solid ${theme.colors.primary.DEFAULT}` }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Career Summary</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
            <p className="mt-3 text-xs text-blue-700 font-medium">
              {result.roles.length} role{result.roles.length === 1 ? '' : 's'} matched based on your {selectedSkills.length} skill{selectedSkills.length === 1 ? '' : 's'}
            </p>
          </div>

          {/* ── [AD: between summary and role cards] ─────────────────── */}
          {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4690286797" format="fluid" layout="in-article" />
*/}

          <div className="flex items-center gap-2 pt-2">
            <Target size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Matched Career Paths</h2>
          </div>
          <p className="text-xs text-gray-500 -mt-4">Ranked by fit, best match first</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {result.roles.map((role, index) => {
              const matchStyle = getMatchStyle(role.matchScore);
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-xl p-5 pl-6 shadow-md flex flex-col"
                  style={{ border: `1px solid ${theme.colors.border.DEFAULT}`, borderLeft: `4px solid ${matchStyle.color}` }}
                >
                  <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {index + 1}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">{role.role}</h3>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">{role.seniority}</span>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap"
                      style={{ color: matchStyle.color, backgroundColor: matchStyle.bg }}
                    >
                      {role.matchScore}% Match
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>

                  {role.salaryRange && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-600">
                      <TrendingUp size={13} className="text-blue-600 flex-shrink-0" />
                      <span>{role.salaryRange}</span>
                    </div>
                  )}

                  {role.requiredSkills.length > 0 && (
                    <div className="mb-2.5">
                      <p className="text-xs font-medium text-gray-500 mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {role.requiredSkills.map((skill) => (
                          <span key={skill} className={`px-2 py-0.5 text-xs rounded ${selectedSkills.some((s) => skill.toLowerCase().includes(s.toLowerCase())) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {role.skillGaps.length > 0 && (
                    <div className="mb-2.5">
                      <p className="text-xs font-medium text-gray-500 mb-1">Skills to Develop</p>
                      <div className="flex flex-wrap gap-1">
                        {role.skillGaps.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-xs rounded bg-amber-50 text-amber-700 border border-amber-100">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {role.certifications.length > 0 && (
                    <div className="mt-auto pt-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Recommended Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {role.certifications.map((cert) => (
                          <span key={cert} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 flex items-center gap-1">
                            <Award size={10} className="text-blue-600" />{cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

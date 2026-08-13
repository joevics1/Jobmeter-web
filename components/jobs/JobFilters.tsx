"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { theme } from '@/lib/theme';
import { COUNTRIES } from '@/lib/countries';

interface JobFiltersProps {
  filters: {
    search?: string;
    location?: string[];
    sector?: string[];
    employmentType?: string[];
    salaryRange?: { min: number; max: number };
    remote?: boolean;
    country?: string;
    locationSearch?: string;
  };
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onToggle: () => void;
  /** Live count of jobs matching the current filters, from the parent's
   * already-computed filteredJobs. Every toggle in this drawer applies
   * instantly, so this is just reflecting that — not a preview of a
   * pending change. */
  resultCount?: number;
  /** Parent's own clear-all, which resets every field it actually tracks
   * (including roleCategory/jobType/state/town, which this component
   * doesn't render fields for but the parent's filter state has). Without
   * this, this component's own clearAllFilters was a second, incomplete
   * copy of that logic that silently dropped those fields to undefined
   * when triggered from here specifically. */
  onClearAll?: () => void;
}

// This used to be a fourth separately hand-maintained country list (on top
// of the main filter dropdown, the first-visit popup, and the geo-IP map),
// and had already drifted out of sync with all of them — missing Bahrain,
// Uganda, and Zambia, while carrying a few (Czech Republic, Hong Kong,
// Turkey, etc.) none of the others had. Now built from the single shared
// list ('Global' prepended here since this dropdown, unlike the others,
// needs it as a real selectable option rather than the unfiltered default).
const countries = ['Global', ...COUNTRIES.map((c) => c.name)];

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const sectors = [
  'Information Technology & Software',
  'Engineering & Manufacturing', 
  'Finance & Banking', 
  'Healthcare & Medical', 
  'Education & Training', 
  'Sales & Marketing', 
  'Human Resources & Recruitment', 
  'Customer Service & Support', 
  'Media Advertising & Communications', 
  'Design Arts & Creative', 
  'Construction & Real Estate', 
  'Logistics Transport & Supply Chain', 
  'Agriculture & Agribusiness', 
  'Energy & Utilities', 
  'Legal & Compliance', 
  'Government & Public Administration', 
  'Retail & E-commerce', 
  'Hospitality & Tourism', 
  'Science & Research', 
  'Security & Defense', 
  'Telecommunications', 
  'Nonprofit & NGO', 
  'Environment & Sustainability', 
  'Product Management & Operations', 
  'Data & Analytics'
];

const employmentTypes = [
  'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote'
];

// Multi-select dropdown component
const MultiSelectDropdown = ({ 
  options, 
  selected, 
  onChange, 
  placeholder, 
  label,
  closeOnSelect = false,
}: { 
  options: string[]; 
  selected: string[]; 
  onChange: (selected: string[]) => void; 
  placeholder: string; 
  label: string;
  /** Set true for fields where only one selection is meaningful (e.g. this
   * component being reused as a single-select for Country) — closing after
   * every pick is correct there, but was previously happening for genuine
   * multi-selects (State, Sector) too, forcing users to reopen the dropdown
   * after each individual pick. */
  closeOnSelect?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
    if (closeOnSelect) setIsOpen(false);
  };

  const handleRemove = (option: string) => {
    const newSelected = selected.filter(item => item !== option);
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all hover:border-blue-400"
        style={{
          borderColor: theme.colors.border.DEFAULT,
          backgroundColor: theme.colors.background.DEFAULT,
        }}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span style={{ color: theme.colors.text.muted }}>{placeholder}</span>
          ) : (
            selected.map(item => (
              <span
                key={item}
                className="px-2 py-1 text-xs rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: theme.colors.primary.DEFAULT + '15',
                  color: theme.colors.primary.DEFAULT,
                }}
              >
                {item}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleRemove(item);
                    }
                  }}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X size={12} />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: theme.colors.text.secondary }}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              style={{ borderColor: theme.colors.border.DEFAULT }}
            />
          </div>
          <div className="max-h-48 overflow-y-auto pb-4">
            {filteredOptions.map(option => (
              <button
                key={option}
                onClick={() => handleToggle(option)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <span>{option}</span>
                {selected.includes(option) && (
                  <Check size={16} style={{ color: theme.colors.primary.DEFAULT }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Collapsible section wrapper — expandedSections/toggleSection existed
// before but nothing in the render actually used them, so every section
// was always fully expanded regardless of this state.
const FilterSection = ({
  id,
  title,
  isExpanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: theme.colors.border.DEFAULT }}>
    <button
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <span className="font-semibold text-sm" style={{ color: theme.colors.text.primary }}>{title}</span>
      {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
    </button>
    {isExpanded && <div className="p-4 space-y-3">{children}</div>}
  </div>
);

export default function JobFilters({ filters, onFiltersChange, isOpen, onToggle, onClearAll, resultCount }: JobFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['location']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.location?.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...(filters.location || []), location];
    
    onFiltersChange({ ...filters, location: newLocations });
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = filters.sector?.includes(sector)
      ? filters.sector.filter(s => s !== sector)
      : [...(filters.sector || []), sector];
    
    onFiltersChange({ ...filters, sector: newSectors });
  };

  const handleEmploymentTypeToggle = (type: string) => {
    const newTypes = filters.employmentType?.includes(type)
      ? filters.employmentType.filter(t => t !== type)
      : [...(filters.employmentType || []), type];
    
    onFiltersChange({ ...filters, employmentType: newTypes });
  };

  const handleSalaryRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const currentRange = filters.salaryRange || { min: 0, max: 0 };
    const newRange = { ...currentRange, [type]: numValue };
    
    onFiltersChange({ ...filters, salaryRange: newRange });
  };

  const handleRemoteToggle = () => {
    onFiltersChange({ ...filters, remote: !filters.remote });
  };

  const clearAllFilters = () => {
    if (onClearAll) {
      onClearAll();
      return;
    }
    // Fallback if no parent handler is passed — kept in sync with the
    // fields this component itself renders (Country/State/Sector/
    // EmploymentType/Remote/SalaryRange). Prefer passing onClearAll so
    // this never drifts from the parent's full filter shape again.
    const clearedFilters = {
      search: filters.search,
      location: [] as string[],
      sector: [] as string[],
      employmentType: [] as string[],
      salaryRange: undefined,
      remote: false,
      country: '',
      locationSearch: '',
    };
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = (
    (filters.location?.length || 0) > 0 ||
    (filters.sector?.length || 0) > 0 ||
    (filters.employmentType?.length || 0) > 0 ||
    !!filters.salaryRange ||
    !!filters.locationSearch?.trim() ||
    filters.remote ||
    filters.country
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Side Modal */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

{/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All Filters
              </button>
            )}

            <FilterSection id="location" title="Location" isExpanded={expandedSections.includes('location')} onToggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MultiSelectDropdown
                  options={countries}
                  selected={filters.country ? [filters.country] : []}
                  onChange={(selected) => {
                    if (selected[0] === 'Global') {
                      onFiltersChange({ ...filters, country: '', location: [], locationSearch: '' });
                    } else {
                      onFiltersChange({
                        ...filters,
                        country: selected[0] || '',
                        location: selected[0] === 'Nigeria' ? filters.location : [],
                        locationSearch: selected[0] === 'Nigeria' ? '' : filters.locationSearch,
                      });
                    }
                  }}
                  placeholder="Select country..."
                  label="Country"
                  closeOnSelect
                />

                {filters.country === 'Nigeria' && (
                  <MultiSelectDropdown
                    options={nigerianStates}
                    selected={filters.location || []}
                    onChange={(selected) => onFiltersChange({ ...filters, location: selected })}
                    placeholder="Select states..."
                    label="State"
                  />
                )}

                {/* Nigeria gets a proper state multi-select above; every
                    other selected country previously had no location
                    narrowing at all — this covers city/region as free text
                    instead of hardcoding a state/region list per country. */}
                {filters.country && filters.country !== 'Nigeria' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={filters.locationSearch || ''}
                      onChange={(e) => onFiltersChange({ ...filters, locationSearch: e.target.value })}
                      placeholder="e.g. Dubai, Riyadh..."
                      className="w-full px-4 py-3 border rounded-lg text-sm"
                      style={{ borderColor: theme.colors.border.DEFAULT, backgroundColor: theme.colors.background.DEFAULT }}
                    />
                  </div>
                )}
              </div>
            </FilterSection>

            <FilterSection id="sector" title="Sector" isExpanded={expandedSections.includes('sector')} onToggle={toggleSection}>
              <MultiSelectDropdown
                options={sectors}
                selected={filters.sector || []}
                onChange={(selected) => onFiltersChange({ ...filters, sector: selected })}
                placeholder="Select sectors..."
                label=""
              />
            </FilterSection>

            <FilterSection id="employmentType" title="Employment Type" isExpanded={expandedSections.includes('employmentType')} onToggle={toggleSection}>
              <div className="grid grid-cols-2 gap-2">
                {employmentTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer py-2 px-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.employmentType?.includes(type) || false}
                      onChange={() => handleEmploymentTypeToggle(type)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  id="remote-filter"
                  checked={filters.remote || false}
                  onChange={handleRemoteToggle}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote Only</span>
              </label>
            </FilterSection>

            <FilterSection id="salary" title="Salary Range" isExpanded={expandedSections.includes('salary')} onToggle={toggleSection}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Minimum</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="No min"
                    value={filters.salaryRange?.min || ''}
                    onChange={(e) => handleSalaryRangeChange('min', e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm"
                    style={{ borderColor: theme.colors.border.DEFAULT }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Maximum</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="No max"
                    value={filters.salaryRange?.max || ''}
                    onChange={(e) => handleSalaryRangeChange('max', e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm"
                    style={{ borderColor: theme.colors.border.DEFAULT }}
                  />
                </div>
              </div>
              <p className="text-xs" style={{ color: theme.colors.text.muted }}>
                Listings use different currencies — this compares the raw number shown on each job&apos;s posted salary, not a converted amount.
              </p>
            </FilterSection>
          </div>

          {/* Footer — was a static "Filter" button that just closed the
              drawer, implying a change needed to be "applied" when every
              toggle above already filters live. Now honestly reflects
              that with a live count instead. */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onToggle}
              disabled={resultCount === 0}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              {resultCount === undefined
                ? 'Done'
                : resultCount === 0
                ? 'No jobs match these filters'
                : `Show ${resultCount.toLocaleString()} job${resultCount === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
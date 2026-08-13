"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';

import JobCard from '@/components/jobs/JobCard';
import { JobUI } from '@/components/jobs/JobCard';
import MatchScanAnimation from '@/components/jobs/MatchScanAnimation';
import MatchBreakdownModal from '@/components/jobs/MatchBreakdownModal';
import { MatchBreakdownModalData } from '@/components/jobs/MatchBreakdownModal';
import JobFilters from '@/components/jobs/JobFilters';
import { Search, X, SlidersHorizontal, ArrowUpDown, RefreshCw, Globe, FileText, ArrowRight, CheckCircle, AlertCircle, Sparkles, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { scoreJob, JobRow, UserOnboardingData } from '@/lib/matching/matchEngine';
import { matchCacheService } from '@/lib/matching/matchCache';
import CreateCVModal from '@/components/cv/CreateCVModal';
import CreateCoverLetterModal from '@/components/cv/CreateCoverLetterModal';
import AdUnit from '@/components/ads/AdUnit';
import { COUNTRIES } from '@/lib/countries';

import { OrganizationSchema, WebSiteSchema } from '@/components/seo/StructuredData';

// ─── Ad slot IDs ───────────────────────────────────────────────────────────────
const AD_SLOTS = {
  DISPLAY_TOP:         '4198231153',
  BANNER:              '8152297343',
  IN_ARTICLE_1:        '4690286797',
  IN_ARTICLE_2:        '8181708196',
  DISPLAY_BOTTOM:      '9751041788',
  IN_FEED:             '9025117620',
  IN_FEED_LAYOUT_KEY:  '-fb+5w+4e-db+86',
  MIDDLE_DISPLAY:      '9010641928',
} as const;
// ─────────────────────────────────────────────────────────────────────────────

// Worker handles site filtering via ?site=global

function getSiteKeys(site: string) {
  return {
    SAVED_JOBS: 'saved_jobs',
    APPLIED_JOBS: 'applied_jobs',
    LATEST_JOBS_CACHE: `${site}_latest_jobs_cache`,
    LATEST_JOBS_CACHE_TS: `${site}_latest_jobs_cache_ts`,
    LATEST_JOBS_CACHE_VERSION: `${site}_latest_jobs_cache_version`,
    MATCHES_CACHE: `${site}_jobs_cache`,
    MATCHES_CACHE_TS: `${site}_jobs_cache_timestamp`,
    MATCHES_CACHE_USER: `${site}_jobs_cache_user_id`,
  };
}

const JOBS_PER_PAGE_DISPLAY = 50;
const CLIENT_CACHE_DURATION = 20 * 60 * 1000; // 20 min — latest jobs
// Matches listing cache — refreshes once a day, or immediately when the user
// clicks "Recalculate". Match SCORES are cached separately (and longer) in
// matchCacheService, so this only governs how often the underlying job list
// (titles/status/etc.) and overall match set are refetched.
const MATCHES_CACHE_DURATION = 24 * 60 * 60 * 1000;

interface JobListProps {
  siteType?: 'nigeria' | 'gulf' | 'global';
  initialJobs?: any[];
  initialCountry?: string;
  initialRoleCategory?: string;
  initialJobType?: string;
  initialState?: string;
  initialTown?: string;
}

// The Cloudflare Worker backing the /jobs listing doesn't know about apply_in_app/
// screening_enabled at all — those live only in Supabase. This does one supplementary
// query after the worker fetch to merge them in, so Quick Apply actually shows.
async function enrichWithApplyInApp(uiJobs: JobUI[]): Promise<JobUI[]> {
  const ids = uiJobs.map((j) => j.id).filter(Boolean);
  if (ids.length === 0) return uiJobs;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, apply_in_app, screening_enabled')
      .in('id', ids)
      .eq('apply_in_app', true);
    if (error || !data) return uiJobs;
    const flagMap = new Map(data.map((r: any) => [r.id, r]));
    return uiJobs.map((j) => {
      const match = flagMap.get(j.id);
      return match
        ? { ...j, apply_in_app: true, screening_enabled: !!match.screening_enabled }
        : j;
    });
  } catch {
    return uiJobs;
  }
}

// ── Static transform for SSR seeding (no user/match context) ─────────────────
function transformJobToUIStatic(job: any): JobUI {
  let locationStr = 'Location not specified';
  if (typeof job.location === 'string') { locationStr = job.location; }
  else if (job.location && typeof job.location === 'object') {
    const loc = job.location;
    if (loc.remote) { const place = [loc.city, loc.state, loc.country].filter(Boolean).join(', '); locationStr = place ? `Remote · ${place}` : 'Remote'; }
    else { const parts = [loc.city, loc.state, loc.country].filter(Boolean); locationStr = parts.length > 0 ? parts.join(', ') : 'Location not specified'; }
  }
  let companyStr = 'Unknown Company';
  if (typeof job.company === 'string') { companyStr = job.company; }
  else if (job.company && typeof job.company === 'object') { companyStr = job.company.name || 'Unknown Company'; }
  let salaryStr = '';
  if (typeof job.salary === 'string') { salaryStr = job.salary; }
  else if (job.salary_range && typeof job.salary_range === 'object') {
    const sal = job.salary_range;
    if (sal.min !== null && sal.currency) salaryStr = `${sal.currency} ${sal.min.toLocaleString()} ${sal.period || ''}`.trim();
  }
  return {
    id: job.id, slug: job.slug || job.id, title: job.title || 'Untitled Job',
    company: companyStr, location: locationStr, rawLocation: job.location,
    country: job.country || [], salary: salaryStr, match: 0,
    calculatedTotal: 0, type: job.type || job.employment_type || '',
    breakdown: null, postedDate: job.posted_date || job.created_at
      ? (() => {
          try {
            const date = new Date(job.posted_date || job.created_at);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            if (diffInHours < 24) return 'Today';
            if (diffInDays === 1) return '1 day ago';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) { const weeks = Math.floor(diffInDays / 7); return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`; }
            if (diffInDays < 365) { const months = Math.floor(diffInDays / 30); return months === 1 ? '1 month ago' : `${months} months ago`; }
            const years = Math.floor(diffInDays / 365);
            return years === 1 ? '1 year ago' : `${years} years ago`;
          } catch { return undefined; }
        })()
      : undefined,
    sector: job.sector || '', role_category: job.role_category || '',
    description: job.description || job.job_description || '',
    apply_in_app: !!job.apply_in_app, screening_enabled: !!job.screening_enabled,
    status: job.status, deadline: job.deadline,
  };
}

export default function JobList({ siteType = 'global', initialJobs, initialCountry, initialRoleCategory, initialJobType, initialState, initialTown }: JobListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const STORAGE_KEYS = getSiteKeys(siteType);

  const [activeTab, setActiveTab] = useState<'latest' | 'matches'>('latest');

  // ── Latest tab state ────────────────────────────────────────────────────────
  const [latestJobs, setLatestJobs] = useState<JobUI[]>([]);
  const [latestJobsLoading, setLatestJobsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Matches tab state ───────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<JobUI[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Auth ────────────────────────────────────────────────────────────────────
  // Pre-seed synchronously from localStorage so authChecked=true on first render
  // when there's a valid cached session — no blank/flash gap waiting for async listener.
  const [user, setUser] = useState<any>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (!raw) return null;
      const parsed = JSON.parse(localStorage.getItem(raw) || '');
      return parsed?.user ?? null;
    } catch { return null; }
  });
  const [userName, setUserName] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
      return !!raw && !!JSON.parse(localStorage.getItem(raw) || '')?.user;
    } catch { return false; }
  });
  const [userOnboardingData, setUserOnboardingData] = useState<UserOnboardingData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (!raw) return null;
      const userId = JSON.parse(localStorage.getItem(raw) || '')?.user?.id;
      if (!userId) return null;
      const cached = localStorage.getItem(`onboarding_cache_${userId}`);
      const ts = localStorage.getItem(`onboarding_cache_ts_${userId}`);
      if (cached && ts && Date.now() - parseInt(ts, 10) < 7 * 24 * 60 * 60 * 1000) {
        return JSON.parse(cached);
      }
    } catch { }
    return null;
  });

  // ── UI state ────────────────────────────────────────────────────────────────
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [refreshingMatches, setRefreshingMatches] = useState(false);
  const [matchesCachedAt, setMatchesCachedAt] = useState<number | null>(null);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchModalData, setMatchModalData] = useState<MatchBreakdownModalData | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'salary'>('latest');
  const [matchPage, setMatchPage] = useState(1);
  const [matchSearch, setMatchSearch] = useState('');
  const [matchSortBy, setMatchSortBy] = useState<'match' | 'latest' | 'salary'>('match');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fabScrollY, setFabScrollY] = useState(0);
  const [nearPageBottom, setNearPageBottom] = useState(false);
  const [fabDismissed, setFabDismissed] = useState(false);
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCountryPopup, setShowCountryPopup] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    location: [] as string[],
    sector: [] as string[],
    employmentType: [] as string[],
    salaryRange: undefined as { min: number; max: number } | undefined,
    remote: false,
    country: '',
    roleCategory: '',
    jobType: '',
    state: '',
    town: '',
    // Free-text city/region filter for non-Nigeria countries. `location`
    // above is a proper multi-select but only has a real option list for
    // Nigerian states — this covers everywhere else without needing a
    // hardcoded state/region list per country.
    locationSearch: '',
  });

  // ── Refs to prevent duplicate fetches ──────────────────────────────────────
  const latestFetchedRef = useRef(false);
  const matchesFetchedRef = useRef(false);

  // ── CV Upload state (for unauthenticated users) ─────────────────────────────
  type CVUploadStatus = 'idle' | 'dragging' | 'uploading' | 'parsing' | 'done' | 'error';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvStatus, setCvStatus] = useState<CVUploadStatus>('idle');
  const [cvFileName, setCvFileName] = useState('');
  const [cvErrorMsg, setCvErrorMsg] = useState('');
  const [cvProgress, setCvProgress] = useState(0);

  const processCVFile = useCallback(async (file: File) => {
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    const isDoc = file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
    if (!isPDF && !isImage && !isDoc) { setCvStatus('error'); setCvErrorMsg('Please upload a PDF, Word document, or image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setCvStatus('error'); setCvErrorMsg('File too large. Maximum size is 10MB.'); return; }
    setCvFileName(file.name); setCvErrorMsg(''); setCvStatus('uploading'); setCvProgress(20);
    try {
      const form = new FormData();
      form.append('file', file);
      const ocrRes = await fetch('/api/onboarding/ocr', { method: 'POST', body: form });
      if (!ocrRes.ok) { const err = await ocrRes.json().catch(() => ({})); throw new Error(err.message || 'Failed to extract text from CV.'); }
      const { text } = await ocrRes.json();
      if (!text) throw new Error('No text could be extracted from this file.');
      setCvProgress(55); setCvStatus('parsing');
      const parseRes = await fetch('/api/onboarding/parse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (!parseRes.ok) { const err = await parseRes.json().catch(() => ({})); throw new Error(err.error || 'Failed to parse CV.'); }
      const { parsed } = await parseRes.json();
      if (!parsed) throw new Error('Invalid parse response.');
      setCvProgress(90);
      const cvRoles = parsed.workExperience?.map((e: any) => e.title) || [];
      const profile = {
        name: parsed.fullName || '', email: parsed.email || '', phone: parsed.phone || '',
        location: parsed.location || '', summary: parsed.summary || '', roles: cvRoles,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: '', workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        accomplishments: Array.isArray(parsed.accomplishments) ? parsed.accomplishments : [],
        awards: Array.isArray(parsed.awards) ? parsed.awards : [],
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        interests: Array.isArray(parsed.interests) ? parsed.interests : [],
        linkedin: parsed.linkedin || '', github: parsed.github || '', portfolio: parsed.portfolio || '',
        publications: Array.isArray(parsed.publications) ? parsed.publications : [],
        volunteerWork: Array.isArray(parsed.volunteerWork) ? parsed.volunteerWork : [],
        additionalSections: Array.isArray(parsed.additionalSections) ? parsed.additionalSections : [],
        cvAiSuggestedRoles: Array.isArray(parsed.suggestedRoles) ? parsed.suggestedRoles : [],
      };
      try {
        localStorage.setItem('onboarding_cv_data', JSON.stringify(profile));
        localStorage.setItem('onboarding_cv_file', JSON.stringify({ text }));
        localStorage.setItem('extractedProfile', JSON.stringify(profile));
        localStorage.setItem('cvText', text);
      } catch {}
      setCvProgress(100); setCvStatus('done');
      setTimeout(() => router.push('/onboarding'), 800);
    } catch (err: any) {
      setCvStatus('error');
      setCvErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }, [router]);

  const handleCVDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setCvStatus('idle');
    const file = e.dataTransfer.files?.[0];
    if (file) processCVFile(file);
  }, [processCVFile]);

  const handleCVChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCVFile(file);
    e.target.value = '';
  }, [processCVFile]);

  const popularRoles = [
    'Accountant', 'Digital Marketer', 'Social Media Manager', 'Data Analyst', 'Developer',
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile App Developer', 'DevOps Engineer', 'Data Scientist', 'Cybersecurity Analyst',
    'IT Support Specialist', 'Product Manager', 'Project Manager', 'Business Analyst',
    'UI/UX Designer', 'Graphic Designer', 'Content Writer', 'SEO Specialist', 'Sales Executive',
    'Marketing Executive', 'Customer Service Representative', 'Administrative Officer',
    'Human Resources Officer', 'Recruiter', 'Financial Analyst', 'Auditor', 'Operations Manager',
    'Supply Chain Officer', 'Procurement Officer', 'Logistics Coordinator', 'Store Manager',
    'Retail Sales Associate', 'Banking Officer', 'Credit Analyst', 'Risk Analyst',
    'Healthcare Assistant', 'Registered Nurse', 'Pharmacist', 'Medical Laboratory Scientist',
    'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Architect',
    'Quality Assurance Officer', 'Teacher', 'Lecturer', 'Research Assistant', 'Graduate Trainee', 'Intern',
    'Chief Executive Officer', 'Chief Financial Officer', 'Chief Technology Officer', 'Chief Operating Officer',
    'VP of Marketing', 'VP of Sales', 'VP of Engineering', 'VP of HR',
    'Regional Manager', 'Area Manager', 'Branch Manager', 'General Manager', 'Managing Director',
    'Legal Counsel', 'Corporate Lawyer', 'Compliance Officer', 'Risk Manager', 'Security Analyst',
    'Network Administrator', 'Systems Administrator', 'Database Administrator', 'Cloud Engineer',
    'Machine Learning Engineer', 'AI Engineer', 'Blockchain Developer', 'Game Developer', 'QA Engineer',
    'Technical Writer', 'Copywriter', 'Journalist', 'Editor', 'Proofreader', 'Translator', 'Interpreter',
    'Public Relations Manager', 'Communications Manager', 'Brand Manager', 'Marketing Manager',
    'Digital Strategist', 'Growth Hacker', 'Marketing Analyst', 'Business Development Manager',
    'Account Manager', 'Key Account Manager', 'Territory Sales Manager', 'Sales Director',
    'Procurement Manager', 'Inventory Manager', 'Warehouse Manager', 'Production Manager',
    'Quality Control Manager', 'Safety Manager', 'Environmental Engineer', 'Surveyor', 'Urban Planner',
    'Interior Designer', 'Landscape Architect', 'Construction Manager', 'Site Engineer',
    'Civil Technician', 'Draftsman', 'CAD Technician', 'BIM Manager', 'Estimator', 'Quantity Surveyor',
    'Hotel Manager', 'Restaurant Manager', 'Chef', 'Pastry Chef', 'Bartender', 'Catering Manager',
    'Event Planner', 'Travel Agent', 'Tour Guide', 'Flight Attendant', 'Pilot', 'Air Traffic Controller',
    'Logistics Manager', 'Freight Forwarder', 'Customs Broker', 'Shipping Coordinator', 'Driver',
    'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Welder', 'Mechanic', 'Technician',
    'Lab Technician', 'Pharmacy Technician', 'Radiographer', 'Physiotherapist', 'Dietitian',
    'Psychologist', 'Counselor', 'Social Worker', 'Community Manager', 'Youth Worker',
    'Fashion Designer', 'Textile Designer', 'Jeweler', 'Photographer', 'Videographer', 'Animator',
    'Music Producer', 'Sound Engineer', 'Film Director', 'Screenwriter', 'Actor', 'Model',
    'Fitness Trainer', 'Yoga Instructor', 'Sports Coach', 'Personal Trainer', 'Nutritionist',
    'Real Estate Agent', 'Property Manager', 'Estate Agent', 'Landlord', 'Facility Manager',
    'Insurance Agent', 'Underwriter', 'Actuary', 'Claims Adjuster', 'Broker', 'Financial Planner',
    'Investment Analyst', 'Portfolio Manager', 'Treasurer', 'Controller', 'Payroll Administrator',
    'Bookkeeper', 'Tax Specialist', 'Revenue Manager', 'Billing Specialist', 'Accounts Payable',
    'Accounts Receivable', 'Staff Nurse', 'Enrolled Nurse', 'Midwife', 'Paramedic', 'Emergency Medical Technician',
    'Dental Hygienist', 'Dentist', 'Dental Assistant', 'Optometrist', 'Veterinarian', 'Pet Groomer'
  ];

  const getSuggestions = (query: string) => {
    if (!query || query.length < 1) return [];
    const lowerQuery = query.toLowerCase();
    return popularRoles.filter(role => role.toLowerCase().includes(lowerQuery)).slice(0, 8);
  };

  // ── Auth — single onAuthStateChange listener, no separate checkAuth call ────
  // onAuthStateChange fires immediately with the current session on mount,
  // so it replaces the old checkAuth() call entirely.
  useEffect(() => {
    loadSavedJobs();
    loadAppliedJobs();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user);
        fetchUserOnboardingData(session.user);
      } else {
        setUser(null);
        setUserName(null);
        setUserOnboardingData(null);
      }
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Initial filter props ────────────────────────────────────────────────────
  useEffect(() => {
    if (initialCountry) {
      setFilters(prev => ({ ...prev, country: initialCountry }));
      setDetectedCountry(initialCountry);
      localStorage.setItem('user_country', initialCountry);
      localStorage.setItem('user_changed_country', 'true');
    }
  }, [initialCountry]);

  useEffect(() => {
    if (initialRoleCategory) setFilters(prev => ({ ...prev, roleCategory: initialRoleCategory }));
  }, [initialRoleCategory]);

  useEffect(() => {
    if (initialJobType) setFilters(prev => ({ ...prev, jobType: initialJobType }));
  }, [initialJobType]);

  useEffect(() => {
    if (initialState) setFilters(prev => ({ ...prev, state: initialState }));
  }, [initialState]);

  useEffect(() => {
    if (initialTown) setFilters(prev => ({ ...prev, town: initialTown }));
  }, [initialTown]);

  // ── Country detection + first-visit popup ──────────────────────────────────
  useEffect(() => {
    if (initialCountry) return;
    const detectCountry = async () => {
      const userChangedCountry = localStorage.getItem('user_changed_country');
      if (userChangedCountry === 'true') {
        const savedCountry = localStorage.getItem('user_country');
        if (savedCountry && savedCountry !== 'Global') {
          setDetectedCountry(savedCountry);
          setFilters(prev => ({ ...prev, country: savedCountry }));
        }
        return;
      }
      const hasVisited = localStorage.getItem('has_visited_jobs');
      if (!hasVisited) {
        try {
          const response = await fetch('/api/geo');
          const data = await response.json();
          // api/geo now returns null when the visitor's country isn't
          // recognized, rather than guessing 'Nigeria' for everyone it
          // can't place — leave detectedCountry unset so the popup defaults
          // to 'Global' instead of confidently showing the wrong country.
          if (data.country) {
            setDetectedCountry(data.country);
            setFilters(prev => ({ ...prev, country: data.country }));
          }
        } catch {
          // Network/API failure — same reasoning, don't guess a country.
        }
        setShowCountryPopup(true);
      } else {
        const savedCountry = localStorage.getItem('user_country');
        if (savedCountry && savedCountry !== 'Global') {
          setDetectedCountry(savedCountry);
          setFilters(prev => ({ ...prev, country: savedCountry }));
        }
      }
    };
    detectCountry();
  }, []);


  // ── Desktop detection ───────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── URL params → filters ────────────────────────────────────────────────────
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');
    const sectorParam = searchParams.get('sector');
    const employmentTypeParam = searchParams.get('employmentType');
    const salaryMinParam = searchParams.get('salaryMin');
    const salaryMaxParam = searchParams.get('salaryMax');
    const remoteParam = searchParams.get('remote');
    const sortParam = searchParams.get('sort');
    const countryParam = searchParams.get('country');
    const locationSearchParam = searchParams.get('locationSearch');

    if (searchParam) { setSearchQuery(searchParam); setFilters(prev => ({ ...prev, search: searchParam })); }
    if (locationParam) setFilters(prev => ({ ...prev, location: locationParam.split(',') }));
    if (countryParam) {
      setFilters(prev => ({ ...prev, country: countryParam }));
      localStorage.setItem('user_country', countryParam);
      localStorage.setItem('user_changed_country', 'true');
    }
    if (sectorParam) setFilters(prev => ({ ...prev, sector: sectorParam.split(',') }));
    if (employmentTypeParam) setFilters(prev => ({ ...prev, employmentType: employmentTypeParam.split(',') }));
    if (salaryMinParam || salaryMaxParam) {
      setFilters(prev => ({ ...prev, salaryRange: { min: salaryMinParam ? parseInt(salaryMinParam) : 0, max: salaryMaxParam ? parseInt(salaryMaxParam) : 0 } }));
    }
    if (remoteParam === 'true') setFilters(prev => ({ ...prev, remote: true }));
    if (locationSearchParam) setFilters(prev => ({ ...prev, locationSearch: locationSearchParam }));
    if (sortParam === 'latest' || sortParam === 'salary') setSortBy(sortParam);
  }, [searchParams]);

  // ── Profile cache helpers ───────────────────────────────────────────────────
  const PROFILE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  const fetchUserProfile = async (u: any) => {
    if (!u) return;
    const cacheKey = `profile_cache_${u.id}`;
    const tsKey = `profile_cache_ts_${u.id}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      const ts = localStorage.getItem(tsKey);
      if (cached && ts && Date.now() - parseInt(ts, 10) < PROFILE_CACHE_TTL) {
        setUserName(JSON.parse(cached).full_name || null);
        return;
      }
    } catch {}
    const { data, error } = await supabase.from('profiles').select('full_name').eq('id', u.id).single();
    if (!error && data) {
      setUserName(data.full_name || null);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(tsKey, Date.now().toString());
      } catch {}
    }
  };

  const fetchUserOnboardingData = async (u: any) => {
    if (!u) return;
    const cacheKey = `onboarding_cache_${u.id}`;
    const tsKey = `onboarding_cache_ts_${u.id}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      const ts = localStorage.getItem(tsKey);
      if (cached && ts && Date.now() - parseInt(ts, 10) < PROFILE_CACHE_TTL) {
        setUserOnboardingData(JSON.parse(cached));
        return;
      }
    } catch {}
    try {
      const { data, error } = await supabase.from('onboarding_data').select('*').eq('user_id', u.id).single();
      if (error && error.code !== 'PGRST116') { console.error('Error fetching onboarding data:', error); return; }
      const parsed = data ? {
        target_roles: data.target_roles || [],
        cv_skills: data.cv_skills || [],
        preferred_locations: data.preferred_locations || [],
        experience_level: data.experience_level || null,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        job_type: data.job_type || null,
        sector: data.sector || null,
      } : {
        target_roles: [], cv_skills: [], preferred_locations: [],
        experience_level: null, salary_min: null, salary_max: null,
        job_type: null, sector: null,
      };
      setUserOnboardingData(parsed);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
        localStorage.setItem(tsKey, Date.now().toString());
      } catch {}
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  // ── Fetch functions moved here (before useEffects that call them) ─────────────
  const fetchLatestJobs = async (forceRefresh = false) => {
    try {
      setLatestJobsLoading(true);

      if (!forceRefresh) {
        const sessionCached = sessionStorage.getItem(STORAGE_KEYS.LATEST_JOBS_CACHE);
        const sessionTimestamp = sessionStorage.getItem(STORAGE_KEYS.LATEST_JOBS_CACHE_TS);
        const sessionVersion = sessionStorage.getItem(STORAGE_KEYS.LATEST_JOBS_CACHE_VERSION);

        if (sessionCached && sessionTimestamp && sessionVersion === siteType) {
          const age = Date.now() - parseInt(sessionTimestamp, 10);
          if (age < CLIENT_CACHE_DURATION) {
            try {
              const parsedJobs = JSON.parse(sessionCached);
              setLatestJobs(parsedJobs);
              setLatestJobsLoading(false);
              return;
            } catch { }
          }
        }
      }

      const JOBS_API_URL = 'https://jobs-api.joevicspro.workers.dev/jobs';
      const res = await fetch(JOBS_API_URL);
      if (!res.ok) throw new Error(`Jobs API error: ${res.status}`);
      const { jobs: allData, cacheVersion } = await res.json();

      const allData_raw = (allData || []);
      // Worker already filtered by ?site=global
      const allUiJobs = allData_raw.map((job: any) => transformJobToUI(job, 0, null));
      const enrichedUiJobs = await enrichWithApplyInApp(allUiJobs);
      setLatestJobs(enrichedUiJobs);
      setCurrentPage(1);

      try {
        sessionStorage.setItem(STORAGE_KEYS.LATEST_JOBS_CACHE, JSON.stringify(enrichedUiJobs));
        sessionStorage.setItem(STORAGE_KEYS.LATEST_JOBS_CACHE_TS, Date.now().toString());
        sessionStorage.setItem(STORAGE_KEYS.LATEST_JOBS_CACHE_VERSION, siteType);
      } catch (e) {
        console.warn('[JobList] sessionStorage write failed:', e);
      }
    } catch (error) {
      console.error('[JobList] Error fetching latest jobs:', error);
    } finally {
      setLatestJobsLoading(false);
    }
  };

  const fetchJobs = async (forceRefresh = false) => {
    try {
      setLoading(true);

      if (!forceRefresh) {
        try {
          const cachedJobs = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE);
          const cacheTimestamp = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE_TS);
          const cachedUserId = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE_USER);
          if (cachedJobs && cacheTimestamp) {
            const age = Date.now() - parseInt(cacheTimestamp, 10);
            const userMatches = (!user && !cachedUserId) || (user && cachedUserId === user.id);
            if (age < MATCHES_CACHE_DURATION && userMatches) {
              setJobs(JSON.parse(cachedJobs));
              setMatchesCachedAt(parseInt(cacheTimestamp, 10));
              setLoading(false);
              return;
            }
          }
        } catch { }
      }

      const JOBS_API_URL = 'https://jobs-api.joevicspro.workers.dev/jobs';
      const res = await fetch(JOBS_API_URL);
      if (!res.ok) throw new Error(`Jobs API error: ${res.status}`);
      const { jobs: data } = await res.json();
      // Worker already filtered by ?site=global

      // Matching is restricted to: (1) jobs posted in the last 14 days, and
      // (2) jobs in the user's selected country, or remote jobs — mirrors the
      // country/remote scoping already used on the Latest Jobs tab.
      const MATCH_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - MATCH_MAX_AGE_MS;
      const selectedCountry = filters.country || detectedCountry;

      const eligibleJobs = (data || []).filter((job: any) => {
        const dateStr = job.posted_date || job.created_at;
        if (dateStr) {
          const t = new Date(dateStr).getTime();
          if (!isNaN(t) && t < cutoffTime) return false;
        }

        if (selectedCountry && selectedCountry !== 'Global') {
          const jobCountries: string[] = Array.isArray(job.country) ? job.country : [];
          const inCountry = jobCountries.some((c: string) => c?.toLowerCase() === selectedCountry.toLowerCase());
          const jobLoc = job.location;
          const isRemote =
            (jobLoc && typeof jobLoc === 'object' && jobLoc.remote) ||
            (typeof jobLoc === 'string' && jobLoc.toLowerCase().includes('remote')) ||
            (job.job_type || job.employment_type || '').toLowerCase().includes('remote');
          if (!inCountry && !isRemote) return false;
        }

        return true;
      });

      const processedJobs = await processJobsWithMatching(eligibleJobs);
      processedJobs.sort((a, b) => (b.calculatedTotal || 0) - (a.calculatedTotal || 0));
      const enrichedProcessedJobs = await enrichWithApplyInApp(processedJobs);

      try {
        const now = Date.now();
        localStorage.setItem(STORAGE_KEYS.MATCHES_CACHE, JSON.stringify(enrichedProcessedJobs));
        localStorage.setItem(STORAGE_KEYS.MATCHES_CACHE_TS, now.toString());
        localStorage.setItem(STORAGE_KEYS.MATCHES_CACHE_USER, user?.id || '');
        setMatchesCachedAt(now);
      } catch (e) {
        console.warn('[JobList] localStorage write failed:', e);
      }

      setJobs(enrichedProcessedJobs);
    } catch (error) {
      console.error('[JobList] Error fetching matched jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch latest jobs trigger ───────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    if (latestFetchedRef.current) return;
    latestFetchedRef.current = true;
    fetchLatestJobs(); // always fetch from https://jobs-api.joevicspro.workers.dev/jobs
  }, [authChecked]);

  // ── Fetch matches trigger ───────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    if (activeTab !== 'matches') return;
    if (matchesFetchedRef.current) return;
    if (user && userOnboardingData === null) return;
    matchesFetchedRef.current = true;

    try {
      const cachedJobs = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE);
      const cacheTimestamp = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE_TS);
      const cachedUserId = localStorage.getItem(STORAGE_KEYS.MATCHES_CACHE_USER);

      if (cachedJobs && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        const userMatches = (!user && !cachedUserId) || (user && cachedUserId === user.id);
        if (age < MATCHES_CACHE_DURATION && userMatches) {
          setJobs(JSON.parse(cachedJobs));
          setMatchesCachedAt(parseInt(cacheTimestamp, 10));
          return;
        }
      }
    } catch { }

    fetchJobs();
  }, [authChecked, activeTab, user, userOnboardingData]);

  useEffect(() => {
    matchesFetchedRef.current = false;
    setJobs([]);
  }, [user?.id]);

  // ── Invalidate matches when the selected country changes ───────────────────
  // Matches are scoped to the user's selected country (+ remote). If they
  // change country on the Latest Jobs tab, cached matches for the old country
  // shouldn't keep showing for up to 24h — force a re-fetch next time the
  // Matches tab is viewed.
  const prevMatchCountryRef = useRef<string | null>(null);
  useEffect(() => {
    const current = filters.country || detectedCountry || '';
    if (prevMatchCountryRef.current !== null && prevMatchCountryRef.current !== current) {
      try {
        localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE);
        localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE_TS);
        localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE_USER);
      } catch { }
      matchesFetchedRef.current = false;
      setJobs([]);
      setMatchesCachedAt(null);
    }
    prevMatchCountryRef.current = current;
  }, [filters.country, detectedCountry]);

  const processJobsWithMatching = useCallback(async (jobRows: any[]): Promise<JobUI[]> => {
    if (!userOnboardingData || !user) {
      return jobRows.map((job: any) => transformJobToUI(job, 0, null));
    }

    const matchCache = matchCacheService.loadMatchCache(user.id);
    let cacheNeedsUpdate = false;
    const updatedCache = { ...matchCache };
    const batchSize = 20;
    const processedJobs: JobUI[] = [];

    for (let i = 0; i < jobRows.length; i += batchSize) {
      const batch = jobRows.slice(i, i + batchSize);
      const batchResults = batch.map((job: any) => {
        try {
          let matchResult;
          const cachedMatch = updatedCache[job.id];
          if (cachedMatch) {
            matchResult = { score: cachedMatch.score, breakdown: cachedMatch.breakdown, computedAt: cachedMatch.cachedAt };
          } else {
            const jobRow: JobRow = {
              role: job.role || job.title, related_roles: job.related_roles,
              ai_enhanced_roles: job.ai_enhanced_roles, skills_required: job.skills_required,
              ai_enhanced_skills: job.ai_enhanced_skills, location: job.location,
              experience_level: job.experience_level, salary_range: job.salary_range,
              employment_type: job.employment_type, sector: job.sector,
            };
            matchResult = scoreJob(jobRow, userOnboardingData);
            updatedCache[job.id] = { score: matchResult.score, breakdown: matchResult.breakdown, cachedAt: matchResult.computedAt };
            cacheNeedsUpdate = true;
          }
          const rsCapped = Math.min(80, matchResult.breakdown.rolesScore + matchResult.breakdown.skillsScore + matchResult.breakdown.sectorScore);
          const calculatedTotal = Math.round(rsCapped + matchResult.breakdown.locationScore + matchResult.breakdown.experienceScore + matchResult.breakdown.salaryScore + matchResult.breakdown.typeScore);
          return transformJobToUI(job, calculatedTotal, matchResult.breakdown);
        } catch {
          return transformJobToUI(job, 0, null);
        }
      });
      processedJobs.push(...batchResults);
      if (i + batchSize < jobRows.length) await new Promise(resolve => setTimeout(resolve, 0));
    }

    if (cacheNeedsUpdate) matchCacheService.saveMatchCache(user.id, updatedCache);
    return processedJobs;
  }, [user, userOnboardingData]);

  const transformJobToUI = (job: any, matchScore: number, breakdown: any): JobUI => {
    const finalMatchScore = user ? matchScore : 0;
    const finalBreakdown = user ? breakdown : null;

    let locationStr = 'Location not specified';
    if (typeof job.location === 'string') { locationStr = job.location; }
    else if (job.location && typeof job.location === 'object') {
      const loc = job.location;
      if (loc.remote) { const place = [loc.city, loc.state, loc.country].filter(Boolean).join(', '); locationStr = place ? `Remote · ${place}` : 'Remote'; }
      else { const parts = [loc.city, loc.state, loc.country].filter(Boolean); locationStr = parts.length > 0 ? parts.join(', ') : 'Location not specified'; }
    }

    let companyStr = 'Unknown Company';
    if (typeof job.company === 'string') { companyStr = job.company; }
    else if (job.company && typeof job.company === 'object') { companyStr = job.company.name || 'Unknown Company'; }

    let salaryStr = '';
    if (typeof job.salary === 'string') { salaryStr = job.salary; }
    else if (job.salary_range && typeof job.salary_range === 'object') {
      const sal = job.salary_range;
      if (sal.min !== null && sal.currency) salaryStr = `${sal.currency} ${sal.min.toLocaleString()} ${sal.period || ''}`.trim();
    }

    const getRelativeTime = (dateString: string | null): string | undefined => {
      if (!dateString) return undefined;
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInHours < 24) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) { const weeks = Math.floor(diffInDays / 7); return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`; }
        if (diffInDays < 365) { const months = Math.floor(diffInDays / 30); return months === 1 ? '1 month ago' : `${months} months ago`; }
        const years = Math.floor(diffInDays / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
      } catch { return undefined; }
    };

    return {
      id: job.id, slug: job.slug || job.id, title: job.title || 'Untitled Job',
      company: companyStr, location: locationStr, rawLocation: job.location,
      country: job.country || [], salary: salaryStr, match: finalMatchScore,
      calculatedTotal: finalMatchScore, type: job.type || job.employment_type || '',
      breakdown: finalBreakdown, postedDate: getRelativeTime(job.posted_date || job.created_at),
      sector: job.sector || '', role_category: job.role_category || '',
      description: job.description || job.job_description || '',
      apply_in_app: !!job.apply_in_app, screening_enabled: !!job.screening_enabled,
      status: job.status, deadline: job.deadline,
    };
  };

  const loadSavedJobs = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    if (saved) { try { setSavedJobs(JSON.parse(saved)); } catch { } }
  };

  const loadAppliedJobs = () => {
    if (typeof window === 'undefined') return;
    const applied = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS);
    if (applied) { try { setAppliedJobs(JSON.parse(applied)); } catch { } }
  };

  const handleSave = (jobId: string) => {
    const newSaved = savedJobs.includes(jobId) ? savedJobs.filter(id => id !== jobId) : [...savedJobs, jobId];
    setSavedJobs(newSaved);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(newSaved));
  };

  const handleApply = (jobId: string) => {
    const newApplied = appliedJobs.includes(jobId) ? appliedJobs.filter(id => id !== jobId) : [...appliedJobs, jobId];
    setAppliedJobs(newApplied);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(newApplied));
  };

  const handleRefreshMatches = async () => {
    setRefreshingMatches(true);
    try {
      localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE);
      localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE_TS);
      localStorage.removeItem(STORAGE_KEYS.MATCHES_CACHE_USER);
      sessionStorage.removeItem(STORAGE_KEYS.LATEST_JOBS_CACHE);
      sessionStorage.removeItem(STORAGE_KEYS.LATEST_JOBS_CACHE_TS);
      sessionStorage.removeItem(STORAGE_KEYS.LATEST_JOBS_CACHE_VERSION);
      if (user) matchCacheService.clearMatchCache(user.id);

      setCurrentPage(1);
      setJobs([]);
      setLatestJobs([]);
      latestFetchedRef.current = false;
      matchesFetchedRef.current = false;

      if (activeTab === 'latest') {
        await fetchLatestJobs(true);
      } else {
        await fetchJobs(true);
      }
    } catch (error) {
      console.error('[JobList] Error refreshing:', error);
    } finally {
      setRefreshingMatches(false);
    }
  };

  const handleShowBreakdown = (job: JobUI) => {
    const breakdown = job.breakdown || { rolesScore: 0, rolesReason: '', skillsScore: 0, skillsReason: '', sectorScore: 0, sectorReason: '', locationScore: 0, experienceScore: 0, salaryScore: 0, typeScore: 0 };
    setMatchModalData({ breakdown, totalScore: job.calculatedTotal || job.match || 0, jobTitle: job.title, companyName: job.company });
    setMatchModalOpen(true);
  };

  const handleCountryPopupSave = (country: string) => {
    const isGlobal = !country || country === 'Global';
    if (isGlobal) {
      setFilters(prev => ({ ...prev, country: '', location: [] }));
      setDetectedCountry('');
      localStorage.setItem('user_country', 'Global');
    } else {
      setFilters(prev => ({ ...prev, country }));
      setDetectedCountry(country);
      localStorage.setItem('user_country', country);
    }
    localStorage.setItem('user_changed_country', 'true');
    localStorage.setItem('has_visited_jobs', 'true');
    setShowCountryPopup(false);
  };

  const clearAllFilters = () => {
    setFilters({ search: '', location: [], sector: [], employmentType: [], salaryRange: undefined, remote: false, country: '', roleCategory: '', jobType: '', state: '', town: '', locationSearch: '' });
    setSearchQuery('');
    localStorage.setItem('user_changed_country', 'false');
    const params = new URLSearchParams();
    if (sortBy !== 'latest') params.set('sort', sortBy);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const filteredJobs = useMemo(() => {
    if (activeTab !== 'latest') return [];
    if (latestJobsLoading && latestJobs.length === 0) return [];

    return latestJobs.filter(job => {
      if (appliedJobs.includes(job.id)) return false;

      // Exclude expired listings from the browsable list. Detail pages
      // deliberately still render expired jobs (kept out of Google's index
      // separately) — this only affects what shows up here.
      const jobStatus = (job as any).status;
      const jobDeadline = (job as any).deadline;
      const isExpired = jobStatus === 'expired' || (jobDeadline && new Date(jobDeadline) < new Date());
      if (isExpired) return false;

      const jobTypeLower = job.type?.toLowerCase() || '';

      const query = filters.search?.toLowerCase();
      if (query) {
        const titleMatch = job.title.toLowerCase().includes(query);
        const companyMatch = job.company.toLowerCase().includes(query);
        const descriptionMatch = job.description?.toLowerCase().includes(query) || false;
        let locationMatch = false;
        const jobLoc = job.location;
        if (typeof jobLoc === 'string') { locationMatch = jobLoc.toLowerCase().includes(query); }
        else if (jobLoc && typeof jobLoc === 'object') {
          const loc = jobLoc as Record<string, unknown>;
          locationMatch = String(loc.city || '').toLowerCase().includes(query) || String(loc.state || '').toLowerCase().includes(query) || String(loc.country || '').toLowerCase().includes(query);
        }
        // Also match against job.country array
        if (!titleMatch && !companyMatch && !descriptionMatch && !locationMatch) return false;
      }

      if (filters.location && filters.location.length > 0) {
        const jobLoc = job.location;
        let locationMatch = false;
        if (typeof jobLoc === 'string') { locationMatch = filters.location.some((loc: string) => jobLoc.toLowerCase().includes(loc.toLowerCase())); }
        else if (jobLoc && typeof jobLoc === 'object') {
          const loc = jobLoc as Record<string, unknown>;
          locationMatch = filters.location.some((locName: string) => String(loc.state || '').toLowerCase().includes(locName.toLowerCase()) || String(loc.city || '').toLowerCase().includes(locName.toLowerCase()));
        }
        if (!locationMatch) return false;
      }

if (filters.country && filters.country !== 'Global') {
  const jobCountries: string[] = (job as any).country || [];
  if (!jobCountries.some(c => c.toLowerCase() === filters.country.toLowerCase())) return false;
}

if (filters.remote) {
  const jobType = (job as any).job_type?.toLowerCase() || '';
  const jobLoc = job.location;
  const isRemoteByType = jobType === 'remote' || jobType === 'hybrid';
  let isRemoteByLocation = false;
  if (typeof jobLoc === 'string') { isRemoteByLocation = jobLoc.toLowerCase().includes('remote'); }
  else if (jobLoc && typeof jobLoc === 'object') { isRemoteByLocation = Boolean((jobLoc as Record<string, unknown>).remote); }
  if (!isRemoteByType && !isRemoteByLocation) return false;
}

      if (filters.employmentType && filters.employmentType.length > 0) {
        const jobLoc = job.location;
        const typeMatch = filters.employmentType.some((type: string) => {
          if (type.toLowerCase() === 'remote') {
            if (typeof jobLoc === 'string') return jobLoc.toLowerCase().includes('remote');
            else if (jobLoc && typeof jobLoc === 'object') return Boolean((jobLoc as Record<string, unknown>).remote);
            return false;
          }
          return jobTypeLower.includes(type.toLowerCase()) || type.toLowerCase().includes(jobTypeLower);
        });
        if (!typeMatch) return false;
      }

      if (filters.salaryRange) {
        const getSalaryNumber = (salary: string) => { if (!salary) return 0; const match = salary.match(/[\d,]+/); return match ? parseInt(match[0].replace(/,/g, '')) : 0; };
        const jobSalary = getSalaryNumber(job.salary || '');
        if (filters.salaryRange.min > 0 && jobSalary < filters.salaryRange.min) return false;
        if (filters.salaryRange.max > 0 && jobSalary > filters.salaryRange.max) return false;
      }

      if (filters.locationSearch?.trim()) {
        const needle = filters.locationSearch.trim().toLowerCase();
        const haystack = `${job.location || ''} ${JSON.stringify(job.rawLocation || '')}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      if (filters.sector && filters.sector.length > 0) {
        const jobSector = job.sector?.toLowerCase() || '';
        if (!filters.sector.some((sector: string) => jobSector.includes(sector.toLowerCase()) || sector.toLowerCase().includes(jobSector))) return false;
      }

      if (filters.roleCategory) {
        const jobRoleCat = job.role_category?.toLowerCase() || '';
        if (!jobRoleCat.includes(filters.roleCategory.toLowerCase()) && !filters.roleCategory.toLowerCase().includes(jobRoleCat)) return false;
      }

      return true;
    });
  }, [latestJobs, filters, appliedJobs, latestJobsLoading, activeTab, initialCountry]);

  const sortedJobs = useMemo(() => {
    if (activeTab !== 'latest') return [];
    return [...filteredJobs].sort((a, b) => {
      if (sortBy === 'salary') {
        const getSalaryNumber = (salary: string) => { if (!salary) return 0; const match = salary.match(/[\d,]+/); return match ? parseInt(match[0].replace(/,/g, '')) : 0; };
        return getSalaryNumber(b.salary || '') - getSalaryNumber(a.salary || '');
      }
      return 0;
    });
  }, [filteredJobs, sortBy, activeTab]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE_DISPLAY;
    return sortedJobs.slice(startIndex, startIndex + JOBS_PER_PAGE_DISPLAY);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE_DISPLAY);

  const matchedJobs = useMemo(() => {
    if (activeTab !== 'matches') return [];
    let list = jobs.filter(job => {
      if (appliedJobs.includes(job.id)) return false;
      const jobStatus = (job as any).status;
      const jobDeadline = (job as any).deadline;
      const isExpired = jobStatus === 'expired' || (jobDeadline && new Date(jobDeadline) < new Date());
      return !isExpired;
    });

    if (matchSearch.trim()) {
      const q = matchSearch.trim().toLowerCase();
      list = list.filter(job =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        (typeof job.location === 'string' && job.location.toLowerCase().includes(q))
      );
    }

    if (matchSortBy === 'salary') {
      const getSalaryNumber = (salary: string) => { if (!salary) return 0; const m = salary.match(/[\d,]+/); return m ? parseInt(m[0].replace(/,/g, '')) : 0; };
      list = [...list].sort((a, b) => getSalaryNumber(b.salary || '') - getSalaryNumber(a.salary || ''));
    } else if (matchSortBy === 'latest') {
      // jobs already come back newest-first from the API; nothing else to do
    }
    // 'match' — jobs already sorted by calculatedTotal desc from fetchJobs()

    return list;
  }, [jobs, appliedJobs, activeTab, matchSearch, matchSortBy]);

  // Reset to page 1 whenever the underlying matches list changes shape
  useEffect(() => {
    setMatchPage(1);
  }, [matchSearch, matchSortBy, jobs]);

  // ── Floating filter/scroll buttons ──────────────────────────────────────────
  // The filter trigger only lived inside the search box near the top of the
  // page, so reaching it while browsing a long results list meant scrolling
  // all the way back up. This mirrors it as a floating button once the user
  // has scrolled past the search bar, alongside scroll-to-top/bottom, which
  // show or hide based on how close the user already is to each end.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setFabScrollY(y);
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        setNearPageBottom(scrollableHeight <= 0 || y >= scrollableHeight - 300);
        // Re-arm the dismissed state once scrolled back near the top —
        // dismissing is a "not right now" for this scroll session, not
        // "never show again", so it naturally comes back next time the
        // user scrolls back down.
        if (y <= 400) setFabDismissed(false);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paginatedMatchedJobs = useMemo(() => {
    const startIndex = (matchPage - 1) * JOBS_PER_PAGE_DISPLAY;
    return matchedJobs.slice(startIndex, startIndex + JOBS_PER_PAGE_DISPLAY);
  }, [matchedJobs, matchPage]);

  const matchTotalPages = Math.ceil(matchedJobs.length / JOBS_PER_PAGE_DISPLAY);

  const handleTabChange = (tab: 'latest' | 'matches') => {
    setActiveTab(tab);
    localStorage.setItem('active_jobs_tab', tab);
  };

  const hasActiveFilters = () => !!(
    filters.location?.length || filters.sector?.length ||
    filters.employmentType?.length || filters.salaryRange ||
    filters.remote || filters.search || filters.country
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location?.length) count += filters.location.length;
    if (filters.sector?.length) count += filters.sector.length;
    if (filters.employmentType?.length) count += filters.employmentType.length;
    if (filters.salaryRange) count += 1;
    if (filters.remote) count += 1;
    if (filters.search) count += 1;
    return count;
  };

  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema searchAction={{ target: 'https://jobmeter.app/?q={search_term_string}', queryInput: 'required name=search_term_string' }} />

      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>Find Your Next Opportunity</h1>
            <p className="text-lg" style={{ color: theme.colors.text.secondary }}>Browse the latest job openings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4 pt-2">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ backgroundColor: '#F1F5F9' }}>
            <button
              onClick={() => handleTabChange('latest')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={activeTab === 'latest'
                ? { backgroundColor: '#2563EB', color: '#ffffff', boxShadow: '0 2px 8px rgba(37,99,235,0.35)' }
                : { backgroundColor: 'transparent', color: '#64748B' }}
            >
              📋 Latest Jobs
            </button>
            <button
              onClick={() => handleTabChange('matches')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 relative"
              style={activeTab === 'matches'
                ? { backgroundColor: '#1D4ED8', color: '#ffffff', boxShadow: '0 2px 8px rgba(29,78,216,0.35)' }
                : { backgroundColor: 'transparent', color: '#64748B' }}
            >
              <Sparkles size={15} style={{ color: activeTab === 'matches' ? '#ffffff' : '#1D4ED8' }} />
              My Matches
              {activeTab !== 'matches' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1D4ED8', color: '#ffffff' }}>✦</span>
              )}
            </button>
          </div>
        </div>

        {/* Matches tab header */}
        {activeTab === 'matches' && (
          <div className="px-6 py-3">
            <div className="rounded-xl p-3 border" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderColor: '#BFDBFE' }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#1E3A8A' }}>
                    <Sparkles size={15} style={{ color: '#1D4ED8' }} />
                    {loading
                      ? 'Calculating your match scores…'
                      : <>Found <span className="font-bold" style={{ color: '#1D4ED8' }}>{matchedJobs.length}</span> job{matchedJobs.length !== 1 ? 's' : ''} matched to your profile</>}
                  </p>
                  {!loading && matchesCachedAt && (
                    <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>
                      ⏱ Last calculated: {(() => {
                        const diffMs = Date.now() - matchesCachedAt;
                        const diffMin = Math.floor(diffMs / 60000);
                        const diffHr = Math.floor(diffMs / 3600000);
                        const diffDay = Math.floor(diffMs / 86400000);
                        if (diffMin < 1) return 'just now';
                        if (diffMin < 60) return `${diffMin}m ago`;
                        if (diffHr < 24) return `${diffHr}h ago`;
                        return `${diffDay}d ago`;
                      })()} · refreshes daily
                    </p>
                  )}
                </div>
                {user && (
                  <button
                    onClick={handleRefreshMatches}
                    disabled={refreshingMatches}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all disabled:opacity-60"
                    style={{ backgroundColor: '#ffffff', borderColor: '#1D4ED8', color: '#1D4ED8' }}
                  >
                    <RefreshCw size={14} className={refreshingMatches ? 'animate-spin' : ''} />
                    {refreshingMatches ? 'Calculating…' : 'Recalculate'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Matches tab job list */}
        {activeTab === 'matches' && (
          <div className="px-6 py-4">
            {/* Not logged in and auth has resolved — show inline sign-in prompt */}
            {!user && authChecked ? (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                  <Sparkles size={28} style={{ color: '#1D4ED8' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text.primary }}>Sign in to see your matches</h3>
                <p className="text-sm mb-5" style={{ color: theme.colors.text.secondary }}>Create a free account and we'll match you to jobs based on your skills, experience, and preferences.</p>
                <button onClick={() => setAuthModalOpen(true)} className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all" style={{ backgroundColor: '#1D4ED8' }}>
                  Sign Up Free
                </button>
              </div>
            ) : (loading || (jobs.length === 0 && !matchesCachedAt)) ? (
              /* Animated multi-step "scanning" state while match scores are calculated */
              <MatchScanAnimation />
            ) : matchedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4"><Search size={24} style={{ color: theme.colors.warning }} /></div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                  {matchSearch ? 'No matches found for your search' : 'No matches found yet'}
                </h3>
                <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
                  {matchSearch ? 'Try a different search term or clear it to see all your matches.' : 'Update your profile to improve matching or check back later for new opportunities'}
                </p>
                {matchSearch ? (
                  <button onClick={() => setMatchSearch('')} className="px-4 py-2 text-sm rounded-lg font-medium transition-colors" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>Clear search</button>
                ) : (
                  <button onClick={() => router.push('/onboarding')} className="px-4 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium">Update Profile</button>
                )}
              </div>
            ) : (
              <>
                {/* Search + sort — parity with Latest Jobs so a low top match isn't a dead end */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.text.muted }} />
                    <input
                      type="text"
                      value={matchSearch}
                      onChange={(e) => setMatchSearch(e.target.value)}
                      placeholder="Search your matches by title, company, location..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-lg border text-sm outline-none focus:border-blue-400 transition-colors"
                      style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.border.DEFAULT, color: theme.colors.text.primary }}
                    />
                    {matchSearch && (
                      <button onClick={() => setMatchSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full">
                        <X size={14} style={{ color: theme.colors.text.secondary }} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { const next = matchSortBy === 'match' ? 'salary' : matchSortBy === 'salary' ? 'latest' : 'match'; setMatchSortBy(next); }}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all whitespace-nowrap"
                    style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.border.DEFAULT, color: theme.colors.text.primary }}
                  >
                    <ArrowUpDown size={12} />
                    {matchSortBy === 'match' ? 'Best Match' : matchSortBy === 'salary' ? 'Highest Salary' : 'Newest'}
                  </button>
                </div>

                {paginatedMatchedJobs.map((job, index) => {
                  const globalIndex = (matchPage - 1) * JOBS_PER_PAGE_DISPLAY + index;
                  return (
                    <React.Fragment key={job.id}>
                      <JobCard job={job} savedJobs={savedJobs} appliedJobs={appliedJobs} onSave={handleSave} onApply={handleApply} onShowBreakdown={handleShowBreakdown} showMatch={true} matchRank={globalIndex} />

                      {index === 0 && (
                        <div className="w-full overflow-hidden" style={{ margin: 0, padding: '3px 0' }}>
                          <AdUnit slot={AD_SLOTS.BANNER} format="auto" style={{ display: 'block' }} />
                        </div>
                      )}

                      {(index + 1) % 5 === 0 && (
                        <div className="w-full overflow-hidden" style={{ margin: 0, padding: '3px 0' }}>
                          <AdUnit
                            key={`infeed-match-${matchPage}-${index}`}
                            slot={AD_SLOTS.IN_FEED}
                            format="fluid"
                            layoutKey={AD_SLOTS.IN_FEED_LAYOUT_KEY}
                            style={{ display: 'block' }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Pagination — keeps DOM/ad count bounded so tab switches stay fast */}
                {matchTotalPages > 1 && (
                  <div className="flex items-center justify-center py-6 space-x-2">
                    <button onClick={() => setMatchPage(p => Math.max(1, p - 1))} disabled={matchPage === 1}
                      className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderColor: theme.colors.border.DEFAULT, color: matchPage === 1 ? theme.colors.text.muted : theme.colors.text.primary, backgroundColor: matchPage === 1 ? theme.colors.background.muted : 'transparent' }}>
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {(() => { const pages = []; const max = 5; let start = Math.max(1, matchPage - Math.floor(max / 2)); let end = Math.min(matchTotalPages, start + max - 1); if (end - start + 1 < max) start = Math.max(1, end - max + 1);
                        for (let i = start; i <= end; i++) pages.push(<button key={i} onClick={() => setMatchPage(i)} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${matchPage === i ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}`} style={{ backgroundColor: matchPage === i ? '#1D4ED8' : 'transparent' }}>{i}</button>);
                        return pages; })()}
                    </div>
                    <button onClick={() => setMatchPage(p => Math.min(matchTotalPages, p + 1))} disabled={matchPage === matchTotalPages}
                      className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderColor: theme.colors.border.DEFAULT, color: matchPage === matchTotalPages ? theme.colors.text.muted : theme.colors.text.primary, backgroundColor: matchPage === matchTotalPages ? theme.colors.background.muted : 'transparent' }}>
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Search + Filters — Latest tab only */}
        {activeTab === 'latest' && (
          <div className="px-6 py-6 space-y-5">
            {/* Search bar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity blur"></div>
              <input type="text" placeholder="Search by job title, company, location, or keywords..." value={filters.search}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilters(prev => ({ ...prev, search: v })); setSearchQuery(v);
                  setFilteredSuggestions(getSuggestions(v)); setShowSuggestions(v.length > 0);
                  const params = new URLSearchParams(searchParams.toString());
                  v ? params.set('search', v) : params.delete('search');
                  router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
                }}
                onFocus={() => setShowSuggestions(filters.search.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="relative w-full pl-6 pr-24 py-5 rounded-xl border-2 outline-none focus:ring-0 focus:border-blue-500 transition-all text-base font-medium shadow-lg hover:shadow-xl z-10 placeholder:text-gray-400"
                style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.primary.DEFAULT, color: theme.colors.text.primary }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                {filters.search && (
                  <button onClick={() => { setFilters(prev => ({ ...prev, search: '' })); setSearchQuery(''); const params = new URLSearchParams(searchParams.toString()); params.delete('search'); router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname); }} className="p-1.5 hover:bg-gray-100 rounded-full transition-all">
                    <X size={16} style={{ color: theme.colors.text.secondary }} />
                  </button>
                )}
                <button onClick={() => setFiltersOpen(true)} className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: hasActiveFilters() ? theme.colors.primary.DEFAULT : theme.colors.primary.DEFAULT + '15', color: hasActiveFilters() ? '#ffffff' : theme.colors.primary.DEFAULT }} title="Filters">
                  <SlidersHorizontal size={16} />
                  {hasActiveFilters() && <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center leading-none">{getActiveFilterCount()}</span>}
                </button>
              </div>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-t-0 rounded-b-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button key={index} onClick={() => { setFilters(prev => ({ ...prev, search: suggestion })); setSearchQuery(suggestion); setShowSuggestions(false); router.replace(`${pathname}?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(searchParams.toString())), search: suggestion }).toString()}`); }}
                      className="w-full px-5 py-3 text-left hover:bg-blue-50 transition-colors text-sm" style={{ color: theme.colors.text.primary }}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country dropdown + Upload CV + Apply for Me — same line desktop, wraps on mobile */}
            <div className="flex flex-wrap items-center gap-2 w-full min-w-0 relative">
              <div style={{ flex: "0 1 170px", minWidth: 0 }}>
                <select value={filters.remote ? '__remote__' : (filters.country || detectedCountry || 'Global')}
                  onChange={(e) => {
                    const v = e.target.value;
                    // Remote option — clears country, sets remote flag
                    if (v === '__remote__') {
                      setFilters(prev => ({ ...prev, country: '', location: [], remote: true }));
                      setDetectedCountry('');
                      localStorage.setItem('user_country', 'Global');
                      localStorage.setItem('user_changed_country', 'true');
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('country');
                      params.set('remote', 'true');
                      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
                      return;
                    }
                    // All countries filter in-place — jobmeter.app has all jobs
                    if (v === 'Global') {
                      setFilters(prev => ({ ...prev, country: '', location: [], remote: false }));
                      setDetectedCountry('');
                      localStorage.setItem('user_country', 'Global');
                    } else if (v) {
                      setFilters(prev => ({ ...prev, country: v, location: [], remote: false }));
                      setDetectedCountry(v);
                      localStorage.setItem('user_country', v);
                    }
                    localStorage.setItem('user_changed_country', 'true');
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('remote');
                    v && v !== 'Global' ? params.set('country', v) : params.delete('country');
                    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
                  }}
                  className="w-full px-2 py-2.5 rounded-lg border cursor-pointer font-medium text-sm"
                  style={{ backgroundColor: filters.country ? theme.colors.primary.DEFAULT + '10' : theme.colors.background.DEFAULT, borderColor: filters.country ? theme.colors.primary.DEFAULT : theme.colors.border.DEFAULT, color: theme.colors.text.primary, height: '42px' }}
                >
                  <option value="Global">🌍 Global</option>
                  <option value="__remote__">🌐 Remote Jobs</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                  <option value="Rwanda">🇷🇼 Rwanda</option>
                </select>
              </div>

              {!user && (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  disabled={cvStatus === 'uploading' || cvStatus === 'parsing'}
                  className="flex-1 px-3 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ backgroundColor: theme.colors.primary.DEFAULT, color: '#ffffff', height: '42px', minWidth: '160px' }}
                >
                  {cvStatus === 'uploading' || cvStatus === 'parsing' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get Matched'
                  )}
                </button>
              )}

            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/jpg,image/png"
              onChange={handleCVChange}
              className="hidden"
            />

            {/* Results count + sort + refresh */}
            {!latestJobsLoading && latestJobs.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {filteredJobs.length > 0 && <p className="text-sm font-medium" style={{ color: theme.colors.text.primary }}>{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</p>}
                  {hasActiveFilters() && <button onClick={clearAllFilters} className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors">Clear all filters</button>}
                </div>
                <div className="flex items-center gap-2">
                  {refreshingMatches && <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.text.secondary }}><RefreshCw size={14} className="animate-spin" />Refreshing...</div>}
                  <button onClick={() => { const next = sortBy === 'latest' ? 'salary' : 'latest'; setSortBy(next); const params = new URLSearchParams(searchParams.toString()); params.set('sort', next); router.replace(`${pathname}?${params.toString()}`); }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.border.DEFAULT }}>
                    <ArrowUpDown size={12} />{sortBy === 'latest' ? 'Newest' : 'Salary'}
                  </button>
                  <button onClick={handleRefreshMatches} disabled={refreshingMatches}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50"
                    style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.border.DEFAULT }}>
                    <RefreshCw size={12} className={refreshingMatches ? 'animate-spin' : ''} />Refresh
                  </button>
                </div>
              </div>
            )}

            <JobFilters filters={filters} resultCount={filteredJobs.length} onFiltersChange={(newFilters: any) => {
              setFilters(newFilters);
              const params = new URLSearchParams();
              if (newFilters.search) params.set('search', newFilters.search);
              if (newFilters.sector) params.set('sector', newFilters.sector);
              if (newFilters.role) params.set('role', newFilters.role);
              if (newFilters.state) params.set('state', newFilters.state);
              if (newFilters.town) params.set('town', newFilters.town);
              if (newFilters.locationSearch) params.set('locationSearch', newFilters.locationSearch);
              if (newFilters.jobType?.length) params.set('jobType', newFilters.jobType.join(','));
              if (newFilters.workMode?.length) params.set('workMode', newFilters.workMode.join(','));
              // Was previously gated on a `.enabled` field that doesn't
              // exist anywhere on salaryRange's actual shape ({min, max}),
              // so this branch never fired — salary filters worked (the
              // filtering logic reads filters.salaryRange directly) but
              // never made it into a shareable URL.
              if (newFilters.salaryRange) { if (newFilters.salaryRange.min > 0) params.set('salaryMin', newFilters.salaryRange.min.toString()); if (newFilters.salaryRange.max > 0) params.set('salaryMax', newFilters.salaryRange.max.toString()); }
              if (sortBy !== 'latest') params.set('sort', sortBy);
              router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
            }} isOpen={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)} onClearAll={clearAllFilters} />

            {/* Loading spinner — shown while jobs haven't arrived yet */}
            {latestJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Loading jobs...</p>
              </div>
            )}

            {/* Job list */}
            <div className="py-2 space-y-3">
              {activeTab === 'latest' && latestJobs.length > 0 && (
                <>
                  {sortedJobs.length === 0 && !latestJobsLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Search size={24} style={{ color: theme.colors.text.muted }} /></div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text.primary }}>{filters.search ? 'No matching jobs found' : 'No jobs available'}</h3>
                      <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>{filters.search ? 'Try adjusting your search terms or filters to find more opportunities' : 'Try again or check your internet connection'}</p>
                      {hasActiveFilters() && <button onClick={clearAllFilters} className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">Clear filters</button>}
                    </div>
                  ) : (
                    <>
                      {paginatedJobs.map((job, index) => (
                        <React.Fragment key={job.id}>
                          <JobCard job={job} savedJobs={savedJobs} appliedJobs={appliedJobs} onSave={handleSave} onApply={handleApply} onShowBreakdown={handleShowBreakdown} showMatch={false} />

                          {/* Ad after job card #1 */}
                          {index === 0 && (
                            <div className="w-full overflow-hidden" style={{ margin: 0, padding: '3px 0' }}>
                              <AdUnit slot={AD_SLOTS.BANNER} format="auto" style={{ display: 'block' }} />
                            </div>
                          )}

                          {/* Ad after every 5th job card: card 5, 10, 15, 20 (index 4,9,14,19) */}
                          {(index + 1) % 5 === 0 && (
                            <div className="w-full overflow-hidden" style={{ margin: 0, padding: '3px 0' }}>
                              <AdUnit
                                key={`infeed-${currentPage}-${index}`}
                                slot={AD_SLOTS.IN_FEED}
                                format="fluid"
                                layoutKey={AD_SLOTS.IN_FEED_LAYOUT_KEY}
                                style={{ display: 'block' }}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}

                  {/* Display bottom ad before pagination — 320x250 mobile, 728x90 desktop */}
                  {!latestJobsLoading && sortedJobs.length > 0 && (
                    <div className="w-full flex justify-center overflow-hidden" style={{ margin: 0, padding: '3px 0' }}>
                      {/* Mobile: 320x250 */}
                      <div className="block lg:hidden" style={{ width: '320px', height: '250px' }}>
                        <AdUnit
                          key={`display-bottom-mobile-${currentPage}`}
                          slot={AD_SLOTS.DISPLAY_BOTTOM}
                          format="fixed"
                          style={{ display: 'inline-block', width: '320px', height: '250px' }}
                        />
                      </div>
                      {/* Desktop: leaderboard */}
                      <div className="hidden lg:block" style={{ width: '728px', height: '90px' }}>
                        <AdUnit
                          key={`display-bottom-desktop-${currentPage}`}
                          slot={AD_SLOTS.DISPLAY_BOTTOM}
                          format="fixed"
                          style={{ display: 'inline-block', width: '728px', height: '90px' }}
                        />
                      </div>
                    </div>
                  )}

                  {totalPages > 1 && !latestJobsLoading && (
                    <div className="flex items-center justify-center py-6 space-x-2">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: theme.colors.border.DEFAULT, color: currentPage === 1 ? theme.colors.text.muted : theme.colors.text.primary, backgroundColor: currentPage === 1 ? theme.colors.background.muted : 'transparent' }}>
                        Previous
                      </button>
                      <div className="flex items-center space-x-1">
                        {(() => { const pages = []; const max = 5; let start = Math.max(1, currentPage - Math.floor(max / 2)); let end = Math.min(totalPages, start + max - 1); if (end - start + 1 < max) start = Math.max(1, end - max + 1);
                          for (let i = start; i <= end; i++) pages.push(<button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === i ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}`} style={{ backgroundColor: currentPage === i ? theme.colors.primary.DEFAULT : 'transparent' }}>{i}</button>);
                          return pages; })()}
                      </div>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: theme.colors.border.DEFAULT, color: currentPage === totalPages ? theme.colors.text.muted : theme.colors.text.primary, backgroundColor: currentPage === totalPages ? theme.colors.background.muted : 'transparent' }}>
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        )}

        {/* First-visit country selection popup */}
        {/* Floating filter + scroll buttons — right side, above the bottom
            nav (h-16 = 64px), only once scrolled past the search bar. */}
        {fabScrollY > 400 && !fabDismissed && (
          <div className="fixed right-4 bottom-24 z-40 flex flex-col items-center gap-2.5">
            <button
              onClick={() => setFabDismissed(true)}
              className="flex items-center justify-center w-6 h-6 rounded-full shadow-md bg-gray-700 hover:bg-gray-800 transition-colors"
              aria-label="Hide"
            >
              <X size={13} className="text-white" />
            </button>

            {activeTab === 'latest' && (
              <button
                onClick={() => setFiltersOpen(true)}
                className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={20} className="text-white" />
                {hasActiveFilters() && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center leading-none">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            )}

            {/* Single scroll button, mutually exclusive: down while there's
                more to see below, up once close to the bottom — not both
                at once. */}
            <button
              onClick={() => window.scrollTo({
                top: nearPageBottom ? 0 : document.documentElement.scrollHeight,
                behavior: 'smooth',
              })}
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg border transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: theme.colors.background.DEFAULT, borderColor: theme.colors.border.DEFAULT }}
              aria-label={nearPageBottom ? 'Scroll to top' : 'Scroll to bottom'}
            >
              {nearPageBottom ? (
                <ChevronUp size={20} style={{ color: theme.colors.text.primary }} />
              ) : (
                <ChevronDown size={20} style={{ color: theme.colors.text.primary }} />
              )}
            </button>
          </div>
        )}

        {showCountryPopup && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: theme.colors.background.DEFAULT }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Globe size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: theme.colors.text.primary }}>Where are you based?</h2>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>We'll show you the most relevant jobs</p>
                </div>
              </div>
              <select
                defaultValue={detectedCountry || 'Global'}
                id="country-popup-select"
                className="w-full mt-4 px-4 py-3 rounded-xl border-2 font-medium text-sm focus:outline-none focus:border-blue-500 transition-colors"
                style={{ backgroundColor: theme.colors.background.muted, borderColor: theme.colors.border.DEFAULT, color: theme.colors.text.primary }}
              >
                <option value="Global">🌍 Global (show all countries)</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const sel = (document.getElementById('country-popup-select') as HTMLSelectElement)?.value;
                  handleCountryPopupSave(sel || 'Global');
                }}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: theme.colors.primary.DEFAULT }}
              >
                Show Jobs
              </button>
              <button
                onClick={() => handleCountryPopupSave('Global')}
                className="w-full mt-2 py-2 text-sm font-medium transition-colors"
                style={{ color: theme.colors.text.muted }}
              >
                Skip — show all countries
              </button>
            </div>
          </div>
        )}

        <MatchBreakdownModal open={matchModalOpen} onClose={() => setMatchModalOpen(false)} data={matchModalData} />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        <CreateCVModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} onComplete={(cvId) => router.push(`/cv/view/${cvId}`)} />
        <CreateCoverLetterModal isOpen={coverLetterModalOpen} onClose={() => setCoverLetterModalOpen(false)} onComplete={(coverLetterId) => router.push(`/cv/view/${coverLetterId}`)} />
      </div>
    </>
  );
}
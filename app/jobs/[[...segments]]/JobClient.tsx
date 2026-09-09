"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Mail, 
  ExternalLink, 
  ArrowLeft, 
  Clock, 
  Home,
  Building, 
  Target, 
  Award, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Share2,
  ChevronRight,
  BookOpen,
  PenTool,
  CheckCircle2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { theme } from '@/lib/theme';
import UpgradeModal from '@/components/jobs/UpgradeModal';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import AdUnit from '@/components/ads/AdUnit';
import AdsterraTopBanner from '@/components/ads/AdsterraTopBanner';
import AdsterraBanner from '@/components/ads/AdsterraBanner';
import { ADSTERRA } from '@/lib/constants/adsterraKeys';
import { TOOLS_NAV } from '@/lib/toolsNav';
import type { DocumentLink, CvTemplateMatch } from './page';
import { useAuth } from '@/context/AuthContext';
import { scoreJob, JobRow, UserOnboardingData } from '@/lib/matching/matchEngine';
import { matchCacheService } from '@/lib/matching/matchCache';
import MatchBreakdownModal from '@/components/jobs/MatchBreakdownModal';
import MatchScoreCircle from '@/components/jobs/MatchScoreCircle';

// ─── Ad slot IDs ───────────────────────────────────────────────────────────────
// Trimmed down to a single mid-content placement to stay within the AdSense ad limit.
const AD_SLOTS = {
  IN_ARTICLE: '3314340925',
} as const;

// Namespaced per site so saved/applied state doesn't bleed across subdomains
// if a user ever visits multiple sites on the same browser.
const STORAGE_KEYS = {
  SAVED_JOBS: 'global_saved_jobs',
  APPLIED_JOBS: 'global_applied_jobs',
};

// ─── Worker URL for similar/related jobs (client-side fallback) ───────────────
// Replace with the Global-specific worker URL when ready.
const SIMILAR_JOBS_WORKER_URL = 'https://jobs-api.joevicspro.workers.dev/jobs';

// ─── Featured Quizzes ────────────────────────────────────────────────────────
const FEATURED_QUIZZES = [
  { name: 'KPMG Recruitment Test Practice', url: '/tools/quiz/kpmg-assessment-practice-test' },
  { name: 'PwC Recruitment Test Practice', url: '/tools/quiz/pwc-recruitment-assessment-practice-test' },
  { name: 'Deloitte Recruitment Test Practice', url: '/tools/quiz/deloitte-recruitment-assessment-practice-test' },
  { name: 'Ernst & Young (EY) Recruitment Test Practice', url: '/tools/quiz/ernst-young-ey-assessment-practice-test' },
  { name: 'Access Bank Graduate Trainee Aptitude Test', url: '/tools/quiz/access-bank-graduate-trainee-assessment-test' },
];

// ─── Blog Articles (Gulf) ─────────────────────────────────────────────────────
// NOTE: Replace / add new blog URLs here. Remove the Nigerian-specific ones
// and add Gulf-relevant articles. All entries are eligible for random selection.
// `countries` is optional and additive: leave it off (as every entry below
// currently is) and a post behaves exactly as before — eligible everywhere.
// Tag a post with e.g. `countries: ['nigeria']` only if you want it to be
// preferred for jobs in that country specifically.
const ALL_BLOGS: { title: string; url: string; countries?: string[] }[] = [
  { title: 'Why You Are Not Getting Job Offers', url: '/blog/why-you-are-not-getting-job-offers' },
  { title: 'Master Salary Negotiation Guide', url: '/blog/master-salary-negotiation-guide' },
  { title: "Why You Don't Hear Back After Interviews", url: '/blog/why-dont-hear-back-after-interviews' },
  { title: '10-Minute Resume Fix to Increase Interviews', url: '/blog/10-minute-resume-fix-increase-interviews' },
  { title: 'How to Write a CV with No Experience', url: '/blog/write-a-cv-with-no-experience-beginners-guide' },
  { title: "How to Answer 'Tell Me About Yourself' in Job Interviews", url: '/blog/tell-me-about-yourself-job-interview-nigeria' },
  { title: '30 Common Bank Interview Questions', url: '/blog/bank-interview-questions-nigeria-ace-job' },
  { title: 'How to Transition from Banking to Tech (Guide)', url: '/blog/how-to-transition-from-banking-to-tech-in-nigeria-2026-guide' },
  { title: 'How to Transition from Teaching to Corporate HR', url: '/blog/nigerian-teachers-to-hr-your-career-transition-guide' },
  { title: 'Virtual Interview Online Preparation Tips', url: '/blog/virtual-interview-tips' },
  { title: 'How to Identify Fake Job Offers & Scam Interviews', url: '/blog/spot-fake-jobs--scam-interviews-nigeria' },
  // ─── Add new Global-relevant blog URLs below ───────────────────────────────────
];

// Prefers posts tagged for the job's country; falls back to the full pool
// (today's exact behavior) the moment there are fewer than `n` country
// matches, so this can never make the widget show fewer/emptier results
// than before — it only narrows the pool when there's enough to fill it.
function getCountryAwareBlogs(countrySlug: string, n: number): typeof ALL_BLOGS {
  const tagged = ALL_BLOGS.filter((b) => b.countries?.includes(countrySlug));
  const pool = tagged.length >= n ? tagged : ALL_BLOGS;
  return getRandomItems(pool, n);
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function getRandomItems<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

/**
 * Derives a URL-safe country slug from a job record.
 * Falls back to 'global' if no country can be determined.
 */
function getJobCountrySlug(job: any): string {
  const countryArr: string[] = Array.isArray(job.country) ? job.country : [];
  const first = countryArr.find((c) => c.toLowerCase() !== 'global');
  if (first) {
    return first.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (job.location && typeof job.location === 'object') {
    const c = job.location.country || job.location.countries?.[0];
    if (c && c.toLowerCase() !== 'global') {
      return c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
  }
  return 'global';
}

/**
 * Builds a job detail URL with the [country]/[slug] structure.
 */
function buildJobUrl(job: any): string {
  const countrySlug = getJobCountrySlug(job);
  return `/jobs/${countrySlug}/${job.slug || job.id}`;
}

/**
 * Builds a search tag URL:
 * - Gulf jobs → internal /jobs?search=... link (same domain, no new tab)
 * - Other jobs → /jobs page (fallback)
 */
function buildSearchUrl(keyword: string): string {
  return `/jobs?sort=match&search=${encodeURIComponent(keyword)}`;
}

export default function JobClient({ job, relatedJobs, companies, documentLinks, documentsCountryLabel, cvTemplateMatch }: { 
  job: any; 
  relatedJobs?: any[]; 
  companies?: any[]; 
  documentLinks?: DocumentLink[];
  documentsCountryLabel?: string | null;
  cvTemplateMatch?: CvTemplateMatch | null;
}) {
  const router = useRouter();
  const jobId = job.id;
  const { toast } = useToast();
  const { openAuthModal } = useAuth();
  
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [applied, setApplied] = useState(false);
  const [hasAppliedInApp, setHasAppliedInApp] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchBreakdown, setMatchBreakdown] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [upgradeErrorType, setUpgradeErrorType] = useState<'PREMIUM_REQUIRED' | 'QUOTA_EXCEEDED' | 'INSUFFICIENT_CREDITS' | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeErrorData, setUpgradeErrorData] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>(relatedJobs || []);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [randomBlogs, setRandomBlogs] = useState<typeof ALL_BLOGS>([]);

  useEffect(() => {
    setIsMounted(true);
    setRandomBlogs(getCountryAwareBlogs(getJobCountrySlug(job), 5));
  }, [job]);

  // ─── Country-aware tools ────────────────────────────────────────────────────
  // Prefers tools whose title mentions the job's country (e.g. "UAE Gratuity
  // Calculator" for a UAE job) over the generic set. Falls back to the
  // existing generic 3 (interview/ats-review/career) if no country-specific
  // tools exist for this job — never fewer links than before.
  const jobCountrySlug = getJobCountrySlug(job);
  const COUNTRY_TOOL_KEYWORDS: Record<string, string> = {
    nigeria: 'nigeria',
    uae: 'uae',
    'saudi-arabia': 'saudi',
    qatar: 'qatar',
    kuwait: 'kuwait',
    bahrain: 'bahrain',
    oman: 'oman',
  };
  const countryKeyword = COUNTRY_TOOL_KEYWORDS[jobCountrySlug];
  const countryTools = countryKeyword
    ? TOOLS_NAV.filter((t) => t.title.toLowerCase().includes(countryKeyword)).slice(0, 3)
    : [];

  // Records an external apply click (email / phone / link) against this
  // job so it shows up in "My Applications" alongside in-app applications.
  // Fire-and-forget: never blocks or delays the mailto/tel/external link
  // the user is actually clicking.
  const trackExternalApplication = (method: 'email' | 'phone' | 'link') => {
    if (!user?.id) return; // only signed-in users have a profile to save to
    fetch('/api/applications/external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, userId: user.id, method }),
    }).catch(() => {
      // Non-critical — the user's application still goes through externally
      // even if we fail to record it on their profile.
    });
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    // Build canonical share URL using [country]/[slug] structure
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}${buildJobUrl(job)}`;
    // Prefer the pre-written broadcast post (same text already used for
    // WhatsApp/Telegram) over an auto-generated one-liner — reads better
    // and keeps every share channel consistent. Falls back for jobs
    // without one (e.g. older listings from before this field existed).
    const shareText = job.social || `Check out this job: ${job.title} at ${getCompanyName()}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: shareText,
          url: job.social ? undefined : shareUrl,
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          await navigator.clipboard.writeText(job.social || `${shareText}\n${shareUrl}`);
          toast({ title: 'Copied!', description: 'Job post copied to clipboard' });
        }
      }
    } else {
      await navigator.clipboard.writeText(job.social || `${shareText}\n${shareUrl}`);
      toast({ title: 'Copied!', description: 'Job post copied to clipboard' });
    }
  };

  useEffect(() => {
    checkAuth();
    loadSavedStatus();
    loadAppliedStatus();
    if (!relatedJobs || relatedJobs.length === 0) {
      loadSimilarJobs();
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      if (job.apply_in_app) {
        const { data: existingApp } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', jobId)
          .eq('applicant_id', session.user.id)
          .maybeSingle();
        if (existingApp) setHasAppliedInApp(true);
      }
    }
  };

  // ─── Match score (for the small circle at the top of the page) ────────────
  useEffect(() => {
    if (!user) {
      setMatchScore(null);
      setMatchBreakdown(null);
      return;
    }

    let cancelled = false;

    const computeMatch = async () => {
      setMatchLoading(true);
      try {
        // Cache check first — same cache the job list already writes to.
        const cached = matchCacheService.getCachedMatch(user.id, jobId);
        if (cached) {
          if (!cancelled) {
            setMatchScore(cached.score);
            setMatchBreakdown(cached.breakdown);
          }
          return;
        }

        const cacheKey = `onboarding_cache_${user.id}`;
        const tsKey = `onboarding_cache_ts_${user.id}`;
        const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
        let onboardingData: UserOnboardingData | null = null;

        try {
          const cachedRaw = localStorage.getItem(cacheKey);
          const ts = localStorage.getItem(tsKey);
          if (cachedRaw && ts && Date.now() - parseInt(ts, 10) < CACHE_TTL) {
            onboardingData = JSON.parse(cachedRaw);
          }
        } catch {}

        if (!onboardingData) {
          const { data, error } = await supabase
            .from('onboarding_data')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (error && error.code !== 'PGRST116') throw error;
          onboardingData = data ? {
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
          try {
            localStorage.setItem(cacheKey, JSON.stringify(onboardingData));
            localStorage.setItem(tsKey, Date.now().toString());
          } catch {}
        }

        const jobRow: JobRow = {
          role: job.role || job.title,
          related_roles: job.related_roles,
          ai_enhanced_roles: job.ai_enhanced_roles,
          skills_required: job.skills_required,
          ai_enhanced_skills: job.ai_enhanced_skills,
          location: job.location,
          experience_level: job.experience_level,
          salary_range: job.salary_range,
          employment_type: job.employment_type || job.type,
          sector: job.sector,
        };

        const result = scoreJob(jobRow, onboardingData);
        const rsCapped = Math.min(80, result.breakdown.rolesScore + result.breakdown.skillsScore + result.breakdown.sectorScore);
        const calculatedTotal = Math.round(
          rsCapped + result.breakdown.locationScore + result.breakdown.experienceScore + result.breakdown.salaryScore + result.breakdown.typeScore
        );

        matchCacheService.saveCachedMatch(user.id, jobId, result);

        if (!cancelled) {
          setMatchScore(calculatedTotal);
          setMatchBreakdown(result.breakdown);
        }
      } catch (e) {
        console.error('Error computing match score:', e);
        if (!cancelled) {
          setMatchScore(null);
          setMatchBreakdown(null);
        }
      } finally {
        if (!cancelled) setMatchLoading(false);
      }
    };

    computeMatch();
    return () => { cancelled = true; };
  }, [user, jobId]);

  const handleMatchClick = () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    setMatchModalOpen(true);
  };

  const loadSavedStatus = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    if (saved) {
      try { setSaved(JSON.parse(saved).includes(jobId)); } catch (e) {}
    }
  };

  const loadAppliedStatus = () => {
    if (typeof window === 'undefined') return;
    const applied = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS);
    if (applied) {
      try { setApplied(JSON.parse(applied).includes(jobId)); } catch (e) {}
    }
  };

  const loadSimilarJobs = async () => {
    try {
      const params = new URLSearchParams({ limit: '10', exclude: jobId });
      if (job.role_category) params.set('role_category', job.role_category);
      if (job.category) params.set('category', job.category);
      if (job.sector) params.set('sector', job.sector);
      const res = await fetch(`${SIMILAR_JOBS_WORKER_URL}?${params.toString()}`);
      if (!res.ok) throw new Error('Related jobs fetch failed');
      const data = await res.json();
      setSimilarJobs(data.jobs || []);
    } catch (error) {
      console.error('Error loading similar jobs:', error);
    }
  };

  const handleSave = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    let savedArray: string[] = [];
    if (saved) { try { savedArray = JSON.parse(saved); } catch (e) {} }
    const newSaved = savedArray.includes(jobId)
      ? savedArray.filter(id => id !== jobId)
      : [...savedArray, jobId];
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(newSaved));
    setSaved(newSaved.includes(jobId));
  };

  const getCompanyName = () => {
    if (typeof job.company === 'string') return job.company;
    if (job.company?.name) return job.company.name;
    return 'Unknown Company';
  };

  const getLocationString = () => {
    if (!job.location) return 'Not specified';
    if (typeof job.location === 'string') return job.location;
    if (typeof job.location === 'object') {
      if (job.location.remote) return 'Remote';
      const parts = [job.location.city, job.location.state, job.location.country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'Not specified';
    }
    return 'Not specified';
  };

  const getSalaryString = () => {
    if (!job.salary && !job.salary_range) return null;
    if (typeof job.salary === 'string') {
      if (job.salary === '0' || job.salary === '₦0' || job.salary === '0.00' || job.salary.includes('₦0')) return null;
      return job.salary;
    }
    if (job.salary_range && typeof job.salary_range === 'object') {
      const { min, max, currency, period } = job.salary_range;
      if (min != null && currency && min > 0) {
        if (!max || min === max) return `${currency} ${min.toLocaleString()} ${period || ''}`.trim();
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} ${period || ''}`.trim();
      }
    }
    return null;
  };

  const getExperienceLevelWithYears = (level: string) => {
    const normalizedLevel = level.trim();
    const experienceMap: Record<string, string> = {
      'Entry Level': 'Entry Level (0-2 years)', 'entry level': 'Entry Level (0-2 years)',
      'entry-level': 'Entry Level (0-2 years)', 'Junior': 'Junior (1-3 years)',
      'junior': 'Junior (1-3 years)', 'Mid-level': 'Mid-level (3-5 years)',
      'mid-level': 'Mid-level (3-5 years)', 'Mid level': 'Mid-level (3-5 years)',
      'Senior': 'Senior (5-8 years)', 'senior': 'Senior (5-8 years)',
      'Lead': 'Lead (8-12 years)', 'lead': 'Lead (8-12 years)',
      'Executive': 'Executive (12+ years)', 'executive': 'Executive (12+ years)',
    };
    return experienceMap[normalizedLevel] || level;
  };

  const getJobTypeDisplay = (jobType: string) => {
    const jobTypeMap: Record<string, string> = {
      'remote': 'Remote', 'on-site': 'On-site', 'hybrid': 'Hybrid',
      'onsite': 'On-site', 'full-remote': 'Fully Remote',
    };
    return jobTypeMap[jobType?.toLowerCase()] || jobType;
  };

  const getSimilarJobLocation = (similarJob: any) => {
    if (!similarJob.location) return '';
    if (typeof similarJob.location === 'string') return similarJob.location;
    if (typeof similarJob.location === 'object') {
      if (similarJob.location.remote) return 'Remote';
      if (similarJob.location.state) return similarJob.location.state;
      if (similarJob.location.city) return similarJob.location.city;
    }
    return '';
  };

  const getBreadcrumbCountry = (): { name: string; slug: string } | null => {
    const countryArr: string[] = Array.isArray(job.country) ? job.country : [];
    const first = countryArr.find(c => c.toLowerCase() !== 'global');
    if (first) {
      const slug = first.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return { name: first, slug };
    }
    if (job.location && typeof job.location === 'object') {
      const c = job.location.country || (job.location.countries?.[0]);
      if (c && c.toLowerCase() !== 'global') {
        const slug = c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return { name: c, slug };
      }
    }
    return null;
  };

  const breadcrumbCountry = getBreadcrumbCountry();
  const isExpired = job.status === 'expired' || (job.deadline && new Date(job.deadline) < new Date());

  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Fixed 2-row header */}
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300"
          style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap" aria-label="Breadcrumb">
                <a href="/" className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                  <Home size={11} />
                  <span>Home</span>
                </a>
                <span className="text-gray-300">/</span>
                <a href="/jobs" className="hover:text-gray-700 transition-colors">Jobs</a>
                {breadcrumbCountry && (
                  <>
                    <span className="text-gray-300">/</span>
                    <a
                      href={`/jobs/${breadcrumbCountry.slug}`}
                      className="hover:text-gray-700 transition-colors capitalize"
                    >
                      {breadcrumbCountry.name}
                    </a>
                  </>
                )}
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
              </nav>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => router.push('/jobs')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                style={{ color: theme.colors.primary.DEFAULT }}
              >
                <ArrowLeft size={16} />
                <span>All Jobs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  title={saved ? 'Saved' : 'Save job'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                    saved
                      ? 'bg-gray-100 border-gray-200 text-gray-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                  <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  title="Share job"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-white border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Share2 size={15} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={() => {
                    const section = document.getElementById('how-to-apply');
                    if (section) {
                      const offset = section.getBoundingClientRect().top + window.pageYOffset - 80;
                      window.scrollTo({ top: offset, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-[96px] pb-[110px] lg:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN — Main Job Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Adsterra top banner — 728x90 desktop / 320x50 mobile */}
              <AdsterraTopBanner />

              {/* Job Header Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
                    {job.title || 'Untitled Job'}
                  </h1>
                  <MatchScoreCircle
                    score={matchScore}
                    loading={matchLoading}
                    loggedIn={!!user}
                    onClick={handleMatchClick}
                    className="mt-1"
                  />
                </div>
                <p className="text-base text-gray-700 mb-4">
                  {(() => {
                    const companyName = getCompanyName();
                    const isConfidential = companyName === 'Confidential employer';
                    if (isConfidential) {
                      return (
                        <>
                          {companyName}
                          <span className="text-sm text-gray-500 ml-2">(Recruiter)</span>
                        </>
                      );
                    }
                    const matchedCompany = companies?.find((c: any) => c.name === companyName);
                    return (
                      <>
                        {matchedCompany?.slug ? (
                          <a
                            href={`/company/${matchedCompany.slug}`}
                            className="hover:underline transition-colors"
                            style={{ color: theme.colors.primary.DEFAULT }}
                          >
                            {companyName}
                          </a>
                        ) : (
                          <span>{companyName}</span>
                        )}
                      </>
                    );
                  })()}
                </p>

                {!isExpired && isMounted && (() => {
                  const rawRole = (job.role || job.title || '').trim();
                  const STOP_WORDS = new Set(['a','an','the','of','for','in','at','to','and','or','with','on','by','as','is','are','be','was','were','job','jobs']);
                  const roleWords = rawRole.split(/\s+/).filter(Boolean);
                  const roleLabel = roleWords
                    .filter((w: string, i: number) => !(i === roleWords.length - 1 && /^jobs?$/i.test(w)))
                    .join(' ');
                  const searchWords = roleWords
                    .filter((w: string) => !STOP_WORDS.has(w.toLowerCase()))
                    .slice(0, 2);
                  const roleSearchUrl = searchWords.length
                    ? buildSearchUrl(searchWords.join(' '))
                    : null;

                  const locObj = typeof job.location === 'object' ? job.location : null;
                  const isRemote = locObj?.remote === true;
                  const locRaw = !isRemote
                    ? (locObj?.state || locObj?.city || locObj?.country || null)
                    : null;
                  const locWord = locRaw ? locRaw.trim().split(/\s+/)[0] : null;
                  // Gulf jobs: internal link; non-Gulf: internal /jobs fallback
                  const locSearchUrl = locWord ? buildSearchUrl(locWord) : null;

                  return (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <a
                        href="/jobs?posted=today"
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                        style={{ backgroundColor: `${theme.colors.primary.DEFAULT}15`, color: theme.colors.primary.DEFAULT }}
                      >
                        Today&apos;s jobs
                      </a>

                      {roleSearchUrl && roleLabel && (
                        <a
                          href={roleSearchUrl}
                          className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                          style={{ backgroundColor: `${theme.colors.primary.DEFAULT}15`, color: theme.colors.primary.DEFAULT }}
                        >
                          {roleLabel} Jobs
                        </a>
                      )}

                      {locSearchUrl && locWord && (
                        <a
                          href={locSearchUrl}
                          className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                          style={{ backgroundColor: `${theme.colors.primary.DEFAULT}15`, color: theme.colors.primary.DEFAULT }}
                        >
                          {locWord} Jobs
                        </a>
                      )}

                      <a
                        href="/jobs?sort=match&search=remote"
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                        style={{ backgroundColor: `${theme.colors.primary.DEFAULT}15`, color: theme.colors.primary.DEFAULT }}
                      >
                        Remote Jobs
                      </a>
                    </div>
                  );
                })()}

                {isExpired && similarJobs && similarJobs.length > 0 && (
                  <div className="mb-6 -mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-600 font-medium text-center">This job listing has expired</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-3">Find similar jobs instead:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {similarJobs.slice(0, 10).map((similarJob) => (
                        <a
                          key={similarJob.id}
                          href={buildJobUrl(similarJob)}
                          className="block p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <p className="text-base font-medium text-blue-600 line-clamp-1">{similarJob.title}</p>
                          <p className="text-xs text-gray-900 mt-0.5">
                            {typeof similarJob.company === 'string' ? similarJob.company : similarJob.company?.name || 'Company'}
                          </p>
                        </a>
                      ))}
                    </div>
                    {similarJobs.length > 10 && (
                      <a href="/jobs" className="inline-block mt-3 text-sm font-medium text-blue-600 underline hover:text-blue-800">
                        View all similar jobs →
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Job Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-900">{getLocationString()}</p>
                        </div>
                      </div>
                      {getSalaryString() && (
                        <div className="flex items-center gap-3">
                          <DollarSign size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Salary</p>
                            <p className="text-sm font-medium text-gray-900">{getSalaryString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {(job.employment_type || job.type) && (
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Employment Type</p>
                            <p className="text-sm font-medium text-gray-900">{job.employment_type || job.type}</p>
                          </div>
                        </div>
                      )}
                      {job.job_type && (
                        <div className="flex items-center gap-3">
                          <Briefcase size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Work Arrangement</p>
                            <p className="text-sm font-medium text-gray-900">{getJobTypeDisplay(job.job_type)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(job.sector || job.experience_level || job.deadline) && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {job.sector && (
                        <div className="flex items-center gap-3">
                          <Building size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Sector</p>
                            <p className="text-sm font-medium text-gray-900">{job.sector}</p>
                          </div>
                        </div>
                      )}
                      {job.experience_level && (
                        <div className="flex items-center gap-3">
                          <Target size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Experience Level</p>
                            <p className="text-sm font-medium text-gray-900">{getExperienceLevelWithYears(job.experience_level)}</p>
                          </div>
                        </div>
                      )}
                      {job.deadline && !isExpired && (
                        <div className="flex items-center gap-3">
                          <Calendar size={20} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Application Deadline</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {job.about_company && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">About the Company</h2>
                  <div className="text-base leading-loose text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: typeof job.about_company === 'string' ? job.about_company : '' }} />
                </div>
              )}

              {job.description && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Job Description</h2>
                  <div className="text-base leading-loose text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: typeof job.description === 'string' ? job.description : '' }} />
                </div>
              )}

              {/* Ad — between Job Description and Required Skills */}
              <div className="w-full overflow-hidden flex justify-center py-2">
                <AdsterraBanner {...ADSTERRA.RECTANGLE_300x250} />
              </div>

              {((job.skills_required && Array.isArray(job.skills_required) && job.skills_required.length > 0) ||
                (job.skills && Array.isArray(job.skills) && job.skills.length > 0)) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills_required || job.skills || []).map((skill: string, index: number) => (
                      <span key={index} className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-900 border border-gray-200">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full overflow-hidden flex justify-center py-2">
                <AdsterraBanner {...ADSTERRA.RECTANGLE_300x250} />
              </div>

              {(() => {
                const responsibilitiesArray = Array.isArray(job.responsibilities) ? job.responsibilities : [];
                if (responsibilitiesArray.length > 0) {
                  return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900">Key Responsibilities</h2>
                      <ul className="space-y-5">
                        {responsibilitiesArray.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                            <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.colors.primary.DEFAULT }}></span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })()}

              {(() => {
                const qualificationsArray = Array.isArray(job.qualifications) ? job.qualifications : [];
                if (qualificationsArray.length > 0) {
                  return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900">Qualifications</h2>
                      <ul className="space-y-5">
                        {qualificationsArray.map((q: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                            <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.colors.primary.DEFAULT }}></span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Ad — between Qualifications and Benefits & Perks */}
              <div className="w-full overflow-hidden flex justify-center py-2">
                <AdsterraBanner {...ADSTERRA.RECTANGLE_160x300} />
              </div>

              {(() => {
                const benefitsArray = Array.isArray(job.benefits) ? job.benefits : [];
                if (benefitsArray.length > 0) {
                  return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900">Benefits &amp; Perks</h2>
                      <ul className="space-y-5">
                        {benefitsArray.map((b: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                            <Award size={20} className="flex-shrink-0 mt-0.5" style={{ color: theme.colors.primary.DEFAULT }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })()}

              {/* How to Apply */}
              {isExpired ? (
                <div id="how-to-apply" className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Apply</h2>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">This job has expired</p>
                  </div>
                </div>
              ) : (job.apply_in_app || job.application?.email || job.application_email || job.application?.phone || job.application_phone || job.application?.link || job.application?.url || job.application_url) && (
                <div id="how-to-apply" className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Apply</h2>
                  {job.apply_instruction && (
                    <p className="text-base text-gray-600 mb-6 whitespace-pre-wrap" style={{ marginTop: '8px' }}>
                      {job.apply_instruction}
                    </p>
                  )}
                  <div className="space-y-3">
                    {/* Apply in-app on JobMeter */}
                    {job.apply_in_app && (
                      hasAppliedInApp ? (
                        <div
                          className="w-full flex items-center gap-2.5 px-5 py-4 rounded-xl font-semibold text-sm border-2"
                          style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D' }}
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                            <CheckCircle2 size={16} />
                          </span>
                          <span className="flex flex-col items-start leading-tight">
                            <span className="text-base">Applied</span>
                            <span className="text-xs font-normal opacity-80">You've already applied to this job on JobMeter</span>
                          </span>
                        </div>
                      ) : (
                        <a
                          href={`/apply/${job.id}`}
                          className="group w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.dark})`,
                            boxShadow: `0 8px 20px -6px ${theme.colors.primary.DEFAULT}80`,
                          }}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                              <Zap size={16} className="fill-white" />
                            </span>
                            <span className="flex flex-col items-start leading-tight">
                              <span className="text-base">Apply on JobMeter</span>
                              {job.screening_enabled && (
                                <span className="text-xs font-normal text-white/80">Quiz required to apply</span>
                              )}
                            </span>
                          </span>
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </a>
                      )
                    )}

                    {!job.apply_in_app && (job.application?.phone || job.application_phone) && (
                      <div>
                        <button
                          onClick={() => setShowPhone(v => !v)}
                          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border-2 font-semibold text-sm transition-colors bg-green-50 border-green-300 text-green-800 hover:bg-green-100"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Apply via WhatsApp / Phone
                          </span>
                          <span className="text-green-600 text-xs font-medium">{showPhone ? '▲' : '▼'}</span>
                        </button>
                        {showPhone && (
                          <div className="mt-2 p-4 bg-green-50 rounded-xl border border-green-200 space-y-3">
                            <p className="text-sm font-medium text-gray-800 break-all">
                              {(job.application?.phone || job.application_phone || '').replace('tel:', '')}
                            </p>
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://wa.me/${(job.application?.phone || job.application_phone || '').replace(/[^0-9]/g, '')}`}
                                target="_blank" rel="nofollow noopener noreferrer"
                                onClick={() => trackExternalApplication('phone')}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                              >
                                WhatsApp
                              </a>
                              <button
                                onClick={() => handleCopy((job.application?.phone || job.application_phone || '').replace('tel:', ''), 'Phone number')}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                {copied === 'Phone number' ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!job.apply_in_app && (job.application?.email || job.application_email) && (
                      <div>
                        <button
                          onClick={() => setShowEmail(v => !v)}
                          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border-2 font-semibold text-sm transition-colors"
                          style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, borderColor: `${theme.colors.primary.DEFAULT}50`, color: theme.colors.primary.DEFAULT }}
                        >
                          <span className="flex items-center gap-2">
                            <Mail size={16} />
                            Apply via Email
                          </span>
                          <span className="text-xs font-medium opacity-70">{showEmail ? '▲' : '▼'}</span>
                        </button>
                        {showEmail && (
                          <div className="mt-2 p-4 rounded-xl border border-gray-200 space-y-3" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}05` }}>
                            <p className="text-sm font-medium text-gray-800 break-all">
                              {(job.application?.email || job.application_email || '').replace('mailto:', '')}
                            </p>
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${(job.application?.email || job.application_email || '').replace('mailto:', '')}?subject=${encodeURIComponent(job.subject || `${job.title || 'Job'} Application`)}`}
                                onClick={() => trackExternalApplication('email')}
                                className="px-4 py-2 text-white text-sm rounded-lg hover:opacity-90 transition-opacity font-medium"
                                style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                              >
                                Open Email
                              </a>
                              <button
                                onClick={() => handleCopy((job.application?.email || job.application_email || '').replace('mailto:', ''), 'Email')}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                {copied === 'Email' ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!job.apply_in_app && (job.application?.link || job.application?.url || job.application_url) && (
                      <div>
                        <button
                          onClick={() => setShowUrl(v => !v)}
                          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border-2 font-semibold text-sm transition-colors bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink size={16} />
                            Apply via Website
                          </span>
                          <span className="text-purple-600 text-xs font-medium">{showUrl ? '▲' : '▼'}</span>
                        </button>
                        {showUrl && (
                          <div className="mt-2 p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
                            <p className="text-sm font-medium text-gray-800 break-all">
                              {job.application?.link || job.application?.url || job.application_url}
                            </p>
                            <div className="flex items-center gap-2">
                              <a
                                href={job.application?.link || job.application?.url || job.application_url || ''}
                                target="_blank" rel="nofollow noopener noreferrer"
                                onClick={() => trackExternalApplication('link')}
                                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors font-medium"
                              >
                                Apply Now
                              </a>
                              <button
                                onClick={() => handleCopy(job.application?.link || job.application?.url || job.application_url || '', 'URL')}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                {copied === 'URL' ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}


{/* Ad — between How to Apply and Join Our Communities */}
<div className="w-full overflow-hidden flex justify-center py-2">
  <AdsterraBanner {...ADSTERRA.BANNER_468x60} />
</div>

{/* No "Apply for Me" on remote.jobmeter.app */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-900">Join Our Communities</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* WhatsApp Card */}
    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="text-sm font-semibold text-green-800">WhatsApp Channels</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Global Jobs', href: 'https://whatsapp.com/channel/0029VbCmGF10Qeanq3dje41Z' },
          { label: 'Gulf Jobs', href: 'https://whatsapp.com/channel/0029VbCym2i7DAWx9oGcIV11' },
          { label: 'Nigerian Jobs', href: 'https://whatsapp.com/channel/0029VbC3NrUKLaHp8JAt7v3y' },
          { label: 'Indian Jobs', href: 'https://whatsapp.com/channel/0029Vb8ARN82f3ENIUrBEB3u' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="px-3 py-1 bg-white text-green-700 border border-green-300 rounded-full text-xs font-medium hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
          >
            {label}
          </a>
        ))}
      </div>
    </div>

    {/* Telegram Card */}
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="text-sm font-semibold text-blue-800">Telegram Groups</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Global Jobs', href: 'https://t.me/+nK6OHg9ksAthOTc0' },
          { label: 'Nigerian Jobs', href: 'https://t.me/+1YYoQJdLzzkwNDI0' },
          { label: 'Gulf Jobs', href: 'https://t.me/+dxmM9_THQnY3Y2M0' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="px-3 py-1 bg-white text-blue-700 border border-blue-300 rounded-full text-xs font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            {label}
          </a>
        ))}
      </div>
    </div>

  </div>
</div>
              {((job.about_role && job.about_role.trim()) ||
                (job.who_apply && job.who_apply.trim()) ||
                (job.standout && job.standout.trim())) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <Accordion type="multiple" defaultValue={["about-role"]} className="w-full" style={{ marginTop: '8px' }}>
                    {job.about_role && job.about_role.trim() && (
                      <AccordionItem value="about-role" className="border-b border-gray-200">
                        <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-4">About This Role</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap" style={{ marginTop: '8px' }}>{job.about_role}</p>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {job.who_apply && job.who_apply.trim() && (
                      <AccordionItem value="who-apply" className="border-b border-gray-200">
                        <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-4">Who Should Apply</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap" style={{ marginTop: '8px' }}>{job.who_apply}</p>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {job.standout && job.standout.trim() && (
                      <AccordionItem value="standout" className="border-b-0">
                        <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-4">
                          <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-500" />
                            <span>How to Stand Out When Applying</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{job.standout}</p>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              )}

              {(job.posted_date || job.created_at) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900">Posted Date</h2>
                  <p className="text-sm text-gray-700 mb-2">
                    {(() => {
                      const dateStr = job.posted_date || job.created_at;
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return 'Date not available';
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                    })()}
                  </p>
                  {(job.views || 0) > 0 && (
                    <p className="text-sm text-gray-500">{job.views?.toLocaleString()} people viewed this job</p>
                  )}
                </div>
              )}

              {!isExpired && (job.application_url || (job.application && (job.application.url || job.application.link))) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <a
                    href={job.application_url || job.application?.url || job.application?.link}
                    target="_blank" rel="nofollow noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                    style={{ color: theme.colors.primary.DEFAULT }}
                  >
                    <ExternalLink size={18} />
                    View original job posting
                  </a>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN — Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Desktop-only — this column stacks into the single mobile
                  column below the lg breakpoint, and a 160x600 unit doesn't
                  belong wedged into that stacked mobile flow. */}
              <div className="hidden lg:flex justify-center">
                <AdsterraBanner {...ADSTERRA.SKYSCRAPER_160x600} />
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 font-semibold text-base flex items-center gap-2" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, color: theme.colors.primary.DEFAULT }}>
                  <PenTool size={16} />
                  Free Recruitment Practice Test
                </div>
                <div className="px-5 py-4">
                  <ul className="space-y-3">
                    {FEATURED_QUIZZES.map((quiz, index) => (
                      <li key={index}>
                        <a href={quiz.url} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                          <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                          <span className="group-hover:underline">{quiz.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a href="/tools/quiz" className="flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
                      See all assessments
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {similarJobs && similarJobs.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 text-white font-semibold text-base" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
                    Similar Jobs
                  </div>
                  <div className="px-5 py-4">
                    <div className="space-y-4">
                      {similarJobs.map((similarJob) => (
                        <a
                          key={similarJob.id}
                          href={buildJobUrl(similarJob)}
                          className="block group"
                        >
                          <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 group-hover:scale-150 transition-transform" style={{ backgroundColor: theme.colors.primary.DEFAULT }}></div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 group-hover:underline line-clamp-2 mb-1">{similarJob.title}</h3>
                              <p className="text-sm text-gray-600 mb-1">
                                {typeof similarJob.company === 'string' ? similarJob.company : similarJob.company?.name || 'Company'}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500" style={{ marginTop: '6px' }}>
                                {similarJob.category && (
                                  <span className="flex items-center gap-1">
                                    <Briefcase size={12} />
                                    {similarJob.category.replace(/-/g, ' ')}
                                  </span>
                                )}
                                {getSimilarJobLocation(similarJob) && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {getSimilarJobLocation(similarJob)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <a href="/jobs" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
                        <ExternalLink size={16} />
                        View all jobs
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 font-semibold text-base flex items-center gap-2" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, color: theme.colors.primary.DEFAULT }}>
                  <Sparkles size={16} />
                  Free Career Tools
                </div>
                <div className="px-5 py-4">
                  <ul className="space-y-3">
                    <li>
                      <a href="/tools/interview" className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                        <span className="group-hover:underline">Free Interview Practice</span>
                      </a>
                    </li>
                    <li>
                      <a href="/tools/ats-review" className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                        <span className="group-hover:underline">ATS CV Review</span>
                      </a>
                    </li>
                    <li>
                      <a href="/tools/career" className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                        <span className="group-hover:underline">Career Coach</span>
                      </a>
                    </li>
                    {countryTools.map((tool) => (
                      <li key={tool.id}>
                        <a href={tool.route} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                          <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                          <span className="group-hover:underline">{tool.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a href="/tools" className="flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
                      See all career tools
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Documents by country — only renders if getMatchingDocuments()
                  found published templates for this job's country. */}
              {documentLinks && documentLinks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 font-semibold text-base flex items-center gap-2" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, color: theme.colors.primary.DEFAULT }}>
                    <PenTool size={16} />
                    {documentsCountryLabel ? `Documents for ${documentsCountryLabel}` : 'Document Templates'}
                  </div>
                  <div className="px-5 py-4">
                    <ul className="space-y-3">
                      {documentLinks.map((doc) => (
                        <li key={`${doc.type}-${doc.country}`}>
                          <a href={`/documents/${doc.type}/${doc.country}`} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                            <span className="group-hover:underline">{doc.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a href="/documents" className="flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
                        See all documents
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* CV template by role — only renders if getMatchingCvTemplate()
                  found a published, matching /cv-templates/[role] page. */}
              {cvTemplateMatch && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 font-semibold text-base flex items-center gap-2" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, color: theme.colors.primary.DEFAULT }}>
                    <PenTool size={16} />
                    Build Your CV
                  </div>
                  <div className="px-5 py-4">
                    <a href={`/cv-templates/${cvTemplateMatch.slug}`} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                      <span className="group-hover:underline">Free {cvTemplateMatch.label} CV Template</span>
                    </a>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a href="/cv-templates" className="flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
                        See all CV templates
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Articles — 5 random picks */}
              {randomBlogs.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 font-semibold text-base flex items-center gap-2" style={{ backgroundColor: `${theme.colors.primary.DEFAULT}10`, color: theme.colors.primary.DEFAULT }}>
                    <BookOpen size={16} />
                    Read Career Articles
                  </div>
                  <div className="px-5 py-4">
                    <ul className="space-y-3">
                      {randomBlogs.map((blog, index) => (
                        <li key={index}>
                          <a href={blog.url} className="flex items-start gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors group">
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                            <span className="group-hover:underline leading-snug">{blog.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a href="/blog" className="flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
                        See all articles
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        {upgradeErrorType && (
          <UpgradeModal
            isOpen={upgradeModalOpen}
            onClose={() => { setUpgradeModalOpen(false); setUpgradeErrorType(null); setUpgradeErrorData(null); }}
            errorType={upgradeErrorType}
            message={upgradeErrorData?.message}
            resetDate={upgradeErrorData?.resetDate}
            monthlyLimit={upgradeErrorData?.monthlyLimit}
            requiredCredits={upgradeErrorData?.requiredCredits}
            currentCredits={upgradeErrorData?.currentCredits}
          />
        )}

        {/* Match Breakdown Modal */}
        <MatchBreakdownModal
          open={matchModalOpen}
          onClose={() => setMatchModalOpen(false)}
          data={matchBreakdown ? {
            breakdown: matchBreakdown,
            totalScore: matchScore || 0,
            jobTitle: job.title || 'This job',
            companyName: getCompanyName(),
          } : null}
        />

        {/* No TimedJobPopup on remote.jobmeter.app */}

      </div>
    </>
  );
}
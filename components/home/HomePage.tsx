"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

import { 
  Briefcase, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Shield,
  Calendar,
  PlusCircle,
  Globe,
  X
} from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';
import AdUnit from '@/components/ads/AdUnit';

import { scoreJob, JobRow, UserOnboardingData } from '@/lib/matching/matchEngine';
import { matchCacheService } from '@/lib/matching/matchCache';

interface HomePageProps {
  jobs: any[];
  blogPosts: any[];
  companies?: any[];
}

interface JobWithMatch {
  id: string;
  slug: string;
  title: string;
  company: any;
  location: any;
  posted_date: string;
  matchScore: number;
  breakdown: any;
}

interface MatchCircleProps {
  score: number;
}

const FEATURED_POSTS = [
  {
    slug: 'why-you-are-not-getting-job-offers',
    title: "Why You're Not Getting Job Offers: 10 Common Reasons & Fixes",
    excerpt: 'Discover the real reasons behind application silence and actionable fixes to turn things around.',
  },
  {
    slug: 'master-salary-negotiation-guide',
    title: 'Master the Art of Salary Negotiation: Get the Pay You Deserve',
    excerpt: 'A step-by-step guide to negotiating your salary confidently — wherever you are in the world.',
  },
  {
    slug: 'highest-paying-jobs-in-uae',
    title: 'Highest Paying Jobs in UAE 2026: Top Salaries, Skills & Careers',
    excerpt: 'Explore the best-paying roles in the UAE and what it takes to land them.',
  },
  {
    slug: '10-minute-resume-fix-increase-interviews',
    title: 'The 10-Minute Resume Fix to Land More Interviews in 2026',
    excerpt: 'Quick, high-impact changes you can make to your CV right now to increase callbacks.',
  },
  {
    slug: 'how-to-answer-expected-salary-interview',
    title: 'How to Answer "Expected Salary" in Interviews (Global Guide)',
    excerpt: 'Navigate the trickiest interview question with confidence — tips that work across industries.',
  },
  {
    slug: 'spot-fake-jobs--scam-interviews-nigeria',
    title: 'How to Spot Fake Job Offers & Scam Interviews',
    excerpt: 'Red flags to watch for and how to protect yourself from fraudulent recruiters worldwide.',
  },
] as const;

const COUNTRIES = [
  { title: 'Jobs in Nigeria', slug: 'nigeria', flag: '🇳🇬', searchTerm: 'Nigeria' },
  { title: 'Jobs in USA', slug: 'usa', flag: '🇺🇸', searchTerm: 'United States' },
  { title: 'Jobs in UK', slug: 'uk', flag: '🇬🇧', searchTerm: 'United Kingdom' },
  { title: 'Jobs in Canada', slug: 'canada', flag: '🇨🇦', searchTerm: 'Canada' },
  { title: 'Jobs in Australia', slug: 'australia', flag: '🇦🇺', searchTerm: 'Australia' },
  { title: 'Jobs in UAE', slug: 'united-arab-emirates', flag: '🇦🇪', searchTerm: 'United Arab Emirates' },
  { title: 'Jobs in Saudi Arabia', slug: 'saudi-arabia', flag: '🇸🇦', searchTerm: 'Saudi Arabia' },
  { title: 'Jobs in Germany', slug: 'germany', flag: '🇩🇪', searchTerm: 'Germany' },
  { title: 'Jobs in France', slug: 'france', flag: '🇫🇷', searchTerm: 'France' },
  { title: 'Jobs in Netherlands', slug: 'netherlands', flag: '🇳🇱', searchTerm: 'Netherlands' },
  { title: 'Jobs in South Africa', slug: 'south-africa', flag: '🇿🇦', searchTerm: 'South Africa' },
  { title: 'Jobs in Ireland', slug: 'ireland', flag: '🇮🇪', searchTerm: 'Ireland' },
  { title: 'Jobs in New Zealand', slug: 'new-zealand', flag: '🇳🇿', searchTerm: 'New Zealand' },
  { title: 'Jobs in Qatar', slug: 'qatar', flag: '🇶🇦', searchTerm: 'Qatar' },
  { title: 'Jobs in Kuwait', slug: 'kuwait', flag: '🇰🇼', searchTerm: 'Kuwait' },
  { title: 'Jobs in Singapore', slug: 'singapore', flag: '🇸🇬', searchTerm: 'Singapore' },
  { title: 'Jobs in Sweden', slug: 'sweden', flag: '🇸🇪', searchTerm: 'Sweden' },
  { title: 'Jobs in Norway', slug: 'norway', flag: '🇳🇴', searchTerm: 'Norway' },
  { title: 'Jobs in Switzerland', slug: 'switzerland', flag: '🇨🇭', searchTerm: 'Switzerland' },
  { title: 'Jobs in Belgium', slug: 'belgium', flag: '🇧🇪', searchTerm: 'Belgium' },
  { title: 'Jobs in Italy', slug: 'italy', flag: '🇮🇹', searchTerm: 'Italy' },
  { title: 'Jobs in Spain', slug: 'spain', flag: '🇪🇸', searchTerm: 'Spain' },
] as const;

const FAQS = [
  {
    question: "What is JobMeter?",
    answer: "JobMeter is a comprehensive job search platform that helps candidates find jobs across industries, locations, and experience levels. Our AI-powered matching technology connects job seekers with opportunities that align with their skills and career goals."
  },
  {
    question: "Is JobMeter free for job seekers?",
    answer: "Yes! JobMeter is completely free for job seekers. You can browse jobs, create your profile, get personalized match scores, and apply to unlimited positions at no cost."
  },
  {
    question: "How do I find jobs by location on JobMeter?",
    answer: "You can browse jobs by country using our Jobs by Country section, which lists opportunities in Nigeria, USA, UK, Canada, Australia, UAE, and many more countries worldwide. You can also use our location filter on the jobs page."
  },
  {
    question: "Can recruiters post jobs on JobMeter?",
    answer: "Absolutely! Recruiters and companies can post job listings on JobMeter. Simply register your company and start posting opportunities to reach thousands of qualified candidates."
  },
  {
    question: "Does JobMeter verify job listings?",
    answer: "No, we don't verify all companies. However, we try to only post from verified job sources, and flags any suspicious job we find. This helps create a safe and productive job search environment for all candidates."
  }
] as const;

const MatchCircle: React.FC<MatchCircleProps> = React.memo(({ score }) => {
  let matchColor = '#F87171';
  if (score > 0 && score <= 50) matchColor = '#FBBF24';
  if (score > 50) matchColor = '#34D399';

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: matchColor,
          backgroundColor: theme.colors.background.muted,
        }}
      >
        <span className="text-sm font-bold" style={{ color: matchColor }}>
          {score}%
        </span>
      </div>
      <span
        className="text-[10px] font-medium"
        style={{ color: theme.colors.text.secondary }}
      >
        Match
      </span>
    </div>
  );
});

MatchCircle.displayName = 'MatchCircle';

export default function HomePage({ jobs: initialJobs, blogPosts, companies = [] }: HomePageProps) {
  const router = useRouter();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'seekers' | 'recruiters'>('seekers');
  const [showAdBanner, setShowAdBanner] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('jm_hide_advertise_banner') === '1') {
      setShowAdBanner(false);
    }
  }, []);

  const dismissAdBanner = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAdBanner(false);
    localStorage.setItem('jm_hide_advertise_banner', '1');
  };
  const [userOnboardingData, setUserOnboardingData] = useState<UserOnboardingData | null>(null);
  const [processedJobs, setProcessedJobs] = useState<JobWithMatch[]>([]);
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  useEffect(() => {
    // Wait for AuthContext to resolve the session before deciding whether
    // to fetch matched jobs, so we don't briefly show unmatched jobs to a
    // signed-in user while their session is still loading.
    if (authLoading) return;
    if (user) {
      const processingTimer = setTimeout(() => {
        fetchUserOnboardingDataAndProcessJobs();
      }, 500);
      return () => clearTimeout(processingTimer);
    } else {
      const jobsWithoutMatch = initialJobs.slice(0, 6).map(job => ({
        ...job,
        matchScore: 0,
        breakdown: null,
      }));
      setProcessedJobs(jobsWithoutMatch);
    }
  }, [user, authLoading, initialJobs]);

  const fetchUserOnboardingDataAndProcessJobs = async () => {
    if (!user?.id) return;
    setMatchingInProgress(true);
    try {
      const { data: onboardingData, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !onboardingData) {
        setProcessedJobs(
          initialJobs.slice(0, 6).map(job => ({
            ...job,
            matchScore: 0,
            breakdown: null,
          }))
        );
        setMatchingInProgress(false);
        return;
      }

      setUserOnboardingData(onboardingData);

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => processJobsWithMatching(initialJobs, onboardingData));
      } else {
        setTimeout(() => processJobsWithMatching(initialJobs, onboardingData), 0);
      }
    } catch (error) {
      console.error('Error in fetchUserOnboardingDataAndProcessJobs:', error);
      setMatchingInProgress(false);
    }
  };

  const processJobsWithMatching = async (
    jobs: any[],
    onboardingData: UserOnboardingData
  ) => {
    const CHUNK_SIZE = 3;
    const jobsToProcess = jobs.slice(0, 6);
    const matchCache = matchCacheService.loadMatchCache(user?.id ?? null);
    const results: JobWithMatch[] = [];

    for (let i = 0; i < jobsToProcess.length; i += CHUNK_SIZE) {
      const chunk = jobsToProcess.slice(i, i + CHUNK_SIZE);
      
      const chunkResults = chunk.map(job => {
        const cached = matchCache[job.id];
        let matchScore = 0;
        let breakdown = null;

        if (cached) {
          matchScore = cached.score;
          breakdown = cached.breakdown;
        } else if (onboardingData) {
          const jobData: JobRow = {
            role: job.role,
            related_roles: job.related_roles,
            ai_enhanced_roles: job.ai_enhanced_roles,
            skills_required: job.skills_required,
            ai_enhanced_skills: job.ai_enhanced_skills,
            location: job.location,
            experience_level: job.experience_level,
            salary_range: job.salary_range,
            employment_type: job.employment_type,
            sector: job.sector,
          };

          const result = scoreJob(jobData, onboardingData);
          matchScore = result.score;
          breakdown = result.breakdown;
          matchCacheService.saveCachedMatch(user?.id ?? null, job.id, result);
        }

        return { ...job, matchScore, breakdown };
      });

      results.push(...chunkResults);
      setProcessedJobs([...results]);

      if (i + CHUNK_SIZE < jobsToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    setMatchingInProgress(false);
  };

  const handleCTAClick = (type: 'seeker' | 'recruiter') => {
    if (type === 'seeker') {
      router.push('/jobs');
    } else {
      // Previously opened a recruiter-specific signup modal here when
      // signed out, implying you needed a separate "recruiter account" to
      // post a job. You don't — any signed-in account can post, and
      // /submit itself already redirects to sign-in (now via a working
      // /auth page) if you're not signed in, same as everywhere else.
      router.push('/submit');
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
        {/* ── Post Jobs & Advertise banner ── */}
        {showAdBanner && (
          <Link
            href="/rates"
            className="relative flex items-center justify-center gap-2 sm:gap-3 px-10 py-2.5 text-center text-white text-xs sm:text-sm"
            style={{ background: `linear-gradient(90deg, ${theme.colors.primary.dark}, ${theme.colors.primary.DEFAULT})` }}
          >
            <span className="font-semibold">
              📢 Post Jobs &amp; Advertise on JobMeter
            </span>
            <span className="hidden sm:inline text-white/85">
              Reach thousands of active job seekers.
            </span>
            <span className="underline font-medium whitespace-nowrap">View our rates →</span>
            <button
              onClick={dismissAdBanner}
              aria-label="Dismiss"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20"
            >
              <X size={14} />
            </button>
          </Link>
        )}
        {/* Hero Section */}
        <section className="relative px-6 py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/homepage.webp"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Next Career Opportunity
              </h1>
              <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
                Browse thousands of job listings from employers and discover tools to improve your career.
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg p-1 bg-white/10 backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab('seekers')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'seekers'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:text-blue-100'
                  }`}
                  aria-label="For Job Seekers"
                >
                  For Job Seekers
                </button>
                <button
                  onClick={() => setActiveTab('recruiters')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'recruiters'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:text-blue-100'
                  }`}
                  aria-label="For Recruiters"
                >
                  For Recruiters
                </button>
              </div>
            </div>

            {activeTab === 'seekers' ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
                    <Briefcase size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Browse Thousands of Jobs
                    </h2>
                    <p className="text-gray-600">
                      Find opportunities from employers and various job sources.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCTAClick('seeker')}
                    className="flex-1 py-3 px-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                    aria-label="Browse all jobs"
                  >
                    Browse Jobs
                    <ArrowRight className="inline ml-2" size={18} />
                  </button>
                  {!user && (
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="py-3 px-3 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50 whitespace-nowrap"
                      style={{ borderColor: theme.colors.primary.DEFAULT, color: theme.colors.primary.DEFAULT }}
                      aria-label="Log in or sign up"
                    >
                      Log In
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Find Top Talent for Your Team
                    </h2>
                    <p className="text-gray-600">
                      Post jobs, reach qualified candidates, and build your dream team.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCTAClick('recruiter')}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: theme.colors.success }}
                  aria-label="Post a job"
                >
                  Post a Job
                  <PlusCircle className="inline ml-2" size={18} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── AD 1: Top banner — high visibility after hero ── */}
        <section className="px-6 py-4" style={{ backgroundColor: theme.colors.background.muted }}>
          <div className="max-w-4xl mx-auto">
            {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="4198231153" format="auto" />
*/}
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>
                  10,000+
                </div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>
                  5,000+
                </div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>
                  50,000+
                </div>
                <div className="text-sm text-gray-600">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>
                  98%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="px-6 py-8" style={{ backgroundColor: theme.colors.background.muted }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user ? 'Recommended Jobs For You' : 'Featured Jobs'}
                </h2>
                <p className="text-sm text-gray-600">
                  {matchingInProgress 
                    ? 'Calculating your personalized matches...' 
                    : user && processedJobs.length > 0 
                    ? 'Based on your profile and preferences'
                    : 'Latest opportunities from top companies'}
                </p>
              </div>
              <Link
                href="/jobs"
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: theme.colors.primary.DEFAULT }}
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedJobs.length > 0 ? (
                processedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Building2 size={14} />
                          <span className="truncate">{job.company?.name || 'Company'}</span>
                        </div>
                      </div>
                      {user && job.matchScore > 0 && <MatchCircle score={job.matchScore} />}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>
                            {typeof job.location === 'string'
                              ? job.location
                              : `${job.location.city || ''}${
                                  job.location.state ? `, ${job.location.state}` : ''
                                }`}
                          </span>
                        </div>
                      )}
                      {job.posted_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(job.posted_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {job.breakdown && user && (
                      <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                        {job.breakdown.rolesScore > 0 && (
                          <span className="mr-2">• {job.breakdown.rolesReason}</span>
                        )}
                        {job.breakdown.skillsScore > 0 && (
                          <span className="mr-2">• {job.breakdown.skillsReason}</span>
                        )}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Remote Jobs Section */}
        <section className="px-6 py-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Remote Jobs</h2>
                <p className="text-sm text-gray-600">
                  Work from anywhere with these remote opportunities
                </p>
              </div>
              <Link
                href="/jobs?remote=true"
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: theme.colors.primary.DEFAULT }}
              >
                View All Remote Jobs
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Work From Anywhere</h3>
                  <p className="text-sm text-gray-600">
                    Discover remote positions that offer flexibility and work-life balance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Popular Remote Roles</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Software Developer</li>
                    <li>• Digital Marketer</li>
                    <li>• Customer Support</li>
                    <li>• Content Writer</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Remote Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Flexible schedule</li>
                    <li>• No commute</li>
                    <li>• Global opportunities</li>
                    <li>• Work-life balance</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/jobs?remote=true"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Remote Jobs
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── AD 2: In-article mid-page — natural break before countries ── */}
        <section className="px-6 py-4 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit
              slot="4690286797"
              format="fluid"
              layout="in-article"
            />
*/}
          </div>
        </section>

        {/* Browse Jobs by Country */}
        <section className="px-6 py-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs by Country</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COUNTRIES.map((country) => (
                <Link
                  key={country.slug}
                  href={`/jobs?sort=match&search=${encodeURIComponent(country.searchTerm)}`}
                  className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                >
                  <span>{country.flag}</span>
                  {country.title}
                </Link>
              ))}
              <Link
                href="/jobs"
                className="text-blue-600 hover:underline font-semibold mt-2 text-sm"
              >
                View All Countries →
              </Link>
            </div>
          </div>
        </section>

        {/* Why JobMeter */}
        <section className="px-6 py-8 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose JobMeter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-blue-100">
                <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: theme.colors.primary.DEFAULT + '20' }}>
                  <Sparkles size={24} style={{ color: theme.colors.primary.DEFAULT }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Job Matching</h3>
                <p className="text-sm text-gray-600">Our AI technology analyzes your profile and matches you with jobs that fit your skills, experience, and career goals.</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-blue-100">
                <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: theme.colors.success + '20' }}>
                  <Shield size={24} style={{ color: theme.colors.success }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Wide Range of Opportunities</h3>
                <p className="text-sm text-gray-600">Access job listings from direct employer postings and various sources across the web. We bring together diverse opportunities to help you find the right fit.</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-blue-100">
                <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: theme.colors.accent.blue + '20' }}>
                  <CheckCircle size={24} style={{ color: theme.colors.accent.blue }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Career Tools & Resources</h3>
                <p className="text-sm text-gray-600">Access CV builders, interview prep guides, career advice, and application tracking to optimize your job search success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg">
                  <summary className="flex justify-between items-center cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Career Insights Blog Posts */}
        <section className="px-6 py-8" style={{ backgroundColor: theme.colors.background.muted }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Career Insights & Tips</h2>
                <p className="text-sm text-gray-600">Guides, salary data, and career advice from around the world</p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: theme.colors.primary.DEFAULT }}
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

{/* SEO Footer Content */}
<section className="px-6 py-12 bg-gray-50">
  <div className="max-w-4xl mx-auto">
    <div className="prose prose-sm max-w-none">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Trusted Partner in Global Job Search</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        JobMeter connects job seekers with employment opportunities across multiple industries, experience levels, and countries. Whether you&apos;re searching for entry-level positions, professional careers, remote work, or specialized roles, our platform provides access to thousands of current job listings from direct employer postings and various sources across the web. Our intelligent job matching technology helps candidates find positions that align with their skills, experience, location preferences, and career aspirations.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        <span className="font-semibold text-amber-600">Important Notice:</span> While we strive to provide quality listings, some jobs on our platform may come from third-party sources. We encourage job seekers to conduct their own research before applying. Always verify job details directly with the hiring company, research employers independently, and exercise caution when sharing personal information. Report any suspicious listings to help.jobmeter@gmail.com.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        From accounting and finance jobs to technology, healthcare, sales, marketing, engineering, and administrative positions, JobMeter serves as your complete career platform. Job seekers benefit from personalized match scores, application tracking, CV creation tools, interview preparation resources, and career advice. Employers can post jobs directly to reach qualified candidates. We facilitate connections between job seekers and companies, though applications are typically submitted directly to employers or their designated systems.
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">
        Explore job opportunities in major cities, browse by industry sector, search by job type (full-time, part-time, contract, remote), and access resources including salary guides, resume tips, and interview strategies. JobMeter is committed to making your job search journey seamless, productive, and successful. Join thousands of professionals who have found their ideal careers through our platform.
      </p>
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/jobs" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Browse Jobs
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/category" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Browse by Category
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/tools" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Career Tools
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/cv-templates" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          CV Templates
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/resource" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Resources
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/blog" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          blog
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/company" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Companies
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/about" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          About Us
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/submit" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Post a Job
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/privacy-policy" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Privacy
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/terms-of-service" className="font-semibold hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          Terms
        </Link>
      </div>
    </div>
  </div>
</section>

        {/* ── AD 3: Bottom banner — final impression before footer ── */}
        <section className="px-6 py-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* ADS PAUSED 2026-09-01 (post-restriction conservative rollout).
   To re-enable: generate a NEW ad unit in AdSense dashboard
   (Ads > By ad unit > Display ads) and update the slot below,
   then uncomment this block.
<AdUnit slot="9751041788" format="auto" />
*/}
          </div>
        </section>

      </div>
    </>
  );
}
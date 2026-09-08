"use client";

import Link from 'next/link';
import {
  Send, ListChecks, Users, Building2, Building, ArrowLeft,
} from 'lucide-react';
import { theme } from '@/lib/theme';

interface FeatureCard {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
}

const features: FeatureCard[] = [
  { label: 'Post a Job', desc: 'Submit a new listing for review', href: '/submit', icon: Send, color: theme.colors.primary.DEFAULT },
  { label: 'Your Jobs & Applicants', desc: 'Track status and view applicants', href: '/dashboard/recruiter/jobs', icon: ListChecks, color: theme.colors.accent.blue },
  { label: 'Browse Talent Pool', desc: 'Search candidates who opted in', href: '/talent', icon: Users, color: theme.colors.accent.green },
  { label: 'Register a Company', desc: 'Set up a company profile', href: '/company/register', icon: Building2, color: theme.colors.accent.gold },
  { label: 'Company Directory', desc: 'Browse and manage listed companies', href: '/company', icon: Building, color: theme.colors.text.secondary },
];

export default function RecruiterToolsDashboardPage() {
  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/settings"
          className="flex items-center gap-1.5 text-sm mb-3 hover:underline"
          style={{ color: theme.colors.text.secondary }}
        >
          <ArrowLeft size={15} /> Settings
        </Link>
        <h1 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text.primary }}>
          Recruiter Dashboard
        </h1>
        <p className="text-sm mb-6" style={{ color: theme.colors.text.secondary }}>
          Everything you need to post and manage jobs.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map(({ label, desc, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-3 rounded-2xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-900 leading-snug">{label}</span>
                <span className="block text-xs text-gray-500 mt-0.5 leading-snug">{desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

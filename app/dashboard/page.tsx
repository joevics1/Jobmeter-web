"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, ClipboardList, FileText, Brain, FileSignature, MessageCircle, GraduationCap, Shield, FileCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';

interface FeatureCard {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Candidate-facing tools only — posting/managing jobs now lives in its own
// Recruiter Dashboard at /dashboard/recruiter.
const features: FeatureCard[] = [
  { label: 'Browse Jobs', desc: 'Search and filter open roles', href: '/jobs', icon: Briefcase, color: theme.colors.primary.DEFAULT },
  { label: 'My Applications', desc: 'Track jobs you\u2019ve applied to', href: '/dashboard/applications', icon: ClipboardList, color: theme.colors.accent.blue },
  { label: 'Create CV / Cover Letter', desc: 'Build a polished CV in minutes', href: '/cv', icon: FileText, color: theme.colors.accent.green },
  { label: 'Recruitment Practice Test', desc: 'Prep with real recruiter questions', href: '/tools/quiz', icon: Brain, color: theme.colors.accent.gold },
  { label: 'Create Document', desc: 'Contracts, letters, and more', href: '/documents', icon: FileSignature, color: theme.colors.accent.blue },
  { label: 'Interview Practice', desc: 'Rehearse with an AI interviewer', href: '/tools/interview', icon: MessageCircle, color: theme.colors.accent.green },
  { label: 'Career Coach', desc: 'Get personalized career guidance', href: '/tools/career', icon: GraduationCap, color: theme.colors.primary.DEFAULT },
  { label: 'Check Job for Scam', desc: 'Verify a listing looks legitimate', href: '/tools/scam-checker', icon: Shield, color: theme.colors.accent.red },
  { label: 'Analyse Your CV', desc: 'Get an ATS compatibility score', href: '/tools/ats-review', icon: FileCheck, color: theme.colors.accent.gold },
];

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const name = user?.user_metadata?.full_name || '';
      setFirstName(name.split(' ')[0] || '');
    })();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/settings" className="text-sm mb-3 inline-block hover:underline" style={{ color: theme.colors.primary.DEFAULT }}>
          ← Settings
        </Link>
        <h1 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text.primary }}>
          {firstName ? `Hi, ${firstName}` : 'Dashboard'}
        </h1>
        <p className="text-sm mb-6" style={{ color: theme.colors.text.secondary }}>
          Everything you need, in one place.
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

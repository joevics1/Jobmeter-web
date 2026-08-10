"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Brain, FileSignature, MessageCircle, GraduationCap, Shield, FileCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';

interface FeatureCard {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const features: FeatureCard[] = [
  { label: 'Create CV / Cover Letter', href: '/cv', icon: FileText },
  { label: 'Recruitment Practice Test', href: '/tools/quiz', icon: Brain },
  { label: 'Create Document', href: '/documents', icon: FileSignature },
  { label: 'Interview Practice', href: '/tools/interview', icon: MessageCircle },
  { label: 'Career Coach', href: '/tools/career', icon: GraduationCap },
  { label: 'Check Job for Scam', href: '/tools/scam-checker', icon: Shield },
  { label: 'Analyse Your CV', href: '/tools/ats-review', icon: FileCheck },
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
        <h1 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text.primary }}>
          {firstName ? `Hi, ${firstName}` : 'Dashboard'}
        </h1>
        <p className="text-sm mb-6" style={{ color: theme.colors.text.secondary }}>
          Everything you need, in one place.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {features.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl py-6 px-3 text-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              <Icon className="h-7 w-7 text-white" />
              <span className="text-sm font-medium text-white leading-snug">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, FileText, Mail, FileCheck2, Sparkles, ArrowRight } from 'lucide-react';
import { theme } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'CV & Docs | JobMeter',
  description: 'Free CV templates, cover letter templates, document templates, and an AI-powered CV & cover letter builder — all in one place.',
  alternates: { canonical: 'https://www.jobmeter.app/docs' },
};

interface HubCard {
  title: string;
  badge?: string;
  description: string;
  href: string;
  icon: React.ElementType;
  accent: string;
}

const cards: HubCard[] = [
  {
    title: 'CV Templates',
    badge: 'Beta',
    description: 'Browse free, role-specific CV templates. Fill in your details and download instantly.',
    href: '/cv-templates',
    icon: FileText,
    accent: '#2563EB',
  },
  {
    title: 'Cover Letter Templates',
    badge: 'Beta',
    description: 'Role-specific cover letter templates that pair with your CV — free, no sign-up.',
    href: '/cover-letter-templates',
    icon: Mail,
    accent: '#7C3AED',
  },
  {
    title: 'Document Templates',
    description: 'Offer letters, agreements, affidavits, and more — country-specific, ready to fill and download.',
    href: '/documents',
    icon: FileCheck2,
    accent: '#059669',
  },
  // AI CV & Cover Letter Builder (/cv) card retired 2026-09-06 to save
  // AI cost. The route itself is untouched — this just removes it from
  // navigation. To bring it back, restore this card:
  // {
  //   title: 'AI CV & Cover Letter Builder',
  //   description: 'Let AI write and format your CV and cover letter from scratch, tailored to the role you want.',
  //   href: '/cv',
  //   icon: Sparkles,
  //   accent: '#DB2777',
  // },
];

export default function CvAndDocsHubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF1F7' }}>
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 flex items-center gap-1"><Home className="h-3.5 w-3.5" />Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900 font-medium">CV &amp; Docs</span>
        </nav>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">CV &amp; Docs</h1>
          <p className="text-gray-500 leading-relaxed">
            Everything you need to apply with confidence — CVs, cover letters, and other documents,
            ready-made or AI-generated.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ backgroundColor: `${card.accent}14` }}
                  >
                    <Icon size={22} style={{ color: card.accent }} />
                  </span>
                  {card.badge && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                  {card.title}
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

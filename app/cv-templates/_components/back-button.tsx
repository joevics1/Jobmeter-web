'use client';

// app/cv-templates/_components/back-button.tsx
// Shared back-navigation header for the CV Templates feature, styled to
// match the existing app/cv/create header convention (ArrowLeft on a
// brand-colored sticky bar). Isolated component, only used within
// app/cv-templates/*.

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function BackButton({ title, href }: { title: string; href?: string }) {
  const router = useRouter();

  return (
    <div className="pt-6 pb-4 px-4 sticky top-0 z-40" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <button
          onClick={() => (href ? router.push(href) : router.back())}
          className="p-2 rounded-full hover:bg-white/20 transition-colors bg-white/20 shrink-0"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
      </div>
    </div>
  );
}

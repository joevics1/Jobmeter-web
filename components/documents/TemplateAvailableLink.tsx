'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileCheck2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TemplateAvailableLinkProps {
  documentTypeSlug: string;
  country: string;
}

// Checks (client-side, public read) whether a reviewed, published fixed
// template exists for this exact (document type, country) pair, and if so,
// offers a quick way to use that instead of the AI-assembled version —
// same output, but instant and free since there's no AI call at all.
export default function TemplateAvailableLink({ documentTypeSlug, country }: TemplateAvailableLinkProps) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!documentTypeSlug || !country) { setAvailable(false); return; }

    (async () => {
      try {
        const { data } = await supabase
          .from('document_templates')
          .select('id')
          .eq('document_type', documentTypeSlug)
          .eq('country', country)
          .eq('status', 'published')
          .maybeSingle();
        if (!cancelled) setAvailable(!!data);
      } catch {
        if (!cancelled) setAvailable(false);
      }
    })();

    return () => { cancelled = true; };
  }, [documentTypeSlug, country]);

  if (!available) return null;

  return (
    <Link
      href={`/documents/${documentTypeSlug}/${country}`}
      className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-blue-500/15 transition-colors"
    >
      <FileCheck2 className="h-4 w-4 flex-shrink-0" />
      A ready-made template exists for this document — skip the AI and fill it in directly →
    </Link>
  );
}

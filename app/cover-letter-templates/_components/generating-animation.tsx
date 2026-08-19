'use client';

// app/cv-templates/_components/generating-animation.tsx
// Animated loading state shown while Quick Create (or Fetch) is resolving.

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function GeneratingAnimation({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 1400);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-14 h-14 mb-5">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <Sparkles size={20} className="absolute inset-0 m-auto text-blue-600" />
      </div>
      <p className="text-muted-foreground font-medium transition-opacity duration-300">{messages[index]}</p>
    </div>
  );
}

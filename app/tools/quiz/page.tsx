"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';

export default function QuizPage() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('objective_questions')
        .select('company');

      if (error) throw error;
      
      const uniqueCompanies = [...new Set(data?.map(q => q.company) || [])];
      setCompanies(uniqueCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div
        className="pt-12 pb-10 px-6"
        style={{ backgroundColor: theme.colors.primary.DEFAULT }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: theme.colors.text.light }}>
            Quiz Platform
          </h1>
          <p className="text-lg" style={{ color: theme.colors.text.light }}>
            Practice aptitude tests from top companies
          </p>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
        {/* How it works - AT TOP */}
        <div className="bg-white rounded-xl p-4 mb-6" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
          <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div><strong>Objective:</strong> 20 multiple choice</div>
            <div><strong>Theory:</strong> 5 essay, AI graded</div>
            <div><strong>Password:</strong> Required for theory</div>
          </div>
        </div>

        {/* Select Company */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Select a Company</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" size={32} style={{ color: theme.colors.primary.DEFAULT }} />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {companies.map((company) => (
              <Link
                key={company}
                href={`/tools/quiz/${company.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all text-center"
                style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}
              >
                <span className="font-medium text-gray-900 text-sm">{company}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

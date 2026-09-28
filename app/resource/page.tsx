"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Newspaper,
  MapPin,
  ArrowRight,
  Wrench,
  FileText,
} from 'lucide-react';
import { theme } from '@/lib/theme';
import AdUnit from '@/components/ads/AdUnit';
import { FEATURED_TOOLS } from '@/lib/toolsNav';

export default function ResourcePage() {
  const resources = [
    {
      id: 'locations',
      title: 'Jobs by Location & Role',
      description: 'Find jobs in different cities, states, and job categories',
      icon: MapPin,
      color: '#10B981',
      route: '/category',
    },
    {
      id: 'blogs',
      title: 'Blog Posts',
      description: 'Career tips, salary guides, and insights',
      icon: Newspaper,
      color: '#9333EA',
      route: '/blog',
    },
    {
      id: 'companies',
      title: 'Companies',
      description: 'Explore top companies and their culture',
      icon: Building2,
      color: '#F59E0B',
      route: '/company',
    },
    {
      id: 'tools',
      title: 'Tools',
      description: 'Job finders, calculators, CV review, interview prep, and more',
      icon: Wrench,
      color: '#3B82F6',
      route: '/tools',
    },
    {
      id: 'cv-templates',
      title: 'CV Templates',
      description: 'Free, role-specific CV templates you can fill in and download',
      icon: FileText,
      color: '#DC2626',
      route: '/cv-templates',
    },
  ];

  // Show middle ad only if there are at least 14 resources
  const showMiddleAd = resources.length >= 14;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      {/* Header */}
      <div
        className="pt-12 pb-10 px-6"
        style={{ backgroundColor: theme.colors.primary.DEFAULT }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: theme.colors.text.light }}
          >
            Resources
          </h1>
        </div>
      </div>

      {/* ── AD 1: Top banner — Sept 2026 ad unit ── */}
      <div className="px-4 md:px-6 pt-6 max-w-4xl mx-auto">
        <AdUnit slot="1178418475" format="auto" />
      </div>

      {/* Resource Cards */}
      <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">

        {/* First half of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {resources.slice(0, Math.ceil(resources.length / 2)).map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.id}
                href={resource.route}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-4 group"
                style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${resource.color}15` }}
                >
                  <Icon size={26} style={{ color: resource.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                />
              </Link>
            );
          })}
        </div>

        {/* ── Conditional Middle AD ── */}
        {showMiddleAd && (
          <div className="mb-6">
            <AdUnit slot="8855092895" format="fluid" layout="in-article" />
          </div>
        )}

        {/* Second half of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.slice(Math.ceil(resources.length / 2)).map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.id}
                href={resource.route}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-4 group"
                style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${resource.color}15` }}
                >
                  <Icon size={26} style={{ color: resource.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                />
              </Link>
            );
          })}
        </div>

        {/* Popular Tools — links straight to individual tool pages so this
            hub actually distributes link equity into the tools cluster,
            not just down to the /tools index. */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Tools</h2>
          <div className="flex flex-wrap gap-2">
            {FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        {/* ── AD 3: Bottom banner — Sept 2026 ad unit ── */}
        <div className="mt-10">
          <AdUnit slot="1633803336" format="auto" />
        </div>
      </div>
    </div>
  );
}
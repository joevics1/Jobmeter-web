"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Building2, 
  Newspaper,
  MapPin,
  ArrowRight,
  Laptop,
  GraduationCap,
  Home,
  Globe,
  Rocket,
  ClipboardList,
  Award
} from 'lucide-react';
import { theme } from '@/lib/theme';

export default function ResourcePage() {
  const resources = [
    {
      id: 'categories',
      title: 'Categories',
      description: 'Browse jobs by category and specialization',
      icon: Briefcase,
      color: '#2563EB',
      route: '/resources',
    },
    {
      id: 'locations',
      title: 'Locations',
      description: 'Find jobs in different cities and states',
      icon: MapPin,
      color: '#10B981',
      route: '/jobs/state',
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
          id: 'remote-jobs',
          title: 'Remote Jobs',
          description: 'Find remote job opportunities in Nigeria and worldwide',
          icon: Laptop,
          color: '#06B6D4',
          route: '/tools/remote-jobs-finder',
        },
        {
          id: 'internship-finder',
          title: 'Internship Finder',
          description: 'Find internship opportunities to kickstart your career',
          icon: GraduationCap,
          color: '#2563EB',
          route: '/tools/internship-finder',
        },
        {
          id: 'nysc-finder',
          title: 'NYSC Jobs',
          description: 'Find job opportunities for NYSC corpers',
          icon: Award,
          color: '#10B981',
          route: '/tools/nysc-finder',
        },
        {
          id: 'accommodation-finder',
          title: 'Jobs with Accommodation',
          description: 'Find jobs that offer accommodation benefits',
          icon: Home,
          color: '#14B8A6',
          route: '/tools/accommodation-finder',
        },
        {
          id: 'visa-finder',
          title: 'Jobs with Visa Sponsorship',
          description: 'Find jobs that offer visa sponsorship and work permits',
          icon: Globe,
          color: '#3B82F6',
          route: '/tools/visa-finder',
        },
        {
          id: 'graduate-trainee-finder',
          title: 'Graduate & Trainee Jobs',
          description: 'Find graduate programs and trainee positions for fresh graduates',
          icon: GraduationCap,
          color: '#2563EB',
          route: '/tools/graduate-trainee-finder',
        },
        {
          id: 'entry-level-finder',
          title: 'Entry Level Jobs',
          description: 'Find entry-level jobs for beginners starting their career',
          icon: Rocket,
          color: '#2563EB',
          route: '/tools/entry-level-finder',
        },
        {
          id: 'quiz',
          title: 'Quiz Platform',
          description: 'Practice aptitude tests and theory questions',
          icon: ClipboardList,
          color: '#2563EB',
          route: '/tools/quiz',
        },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      {/* Header */}
      <div
        className="pt-12 pb-10 px-6"
        style={{
          backgroundColor: theme.colors.primary.DEFAULT,
        }}
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

      {/* Resource Cards */}
      <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            
            return (
              <Link
                key={resource.id}
                href={resource.route}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-4 group"
                style={{
                  border: `1px solid ${theme.colors.border.DEFAULT}`,
                }}
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
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FEATURED_TOOLS } from '@/lib/toolsNav';

// This footer renders on every page (via app/layout.tsx), so it's the single
// biggest lever for sitewide internal linking: every page — job, category,
// company, blog post, CV template, or tool — links out to every other
// cluster on the site through here, and every cluster's hub page links back
// in. Keep columns short (5-6 links) so this stays crawlable and useful
// rather than a wall of links.

const footerColumns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Job Seekers',
    links: [
      { href: '/jobs', label: 'Browse All Jobs' },
      { href: '/category', label: 'Jobs by Location & Role' },
      { href: '/company', label: 'Companies Hiring' },
      { href: '/documents', label: 'Document Templates' },
      { href: '/saved', label: 'Saved Jobs' },
    ],
  },
  {
    title: 'Career Tools',
    links: [
      { href: '/tools', label: 'All Career Tools' },
      ...FEATURED_TOOLS.slice(0, 4).map((t) => ({ href: t.route, label: t.title })),
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/resource', label: 'Resource Hub' },
      { href: '/blog', label: 'Career Blog' },
      { href: '/cv-templates', label: 'Free CV Templates' },
      { href: '/cv', label: 'CV Builder' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/submit', label: 'Post a Job' },
      { href: '/company/register', label: 'Register a Company' },
    ],
  },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/disclaimer', label: 'Disclaimer' },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-gray-200 bg-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                        pathname === link.href ? 'text-blue-600 font-medium' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} JobMeter. All rights reserved.</p>
          <nav className="flex flex-wrap justify-center gap-4 text-xs">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-500 hover:text-blue-600 transition-colors">
                {link.label}
              </Link>
            ))}
            <a
              href="https://gulftools.jobmeter.app/"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Gulf Tools
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

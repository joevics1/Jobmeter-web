import Link from 'next/link';
import { Metadata } from 'next';
import {
  Send, Star, Users, Megaphone, CheckCircle2, ArrowRight, Mail,
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { JOB_POSTING_PLANS, FEATURED_JOB_PRICE, FREE_ACTIVE_JOB_LIMIT } from '@/lib/constants/jobPricing';

export const metadata: Metadata = {
  title: 'Rates — Post Jobs & Advertise on JobMeter',
  description: 'Job posting plans, featured placement, talent pool access, and advertising rates on JobMeter.',
};

function PlanCard({
  title, price, sublabel, features, highlight,
}: { title: string; price: string; sublabel?: string; features: string[]; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-6 border ${highlight ? 'border-2 shadow-lg' : 'border-gray-100 shadow-sm'} bg-white flex flex-col`}
      style={highlight ? { borderColor: theme.colors.primary.DEFAULT } : undefined}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary.DEFAULT }}>{price}</p>
      {sublabel && <p className="text-xs text-gray-500 mb-4">{sublabel}</p>}
      <ul className="space-y-2 mt-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: theme.colors.success }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RatesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: `${theme.colors.primary.DEFAULT}15` }}
          >
            <Megaphone size={26} style={{ color: theme.colors.primary.DEFAULT }} />
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Jobs & Advertise on JobMeter</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Reach thousands of active job seekers browsing JobMeter every day. Here's everything it costs.
          </p>
        </div>

        {/* Job posting */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Send size={18} style={{ color: theme.colors.primary.DEFAULT }} />
            <h2 className="text-lg font-semibold text-gray-900">Job Posting</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PlanCard
              title="Free"
              price="₦0"
              features={[`${FREE_ACTIVE_JOB_LIMIT} active job listings at a time`, 'No expiry while active', 'Standard visibility in listings']}
            />
            <PlanCard
              title={JOB_POSTING_PLANS.single_post.label}
              price={`₦${JOB_POSTING_PLANS.single_post.amount.toLocaleString()}`}
              sublabel={JOB_POSTING_PLANS.single_post.sublabel}
              features={['One-time payment', 'Publish exactly one job beyond your free limit']}
            />
            <PlanCard
              title={JOB_POSTING_PLANS.basic_monthly.label}
              price={`₦${JOB_POSTING_PLANS.basic_monthly.amount.toLocaleString()}`}
              sublabel="per month"
              features={[`${FREE_ACTIVE_JOB_LIMIT + JOB_POSTING_PLANS.basic_monthly.extraActiveJobSlots} active jobs while subscribed`, 'Renews monthly']}
            />
            <PlanCard
              title={JOB_POSTING_PLANS.unlimited_monthly.label}
              price={`₦${JOB_POSTING_PLANS.unlimited_monthly.amount.toLocaleString()}`}
              sublabel="per month"
              features={['No cap on active jobs', 'Best for high-volume hiring', 'Renews monthly']}
              highlight
            />
          </div>
        </section>

        {/* Featured placement */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} style={{ color: theme.colors.accent.gold }} />
            <h2 className="text-lg font-semibold text-gray-900">Featured Placement</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlanCard
              title="Feature a Job"
              price={`₦${FEATURED_JOB_PRICE.amount.toLocaleString()}`}
              sublabel={`${FEATURED_JOB_PRICE.durationDays} days`}
              features={[
                'Pinned to the top of the jobs list with a Featured badge',
                'Shown to everyone browsing your job\u2019s country, plus Global and Remote views',
                'Significantly higher visibility than a standard listing',
              ]}
              highlight
            />
            <PlanCard
              title="Talent Pool Access"
              price="₦10,000"
              sublabel="30 days"
              features={[
                'Unlimited views of candidates who\u2019ve opted in to be discovered',
                'Search and filter by skills, role, and location',
                'Great alongside your own job postings',
              ]}
            />
          </div>
        </section>

        {/* Advertise with us */}
        <section
          className="rounded-2xl p-8 text-center"
          style={{ background: `linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.dark})` }}
        >
          <Megaphone size={28} className="mx-auto mb-3 text-white" />
          <h2 className="text-xl font-bold text-white mb-2">Want to advertise on JobMeter?</h2>
          <p className="text-white/85 max-w-lg mx-auto mb-5 text-sm">
            Banner placements, newsletter mentions, and sponsorships are available for brands looking
            to reach job seekers. Rates depend on placement and duration — reach out and we'll put a package together for you.
          </p>
          <a
            href="mailto:help.jobmeter@gmail.com?subject=Advertising%20on%20JobMeter"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white font-semibold text-sm"
            style={{ color: theme.colors.primary.DEFAULT }}
          >
            <Mail size={16} /> Contact us to advertise
          </a>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link
            href="/submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            <Send size={16} /> Post a Job <ArrowRight size={16} />
          </Link>
          <Link
            href="/talent"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border"
            style={{ borderColor: theme.colors.primary.DEFAULT, color: theme.colors.primary.DEFAULT }}
          >
            <Users size={16} /> Browse Talent Pool
          </Link>
        </div>
      </div>
    </div>
  );
}

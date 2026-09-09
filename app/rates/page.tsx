import Link from 'next/link';
import { Metadata } from 'next';
import {
  Send, Star, Users, Megaphone, CheckCircle2, ArrowRight, MessageCircle,
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { FEATURED_JOB_PRICE } from '@/lib/constants/jobPricing';
import JobPostingPlans from '@/components/rates/JobPostingPlans';

export const metadata: Metadata = {
  title: 'Rates — Post Jobs & Advertise on JobMeter',
  description: 'Job posting plans, featured placement, and advertising rates on JobMeter.',
};

function FeaturedPlanCard({
  title, price, sublabel, features, cta,
}: {
  title: string; price: string; sublabel?: string; features: string[]; cta: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6 border-2 shadow-lg bg-white flex flex-col"
      style={{ borderColor: theme.colors.primary.DEFAULT }}
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
      {cta}
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

        <JobPostingPlans />

        {/* Featured placement */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} style={{ color: theme.colors.accent.gold }} />
            <h2 className="text-lg font-semibold text-gray-900">Featured Placement</h2>
          </div>
          <div className="max-w-sm">
            <FeaturedPlanCard
              title="Homepage Featured Job"
              price={`₦${FEATURED_JOB_PRICE.amount.toLocaleString()}`}
              sublabel={`${FEATURED_JOB_PRICE.durationDays} days`}
              features={[
                'Pinned to the top of the jobs list with a Featured badge',
                'Shown to everyone browsing your job\u2019s country, plus Global and Remote views',
                'Significantly higher visibility than a standard listing',
              ]}
              cta={
                <Link
                  href="/dashboard/recruiter/jobs"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white"
                  style={{ backgroundColor: theme.colors.primary.DEFAULT }}
                >
                  Feature a Job <ArrowRight size={15} />
                </Link>
              }
            />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Feature an existing job from your <Link href="/dashboard/recruiter/jobs" className="underline">jobs list</Link> — pay per job, no plan required.
          </p>
        </section>

        {/* Advertise with us — the only thing on this page you need to contact us for */}
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
            href="https://wa.me/2347056928186?text=Hi%2C%20I%27m%20interested%20in%20advertising%20on%20JobMeter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white font-semibold text-sm"
            style={{ color: theme.colors.primary.DEFAULT }}
          >
            <MessageCircle size={16} /> Contact us to advertise
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

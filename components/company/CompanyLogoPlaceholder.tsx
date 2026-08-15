import {
  Building2,
  Cpu,
  ShoppingCart,
  Landmark,
  HeartPulse,
  GraduationCap,
  Factory,
  Zap,
  Users,
  Newspaper,
  Car,
  Sprout,
  Home,
  Store,
  BedDouble,
  Truck,
  Radio,
  HardHat,
  Scale,
  Fuel,
  ShieldCheck,
  HandHeart,
  UtensilsCrossed,
  Plane,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

// Each entry: keywords matched against the industry string (lowercase,
// substring match) -> icon + color pair. Order matters — first match wins,
// so more specific keywords should come before broader ones.
const INDUSTRY_STYLES: { keywords: string[]; icon: LucideIcon; bg: string; fg: string }[] = [
  { keywords: ['software', 'technology', 'tech', 'saas', 'it '], icon: Cpu, bg: 'bg-indigo-100', fg: 'text-indigo-600' },
  { keywords: ['e-commerce', 'ecommerce', 'retail'], icon: ShoppingCart, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { keywords: ['bank', 'finance', 'fintech', 'insurance'], icon: Landmark, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { keywords: ['insurance'], icon: ShieldCheck, bg: 'bg-teal-100', fg: 'text-teal-600' },
  { keywords: ['health', 'medical', 'pharma', 'hospital'], icon: HeartPulse, bg: 'bg-rose-100', fg: 'text-rose-600' },
  { keywords: ['education', 'school', 'training', 'academy', 'coaching'], icon: GraduationCap, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { keywords: ['manufactur', 'industrial'], icon: Factory, bg: 'bg-slate-200', fg: 'text-slate-600' },
  { keywords: ['energy', 'power', 'solar', 'renewable', 'oil', 'gas', 'petroleum'], icon: Zap, bg: 'bg-amber-100', fg: 'text-amber-600' },
  { keywords: ['oil', 'petroleum', 'fuel'], icon: Fuel, bg: 'bg-yellow-100', fg: 'text-yellow-700' },
  { keywords: ['recruit', 'staffing', 'hr ', 'human resource'], icon: Users, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
  { keywords: ['media', 'news', 'publish', 'broadcast'], icon: Newspaper, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { keywords: ['telecom', 'network', 'internet'], icon: Radio, bg: 'bg-sky-100', fg: 'text-sky-600' },
  { keywords: ['automotive', 'auto', 'vehicle', 'car '], icon: Car, bg: 'bg-red-100', fg: 'text-red-600' },
  { keywords: ['agricult', 'farm', 'agro'], icon: Sprout, bg: 'bg-lime-100', fg: 'text-lime-700' },
  { keywords: ['real estate', 'property', 'realty'], icon: Home, bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600' },
  { keywords: ['hospitality', 'hotel', 'travel', 'tourism'], icon: BedDouble, bg: 'bg-pink-100', fg: 'text-pink-600' },
  { keywords: ['airline', 'aviation', 'logistics', 'transport', 'shipping', 'freight'], icon: Truck, bg: 'bg-stone-200', fg: 'text-stone-600' },
  { keywords: ['construction', 'engineering', 'building'], icon: HardHat, bg: 'bg-yellow-100', fg: 'text-yellow-700' },
  { keywords: ['legal', 'law'], icon: Scale, bg: 'bg-neutral-200', fg: 'text-neutral-700' },
  { keywords: ['ngo', 'non-profit', 'nonprofit', 'charity', 'foundation'], icon: HandHeart, bg: 'bg-green-100', fg: 'text-green-600' },
  { keywords: ['food', 'beverage', 'restaurant', 'catering'], icon: UtensilsCrossed, bg: 'bg-orange-100', fg: 'text-orange-700' },
  { keywords: ['aviation', 'airline'], icon: Plane, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { keywords: ['consult', 'professional service'], icon: Briefcase, bg: 'bg-violet-100', fg: 'text-violet-600' },
];

const DEFAULT_STYLE = { icon: Building2, bg: 'bg-gray-100', fg: 'text-gray-400' };

function resolveIndustryStyle(industry: string | null | undefined) {
  if (!industry) return DEFAULT_STYLE;
  const value = industry.toLowerCase();
  const match = INDUSTRY_STYLES.find((entry) => entry.keywords.some((kw) => value.includes(kw)));
  return match ?? DEFAULT_STYLE;
}

interface CompanyLogoPlaceholderProps {
  industry: string | null | undefined;
  className?: string;
  iconClassName?: string;
}

/**
 * Renders a colored, industry-appropriate icon in place of a missing
 * company logo — e.g. a graduation cap for Education, a shopping cart
 * for E-commerce — instead of the same generic building icon everywhere.
 */
export default function CompanyLogoPlaceholder({
  industry,
  className = '',
  iconClassName = '',
}: CompanyLogoPlaceholderProps) {
  const { icon: Icon, bg, fg } = resolveIndustryStyle(industry);
  return (
    <div className={`flex items-center justify-center rounded-lg ${bg} ${className}`}>
      <Icon className={`${fg} ${iconClassName}`} />
    </div>
  );
}

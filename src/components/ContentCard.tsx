import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

const accentMap: Record<string, string> = {
  violet: 'bg-[#B7F36B]/10 text-[#B7F36B] border-[#B7F36B]/25',
  blue: 'bg-[#B7F36B]/10 text-[#B7F36B] border-[#B7F36B]/25',
  amber: 'bg-[#B7F36B]/10 text-[#B7F36B] border-[#B7F36B]/25',
  pink: 'bg-[#B7F36B]/10 text-[#B7F36B] border-[#B7F36B]/25',
  emerald: 'bg-[#B7F36B]/10 text-[#B7F36B] border-[#B7F36B]/25',
};

export function ContentCard({
  title,
  description,
  icon,
  route,
  badge,
  accent = 'blue',
  meta,
  index = 0,
}: {
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
  accent?: string;
  meta?: string;
  index?: number;
}) {
  const Icon = (Lucide[icon as keyof typeof Lucide] as LucideIcon) ?? Lucide.Sparkles;
  const accentClass = accentMap[accent] ?? accentMap.blue;
  return (
    <Link
      to={route}
      className="group card card-hover p-5 flex flex-col gap-3 animate-scale-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${accentClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className="chip bg-brand-purple/15 text-brand-purple border border-brand-purple/30">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-white flex items-center gap-1">
          {title}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </h3>
        <p className="text-brand-white/50 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
      {meta && <p className="text-xs text-brand-white/40 font-medium">{meta}</p>}
    </Link>
  );
}

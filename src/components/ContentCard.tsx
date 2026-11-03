import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

const accentMap: Record<string, string> = {
  violet: 'from-violet-500/20 to-purple-500/10 text-violet-300 border-violet-500/30',
  blue: 'from-blue-500/20 to-cyan-500/10 text-blue-300 border-blue-500/30',
  amber: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
  pink: 'from-pink-500/20 to-rose-500/10 text-pink-300 border-pink-500/30',
  emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
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
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center ${accentClass}`}>
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

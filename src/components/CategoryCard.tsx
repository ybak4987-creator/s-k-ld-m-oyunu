import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/data/categories';

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const Icon = (Lucide[category.icon as keyof typeof Lucide] as LucideIcon) ?? Lucide.Sparkles;
  return (
    <Link
      to={category.route}
      className={`group card card-hover p-5 relative overflow-hidden bg-gradient-to-br ${category.color} animate-scale-in`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-purple/20 transition-colors" />
      <div className="relative flex flex-col gap-3">
        <div className="w-12 h-12 rounded-2xl bg-ink-deep/60 border border-ink-border flex items-center justify-center text-white group-hover:scale-110 group-hover:text-brand-purple transition-all">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-1">
            {category.title}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-brand-white/50 text-xs mt-1 leading-relaxed">{category.description}</p>
        </div>
      </div>
    </Link>
  );
}

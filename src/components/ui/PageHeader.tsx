import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
};

export function PageHeader({ title, subtitle, icon, accent = 'from-brand-purple/30 to-brand-blue/20' }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden card mb-8 animate-fade-in">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple/20 rounded-full blur-3xl" />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex items-start gap-5">
        {icon && (
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-purple/30">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-brand-white/60 text-sm sm:text-base max-w-2xl">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; to: string };
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card p-10 text-center flex flex-col items-center gap-3 animate-scale-in">
      <div className="w-16 h-16 rounded-2xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-purple">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {description && <p className="text-brand-white/50 text-sm max-w-md">{description}</p>}
      {action && (
        <Link to={action.to} className="btn-primary mt-2 text-sm">
          {action.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: { label: string; to: string } }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      {action && (
        <Link to={action.to} className="text-sm font-semibold text-brand-purple hover:text-brand-blue transition-colors flex items-center gap-1">
          {action.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

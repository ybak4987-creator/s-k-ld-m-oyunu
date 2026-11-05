import type { LucideIcon } from 'lucide-react';
import { Construction, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';

export function ComingSoon({
  title,
  description,
  icon,
  backTo = '/',
  backLabel = 'Ana Sayfa',
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  backTo?: string;
  backLabel?: string;
}) {
  const Icon = icon;
  return (
    <div className="animate-fade-in">
      <PageHeader title={title} subtitle={description} icon={<Icon className="w-7 h-7" />} />
      <div className="card p-10 sm:p-16 text-center flex flex-col items-center gap-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border border-ink-border flex items-center justify-center text-brand-purple animate-float">
          <Construction className="w-10 h-10" />
        </div>
        <div className="relative">
          <h2 className="text-2xl font-extrabold text-white">Yakında Geliyor</h2>
          <p className="mt-2 text-brand-white/55 max-w-md mx-auto">
            Bu özellik üzerinde çalışıyoruz. SIKILDIM! platformuna yakında bu deneyim de eklenecek.
            O zamana kadar diğer eğlenceli içeriklere göz atabilirsin.
          </p>
        </div>
        <div className="relative flex items-center gap-1.5 text-sm text-brand-purple font-semibold">
          <Sparkles className="w-4 h-4" />
          Geliştirme aşamasında
        </div>
        <Link to={backTo} className="relative btn-ghost text-sm mt-2">
          <ArrowLeft className="w-4 h-4" />
          {backLabel}’a Dön
        </Link>
      </div>
    </div>
  );
}

import { ClipboardCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { tests } from '@/data/content';

export function TestsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Testler" subtitle="Zekânı, kişiliğini ve genel kültürünü test et. Sonuçlarını gör, kendini tanı." icon={<ClipboardCheck className="w-7 h-7" />} accent="from-blue-500/30 to-cyan-500/20" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((t, i) => (
          <ContentCard key={t.id} title={t.title} description={t.description} icon={t.icon} route={t.route} badge={t.badge} accent={t.accent} meta={`${t.questions} soru · ${t.minutes} dk · ${t.category}`} index={i} />
        ))}
      </div>
    </div>
  );
}

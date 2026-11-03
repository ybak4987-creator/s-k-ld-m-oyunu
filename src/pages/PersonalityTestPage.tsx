import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PersonalityQuiz } from '@/components/games/PersonalityQuiz';

export function PersonalityTestPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Kişilik Testi" subtitle="Soruları yanıtlarken içten ol. Kişilik tipini ve özelliklerini keşfet." icon={<Sparkles className="w-7 h-7" />} accent="from-pink-500/30 to-rose-500/20" />
      <PersonalityQuiz />
    </div>
  );
}

import { Brain } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QuizPlayer } from '@/components/games/QuizPlayer';
import { iqQuestions } from '@/data/quiz';

export function IQTestPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Mantık ve Sayı Testi" subtitle="Kolay örüntülerle başla. Sayıların nasıl ilerlediğini bul ve kendi hızında çöz." icon={<Brain className="w-7 h-7" />} accent="from-blue-500/30 to-cyan-500/20" />
      <QuizPlayer title="Mantık ve Sayı Testi" questions={iqQuestions} accent="blue" resultIntro="Güzel denemeydi! Yeni sorularla tekrar oynayabilir, istersen karışık moda geçebilirsin." />
    </div>
  );
}

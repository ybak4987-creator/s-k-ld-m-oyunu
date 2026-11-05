import { GraduationCap } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QuizPlayer } from '@/components/games/QuizPlayer';
import { triviaQuestions } from '@/data/quiz';

export function TriviaTestPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Genel Kültür Quiz" subtitle="Günlük hayattan genel kültür soruları. Kolay modda başla, istersen karışık sorulara geç." icon={<GraduationCap className="w-7 h-7" />} accent="from-amber-500/30 to-orange-500/20" />
      <QuizPlayer title="Genel Kültür Quiz" questions={triviaQuestions} accent="amber" resultIntro="Her tur yeni bir şey öğrenebilirsin. Hazırsan yeni sorularla tekrar dene!" />
    </div>
  );
}

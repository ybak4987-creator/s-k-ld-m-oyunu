import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { personalityQuestions, personalityResults } from '@/data/quiz';

export function PersonalityQuiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ extrovert: 0, introvert: 0, thinking: 0, feeling: 0 });
  const [done, setDone] = useState(false);

  const total = personalityQuestions.length;
  const q = personalityQuestions[current];

  const answer = (trait: string) => {
    const next = { ...scores, [trait]: scores[trait] + 1 };
    setScores(next);
    if (current + 1 < total) setCurrent((c) => c + 1);
    else setDone(true);
  };

  const reset = () => {
    setCurrent(0);
    setScores({ extrovert: 0, introvert: 0, thinking: 0, feeling: 0 });
    setDone(false);
  };

  if (!done) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white">Kişilik Testi</h2>
            <span className="chip bg-ink-deep border border-ink-border text-brand-white/60">
              {current + 1} / {total}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-ink-deep mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-purple to-brand-blue transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-5">{q.question}</h3>
          <div className="grid gap-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(opt.trait)}
                className="text-left p-4 rounded-xl border bg-ink-deep border-ink-border text-white hover:border-pink-500/40 hover:bg-ink-hover transition-all font-medium"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const type =
    (scores.extrovert >= scores.introvert ? 'extrovert' : 'introvert') +
    '-' +
    (scores.thinking >= scores.feeling ? 'thinking' : 'feeling');
  const result = personalityResults.find((r) => r.type === type)!;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card p-8 text-center bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 border-brand-purple/20 animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-pink-500/30 to-rose-500/20 border border-pink-500/40 flex items-center justify-center text-4xl font-extrabold text-white mb-4">
          {result.emoji}
        </div>
        <div className="chip bg-pink-500/15 text-pink-300 border border-pink-500/30 mx-auto mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Senin kişilik tipin
        </div>
        <h2 className="text-2xl font-extrabold text-white">{result.title}</h2>
        <p className="text-brand-white/60 mt-3 leading-relaxed">{result.description}</p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={reset} className="btn-primary text-sm">
            <RotateCcw className="w-4 h-4" />
            Tekrar Çöz
          </button>
          <Link to="/testler" className="btn-ghost text-sm">
            <ArrowRight className="w-4 h-4" />
            Diğer Testler
          </Link>
        </div>
      </div>
    </div>
  );
}

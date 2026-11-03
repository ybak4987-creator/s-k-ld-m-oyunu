import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lightbulb, RotateCcw, Trophy, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/data/quiz';
import { pickFreshDiverse, shuffleArray } from '@/data/gameUtils';

type QuizMode = 'Kolay' | 'Karışık';

function createSession(title: string, questions: QuizQuestion[], mode: QuizMode): QuizQuestion[] {
  const easyPool = questions.filter((question) => question.difficulty === 'Kolay');
  const pool = mode === 'Kolay' && easyPool.length >= 5 ? easyPool : questions;
  const count = Math.min(10, pool.length);
  const historyKey = title.toLocaleLowerCase('tr-TR').replace(/\s+/g, '-');
  const selected = pickFreshDiverse(
    pool,
    (question) => question.id,
    (question) => question.topic ?? 'Genel',
    `quiz-${historyKey}`,
    count,
  );

  return selected.map((question) => {
    const options = shuffleArray(question.options.map((label, index) => ({ label, correct: index === question.answer })));
    return {
      ...question,
      options: options.map((option) => option.label),
      answer: options.findIndex((option) => option.correct),
    };
  });
}

export function QuizPlayer({
  title,
  questions,
  accent = 'blue',
  resultIntro = 'Güzel iş! Dilersen yeni sorularla tekrar deneyebilirsin.',
}: {
  title: string;
  questions: QuizQuestion[];
  accent?: string;
  resultIntro?: string;
}) {
  const [mode, setMode] = useState<QuizMode>('Kolay');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>(() => createSession(title, questions, 'Kolay'));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = sessionQuestions[current];
  const total = sessionQuestions.length;
  const correct = useMemo(
    () => answers.filter((value, index) => value === sessionQuestions[index]?.answer).length,
    [answers, sessionQuestions],
  );
  const score = total ? Math.round((correct / total) * 100) : 0;
  const accentClass = accent === 'amber'
    ? 'from-amber-400/20 to-orange-400/10 border-amber-300/20'
    : 'from-brand-purple/20 to-brand-blue/10 border-brand-purple/20';

  const answer = (index: number) => {
    if (selected !== null || !question) return;
    setSelected(index);
    setAnswers((previous) => [...previous, index]);
  };

  const next = () => {
    if (current + 1 < total) {
      setCurrent((value) => value + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const restart = (nextMode = mode) => {
    setMode(nextMode);
    setSessionQuestions(createSession(title, questions, nextMode));
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className={`card p-4 sm:p-5 mb-4 bg-gradient-to-br ${accentClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-brand-white/45 mb-1">SIKILDIM! · TEST MERKEZİ</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{title}</h2>
            <p className="text-sm text-brand-white/55 mt-1">Soruların açıklamasını okuyabilir, kendi hızında ilerleyebilirsin.</p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-ink-deep/80 border border-ink-border self-start sm:self-auto">
            {(['Kolay', 'Karışık'] as const).map((option) => (
              <button
                key={option}
                onClick={() => restart(option)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${mode === option ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20' : 'text-brand-white/55 hover:text-white'}`}
              >
                {option === 'Kolay' ? 'Kolay mod' : 'Karışık mod'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!showResult && question ? (
        <div className="card p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="chip bg-ink-deep border border-ink-border text-brand-white/70">Soru {current + 1} / {total}</span>
            <span className="chip bg-brand-purple/10 border border-brand-purple/25 text-brand-purple">{question.topic ?? 'Genel'}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-ink-deep mb-7 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue transition-all duration-500" style={{ width: `${((current + (selected !== null ? 1 : 0)) / total) * 100}%` }} />
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed mb-6">{question.question}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.answer;
              const isSelected = selected === index;
              const answered = selected !== null;
              let stateClass = 'bg-ink-deep border-ink-border text-white hover:border-brand-purple/50 hover:bg-ink-hover';
              if (answered && isCorrect) stateClass = 'bg-emerald-500/10 border-emerald-400/50 text-emerald-100';
              else if (answered && isSelected) stateClass = 'bg-rose-500/10 border-rose-400/50 text-rose-100';
              else if (answered) stateClass = 'bg-ink-deep/60 border-ink-border/60 text-brand-white/35';
              return (
                <button
                  key={`${question.id}-${index}`}
                  onClick={() => answer(index)}
                  disabled={answered}
                  className={`min-h-14 text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${stateClass}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-black/15 flex items-center justify-center text-xs font-black shrink-0">{String.fromCharCode(65 + index)}</span>
                  <span className="font-semibold text-sm sm:text-base flex-1">{option}</span>
                  {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5 rounded-2xl border border-ink-border bg-ink-deep/80 p-4 sm:p-5 animate-fade-in-fast">
              <div className="flex items-center gap-2 mb-2">
                {selected === question.answer ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <Lightbulb className="w-5 h-5 text-amber-300" />}
                <p className={`font-bold text-sm ${selected === question.answer ? 'text-emerald-300' : 'text-amber-200'}`}>
                  {selected === question.answer ? 'Harika, doğru cevap!' : `Doğru cevap: ${question.options[question.answer]}`}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-brand-white/60">{question.explanation ?? 'Bir sonraki soruda tekrar deneyebilirsin. Her soruyla yeni bir şey öğrenebilirsin.'}</p>
              <button onClick={next} className="btn-primary w-full sm:w-auto mt-4 text-sm">
                {current + 1 === total ? 'Sonucu gör' : 'Sonraki soru'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : showResult ? (
        <div className="card p-6 sm:p-9 text-center bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-300/20 flex items-center justify-center mx-auto mb-4"><Trophy className="w-8 h-8 text-amber-300" /></div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Test tamamlandı!</h2>
          <p className="text-brand-white/60 mt-2 max-w-md mx-auto">{resultIntro}</p>
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto my-7">
            <div className="rounded-xl bg-ink-deep p-3"><p className="text-2xl sm:text-3xl font-black text-gradient">{score}</p><p className="text-[11px] text-brand-white/45 mt-1">Puan</p></div>
            <div className="rounded-xl bg-ink-deep p-3"><p className="text-2xl sm:text-3xl font-black text-emerald-300">{correct}</p><p className="text-[11px] text-brand-white/45 mt-1">Doğru</p></div>
            <div className="rounded-xl bg-ink-deep p-3"><p className="text-2xl sm:text-3xl font-black text-rose-300">{total - correct}</p><p className="text-[11px] text-brand-white/45 mt-1">Yanlış</p></div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button onClick={() => restart()} className="btn-primary"><RotateCcw className="w-4 h-4" /> Yeni sorularla çöz</button>
            <Link to="/testler" className="btn-ghost"><ArrowRight className="w-4 h-4" /> Diğer testler</Link>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center text-brand-white/60">Soru havuzu yüklenemedi. Sayfayı yenileyip tekrar dene.</div>
      )}

      {!showResult && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-white/40">
          <span>{mode === 'Kolay' ? 'Temel seviyede, anlaşılır sorular' : 'Kolay ve orta seviyeden karışık sorular'}</span>
          <span>{questions.length} soruluk havuz</span>
        </div>
      )}
    </div>
  );
}

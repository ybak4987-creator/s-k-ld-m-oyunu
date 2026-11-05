import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, RefreshCw, Trophy, XCircle } from 'lucide-react';
import { findAIGame } from '@/data/aiGames';
import { normalizeTurkish, shuffleArray } from '@/data/gameUtils';

function scramble(value: string) {
  const chars = [...value];
  if (chars.length < 2) return value;
  let mixed = shuffleArray(chars).join('');
  if (mixed === value) mixed = [...chars.slice(1), chars[0]].join('');
  return mixed;
}

export function GeneratedGamePage() {
  const { id = '' } = useParams();
  const game = findAIGame(id);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [shuffled, setShuffled] = useState(() => game?.mode === 'word-scramble' && game.questions[0] ? scramble(game.questions[0].answer) : '');
  if (!game) return <div className="arcade-panel mx-auto max-w-2xl p-8 text-center"><h1 className="text-xl font-black text-white">Bu oyun bulunamadı</h1><p className="mt-2 text-sm text-brand-white/55">Oyun bu cihazda kayıtlı olmayabilir.</p><Link className="btn-primary mt-5" to="/yapay-zeka">Oyun atölyesine dön</Link></div>;
  const restart = () => { setIndex(0); setSelected(''); setTextAnswer(''); setChecked(false); setCorrect(0); setHintOpen(false); setShuffled(game.mode === 'word-scramble' ? scramble(game.questions[0].answer) : ''); };
  if (index >= game.questions.length) return <div className="arcade-panel mx-auto max-w-2xl p-6 text-center sm:p-10"><div className="arcade-icon mx-auto"><Trophy className="h-7 w-7"/></div><p className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-purple">OYUN TAMAMLANDI</p><h1 className="mt-2 text-3xl font-black text-white">{game.title}</h1><p className="mt-3 text-lg text-brand-white/65">{game.questions.length} soruda <b className="text-brand-purple">{correct}</b> doğru cevap</p><p className="mt-2 text-sm text-brand-white/45">Her oyun yeni bir şey öğrenmek için fırsat.</p><div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row"><button onClick={restart} className="btn-primary"><RefreshCw className="h-4 w-4"/> Yeniden oyna</button><Link to="/yapay-zeka" className="btn-ghost">Yeni oyun oluştur</Link><Link to="/oyunlar" className="btn-ghost">Oyun merkezine dön</Link></div></div>;
  const question = game.questions[index];
  const isLast = index === game.questions.length - 1;
  const isTyped = game.mode === 'riddle' || game.mode === 'word-scramble';
  const answeredCorrect = game.mode === 'quiz' || game.mode === 'true-false'
    ? normalizeTurkish(selected) === normalizeTurkish(question.answer)
    : normalizeTurkish(textAnswer) === normalizeTurkish(question.answer);
  const submit = () => { if (checked) return; if (!selected && !textAnswer.trim()) return; setChecked(true); if (answeredCorrect) setCorrect((value) => value + 1); };
  const next = () => {
    if (isLast) { setIndex(game.questions.length); return; }
    const nextIndex = index + 1;
    setIndex(nextIndex); setSelected(''); setTextAnswer(''); setChecked(false); setHintOpen(false);
    setShuffled(game.mode === 'word-scramble' ? scramble(game.questions[nextIndex].answer) : '');
  };
  return <div className="mx-auto max-w-3xl space-y-4 animate-fade-in">
    <header className="arcade-panel flex items-center justify-between gap-3 p-4 sm:p-5"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">YAPAY ZEKÂ OYUNU · {game.difficulty.toLocaleUpperCase('tr-TR')}</p><h1 className="truncate text-lg font-black text-white sm:text-2xl">{game.title}</h1><p className="text-xs text-brand-white/45">{game.topic}</p></div><Link to="/yapay-zeka" className="btn-ghost shrink-0 px-3 py-2 text-xs"><ArrowLeft className="h-4 w-4"/> Atölye</Link></header>
    <div className="arcade-panel p-4 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3"><span className="text-xs font-bold text-brand-white/55">Tur {index + 1} / {game.questions.length}</span><span className="arcade-stat">Doğru <b>{correct}</b></span></div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-purple transition-all" style={{ width: `${((index + 1) / game.questions.length) * 100}%` }}/></div>
      <h2 className="text-xl font-black leading-snug text-white sm:text-2xl">{question.question}</h2>
      {game.mode === 'word-scramble' && <div className="mt-5 flex flex-wrap justify-center gap-2">{[...shuffled].map((letter, letterIndex) => <span key={`${letter}-${letterIndex}`} className="flex h-11 min-w-10 items-center justify-center rounded-xl border border-brand-purple/25 bg-brand-purple/10 px-2 text-xl font-black text-brand-purple">{letter}</span>)}</div>}
      {question.hint && <div className="mt-4"><button onClick={() => setHintOpen((value) => !value)} className="arcade-chip"><Lightbulb className="h-3.5 w-3.5"/>{hintOpen ? 'İpucunu gizle' : 'İpucu göster'}</button>{hintOpen && <p className="mt-2 rounded-lg bg-white/5 p-3 text-sm text-brand-white/65">{question.hint}</p>}</div>}
      {isTyped ? <input value={textAnswer} onChange={(event) => setTextAnswer(event.target.value)} disabled={checked} onKeyDown={(event) => { if (event.key === 'Enter') checked ? next() : submit(); }} className="input mt-6" placeholder="Cevabını yaz…"/> : <div className="mt-6 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => setSelected(option)} disabled={checked} className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${selected === option ? 'border-brand-purple/60 bg-brand-purple/10 text-white' : 'border-ink-border bg-ink-deep text-brand-white/75 hover:border-white/20'} ${checked && normalizeTurkish(option) === normalizeTurkish(question.answer) ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' : ''}`}>{option}</button>)}</div>}
      {!checked ? <button onClick={submit} disabled={isTyped ? !textAnswer.trim() : !selected} className="btn-primary mt-5 w-full">Cevabı kontrol et</button> : <div className={`mt-5 rounded-xl border p-4 ${answeredCorrect ? 'border-brand-purple/25 bg-brand-purple/10' : 'border-amber-400/20 bg-amber-400/10'}`}><div className="flex items-center gap-2 font-bold text-white">{answeredCorrect ? <CheckCircle2 className="h-5 w-5 text-brand-purple"/> : <XCircle className="h-5 w-5 text-amber-300"/>}{answeredCorrect ? 'Doğru cevap!' : `Doğru cevap: ${question.answer}`}</div><p className="mt-2 text-sm leading-relaxed text-brand-white/65">{question.explanation}</p><button onClick={next} className="btn-primary mt-4 w-full">{isLast ? 'Sonucu gör' : 'Sonraki tur'} <ArrowRight className="h-4 w-4"/></button></div>}
    </div>
  </div>;
}

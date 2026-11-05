import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hash, RefreshCw, Trophy } from 'lucide-react';
import { getBestScore, saveBestScore } from '@/data/gameUtils';

function createTarget(max: number, previous?: number) {
  let next = Math.floor(Math.random() * max) + 1;
  while (next === previous) next = Math.floor(Math.random() * max) + 1;
  return next;
}

export function NumberGuessGame() {
  const [range, setRange] = useState(50);
  const target = useRef(createTarget(50));
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [error, setError] = useState('');
  const [best, setBest] = useState(() => getBestScore('number-guess', true));

  const submit = () => {
    const number = Number.parseInt(guess, 10);
    if (!Number.isFinite(number) || number < 1 || number > range) {
      setError(`1 ile ${range} arasında bir sayı gir.`);
      return;
    }
    setError('');
    setAttempts((previous) => [number, ...previous]);
    if (number === target.current) {
      setStatus('won');
      setBest(saveBestScore('number-guess', attempts.length + 1, true));
    }
    setGuess('');
  };

  const reset = (nextRange = range) => {
    target.current = createTarget(nextRange, target.current);
    setRange(nextRange);
    setAttempts([]);
    setStatus('playing');
    setGuess('');
    setError('');
  };

  const last = attempts[0];
  const hint = status === 'won' || last === undefined ? null : last < target.current ? 'Daha büyük bir sayı dene.' : 'Daha küçük bir sayı dene.';

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <div className="rounded-2xl border border-ink-border bg-[#101925] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white"><Hash className="w-6 h-6" /></div><div><p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-white/45">SIKILDIM! · TAHMİN</p><h1 className="text-xl sm:text-2xl font-extrabold text-white">Sayı Tutma</h1><p className="text-xs sm:text-sm text-brand-white/55">İpuçlarını takip et, gizli sayıyı bul.</p></div></div>
          <Link to="/oyunlar" className="btn-ghost px-3 py-2 text-xs shrink-0"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Oyunlar</span></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 sm:p-4"><p className="text-[11px] text-brand-white/45">Deneme sayısı</p><p className="text-2xl font-black text-white mt-1">{attempts.length}</p></div>
        <div className="card p-3 sm:p-4"><p className="text-[11px] text-brand-white/45">En iyi sonuç</p><p className="text-2xl font-black text-amber-300 mt-1">{best ?? '—'} <span className="text-xs font-semibold text-brand-white/40">deneme</span></p></div>
      </div>

      {status === 'won' ? (
        <div className="card p-7 sm:p-9 text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <Trophy className="w-11 h-11 text-amber-300 mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-white">Tebrikler, buldun!</h2>
          <p className="text-brand-white/60 mt-2"><span className="text-brand-purple font-bold">{target.current}</span> sayısını <span className="text-brand-purple font-bold">{attempts.length}</span> denemede buldun.</p>
          <button onClick={() => reset()} className="btn-primary mt-5"><RefreshCw className="w-4 h-4" /> Yeni sayı tut</button>
        </div>
      ) : (
        <div className="card p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h2 className="font-bold text-white">Aralık seç</h2><p className="text-xs text-brand-white/45 mt-1">Kolay başlamak için 1–50 önerilir.</p></div><div className="flex gap-2">{[50, 100].map((value) => <button key={value} onClick={() => reset(value)} className={`px-3 py-2 rounded-xl border text-xs font-bold ${range === value ? 'bg-brand-purple/20 border-brand-purple/50 text-white' : 'bg-ink-deep border-ink-border text-brand-white/55'}`}>1–{value}</button>)}</div></div>
          <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex flex-col sm:flex-row gap-2">
            <input type="number" min={1} max={range} value={guess} onChange={(event) => setGuess(event.target.value)} placeholder={`1–${range} arasında tahmin`} className="input flex-1 text-center text-lg" autoFocus />
            <button type="submit" disabled={!guess.trim()} className="btn-primary px-7">Tahmin et</button>
          </form>
          {error && <p className="text-rose-300 text-xs mt-2">{error}</p>}
          {hint && <div className="mt-4 rounded-xl border border-brand-purple/20 bg-brand-purple/10 p-4 text-center text-sm font-semibold text-violet-100">{hint}</div>}
          {attempts.length > 0 && <div className="mt-5"><p className="text-xs text-brand-white/40 mb-2">Önceki tahminlerin</p><div className="flex flex-wrap gap-2">{attempts.map((attempt, index) => <span key={`${attempt}-${index}`} className="chip bg-ink-deep border border-ink-border text-brand-white/65">{attempt}</span>)}</div></div>}
          <button onClick={() => reset()} className="btn-ghost w-full mt-5 text-sm"><RefreshCw className="w-4 h-4" /> Yeni sayı oluştur</button>
        </div>
      )}
    </div>
  );
}

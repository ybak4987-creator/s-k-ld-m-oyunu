import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock3, RefreshCw, Zap } from 'lucide-react';
import { getBestScore, saveBestScore } from '@/data/gameUtils';

type State = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

export function ReactionGame() {
  const [state, setState] = useState<State>('idle');
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(() => getBestScore('reaction', true));
  const startTime = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  const start = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setState('waiting');
    setMs(0);
    const delay = 1200 + Math.random() * 3000;
    timeout.current = setTimeout(() => {
      setState('ready');
      startTime.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'result' || state === 'early') { start(); return; }
    if (state === 'waiting') {
      if (timeout.current) clearTimeout(timeout.current);
      setState('early');
      return;
    }
    if (state === 'ready') {
      const elapsed = Math.round(performance.now() - startTime.current);
      setMs(elapsed);
      setState('result');
      setBest(saveBestScore('reaction', elapsed, true));
    }
  };

  const reset = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    setState('idle');
    setMs(0);
  };

  const stateContent = state === 'idle'
    ? { title: 'Hazır mısın?', subtitle: 'Başlamak için dokun' }
    : state === 'waiting'
      ? { title: 'Bekle...', subtitle: 'Ekran yeşile dönmeden dokunma' }
      : state === 'ready'
        ? { title: 'ŞİMDİ!', subtitle: 'Hemen dokun!' }
        : state === 'early'
          ? { title: 'Biraz erken!', subtitle: 'Yeşil rengi bekle ve yeniden dene' }
          : { title: `${ms} ms`, subtitle: best !== null ? `En iyi süren ${best} ms` : 'Bir tur daha deneyebilirsin' };

  const buttonStyle = state === 'waiting'
    ? 'from-rose-500/35 to-red-500/15 border-rose-400/40'
    : state === 'ready'
      ? 'from-emerald-400/35 to-teal-500/15 border-emerald-300/50 shadow-lg shadow-emerald-500/10'
      : state === 'early'
        ? 'from-amber-500/30 to-orange-500/10 border-amber-400/40'
        : 'from-brand-purple/20 to-brand-blue/10 border-ink-border hover:border-brand-purple/50';

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <div className="rounded-2xl border border-ink-border bg-[#101925] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="arcade-icon"><Zap className="w-6 h-6" /></div><div><p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-white/45">SIKILDIM! · REFLEKS</p><h1 className="text-xl sm:text-2xl font-extrabold text-white">Tepki Hızı</h1><p className="text-xs sm:text-sm text-brand-white/55">Yeşili görünce mümkün olduğunca hızlı dokun.</p></div></div>
          <Link to="/oyunlar" className="btn-ghost px-3 py-2 text-xs shrink-0"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Oyunlar</span></Link>
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4"><span className="text-sm font-bold text-white">Tek dokunuş testi</span><span className="chip bg-ink-deep border border-ink-border text-brand-white/65"><Clock3 className="w-3.5 h-3.5 text-brand-purple" /> Rekor: {best !== null ? `${best} ms` : '—'}</span></div>
        <button onClick={handleClick} className={`w-full min-h-72 sm:min-h-80 rounded-3xl border-2 bg-gradient-to-br flex flex-col items-center justify-center gap-3 text-center p-6 transition-all duration-200 active:scale-[0.995] ${buttonStyle}`}>
          <span className="text-4xl sm:text-5xl font-black text-white">{stateContent.title}</span>
          <span className="text-sm sm:text-base text-brand-white/70">{stateContent.subtitle}</span>
          {state === 'idle' && <span className="mt-2 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-xs text-brand-white/55">Başlamak için tıkla</span>}
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4"><p className="text-xs text-brand-white/40">İpucu: Bekleme süresi her turda rastgele değişir.</p><button onClick={reset} className="btn-ghost text-sm"><RefreshCw className="w-4 h-4" /> Sıfırla</button></div>
      </div>
    </div>
  );
}

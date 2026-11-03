import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, RefreshCw, Trophy } from 'lucide-react';
import { getBestScore, pickFresh, saveBestScore, shuffleArray } from '@/data/gameUtils';

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };
const emojiPool = ['🎮', '🚀', '🎯', '🎲', '🎨', '⚡', '🔥', '💡', '🌙', '⭐', '🍀', '🍉', '🦊', '🐼', '🐸', '🦁', '🎧', '📚', '⚽', '🏀', '🌈', '☀️', '🧩', '🚲', '🛸', '🍕', '🍩', '🌻', '🐙', '🦋'];

function shuffle(): Card[] {
  const selected = pickFresh(emojiPool, (emoji) => emoji, 'memory-emoji-set', 8);
  const pairs = [...selected, ...selected].map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
  return shuffleArray(pairs).map((card, index) => ({ ...card, id: index }));
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(shuffle);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => getBestScore('memory', true));
  const mismatchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (mismatchTimer.current) clearTimeout(mismatchTimer.current); }, []);

  useEffect(() => {
    if (selected.length !== 2) return;
    setLocked(true);
    const [first, second] = selected;
    setMoves((count) => count + 1);
    if (cards[first].emoji === cards[second].emoji) {
      setCards((previous) => previous.map((card, index) => (index === first || index === second ? { ...card, matched: true } : card)));
      setSelected([]);
      setLocked(false);
    } else {
      mismatchTimer.current = setTimeout(() => {
        setCards((previous) => previous.map((card, index) => (index === first || index === second ? { ...card, flipped: false } : card)));
        setSelected([]);
        setLocked(false);
        mismatchTimer.current = null;
      }, 750);
    }
  }, [selected, cards]);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) setWon(true);
  }, [cards]);

  useEffect(() => {
    if (won) setBest(saveBestScore('memory', moves, true));
  }, [won, moves]);

  const handleClick = (index: number) => {
    if (locked || cards[index].flipped || cards[index].matched || selected.length >= 2) return;
    setCards((previous) => previous.map((card, cardIndex) => (cardIndex === index ? { ...card, flipped: true } : card)));
    setSelected((previous) => [...previous, index]);
  };

  const reset = () => {
    if (mismatchTimer.current) clearTimeout(mismatchTimer.current);
    mismatchTimer.current = null;
    setCards(shuffle());
    setSelected([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <div className="rounded-2xl border border-ink-border bg-gradient-to-br from-[#25183d] via-[#171c31] to-[#11293a] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white"><Brain className="w-6 h-6" /></div>
            <div><p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-white/45">SIKILDIM! · HAFIZA</p><h1 className="text-xl sm:text-2xl font-extrabold text-white">Hafıza Kartları</h1><p className="text-xs sm:text-sm text-brand-white/55">Aynı simgeleri eşleştir, en az hamlede bitir.</p></div>
          </div>
          <Link to="/oyunlar" className="btn-ghost px-3 py-2 text-xs shrink-0"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Oyunlar</span></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="card p-3 sm:p-4"><p className="text-[11px] text-brand-white/45">Hamle</p><p className="text-2xl font-black text-white mt-1">{moves}</p></div>
        <div className="card p-3 sm:p-4"><p className="text-[11px] text-brand-white/45">Bulunan çift</p><p className="text-2xl font-black text-emerald-300 mt-1">{cards.filter((card) => card.matched).length / 2} / 8</p></div>
        <div className="card p-3 sm:p-4 col-span-2 sm:col-span-1"><p className="text-[11px] text-brand-white/45">En iyi sonuç</p><p className="text-2xl font-black text-amber-300 mt-1">{best ?? '—'} <span className="text-xs font-semibold text-brand-white/40">hamle</span></p></div>
      </div>

      {won && (
        <div className="card p-5 text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <Trophy className="w-9 h-9 text-amber-300 mx-auto mb-2" />
          <h2 className="text-xl font-extrabold text-white">Tebrikler, tamamladın!</h2>
          <p className="text-sm text-brand-white/60 mt-1">8 çiftin hepsini {moves} hamlede buldun.</p>
          <button onClick={reset} className="btn-primary mt-4 text-sm"><RefreshCw className="w-4 h-4" /> Yeni kartlarla oyna</button>
        </div>
      )}

      <div className="card p-3 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4 px-1"><p className="text-sm font-bold text-white">Kartları eşleştir</p><span className="text-[11px] text-brand-white/40">Yeni oyunda simgeler değişir</span></div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card, index) => (
            <button key={card.id} onClick={() => handleClick(index)} disabled={locked || card.matched || card.flipped} className={`aspect-square rounded-2xl border flex items-center justify-center text-2xl sm:text-4xl transition-all duration-200 ${card.flipped || card.matched ? 'bg-gradient-to-br from-brand-purple/25 to-brand-blue/20 border-brand-purple/40 scale-[0.98]' : 'bg-ink-deep border-ink-border hover:border-brand-purple/45 hover:-translate-y-0.5'}`} aria-label={`Kart ${index + 1}`}>
              {(card.flipped || card.matched) ? <span className={card.matched ? 'opacity-50' : ''}>{card.emoji}</span> : <span className="text-brand-white/30 text-xl sm:text-2xl">?</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-brand-white/40">İpucu: Açtığın kartların yerini aklında tut.</p><button onClick={reset} className="btn-ghost text-sm"><RefreshCw className="w-4 h-4" /> Yeniden başlat</button></div>
    </div>
  );
}

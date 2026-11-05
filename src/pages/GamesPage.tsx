import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Bot, Gamepad2, Search, Shuffle, Sparkles, X } from 'lucide-react';
import { games } from '@/data/content';
import { shuffleArray, pickFreshDiverse } from '@/data/gameUtils';

const filters = [
  { label: 'Tümü', ids: games.map((game) => game.id) },
  { label: 'Kelime', ids: ['word-scramble', 'word-guess', 'word-chain', 'word-search'] },
  { label: 'Mantık', ids: ['numberguess', 'sequence', 'math-sprint', 'code-breaker', 'arcade-2048', 'mini-sudoku', 'number-sort', 'minefield', 'sliding-puzzle', 'nonogram', 'target-ten'] },
  { label: 'Hafıza', ids: ['memory', 'pattern-memory', 'simon-sequence'] },
  { label: 'Strateji', ids: ['xox', 'mini-maze', 'rock-paper-scissors', 'connect-four', 'dots-boxes', 'lights-out'] },
  { label: 'Dikkat ve refleks', ids: ['reaction', 'odd-one-out', 'color-attention', 'true-false', 'target-tap', 'quick-count', 'number-tap'] },
];

function categoryFor(id: string) {
  if (['word-scramble', 'word-guess', 'word-chain', 'word-search'].includes(id)) return 'Kelime';
  if (['numberguess', 'sequence', 'math-sprint', 'code-breaker', 'arcade-2048', 'mini-sudoku', 'number-sort', 'minefield', 'sliding-puzzle', 'nonogram', 'target-ten'].includes(id)) return 'Mantık';
  if (['memory', 'pattern-memory', 'simon-sequence'].includes(id)) return 'Hafıza';
  if (['xox', 'mini-maze', 'rock-paper-scissors', 'connect-four', 'dots-boxes', 'lights-out'].includes(id)) return 'Strateji';
  if (id === 'number-tap') return 'Dikkat ve refleks';
  return 'Dikkat ve refleks';
}

export function GamesPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [gameOrder] = useState(() => shuffleArray(games));
  const navigate = useNavigate();
  const filteredGames = useMemo(() => {
    const allowed = filters.find((filter) => filter.label === activeFilter)?.ids ?? filters[0].ids;
    const term = search.trim().toLocaleLowerCase('tr-TR');
    return gameOrder.filter((game) => allowed.includes(game.id) && (!term || `${game.title} ${game.description} ${categoryFor(game.id)}`.toLocaleLowerCase('tr-TR').includes(term)));
  }, [activeFilter, search, gameOrder]);
  const randomGame = () => {
    const pool = filteredGames.length ? filteredGames : gameOrder;
    const selected = pickFreshDiverse(pool, (game) => game.id, (game) => categoryFor(game.id), 'random-game-choice', 1)[0] ?? pool[0];
    if (selected) navigate(selected.route);
  };

  return (
    <div className="space-y-6 animate-fade-in sm:space-y-8">
      <section className="arcade-hero p-5 sm:p-8 lg:p-9">
        <div className="relative z-10 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-3 py-1.5 text-[11px] font-black tracking-wider text-brand-purple"><Gamepad2 className="h-4 w-4"/> SIKILDIM! ARCADE</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">Oyunu seç. <span className="text-brand-purple">Modunu değiştir.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-white/60 sm:text-base">Kelime, hafıza, dikkat, strateji ve sayı oyunları. Her tur yeni bir deneme.</p>
            <div className="mt-6 flex flex-wrap gap-2"><button onClick={randomGame} className="btn-primary"><Shuffle className="h-4 w-4"/> Rastgele oyun seç</button><Link to="/yapay-zeka" className="btn-ghost"><Sparkles className="h-4 w-4"/> Kendi oyununu oluştur</Link></div>
          </div>
          <div className="grid min-w-[220px] grid-cols-2 gap-2">
            <div className="arcade-stat-card"><p className="text-3xl font-black text-white">{games.length}</p><p className="mt-1 text-[11px] text-brand-white/45">Oynanabilir oyun</p></div>
            <div className="arcade-stat-card"><p className="text-3xl font-black text-brand-purple">6</p><p className="mt-1 text-[11px] text-brand-white/45">Oyun kategorisi</p></div>
          </div>
        </div>
      </section>

      <section className="arcade-panel p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-white/35"/><input value={search} onChange={(event) => setSearch(event.target.value)} className="input pl-10 pr-10" placeholder="Oyun ara: kelime, hafıza, sayı…"/>{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-white/40 hover:text-white" aria-label="Aramayı temizle"><X className="h-4 w-4"/></button>}</div>
          <button onClick={randomGame} className="btn-ghost whitespace-nowrap"><Shuffle className="h-4 w-4"/> Rastgele</button>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter.label} onClick={() => setActiveFilter(filter.label)} className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-bold transition ${activeFilter === filter.label ? 'border-brand-purple bg-brand-purple text-[#10160B]' : 'border-ink-border bg-ink-deep text-brand-white/55 hover:border-white/20 hover:text-white'}`}>{filter.label}</button>)}</div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-brand-purple">ARCADE KÜTÜPHANESİ</p><h2 className="mt-1 text-xl font-black text-white sm:text-2xl">{activeFilter === 'Tümü' ? 'Bütün oyunlar' : activeFilter}</h2></div><span className="rounded-lg border border-ink-border bg-ink-card px-3 py-1.5 text-xs text-brand-white/55">{filteredGames.length} oyun</span></div>
        {filteredGames.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filteredGames.map((game, index) => {
          const Icon = (Lucide[game.icon as keyof typeof Lucide] as LucideIcon) ?? Lucide.Gamepad2;
          return <button key={game.id} onClick={() => navigate(game.route)} className="arcade-game-card group p-4 text-left sm:p-5" style={{ animationDelay: `${index * 24}ms` }}>
            <div className="flex items-start justify-between gap-3"><div className="arcade-icon"><Icon className="h-6 w-6"/></div>{game.badge && <span className="rounded-md border border-brand-purple/20 bg-brand-purple/10 px-2 py-1 text-[10px] font-black text-brand-purple">{game.badge}</span>}</div>
            <div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-widest text-brand-white/35">{categoryFor(game.id)}</p><h3 className="mt-1 text-lg font-black text-white transition group-hover:text-brand-purple">{game.title}</h3><p className="mt-1.5 min-h-10 text-sm leading-relaxed text-brand-white/50">{game.description}</p></div>
            <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3"><span className="text-xs font-bold text-brand-purple">Oynamaya başla</span><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-border bg-ink-deep text-brand-white/50 transition group-hover:border-brand-purple/40 group-hover:bg-brand-purple group-hover:text-[#0B1118]"><ArrowUpRight className="h-4 w-4"/></span></div>
          </button>;
        })}</div> : <div className="arcade-panel p-10 text-center"><Search className="mx-auto h-7 w-7 text-brand-white/35"/><p className="mt-3 font-bold text-white">Bu aramayla eşleşen oyun yok.</p><button onClick={() => { setSearch(''); setActiveFilter('Tümü'); }} className="btn-ghost mt-4 text-sm">Filtreleri temizle</button></div>}
      </section>

      <Link to="/yapay-zeka" className="arcade-ai-banner group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><div className="arcade-icon"><Bot className="h-6 w-6"/></div><div><p className="text-[10px] font-black uppercase tracking-widest text-brand-purple">OYUN ATÖLYESİ</p><h2 className="mt-1 text-lg font-black text-white">Aklındaki konudan oyun üret</h2><p className="mt-1 text-sm text-brand-white/50">Konu ve oyun türünü seç, sana özel bir mini oyun hazırla.</p></div></div><span className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple">Atölyeyi aç <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span></Link>
    </div>
  );
}

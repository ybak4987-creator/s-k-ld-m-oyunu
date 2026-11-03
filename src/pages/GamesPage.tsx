import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Gamepad2, Search, Shuffle, Sparkles, ArrowUpRight, X } from 'lucide-react';
import { games } from '@/data/content';
import { shuffleArray, pickFreshDiverse } from '@/data/gameUtils';

const filters = [
  { label: 'Tümü', ids: games.map((game) => game.id) },
  { label: 'Kelime', ids: ['word-scramble', 'word-guess', 'word-chain'] },
  { label: 'Mantık', ids: ['numberguess', 'sequence', 'math-sprint', 'code-breaker'] },
  { label: 'Hafıza', ids: ['memory', 'pattern-memory'] },
  { label: 'Dikkat ve refleks', ids: ['reaction', 'odd-one-out', 'color-attention', 'true-false'] },
];

const accentStyles: Record<string, string> = {
  violet: 'from-violet-500/20 to-purple-500/5 text-violet-200 border-violet-400/25',
  blue: 'from-blue-500/20 to-cyan-500/5 text-blue-200 border-blue-400/25',
  amber: 'from-amber-500/20 to-orange-500/5 text-amber-100 border-amber-400/25',
  pink: 'from-pink-500/20 to-rose-500/5 text-pink-100 border-pink-400/25',
  emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-100 border-emerald-400/25',
};

function categoryFor(id: string) {
  if (['word-scramble', 'word-guess', 'word-chain'].includes(id)) return 'Kelime';
  if (['numberguess', 'sequence', 'math-sprint', 'code-breaker'].includes(id)) return 'Mantık';
  if (['memory', 'pattern-memory'].includes(id)) return 'Hafıza';
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
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-ink-border bg-gradient-to-br from-[#21183d] via-[#151b31] to-[#10283b] p-5 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto] items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[11px] font-bold tracking-wider text-brand-white/70 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" /> SIKILDIM! OYUN MERKEZİ
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">Oyun seç, <span className="text-gradient">sıkılmaya ara ver.</span></h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-brand-white/65">Kelime, hafıza, dikkat ve mantık oyunları. Her oyunda yeni bir tur, yeni bir meydan okuma var.</p>
            <button onClick={randomGame} className="btn-primary mt-6"><Shuffle className="w-4 h-4" /> Bana rastgele oyun seç</button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[280px]">
            {[
              { value: String(games.length), label: 'Oyun' },
              { value: '4', label: 'Kategori' },
              { value: '∞', label: 'Yeni tur' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-4 text-center backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] text-brand-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input pl-10 pr-10" placeholder="Oyun ara: kelime, hafıza, sayı..." />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-white/40 hover:text-white" aria-label="Aramayı temizle"><X className="w-4 h-4" /></button>}
          </div>
          <button onClick={randomGame} className="btn-ghost whitespace-nowrap"><Shuffle className="w-4 h-4" /> Rastgele oyun</button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button key={filter.label} onClick={() => setActiveFilter(filter.label)} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${activeFilter === filter.label ? 'bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20' : 'bg-ink-deep border-ink-border text-brand-white/55 hover:text-white hover:border-brand-purple/30'}`}>
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div><p className="text-[11px] uppercase tracking-[0.16em] font-bold text-brand-purple mb-1">KEŞFET VE OYNA</p><h2 className="text-xl sm:text-2xl font-extrabold text-white">{activeFilter === 'Tümü' ? 'Bütün oyunlar' : activeFilter}</h2></div>
          <span className="rounded-full border border-ink-border bg-ink-card px-3 py-1.5 text-xs text-brand-white/55">{filteredGames.length} oyun</span>
        </div>
        {filteredGames.length ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filteredGames.map((game, index) => {
              const Icon = (Lucide[game.icon as keyof typeof Lucide] as LucideIcon) ?? Lucide.Gamepad2;
              const style = accentStyles[game.accent] ?? accentStyles.violet;
              return (
                <button key={game.id} onClick={() => navigate(game.route)} className="group relative overflow-hidden rounded-2xl border border-ink-border bg-ink-card p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 animate-scale-in" style={{ animationDelay: `${index * 35}ms` }}>
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-purple/5 blur-2xl transition-colors group-hover:bg-brand-purple/15" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl border bg-gradient-to-br flex items-center justify-center ${style}`}><Icon className="w-6 h-6" /></div>
                    {game.badge && <span className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2.5 py-1 text-[10px] font-bold text-violet-200">{game.badge}</span>}
                  </div>
                  <div className="relative mt-5">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-brand-white/35 mb-1.5">{categoryFor(game.id)}</div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-violet-100 transition-colors">{game.title}</h3>
                    <p className="min-h-10 text-sm leading-relaxed text-brand-white/50 mt-1.5">{game.description}</p>
                  </div>
                  <div className="relative flex items-center justify-between border-t border-white/5 mt-5 pt-3">
                    <span className="text-xs font-bold text-brand-purple">Oynamaya başla</span>
                    <span className="w-8 h-8 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-white/50 group-hover:bg-brand-purple group-hover:border-brand-purple group-hover:text-white transition-colors"><ArrowUpRight className="w-4 h-4" /></span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="card p-9 sm:p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-white/35 mb-4"><Search className="w-6 h-6" /></div>
            <p className="font-bold text-white">Bu aramayla eşleşen oyun yok.</p>
            <p className="text-sm text-brand-white/45 mt-1">Arama kelimesini değiştirmeyi deneyebilirsin.</p>
            <button onClick={() => { setSearch(''); setActiveFilter('Tümü'); }} className="btn-ghost mt-4 text-sm">Filtreleri temizle</button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-brand-purple/15 bg-gradient-to-r from-brand-purple/10 via-ink-card to-brand-blue/10 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center text-violet-200 shrink-0"><Sparkles className="w-5 h-5" /></div>
          <div><h2 className="font-bold text-white">Her tur biraz farklı</h2><p className="text-sm leading-relaxed text-brand-white/55 mt-1">Sorular, kelimeler ve oyun düzenleri karıştırılır. Aynı içeriklerin peş peşe gelmesini azaltmak için son oynadıkların cihazında hatırlanır.</p></div>
        </div>
      </section>
    </div>
  );
}

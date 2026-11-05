import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dices, Sparkles, Gamepad2, ClipboardCheck, Target, ArrowRight, TrendingUp, Flame, Trophy, Plus } from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { ContentCard } from '@/components/ContentCard';
import { SectionTitle } from '@/components/ui/PageHeader';
import { categories } from '@/data/categories';
import { games, tests, dailyTasks } from '@/data/content';
import { pickRandomActivity } from '@/data/activities';
import { pickFresh, pickFreshDiverse } from '@/data/gameUtils';

function gameGroup(id: string) {
  if (['word-scramble', 'word-guess', 'word-chain', 'word-search'].includes(id)) return 'Kelime';
  if (['numberguess', 'sequence', 'math-sprint', 'code-breaker', 'arcade-2048', 'mini-sudoku', 'number-sort', 'minefield', 'sliding-puzzle', 'nonogram', 'target-ten'].includes(id)) return 'Mantık';
  if (['memory', 'pattern-memory', 'simon-sequence'].includes(id)) return 'Hafıza';
  if (['xox', 'mini-maze', 'rock-paper-scissors', 'connect-four', 'dots-boxes', 'lights-out'].includes(id)) return 'Strateji';
  return 'Dikkat';
}

export function HomePage() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [homeSelection] = useState(() => {
    const featuredGames = pickFreshDiverse(games, (game) => game.id, (game) => gameGroup(game.id), 'home-featured-games', 3);
    const featuredIds = new Set(featuredGames.map((game) => game.id));
    const popularGames = pickFreshDiverse(games.filter((game) => !featuredIds.has(game.id)), (game) => game.id, (game) => gameGroup(game.id), 'home-popular-games', 6);
    const featuredTests = pickFresh(tests, (test) => test.id, 'home-featured-tests', 3);
    return { featuredGames, popularGames, featuredTests };
  });

  const findRandom = () => {
    setSpinning(true);
    const a = pickRandomActivity();
    setTimeout(() => {
      setSpinning(false);
      navigate(a.route);
    }, 700);
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="arcade-hero animate-fade-in p-6 sm:p-10 lg:p-12">
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-3 py-1.5 text-[11px] font-black tracking-wider text-brand-purple">
              <Gamepad2 className="h-4 w-4" /> SIKILDIM! ARCADE
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">Canın mı <span className="text-brand-purple">sıkıldı?</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-white/60 sm:text-base">Bir oyun seç, küçük bir meydan okumaya başla veya kendi oyununu oluştur. Her girişte yeni bir şey dene.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/oyunlar" className="btn-primary"><Gamepad2 className="h-5 w-5"/> Oyunları keşfet</Link>
              <button onClick={findRandom} disabled={spinning} className="btn-ghost"><Dices className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`}/>{spinning ? 'Aranıyor…' : 'Sürpriz oyun seç'}</button>
            </div>
          </div>
          <div className="arcade-stat-card hidden space-y-4 p-5 lg:block">
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-brand-white/45">OYUN MERKEZİ</span><span className="h-2.5 w-2.5 rounded-full bg-brand-purple shadow-[0_0_12px_rgba(183,243,107,.45)]"/></div>
            <div><p className="text-4xl font-black text-white">{games.length}</p><p className="mt-1 text-sm text-brand-white/50">Farklı oyun</p></div>
            <div className="h-px bg-white/10"/>
            <div className="flex items-center gap-3"><div className="arcade-icon"><Sparkles className="h-5 w-5"/></div><div><p className="text-sm font-bold text-white">Oyun atölyesi</p><p className="text-xs text-brand-white/45">Kendi oyununu üret</p></div></div>
            <Link to="/yapay-zeka" className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple">Atölyeye git <ArrowRight className="h-4 w-4"/></Link>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section>
        <SectionTitle title="Kategoriler" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Günün İçerikleri */}
      <section>
        <SectionTitle title="Günün Seçkileri" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeSelection.featuredGames.map((g, i) => (
            <ContentCard key={g.id} title={`Günün Oyunu`} description={g.title} icon={g.icon} route={g.route} badge="Bugün" accent={g.accent} index={i} />
          ))}
          {homeSelection.featuredTests.map((t, i) => (
            <ContentCard key={t.id} title={t.title} description={t.description} icon={t.icon} route={t.route} badge={t.badge} accent={t.accent} meta={`${t.questions} soru · ${t.minutes} dk`} index={i + 3} />
          ))}
        </div>
      </section>

      {/* Günlük Görevler */}
      <section>
        <SectionTitle title="Günlük Görevler" action={{ label: 'Tümü', to: '/gorevler' }} />
        <div className="grid sm:grid-cols-2 gap-3">
          {dailyTasks.map((task, i) => (
            <div key={task.id} className="card card-hover p-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="arcade-icon h-11 w-11 rounded-xl shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{task.title}</h3>
                <p className="text-brand-white/40 text-xs truncate">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="chip bg-brand-purple/10 text-brand-purple border border-brand-purple/25">+{task.xp} XP</span>
                <Link to="/gorevler" className="w-9 h-9 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-white/50 hover:text-white hover:border-brand-purple/40 transition-colors" aria-label="Görevi aç">
                  <Plus className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popüler */}
      <section>
        <SectionTitle title="Popüler Oyunlar" action={{ label: 'Tümü', to: '/oyunlar' }} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeSelection.popularGames.map((g, i) => (
            <ContentCard key={g.id} {...g} index={i} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Popüler Testler" action={{ label: 'Tümü', to: '/testler' }} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((t, i) => (
            <ContentCard key={t.id} {...t} index={i} meta={`${t.questions} soru · ${t.minutes} dk`} />
          ))}
        </div>
      </section>

      {/* İstatistik placeholder */}
      <section className="arcade-panel p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Gamepad2, label: 'Oyunlar', value: String(games.length) },
            { icon: ClipboardCheck, label: 'Testler', value: '3' },
            { icon: Target, label: 'Görevler', value: '4' },
            { icon: TrendingUp, label: 'Kategoriler', value: '8' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label}>
                <Icon className="w-6 h-6 mx-auto text-brand-purple mb-2" />
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-brand-white/50 mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sana özel öneriler */}
      <section>
        <SectionTitle title="Sana Özel Öneriler" />
        <div className="arcade-panel p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="arcade-icon h-14 w-14 rounded-2xl">
            <Flame className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-white">Bugün ne yapacağına karar veremedin mi?</h3>
            <p className="text-brand-white/50 text-sm mt-1">Rastgele aktivite butonuna tıkla, sana bir şey bulalım.</p>
          </div>
          <button onClick={findRandom} disabled={spinning} className="btn-primary shrink-0">
            <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
            {spinning ? 'Aranıyor...' : 'Bana Bir Şey Bul'}
          </button>
        </div>
      </section>

      {/* Liderlik teaser */}
      <section>
        <SectionTitle title="Liderlik Tablosu" action={{ label: 'Görüntüle', to: '/liderlik' }} />
        <div className="arcade-panel p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h3 className="font-bold text-white">Yakında Sahnede Ol</h3>
              <p className="text-brand-white/50 text-sm">Görevleri tamamla, XP topla, sıralamada yüksel. Hesap sistemi yakında!</p>
            </div>
          </div>
          <Link to="/liderlik" className="btn-ghost text-sm shrink-0">
            <ArrowRight className="w-4 h-4" />
            İncele
          </Link>
        </div>
      </section>
    </div>
  );
}

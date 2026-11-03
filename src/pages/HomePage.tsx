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
  if (['word-scramble', 'word-guess', 'word-chain'].includes(id)) return 'Kelime';
  if (['numberguess', 'sequence', 'math-sprint', 'code-breaker'].includes(id)) return 'Mantık';
  if (['memory', 'pattern-memory'].includes(id)) return 'Hafıza';
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
      <section className="relative overflow-hidden rounded-3xl border border-ink-border animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-ink-card to-brand-blue/20" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="relative px-6 py-12 sm:px-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 chip bg-ink-deep/60 border border-ink-border mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            <span className="text-brand-white/70">Türkiye'nin Eğlence Platformu</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Canın mı <span className="text-gradient">sıkıldı?</span>
          </h1>
          <p className="mt-4 text-brand-white/60 text-base sm:text-lg max-w-xl mx-auto">
            Biraz eğlenmeye, kendini denemeye veya yeni bir şeyler keşfetmeye ne dersin?
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/kesfet" className="btn-primary w-full sm:w-auto">
              <Gamepad2 className="w-5 h-5" />
              Hemen Eğlen
            </Link>
            <button onClick={findRandom} disabled={spinning} className="btn-ghost w-full sm:w-auto">
              <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
              {spinning ? 'Aranıyor...' : 'Rastgele Bir Şey Bul'}
            </button>
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
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{task.title}</h3>
                <p className="text-brand-white/40 text-xs truncate">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="chip bg-amber-500/15 text-amber-400 border border-amber-500/30">+{task.xp} XP</span>
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
      <section className="card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5" />
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Gamepad2, label: 'Oyunlar', value: '13' },
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
        <div className="card p-6 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white shrink-0">
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
        <div className="card p-6 flex items-center justify-between">
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

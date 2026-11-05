import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Dices, Search } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui/PageHeader';
import { CategoryCard } from '@/components/CategoryCard';
import { ContentCard } from '@/components/ContentCard';
import { categories } from '@/data/categories';
import { games, tests, dailyTasks } from '@/data/content';
import { pickRandomActivity } from '@/data/activities';

export function DiscoverPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [spinning, setSpinning] = useState(false);

  const all = [
    ...games.map((g) => ({ ...g, type: 'Oyun' })),
    ...tests.map((t) => ({ ...t, type: 'Test' })),
  ];
  const filtered = query
    ? all.filter((x) => x.title.toLowerCase().includes(query.toLowerCase()) || x.description.toLowerCase().includes(query.toLowerCase()))
    : all;

  const findRandom = () => {
    setSpinning(true);
    const a = pickRandomActivity();
    setTimeout(() => {
      setSpinning(false);
      navigate(a.route);
    }, 700);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Keşfet" subtitle="Oyunlar, testler ve aktiviteler arasında gezin. Ya da rastgele bir şey bul." icon={<Compass className="w-7 h-7" />} />

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ara: oyun, test, kişilik..." className="input pl-12" />
        </div>
        <button onClick={findRandom} disabled={spinning} className="btn-primary">
          <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Aranıyor...' : 'Rastgele Bul'}
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">{query ? `Arama Sonuçları (${filtered.length})` : 'Tüm İçerikler'}</h2>
        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="w-7 h-7" />} title="Sonuç bulunamadı" description="Farklı bir arama deneyebilir ya da kategorilerden gezinebilirsin." action={{ label: 'Tüm İçerikler', to: '/kesfet' }} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <ContentCard key={item.id} title={item.title} description={item.description} icon={item.icon} route={item.route} badge={'badge' in item ? item.badge : undefined} accent={item.accent} meta={(item as { type: string }).type} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

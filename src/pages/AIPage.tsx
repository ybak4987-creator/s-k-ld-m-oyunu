import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Brain, CheckCircle2, Clock3, Gamepad2, LoaderCircle, Sparkles, Trash2, WandSparkles, Zap } from 'lucide-react';
import { deleteAIGame, loadAIGames, saveAIGame, type AIGame, type AIGameMode } from '@/data/aiGames';

const modes: Array<{ id: AIGameMode; title: string; description: string; icon: typeof Brain }> = [
  { id: 'quiz', title: 'Bilgi yarışı', description: 'Dört seçenekten doğru cevabı bul.', icon: Brain },
  { id: 'true-false', title: 'Doğru / yanlış', description: 'Bilgileri hızlıca değerlendir.', icon: CheckCircle2 },
  { id: 'riddle', title: 'Bilmece', description: 'İpuçlarından cevabı çıkar.', icon: LightbulbIcon },
  { id: 'word-scramble', title: 'Kelime bul', description: 'Karışan kelimeyi ipucuyla çöz.', icon: WandSparkles },
];
const presets = ['Hayvanlar', 'Futbol', 'Uzay', 'Doğa', 'Coğrafya', 'Bilim', 'Oyunlar', 'Müzik'];

function LightbulbIcon({ className }: { className?: string }) {
  return <Sparkles className={className}/>;
}

export function AIPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('Uzay ve gezegenler');
  const [mode, setMode] = useState<AIGameMode>('quiz');
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const [count, setCount] = useState(6);
  const [games, setGames] = useState<AIGame[]>(loadAIGames);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createGame = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTopic = topic.trim();
    if (cleanTopic.length < 2) { setError('En az iki harfli bir konu yaz.'); return; }
    setLoading(true); setError('');
    try {
      const result = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: cleanTopic, mode, difficulty, count }),
      });
      const payload = await result.json() as {
        title?: string; description?: string; topic?: string; mode?: AIGameMode;
        difficulty?: AIGame['difficulty'];
        questions?: Array<{ question: string; options: string[]; answer: string; explanation: string; hint?: string }>;
        error?: string;
      };
      if (!result.ok) throw new Error(payload.error || 'Oyun oluşturulamadı.');
      if (!payload.title || !Array.isArray(payload.questions) || payload.questions.length < 4) throw new Error('Gelen oyun verisi eksik. Yeniden deneyebilirsin.');
      const game: AIGame = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: payload.title,
        description: payload.description || `${cleanTopic} konusunda hazırlanmış kişisel oyun.`,
        topic: payload.topic || cleanTopic,
        mode,
        difficulty,
        createdAt: Date.now(),
        questions: payload.questions.map((question, index) => ({ ...question, id: `q-${index + 1}`, options: Array.isArray(question.options) ? question.options : [] })),
      };
      setGames(saveAIGame(game));
      navigate(`/oyunlar/ai/${game.id}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Beklenmeyen bir hata oluştu.';
      if (message.includes('Failed to fetch')) setError('Oyun oluşturma servisine ulaşılamadı. Vercel üzerinde OPENAI_API_KEY ayarını kontrol et. Yerelde API rotası için vercel dev kullan.');
      else setError(message);
    } finally { setLoading(false); }
  };

  const removeGame = (id: string) => setGames(deleteAIGame(id));

  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
      <section className="arcade-hero p-5 sm:p-8">
        <div className="relative z-10 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-3 py-1.5 text-[11px] font-black tracking-widest text-brand-purple"><Sparkles className="h-4 w-4"/> SIKILDIM! · OYUN ATÖLYESİ</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Kendi mini oyununu <span className="text-brand-purple">oluştur.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-white/60">Konunu seç, oyun biçimini belirle ve sana özel yeni bir mini oyun hazırla. Her oluşturduğun oyun bu cihazdaki kütüphanene eklenir.</p>
          </div>
          <div className="hidden w-52 rounded-2xl border border-brand-purple/20 bg-[#0B121C]/90 p-4 sm:block"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-black tracking-widest text-brand-white/45">OYUN ÜRETİCİ</span><Bot className="h-5 w-5 text-brand-purple"/></div><div className="space-y-2"><div className="h-2 w-4/5 rounded-full bg-brand-purple/55"/><div className="h-2 w-full rounded-full bg-white/10"/><div className="h-2 w-3/5 rounded-full bg-white/10"/></div><div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-purple/20 bg-brand-purple/10 px-3 py-2 text-xs font-bold text-brand-purple"><Sparkles className="h-4 w-4"/> Fikrini oyuna dönüştür</div></div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <form onSubmit={createGame} className="arcade-panel space-y-5 p-4 sm:p-6">
          <div className="flex items-center gap-3"><div className="arcade-icon"><WandSparkles className="h-5 w-5"/></div><div><p className="text-[10px] font-black tracking-widest text-brand-purple">4 ADIMDA</p><h2 className="text-lg font-black text-white">Oyun oluşturucu</h2><p className="text-xs text-brand-white/45">Kısa ayarları yap, oyunun hazırlansın.</p></div></div>
          <div>
            <label htmlFor="ai-topic" className="mb-2 block text-sm font-bold text-white">1. Oyun konusu</label>
            <input id="ai-topic" className="input" maxLength={70} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Örn. futbol, hayvanlar, uzay..." />
            <div className="mt-2 flex flex-wrap gap-2">{presets.map((preset) => <button key={preset} type="button" onClick={() => setTopic(preset)} className={`arcade-chip ${topic === preset ? 'border-brand-purple/50 bg-brand-purple/10 text-brand-purple' : ''}`}>{preset}</button>)}</div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-white">2. Oyun biçimi</p>
            <div className="grid gap-2 sm:grid-cols-2">{modes.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)} className={`rounded-xl border p-3 text-left transition ${mode === item.id ? 'border-brand-purple/55 bg-brand-purple/10' : 'border-ink-border bg-[#0D1520] hover:border-white/20'}`}><div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${mode === item.id ? 'text-brand-purple' : 'text-brand-white/50'}`}/><span className="text-sm font-bold text-white">{item.title}</span></div><span className="mt-1.5 block text-xs leading-relaxed text-brand-white/45">{item.description}</span></button>; })}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label htmlFor="ai-difficulty" className="mb-2 block text-sm font-bold text-white">3. Zorluk</label><select id="ai-difficulty" className="input" value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}><option>Kolay</option><option>Orta</option><option>Zor</option></select></div>
            <div><label htmlFor="ai-count" className="mb-2 block text-sm font-bold text-white">4. Tur sayısı</label><select id="ai-count" className="input" value={count} onChange={(event) => setCount(Number(event.target.value))}><option value={4}>4 tur</option><option value={6}>6 tur</option><option value={8}>8 tur</option></select></div>
          </div>
          <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-3"><div className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand-purple"><CheckCircle2 className="h-4 w-4"/> Oyun ayarların hazır</div><p className="mt-1.5 text-xs leading-relaxed text-brand-white/55">{topic.trim() || 'Konu seçilmedi'} · {modes.find((item) => item.id === mode)?.title} · {difficulty} · {count} tur</p></div>
          {error && <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div>}
          <button type="submit" disabled={loading || topic.trim().length < 2} className="btn-primary w-full py-3.5"><span>{loading ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <WandSparkles className="h-5 w-5"/>}</span>{loading ? 'Oyun hazırlanıyor…' : 'Oyunu oluştur'}</button>
          <p className="text-[11px] leading-relaxed text-brand-white/40">Yapay zekâ özelliği için Vercel’de OPENAI_API_KEY tanımlanmalıdır. Anahtarı GitHub’a veya tarayıcı koduna ekleme. API kullanımı ücret doğurabilir.</p>
        </form>

        <aside className="space-y-4">
          <section className="arcade-panel p-4 sm:p-5"><div className="mb-4 flex items-center gap-3"><div className="arcade-icon"><Zap className="h-5 w-5"/></div><div><h2 className="font-black text-white">Nasıl çalışır?</h2><p className="text-xs text-brand-white/45">Üç kısa adım</p></div></div><div className="space-y-4">{[{n:'01',t:'Konu seç',d:'Merak ettiğin bir başlık yaz.'},{n:'02',t:'Oyun türünü belirle',d:'Quiz, bilmece veya kelime oyunu seç.'},{n:'03',t:'Oyna ve tekrar dene',d:'Cevaplarını gör, oyunu yeniden aç.'}].map((step) => <div key={step.n} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A111B] text-xs font-black text-brand-purple">{step.n}</span><div><p className="text-sm font-bold text-white">{step.t}</p><p className="mt-0.5 text-xs leading-relaxed text-brand-white/45">{step.d}</p></div></div>)}</div></section>
          <section className="arcade-panel p-4 sm:p-5"><div className="flex items-center gap-3"><div className="arcade-icon"><Brain className="h-5 w-5"/></div><div><h2 className="font-black text-white">Oyun özellikleri</h2><p className="text-xs text-brand-white/45">Her oyun kısa ve tekrar oynanabilir.</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl border border-white/10 bg-[#0B121C] p-3"><p className="text-lg font-black text-brand-purple">4–8</p><p className="text-[11px] text-brand-white/45">Tur seçeneği</p></div><div className="rounded-xl border border-white/10 bg-[#0B121C] p-3"><p className="text-lg font-black text-brand-purple">3</p><p className="text-[11px] text-brand-white/45">Zorluk seviyesi</p></div></div><p className="mt-3 text-xs leading-relaxed text-brand-white/45">İlk denemede Kolay seviyeyi seç. Soruların açıklamalarını okuyarak yeni bilgiler öğrenebilirsin.</p></section>
        </aside>
      </div>

      <section className="space-y-3"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-widest text-brand-purple">KİŞİSEL KÜTÜPHANE</p><h2 className="text-xl font-black text-white">Oluşturduğun oyunlar</h2></div><span className="text-xs text-brand-white/40">{games.length} / 12 kayıt</span></div>
        {games.length > 0 ? <div className="grid gap-3 sm:grid-cols-2">{games.map((game) => <div key={game.id} className="arcade-panel flex items-center gap-3 p-4"><div className="arcade-icon"><Gamepad2 className="h-5 w-5"/></div><Link to={`/oyunlar/ai/${game.id}`} className="min-w-0 flex-1"><h3 className="truncate font-bold text-white hover:text-brand-purple">{game.title}</h3><p className="mt-1 truncate text-xs text-brand-white/45">{game.topic} · {game.questions.length} tur · {game.difficulty}</p></Link><button onClick={() => removeGame(game.id)} aria-label={`${game.title} oyununu sil`} className="rounded-lg border border-white/10 p-2 text-brand-white/40 transition hover:border-rose-400/30 hover:text-rose-300"><Trash2 className="h-4 w-4"/></button><ArrowRight className="h-4 w-4 shrink-0 text-brand-white/35"/></div>)}</div> : <div className="arcade-panel p-7 text-center"><Gamepad2 className="mx-auto h-8 w-8 text-brand-white/30"/><p className="mt-3 font-bold text-white">Henüz oyun oluşturmadın.</p><p className="mt-1 text-sm text-brand-white/45">İlk oyununu yukarıdaki atölyeden hazırlayabilirsin.</p></div>}
      </section>
      <div className="flex items-center gap-2 text-xs text-brand-white/35"><Clock3 className="h-4 w-4"/> Oluşturduğun oyunlar yalnızca bu tarayıcıda saklanır.</div>
    </div>
  );
}

import { useState } from 'react';
import { Target, Check, Clock, Flame } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { dailyTasks } from '@/data/content';

export function TasksPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((p) => ({ ...p, [id]: !p[id] }));
  const completed = Object.values(done).filter(Boolean).length;
  const totalXp = dailyTasks.filter((t) => done[t.id]).reduce((sum, t) => sum + t.xp, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Günlük Görevler" subtitle="Her gün yeni görevler, yeni hedefler. Görevleri tamamla, XP topla." icon={<Target className="w-7 h-7" />} accent="from-emerald-500/30 to-teal-500/20" />

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold text-white">{completed}/{dailyTasks.length}</div>
          <div className="text-xs text-brand-white/50 mt-1">Tamamlanan</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold text-gradient">{totalXp}</div>
          <div className="text-xs text-brand-white/50 mt-1">Kazanılan XP</div>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-2xl font-extrabold text-white">{completed > 0 ? '1' : '0'}</span>
          </div>
          <div className="text-xs text-brand-white/50 mt-1">Gün Serisi</div>
        </div>
      </div>

      <div className="space-y-3">
        {dailyTasks.map((task, i) => {
          const isDone = !!done[task.id];
          return (
            <div
              key={task.id}
              className={`card p-4 sm:p-5 flex items-center gap-4 transition-all animate-slide-up ${
                isDone ? 'border-emerald-500/30 bg-emerald-500/5' : 'card-hover'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => toggle(task.id)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-ink-deep border border-ink-border text-brand-white/40 hover:border-brand-purple/40'
                }`}
                aria-label={isDone ? 'Geri al' : 'Tamamla'}
              >
                <Check className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold ${isDone ? 'text-brand-white/40 line-through' : 'text-white'}`}>{task.title}</h3>
                <p className="text-brand-white/45 text-xs mt-0.5">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="chip bg-amber-500/15 text-amber-400 border border-amber-500/30">+{task.xp} XP</span>
                <span className="hidden sm:inline-flex chip bg-ink-deep border border-ink-border text-brand-white/50">
                  {task.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5 mt-6 flex items-center gap-3">
        <Clock className="w-5 h-5 text-brand-purple shrink-0" />
        <p className="text-brand-white/50 text-sm">
          Görevler her gün yenilenir. İlerlemen şu an bu cihazda geçici olarak saklanır; hesap sistemi açıldığında kalıcı olacak.
        </p>
      </div>
    </div>
  );
}

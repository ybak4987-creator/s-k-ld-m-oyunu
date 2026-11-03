import { Trophy, Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';

export function LeaderboardPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Liderlik Tablosu" subtitle="En çok XP toplayan kullanıcılar burada. Sen de aralarında olmak ister misin?" icon={<Trophy className="w-7 h-7" />} accent="from-amber-500/30 to-orange-500/20" />

      <div className="card p-8 text-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-float">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Yakında Açılıyor</h2>
        <p className="text-brand-white/55 max-w-md mx-auto mt-2 text-sm">
          Liderlik tablosu, kullanıcıların puanlarını gerçek zamanlı olarak gösterecek.
          Gerçek skorlar için hesap sistemi devreye girdiğinde burada olacak.
          Şu anda gerçek olmayan, sahte bir sıralama göstermek istemiyoruz.
        </p>
        <Link to="/gorevler" className="btn-primary mt-5 text-sm">
          Görevleri Tamamla
        </Link>
      </div>
    </div>
  );
}

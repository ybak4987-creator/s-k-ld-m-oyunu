import { useState } from 'react';
import { User, Settings, LogOut, Trophy, Flame, Target, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export function ProfilePage() {
  const [guest] = useState(true);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Profil" subtitle="Hesabını ve aktivitelerini buradan yönet." icon={<User className="w-7 h-7" />} accent="from-brand-purple/20 to-brand-blue/10" />

      {/* Guest card */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-2xl font-extrabold">
            ?
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Misafir Kullanıcı</h2>
            <p className="text-brand-white/50 text-sm mt-0.5">Henüz hesabın yok. Verilerini kaydetmek için kayıt ol.</p>
          </div>
          <Link to="/kayit" className="btn-primary text-sm shrink-0 hidden sm:inline-flex">
            Kayıt Ol
          </Link>
        </div>
        <Link to="/kayit" className="btn-primary text-sm w-full mt-4 sm:hidden">
          Kayıt Ol
        </Link>
      </div>

      {/* İstatistikler (gerçek veri olmadan dolu gösterilmez) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Trophy, label: 'Puan', value: '0' },
          { icon: Flame, label: 'Gün Serisi', value: '0' },
          { icon: Target, label: 'Görev', value: '0' },
          { icon: Sparkles, label: 'Test', value: '0' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 text-center">
              <Icon className="w-5 h-5 mx-auto text-brand-purple mb-1.5" />
              <div className="text-xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-brand-white/45 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Menü */}
      <div className="card divide-y divide-ink-border">
        <Link to="/ayarlar" className="flex items-center gap-3 p-4 hover:bg-ink-hover transition-colors first:rounded-t-2xl">
          <Settings className="w-5 h-5 text-brand-purple" />
          <span className="flex-1 text-white font-medium">Ayarlar</span>
          <ChevronRight className="w-4 h-4 text-brand-white/40" />
        </Link>
        <Link to="/giris" className="flex items-center gap-3 p-4 hover:bg-ink-hover transition-colors last:rounded-b-2xl">
          <LogOut className="w-5 h-5 text-brand-purple" />
          <span className="flex-1 text-white font-medium">Giriş Yap</span>
          <ChevronRight className="w-4 h-4 text-brand-white/40" />
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${on ? 'bg-brand-purple' : 'bg-ink-border'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ayarlar" subtitle="Uygulama deneyimini kişiselleştir." icon={<SettingsIcon className="w-7 h-7" />} accent="from-violet-500/30 to-purple-500/20" />

      <div className="space-y-6">
        <div className="card p-5">
          <h2 className="font-bold text-white mb-4">Görünüm</h2>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-purple">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-white font-medium text-sm">Koyu Tema</p>
                <p className="text-brand-white/45 text-xs">Şu anda aktif</p>
              </div>
            </div>
            <Toggle on={darkMode} onClick={() => setDarkMode((v) => !v)} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-white mb-4">Bildirimler</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-purple">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Bildirimler</p>
                  <p className="text-brand-white/45 text-xs">Günlük görev ve hatırlatmalar</p>
                </div>
              </div>
              <Toggle on={notifications} onClick={() => setNotifications((v) => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-purple">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Ses Efektleri</p>
                  <p className="text-brand-white/45 text-xs">Oyun içi sesler</p>
                </div>
              </div>
              <Toggle on={sound} onClick={() => setSound((v) => !v)} />
            </div>
          </div>
        </div>

        <div className="card divide-y divide-ink-border">
          {[
            { icon: Globe, label: 'Dil', value: 'Türkçe' },
            { icon: HelpCircle, label: 'Yardım & Destek', value: '' },
            { icon: Shield, label: 'Gizlilik', value: '' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="w-full flex items-center gap-3 p-4 hover:bg-ink-hover transition-colors first:rounded-t-2xl last:rounded-b-2xl text-left">
                <div className="w-10 h-10 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-brand-purple">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 text-white font-medium text-sm">{item.label}</span>
                {item.value && <span className="text-brand-white/40 text-xs">{item.value}</span>}
                <ChevronRight className="w-4 h-4 text-brand-white/40" />
              </button>
            );
          })}
        </div>

        <div className="card p-4 bg-ink-deep/50">
          <p className="text-brand-white/40 text-xs text-center">
            Tercihler bu cihazda geçici olarak saklanır. Hesap sistemi açıldığında seninle gelecek.
          </p>
        </div>
      </div>
    </div>
  );
}

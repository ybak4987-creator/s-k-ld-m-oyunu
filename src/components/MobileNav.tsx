import { NavLink } from 'react-router-dom';
import { Home, Compass, Gamepad2, Target, User } from 'lucide-react';

const items = [
  { to: '/', label: 'Ana Sayfa', icon: Home },
  { to: '/kesfet', label: 'Keşfet', icon: Compass },
  { to: '/oyunlar', label: 'Oyunlar', icon: Gamepad2 },
  { to: '/gorevler', label: 'Görevler', icon: Target },
  { to: '/profil', label: 'Profil', icon: User },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-ink-border/70 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-brand-purple' : 'text-brand-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-brand-purple/20' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

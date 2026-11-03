import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/kesfet', label: 'Keşfet' },
  { to: '/oyunlar', label: 'Oyunlar' },
  { to: '/testler', label: 'Testler' },
  { to: '/gorevler', label: 'Görevler' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-ink-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'text-white bg-brand-purple/15' : 'text-brand-white/60 hover:text-white hover:bg-ink-hover'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/giris" className="btn-ghost text-sm py-2.5">
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </Link>
            <Link to="/kayit" className="btn-primary text-sm py-2.5">
              <UserPlus className="w-4 h-4" />
              Kayıt Ol
            </Link>
          </div>

          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-ink-card border border-ink-border flex items-center justify-center text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-b border-ink-border animate-fade-in-fast">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'text-white bg-brand-purple/15' : 'text-brand-white/70 hover:bg-ink-hover'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link to="/giris" onClick={() => setOpen(false)} className="btn-ghost text-sm py-3">
                <LogIn className="w-4 h-4" />
                Giriş Yap
              </Link>
              <Link to="/kayit" onClick={() => setOpen(false)} className="btn-primary text-sm py-3">
                <UserPlus className="w-4 h-4" />
                Kayıt Ol
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-10">
        <Outlet />
      </main>
      <MobileNav />
      <footer className="hidden lg:block border-t border-ink-border py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-brand-white/40">
          <span>© 2026 SIKILDIM! — Canın mı sıkıldı? Bize gel!</span>
          <span className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-default">Gizlilik</span>
            <span className="hover:text-white transition-colors cursor-default">Şartlar</span>
            <span className="hover:text-white transition-colors cursor-default">İletişim</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

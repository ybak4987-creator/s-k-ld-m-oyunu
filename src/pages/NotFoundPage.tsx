import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-scale-in">
        <div className="relative inline-block mb-6">
          <div className="text-[8rem] sm:text-[12rem] font-extrabold leading-none text-gradient">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">🤷</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">Sayfa Bulunamadı</h1>
        <p className="text-brand-white/50 mt-2 max-w-md mx-auto">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Ama merak etme, eğlence burada devam ediyor.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <Link to="/kesfet" className="btn-ghost">
            <Compass className="w-4 h-4" />
            Keşfet
          </Link>
        </div>
      </div>
    </div>
  );
}

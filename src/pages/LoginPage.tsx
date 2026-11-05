import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: { email?: string; password?: string } = {};
    if (!email) err.email = 'E-posta gerekli.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Geçerli bir e-posta gir.';
    if (!password) err.password = 'Şifre gerekli.';
    else if (password.length < 6) err.password = 'En az 6 karakter.';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // Hesap sistemi henüz bağlı değil
      setErrors({ email: 'Giriş sistemi henüz aktif değil. Kısa süre sonra açılacak.' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <div className="card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white mb-3">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Tekrar Hoş Geldin!</h1>
            <p className="text-brand-white/50 text-sm mt-1">Hesabına giriş yap ve eğlenmeye devam et.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-white/70 mb-1.5 block">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-white/40" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" className={`input pl-11 ${errors.email ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-brand-white/70 mb-1.5 block">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-white/40" />
                <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`input pl-11 pr-11 ${errors.password ? 'border-red-500/50' : ''}`} />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-white/40 hover:text-white" aria-label={show ? 'Gizle' : 'Göster'}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">
              Giriş Yap
            </button>
          </form>

          <div className="card p-3 mt-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-amber-300/80 text-xs text-center">
              Giriş sistemi şu anda geliştirme aşamasında. Yakında aktif olacak.
            </p>
          </div>

          <p className="text-center text-sm text-brand-white/50 mt-5">
            Hesabın yok mu?{' '}
            <Link to="/kayit" className="text-brand-purple font-semibold hover:text-brand-blue transition-colors">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

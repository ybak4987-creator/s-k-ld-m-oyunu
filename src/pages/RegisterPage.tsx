import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff, Check } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = [
    { label: 'En az 6 karakter', ok: password.length >= 6 },
    { label: 'Bir harf içerir', ok: /[a-zA-Z]/.test(password) },
    { label: 'Bir rakam içerir', ok: /\d/.test(password) },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Kullanıcı adı gerekli.';
    if (!email) err.email = 'E-posta gerekli.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Geçerli bir e-posta gir.';
    if (!password) err.password = 'Şifre gerekli.';
    else if (password.length < 6) err.password = 'En az 6 karakter.';
    if (confirm !== password) err.confirm = 'Şifreler eşleşmiyor.';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setErrors({ form: 'Kayıt sistemi henüz aktif değil. Kısa süre sonra açılacak.' });
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
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Aramıza Katıl!</h1>
            <p className="text-brand-white/50 text-sm mt-1">Hesap oluştur, görevler tamamla, eğlen.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-white/70 mb-1.5 block">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-white/40" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="kullanici_adi" className={`input pl-11 ${errors.name ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>
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
              {password && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {rules.map((r) => (
                    <span key={r.label} className={`chip text-[10px] ${r.ok ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-ink-deep text-brand-white/40 border border-ink-border'}`}>
                      {r.ok && <Check className="w-2.5 h-2.5" />}
                      {r.label}
                    </span>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-brand-white/70 mb-1.5 block">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-white/40" />
                <input type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className={`input pl-11 ${errors.confirm ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirm}</p>}
            </div>
            {errors.form && (
              <div className="card p-3 bg-amber-500/5 border-amber-500/20">
                <p className="text-amber-300/80 text-xs text-center">{errors.form}</p>
              </div>
            )}
            <button type="submit" className="btn-primary w-full">
              Hesap Oluştur
            </button>
          </form>

          <p className="text-center text-sm text-brand-white/50 mt-5">
            Zaten hesabın var mı?{' '}
            <Link to="/giris" className="text-brand-purple font-semibold hover:text-brand-blue transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

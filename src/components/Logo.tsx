import { Link } from 'react-router-dom';

export function Logo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`${dim} rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-lg shadow-brand-purple/30 group-hover:scale-105 transition-transform`}>
        <span className="text-white font-extrabold text-lg">S!</span>
      </div>
      {withText && (
        <span className={`${text} font-extrabold tracking-tight text-white`}>
          SIKILDIM<span className="text-brand-purple">!</span>
        </span>
      )}
    </Link>
  );
}

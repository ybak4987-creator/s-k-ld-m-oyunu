export function Loader({ label = 'Yükleniyor...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in-fast">
      <div className="w-12 h-12 rounded-full border-4 border-ink-border border-t-brand-purple animate-spin" />
      <p className="text-brand-white/50 text-sm">{label}</p>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}

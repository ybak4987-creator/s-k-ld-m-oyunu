export type Category = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
};

export const categories: Category[] = [
  {
    slug: 'mini-oyunlar',
    title: 'Mini Oyunlar',
    description: 'Hızlı, eğlenceli ve farklı oyunlar',
    icon: 'Gamepad2',
    color: 'from-violet-500/30 to-purple-500/20',
    route: '/oyunlar',
  },
  {
    slug: 'zeka-testleri',
    title: 'Zeka Testleri',
    description: 'Kolay sorularla başla, yeni şeyler keşfet',
    icon: 'Brain',
    color: 'from-blue-500/30 to-cyan-500/20',
    route: '/testler',
  },
  {
    slug: 'kisilik-testleri',
    title: 'Kişilik Testleri',
    description: 'Eğlenceli sorularla kendini keşfet',
    icon: 'Sparkles',
    color: 'from-pink-500/30 to-rose-500/20',
    route: '/testler',
  },
  {
    slug: 'genel-kultur',
    title: 'Genel Kültür',
    description: 'Bilgini test et, yeni şeyler öğren',
    icon: 'GraduationCap',
    color: 'from-amber-500/30 to-orange-500/20',
    route: '/testler',
  },
  {
    slug: 'gunluk-gorevler',
    title: 'Günlük Görevler',
    description: 'Her gün yeni bir görev, yeni bir hedef',
    icon: 'Target',
    color: 'from-emerald-500/30 to-teal-500/20',
    route: '/gorevler',
  },
  {
    slug: 'arkadaslarla-eglence',
    title: 'Arkadaşlarla Eğlence',
    description: 'Birlikte oyna, birlikte eğlen',
    icon: 'Users',
    color: 'from-sky-500/30 to-indigo-500/20',
    route: '/arkadaslar',
  },
  {
    slug: 'yapay-zeka-eglencesi',
    title: 'Yapay Zekâ Eğlencesi',
    description: 'Yapay zekâ ile etkileşim ve eğlence',
    icon: 'Bot',
    color: 'from-fuchsia-500/30 to-purple-500/20',
    route: '/yapay-zeka',
  },
  {
    slug: 'rastgele-aktiviteler',
    title: 'Rastgele Aktiviteler',
    description: 'Sürpriz bir şeyler dene',
    icon: 'Dices',
    color: 'from-rose-500/30 to-red-500/20',
    route: '/kesfet',
  },
];

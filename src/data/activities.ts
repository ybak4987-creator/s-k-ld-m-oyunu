import { pickFreshDiverse } from './gameUtils';

export type Activity = {
  id: string;
  title: string;
  description: string;
  icon: string;
  categorySlug: string;
  route: string;
};

export const activities: Activity[] = [
  {
    id: 'memory',
    title: 'Hafıza Kartları',
    description: 'Kartları eşleştir, hafızanı zorla',
    icon: 'LayoutGrid',
    categorySlug: 'mini-oyunlar',
    route: '/oyunlar/memory',
  },
  {
    id: 'reaction',
    title: 'Tepki Hızı',
    description: 'Ne kadar hızlısın? Gözlerini test et',
    icon: 'Zap',
    categorySlug: 'mini-oyunlar',
    route: '/oyunlar/reaksiyon',
  },
  {
    id: 'numberguess',
    title: 'Sayı Tutma',
    description: 'Gizli sayıyı en az denemede bul',
    icon: 'Hash',
    categorySlug: 'mini-oyunlar',
    route: '/oyunlar/sayi-tutma',
  },
  {
    id: 'iqtest',
    title: 'Mantık ve Sayı Testi',
    description: 'Kolay sayı dizileriyle kendini dene',
    icon: 'Brain',
    categorySlug: 'zeka-testleri',
    route: '/testler/iq',
  },
  {
    id: 'personality',
    title: 'Kişilik Testi',
    description: 'Hangi kişilik tipine yakınsın?',
    icon: 'Sparkles',
    categorySlug: 'kisilik-testleri',
    route: '/testler/kisilik',
  },
  {
    id: 'trivia',
    title: 'Genel Kültür Quiz',
    description: 'Bilgini farklı kategorilerde test et',
    icon: 'GraduationCap',
    categorySlug: 'genel-kultur',
    route: '/testler/genel-kultur',
  },
  {
    id: 'dailytask',
    title: 'Günün Görevi',
    description: 'Bugünün özel görevini tamamla',
    icon: 'Target',
    categorySlug: 'gunluk-gorevler',
    route: '/gorevler',
  },
  {
    id: 'random',
    title: 'Rastgele Aktivite',
    description: 'Bilinmeyene göz at',
    icon: 'Dices',
    categorySlug: 'rastgele-aktiviteler',
    route: '/kesfet',
  },
];

export function pickRandomActivity(exclude?: string): Activity {
  const pool = exclude ? activities.filter((activity) => activity.id !== exclude) : activities;
  const selected = pickFreshDiverse(pool, (activity) => activity.id, (activity) => activity.categorySlug, 'random-activity-wheel', 1)[0];
  return selected ?? pool[0] ?? activities[0];
}

import { categories, type Category } from './categories';
import { activities, type Activity } from './activities';

export type Game = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
  accent: string;
};

export const games: Game[] = [
  { id: 'memory', title: 'Hafıza Kartları', description: 'Eşleşen çiftleri bul, hafızanı zorla.', icon: 'LayoutGrid', route: '/oyunlar/memory', badge: 'Popüler', accent: 'violet' },
  { id: 'reaction', title: 'Tepki Hızı', description: 'Ekran yeşile döndüğünde anında tıkla.', icon: 'Zap', route: '/oyunlar/reaksiyon', badge: 'Refleks', accent: 'amber' },
  { id: 'numberguess', title: 'Sayı Tutma', description: 'Gizli sayıyı ipuçlarıyla bul.', icon: 'Hash', route: '/oyunlar/sayi-tutma', accent: 'blue' },
  { id: 'word-scramble', title: 'Kelime Karıştır', description: 'Karışan harfleri doğru kelimeye dönüştür.', icon: 'Shuffle', route: '/oyunlar/kelime-karistir', badge: 'Yeni', accent: 'pink' },
  { id: 'word-guess', title: 'Kelimeyi Bul', description: 'Harfleri tahmin ederek gizli kelimeyi aç.', icon: 'Search', route: '/oyunlar/kelimeyi-bul', accent: 'emerald' },
  { id: 'sequence', title: 'Sayı Dizisi', description: 'Örüntüyü çöz, sıradaki sayıyı bul.', icon: 'Brain', route: '/oyunlar/sayi-dizisi', accent: 'blue' },
  { id: 'math-sprint', title: 'Matematik Sprint', description: '30 veya 60 saniyede olabildiğince çok işlem çöz.', icon: 'Timer', route: '/oyunlar/matematik-sprint', badge: 'Süreli', accent: 'amber' },
  { id: 'true-false', title: 'Doğru mu Yanlış mı?', description: 'Tarih, bilim, spor ve genel kültür bilgilerini test et.', icon: 'HelpCircle', route: '/oyunlar/dogru-yanlis', accent: 'violet' },
  { id: 'word-chain', title: 'Kelime Zinciri', description: 'Son harften başlayan yeni kelimeler üret.', icon: 'Link', route: '/oyunlar/kelime-zinciri', accent: 'pink' },
  { id: 'pattern-memory', title: 'Desen Hafızası', description: 'Gösterilen karelerin yerlerini aklında tut.', icon: 'Grid3X3', route: '/oyunlar/desen-hafizasi', accent: 'blue' },
  { id: 'odd-one-out', title: 'Farklı Olanı Bul', description: 'Kalabalığın içindeki farklı sembolü yakala.', icon: 'ScanSearch', route: '/oyunlar/farkli-olani-bul', accent: 'emerald' },
  { id: 'color-attention', title: 'Renk ve Dikkat', description: 'Kelimenin anlamıyla yazı rengini karıştırma.', icon: 'Palette', route: '/oyunlar/renk-dikkat', accent: 'amber' },
  { id: 'code-breaker', title: 'Kod Kırıcı', description: 'Zorluk seviyene göre 3–5 rakamlı gizli kodu çöz.', icon: 'LockKeyhole', route: '/oyunlar/kod-kirici', accent: 'violet' },
];

export type Test = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: string;
  questions: number;
  minutes: number;
  badge?: string;
  accent: string;
};

export const tests: Test[] = [
  {
    id: 'iq',
    title: 'Mantık ve Sayı Testi',
    description: 'Kolay sayı dizileri ve temel mantık sorularıyla kendini dene.',
    icon: 'Brain',
    route: '/testler/iq',
    category: 'Zeka Testleri',
    questions: 10,
    minutes: 5,
    badge: 'Popüler',
    accent: 'blue',
  },
  {
    id: 'personality',
    title: 'Kişilik Testi',
    description: '16 kişilik tipinden hangisine en yakın olduğunu keşfet.',
    icon: 'Sparkles',
    route: '/testler/kisilik',
    category: 'Kişilik Testleri',
    questions: 6,
    minutes: 3,
    accent: 'pink',
  },
  {
    id: 'trivia',
    title: 'Genel Kültür Quiz',
    description: 'Tarih, coğrafya, bilim ve sanat üzerine sorular.',
    icon: 'GraduationCap',
    route: '/testler/genel-kultur',
    category: 'Genel Kültür',
    questions: 10,
    minutes: 5,
    badge: 'Yeni',
    accent: 'amber',
  },
];

export type Task = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
};

export const dailyTasks: Task[] = [
  {
    id: 't1',
    title: 'Hafıza Oyununu Oyna',
    description: 'Bir tur Hafıza Kartları oyna',
    icon: 'LayoutGrid',
    xp: 20,
    difficulty: 'Kolay',
  },
  {
    id: 't2',
    title: 'Bir Test Çöz',
    description: 'Herhangi bir testten en az %60 başarım al',
    icon: 'ClipboardCheck',
    xp: 30,
    difficulty: 'Orta',
  },
  {
    id: 't3',
    title: 'Refleksini Ölç',
    description: 'Tepki Hızı oyununda 400ms altına düş',
    icon: 'Zap',
    xp: 25,
    difficulty: 'Orta',
  },
  {
    id: 't4',
    title: 'Rastgele Aktivite Dene',
    description: 'Rastgele bir aktivite bul ve dene',
    icon: 'Dices',
    xp: 15,
    difficulty: 'Kolay',
  },
];

export { categories, activities };
export type { Category, Activity };

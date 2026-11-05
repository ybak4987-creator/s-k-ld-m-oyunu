import { iqQuestionBank, triviaQuestionBank } from './gameData';
import type { QuizQuestion } from './types';
export type { QuizQuestion } from './types';

export const iqQuestions: QuizQuestion[] = iqQuestionBank;

export type PersonalityQuestion = {
  id: number;
  question: string;
  options: { label: string; trait: string }[];
};

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    question: 'Bir partiye gittinde kendini nasıl hissedersin?',
    options: [
      { label: 'Yeni insanlarla hemen sohbet ederim', trait: 'extrovert' },
      { label: 'Tanıdıklarımla kalırım', trait: 'introvert' },
      { label: 'Sahneye çıkar eğlenceli bir şey yaparım', trait: 'extrovert' },
      { label: 'Köşede insanları izlerim', trait: 'introvert' },
    ],
  },
  {
    id: 2,
    question: 'Bir problemi nasıl çözmeyi tercih edersin?',
    options: [
      { label: 'Mantık ve verilerle', trait: 'thinking' },
      { label: 'Sezgi ve duygularla', trait: 'feeling' },
      { label: 'Plan yapıarak adım adım', trait: 'thinking' },
      { label: 'İçimden ne derse onu yaparım', trait: 'feeling' },
    ],
  },
  {
    id: 3,
    question: 'Boş bir gününde ne yaparsın?',
    options: [
      { label: 'Dışarı çıkar keşfederim', trait: 'extrovert' },
      { label: 'Evde kitap/film izlerim', trait: 'introvert' },
      { label: 'Arkadaşlarımı çağırırım', trait: 'extrovert' },
      { label: 'Kendime özel bir şeyler yaparım', trait: 'introvert' },
    ],
  },
  {
    id: 4,
    question: 'Karar verirken seni daha çok etkileyen şey nedir?',
    options: [
      { label: 'Adil ve doğru olmak', trait: 'thinking' },
      { label: 'Herkesin mutlu olması', trait: 'feeling' },
      { label: 'Mantıklı bir çözüm', trait: 'thinking' },
      { label: 'İnsanların duyguları', trait: 'feeling' },
    ],
  },
  {
    id: 5,
    question: 'Yeni bir proje başlattığında...',
    options: [
      { label: 'Hemen harekete geçerim', trait: 'extrovert' },
      { label: 'Önce araştırırım', trait: 'introvert' },
      { label: 'Başkalarıyla birlikte yaparım', trait: 'extrovert' },
      { label: 'Kendi başıma bitiririm', trait: 'introvert' },
    ],
  },
  {
    id: 6,
    question: 'Bir arkadaşın üzüldüğünde ne yaparsın?',
    options: [
      { label: 'Çözüm önerir, mantıklı konuşurum', trait: 'thinking' },
      { label: 'Yanında olur, dinlerim', trait: 'feeling' },
      { label: 'Sorunu analiz ederim', trait: 'thinking' },
      { label: 'Onu güldürmeye çalışırım', trait: 'feeling' },
    ],
  },
];

export type PersonalityResult = {
  type: string;
  title: string;
  description: string;
  emoji: string;
};

export const personalityResults: PersonalityResult[] = [
  {
    type: 'extrovert-thinking',
    title: 'Girişimci Lider',
    description:
      'Sosyal ve mantıklı birisin. İnsanları bir araya getirir, hedeflere odaklanır ve çözüm üretirsin. Doğal bir liderlik enerjin var.',
    emoji: 'L',
  },
  {
    type: 'extrovert-feeling',
    title: 'Sıcakkanlı Eğlenceli',
    description:
      'İnsanları seven, enerjik ve empatik birisin. Ortamın neşesisin, duyguların rehberlik eder ve çevrene pozitiflik yayarsın.',
    emoji: 'E',
  },
  {
    type: 'introvert-thinking',
    title: 'Stratejik Düşünür',
    description:
      'Sakin, derin ve analitik bir zihnin var. Kendi iç dünyanda güç bulur, mantıklı planlarla ilerlersin. Az konuşur, çok düşünürsün.',
    emoji: 'S',
  },
  {
    type: 'introvert-feeling',
    title: 'Yaratıcı Hayalperest',
    description:
      'Duyarlı, derin ve yaratıcı birisin. Kendi iç dünyan zengindir, sanata ve anlama değer verirsin. İnsanları derinden anlarsın.',
    emoji: 'Y',
  },
];

export const triviaQuestions: QuizQuestion[] = triviaQuestionBank;

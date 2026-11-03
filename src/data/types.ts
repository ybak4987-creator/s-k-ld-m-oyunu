export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  topic?: string;
  difficulty?: 'Kolay' | 'Orta' | 'Zor';
  explanation?: string;
};

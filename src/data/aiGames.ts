export type AIGameMode = 'quiz' | 'true-false' | 'riddle' | 'word-scramble';
export type AIGameQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint?: string;
};
export type AIGame = {
  id: string;
  title: string;
  description: string;
  topic: string;
  mode: AIGameMode;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  createdAt: number;
  questions: AIGameQuestion[];
};

const STORAGE_KEY = 'sikildim:ai-games:v1';

export function loadAIGames(): AIGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is AIGame => Boolean(
      item && typeof item === 'object' && typeof item.id === 'string' &&
      typeof item.title === 'string' && Array.isArray(item.questions),
    ));
  } catch {
    return [];
  }
}

export function saveAIGame(game: AIGame): AIGame[] {
  const games = [game, ...loadAIGames().filter((item) => item.id !== game.id)].slice(0, 12);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); } catch { /* Oyun bellekte oynanabilir. */ }
  return games;
}

export function findAIGame(id: string): AIGame | undefined {
  return loadAIGames().find((game) => game.id === id);
}


export function deleteAIGame(id: string): AIGame[] {
  const games = loadAIGames().filter((game) => game.id !== id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); } catch { /* Silme işlemi sayfa belleğinde kalır. */ }
  return games;
}

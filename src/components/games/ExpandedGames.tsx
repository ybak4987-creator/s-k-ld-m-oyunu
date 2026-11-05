import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Brain, Check, CheckCircle2, Clock3, Eye, LockKeyhole,
  RefreshCw, Search, Sparkles, Target, Trophy, X, Zap,
} from 'lucide-react';
import { easyKnowledgeFacts, sequenceBank, wordBank, type KnowledgeFact, type SequenceChallenge, type WordEntry } from '@/data/gameData';
import { getBestScore, normalizeTurkish, pickFresh, pickFreshDiverse, randomInt, saveBestScore, shuffleArray } from '@/data/gameUtils';

function GameFrame({ title, description, icon, children }: { title: string; description: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-4 sm:space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-ink-border bg-[#101925] p-4 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-brand-purple/6 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="arcade-icon h-12 w-12 sm:h-14 sm:w-14">{icon}</div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-white/45 mb-1">SIKILDIM! · OYUN MERKEZİ</p>
              <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">{title}</h1>
              <p className="text-xs sm:text-sm text-brand-white/55 mt-0.5">{description}</p>
            </div>
          </div>
          <Link to="/oyunlar" className="btn-ghost text-xs sm:text-sm px-3 py-2 shrink-0"><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Tüm oyunlar</span><span className="sm:hidden">Geri</span></Link>
        </div>
      </div>
      {children}
    </div>
  );
}

function DifficultyPicker({ value, onChange }: { value: 'Kolay' | 'Orta' | 'Zor'; onChange: (value: 'Kolay' | 'Orta' | 'Zor') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(['Kolay', 'Orta', 'Zor'] as const).map((level) => (
        <button key={level} onClick={() => onChange(level)} className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${value === level ? 'bg-brand-purple/20 text-white border-brand-purple/50' : 'bg-ink-deep border-ink-border text-brand-white/55 hover:text-white'}`}>{level}</button>
      ))}
    </div>
  );
}

function scramble(value: string): string {
  const letters = [...value];
  if (letters.length < 2) return value;
  let result = value;
  for (let attempt = 0; attempt < 12 && result === value; attempt++) result = shuffleArray(letters).join('');
  if (result === value) result = [...letters.slice(1), letters[0]].join('');
  return result;
}

export function WordScrambleGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const easyWords = wordBank.filter((item) => item.difficulty === 'Kolay' && item.word.length <= 6);
  const [entry, setEntry] = useState<WordEntry>(() => pickFresh(easyWords, (item) => item.word, 'word-scramble-kolay')[0] ?? wordBank[0]);
  const [scrambled, setScrambled] = useState(() => scramble(entry.word));
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [best, setBest] = useState(() => getBestScore('word-scramble'));

  const next = (level = difficulty) => {
    const pool = wordBank.filter((item) => item.difficulty === level && (level !== 'Kolay' || item.word.length <= 6));
    const nextEntry = pickFresh(pool.length ? pool : wordBank, (item) => item.word, `word-scramble-${level.toLocaleLowerCase('tr-TR')}`);
    const selected = nextEntry[0] ?? wordBank[randomInt(0, wordBank.length - 1)];
    setEntry(selected);
    setScrambled(scramble(selected.word));
    setValue('');
    setMessage('');
    setRound((current) => current + 1);
  };

  const changeDifficulty = (level: 'Kolay' | 'Orta' | 'Zor') => {
    setDifficulty(level);
    const pool = wordBank.filter((item) => item.difficulty === level && (level !== 'Kolay' || item.word.length <= 6));
    const selected = pickFresh(pool.length ? pool : wordBank, (item) => item.word, `word-scramble-${level.toLocaleLowerCase('tr-TR')}`)[0];
    if (selected) {
      setEntry(selected);
      setScrambled(scramble(selected.word));
      setValue('');
      setMessage('');
    }
  };

  const check = () => {
    if (normalizeTurkish(value) === normalizeTurkish(entry.word)) {
      const nextScore = score + (difficulty === 'Kolay' ? 10 : difficulty === 'Orta' ? 15 : 20);
      setScore(nextScore);
      const saved = saveBestScore('word-scramble', nextScore);
      setBest(saved);
      setMessage('Doğru! Harika çözdün.');
    } else setMessage('Bu kelime değil. Bir kez daha dene.');
  };

  return (
    <GameFrame title="Kelime Karıştır" description="Karışan harfleri doğru kelimeye dönüştür." icon={<Sparkles className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><DifficultyPicker value={difficulty} onChange={changeDifficulty} /><div className="flex gap-2 text-xs"><span className="chip bg-ink-deep border border-ink-border">Tur {round}</span><span className="chip bg-amber-500/10 border border-amber-500/20 text-amber-300"><Trophy className="w-3 h-3" /> {score} puan</span></div></div>
        <div className="text-center py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-white/40 mb-3">{entry.category} kategorisi</p>
          <div className="flex flex-wrap justify-center gap-2" aria-label="Karışık harfler">{[...scrambled].map((letter, index) => <span key={`${letter}-${index}`} className="w-11 h-12 sm:w-14 sm:h-16 rounded-xl bg-gradient-to-br from-brand-purple/25 to-brand-blue/20 border border-brand-purple/30 flex items-center justify-center text-xl sm:text-2xl font-black text-white">{letter}</span>)}</div>
          <p className="text-brand-white/45 text-sm mt-5">{message && message.startsWith('Doğru') ? 'Yeni kelimeye geçebilirsin.' : 'İpucu: ' + entry.hint}</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); check(); }} className="flex flex-col sm:flex-row gap-2"><input className="input flex-1" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Kelimeyi yaz..." autoComplete="off" disabled={message.startsWith('Doğru')} /><button className="btn-primary" type="submit" disabled={!value.trim() || message.startsWith('Doğru')}>Kontrol et</button></form>
        {message && <div className={`mt-3 rounded-xl p-3 text-sm text-center ${message.startsWith('Doğru') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-200'}`}>{message}</div>}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-5"><span className="text-xs text-brand-white/35">En iyi puan: {best ?? 0}</span>{message.startsWith('Doğru') && <button onClick={() => next()} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4 rotate-180" /> Sonraki kelime</button>}</div>
      </div>
    </GameFrame>
  );
}

const LETTERS = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'];

export function WordGuessGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const poolFor = (level: 'Kolay' | 'Orta' | 'Zor') => wordBank.filter((item) => item.difficulty === level && (level !== 'Kolay' || item.word.length <= 6));
  const [entry, setEntry] = useState<WordEntry>(() => pickFresh(poolFor('Kolay'), (item) => item.word, 'word-guess-kolay')[0] ?? wordBank[0]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBestScore('word-guess'));
  const normalizedWord = normalizeTurkish(entry.word);
  const wrongCount = guessed.filter((letter) => !normalizedWord.includes(letter)).length;
  const won = [...normalizedWord].every((letter) => guessed.includes(letter));
  const lost = wrongCount >= (difficulty === 'Kolay' ? 7 : difficulty === 'Orta' ? 6 : 5);
  const finished = won || lost;
  useEffect(() => { if (won) setBest(saveBestScore('word-guess', score)); }, [won, score]);
  const guess = (letter: string) => {
    if (!finished && !guessed.includes(letter)) {
      setGuessed((current) => [...current, letter]);
      if (normalizedWord.includes(letter)) setScore((current) => current + (difficulty === 'Kolay' ? 2 : difficulty === 'Orta' ? 3 : 4));
    }
  };
  const loadWord = (level: 'Kolay' | 'Orta' | 'Zor', incrementRound: boolean) => {
    const selected = pickFresh(poolFor(level).length ? poolFor(level) : wordBank, (item) => item.word, `word-guess-${level.toLocaleLowerCase('tr-TR')}`)[0];
    if (selected) setEntry(selected);
    setGuessed([]);
    if (incrementRound) setRound((current) => current + 1);
  };
  const next = () => loadWord(difficulty, true);
  const changeDifficulty = (level: 'Kolay' | 'Orta' | 'Zor') => {
    setDifficulty(level);
    loadWord(level, false);
  };
  const maxWrong = difficulty === 'Kolay' ? 7 : difficulty === 'Orta' ? 6 : 5;

  return (
    <GameFrame title="Kelimeyi Bul" description="Harfleri tahmin et, gizli kelimeyi ortaya çıkar." icon={<Search className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5"><DifficultyPicker value={difficulty} onChange={changeDifficulty} /><div className="flex gap-2 items-center"><span className="chip bg-ink-deep border border-ink-border">Tur {round}</span><span className="chip bg-amber-500/10 text-amber-300 border border-amber-500/20"><Trophy className="w-3 h-3" /> {score} puan</span></div></div>
        <div className="text-center py-5"><p className="text-sm text-brand-white/45">Kategori: {entry.category} · {normalizedWord.length} harf</p><p className="text-xs text-brand-white/35 mt-1">İpucu: {entry.hint}</p><div className="flex flex-wrap justify-center gap-2 mt-7">{[...normalizedWord].map((letter, index) => <span key={index} className="w-9 h-12 sm:w-11 sm:h-14 rounded-lg border-b-2 border-brand-purple bg-ink-deep flex items-center justify-center text-xl font-black text-white">{guessed.includes(letter) || lost ? letter : ''}</span>)}</div><p className="text-xs text-brand-white/40 mt-5">Kalan yanlış hakkın: {Math.max(0, maxWrong - wrongCount)}</p></div>
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">{LETTERS.map((letter) => <button key={letter} onClick={() => guess(letter)} disabled={guessed.includes(letter) || finished} className={`h-10 rounded-lg text-sm font-bold border transition-colors ${guessed.includes(letter) ? normalizedWord.includes(letter) ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300/40' : 'bg-ink-deep border-ink-border text-white hover:border-brand-purple/50'}`}>{letter}</button>)}</div>
        {finished && <div className={`mt-5 rounded-xl p-4 text-center ${won ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}><h3 className="font-bold text-white">{won ? 'Kelimeyi buldun!' : 'Bu tur bitti'}</h3><p className="text-sm text-brand-white/60 mt-1">{won ? 'Güzel tahmin!' : `Aradığımız kelime: ${entry.word}`}</p><button onClick={next} className="btn-primary text-sm mt-3">Yeni kelime <RefreshCw className="w-4 h-4" /></button></div>}
        <p className="text-center text-xs text-brand-white/35 mt-5">En iyi puan: {best ?? 0}</p>
      </div>
    </GameFrame>
  );
}

export function NumberSequenceGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const [challenge, setChallenge] = useState<SequenceChallenge>(() => pickFreshDiverse(sequenceBank.filter((item) => item.difficulty === 'Kolay'), (item) => item.id, (item) => item.topic, 'sequence-game-kolay')[0] ?? sequenceBank[0]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [best, setBest] = useState(() => getBestScore('sequence-game'));
  const selectChallenge = (level: 'Kolay' | 'Orta' | 'Zor') => { setDifficulty(level); const pool = sequenceBank.filter((item) => item.difficulty === level); const next = pickFreshDiverse(pool, (item) => item.id, (item) => item.topic, `sequence-game-${level.toLocaleLowerCase('tr-TR')}`)[0]; if (next) { setChallenge(next); setAnswer(''); setFeedback(''); } };
  const next = () => { const pool = sequenceBank.filter((item) => item.difficulty === difficulty); const nextChallenge = pickFreshDiverse(pool, (item) => item.id, (item) => item.topic, `sequence-game-${difficulty.toLocaleLowerCase('tr-TR')}`)[0]; if (nextChallenge) setChallenge(nextChallenge); setAnswer(''); setFeedback(''); setRound((value) => value + 1); };
  const check = () => { if (Number(answer) === challenge.answer && answer.trim() !== '') { const nextScore = score + (difficulty === 'Kolay' ? 10 : difficulty === 'Orta' ? 15 : 20); setScore(nextScore); setBest(saveBestScore('sequence-game', nextScore)); setFeedback(`Doğru! ${challenge.explanation}`); } else setFeedback(`Tekrar dene. İpucu: ${challenge.explanation}`); };
  return (
    <GameFrame title="Sayı Dizisi" description="Örüntüyü keşfet ve eksik sayıyı tamamla." icon={<Brain className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7"><div className="flex flex-wrap justify-between gap-3 mb-6"><DifficultyPicker value={difficulty} onChange={selectChallenge} /><span className="chip bg-amber-500/10 border border-amber-500/20 text-amber-300"><Trophy className="w-3 h-3" /> {score} puan</span></div><p className="text-xs text-brand-white/40 text-center mb-3">Tur {round} · Eksik sayıyı bul</p><div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-8">{challenge.sequence.map((number, index) => <span key={index} className="w-12 h-14 sm:w-16 sm:h-20 rounded-xl bg-ink-deep border border-ink-border flex items-center justify-center text-xl sm:text-2xl font-black text-white">{number}</span>)}<span className="w-12 h-14 sm:w-16 sm:h-20 rounded-xl bg-brand-purple/15 border border-brand-purple/50 flex items-center justify-center text-2xl font-black text-brand-purple">?</span></div><form onSubmit={(event) => { event.preventDefault(); check(); }} className="flex gap-2 max-w-sm mx-auto"><input className="input" type="number" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Eksik sayı" /><button className="btn-primary" type="submit">Kontrol</button></form>{feedback && <div className={`mt-4 rounded-xl p-3 text-center text-sm ${feedback.startsWith('Doğru') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-200'}`}>{feedback}</div>}{feedback.startsWith('Doğru') && <div className="text-center mt-4"><button onClick={next} className="btn-ghost text-sm">Yeni dizi <RefreshCw className="w-4 h-4" /></button></div>}<p className="text-center text-xs text-brand-white/35 mt-5">Kişisel rekor: {best ?? 0} puan</p></div>
    </GameFrame>
  );
}

type MathQuestion = { text: string; answer: number };
function createMathQuestion(level: 'Kolay' | 'Orta' | 'Zor', previousText = ''): MathQuestion {
  const range = level === 'Kolay' ? 10 : level === 'Orta' ? 30 : 80;
  const operations = ['+', '-', '×', '÷'];
  const previousOperation = previousText.match(/[+\-×÷]/)?.[0];
  const availableOperations = operations.filter((operation) => operation !== previousOperation);
  let result: MathQuestion = { text: '2 + 2', answer: 4 };

  for (let attempt = 0; attempt < 20; attempt++) {
    const operation = availableOperations[randomInt(0, availableOperations.length - 1)] ?? operations[0];
    let a = randomInt(1, range);
    let b = randomInt(1, range);
    let answer = 0;

    if (operation === '+') answer = a + b;
    if (operation === '-') {
      if (a < b) [a, b] = [b, a];
      answer = a - b;
    }
    if (operation === '×') {
      const factorMax = level === 'Kolay' ? 4 : level === 'Orta' ? 10 : 18;
      a = randomInt(2, factorMax);
      b = randomInt(2, factorMax);
      answer = a * b;
    }
    if (operation === '÷') {
      const divisorMax = level === 'Kolay' ? 4 : level === 'Orta' ? 10 : 15;
      b = randomInt(2, divisorMax);
      answer = randomInt(2, level === 'Kolay' ? 5 : level === 'Orta' ? 15 : 30);
      a = b * answer;
    }

    result = { text: `${a} ${operation} ${b}`, answer };
    if (result.text !== previousText) return result;
  }
  return result;
}

export function MathSprintGame() {
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState<MathQuestion>(() => createMathQuestion('Kolay'));
  const [value, setValue] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [best, setBest] = useState(() => getBestScore('math-sprint'));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      setActive(false);
      setFinished(true);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [active, timeLeft]);

  const start = (seconds = duration) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setValue('');
    setFeedback('');
    setAnswered(false);
    setQuestion(createMathQuestion(difficulty));
    setFinished(false);
    setActive(true);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submit = () => {
    if (!active || answered || value.trim() === '') return;
    if (Number(value) === question.answer) {
      setScore((current) => current + (difficulty === 'Kolay' ? 5 : difficulty === 'Orta' ? 10 : 15));
      setCorrect((current) => current + 1);
      setFeedback('Doğru cevap! Güzel gidiyorsun.');
    } else {
      setWrong((current) => current + 1);
      setFeedback(`Sorunun doğru cevabı ${question.answer}. Bir sonrakinde tekrar dene.`);
    }
    setAnswered(true);
  };

  const nextQuestion = () => {
    setQuestion(createMathQuestion(difficulty, question.text));
    setValue('');
    setFeedback('');
    setAnswered(false);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  };

  useEffect(() => { if (finished) setBest(saveBestScore('math-sprint', score)); }, [finished, score]);

  return (
    <GameFrame title="Matematik Sprint" description="Kısa ve eğlenceli işlemlerle zamana karşı yarış." icon={<Zap className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <DifficultyPicker value={difficulty} onChange={(level) => { setDifficulty(level); if (!active) setQuestion(createMathQuestion(level)); }} />
          <span className="chip bg-ink-deep border border-ink-border"><Clock3 className="w-3.5 h-3.5" /> {timeLeft} sn</span>
        </div>
        {!active && !finished ? (
          <div className="text-center py-8">
            <div className="text-5xl font-black text-gradient mb-3">{duration}″</div>
            <p className="text-sm text-brand-white/55 mb-5">Kısa bir tur seç ve başlayalım.</p>
            <div className="flex justify-center gap-2 mb-6">{[30, 60].map((seconds) => <button key={seconds} onClick={() => { setDuration(seconds); setTimeLeft(seconds); }} className={`px-4 py-2 rounded-xl border ${duration === seconds ? 'border-brand-purple bg-brand-purple/15 text-white' : 'border-ink-border text-brand-white/60'}`}>{seconds} saniye</button>)}</div>
            <button onClick={() => start(duration)} className="btn-primary">Sprinti başlat <Zap className="w-4 h-4" /></button>
          </div>
        ) : finished ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-3" />
            <h2 className="text-2xl font-black text-white">Süre doldu!</h2>
            <p className="text-brand-white/50 mt-2">{correct} doğru · {wrong} yanlış</p>
            <div className="text-5xl font-black text-gradient my-5">{score}</div>
            <p className="text-xs text-brand-white/40">En iyi skor: {best ?? score}</p>
            <button onClick={() => start(duration)} className="btn-primary mt-5">Yeniden oyna <RefreshCw className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs uppercase tracking-widest text-brand-white/40">İşlemi çöz</p>
            <div className="text-4xl sm:text-6xl font-black text-white my-8">{question.text} = ?</div>
            <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex gap-2 max-w-sm mx-auto">
              <input ref={inputRef} className="input text-center text-xl" type="number" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Cevabın" autoFocus disabled={answered} />
              <button className="btn-primary" type="submit" disabled={!value.trim() || answered}>Kontrol et</button>
            </form>
            {feedback && <div className={`max-w-sm mx-auto mt-4 rounded-xl p-3 text-sm ${feedback.startsWith('Doğru') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-200'}`}>{feedback}<button onClick={nextQuestion} className="btn-primary w-full mt-3 text-sm">Sonraki işlem</button></div>}
            <div className="mt-5 flex flex-wrap justify-center gap-5 text-sm"><span className="text-emerald-300">Doğru: {correct}</span><span className="text-rose-300">Yanlış: {wrong}</span><span className="text-amber-300">Puan: {score}</span></div>
            <button onClick={() => { setActive(false); setFinished(true); }} className="btn-ghost text-xs mt-5">Oyunu bitir</button>
          </div>
        )}
      </div>
    </GameFrame>
  );
}

function nextTruthFact(): { fact: KnowledgeFact; truth: boolean; statement: string } {
  const fact = pickFreshDiverse(easyKnowledgeFacts, (item) => item.id, (item) => item.category, 'true-false-easy', 1)[0] ?? easyKnowledgeFacts[randomInt(0, easyKnowledgeFacts.length - 1)];
  const truth = Math.random() >= 0.5;
  return { fact, truth, statement: truth ? fact.statement : fact.falseStatement };
}

export function TrueFalseGame() {
  const [current, setCurrent] = useState(nextTruthFact);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [round, setRound] = useState(1);
  const [best, setBest] = useState(() => getBestScore('true-false'));
  const check = (value: boolean) => { if (selected !== null) return; setSelected(value); if (value === current.truth) { const nextScore = score + 10; setScore(nextScore); setBest(saveBestScore('true-false', nextScore)); setCorrect((c) => c + 1); } };
  const next = () => { setCurrent(nextTruthFact()); setSelected(null); setRound((r) => r + 1); };
  return (
    <GameFrame title="Doğru mu Yanlış mı?" description="Bilgileri değerlendir, doğru kararı ver." icon={<CheckCircle2 className="w-5 h-5" />}>
      <div className="card p-5 sm:p-8"><div className="flex justify-between gap-3 mb-6"><span className="chip bg-ink-deep border border-ink-border">{current.fact.category} · Tur {round}</span><span className="chip bg-amber-500/10 border border-amber-500/20 text-amber-300"><Trophy className="w-3 h-3" /> {score} puan</span></div><div className="min-h-40 flex items-center justify-center text-center px-2"><h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">“{current.statement}”</h2></div><p className="text-center text-sm text-brand-white/40 mt-3">Bu bilgi doğru mu?</p><div className="grid grid-cols-2 gap-3 mt-7"><button disabled={selected !== null} onClick={() => check(true)} className={`rounded-2xl p-5 border font-bold transition-all ${selected === true ? current.truth ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-red-500/10 border-red-400 text-red-200' : 'bg-ink-deep border-ink-border text-white hover:border-emerald-400/50'}`}><Check className="w-6 h-6 mx-auto mb-2" />Doğru</button><button disabled={selected !== null} onClick={() => check(false)} className={`rounded-2xl p-5 border font-bold transition-all ${selected === false ? !current.truth ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-red-500/10 border-red-400 text-red-200' : 'bg-ink-deep border-ink-border text-white hover:border-red-400/50'}`}><X className="w-6 h-6 mx-auto mb-2" />Yanlış</button></div>{selected !== null && <div className="mt-5 rounded-xl bg-ink-deep border border-ink-border p-4"><p className={`font-bold text-sm ${selected === current.truth ? 'text-emerald-300' : 'text-red-300'}`}>{selected === current.truth ? 'Doğru cevap!' : 'Bu kez olmadı.'}</p><p className="text-sm text-brand-white/60 mt-1">{current.fact.explanation}</p><button onClick={next} className="btn-primary text-sm mt-4">Sonraki bilgi <ArrowLeft className="w-4 h-4 rotate-180" /></button></div>}<p className="text-center text-xs text-brand-white/35 mt-5">{correct} doğru cevap · En iyi: {best ?? 0} puan · {easyKnowledgeFacts.length} kolay bilgi</p></div>
    </GameFrame>
  );
}

export function WordChainGame() {
  const usableWords = useMemo(() => wordBank.filter((entry) => wordBank.some((candidate) => candidate.word !== entry.word && candidate.word.startsWith([...entry.word][entry.word.length - 1] ?? ''))), []);
  const [currentWord, setCurrentWord] = useState(() => pickFresh(usableWords, (entry) => entry.word, 'word-chain-start')[0]?.word ?? 'KİTAP');
  const [value, setValue] = useState('');
  const [used, setUsed] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBestScore('word-chain'));
  const [seconds, setSeconds] = useState(60);
  const [timed, setTimed] = useState(false);
  useEffect(() => { if (!timed || seconds <= 0) return; const timer = window.setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000); return () => window.clearTimeout(timer); }, [timed, seconds]);
  const normalizedUsed = used.map(normalizeTurkish);
  const submit = () => {
    const word = normalizeTurkish(value);
    if (!word) return;
    if (normalizedUsed.includes(word) || word === normalizeTurkish(currentWord)) { setMessage('Bu kelime zaten kullanıldı.'); return; }
    const entry = wordBank.find((item) => item.word === word);
    if (!entry) { setMessage('Bu turda kelime havuzunda bulunmayan bir sözcük kullanma.'); return; }
    const normalizedCurrent = [...normalizeTurkish(currentWord)];
    const required = normalizedCurrent[normalizedCurrent.length - 1];
    if ([...word][0] !== required) { setMessage(`Kelime ${required} harfiyle başlamalı.`); return; }
    setUsed((old) => [...old, currentWord, word]); setCurrentWord(word); setValue(''); const nextScore = score + word.length * 2; setScore(nextScore); setBest(saveBestScore('word-chain', nextScore)); setMessage('Güzel hamle! Sıra sende.');
  };
  const restart = (useTimer: boolean) => { setUsed([]); setScore(0); setSeconds(60); setTimed(useTimer); setMessage(''); setCurrentWord(pickFresh(usableWords, (entry) => entry.word, 'word-chain-start')[0]?.word ?? 'KİTAP'); setValue(''); };
  return (
    <GameFrame title="Kelime Zinciri" description="Son harfle başlayan yeni bir kelime bul. Sözlükteki Türkçe kelimeleri kullan." icon={<Sparkles className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7"><div className="flex flex-wrap justify-between gap-3"><span className="chip bg-ink-deep border border-ink-border">{timed ? `Kalan süre: ${seconds} sn` : 'Serbest mod'}</span><span className="chip bg-amber-500/10 border border-amber-500/20 text-amber-300"><Trophy className="w-3 h-3" /> {score} puan</span></div><div className="text-center py-9"><p className="text-xs uppercase tracking-widest text-brand-white/40">Sıradaki kelimen</p><div className="text-4xl sm:text-5xl font-black text-gradient mt-3">{currentWord}</div><p className="text-sm text-brand-white/50 mt-3">Şimdi <b className="text-white">{[...currentWord][currentWord.length - 1]}</b> harfiyle başlayan bir kelime yaz.</p></div><form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex gap-2"><input className="input" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Türkçe kelime yaz..." disabled={timed && seconds === 0} /><button className="btn-primary" disabled={!value.trim() || (timed && seconds === 0)}>Gönder</button></form>{message && <p className="text-center text-sm text-brand-white/60 mt-3">{message}</p>}<div className="flex flex-wrap items-center justify-between gap-2 mt-6"><span className="text-xs text-brand-white/35">Kullanılan kelime: {used.length} · Rekor: {best ?? 0}</span><div className="flex gap-2"><button onClick={() => restart(false)} className="btn-ghost text-xs">Serbest başlat</button><button onClick={() => restart(true)} className="btn-primary text-xs">60 sn oyna</button></div></div>{timed && seconds === 0 && <div className="mt-4 text-center text-amber-200">Süre bitti! Toplam puanın: {score}</div>}</div>
    </GameFrame>
  );
}

function createFreshPattern(cellCount: number, count: number, historyKey: string): number[] {
  const storageKey = `sikildim:pattern-history:${historyKey}`;
  let recent: string[] = [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (Array.isArray(parsed)) recent = parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    recent = [];
  }

  let chosen = shuffleArray(Array.from({ length: cellCount }, (_, index) => index)).slice(0, count);
  let signature = [...chosen].sort((a, b) => a - b).join(',');
  for (let attempt = 0; attempt < 30 && recent.includes(signature); attempt++) {
    chosen = shuffleArray(Array.from({ length: cellCount }, (_, index) => index)).slice(0, count);
    signature = [...chosen].sort((a, b) => a - b).join(',');
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify([...recent.filter((item) => item !== signature), signature].slice(-12)));
  } catch {
    // The round remains playable without browser storage.
  }
  return chosen;
}

export function PatternMemoryGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const [level, setLevel] = useState(1);
  const size = difficulty === 'Kolay' ? 3 : difficulty === 'Orta' ? 4 : 5;
  const initialCount = difficulty === 'Kolay' ? 2 : difficulty === 'Orta' ? 3 : 5;
  const [pattern, setPattern] = useState<number[]>(() => createFreshPattern(9, 2, 'kolay'));
  const [picked, setPicked] = useState<number[]>([]);
  const [phase, setPhase] = useState<'show' | 'guess' | 'won' | 'lost'>('show');
  const [mistakes, setMistakes] = useState(0);
  const [best, setBest] = useState(() => getBestScore('pattern-memory'));
  const maxMistakes = difficulty === 'Kolay' ? 1 : difficulty === 'Orta' ? 0 : 0;

  useEffect(() => {
    if (phase !== 'show') return;
    const timer = window.setTimeout(() => setPhase('guess'), difficulty === 'Zor' ? 1500 : 2200);
    return () => window.clearTimeout(timer);
  }, [phase, pattern, difficulty]);

  const newRound = (nextLevel = level + 1) => {
    const nextSize = size * size;
    const maxCount = difficulty === 'Kolay' ? 4 : difficulty === 'Orta' ? 6 : 10;
    const nextCount = Math.min(nextSize - 1, maxCount, initialCount + Math.floor((nextLevel - 1) / 3));
    setLevel(nextLevel);
    setPattern(createFreshPattern(nextSize, nextCount, difficulty.toLocaleLowerCase('tr-TR')));
    setPicked([]);
    setMistakes(0);
    setPhase('show');
  };

  const choose = (index: number) => {
    if (phase !== 'guess' || picked.includes(index)) return;
    if (!pattern.includes(index)) {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      if (nextMistakes > maxMistakes) setPhase('lost');
      return;
    }
    const next = [...picked, index];
    setPicked(next);
    if (next.length === pattern.length) {
      setPhase('won');
      setBest(saveBestScore('pattern-memory', level));
    }
  };

  const restart = () => {
    setLevel(1);
    setMistakes(0);
    setPattern(createFreshPattern(size * size, initialCount, difficulty.toLocaleLowerCase('tr-TR')));
    setPicked([]);
    setPhase('show');
  };

  return (
    <GameFrame title="Desen Hafızası" description="Kısa süre gösterilen kareleri aklında tut ve yeniden seç." icon={<Eye className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <DifficultyPicker value={difficulty} onChange={(levelValue) => {
            setDifficulty(levelValue);
            setLevel(1);
            setPicked([]);
            setMistakes(0);
            const nextSize = levelValue === 'Kolay' ? 3 : levelValue === 'Orta' ? 4 : 5;
            const nextCount = levelValue === 'Kolay' ? 2 : levelValue === 'Orta' ? 3 : 5;
            setPattern(createFreshPattern(nextSize * nextSize, nextCount, levelValue.toLocaleLowerCase('tr-TR')));
            setPhase('show');
          }} />
          <span className="chip bg-ink-deep border border-ink-border">Seviye {level}</span>
        </div>
        <p className="text-center text-sm text-brand-white/55 mb-4">
          {phase === 'show' ? 'Desene dikkatlice bak...' : phase === 'guess' ? 'Şimdi gördüğün kareleri seç.' : phase === 'won' ? 'Harika hafıza!' : 'Bu tur olmadı. Yeniden deneyebilirsin.'}
        </p>
        <div className="grid gap-2 max-w-sm mx-auto" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
          {Array.from({ length: size * size }, (_, index) => {
            const shown = (phase === 'show' && pattern.includes(index)) || picked.includes(index) || (phase === 'lost' && pattern.includes(index));
            return <button key={`${size}-${index}`} disabled={phase !== 'guess'} onClick={() => choose(index)} className={`aspect-square rounded-xl border transition-all ${shown ? 'bg-gradient-to-br from-brand-purple to-brand-blue border-brand-purple/50 shadow-lg shadow-brand-purple/20' : 'bg-ink-deep border-ink-border hover:border-brand-purple/50'}`} aria-label={`Kare ${index + 1}`} />;
          })}
        </div>
        {phase === 'guess' && difficulty === 'Kolay' && <p className="text-center text-xs text-brand-white/40 mt-3">Bir küçük hata hakkın var.</p>}
        {(phase === 'won' || phase === 'lost') && (
          <div className="text-center mt-5">
            <p className={`font-bold ${phase === 'won' ? 'text-emerald-300' : 'text-amber-200'}`}>{phase === 'won' ? 'Seviye tamamlandı!' : 'Desen gösterildi, tekrar deneyebilirsin.'}</p>
            <button onClick={() => phase === 'won' ? newRound() : restart()} className="btn-primary mt-3 text-sm">{phase === 'won' ? 'Sonraki seviye' : 'Yeni desen'} <RefreshCw className="w-4 h-4" /></button>
          </div>
        )}
        <p className="text-center text-xs text-brand-white/35 mt-5">En yüksek seviye: {best ?? 0} · Hata: {mistakes}</p>
      </div>
    </GameFrame>
  );
}

const oddPairs = [['●', '◆'], ['★', '☆'], ['▲', '△'], ['■', '□'], ['♥', '♦'], ['☀', '☼'], ['✚', '✦'], ['⬟', '⬢']];
export function OddOneOutGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBestScore('odd-one-out'));
  const [pair, setPair] = useState(() => pickFresh(oddPairs, (value) => value.join(':'), 'odd-one-out-shapes')[0] ?? shuffleArray(oddPairs)[0]);
  const [oddIndex, setOddIndex] = useState(() => randomInt(0, 15));
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);
  const [timed, setTimed] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [duration, setDuration] = useState(30);
  const [seconds, setSeconds] = useState(30);
  const size = difficulty === 'Kolay' ? 4 : difficulty === 'Orta' ? 5 : 6;

  useEffect(() => {
    if (!timerOn) return;
    if (seconds <= 0) { setTimerOn(false); setFinished(true); setBest(saveBestScore('odd-one-out', score)); return; }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timerOn, seconds, score]);

  const createBoard = (level: 'Kolay' | 'Orta' | 'Zor') => {
    const selected = pickFresh(oddPairs, (pair) => pair.join(':'), 'odd-one-out-shapes')[0] ?? shuffleArray(oddPairs)[0];
    const boardSize = level === 'Kolay' ? 4 : level === 'Orta' ? 5 : 6;
    setPair(selected);
    setOddIndex(randomInt(0, boardSize * boardSize - 1));
    setFeedback('');
  };
  const nextRound = () => { createBoard(difficulty); setRound((value) => value + 1); };
  const startAgain = (level = difficulty) => {
    setDifficulty(level); setRound(1); setScore(0); setFinished(false); setTimerOn(false); setTimed(false); setDuration(30); setSeconds(30); createBoard(level);
  };
  const startTimed = (duration: number) => {
    startAgain(difficulty); setTimed(true); setDuration(duration); setSeconds(duration); setTimerOn(true);
  };
  const choose = (index: number) => {
    if (feedback || finished) return;
    if (index === oddIndex) { const nextScore = score + (difficulty === 'Kolay' ? 5 : difficulty === 'Orta' ? 10 : 15); setScore(nextScore); setBest(saveBestScore('odd-one-out', nextScore)); setFeedback('Buldun!'); }
    else setFeedback('Bu değil. Farklı şekli ara.');
  };
  return (
    <GameFrame title="Farklı Olanı Bul" description="Şekiller arasındaki tek farklı sembolü yakala." icon={<Target className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><DifficultyPicker value={difficulty} onChange={startAgain} /><span className="chip bg-amber-500/10 text-amber-300 border border-amber-500/20"><Trophy className="w-3 h-3" /> {score} puan</span></div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5"><div className="flex gap-2"><button onClick={() => startAgain()} className="btn-ghost text-xs">Serbest</button><button onClick={() => startTimed(30)} className="btn-ghost text-xs">30 sn</button><button onClick={() => startTimed(60)} className="btn-ghost text-xs">60 sn</button></div><span className="chip bg-ink-deep border border-ink-border">{timed ? `Kalan süre: ${seconds} sn` : 'Serbest mod'}</span></div>
        {finished ? <div className="text-center py-8"><Trophy className="w-12 h-12 text-amber-300 mx-auto mb-3"/><h2 className="text-2xl font-black text-white">Süre tamamlandı!</h2><p className="text-brand-white/50 mt-2">{round - 1} tur · {score} puan</p><button onClick={() => startTimed(duration)} className="btn-primary mt-5">Yeniden oyna ({duration} sn)</button></div> : <><div className="text-center mb-5"><p className="text-xs text-brand-white/40">Tur {round} · Farklı olanı seç</p><div className="grid gap-2 max-w-md mx-auto mt-4" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>{Array.from({ length: size * size }, (_, index) => <button key={`${round}-${index}`} onClick={() => choose(index)} disabled={Boolean(feedback)} className="aspect-square rounded-xl bg-ink-deep border border-ink-border hover:border-brand-purple/60 text-2xl sm:text-3xl text-white transition-colors">{index === oddIndex ? pair[1] : pair[0]}</button>)}</div></div>{feedback && <div className="text-center"><p className={`text-sm font-semibold ${feedback === 'Buldun!' ? 'text-emerald-300' : 'text-amber-200'}`}>{feedback}</p><button onClick={nextRound} className="btn-primary text-sm mt-3">Sonraki tur</button></div>}</>}
        <div className="flex justify-between mt-5 text-xs text-brand-white/35"><span>En iyi puan: {best ?? 0}</span><span>Tahta: {size} × {size}</span></div>
      </div>
    </GameFrame>
  );
}

const colorOptions = [
  { name: 'Kırmızı', value: '#ef4444' }, { name: 'Mavi', value: '#3b82f6' }, { name: 'Yeşil', value: '#22c55e' }, { name: 'Sarı', value: '#eab308' }, { name: 'Mor', value: '#a855f7' }, { name: 'Turuncu', value: '#f97316' },
];
type ColorPrompt = { wordColor: number; inkColor: number; mode: 'ink' | 'word'; options: number[] };
function makeColorPrompt(wordColor: number, inkColor: number, mode: 'ink' | 'word'): ColorPrompt {
  const expected = mode === 'ink' ? inkColor : wordColor;
  const alternatives = shuffleArray(colorOptions.map((_, index) => index).filter((index) => index !== expected)).slice(0, 3);
  return { wordColor, inkColor, mode, options: shuffleArray([expected, ...alternatives]) };
}
function createColorPrompt(): ColorPrompt {
  const wordColor = randomInt(0, colorOptions.length - 1);
  let inkColor = randomInt(0, colorOptions.length - 1);
  while (inkColor === wordColor) inkColor = randomInt(0, colorOptions.length - 1);
  return makeColorPrompt(wordColor, inkColor, Math.random() > 0.5 ? 'ink' : 'word');
}
function createColorSession(): ColorPrompt[] {
  const prompts: ColorPrompt[] = [];
  for (let word = 0; word < colorOptions.length; word++) {
    for (let ink = 0; ink < colorOptions.length; ink++) {
      if (word === ink) continue;
      prompts.push(makeColorPrompt(word, ink, 'ink'));
      prompts.push(makeColorPrompt(word, ink, 'word'));
    }
  }
  return pickFreshDiverse(prompts, (prompt) => `${prompt.wordColor}-${prompt.inkColor}-${prompt.mode}`, (prompt) => prompt.mode, 'color-attention-prompts', 12);
}
export function ColorAttentionGame() {
  const [prompts, setPrompts] = useState<ColorPrompt[]>(createColorSession);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(() => getBestScore('color-attention'));
  const prompt = prompts[round - 1] ?? createColorPrompt();
  const { wordColor, inkColor, mode } = prompt;
  const answer = (colorIndex: number) => {
    if (feedback || finished) return;
    const expected = mode === 'ink' ? inkColor : wordColor;
    if (colorIndex === expected) { setScore((value) => value + 10); setCorrect((value) => value + 1); setFeedback('Doğru!'); }
    else setFeedback(`Doğru cevap: ${colorOptions[expected].name}`);
  };
  const next = () => {
    if (round >= prompts.length) { setFinished(true); setBest(saveBestScore('color-attention', score)); return; }
    setRound((value) => value + 1);
    setFeedback('');
  };
  const restart = () => { setPrompts(createColorSession()); setRound(1); setScore(0); setCorrect(0); setFinished(false); setFeedback(''); };
  return (
    <GameFrame title="Renk ve Dikkat" description="İstenen rengi dört seçenek arasından bul." icon={<Zap className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <span className="chip bg-ink-deep border border-ink-border">Tur {round}/{prompts.length}</span>
          <span className="chip bg-amber-500/10 border border-amber-500/20 text-amber-300"><Trophy className="w-3 h-3" /> {score} puan</span>
        </div>
        {finished ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-black text-white">Dikkat testi tamamlandı</h2>
            <div className="text-5xl font-black text-gradient my-5">{score}</div>
            <p className="text-sm text-brand-white/50">12 turda {correct} doğru cevap</p>
            <button onClick={restart} className="btn-primary mt-5">Yeni tur setiyle oyna</button>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-brand-white/55">{mode === 'ink' ? 'Yazının rengini seç.' : 'Kelimenin söylediği rengi seç.'}</p>
            <div className="py-9 text-center">
              <span className="text-4xl sm:text-6xl font-black" style={{ color: colorOptions[inkColor].value }}>{colorOptions[wordColor].name.toLocaleUpperCase('tr-TR')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
              {prompt.options.map((colorIndex) => {
                const color = colorOptions[colorIndex];
                return (
                  <button key={color.name} onClick={() => answer(colorIndex)} disabled={Boolean(feedback)} className="min-h-12 py-3 rounded-xl border border-ink-border bg-ink-deep hover:border-brand-purple/40 flex items-center justify-center gap-2 text-sm font-semibold text-white transition-colors">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.value }} />{color.name}
                  </button>
                );
              })}
            </div>
            {feedback && <div className="text-center mt-5"><p className="text-sm text-brand-white/70">{feedback}</p><button onClick={next} className="btn-primary text-sm mt-3">{round === prompts.length ? 'Sonucu gör' : 'Sonraki tur'}</button></div>}
          </>
        )}
        <p className="text-center text-xs text-brand-white/35 mt-5">En iyi puan: {best ?? 0}</p>
      </div>
    </GameFrame>
  );
}

function createSecretCode(length: number): string[] {
  return shuffleArray([...Array(10)].map((_, index) => String(index))).slice(0, length);
}

export function CodeBreakerGame() {
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay');
  const codeLength = difficulty === 'Kolay' ? 3 : difficulty === 'Orta' ? 4 : 5;
  const maxAttempts = difficulty === 'Kolay' ? 10 : difficulty === 'Orta' ? 8 : 7;
  const [secret, setSecret] = useState<string[]>(() => createSecretCode(3));
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<{ value: string; exact: number; misplaced: number }[]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [best, setBest] = useState(() => getBestScore('code-breaker', true));
  const submit = () => {
    const digits = [...guess];
    if (digits.length !== codeLength || new Set(digits).size !== codeLength || digits.some((digit) => !/\d/.test(digit))) return;
    const exact = digits.filter((digit, index) => digit === secret[index]).length;
    const misplaced = digits.filter((digit, index) => secret.includes(digit) && digit !== secret[index]).length;
    const nextAttempts = [...attempts, { value: guess, exact, misplaced }];
    setAttempts(nextAttempts);
    setGuess('');
    if (exact === codeLength) {
      setStatus('won');
      setBest(saveBestScore('code-breaker', nextAttempts.length, true));
    } else if (nextAttempts.length >= maxAttempts) {
      setStatus('lost');
    }
  };
  const restart = (level = difficulty) => {
    const length = level === 'Kolay' ? 3 : level === 'Orta' ? 4 : 5;
    setDifficulty(level);
    setSecret(createSecretCode(length));
    setGuess('');
    setAttempts([]);
    setStatus('playing');
  };
  return (
    <GameFrame title="Kod Kırıcı" description="Gizli rakam dizisini ipuçlarını kullanarak çöz." icon={<LockKeyhole className="w-5 h-5" />}>
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap justify-between gap-3 mb-5"><DifficultyPicker value={difficulty} onChange={restart} /><span className="chip bg-ink-deep border border-ink-border">{maxAttempts - attempts.length} deneme kaldı</span></div>
        <div className="flex justify-end mb-4"><span className="chip bg-ink-deep border border-ink-border"><Trophy className="w-3 h-3 text-amber-300" /> En iyi: {best ?? '—'} deneme</span></div>
        <div className="rounded-xl border border-ink-border bg-ink-deep/70 p-3 mb-5 text-sm text-brand-white/65"><p className="font-semibold text-white mb-1">Nasıl oynanır?</p><p>Kod, birbirinden farklı {codeLength} rakamdan oluşur. Yeşil ipucu doğru rakamın doğru yerde olduğunu, sarı ipucu rakamın kodda bulunduğunu ama yerinin yanlış olduğunu gösterir.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex gap-2 max-w-sm mx-auto"><input className="input text-center text-2xl tracking-[0.4em]" value={guess} onChange={(event) => setGuess(event.target.value.replace(/\D/g, '').slice(0, codeLength))} inputMode="numeric" placeholder={'•'.repeat(codeLength)} maxLength={codeLength} disabled={status !== 'playing'} /><button className="btn-primary" disabled={guess.length !== codeLength || new Set(guess).size !== codeLength || status !== 'playing'}>Dene</button></form>
        <div className="space-y-2 mt-6">{attempts.map((attempt, index) => <div key={`${attempt.value}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-ink-deep border border-ink-border px-4 py-3"><div><span className="text-xs text-brand-white/35 mr-3">#{index + 1}</span><span className="font-mono text-lg tracking-[0.3em] text-white">{attempt.value}</span></div><div className="text-xs flex flex-wrap gap-3"><span className="text-emerald-300">{attempt.exact} doğru yer</span><span className="text-amber-300">{attempt.misplaced} yanlış yer</span></div></div>)}</div>
        {status !== 'playing' && <div className="mt-5 text-center"><h2 className="text-xl font-bold text-white">{status === 'won' ? 'Kodu kırdın!' : 'Denemeler bitti'}</h2><p className="text-sm text-brand-white/50 mt-1">Gizli kod: <b className="text-white tracking-widest">{secret.join('')}</b></p><button onClick={() => restart()} className="btn-primary mt-4">Yeni kod oluştur <RefreshCw className="w-4 h-4" /></button></div>}
      </div>
    </GameFrame>
  );
}

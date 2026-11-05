import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight, ArrowUp, Brain, Grid3X3, Lightbulb, RefreshCw, Trophy, Zap, Hand, Scissors, Target, ListOrdered, CheckCircle2, Timer, Sparkles, Bomb, Move, Users, Puzzle, Flag, RotateCw } from 'lucide-react';
import { wordBank } from '@/data/gameData';
import { getBestScore, normalizeTurkish, pickFresh, randomInt, saveBestScore, shuffleArray } from '@/data/gameUtils';

type FrameProps = { title: string; description: string; icon: ReactNode; children: ReactNode };
export function ArcadeFrame({ title, description, icon, children }: FrameProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-fade-in">
      <header className="arcade-panel flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="arcade-icon">{icon}</div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand-purple">SIKILDIM! / ARCADE</p>
            <h1 className="truncate text-xl font-black text-white sm:text-2xl">{title}</h1>
            <p className="mt-1 text-xs text-brand-white/55 sm:text-sm">{description}</p>
          </div>
        </div>
        <Link to="/oyunlar" className="btn-ghost shrink-0 px-3 py-2 text-xs"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Oyunlar</span><span className="sm:hidden">Geri</span></Link>
      </header>
      {children}
    </div>
  );
}

const blankBoard = () => Array.from({ length: 4 }, () => Array(4).fill(0) as number[]);
function spawnTile(board: number[][]): number[][] {
  const next = board.map((row) => [...row]);
  const empty: Array<[number, number]> = [];
  next.forEach((row, r) => row.forEach((value, c) => { if (!value) empty.push([r, c]); }));
  if (!empty.length) return next;
  const [r, c] = empty[randomInt(0, empty.length - 1)];
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}
function mergeLine(line: number[]): { line: number[]; gained: number } {
  const compact = line.filter(Boolean);
  const result: number[] = [];
  let gained = 0;
  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      const merged = compact[i] * 2;
      result.push(merged);
      gained += merged;
      i++;
    } else result.push(compact[i]);
  }
  while (result.length < 4) result.push(0);
  return { line: result, gained };
}
function move2048(board: number[][], direction: 'left' | 'right' | 'up' | 'down') {
  const rotated = direction === 'up' || direction === 'down';
  const rows = rotated ? board[0].map((_, c) => board.map((row) => row[c])) : board.map((row) => [...row]);
  let gained = 0;
  const moved = rows.map((row) => {
    const source = direction === 'right' || direction === 'down' ? [...row].reverse() : row;
    const result = mergeLine(source);
    gained += result.gained;
    return direction === 'right' || direction === 'down' ? result.line.reverse() : result.line;
  });
  const next = rotated ? board.map((_, r) => moved.map((row) => row[r])) : moved;
  return { board: next, gained, changed: next.some((row, r) => row.some((value, c) => value !== board[r][c])) };
}
function has2048Moves(board: number[][]) {
  if (board.some((row) => row.includes(0))) return true;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (r < 3 && board[r][c] === board[r + 1][c]) return true;
    if (c < 3 && board[r][c] === board[r][c + 1]) return true;
  }
  return false;
}

export function Game2048() {
  const [board, setBoard] = useState<number[][]>(() => spawnTile(spawnTile(blankBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBestScore('arcade-2048') ?? 0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const reset = () => { setBoard(spawnTile(spawnTile(blankBoard()))); setScore(0); setWon(false); setOver(false); };
  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (over) return;
    setBoard((current) => {
      const result = move2048(current, direction);
      if (!result.changed) return current;
      const next = spawnTile(result.board);
      setScore((old) => {
        const total = old + result.gained;
        setBest(saveBestScore('arcade-2048', total));
        return total;
      });
      if (!won && next.some((row) => row.includes(2048))) setWon(true);
      if (!has2048Moves(next)) setOver(true);
      return next;
    });
  }, [over, won]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      const direction = map[event.key];
      if (direction) { event.preventDefault(); move(direction); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);
  const tileClass = (value: number) => value === 0 ? 'bg-[#182232]' : value <= 4 ? 'bg-[#334155] text-white' : value <= 16 ? 'bg-[#486174] text-white' : value <= 64 ? 'bg-[#6D8C6A] text-white' : value <= 256 ? 'bg-[#93A957] text-[#10170D]' : 'bg-[#C3E66B] text-[#11180A]';
  return <ArcadeFrame title="2048" description="Aynı sayıları birleştir, 2048'e ulaş. Ok tuşlarıyla veya ekrandaki düğmelerle oyna." icon={<Grid3X3 className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><span className="arcade-stat">Puan <b>{score}</b></span><span className="arcade-stat">Rekor <b>{best}</b></span></div><button onClick={reset} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Yeniden başla</button></div>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-[#0A111C] p-2 sm:gap-3 sm:p-3">
        {board.flatMap((row, r) => row.map((value, c) => <div key={`${r}-${c}`} className={`flex aspect-square items-center justify-center rounded-xl text-xl font-black transition-colors sm:text-2xl ${tileClass(value)}`}>{value || ''}</div>))}
      </div>
      <div className="mx-auto mt-4 grid w-40 grid-cols-3 gap-2">
        <span/><button onClick={() => move('up')} className="arcade-control" aria-label="Yukarı"><ArrowUp/></button><span/>
        <button onClick={() => move('left')} className="arcade-control" aria-label="Sola"><ArrowLeftIcon/></button><button onClick={() => move('down')} className="arcade-control" aria-label="Aşağı"><ArrowDown/></button><button onClick={() => move('right')} className="arcade-control" aria-label="Sağa"><ArrowRight/></button>
      </div>
      {(won || over) && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><p className="font-bold text-white">{won ? '2048! Hedefe ulaştın.' : 'Hamle kalmadı.'}</p><p className="mt-1 text-sm text-brand-white/60">Toplam puanın: {score}</p><button onClick={reset} className="btn-primary mt-3">Yeni oyun</button></div>}
    </div>
  </ArcadeFrame>;
}

const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
type Mark = 'X' | 'O' | null;
function xoxWinner(board: Mark[]): Mark { for (const [a,b,c] of winningLines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; return null; }
function minimax(board: Mark[], isMax: boolean): number {
  const winner = xoxWinner(board);
  if (winner === 'X') return 10;
  if (winner === 'O') return -10;
  if (board.every(Boolean)) return 0;
  const scores = board.map((cell, index) => {
    if (cell) return null;
    const next = [...board]; next[index] = isMax ? 'X' : 'O';
    return minimax(next, !isMax);
  }).filter((score): score is number => score !== null);
  return isMax ? Math.max(...scores) : Math.min(...scores);
}
function computerMove(board: Mark[]) {
  let bestScore = Infinity; let bestIndex = -1;
  board.forEach((cell, index) => { if (cell) return; const next = [...board]; next[index] = 'O'; const score = minimax(next, true); if (score < bestScore) { bestScore = score; bestIndex = index; } });
  return bestIndex;
}
export function TicTacToeGame() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'human' | 'cpu'>('human');
  const [best, setBest] = useState(() => getBestScore('xox-wins') ?? 0);
  const winner = xoxWinner(board);
  const draw = !winner && board.every(Boolean);
  useEffect(() => {
    if (turn !== 'cpu' || winner || draw) return;
    const timer = window.setTimeout(() => {
      const index = computerMove(board);
      if (index >= 0) { const next = [...board]; next[index] = 'O'; setBoard(next); setTurn('human'); }
    }, 420);
    return () => window.clearTimeout(timer);
  }, [turn, board, winner, draw]);
  const play = (index: number) => { if (board[index] || turn !== 'human' || winner || draw) return; const next = [...board]; next[index] = 'X'; setBoard(next); setTurn('cpu'); };
  const reset = () => { setBoard(Array(9).fill(null)); setTurn('human'); };
  useEffect(() => { if (winner === 'X') setBest(saveBestScore('xox-wins', best + 1)); }, [winner]);
  return <ArcadeFrame title="XOX" description="Bilgisayara karşı üç sembolü yan yana getir. Bilgisayar da boş durmayacak." icon={<Zap className="h-6 w-6"/>}>
    <div className="arcade-panel p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between"><span className="arcade-stat">Sen <b className="text-brand-purple">X</b></span><span className="arcade-stat">Rekor <b>{best} galibiyet</b></span><span className="arcade-stat">Bilgisayar <b className="text-sky-300">O</b></span></div>
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-2 sm:gap-3">{board.map((cell, index) => <button key={index} onClick={() => play(index)} disabled={Boolean(cell) || turn !== 'human' || Boolean(winner) || draw} className="aspect-square rounded-2xl border border-white/10 bg-[#111B29] text-4xl font-black transition hover:border-brand-purple/50 disabled:cursor-default sm:text-5xl"><span className={cell === 'X' ? 'text-brand-purple' : 'text-sky-300'}>{cell}</span></button>)}</div>
      <p className="mt-5 text-center text-sm text-brand-white/65">{winner ? (winner === 'X' ? 'Kazandın! Güzel hamle.' : 'Bilgisayar bu turu aldı.') : draw ? 'Berabere! Bir tur daha?' : turn === 'cpu' ? 'Bilgisayar düşünüyor…' : 'Sıra sende. Bir kare seç.'}</p>
      {(winner || draw) && <div className="mt-4 text-center"><button onClick={reset} className="btn-primary"><RefreshCw className="h-4 w-4"/> Tekrar oyna</button></div>}
    </div>
  </ArcadeFrame>;
}

type WordCell = { letter: string; row: number; col: number };
type WordSearchState = { grid: WordCell[][]; words: string[]; paths: Record<string, string[]> };
const turkishLetters = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'];
function makeWordSearch(): WordSearchState {
  const size = 10;
  const grid = Array.from({ length: size }, () => Array(size).fill('') as string[]);
  const chosen = pickFresh(wordBank.filter((entry) => entry.word.length >= 4 && entry.word.length <= 8), (entry) => entry.word, 'word-search-bank', 5);
  const paths: Record<string, string[]> = {};
  const directions = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]] as const;
  for (const entry of chosen) {
    const word = normalizeTurkish(entry.word).replace(/\s/g, '');
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const [dr, dc] = directions[randomInt(0, directions.length - 1)];
      const startR = randomInt(0, size - 1); const startC = randomInt(0, size - 1);
      const endR = startR + dr * (word.length - 1); const endC = startC + dc * (word.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
      const coords = [...word].map((_, i) => [startR + dr * i, startC + dc * i] as const);
      if (coords.some(([r,c], i) => grid[r][c] && grid[r][c] !== word[i])) continue;
      const ids: string[] = [];
      coords.forEach(([r,c], i) => { grid[r][c] = word[i]; ids.push(`${r}-${c}`); });
      paths[word] = ids; placed = true;
    }
  }
  const words = Object.keys(paths);
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = turkishLetters[randomInt(0, turkishLetters.length - 1)];
  return { grid: grid.map((row, r) => row.map((letter, c) => ({ letter, row: r, col: c }))), words, paths };
}
function cellsBetween(start: WordCell, end: WordCell): string[] {
  const dr = end.row - start.row; const dc = end.col - start.col;
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return [];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps > 8) return [];
  const stepR = steps ? Math.sign(dr) : 0; const stepC = steps ? Math.sign(dc) : 0;
  return Array.from({ length: steps + 1 }, (_, index) => `${start.row + stepR * index}-${start.col + stepC * index}`);
}
export function WordSearchGame() {
  const [game, setGame] = useState<WordSearchState>(makeWordSearch);
  const [first, setFirst] = useState<WordCell | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('Bir kelimenin ilk ve son harfine dokun.');
  const selectedPath = useMemo(() => first ? [ `${first.row}-${first.col}` ] : [], [first]);
  const foundCells = useMemo(() => new Set(found.flatMap((word) => game.paths[word] ?? [])), [found, game]);
  const restart = () => { setGame(makeWordSearch()); setFirst(null); setFound([]); setFeedback('Yeni harf tablosu hazır.'); };
  const choose = (cell: WordCell) => {
    if (!first) { setFirst(cell); setFeedback('Şimdi kelimenin son harfine dokun.'); return; }
    const path = cellsBetween(first, cell);
    const value = path.map((id) => { const [r,c] = id.split('-').map(Number); return game.grid[r][c].letter; }).join('');
    const candidate = game.words.find((word) => word === value || [...word].reverse().join('') === value);
    if (candidate && !found.includes(candidate)) { setFound((items) => [...items, candidate]); setFeedback(`${candidate} bulundu!`); }
    else if (path.length === 1) setFeedback('Bitiş harfi seçmek için başka bir kareye dokun.');
    else setFeedback('Bu iki harf arasında listelenen bir kelime yok. Tekrar dene.');
    setFirst(null);
  };
  return <ArcadeFrame title="Kelime Avı" description="Harf tablosunun içine gizlenmiş kelimeleri bul. Yatay, dikey ve çapraz ilerleyebilirsin." icon={<SearchIcon/>}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-brand-white/50">Bulunan kelimeler</p><p className="text-xl font-black text-white">{found.length}<span className="text-sm font-medium text-brand-white/40"> / {game.words.length}</span></p></div><button onClick={restart} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Yeni tablo</button></div>
      <div className="mx-auto grid max-w-[520px] grid-cols-10 gap-1 rounded-xl border border-white/10 bg-[#0A111C] p-2 sm:gap-1.5 sm:p-3">{game.grid.flat().map((cell) => { const id = `${cell.row}-${cell.col}`; const active = selectedPath.includes(id); const done = foundCells.has(id); return <button key={id} onClick={() => choose(cell)} className={`aspect-square rounded-md text-xs font-black sm:text-sm ${done ? 'bg-brand-purple text-[#0B1118]' : active ? 'bg-sky-400 text-[#07111A]' : 'bg-[#172333] text-white hover:bg-[#24364A]'}`}>{cell.letter}</button>; })}</div>
      <div className="mt-4 flex flex-wrap gap-2">{game.words.map((word) => <span key={word} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${found.includes(word) ? 'border-brand-purple/40 bg-brand-purple/10 text-brand-purple line-through' : 'border-white/10 bg-[#101A28] text-brand-white/65'}`}>{word}</span>)}</div>
      <p className="mt-4 text-center text-sm text-brand-white/60">{feedback}</p>
      {found.length === game.words.length && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><p className="font-bold text-white">Hepsini buldun!</p><button onClick={restart} className="btn-primary mt-3">Yeni tablo oluştur</button></div>}
    </div>
  </ArcadeFrame>;
}
function SearchIcon() { return <Lightbulb className="h-6 w-6"/>; }

function generateMaze(size = 11) {
  const maze = Array.from({ length: size }, () => Array(size).fill(true) as boolean[]);
  const visit = (r: number, c: number) => {
    maze[r][c] = false;
    const directions = shuffleArray([[0,2],[0,-2],[2,0],[-2,0]] as const);
    for (const [dr, dc] of directions) {
      const nr = r + dr; const nc = c + dc;
      if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && maze[nr][nc]) {
        maze[r + dr / 2][c + dc / 2] = false;
        visit(nr, nc);
      }
    }
  };
  visit(1, 1);
  maze[1][1] = false; maze[size - 2][size - 2] = false;
  return maze;
}
export function MiniMazeGame() {
  const [maze, setMaze] = useState(() => generateMaze());
  const [player, setPlayer] = useState({ row: 1, col: 1 });
  const [steps, setSteps] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => getBestScore('mini-maze', true));
  const size = maze.length;
  const move = useCallback((dr: number, dc: number) => {
    if (won) return;
    const row = player.row + dr;
    const col = player.col + dc;
    if (row < 0 || col < 0 || row >= size || col >= size || maze[row][col]) return;
    const nextSteps = steps + 1;
    setPlayer({ row, col });
    setSteps(nextSteps);
    if (row === size - 2 && col === size - 2) {
      setWon(true);
      setBest(saveBestScore('mini-maze', nextSteps, true));
    }
  }, [maze, player, size, steps, won]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { const map: Record<string, [number,number]> = { ArrowUp: [-1,0], w: [-1,0], ArrowDown: [1,0], s: [1,0], ArrowLeft: [0,-1], a: [0,-1], ArrowRight: [0,1], d: [0,1] }; const direction = map[event.key]; if (direction) { event.preventDefault(); move(direction[0], direction[1]); } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [move]);
  const reset = () => { setMaze(generateMaze()); setPlayer({ row: 1, col: 1 }); setSteps(0); setWon(false); };
  return <ArcadeFrame title="Mini Labirent" description="Çıkışa ulaş. Klavyedeki yön tuşlarını veya dokunmatik kontrolleri kullan." icon={<Grid3X3 className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap justify-between gap-3"><span className="arcade-stat">Adım <b>{steps}</b></span><span className="arcade-stat">En iyi <b>{best ?? '—'}</b></span><button onClick={reset} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Yeni labirent</button></div>
      <div className="mx-auto grid max-w-[440px] grid-cols-11 gap-1 rounded-xl border border-white/10 bg-[#080E16] p-2">{maze.flatMap((row, r) => row.map((wall, c) => { const isPlayer = player.row === r && player.col === c; const isGoal = r === size - 2 && c === size - 2; return <div key={`${r}-${c}`} className={`aspect-square rounded-[3px] ${isPlayer ? 'bg-brand-purple shadow-[0_0_12px_rgba(163,230,53,.45)]' : isGoal ? 'bg-sky-400' : wall ? 'bg-[#263447]' : 'bg-[#101A27]'}`} />; }))}</div>
      <div className="mx-auto mt-4 grid w-36 grid-cols-3 gap-2"><span/><button className="arcade-control" onClick={() => move(-1,0)} aria-label="Yukarı"><ArrowUp/></button><span/><button className="arcade-control" onClick={() => move(0,-1)} aria-label="Sola"><ArrowLeft/></button><button className="arcade-control" onClick={() => move(1,0)} aria-label="Aşağı"><ArrowDown/></button><button className="arcade-control" onClick={() => move(0,1)} aria-label="Sağa"><ArrowRight/></button></div>
      {won && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><p className="font-bold text-white">Çıkışı buldun!</p><p className="mt-1 text-sm text-brand-white/60">{steps} adımda tamamladın.</p><button onClick={reset} className="btn-primary mt-3">Yeni labirent</button></div>}
    </div>
  </ArcadeFrame>;
}

export function SimonSequenceGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [showIndex, setShowIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'lost'>('idle');
  const [lit, setLit] = useState(-1);
  const [best, setBest] = useState(() => getBestScore('simon-sequence') ?? 0);
  useEffect(() => {
    if (phase !== 'showing' || !sequence.length) return;
    setLit(sequence[showIndex]);
    const off = window.setTimeout(() => setLit(-1), 420);
    const next = window.setTimeout(() => { if (showIndex + 1 < sequence.length) setShowIndex((value) => value + 1); else { setInputIndex(0); setPhase('input'); } }, 720);
    return () => { window.clearTimeout(off); window.clearTimeout(next); };
  }, [phase, sequence, showIndex]);
  const begin = () => { const start = [randomInt(0, 3)]; setSequence(start); setShowIndex(0); setInputIndex(0); setLit(-1); setPhase('showing'); };
  const nextRound = () => { const next = [...sequence, randomInt(0, 3)]; setSequence(next); setShowIndex(0); setInputIndex(0); setPhase('showing'); };
  const tap = (index: number) => { if (phase !== 'input') return; if (sequence[inputIndex] !== index) { setPhase('lost'); setBest(saveBestScore('simon-sequence', sequence.length - 1)); return; } if (inputIndex + 1 === sequence.length) { setBest(saveBestScore('simon-sequence', sequence.length)); setPhase('idle'); } else setInputIndex((value) => value + 1); };
  const pads = ['#A3E635', '#38BDF8', '#FBBF24', '#F472B6'];
  return <ArcadeFrame title="Sıra Sende" description="Işıkların sırasını aklında tut ve aynı sırayla dokun. Her turda bir adım daha eklenir." icon={<Brain className="h-6 w-6"/>}>
    <div className="arcade-panel p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><span className="arcade-stat">Seviye <b>{sequence.length}</b></span><span className="arcade-stat">Rekor <b>{best}</b></span></div>
      <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">{pads.map((color, index) => <button key={index} onClick={() => tap(index)} disabled={phase !== 'input'} className={`aspect-square rounded-3xl border-2 transition-all ${lit === index ? 'scale-[1.03] brightness-125 shadow-[0_0_25px_rgba(255,255,255,.16)]' : 'opacity-75'} disabled:cursor-default`} style={{ backgroundColor: color, borderColor: lit === index ? '#fff' : 'rgba(255,255,255,.12)' }} aria-label={`Renk ${index + 1}`}/>)}</div>
      <p className="mt-5 text-center text-sm text-brand-white/65">{phase === 'idle' ? (sequence.length ? 'Güzel! Sıradaki seviyeye geç.' : 'Hazırsan oyunu başlat.') : phase === 'showing' ? 'Sırayı izle…' : phase === 'input' ? `Sıra sende: ${inputIndex + 1} / ${sequence.length}` : `Tur bitti. ${sequence.length - 1} seviyeye ulaştın.`}</p>
      <div className="mt-4 text-center">{phase === 'idle' && <button onClick={sequence.length ? nextRound : begin} className="btn-primary">{sequence.length ? 'Sonraki seviye' : 'Başla'}</button>}{phase === 'lost' && <button onClick={begin} className="btn-primary"><RefreshCw className="h-4 w-4"/> Tekrar dene</button>}</div>
    </div>
  </ArcadeFrame>;
}

// Taş-Kâğıt-Makas: kısa seriler halinde oynanır.
type RpsChoice = 'taş' | 'kâğıt' | 'makas';
const rpsChoices: Array<{ value: RpsChoice; emoji: string; label: string }> = [
  { value: 'taş', emoji: '✊', label: 'Taş' },
  { value: 'kâğıt', emoji: '✋', label: 'Kâğıt' },
  { value: 'makas', emoji: '✌️', label: 'Makas' },
];
function rpsResult(player: RpsChoice, cpu: RpsChoice): 'win' | 'lose' | 'draw' {
  if (player === cpu) return 'draw';
  return (player === 'taş' && cpu === 'makas') || (player === 'kâğıt' && cpu === 'taş') || (player === 'makas' && cpu === 'kâğıt') ? 'win' : 'lose';
}
export function RockPaperScissorsGame() {
  const [round, setRound] = useState(1);
  const [player, setPlayer] = useState<RpsChoice | null>(null);
  const [cpu, setCpu] = useState<RpsChoice | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const [history, setHistory] = useState<string[]>([]);
  const result = player && cpu ? rpsResult(player, cpu) : null;
  const choose = (choice: RpsChoice) => {
    if (player || round > 5) return;
    const computer = rpsChoices[randomInt(0, 2)].value;
    const outcome = rpsResult(choice, computer);
    setPlayer(choice);
    setCpu(computer);
    setScore((current) => ({ ...current, [outcome]: current[outcome] + 1 }));
    setHistory((items) => [...items, outcome]);
  };
  const next = () => { setRound((value) => value + 1); setPlayer(null); setCpu(null); };
  const reset = () => { setRound(1); setPlayer(null); setCpu(null); setScore({ win: 0, lose: 0, draw: 0 }); setHistory([]); };
  const finished = round > 5;
  return <ArcadeFrame title="Taş, Kâğıt, Makas" description="Bilgisayara karşı beş turluk mini maç yap. Her turda seçimini değiştir." icon={<Hand className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-5 grid grid-cols-3 gap-2"><div className="arcade-stat-card text-center"><p className="text-2xl font-black text-brand-purple">{score.win}</p><p className="text-xs text-brand-white/50">Kazandın</p></div><div className="arcade-stat-card text-center"><p className="text-2xl font-black text-white">{score.draw}</p><p className="text-xs text-brand-white/50">Berabere</p></div><div className="arcade-stat-card text-center"><p className="text-2xl font-black text-sky-300">{score.lose}</p><p className="text-xs text-brand-white/50">Bilgisayar</p></div></div>
      {!finished ? <><div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold text-white">Tur {round} / 5</span><div className="flex gap-1">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`h-2 w-7 rounded-full ${i < round ? 'bg-brand-purple' : 'bg-white/10'}`}/>)}</div></div>
      <div className="grid grid-cols-3 gap-2">{rpsChoices.map((choice) => <button key={choice.value} onClick={() => choose(choice.value)} disabled={Boolean(player)} className={`rounded-2xl border p-3 text-center transition ${player === choice.value ? 'border-brand-purple bg-brand-purple/10' : 'border-white/10 bg-[#101A27] hover:border-brand-purple/40'} disabled:opacity-100`}><span className="block text-4xl">{choice.emoji}</span><span className="mt-2 block text-sm font-bold text-white">{choice.label}</span></button>)}</div>
      {result && <div className="mt-5 rounded-xl border border-white/10 bg-[#0C1420] p-4 text-center"><div className="flex items-center justify-center gap-5"><div><span className="block text-3xl">{rpsChoices.find((item) => item.value === player)?.emoji}</span><span className="text-xs text-brand-white/45">Sen</span></div><span className="text-sm font-black text-brand-white/40">VS</span><div><span className="block text-3xl">{rpsChoices.find((item) => item.value === cpu)?.emoji}</span><span className="text-xs text-brand-white/45">Bilgisayar</span></div></div><p className="mt-3 font-bold text-white">{result === 'win' ? 'Bu tur senin!' : result === 'lose' ? 'Bu tur bilgisayarın.' : 'Berabere!'}</p><button onClick={next} className="btn-primary mt-3 w-full">{round === 5 ? 'Sonucu gör' : 'Sonraki tur'} <ArrowRight className="h-4 w-4"/></button></div>}</> : <div className="rounded-2xl border border-brand-purple/25 bg-brand-purple/10 p-6 text-center"><Trophy className="mx-auto h-9 w-9 text-brand-purple"/><h2 className="mt-3 text-xl font-black text-white">Maç tamamlandı!</h2><p className="mt-2 text-sm text-brand-white/60">5 turda {score.win} galibiyet, {score.draw} beraberlik ve {score.lose} mağlubiyet.</p><p className="mt-3 font-bold text-brand-purple">{score.win > score.lose ? 'Güzel maç, kazandın!' : score.win === score.lose ? 'Dengeli bir maç oldu!' : 'Bir rövanş daha deneyebilirsin.'}</p><button onClick={reset} className="btn-primary mt-4"><RefreshCw className="h-4 w-4"/> Rövanş yap</button></div>}
    </div>
  </ArcadeFrame>;
}

// 4x4 mini sudoku: her satır, sütun ve 2x2 kutuda 1–4 birer kez kullanılır.
type SudokuState = { puzzle: number[][]; solution: number[][] };
function makeMiniSudoku(): SudokuState {
  const symbols = shuffleArray([1, 2, 3, 4]);
  const solution = Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, col) => symbols[(row * 2 + Math.floor(row / 2) + col) % 4]));
  const puzzle = solution.map((row) => row.map((value) => Math.random() < 0.43 ? 0 : value));
  return { puzzle, solution };
}
export function MiniSudokuGame() {
  const [game, setGame] = useState<SudokuState>(makeMiniSudoku);
  const [values, setValues] = useState<number[][]>(() => game.puzzle.map((row) => [...row]));
  const [active, setActive] = useState<[number, number] | null>(null);
  const [checked, setChecked] = useState(false);
  const [won, setWon] = useState(false);
  const reset = () => { const next = makeMiniSudoku(); setGame(next); setValues(next.puzzle.map((row) => [...row])); setActive(null); setChecked(false); setWon(false); };
  const chooseNumber = (number: number) => {
    if (!active || won || game.puzzle[active[0]][active[1]] !== 0) return;
    setValues((current) => current.map((row, r) => row.map((value, c) => r === active[0] && c === active[1] ? number : value)));
    setChecked(false);
  };
  const verify = () => { setChecked(true); if (values.every((row, r) => row.every((value, c) => value === game.solution[r][c]))) setWon(true); };
  const emptyCount = values.flat().filter((value) => value === 0).length;
  return <ArcadeFrame title="Mini Sudoku" description="1, 2, 3 ve 4 rakamlarını her satırda, sütunda ve küçük karede birer kez kullan." icon={<Grid3X3 className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex items-center justify-between gap-2"><span className="arcade-stat">Boş hücre <b>{emptyCount}</b></span><button onClick={reset} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Yeni bulmaca</button></div>
      <div className="mx-auto grid max-w-xs grid-cols-4 overflow-hidden rounded-xl border-2 border-brand-purple/60 bg-[#0A111C]">{values.flatMap((row, r) => row.map((value, c) => { const fixed = game.puzzle[r][c] !== 0; const isActive = active?.[0] === r && active?.[1] === c; const wrong = checked && value !== 0 && value !== game.solution[r][c]; return <button key={`${r}-${c}`} onClick={() => setActive([r,c])} disabled={fixed || won} className={`flex aspect-square items-center justify-center border border-white/10 text-2xl font-black transition ${r === 1 ? 'border-b-2 border-b-brand-purple/60' : ''} ${c === 1 ? 'border-r-2 border-r-brand-purple/60' : ''} ${fixed ? 'bg-[#192738] text-white' : isActive ? 'bg-brand-purple/20 text-brand-purple' : wrong ? 'bg-rose-400/15 text-rose-300' : 'bg-[#101A27] text-brand-purple hover:bg-[#1A2A3D]'}`}>{value || ''}</button>; }))}</div>
      <div className="mx-auto mt-4 grid max-w-xs grid-cols-4 gap-2">{[1,2,3,4].map((number) => <button key={number} onClick={() => chooseNumber(number)} className="arcade-control h-12 w-full text-lg font-black">{number}</button>)}</div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button onClick={() => { if (active) { setValues((current) => current.map((row,r) => row.map((value,c) => r === active[0] && c === active[1] ? 0 : value))); setChecked(false); } }} className="btn-ghost">Sil</button><button onClick={verify} disabled={emptyCount > 0 || won} className="btn-primary">Kontrol et</button></div>
      {checked && !won && <p className="mt-3 text-center text-sm text-amber-200">Bazı rakamlar yanlış yerde. Satır, sütun ve 2×2 kutuları tekrar kontrol et.</p>}{won && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><CheckCircle2 className="mx-auto h-7 w-7 text-brand-purple"/><p className="mt-2 font-bold text-white">Bulmaca tamamlandı!</p><button onClick={reset} className="btn-primary mt-3">Yeni bulmaca</button></div>}
    </div>
  </ArcadeFrame>;
}

export function NumberSortGame() {
  const makeRound = () => { const values = shuffleArray(Array.from({ length: 6 }, () => randomInt(1, 60)).filter((value, index, array) => array.indexOf(value) === index)); while (values.length < 6) { const next = randomInt(1,60); if (!values.includes(next)) values.push(next); } return values; };
  const [numbers, setNumbers] = useState<number[]>(makeRound);
  const [picked, setPicked] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState('Sayıları küçükten büyüğe doğru sırala.');
  const expected = [...numbers].sort((a,b) => a-b)[picked.length];
  const complete = picked.length === numbers.length;
  const choose = (number: number) => {
    if (complete || picked.includes(number)) return;
    if (number === expected) { setPicked((items) => [...items, number]); setFeedback('Doğru sıra! Devam et.'); }
    else { setWrong((value) => value + 1); setFeedback('Bu sayı henüz sırada değil. Bir daha dene.'); }
  };
  const reset = () => { setNumbers(makeRound()); setPicked([]); setWrong(0); setFeedback('Yeni sayıları küçükten büyüğe sırala.'); };
  return <ArcadeFrame title="Sayı Sıralama" description="Karışık verilen altı sayıyı en küçükten en büyüğe seç." icon={<ListOrdered className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><span className="arcade-stat">Doğru <b>{picked.length} / 6</b></span><span className="arcade-stat">Yanlış deneme <b>{wrong}</b></span><button onClick={reset} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Karıştır</button></div>
      <div className="mb-5 flex flex-wrap justify-center gap-2">{numbers.map((number) => <button key={number} onClick={() => choose(number)} disabled={picked.includes(number) || complete} className={`flex h-16 w-16 items-center justify-center rounded-xl border text-xl font-black transition ${picked.includes(number) ? 'border-brand-purple/50 bg-brand-purple/15 text-brand-purple' : 'border-white/10 bg-[#111C2A] text-white hover:border-brand-purple/50'}`}>{picked.includes(number) ? <CheckCircle2 className="h-6 w-6"/> : number}</button>)}</div>
      <div className="rounded-xl border border-white/10 bg-[#0C1420] p-4 text-center"><p className="text-xs text-brand-white/45">Sıradaki sayı</p><p className="mt-1 text-3xl font-black text-brand-purple">{complete ? 'Tamamlandı' : expected}</p><p className="mt-2 text-sm text-brand-white/60">{feedback}</p></div>
      {complete && <div className="mt-4 text-center"><p className="font-bold text-white">Harika! Tüm sayıları doğru sıraladın.</p><button onClick={reset} className="btn-primary mt-3">Yeni tur</button></div>}
    </div>
  </ArcadeFrame>;
}

export function TargetTapGame() {
  const [target, setTarget] = useState(() => randomInt(0,15));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [active, setActive] = useState(false);
  const [best, setBest] = useState(() => getBestScore('target-tap') ?? 0);
  const finished = time <= 0;
  useEffect(() => {
    if (!active || finished) return;
    const timer = window.setInterval(() => setTime((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active, finished]);
  const hit = (index: number) => {
    if (!active || finished || index !== target) return;
    const nextScore = score + 1;
    setScore(nextScore);
    setBest(saveBestScore('target-tap', nextScore));
    setTarget((current) => { const offset = randomInt(1,15); return (current + offset) % 16; });
  };
  const start = () => { setTarget(randomInt(0,15)); setScore(0); setTime(20); setActive(true); };
  return <ArcadeFrame title="Hedefi Yakala" description="Yalnızca hedef kareye dokun. 20 saniyede kaç doğru dokunuş yapabilirsin?" icon={<Target className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex items-center justify-between"><span className="arcade-stat">Süre <b>{time}s</b></span><span className="arcade-stat">Puan <b>{score}</b></span><span className="arcade-stat">Rekor <b>{best}</b></span></div>
      <div className="mx-auto grid max-w-sm grid-cols-4 gap-2">{Array.from({ length: 16 }, (_, index) => <button key={index} disabled={!active || finished} onClick={() => hit(index)} aria-label={`Kare ${index + 1}`} className={`aspect-square rounded-xl border transition ${active && target === index ? 'border-brand-purple bg-brand-purple shadow-[0_0_20px_rgba(183,243,107,.26)]' : 'border-white/10 bg-[#111C2A] hover:border-white/20'} disabled:cursor-default`}><span className={`text-xl ${active && target === index ? 'text-[#10170D]' : 'text-transparent'}`}>●</span></button>)}</div>
      {!active || finished ? <div className="mt-5 text-center"><p className="text-sm text-brand-white/60">{finished ? `Süre bitti! ${score} doğru hedef yakaladın.` : 'Hazırsan başla. Hedef kare her doğru dokunuşta yer değiştirecek.'}</p><button onClick={start} className="btn-primary mt-3"><Target className="h-4 w-4"/>{finished ? 'Tekrar oyna' : 'Başlat'}</button></div> : <p className="mt-4 text-center text-sm text-brand-white/50">Yeşil hedefi bul ve dokun!</p>}
    </div>
  </ArcadeFrame>;
}

export function QuickCountGame() {
  type Puzzle = { symbols: string[]; target: string; answer: number; choices: number[] };
  const symbols = ['●','■','▲','◆','★','✚'];
  const makePuzzle = (): Puzzle => {
    const target = symbols[randomInt(0, symbols.length - 1)];
    const symbolsOnBoard = Array.from({ length: 24 }, () => symbols[randomInt(0, symbols.length - 1)]);
    const answer = randomInt(2, 9);
    for (let i = 0; i < answer; i++) symbolsOnBoard[i] = target;
    const shuffledSymbols = shuffleArray(symbolsOnBoard);
    const choices = shuffleArray([...new Set([answer, Math.max(0, answer - 1), answer + 1, answer + 2])]).slice(0, 4);
    return { symbols: shuffledSymbols, target, answer, choices };
  };
  const [puzzle, setPuzzle] = useState<Puzzle>(makePuzzle);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [best, setBest] = useState(() => getBestScore('quick-count') ?? 0);
  const complete = round > 10;
  const answer = (value: number) => { if (checked || complete) return; setSelected(value); setChecked(true); if (value === puzzle.answer) { const next = score + 1; setScore(next); setBest(saveBestScore('quick-count', next)); } };
  const next = () => { setRound((value) => value + 1); setPuzzle(makePuzzle()); setSelected(null); setChecked(false); };
  const reset = () => { setRound(1); setScore(0); setPuzzle(makePuzzle()); setSelected(null); setChecked(false); };
  return <ArcadeFrame title="Hızlı Sayım" description="Karışık sembollerin içinde istenen şekilden kaç tane olduğunu bul." icon={<Sparkles className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><span className="arcade-stat">Tur <b>{Math.min(round,10)} / 10</b></span><span className="arcade-stat">Puan <b>{score}</b></span><span className="arcade-stat">Rekor <b>{best}</b></span></div>
      {complete ? <div className="py-8 text-center"><Trophy className="mx-auto h-10 w-10 text-brand-purple"/><h2 className="mt-3 text-2xl font-black text-white">Tur tamamlandı!</h2><p className="mt-2 text-brand-white/60">10 turda {score} doğru yaptın.</p><button onClick={reset} className="btn-primary mt-4">Yeniden oyna</button></div> : <><div className="rounded-xl border border-white/10 bg-[#0C1420] p-3 text-center"><p className="text-xs text-brand-white/45">Bu şekilden kaç tane var?</p><p className="mt-1 text-4xl font-black text-brand-purple">{puzzle.target}</p></div><div className="mx-auto mt-4 grid max-w-md grid-cols-6 gap-2 rounded-xl border border-white/10 bg-[#0A111C] p-3">{puzzle.symbols.map((symbol,index) => <span key={index} className="flex aspect-square items-center justify-center rounded-lg bg-[#172333] text-xl text-white">{symbol}</span>)}</div><div className="mt-4 grid grid-cols-4 gap-2">{puzzle.choices.map((choice) => <button key={choice} onClick={() => answer(choice)} disabled={checked} className={`rounded-xl border p-3 text-lg font-black ${checked && choice === puzzle.answer ? 'border-brand-purple bg-brand-purple/15 text-brand-purple' : selected === choice ? 'border-sky-300 bg-sky-300/10 text-sky-200' : 'border-white/10 bg-[#111C2A] text-white'}`}>{choice}</button>)}</div>{checked && <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-brand-white/60">{selected === puzzle.answer ? 'Doğru saydın!' : `Doğru cevap: ${puzzle.answer}`}</p><button onClick={next} className="btn-primary">{round === 10 ? 'Sonucu gör' : 'Sonraki tur'} <ArrowRight className="h-4 w-4"/></button></div>}</>}
    </div>
  </ArcadeFrame>;
}

type MineCell = { mine: boolean; count: number; open: boolean; flag: boolean };
type MineStatus = 'ready' | 'playing' | 'won' | 'lost';
const MINE_ROWS = 8;
const MINE_COLS = 8;
const MINE_TOTAL = 10;

function makeMineBoard(safeIndex = -1): MineCell[] {
  const mineIndexes = new Set<number>();
  while (mineIndexes.size < MINE_TOTAL) {
    const index = randomInt(0, MINE_ROWS * MINE_COLS - 1);
    if (index !== safeIndex) mineIndexes.add(index);
  }
  return Array.from({ length: MINE_ROWS * MINE_COLS }, (_, index) => {
    const row = Math.floor(index / MINE_COLS);
    const col = index % MINE_COLS;
    let count = 0;
    for (let r = Math.max(0, row - 1); r <= Math.min(MINE_ROWS - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(MINE_COLS - 1, col + 1); c++) {
        if (mineIndexes.has(r * MINE_COLS + c)) count++;
      }
    }
    return { mine: mineIndexes.has(index), count, open: false, flag: false };
  });
}

function revealMineArea(source: MineCell[], start: number): MineCell[] {
  const next = source.map((cell) => ({ ...cell }));
  const queue = [start];
  const visited = new Set<number>();
  while (queue.length) {
    const index = queue.shift()!;
    if (visited.has(index)) continue;
    visited.add(index);
    const cell = next[index];
    if (!cell || cell.flag || cell.mine) continue;
    cell.open = true;
    if (cell.count === 0) {
      const row = Math.floor(index / MINE_COLS);
      const col = index % MINE_COLS;
      for (let r = Math.max(0, row - 1); r <= Math.min(MINE_ROWS - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(MINE_COLS - 1, col + 1); c++) {
          const neighbor = r * MINE_COLS + c;
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
    }
  }
  return next;
}

export function MinesweeperGame() {
  const [board, setBoard] = useState<MineCell[]>(() => makeMineBoard());
  const [status, setStatus] = useState<MineStatus>('ready');
  const [flagMode, setFlagMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState(() => getBestScore('minefield', true));
  const flags = board.filter((cell) => cell.flag).length;
  const reset = () => { setBoard(makeMineBoard()); setStatus('ready'); setFlagMode(false); setSeconds(0); };
  useEffect(() => {
    if (status !== 'playing') return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);
  const toggleFlag = (index: number) => {
    if (status === 'won' || status === 'lost' || board[index].open) return;
    setBoard((current) => current.map((cell, cellIndex) => cellIndex === index ? { ...cell, flag: !cell.flag } : cell));
  };
  const openCell = (index: number) => {
    if (status === 'won' || status === 'lost' || board[index].open || board[index].flag) return;
    let current = board;
    if (board[index].mine && status === 'ready') current = makeMineBoard(index);
    const next = revealMineArea(current, index);
    if (next[index].mine) {
      setBoard(next.map((cell) => cell.mine ? { ...cell, open: true } : cell));
      setStatus('lost');
      return;
    }
    const opened = next.filter((cell) => cell.open && !cell.mine).length;
    setBoard(next);
    setStatus(opened >= MINE_ROWS * MINE_COLS - MINE_TOTAL ? 'won' : 'playing');
  };
  useEffect(() => {
    if (status === 'won') setBest(saveBestScore('minefield', seconds, true));
  }, [status, seconds]);
  return <ArcadeFrame title="Mayın Tarlası" description="Güvenli kareleri aç, sayılardan ipucu al ve tüm alanı temizle." icon={<Bomb className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="arcade-stat">Kalan bayrak <b>{MINE_TOTAL - flags}</b></span><span className="arcade-stat">Süre <b>{seconds}s</b></span><span className="arcade-stat">Rekor <b>{best === null ? '—' : `${best}s`}</b></span></div>
      <div className="mx-auto grid max-w-[440px] grid-cols-8 gap-1 rounded-xl border border-white/10 bg-[#080F18] p-2 sm:gap-1.5 sm:p-3">
        {board.map((cell, index) => <button key={index} onClick={() => flagMode ? toggleFlag(index) : openCell(index)} onContextMenu={(event) => { event.preventDefault(); toggleFlag(index); }} aria-label={`Satır ${Math.floor(index / 8) + 1}, sütun ${index % 8 + 1}${cell.open ? ', açık' : ', kapalı'}`} className={`aspect-square rounded-md border text-xs font-black transition sm:rounded-lg sm:text-base ${cell.open ? cell.mine ? 'border-rose-400/40 bg-rose-400/15 text-rose-300' : 'border-white/5 bg-[#172333] text-brand-purple' : 'border-white/10 bg-[#233246] text-brand-purple hover:border-brand-purple/50 hover:bg-[#2B3D53]'}`}>
          {cell.open ? cell.mine ? '✹' : cell.count || '' : cell.flag ? '⚑' : ''}
        </button>)}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button onClick={() => setFlagMode((value) => !value)} className={`btn-ghost ${flagMode ? 'border-brand-purple text-brand-purple' : ''}`}><Flag className="h-4 w-4"/>{flagMode ? 'Bayrak modu açık' : 'Bayrak koy'}</button><button onClick={reset} className="btn-primary"><RefreshCw className="h-4 w-4"/> Yeni oyun</button></div>
      <p className="mt-3 text-center text-xs text-brand-white/40">Bilgisayarda sağ tıklayarak, telefonda bayrak modunu açarak işaret koyabilirsin. İlk açtığın kare güvenlidir.</p>
      {status === 'won' && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><Trophy className="mx-auto h-7 w-7 text-brand-purple"/><p className="mt-2 font-black text-white">Alan temizlendi!</p><p className="mt-1 text-sm text-brand-white/60">{seconds} saniyede tamamladın.</p></div>}
      {status === 'lost' && <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-center"><p className="font-black text-white">Bu tur olmadı.</p><p className="mt-1 text-sm text-brand-white/60">Yeni bir tahta deneyebilirsin.</p><button onClick={reset} className="btn-primary mt-3">Tekrar dene</button></div>}
    </div>
  </ArcadeFrame>;
}

function makeSlidingBoard(): number[] {
  const board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let previousBlank = -1;
  for (let step = 0; step < 100; step++) {
    const blank = board.indexOf(0);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    const neighbors = [row > 0 ? blank - 3 : -1, row < 2 ? blank + 3 : -1, col > 0 ? blank - 1 : -1, col < 2 ? blank + 1 : -1].filter((index) => index >= 0 && index !== previousBlank);
    const chosen = neighbors[randomInt(0, neighbors.length - 1)];
    [board[blank], board[chosen]] = [board[chosen], board[blank]];
    previousBlank = blank;
  }
  if (board.every((value, index) => value === [1, 2, 3, 4, 5, 6, 7, 8, 0][index])) return makeSlidingBoard();
  return board;
}
const solvedSlidingBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function SlidingPuzzleGame() {
  const [board, setBoard] = useState<number[]>(makeSlidingBoard);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => getBestScore('sliding-puzzle', true));
  const solved = board.every((value, index) => value === solvedSlidingBoard[index]);
  const reset = () => { setBoard(makeSlidingBoard()); setMoves(0); };
  const moveTile = (index: number) => {
    if (solved || board[index] === 0) return;
    const blank = board.indexOf(0);
    const adjacent = Math.abs(Math.floor(index / 3) - Math.floor(blank / 3)) + Math.abs((index % 3) - (blank % 3)) === 1;
    if (!adjacent) return;
    const next = [...board];
    [next[index], next[blank]] = [next[blank], next[index]];
    setBoard(next);
    setMoves((value) => value + 1);
  };
  useEffect(() => { if (solved) setBest(saveBestScore('sliding-puzzle', moves, true)); }, [solved, moves]);
  return <ArcadeFrame title="Sayı Kaydırma" description="Taşları boş kareye kaydır ve 1’den 8’e doğru sırala." icon={<Move className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap justify-between gap-2"><span className="arcade-stat">Hamle <b>{moves}</b></span><span className="arcade-stat">En iyi <b>{best === null ? '—' : `${best} hamle`}</b></span></div>
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#080F18] p-3 sm:gap-3 sm:p-4">{board.map((value, index) => <button key={index} onClick={() => moveTile(index)} disabled={solved || value === 0} aria-label={value ? `${value} numaralı taşı kaydır` : 'Boş kare'} className={`aspect-square rounded-xl border text-2xl font-black transition sm:text-3xl ${value === 0 ? 'border-dashed border-white/10 bg-[#0B121C]' : 'border-brand-purple/20 bg-[#1D2A3B] text-white hover:border-brand-purple/60 hover:bg-brand-purple/15 active:scale-95'}`}>{value || ''}</button>)}</div>
      {solved && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-4 text-center"><Trophy className="mx-auto h-7 w-7 text-brand-purple"/><p className="mt-2 font-black text-white">Bulmaca tamamlandı!</p><p className="text-sm text-brand-white/60">{moves} hamlede çözdün.</p></div>}
      <div className="mt-4 flex justify-center"><button onClick={reset} className="btn-primary"><RefreshCw className="h-4 w-4"/> Yeni bulmaca</button></div>
    </div>
  </ArcadeFrame>;
}

function connectFourWinner(board: Array<Array<'X' | 'O' | null>>): 'X' | 'O' | null {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) {
    const player = board[row][col];
    if (!player) continue;
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let step = 1; step < 4; step++) {
        const r = row + dr * step;
        const c = col + dc * step;
        if (r < 0 || r >= 6 || c < 0 || c >= 7 || board[r][c] !== player) break;
        count++;
      }
      if (count >= 4) return player;
    }
  }
  return null;
}

export function ConnectFourGame() {
  const emptyBoard = () => Array.from({ length: 6 }, () => Array(7).fill(null) as Array<'X' | 'O' | null>);
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [draw, setDraw] = useState(false);
  const drop = (col: number) => {
    if (winner || draw) return;
    const row = [...board].map((line) => [...line]).reverse().findIndex((line) => line[col] === null);
    if (row < 0) return;
    const rowIndex = 5 - row;
    const next = board.map((line) => [...line]);
    next[rowIndex][col] = turn;
    const nextWinner = connectFourWinner(next);
    setBoard(next);
    setWinner(nextWinner);
    setDraw(!nextWinner && next.every((line) => line.every(Boolean)));
    if (!nextWinner) setTurn(turn === 'X' ? 'O' : 'X');
  };
  const reset = () => { setBoard(emptyBoard()); setTurn('X'); setWinner(null); setDraw(false); };
  return <ArcadeFrame title="Dört Taş" description="İki kişi aynı ekranda sırayla oynayın. Dört taşı yatay, dikey veya çapraz diz." icon={<Users className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className={`arcade-stat ${turn === 'X' ? 'text-brand-purple' : ''}`}>Sıra <b>{winner || draw ? 'Bitti' : turn === 'X' ? 'Oyuncu 1' : 'Oyuncu 2'}</b></span><span className="arcade-stat">X <b>Oyuncu 1</b> · O <b>Oyuncu 2</b></span></div>
      <div className="mx-auto max-w-lg rounded-2xl border border-brand-purple/25 bg-[#111E2D] p-2 sm:p-3"><div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">{Array.from({ length: 7 }, (_, col) => <button key={col} onClick={() => drop(col)} disabled={Boolean(winner || draw) || board[0][col] !== null} className="rounded-lg border border-white/10 bg-[#0A111B] py-2 text-xs font-black text-brand-purple hover:border-brand-purple/40 disabled:opacity-30">↓</button>)}</div><div className="grid grid-cols-7 gap-1 sm:gap-2">{board.flatMap((line, row) => line.map((cell, col) => <button key={`${row}-${col}`} onClick={() => drop(col)} disabled={Boolean(winner || draw) || board[0][col] !== null} aria-label={`Satır ${row + 1}, sütun ${col + 1}`} className="flex aspect-square items-center justify-center rounded-full border border-white/10 bg-[#080F18] p-0.5"><span className={`h-full w-full rounded-full ${cell === 'X' ? 'bg-brand-purple shadow-[inset_0_0_0_3px_rgba(8,15,24,.35)]' : cell === 'O' ? 'bg-sky-400 shadow-[inset_0_0_0_3px_rgba(8,15,24,.35)]' : 'bg-[#1B293A]'}`}/></button>))}</div></div>
      {(winner || draw) && <div className="mt-4 rounded-xl border border-brand-purple/25 bg-brand-purple/10 p-3 text-center font-bold text-white">{winner ? `${winner === 'X' ? 'Oyuncu 1' : 'Oyuncu 2'} kazandı!` : 'Berabere!'}</div>}
      <div className="mt-4 flex justify-center"><button onClick={reset} className="btn-primary"><RefreshCw className="h-4 w-4"/> Yeni maç</button></div>
      <p className="mt-3 text-center text-xs text-brand-white/40">Bu oyun aynı cihazda iki kişiyle oynanır; çevrimiçi eşleşme içermez.</p>
    </div>
  </ArcadeFrame>;
}

type NonogramPattern = string[];
const nonogramPatterns: NonogramPattern[] = [
  ['00100','01110','11111','00100','00100'],
  ['10001','01010','00100','01010','10001'],
  ['11111','10001','10101','10001','11111'],
  ['00100','01110','11111','11111','01110'],
  ['11011','11011','00000','11011','11011'],
  ['00100','01010','10001','11111','00100'],
  ['11100','10100','11111','00101','00111'],
  ['10001','11011','10101','11011','10001'],
];
function runs(line: boolean[]): number[] {
  const result: number[] = [];
  let current = 0;
  line.forEach((filled) => { if (filled) current++; else if (current) { result.push(current); current = 0; } });
  if (current) result.push(current);
  return result.length ? result : [0];
}

export function NonogramGame() {
  const [patternIndex, setPatternIndex] = useState(() => randomInt(0, nonogramPatterns.length - 1));
  const pattern = nonogramPatterns[patternIndex];
  const [selected, setSelected] = useState<boolean[][]>(() => Array.from({ length: 5 }, () => Array(5).fill(false) as boolean[]));
  const [checked, setChecked] = useState(false);
  const rowClues = pattern.map((row) => runs([...row].map((value) => value === '1')));
  const colClues = Array.from({ length: 5 }, (_, col) => runs(pattern.map((row) => row[col] === '1')));
  const matches = selected.every((row, r) => row.every((value, c) => value === (pattern[r][c] === '1')));
  const next = () => {
    let candidate = randomInt(0, nonogramPatterns.length - 1);
    if (candidate === patternIndex) candidate = (candidate + 1) % nonogramPatterns.length;
    setPatternIndex(candidate);
    setSelected(Array.from({ length: 5 }, () => Array(5).fill(false) as boolean[]));
    setChecked(false);
  };
  return <ArcadeFrame title="Resimli Mantık" description="Satır ve sütun ipuçlarını kullanarak gizli şekli ortaya çıkar." icon={<Puzzle className="h-6 w-6"/>}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mx-auto max-w-md"><div className="mb-4 rounded-xl border border-white/10 bg-[#0C1420] p-3 text-sm text-brand-white/60">Sayılar, o satır veya sütunda art arda gelen dolu kare gruplarının uzunluğunu gösterir. Karelere dokunarak doldur veya boş bırak.</div>
      <div className="grid grid-cols-[46px_repeat(5,minmax(0,1fr))] gap-1 sm:grid-cols-[58px_repeat(5,minmax(0,1fr))] sm:gap-2"><div/><div className="col-span-5 grid grid-cols-5 gap-1 sm:gap-2">{colClues.map((clue, index) => <div key={index} className="flex min-h-12 items-end justify-center pb-1 text-[10px] font-black leading-4 text-brand-purple sm:text-xs">{clue.join(' ')}</div>)}</div>{rowClues.map((clue, row) => <div key={`row-${row}`} className="contents"><div className="flex items-center justify-end pr-2 text-xs font-black text-brand-purple">{clue.join(' ')}</div>{selected[row].map((value, col) => <button key={`${row}-${col}`} onClick={() => { setSelected((current) => current.map((line, r) => line.map((cell, c) => r === row && c === col ? !cell : cell))); setChecked(false); }} aria-label={`Satır ${row + 1}, sütun ${col + 1}`} className={`aspect-square rounded-lg border transition ${value ? 'border-brand-purple bg-brand-purple text-[#0A1118]' : 'border-white/10 bg-[#172435] hover:border-brand-purple/40'}`}>{value ? '■' : ''}</button>)}</div>)}</div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button onClick={() => { setChecked(true); }} className="btn-primary">Kontrol et</button><button onClick={next} className="btn-ghost"><RefreshCw className="h-4 w-4"/> Yeni şekil</button></div>
      {checked && <div className={`mt-4 rounded-xl border p-3 text-center text-sm ${matches ? 'border-brand-purple/25 bg-brand-purple/10 text-brand-purple' : 'border-white/10 bg-[#0C1420] text-brand-white/65'}`}>{matches ? 'Harika! Şekli doğru buldun.' : 'Henüz tam değil. İpuçlarını tekrar kontrol et.'}</div>}
    </div></div>
  </ArcadeFrame>;
}

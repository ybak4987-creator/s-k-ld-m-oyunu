import { useEffect, useMemo, useState } from 'react';
import { Grid3X3, Lightbulb, MousePointer2, Plus, RefreshCw, Target, Trophy } from 'lucide-react';
import { ArcadeFrame } from './ArcadeGames';
import { getBestScore, randomInt, saveBestScore, shuffleArray } from '@/data/gameUtils';

function createLightsBoard() {
  const board = Array.from({ length: 5 }, () => Array(5).fill(false) as boolean[]);
  // Build a guaranteed-solvable board by applying legal moves to an empty board.
  const picks = shuffleArray(Array.from({ length: 25 }, (_, index) => index)).slice(0, randomInt(10, 17));
  picks.forEach((index) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < 5 && c >= 0 && c < 5) board[r][c] = !board[r][c];
    });
  });
  if (board.every((row) => row.every((cell) => !cell))) board[2][2] = true;
  return board;
}

export function LightsOutGame() {
  const [board, setBoard] = useState(createLightsBoard);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => getBestScore('lights-out'));
  const solved = board.every((row) => row.every((cell) => !cell));
  const tap = (row: number, col: number) => {
    if (solved) return;
    setBoard((current) => {
      const next = current.map((line) => [...line]);
      [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 5 && c >= 0 && c < 5) next[r][c] = !next[r][c];
      });
      return next;
    });
    setMoves((value) => value + 1);
  };
  useEffect(() => {
    if (solved && moves > 0) setBest(saveBestScore('lights-out', Math.max(1, 1000 - moves * 5)));
  }, [solved, moves]);
  const reset = () => { setBoard(createLightsBoard()); setMoves(0); };
  return <ArcadeFrame title="Işıkları Söndür" description="Bir kareye dokununca kendisi ve yanındaki kareler değişir. Tüm ışıkları kapat." icon={<Lightbulb className="h-6 w-6" />}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="arcade-stat">Hamle <b>{moves}</b></span><span className="arcade-stat">Rekor <b>{best ?? '—'}</b></span><button className="btn-ghost px-3 py-2 text-xs" onClick={reset}><RefreshCw className="h-4 w-4"/> Yeni tahta</button></div>
      <div className="mx-auto grid max-w-sm grid-cols-5 gap-2 rounded-2xl border border-white/10 bg-[#080F18] p-3">
        {board.flatMap((line, row) => line.map((on, col) => <button key={`${row}-${col}`} onClick={() => tap(row, col)} disabled={solved} aria-label={`Satır ${row + 1}, sütun ${col + 1}`} className={`aspect-square rounded-xl border transition active:scale-95 ${on ? 'border-[#B7F36B] bg-[#B7F36B] shadow-[0_0_18px_rgba(183,243,107,.22)]' : 'border-white/10 bg-[#172435] hover:border-[#B7F36B]/40'}`}><span className={`mx-auto block h-2.5 w-2.5 rounded-full ${on ? 'bg-[#18220E]' : 'bg-white/10'}`}/></button>))}
      </div>
      {solved && <div className="mt-4 rounded-xl border border-[#B7F36B]/25 bg-[#B7F36B]/10 p-4 text-center"><Trophy className="mx-auto h-6 w-6 text-[#B7F36B]"/><p className="mt-2 font-black text-white">Bütün ışıkları söndürdün!</p><p className="text-sm text-white/60">{moves} hamlede çözdün.</p><button className="btn-primary mt-3" onClick={reset}>Tekrar oyna</button></div>}
    </div>
  </ArcadeFrame>;
}

type Player = 'A' | 'B';
type DotsState = { h: (Player | null)[][]; v: (Player | null)[][]; boxes: (Player | null)[][]; scores: Record<Player, number>; turn: Player };
const newDotsState = (): DotsState => ({ h: Array.from({ length: 4 }, () => Array(3).fill(null)), v: Array.from({ length: 3 }, () => Array(4).fill(null)), boxes: Array.from({ length: 3 }, () => Array(3).fill(null)), scores: { A: 0, B: 0 }, turn: 'A' });
function boxIsClosed(state: DotsState, row: number, col: number) {
  return Boolean(state.h[row][col] && state.h[row + 1][col] && state.v[row][col] && state.v[row][col + 1]);
}

export function DotsAndBoxesGame() {
  const [state, setState] = useState(newDotsState);
  const completed = state.scores.A + state.scores.B;
  const finished = completed === 9;
  const edgeCount = state.h.flat().filter(Boolean).length + state.v.flat().filter(Boolean).length;
  const drawEdge = (kind: 'h' | 'v', row: number, col: number) => {
    setState((current) => {
      if (finished || (kind === 'h' ? current.h[row][col] !== null : current.v[row][col] !== null)) return current;
      const next: DotsState = { h: current.h.map((line) => [...line]), v: current.v.map((line) => [...line]), boxes: current.boxes.map((line) => [...line]), scores: { ...current.scores }, turn: current.turn };
      if (kind === 'h') next.h[row][col] = current.turn; else next.v[row][col] = current.turn;
      const affected = kind === 'h' ? [[row - 1, col], [row, col]] : [[row, col - 1], [row, col]];
      let claimed = 0;
      affected.forEach(([r, c]) => {
        if (r < 0 || r >= 3 || c < 0 || c >= 3 || next.boxes[r][c]) return;
        if (boxIsClosed(next, r, c)) { next.boxes[r][c] = current.turn; claimed++; }
      });
      next.scores[current.turn] += claimed;
      if (claimed === 0) next.turn = current.turn === 'A' ? 'B' : 'A';
      return next;
    });
  };
  const reset = () => setState(newDotsState());
  const cells = useMemo(() => Array.from({ length: 49 }, (_, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    if (row % 2 === 0 && col % 2 === 0) return { kind: 'dot' as const, row, col };
    if (row % 2 === 0 && col % 2 === 1) return { kind: 'h' as const, row: row / 2, col: (col - 1) / 2 };
    if (row % 2 === 1 && col % 2 === 0) return { kind: 'v' as const, row: (row - 1) / 2, col: col / 2 };
    return { kind: 'box' as const, row: (row - 1) / 2, col: (col - 1) / 2 };
  }), []);
  return <ArcadeFrame title="Nokta ve Kutu" description="Sırayla çizgi çekin. Bir kutuyu tamamlayan oyuncu puan alır ve yeniden oynar." icon={<Grid3X3 className="h-6 w-6" />}>
    <div className="arcade-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className={`arcade-stat ${state.turn === 'A' ? 'border-[#B7F36B]/40' : 'border-sky-400/40'}`}>Sıra <b>{finished ? 'Maç bitti' : state.turn === 'A' ? 'Oyuncu 1' : 'Oyuncu 2'}</b></span><span className="arcade-stat">Oyuncu 1 <b>{state.scores.A}</b></span><span className="arcade-stat">Oyuncu 2 <b>{state.scores.B}</b></span></div>
      <div className="mx-auto grid aspect-square max-w-[440px] grid-cols-7 grid-rows-7 gap-0 rounded-xl border border-white/10 bg-[#0A111B] p-2 sm:p-3">
        {cells.map((cell, index) => {
          if (cell.kind === 'dot') return <div key={index} className="flex items-center justify-center"><span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1] sm:h-3 sm:w-3"/></div>;
          if (cell.kind === 'box') { const owner = state.boxes[cell.row][cell.col]; return <div key={index} className={`flex items-center justify-center rounded-md text-lg font-black ${owner === 'A' ? 'bg-[#B7F36B]/20 text-[#B7F36B]' : owner === 'B' ? 'bg-sky-400/20 text-sky-300' : ''}`}>{owner || ''}</div>; }
          const owner = cell.kind === 'h' ? state.h[cell.row][cell.col] : state.v[cell.row][cell.col];
          const lineTone = owner === 'A' ? 'bg-[#B7F36B]' : owner === 'B' ? 'bg-sky-400' : 'bg-white/15 hover:bg-[#B7F36B]/60';
          return <button key={index} disabled={finished || owner !== null} onClick={() => drawEdge(cell.kind, cell.row, cell.col)} aria-label="Çizgi ekle" className="flex items-center justify-center disabled:cursor-default"><span className={`${cell.kind === 'h' ? 'h-1.5 w-full' : 'h-full w-1.5'} rounded-full transition ${lineTone}`}/></button>;
        })}
      </div>
      {finished && <div className="mt-4 rounded-xl border border-[#B7F36B]/25 bg-[#B7F36B]/10 p-4 text-center"><Trophy className="mx-auto h-6 w-6 text-[#B7F36B]"/><p className="mt-2 font-black text-white">{state.scores.A === state.scores.B ? 'Berabere!' : state.scores.A > state.scores.B ? 'Oyuncu 1 kazandı!' : 'Oyuncu 2 kazandı!'}</p><button onClick={reset} className="btn-primary mt-3">Yeni maç</button></div>}
      {!finished && <p className="mt-3 text-center text-xs text-white/40">{edgeCount} / 24 çizgi · Aynı cihazda 2 kişi oynayabilir.</p>}
      <div className="mt-4 flex justify-center"><button onClick={reset} className="btn-ghost px-3 py-2 text-xs"><RefreshCw className="h-4 w-4"/> Sıfırla</button></div>
    </div>
  </ArcadeFrame>;
}

export function NumberTapGame() {
  const [numbers, setNumbers] = useState(() => shuffleArray(Array.from({ length: 25 }, (_, index) => index + 1)));
  const [nextNumber, setNextNumber] = useState(1);
  const [found, setFound] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [best, setBest] = useState(() => getBestScore('number-tap', true));
  const completed = nextNumber > 25;
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  useEffect(() => {
    if (completed) { setActive(false); setBest(saveBestScore('number-tap', seconds, true)); }
  }, [completed, seconds]);
  const reset = () => { setNumbers(shuffleArray(Array.from({ length: 25 }, (_, index) => index + 1))); setNextNumber(1); setFound([]); setSeconds(0); setMistakes(0); setActive(false); };
  const tap = (number: number) => {
    if (found.includes(number) || completed) return;
    if (!active) setActive(true);
    if (number === nextNumber) { setFound((current) => [...current, number]); setNextNumber((current) => current + 1); }
    else setMistakes((current) => current + 1);
  };
  return <ArcadeFrame title="Sayı Sırası" description="Karışık tablodaki sayılara 1’den 25’e kadar sırayla dokun." icon={<MousePointer2 className="h-6 w-6" />}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="arcade-stat">Sıradaki <b>{completed ? 'Tamamlandı' : nextNumber}</b></span><span className="arcade-stat">Süre <b>{seconds} sn</b></span><span className="arcade-stat">Hata <b>{mistakes}</b></span></div>
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2 rounded-2xl border border-white/10 bg-[#0A111B] p-3">{numbers.map((number) => <button key={number} onClick={() => tap(number)} disabled={found.includes(number) || completed} className={`aspect-square rounded-xl border text-lg font-black transition active:scale-95 ${found.includes(number) ? 'border-[#B7F36B]/20 bg-[#B7F36B]/10 text-[#B7F36B]/35' : number === nextNumber ? 'border-[#B7F36B]/60 bg-[#B7F36B]/10 text-white' : 'border-white/10 bg-[#172435] text-white hover:border-[#B7F36B]/40'}`}>{found.includes(number) ? '✓' : number}</button>)}</div>
      {completed && <div className="mt-4 rounded-xl border border-[#B7F36B]/25 bg-[#B7F36B]/10 p-4 text-center"><Trophy className="mx-auto h-6 w-6 text-[#B7F36B]"/><p className="mt-2 font-black text-white">25 sayıyı tamamladın!</p><p className="text-sm text-white/60">{seconds} saniye · {mistakes} hata</p></div>}
      <div className="mt-4 flex justify-center"><button onClick={reset} className="btn-primary"><RefreshCw className="h-4 w-4"/> Yeni tablo</button></div>
      <p className="mt-3 text-center text-xs text-white/40">En iyi süre: {best === null ? '—' : `${best} saniye`}</p>
    </div>
  </ArcadeFrame>;
}

function createTenRound() {
  const first = randomInt(1, 9);
  const second = randomInt(1, 9);
  const target = first + second;
  return { target, numbers: shuffleArray([first, second, ...Array.from({ length: 8 }, () => randomInt(1, 9))]) };
}

export function TargetTenGame() {
  const [roundData, setRoundData] = useState(createTenRound);
  const [selected, setSelected] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Toplamı hedef sayıyı veren iki kart seç.');
  const [solved, setSolved] = useState(false);
  const [best, setBest] = useState(() => getBestScore('target-ten'));
  const toggle = (index: number) => { setSelected((current) => current.includes(index) ? current.filter((value) => value !== index) : current.length < 2 ? [...current, index] : [current[1], index]); setMessage('İki kartı seçtikten sonra kontrol et.'); };
  const check = () => {
    if (solved) return;
    if (selected.length !== 2) { setMessage('Önce iki kart seç.'); return; }
    const total = roundData.numbers[selected[0]] + roundData.numbers[selected[1]];
    if (total === roundData.target) {
      const nextScore = score + 10;
      setScore(nextScore); setBest(saveBestScore('target-ten', nextScore)); setSolved(true); setMessage('Doğru! Yeni hedefe geçebilirsin.');
    } else setMessage(`${roundData.numbers[selected[0]]} + ${roundData.numbers[selected[1]]} = ${total}. Bir daha dene.`);
  };
  const next = () => { setRoundData(createTenRound()); setSelected([]); setSolved(false); setRound((value) => value + 1); setMessage('Yeni sayılar hazır. İki kart seç.'); };
  return <ArcadeFrame title="Hedef Sayı" description="Kartlardan iki sayı seç. Toplamları hedef sayıya eşit olsun." icon={<Target className="h-6 w-6" />}>
    <div className="arcade-panel p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-2"><span className="arcade-stat">Tur <b>{round}</b></span><span className="arcade-stat">Puan <b>{score}</b></span><span className="arcade-stat">Rekor <b>{best ?? 0}</b></span></div>
      <div className="mx-auto mb-5 max-w-sm rounded-2xl border border-[#B7F36B]/25 bg-[#B7F36B]/10 p-5 text-center"><p className="text-xs font-bold uppercase tracking-widest text-[#B7F36B]">HEDEF SAYI</p><p className="mt-1 text-5xl font-black text-white">{roundData.target}</p></div>
      <div className="mx-auto grid max-w-sm grid-cols-4 gap-2">{roundData.numbers.map((number, index) => <button key={`${round}-${index}`} onClick={() => toggle(index)} disabled={solved} className={`aspect-square rounded-xl border text-2xl font-black transition active:scale-95 ${selected.includes(index) ? 'border-[#B7F36B] bg-[#B7F36B] text-[#0A1118]' : 'border-white/10 bg-[#172435] text-white hover:border-[#B7F36B]/45'}`}>{number}</button>)}</div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button onClick={check} disabled={solved} className="btn-primary">{solved ? 'Tamamlandı' : 'Kontrol et'}</button><button onClick={next} className="btn-ghost">Yeni tur <Plus className="h-4 w-4"/></button></div>
      <p role="status" className="mt-4 text-center text-sm text-white/65">{message}</p>
    </div>
  </ArcadeFrame>;
}

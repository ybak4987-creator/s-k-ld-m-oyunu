import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { GamesPage } from '@/pages/GamesPage';
import { TestsPage } from '@/pages/TestsPage';
import { TasksPage } from '@/pages/TasksPage';
import { FriendsPage } from '@/pages/FriendsPage';
import { AIPage } from '@/pages/AIPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { MemoryGame } from '@/components/games/MemoryGame';
import { ReactionGame } from '@/components/games/ReactionGame';
import { NumberGuessGame } from '@/components/games/NumberGuessGame';
import { WordScrambleGame, WordGuessGame, NumberSequenceGame, MathSprintGame, TrueFalseGame, WordChainGame, PatternMemoryGame, OddOneOutGame, ColorAttentionGame, CodeBreakerGame } from '@/components/games/ExpandedGames';
import { IQTestPage } from '@/pages/IQTestPage';
import { PersonalityTestPage } from '@/pages/PersonalityTestPage';
import { TriviaTestPage } from '@/pages/TriviaTestPage';
import { Game2048, TicTacToeGame, WordSearchGame, MiniMazeGame, SimonSequenceGame, RockPaperScissorsGame, MiniSudokuGame, NumberSortGame, TargetTapGame, QuickCountGame } from '@/components/games/ArcadeGames';
import { GeneratedGamePage } from '@/pages/GeneratedGamePage';
import { MinesweeperGame, SlidingPuzzleGame, ConnectFourGame, NonogramGame } from '@/components/games/ArcadeGames';
import { LightsOutGame, DotsAndBoxesGame, NumberTapGame, TargetTenGame } from '@/components/games/MoreGames';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/kesfet" element={<DiscoverPage />} />
        <Route path="/oyunlar" element={<GamesPage />} />
        <Route path="/oyunlar/memory" element={<MemoryGame />} />
        <Route path="/oyunlar/reaksiyon" element={<ReactionGame />} />
        <Route path="/oyunlar/sayi-tutma" element={<NumberGuessGame />} />
        <Route path="/oyunlar/kelime-karistir" element={<WordScrambleGame />} />
        <Route path="/oyunlar/kelimeyi-bul" element={<WordGuessGame />} />
        <Route path="/oyunlar/sayi-dizisi" element={<NumberSequenceGame />} />
        <Route path="/oyunlar/matematik-sprint" element={<MathSprintGame />} />
        <Route path="/oyunlar/dogru-yanlis" element={<TrueFalseGame />} />
        <Route path="/oyunlar/kelime-zinciri" element={<WordChainGame />} />
        <Route path="/oyunlar/desen-hafizasi" element={<PatternMemoryGame />} />
        <Route path="/oyunlar/farkli-olani-bul" element={<OddOneOutGame />} />
        <Route path="/oyunlar/renk-dikkat" element={<ColorAttentionGame />} />
        <Route path="/oyunlar/kod-kirici" element={<CodeBreakerGame />} />
        <Route path="/oyunlar/2048" element={<Game2048 />} />
        <Route path="/oyunlar/xox" element={<TicTacToeGame />} />
        <Route path="/oyunlar/kelime-avi" element={<WordSearchGame />} />
        <Route path="/oyunlar/mini-labirent" element={<MiniMazeGame />} />
        <Route path="/oyunlar/sira-sende" element={<SimonSequenceGame />} />
        <Route path="/oyunlar/tas-kagit-makas" element={<RockPaperScissorsGame />} />
        <Route path="/oyunlar/mini-sudoku" element={<MiniSudokuGame />} />
        <Route path="/oyunlar/sayi-siralama" element={<NumberSortGame />} />
        <Route path="/oyunlar/hedefi-yakala" element={<TargetTapGame />} />
        <Route path="/oyunlar/hizli-sayim" element={<QuickCountGame />} />
        <Route path="/oyunlar/mayin-tarlasi" element={<MinesweeperGame />} />
        <Route path="/oyunlar/sayi-kaydirma" element={<SlidingPuzzleGame />} />
        <Route path="/oyunlar/dort-tas" element={<ConnectFourGame />} />
        <Route path="/oyunlar/resimli-mantik" element={<NonogramGame />} />
        <Route path="/oyunlar/isiklari-sondur" element={<LightsOutGame />} />
        <Route path="/oyunlar/nokta-kutu" element={<DotsAndBoxesGame />} />
        <Route path="/oyunlar/sayi-sirasi" element={<NumberTapGame />} />
        <Route path="/oyunlar/hedef-sayi" element={<TargetTenGame />} />
        <Route path="/oyunlar/ai/:id" element={<GeneratedGamePage />} />
        <Route path="/testler" element={<TestsPage />} />
        <Route path="/testler/iq" element={<IQTestPage />} />
        <Route path="/testler/kisilik" element={<PersonalityTestPage />} />
        <Route path="/testler/genel-kultur" element={<TriviaTestPage />} />
        <Route path="/gorevler" element={<TasksPage />} />
        <Route path="/arkadaslar" element={<FriendsPage />} />
        <Route path="/yapay-zeka" element={<AIPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/liderlik" element={<LeaderboardPage />} />
        <Route path="/ayarlar" element={<SettingsPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

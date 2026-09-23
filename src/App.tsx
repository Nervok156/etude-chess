import React, { useState, useMemo, useCallback } from 'react';
import { PUZZLES } from './data/puzzles.ts';
import { Puzzle, PuzzleProgress } from './types.ts';
import {
  getStoredProgress,
  savePuzzleProgress,
  calculateProgressStats,
  resetAllProgress
} from './utils/storage.ts';
import { Navbar } from './components/Navbar.tsx';
import { PuzzleCatalog } from './components/PuzzleCatalog.tsx';
import { PuzzleSolver } from './components/PuzzleSolver.tsx';
import { StatsView } from './components/StatsView.tsx';
import { BotGame } from './components/BotGame.tsx';
import { MultiplayerGame } from './components/MultiplayerGame.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'solver' | 'stats' | 'bot' | 'multiplayer'>(() => {
    // Check if user came via room invite link (?room=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room')) return 'multiplayer';
    }
    return 'catalog';
  });
  const [activePuzzleId, setActivePuzzleId] = useState<number>(1);
  const [progressMap, setProgressMap] = useState<Record<number, PuzzleProgress>>(() =>
    getStoredProgress()
  );

  // Active puzzle object
  const activePuzzle = useMemo(() => {
    return PUZZLES.find((p) => p.id === activePuzzleId) || PUZZLES[0];
  }, [activePuzzleId]);

  // Recalculate stats dynamically
  const stats = useMemo(() => {
    return calculateProgressStats(PUZZLES);
  }, [progressMap]);

  // Select puzzle and open solver
  const handleSelectPuzzle = useCallback((puzzle: Puzzle) => {
    setActivePuzzleId(puzzle.id);
    setCurrentTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save progress
  const handleSaveProgress = useCallback(
    (puzzleId: number, solved: boolean, timeSpent: number) => {
      const updated = savePuzzleProgress(puzzleId, solved, timeSpent);
      setProgressMap((prev) => ({
        ...prev,
        [puzzleId]: updated
      }));
    },
    []
  );

  // Reset progress
  const handleResetProgress = useCallback(() => {
    resetAllProgress();
    setProgressMap({});
  }, []);

  return (
    <div className="min-h-screen bg-[#111215] text-[#e3e3e3] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        stats={stats}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <PuzzleCatalog
            puzzles={PUZZLES}
            progressMap={progressMap}
            onSelectPuzzle={handleSelectPuzzle}
          />
        )}

        {currentTab === 'solver' && (
          <PuzzleSolver
            key={activePuzzle.id}
            puzzle={activePuzzle}
            allPuzzles={PUZZLES}
            currentProgress={progressMap[activePuzzle.id]}
            onSaveProgress={handleSaveProgress}
            onBackToCatalog={() => setCurrentTab('catalog')}
            onSelectPuzzle={(p) => setActivePuzzleId(p.id)}
          />
        )}

        {currentTab === 'stats' && (
          <StatsView
            stats={stats}
            onGoToCatalog={() => setCurrentTab('catalog')}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentTab === 'bot' && (
          <BotGame onBackToCatalog={() => setCurrentTab('catalog')} />
        )}

        {currentTab === 'multiplayer' && (
          <MultiplayerGame onBackToCatalog={() => setCurrentTab('catalog')} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#23252d] bg-[#14151a] py-6 px-4 text-center text-xs text-[#717887]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>«Этюд» — Шахматный тренажёр и спарринг с ботом (800–2850 Elo).</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>
              Шахматные фигуры: <span className="text-[#a0a6b5]">Cburnett</span> (Colin M.L. Burnett, CC BY-SA 3.0)
            </span>
            <span>•</span>
            <span>ИИ-движок: Stockfish (WASM Web Worker)</span>
            <span>•</span>
            <span>chess.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

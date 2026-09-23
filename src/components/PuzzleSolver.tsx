import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Timer as TimerIcon,
  Flame
} from 'lucide-react';
import { Puzzle, PuzzleProgress } from '../types.ts';
import { Chessboard } from './Chessboard.tsx';
import { soundPlayer } from '../utils/audio.ts';

interface PuzzleSolverProps {
  puzzle: Puzzle;
  allPuzzles: Puzzle[];
  currentProgress?: PuzzleProgress;
  onSaveProgress: (puzzleId: number, solved: boolean, timeSpent: number) => void;
  onBackToCatalog: () => void;
  onSelectPuzzle: (puzzle: Puzzle) => void;
}

export const PuzzleSolver: React.FC<PuzzleSolverProps> = ({
  puzzle,
  allPuzzles,
  currentProgress,
  onSaveProgress,
  onBackToCatalog,
  onSelectPuzzle
}) => {
  // Current game state
  const [currentFen, setCurrentFen] = useState(puzzle.fen);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
    puzzle.side_to_move === 'w' ? 'white' : 'black'
  );
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Solving progress
  const [moveStep, setMoveStep] = useState(0);
  const [statusState, setStatusState] = useState<'idle' | 'wrong' | 'opponent_thinking' | 'solved'>('idle');
  const [moveHistory, setMoveHistory] = useState<{ move: string; san: string; by: 'player' | 'opponent' }[]>([]);
  const [attempts, setAttempts] = useState(currentProgress?.attempts || 0);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const opponentTimeoutRef = useRef<number | null>(null);

  const solutionMoves = React.useMemo(() => puzzle.solution.split(','), [puzzle.solution]);

  // Clean up opponent timeout on unmount
  useEffect(() => {
    return () => {
      if (opponentTimeoutRef.current) {
        clearTimeout(opponentTimeoutRef.current);
      }
    };
  }, []);

  // Timer effect: runs until puzzle is solved
  useEffect(() => {
    if (statusState === 'solved') return;
    const interval = window.setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [statusState]);

  // Reset current puzzle position
  const handleRestart = () => {
    setCurrentFen(puzzle.fen);
    setLastMove(null);
    setHintSquare(null);
    setShowHint(false);
    setMoveStep(0);
    setStatusState('idle');
    setMoveHistory([]);
  };

  // Flip board
  const toggleOrientation = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  // Trigger hint
  const handleShowHint = () => {
    setShowHint(true);
    const expected = solutionMoves[moveStep];
    if (expected) {
      setHintSquare(expected.slice(0, 2));
    }
  };

  // Player makes a move
  const handlePlayerMove = useCallback(
    (from: string, to: string, promotion: string = 'q'): boolean => {
      if (statusState === 'solved' || statusState === 'opponent_thinking') {
        return false;
      }

      const playerUci = `${from}${to}${promotion !== 'q' ? promotion : ''}`;
      const expectedUci = solutionMoves[moveStep];

      // Check if move matches expected solution
      const matchesExpected =
        playerUci === expectedUci ||
        `${from}${to}` === expectedUci ||
        (expectedUci.startsWith(`${from}${to}`) && (!promotion || promotion === 'q'));

      const chess = new Chess(currentFen);
      let moveRes = null;
      try {
        moveRes = chess.move({ from, to, promotion });
      } catch {
        return false;
      }

      if (!moveRes) return false;

      // Check if move was incorrect
      if (!matchesExpected) {
        soundPlayer.playError();
        setStatusState('wrong');
        setAttempts((prev) => prev + 1);
        onSaveProgress(puzzle.id, false, secondsElapsed);
        return false;
      }

      // Legal & Correct!
      const isCapture = !!moveRes.captured;
      if (isCapture) {
        soundPlayer.playCapture();
      } else {
        soundPlayer.playMove();
      }

      const nextFen = chess.fen();
      setCurrentFen(nextFen);
      setLastMove({ from, to });
      setHintSquare(null);

      const newHistory = [
        ...moveHistory,
        { move: `${from}-${to}`, san: moveRes.san, by: 'player' as const }
      ];
      setMoveHistory(newHistory);

      const nextStep = moveStep + 1;
      setMoveStep(nextStep);

      // Check if puzzle is solved
      if (nextStep >= solutionMoves.length) {
        soundPlayer.playSuccess();
        setStatusState('solved');
        onSaveProgress(puzzle.id, true, secondsElapsed);
        return true;
      }

      // Multi-move: opponent makes reply move
      setStatusState('opponent_thinking');
      if (opponentTimeoutRef.current) {
        clearTimeout(opponentTimeoutRef.current);
      }
      opponentTimeoutRef.current = window.setTimeout(() => {
        const opponentUci = solutionMoves[nextStep];
        if (!opponentUci) return;

        const opFrom = opponentUci.slice(0, 2);
        const opTo = opponentUci.slice(2, 4);
        const opPromo = opponentUci.length > 4 ? opponentUci.slice(4, 5) : 'q';

        const opChess = new Chess(nextFen);
        const opMoveRes = opChess.move({ from: opFrom, to: opTo, promotion: opPromo });

        if (opMoveRes) {
          if (opMoveRes.captured) soundPlayer.playCapture();
          else soundPlayer.playMove();

          setCurrentFen(opChess.fen());
          setLastMove({ from: opFrom, to: opTo });
          setMoveHistory([
            ...newHistory,
            { move: `${opFrom}-${opTo}`, san: opMoveRes.san, by: 'opponent' as const }
          ]);
          setMoveStep(nextStep + 1);
          setStatusState('idle');
        }
      }, 500);

      return true;
    },
    [currentFen, moveStep, moveHistory, puzzle.id, secondsElapsed, solutionMoves, statusState, onSaveProgress]
  );

  // Navigate to previous/next puzzle
  const currentIndex = allPuzzles.findIndex((p) => p.id === puzzle.id);
  const prevPuzzle = currentIndex > 0 ? allPuzzles[currentIndex - 1] : null;
  const nextPuzzle = currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Top Header / Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="back-to-catalog-btn"
          onClick={onBackToCatalog}
          className="flex items-center gap-2 text-xs font-semibold text-[#9ca3af] hover:text-white bg-[#1c1e24] hover:bg-[#282a32] border border-[#2d2f36] px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К списку задач</span>
        </button>

        {/* Prev / Next navigation */}
        <div className="flex items-center gap-2">
          <button
            id="prev-puzzle-btn"
            disabled={!prevPuzzle}
            onClick={() => prevPuzzle && onSelectPuzzle(prevPuzzle)}
            className="flex items-center gap-1 text-xs font-medium text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:pointer-events-none bg-[#1c1e24] border border-[#2d2f36] px-3 py-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Предыдущая</span>
          </button>
          <span className="text-xs font-bold text-white px-2">
            #{puzzle.id} <span className="text-[#646b7a]">/ {allPuzzles.length}</span>
          </span>
          <button
            id="next-puzzle-btn"
            disabled={!nextPuzzle}
            onClick={() => nextPuzzle && onSelectPuzzle(nextPuzzle)}
            className="flex items-center gap-1 text-xs font-medium text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:pointer-events-none bg-[#1c1e24] border border-[#2d2f36] px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Следующая</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chessboard */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Turn Indicator Banner above board */}
          <div className="w-full max-w-[540px] flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border shadow-sm ${
                  puzzle.side_to_move === 'w'
                    ? 'bg-white border-gray-300'
                    : 'bg-black border-gray-600'
                }`}
              />
              <span className="text-sm font-bold text-white">
                {puzzle.side_to_move === 'w' ? 'Ход белых' : 'Ход чёрных'}
              </span>
            </div>

            <button
              onClick={toggleOrientation}
              title="Перевернуть доску"
              className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-white bg-[#202228] border border-[#2e313a] px-2.5 py-1 rounded-lg transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Перевернуть</span>
            </button>
          </div>

          {/* Board Container */}
          <div className="w-full max-w-[540px]">
            <Chessboard
              fen={currentFen}
              orientation={boardOrientation}
              onMove={handlePlayerMove}
              lastMove={lastMove}
              hintSquare={hintSquare}
              disabled={statusState === 'solved' || statusState === 'opponent_thinking'}
            />
          </div>
        </div>

        {/* Right Column: Puzzle Controls & Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Puzzle Info Header Card */}
          <div className="bg-[#1a1b20] border border-[#2d2f36] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Задача #{puzzle.id}</h3>
                {puzzle.isWarmup && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    Разминка
                  </span>
                )}
              </div>

              {/* Timer badge */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c7cbd4] bg-[#242730] border border-[#323642] px-3 py-1.5 rounded-lg">
                <TimerIcon className="w-3.5 h-3.5 text-[#779556]" />
                <span>{formatTime(secondsElapsed)}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-[#c5cbd6] bg-[#262832] px-3 py-1 rounded-lg border border-[#333744]">
                {puzzle.theme}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                  puzzle.difficulty === 'Лёгкая'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                    : puzzle.difficulty === 'Средняя'
                    ? 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                    : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                }`}
              >
                {puzzle.difficulty}
              </span>
            </div>

            {/* Status notification box */}
            <div className="mt-4">
              {statusState === 'solved' ? (
                <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-4 flex items-center gap-3 text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-200">
                      Правильно! Задача решена!
                    </h4>
                    <p className="text-xs text-emerald-400/90 mt-0.5">
                      Время: {secondsElapsed} сек. {attempts > 0 ? `Попыток: ${attempts}` : ''}
                    </p>
                  </div>
                </div>
              ) : statusState === 'wrong' ? (
                <div className="bg-rose-950/70 border border-rose-500/60 rounded-xl p-4 flex items-center gap-3 text-rose-300 animate-in shake">
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-200">Неверный ход!</h4>
                    <p className="text-xs text-rose-400/90 mt-0.5">
                      Позиция сброшена на шаг назад. Попробуйте еще раз!
                    </p>
                  </div>
                </div>
              ) : statusState === 'opponent_thinking' ? (
                <div className="bg-[#242630] border border-[#3a3d4d] rounded-xl p-4 text-xs text-[#9ca3af] flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#779556] animate-pulse" />
                  <span>Верно! Соперник делает ответный ход...</span>
                </div>
              ) : (
                <div className="bg-[#22242c] border border-[#31343f] rounded-xl p-4 text-xs text-[#a0a7b4]">
                  Найдите лучший ход в позиции за{' '}
                  <strong className="text-white">
                    {puzzle.side_to_move === 'w' ? 'белых' : 'чёрных'}
                  </strong>
                  .
                </div>
              )}
            </div>

            {/* Hint Card */}
            {showHint && (
              <div className="mt-4 p-4 rounded-xl bg-[#28251e] border border-amber-600/40 text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1 text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Подсказка</span>
                </div>
                <p>{puzzle.hint}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                id="puzzle-hint-btn"
                onClick={handleShowHint}
                disabled={showHint || statusState === 'solved'}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#24262f] hover:bg-[#2d303b] disabled:opacity-50 text-[#c5cbd6] border border-[#353846] transition-colors"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{showHint ? 'Подсказка дана' : 'Подсказка'}</span>
              </button>

              <button
                id="puzzle-restart-btn"
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#24262f] hover:bg-[#2d303b] text-[#c5cbd6] border border-[#353846] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Начать заново</span>
              </button>
            </div>

            {/* Next Puzzle CTA upon solve */}
            {statusState === 'solved' && nextPuzzle && (
              <div className="mt-4">
                <button
                  id="solve-next-btn"
                  onClick={() => onSelectPuzzle(nextPuzzle)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-[#779556] hover:bg-[#68844b] text-white shadow-lg shadow-[#779556]/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Следующая задача</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Move History Card */}
          <div className="bg-[#1a1b20] border border-[#2d2f36] rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold text-[#8f96a3] uppercase tracking-wider mb-3">
              История ходов в задаче
            </h4>
            {moveHistory.length === 0 ? (
              <p className="text-xs text-[#636977] italic">Сделайте первый ход на доске...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {moveHistory.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
                      item.by === 'player'
                        ? 'bg-[#293223] text-emerald-300 border-[#3d4d33]'
                        : 'bg-[#282a32] text-gray-300 border-[#3a3e4c]'
                    }`}
                  >
                    {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : '... '}
                    {item.san || item.move}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

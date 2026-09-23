import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import {
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  Swords,
  Award,
  ChevronRight,
  Sparkles,
  Bot,
  User,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Lock,
  Settings2,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Chessboard } from './Chessboard.tsx';
import { ChessPieceSvg } from './ChessPieceSvg.tsx';
import {
  stockfish,
  BOT_LEVELS,
  SkillLevel,
  SkillConfig,
  EngineEvaluation
} from '../utils/stockfish.ts';
import { soundPlayer } from '../utils/audio.ts';

interface BotGameProps {
  onBackToCatalog?: () => void;
}

export const BotGame: React.FC<BotGameProps> = () => {
  // Game setup
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(2);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [gameFen, setGameFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [moveHistory, setMoveHistory] = useState<{ san: string; from: string; to: string; color: 'w' | 'b' }[]>([]);

  // Engine state
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(stockfish.ready);
  const [evaluation, setEvaluation] = useState<EngineEvaluation | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showSettingsDuringGame, setShowSettingsDuringGame] = useState(false);
  const [gameResult, setGameResult] = useState<{
    status: 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';
    winner: 'player' | 'bot' | 'draw' | null;
    message: string;
  }>({ status: 'playing', winner: null, message: '' });

  // Clocks
  const [playerTime, setPlayerTime] = useState<number>(600); // 10 minutes
  const [botTime, setBotTime] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Turn status
  const currentChess = React.useMemo(() => {
    try {
      return new Chess(gameFen);
    } catch {
      return new Chess();
    }
  }, [gameFen]);

  const activeTurn = currentChess.turn(); // 'w' | 'b'
  const isPlayerTurn = (playerColor === 'white' && activeTurn === 'w') || (playerColor === 'black' && activeTurn === 'b');
  const activeBotConfig = BOT_LEVELS[selectedLevel];
  const isGameInProgress = gameResult.status === 'playing' && (moveHistory.length > 0 || isBotThinking);

  // Captured pieces calculation
  const capturedPieces = React.useMemo(() => {
    const startPieces: Record<string, number> = {
      p: 8, r: 2, n: 2, b: 2, q: 1, k: 1,
      P: 8, R: 2, N: 2, B: 2, Q: 1, K: 1
    };
    const board = currentChess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) {
          const key = p.color === 'w' ? p.type.toUpperCase() : p.type.toLowerCase();
          startPieces[key] = (startPieces[key] || 0) - 1;
        }
      }
    }
    const whiteLost: string[] = [];
    const blackLost: string[] = [];
    (['P', 'N', 'B', 'R', 'Q'] as const).forEach((type) => {
      const count = Math.max(0, startPieces[type] || 0);
      for (let i = 0; i < count; i++) whiteLost.push(type);
    });
    (['p', 'n', 'b', 'r', 'q'] as const).forEach((type) => {
      const count = Math.max(0, startPieces[type] || 0);
      for (let i = 0; i < count; i++) blackLost.push(type);
    });
    return { whiteLost, blackLost };
  }, [currentChess]);

  // Handle Game over checks
  const checkGameOver = useCallback((chessInstance: Chess) => {
    if (chessInstance.isCheckmate()) {
      const winner = chessInstance.turn() === (playerColor === 'white' ? 'w' : 'b') ? 'bot' : 'player';
      setGameResult({
        status: 'checkmate',
        winner,
        message: winner === 'player' ? 'Мат! Вы одержали победу над ботом! 🎉' : 'Мат! Бот победил в этой партии.'
      });
      setIsTimerRunning(false);
      return true;
    }
    if (chessInstance.isStalemate()) {
      setGameResult({
        status: 'stalemate',
        winner: 'draw',
        message: 'Пат! Ничья.'
      });
      setIsTimerRunning(false);
      return true;
    }
    if (chessInstance.isDraw()) {
      setGameResult({
        status: 'draw',
        winner: 'draw',
        message: 'Ничья (троекратное повторение или недостаточность материала).'
      });
      setIsTimerRunning(false);
      return true;
    }
    return false;
  }, [playerColor]);

  // Restart / New Game
  const startNewGame = useCallback((color: 'white' | 'black' = playerColor, level: SkillLevel = selectedLevel) => {
    stockfish.stop();
    const fresh = new Chess();
    setGameFen(fresh.fen());
    setPlayerColor(color);
    setBoardOrientation(color);
    setSelectedLevel(level);
    setLastMove(null);
    setMoveHistory([]);
    setEvaluation(null);
    setIsBotThinking(false);
    setPlayerTime(600);
    setBotTime(600);
    setIsTimerRunning(true);
    setShowSettingsDuringGame(false);
    setGameResult({ status: 'playing', winner: null, message: '' });
  }, [playerColor, selectedLevel]);

  // Subscribe to Stockfish engine ready status
  useEffect(() => {
    const unsub = stockfish.onReadyStatusChange((ready) => {
      setIsEngineReady(ready);
    });
    return () => {
      unsub();
    };
  }, []);

  // Trigger bot turn if needed
  useEffect(() => {
    if (gameResult.status !== 'playing') return;

    // Check if it's bot's turn
    const isBot = (playerColor === 'white' && activeTurn === 'b') || (playerColor === 'black' && activeTurn === 'w');
    if (!isBot) return;

    let isCancelled = false;
    setIsBotThinking(true);

    const makeBotMove = async () => {
      try {
        const botConfig = BOT_LEVELS[selectedLevel];
        const res = await stockfish.getBestMove(gameFen, botConfig, (evalInfo) => {
          if (!isCancelled) {
            setEvaluation(evalInfo);
          }
        });

        if (isCancelled) return;

        if (!res.from || !res.to) {
          setIsBotThinking(false);
          return;
        }

        const chess = new Chess(gameFen);
        let moveRes = null;
        try {
          moveRes = chess.move({
            from: res.from,
            to: res.to,
            promotion: res.promotion || 'q'
          });
        } catch (moveErr) {
          console.warn('[BotGame] Bot move failed, trying legal fallback:', moveErr);
          const legalMoves = chess.moves({ verbose: true });
          if (legalMoves.length > 0) {
            const fallbackPick = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            moveRes = chess.move(fallbackPick);
          }
        }

        if (moveRes && !isCancelled) {
          if (soundEnabled) {
            if (moveRes.captured) soundPlayer.playCapture();
            else soundPlayer.playMove();
          }

          const nextFen = chess.fen();
          setGameFen(nextFen);
          setLastMove({ from: moveRes.from, to: moveRes.to });
          setMoveHistory((prev) => [
            ...prev,
            { san: moveRes.san, from: moveRes.from, to: moveRes.to, color: moveRes.color }
          ]);

          checkGameOver(chess);
        }
      } catch (err) {
        console.error('Error getting move from bot engine:', err);
      } finally {
        if (!isCancelled) {
          setIsBotThinking(false);
        }
      }
    };

    const timer = window.setTimeout(() => {
      makeBotMove();
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [gameFen, activeTurn, playerColor, selectedLevel, gameResult.status, checkGameOver, soundEnabled]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || gameResult.status !== 'playing') return;

    const interval = window.setInterval(() => {
      if (isPlayerTurn) {
        setPlayerTime((prev) => {
          if (prev <= 1) {
            setGameResult({
              status: 'resigned',
              winner: 'bot',
              message: 'Время вышло! Бот победил по времени.'
            });
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBotTime((prev) => {
          if (prev <= 1) {
            setGameResult({
              status: 'resigned',
              winner: 'player',
              message: 'У бота вышло время! Вы победили по времени.'
            });
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPlayerTurn, gameResult.status]);

  // Live evaluation when player is thinking
  useEffect(() => {
    if (!showAnalysis || gameResult.status !== 'playing' || !isPlayerTurn || isBotThinking) {
      stockfish.stop();
      return;
    }

    const unsub = stockfish.analyze(gameFen, (evalInfo) => {
      setEvaluation(evalInfo);
    });

    return () => {
      unsub();
    };
  }, [gameFen, showAnalysis, gameResult.status, isPlayerTurn, isBotThinking]);

  // Handle Player move
  const handlePlayerMove = (from: string, to: string, promotion: string = 'q'): boolean => {
    if (gameResult.status !== 'playing' || !isPlayerTurn || isBotThinking) {
      return false;
    }

    const chess = new Chess(gameFen);
    let moveRes = null;
    try {
      moveRes = chess.move({ from, to, promotion });
    } catch {
      return false;
    }

    if (!moveRes) return false;

    if (soundEnabled) {
      if (moveRes.captured) soundPlayer.playCapture();
      else soundPlayer.playMove();
    }

    const nextFen = chess.fen();
    setGameFen(nextFen);
    setLastMove({ from, to });
    setMoveHistory((prev) => [
      ...prev,
      { san: moveRes.san, from, to, color: moveRes.color }
    ]);

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    checkGameOver(chess);
    return true;
  };

  // Resign game
  const handleResign = () => {
    if (gameResult.status !== 'playing') return;
    setGameResult({
      status: 'resigned',
      winner: 'bot',
      message: 'Вы сдались. Игра завершена.'
    });
    setIsTimerRunning(false);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Convert evaluation into display percentage / score
  const evalDisplay = React.useMemo(() => {
    if (!evaluation || !evaluation.score) return { text: '0.0', pct: 50 };

    if (evaluation.score.type === 'mate') {
      const moves = evaluation.score.value;
      const text = `М${Math.abs(moves)}`;
      const pct = moves > 0 ? 100 : 0;
      return { text, pct };
    }

    // Centipawns from current side or white
    // Stockfish outputs score relative to side to move!
    // Let's normalize score so positive = White advantage
    const rawCp = evaluation.score.value;
    const sideScore = activeTurn === 'w' ? rawCp : -rawCp;
    const pawns = (sideScore / 100).toFixed(1);
    const text = sideScore > 0 ? `+${pawns}` : pawns;

    // Logistic curve for eval bar 0-100%
    // 1 / (1 + 10^(-score/400))
    const winProb = 1 / (1 + Math.pow(10, -sideScore / 400));
    const pct = Math.min(96, Math.max(4, Math.round(winProb * 100)));

    return { text, pct };
  }, [evaluation, activeTurn]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#24262f]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#779556]/20 text-[#779556]">
              <Swords className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Игра против Stockfish WASM
            </h2>
            {isEngineReady ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stockfish готов к игре</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Запуск Stockfish в Web Worker...</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#8f96a3] mt-1">
            Официальный шахматный движок Stockfish рассчитывает ходы прямо в вашем браузере в отдельном потоке.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
              soundEnabled
                ? 'bg-[#22242c] text-white border-[#333742]'
                : 'bg-[#18191d] text-[#6b7280] border-[#262833]'
            }`}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowAnalysis((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
              showAnalysis
                ? 'bg-[#779556]/20 text-emerald-400 border-[#779556]/40'
                : 'bg-[#22242c] text-[#9ca3af] border-[#333742]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{showAnalysis ? 'Анализ вкл.' : 'Анализ выкл.'}</span>
          </button>

          <button
            type="button"
            onClick={() => startNewGame()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#779556] hover:bg-[#688349] text-white text-xs font-semibold shadow-md transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            <span>Новая игра</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Board & Player headers */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Opponent (Bot) status bar */}
          <div className="w-full max-w-[620px] bg-[#1a1c23] border border-[#272a33] rounded-t-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#272a34] border border-[#373b48] flex items-center justify-center text-lg shadow-inner">
                {activeBotConfig.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {activeBotConfig.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8e95a5] px-1.5 py-0.5 rounded bg-[#252833]">
                    {activeBotConfig.elo} Elo
                  </span>
                  {isBotThinking && (
                    <span className="text-[11px] text-amber-400 font-medium animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      Думает...
                    </span>
                  )}
                </div>
                {/* Captured by bot */}
                <div className="flex items-center gap-0.5 h-4 mt-0.5">
                  {(playerColor === 'white' ? capturedPieces.whiteLost : capturedPieces.blackLost).map((pt, i) => (
                    <div key={i} className="w-3.5 h-3.5 opacity-80">
                      <ChessPieceSvg piece={pt} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Opponent Clock */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider ${
                !isPlayerTurn && isTimerRunning
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-[#14151a] text-[#8e95a5] border-[#272a33]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(botTime)}</span>
            </div>
          </div>

          {/* Board with live evaluation bar */}
          <div className="w-full max-w-[620px] flex gap-2">
            {/* Evaluation Bar */}
            {showAnalysis && (
              <div className="w-4 bg-[#1b1c22] rounded-l border border-[#2b2e38] flex flex-col justify-end overflow-hidden relative shadow-inner">
                <div
                  className="w-full bg-white transition-all duration-300 ease-out"
                  style={{ height: `${boardOrientation === 'white' ? evalDisplay.pct : 100 - evalDisplay.pct}%` }}
                />
                <span className="absolute bottom-1 left-0 right-0 text-[8px] font-bold text-center text-black/80 pointer-events-none select-none">
                  {evalDisplay.text}
                </span>
              </div>
            )}

            {/* Chessboard */}
            <div className="flex-1">
              <Chessboard
                fen={gameFen}
                orientation={boardOrientation}
                onMove={handlePlayerMove}
                disabled={gameResult.status !== 'playing' || isBotThinking || !isPlayerTurn}
                lastMove={lastMove}
                className="w-full"
              />
            </div>
          </div>

          {/* Player status bar */}
          <div className="w-full max-w-[620px] bg-[#1a1c23] border border-[#272a33] rounded-b-xl px-4 py-3 flex items-center justify-between mt-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#272a34] border border-[#373b48] flex items-center justify-center text-sm shadow-inner text-emerald-400 font-bold">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Вы ({playerColor === 'white' ? 'Белые' : 'Чёрные'})</span>
                  {isPlayerTurn && gameResult.status === 'playing' && (
                    <span className="text-[11px] text-emerald-400 font-medium">Ваш ход</span>
                  )}
                </div>
                {/* Captured by player */}
                <div className="flex items-center gap-0.5 h-4 mt-0.5">
                  {(playerColor === 'white' ? capturedPieces.blackLost : capturedPieces.whiteLost).map((pt, i) => (
                    <div key={i} className="w-3.5 h-3.5 opacity-80">
                      <ChessPieceSvg piece={pt} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player Clock */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider ${
                isPlayerTurn && isTimerRunning
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-[#14151a] text-[#8e95a5] border-[#272a33]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(playerTime)}</span>
            </div>
          </div>

          {/* Game Over Banner */}
          {gameResult.status !== 'playing' && (
            <div className="w-full max-w-[620px] mt-4 p-4 rounded-xl bg-[#222530] border border-[#383d4e] shadow-xl flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">{gameResult.message}</div>
                <div className="text-xs text-[#959dae] mt-0.5">
                  Хотите сыграть ещё одну партию или изменить сложность?
                </div>
              </div>
              <button
                type="button"
                onClick={() => startNewGame()}
                className="px-4 py-2 rounded-lg bg-[#779556] hover:bg-[#688349] text-white text-xs font-bold transition-all shadow-md"
              >
                Сыграть снова
              </button>
            </div>
          )}
        </div>

        {/* Right column: Bot Difficulty, Moves, Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Stockfish Engine Health / Worker Status */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isEngineReady
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {isEngineReady ? <Cpu className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Движок Stockfish WASM</span>
                </div>
                <div className="text-[11px] text-[#8e95a5]">
                  {isEngineReady ? 'Инициализирован и активен' : 'Загрузка WebAssembly...'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isEngineReady ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400 animate-ping'}`} />
              <span className={`text-[11px] font-semibold ${isEngineReady ? 'text-emerald-400' : 'text-amber-300'}`}>
                {isEngineReady ? 'Готов' : 'Загрузка'}
              </span>
            </div>
          </div>

          {/* If game is in progress and settings are closed, hide difficulty & sides panels */}
          {isGameInProgress && !showSettingsDuringGame ? (
            <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded bg-[#779556]/20 text-[#779556]">
                    <Swords className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Партия в процессе
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-[#8e95a5] bg-[#22242d] px-2 py-0.5 rounded-full border border-[#2e323e]">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Параметры зафиксированы</span>
                </span>
              </div>

              {/* Match snapshot */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#232630]">
                  <div className="text-[10px] uppercase tracking-wider text-[#6d7586] font-semibold">
                    Бот
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                    <span>{activeBotConfig.avatar}</span>
                    <span className="truncate">{activeBotConfig.name}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    {activeBotConfig.elo} Elo • {activeBotConfig.depth} п/х
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#14151a] border border-[#232630]">
                  <div className="text-[10px] uppercase tracking-wider text-[#6d7586] font-semibold">
                    Ваша сторона
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                    <span>{playerColor === 'white' ? '♔ Белые' : '♚ Чёрные'}</span>
                  </div>
                  <div className="text-[10px] text-[#8e95a5] mt-0.5">
                    {playerColor === 'white' ? 'Первый ход' : 'Ход вторым'}
                  </div>
                </div>
              </div>

              {/* In-game quick actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#252833]">
                <button
                  type="button"
                  onClick={() => setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'))}
                  className="flex-1 py-1.5 rounded-lg bg-[#20222a] hover:bg-[#282b35] border border-[#2e313d] text-xs text-[#9ca3af] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Перевернуть</span>
                </button>
                <button
                  type="button"
                  disabled={gameResult.status !== 'playing'}
                  onClick={handleResign}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-xs text-red-300 font-semibold disabled:opacity-40 transition-colors"
                >
                  Сдаться
                </button>
              </div>

              {/* Optional toggle if user wants to change difficulty/side during game */}
              <button
                type="button"
                onClick={() => setShowSettingsDuringGame(true)}
                className="text-[11px] text-[#788092] hover:text-[#a0a8b9] flex items-center justify-center gap-1 mt-0.5 transition-colors py-1"
              >
                <Settings2 className="w-3 h-3" />
                <span>Открыть настройки сложности и сторон</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              {/* Difficulty selector card */}
              <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9aa2b1] flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#779556]" />
                    Уровень сложности бота
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {activeBotConfig.elo} Elo
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {([1, 2, 3, 4, 5, 6, 7, 8] as SkillLevel[]).map((lvl) => {
                    const conf = BOT_LEVELS[lvl];
                    const isSel = selectedLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setSelectedLevel(lvl);
                          stockfish.setSkillLevel(conf);
                        }}
                        className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isSel
                            ? 'bg-[#779556] text-white border-[#84a560] shadow-md scale-[1.02]'
                            : 'bg-[#1f2129] text-[#8e95a5] border-[#2e313d] hover:bg-[#272a34] hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{lvl}</span>
                        <span className="text-[10px] opacity-80">{conf.elo}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-[#14151a] border border-[#232630] text-xs">
                  <div className="flex items-center gap-2 text-white font-semibold mb-1">
                    <span>{activeBotConfig.avatar}</span>
                    <span>{activeBotConfig.name}</span>
                    <span className="text-[10px] text-[#717887]">Глубина: {activeBotConfig.depth} п/х</span>
                  </div>
                  <p className="text-[#8e95a5] leading-relaxed text-[11px]">
                    {activeBotConfig.description}
                  </p>
                </div>
              </div>

              {/* Color & Board controls card */}
              <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9aa2b1]">
                  Сторона игры
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => startNewGame('white')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      playerColor === 'white'
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-[#22242d] text-[#9ca3af] border-[#313542] hover:text-white'
                    }`}
                  >
                    <span>Белые ♔</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startNewGame('black')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      playerColor === 'black'
                        ? 'bg-[#0f1013] text-white border-[#3f4350] shadow-md'
                        : 'bg-[#22242d] text-[#9ca3af] border-[#313542] hover:text-white'
                    }`}
                  >
                    <span>Чёрные ♚</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#252833]">
                  <button
                    type="button"
                    onClick={() => setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'))}
                    className="flex-1 py-1.5 rounded-lg bg-[#20222a] hover:bg-[#282b35] border border-[#2e313d] text-xs text-[#9ca3af] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Перевернуть доску</span>
                  </button>
                  <button
                    type="button"
                    disabled={gameResult.status !== 'playing'}
                    onClick={handleResign}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-xs text-red-300 font-semibold disabled:opacity-40 transition-colors"
                  >
                    Сдаться
                  </button>
                </div>

                {isGameInProgress && (
                  <button
                    type="button"
                    onClick={() => setShowSettingsDuringGame(false)}
                    className="text-[11px] text-[#788092] hover:text-[#a0a8b9] flex items-center justify-center gap-1 pt-1 transition-colors"
                  >
                    <span>Скрыть панели настроек на время игры</span>
                    <ChevronUp className="w-3 h-3" />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Move list & Live Stockfish stats */}
          <div className="bg-[#18191f] border border-[#282b35] rounded-xl p-4 shadow-lg flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262832]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9aa2b1]">
                Ходы партии ({moveHistory.length})
              </span>
              {evaluation && (
                <span className="text-[11px] font-mono text-[#8f96a3]">
                  d={evaluation.depth} | {evaluation.nodes ? `${Math.round(evaluation.nodes / 1000)}k n` : ''}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[260px] text-xs font-mono space-y-1 pr-1">
              {moveHistory.length === 0 ? (
                <div className="text-center py-8 text-[#616876] text-xs">
                  Партия началась. Сделайте первый ход!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {moveHistory.map((m, idx) => {
                    const moveNumber = Math.floor(idx / 2) + 1;
                    const isWhite = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded flex items-center justify-between ${
                          idx === moveHistory.length - 1 ? 'bg-[#292c37] text-white font-bold' : 'text-[#a2a9b7]'
                        }`}
                      >
                        <span className="text-[#646a78]">{isWhite ? `${moveNumber}.` : ''}</span>
                        <span>{m.san}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Best line preview if analysis enabled */}
            {showAnalysis && evaluation?.pv && evaluation.pv.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#262832] text-[11px] text-[#7d8494] flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-[#779556] font-semibold">Линия:</span>
                <span className="font-mono text-[#a5acbc]">{evaluation.pv.slice(0, 4).join(' ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

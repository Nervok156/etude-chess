import React, { useState, useMemo } from 'react';
import { CheckCircle2, CircleDot, Play, Flame, Search, Filter } from 'lucide-react';
import { Puzzle, PuzzleProgress } from '../types.ts';
import { Chessboard } from './Chessboard.tsx';

interface PuzzleCatalogProps {
  puzzles: Puzzle[];
  progressMap: Record<number, PuzzleProgress>;
  onSelectPuzzle: (puzzle: Puzzle) => void;
}

const THEMES = [
  'Все темы',
  'Мат в 1',
  'Мат в 2',
  'Последняя горизонталь',
  'Вилка',
  'Связка',
  'Висячая фигура',
  'Вскрытое нападение',
  'Линейный удар'
];

const DIFFICULTIES = ['Все', 'Лёгкая', 'Средняя', 'Сложная'];
const STATUS_OPTIONS = ['Все', 'Нерешённые', 'Решённые'];

export const PuzzleCatalog: React.FC<PuzzleCatalogProps> = ({
  puzzles,
  progressMap,
  onSelectPuzzle
}) => {
  const [selectedTheme, setSelectedTheme] = useState('Все темы');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Все');
  const [selectedStatus, setSelectedStatus] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate count for each theme
  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Все темы': puzzles.length };
    THEMES.slice(1).forEach((th) => {
      counts[th] = puzzles.filter((p) => p.theme === th).length;
    });
    return counts;
  }, [puzzles]);

  // Filter puzzles
  const filteredPuzzles = useMemo(() => {
    return puzzles.filter((p) => {
      // Theme filter
      if (selectedTheme !== 'Все темы' && p.theme !== selectedTheme) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'Все' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      // Status filter
      const isSolved = progressMap[p.id]?.solved;
      if (selectedStatus === 'Решённые' && !isSolved) return false;
      if (selectedStatus === 'Нерешённые' && isSolved) return false;

      // Search query (number or hint or theme)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = p.id.toString() === q || `задача ${p.id}`.includes(q);
        const matchesTheme = p.theme.toLowerCase().includes(q);
        const matchesHint = p.hint.toLowerCase().includes(q);
        if (!matchesId && !matchesTheme && !matchesHint) {
          return false;
        }
      }

      return true;
    });
  }, [puzzles, progressMap, selectedTheme, selectedDifficulty, selectedStatus, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Intro Header */}
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
          Каталог шахматных задач
        </h2>
        <p className="text-sm text-[#9ca3af] max-w-2xl">
          Практикуйте тактические приёмы и матовые конструкции для рейтинга 800–1600.
          Все ходы проверяются по правилам шахмат.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#1a1b20] border border-[#2d2f36] rounded-2xl p-4 lg:p-6 mb-8 space-y-5 shadow-lg">
        {/* Theme Pills Carousel */}
        <div>
          <label className="text-xs font-semibold text-[#8f96a3] uppercase tracking-wider block mb-2.5">
            Тема задачи
          </label>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => {
              const active = selectedTheme === theme;
              const count = themeCounts[theme] || 0;
              return (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#779556] text-white shadow-md font-semibold'
                      : 'bg-[#24262d] text-[#9ca3af] hover:text-white hover:bg-[#2e313a] border border-[#343742]'
                  }`}
                >
                  <span>{theme}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-black/25 text-white' : 'bg-[#1a1b20] text-[#787f8d]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary filters row: Difficulty + Status + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#272930]">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8f96a3] font-medium mr-1">Сложность:</span>
            {DIFFICULTIES.map((diff) => {
              const active = selectedDifficulty === diff;
              let colorClass = 'border-[#343742] text-[#9ca3af] bg-[#24262d]';
              if (active) {
                if (diff === 'Лёгкая') colorClass = 'bg-emerald-600 text-white border-emerald-500';
                else if (diff === 'Средняя') colorClass = 'bg-amber-600 text-white border-amber-500';
                else if (diff === 'Сложная') colorClass = 'bg-rose-600 text-white border-rose-500';
                else colorClass = 'bg-[#779556] text-white border-[#779556]';
              }
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${colorClass}`}
                >
                  {diff}
                </button>
              );
            })}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8f96a3] font-medium mr-1">Статус:</span>
            {STATUS_OPTIONS.map((status) => {
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                    active
                      ? 'bg-[#373a46] text-white border-[#4d5162]'
                      : 'border-[#343742] text-[#9ca3af] bg-[#24262d] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#717887] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Номер или тема..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#202227] border border-[#343742] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#686f7c] focus:outline-none focus:border-[#779556]"
            />
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#8f96a3]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" />
          <span>
            Показано задач: <strong className="text-white font-semibold">{filteredPuzzles.length}</strong> из {puzzles.length}
          </span>
        </div>
        {filteredPuzzles.length === 0 && (
          <button
            onClick={() => {
              setSelectedTheme('Все темы');
              setSelectedDifficulty('Все');
              setSelectedStatus('Все');
              setSearchQuery('');
            }}
            className="text-[#779556] hover:underline"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Grid of Puzzle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPuzzles.map((puzzle) => {
          const prog = progressMap[puzzle.id];
          const isSolved = prog?.solved;

          // Difficulty pill color
          let diffBadge = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
          if (puzzle.difficulty === 'Средняя') {
            diffBadge = 'bg-amber-950/70 text-amber-300 border-amber-800/60';
          } else if (puzzle.difficulty === 'Сложная') {
            diffBadge = 'bg-rose-950/70 text-rose-300 border-rose-800/60';
          }

          return (
            <div
              key={puzzle.id}
              id={`puzzle-card-${puzzle.id}`}
              onClick={() => onSelectPuzzle(puzzle)}
              className={`group relative bg-[#1c1e24] border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                isSolved
                  ? 'border-[#38482c] hover:border-[#779556]'
                  : 'border-[#2c2f38] hover:border-[#424654]'
              }`}
            >
              {/* Card Top: Number, Warmup & Solved Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white tracking-wide">
                      Задача #{puzzle.id}
                    </span>
                    {puzzle.isWarmup && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        Разминка
                      </span>
                    )}
                  </div>

                  {isSolved ? (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Решено</span>
                    </div>
                  ) : prog?.attempts ? (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full">
                      <CircleDot className="w-3 h-3" />
                      <span>Попыток: {prog.attempts}</span>
                    </div>
                  ) : null}
                </div>

                {/* Mini Preview Board */}
                <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden border border-[#2e313a] group-hover:border-[#779556]/50 transition-colors">
                  <Chessboard
                    fen={puzzle.fen}
                    orientation={puzzle.side_to_move === 'w' ? 'white' : 'black'}
                    isMini={true}
                    disabled={true}
                  />
                </div>

                {/* Badges: Theme & Difficulty */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#c5cbd6] bg-[#272a33] px-2.5 py-1 rounded-md border border-[#343844] truncate">
                    {puzzle.theme}
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${diffBadge}`}>
                    {puzzle.difficulty}
                  </span>
                </div>

                {/* Side to move banner */}
                <div className="flex items-center gap-2 text-xs text-[#8f96a3] mb-4">
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      puzzle.side_to_move === 'w'
                        ? 'bg-white border-gray-300 shadow-sm'
                        : 'bg-black border-gray-600'
                    }`}
                  />
                  <span>{puzzle.side_to_move === 'w' ? 'Ход белых' : 'Ход чёрных'}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPuzzle(puzzle);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 ${
                  isSolved
                    ? 'bg-[#2b2e37] hover:bg-[#383c48] text-[#c5cbd6]'
                    : 'bg-[#779556] hover:bg-[#68844b] text-white shadow-md shadow-[#779556]/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSolved ? 'Решить снова' : 'Решать задачу'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

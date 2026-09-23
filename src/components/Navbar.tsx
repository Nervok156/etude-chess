import React from 'react';
import { LayoutGrid, Play, BarChart2, Award, RotateCcw, Swords, Users } from 'lucide-react';
import { ProgressStats } from '../types.ts';

interface NavbarProps {
  currentTab: 'catalog' | 'solver' | 'stats' | 'bot' | 'multiplayer';
  onSelectTab: (tab: 'catalog' | 'solver' | 'stats' | 'bot' | 'multiplayer') => void;
  stats: ProgressStats;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  onResetProgress
}) => {
  const [confirmReset, setConfirmReset] = React.useState(false);

  const pct = Math.round((stats.solved_count / stats.total) * 100) || 0;

  return (
    <header className="sticky top-0 z-50 bg-[#18191c]/95 backdrop-blur border-b border-[#2d2f36] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('catalog')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#779556] to-[#55703b] flex items-center justify-center shadow-lg shadow-[#779556]/20">
            <span className="text-2xl font-bold text-white leading-none select-none">♞</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Этюд
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2b2d35] text-[#9ca3af] border border-[#3b3e4a]">
                Тренажёр
              </span>
            </div>
            <p className="text-xs text-[#8f96a3]">Шахматные задачи 800–1600</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-[#202227] p-1 rounded-xl border border-[#2e313a] shadow-inner">
          <button
            id="nav-catalog-tab"
            onClick={() => onSelectTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentTab === 'catalog'
                ? 'bg-[#779556] text-white shadow-md'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#282a31]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Каталог</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/25">
              {stats.total}
            </span>
          </button>

          <button
            id="nav-solver-tab"
            onClick={() => onSelectTab('solver')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentTab === 'solver'
                ? 'bg-[#779556] text-white shadow-md'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#282a31]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Тренажёр</span>
          </button>

          <button
            id="nav-bot-tab"
            onClick={() => onSelectTab('bot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentTab === 'bot'
                ? 'bg-[#779556] text-white shadow-md'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#282a31]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Игра с ботом</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              WASM
            </span>
          </button>

          <button
            id="nav-multiplayer-tab"
            onClick={() => onSelectTab('multiplayer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentTab === 'multiplayer'
                ? 'bg-[#779556] text-white shadow-md'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#282a31]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Онлайн 1 на 1</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Live
            </span>
          </button>

          <button
            id="nav-stats-tab"
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentTab === 'stats'
                ? 'bg-[#779556] text-white shadow-md'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#282a31]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Статистика</span>
          </button>
        </nav>

        {/* Header Progress Counter & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-[#202227] px-3 py-1.5 rounded-xl border border-[#2e313a]">
            <Award className="w-4 h-4 text-[#779556]" />
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-tight">
                {stats.solved_count} <span className="text-[#6c7280]">/ {stats.total}</span>
              </div>
              <div className="text-[10px] text-[#9ca3af] font-medium leading-none">
                {pct}% решено
              </div>
            </div>
            {/* Mini circular progress bar */}
            <div className="w-6 h-6 rounded-full border-2 border-[#2d2f36] border-t-[#779556] relative flex items-center justify-center">
              <span className="text-[9px] font-bold text-[#779556]">{pct}%</span>
            </div>
          </div>

          {/* Reset progress button */}
          <div className="relative">
            {confirmReset ? (
              <div className="flex items-center gap-1.5 bg-[#281b1b] border border-red-500/40 px-2 py-1 rounded-lg">
                <span className="text-[11px] text-red-300">Сбросить?</span>
                <button
                  id="confirm-reset-btn"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded"
                >
                  Да
                </button>
                <button
                  id="cancel-reset-btn"
                  onClick={() => setConfirmReset(false)}
                  className="px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] rounded"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                id="header-reset-progress-btn"
                title="Сбросить прогресс"
                onClick={() => setConfirmReset(true)}
                className="p-2 text-[#717887] hover:text-red-400 hover:bg-[#202227] rounded-lg transition-colors border border-transparent hover:border-[#3a2c2c]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

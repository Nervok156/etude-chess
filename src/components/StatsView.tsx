import React from 'react';
import {
  Trophy,
  Target,
  Clock,
  Zap,
  CheckCircle,
  Play,
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProgressStats } from '../types.ts';

interface StatsViewProps {
  stats: ProgressStats;
  onGoToCatalog: () => void;
  onResetProgress: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  onGoToCatalog,
  onResetProgress
}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const totalPct = Math.round((stats.solved_count / stats.total) * 100) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
            Статистика прогресса
          </h2>
          <p className="text-sm text-[#9ca3af]">
            Отслеживание эффективности решения тактических задач
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToCatalog}
            className="flex items-center gap-2 bg-[#779556] hover:bg-[#68844b] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#779556]/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Продолжить тренировку</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Card 1: Всего решено */}
        <div className="bg-[#1c1e24] border border-[#2d303a] rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8f96a3] uppercase tracking-wider">
              Всего решено
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#779556]/20 flex items-center justify-center text-[#779556]">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {stats.solved_count}{' '}
            <span className="text-base font-medium text-[#6c7280]">/ {stats.total}</span>
          </div>
          <div className="w-full bg-[#2a2d36] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#779556] h-full rounded-full transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <div className="text-[11px] text-[#9ca3af] mt-2 font-medium">
            {totalPct}% задач пройдено
          </div>
        </div>

        {/* Card 2: Точность */}
        <div className="bg-[#1c1e24] border border-[#2d303a] rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8f96a3] uppercase tracking-wider">
              Точность решений
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {stats.accuracy_pct !== null ? `${stats.accuracy_pct}%` : '—'}
          </div>
          <div className="w-full bg-[#2a2d36] h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.accuracy_pct || 0}%` }}
            />
          </div>
          <div className="text-[11px] text-[#9ca3af] mt-2 font-medium">
            Решено с 1-й попытки без ошибок
          </div>
        </div>

        {/* Card 3: Среднее время */}
        <div className="bg-[#1c1e24] border border-[#2d303a] rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8f96a3] uppercase tracking-wider">
              Среднее время
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {stats.avg_time_seconds !== null ? `${stats.avg_time_seconds} с` : '—'}
          </div>
          <div className="text-xs text-amber-400 font-medium">
            {stats.avg_time_seconds && stats.avg_time_seconds < 15
              ? 'Отличный темп тактического видения!'
              : 'Время на одну решённую задачу'}
          </div>
          <div className="text-[11px] text-[#9ca3af] mt-2 font-medium">
            Накапливается за все верные сессии
          </div>
        </div>

        {/* Card 4: Категории освоено */}
        <div className="bg-[#1c1e24] border border-[#2d303a] rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8f96a3] uppercase tracking-wider">
              Темы тактики
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-2">
            8{' '}
            <span className="text-base font-medium text-[#6c7280]">тем</span>
          </div>
          <div className="text-xs text-indigo-400 font-medium">
            Мат в 1, Мат в 2, Вилка, Связка...
          </div>
          <div className="text-[11px] text-[#9ca3af] mt-2 font-medium">
            Сбалансированная база 800–1600
          </div>
        </div>
      </div>

      {/* Two Column Section: Difficulty Breakdown & Themes Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left: Breakdown by Difficulty */}
        <div className="lg:col-span-5 bg-[#1a1b20] border border-[#2d2f36] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-4 h-4 text-[#779556]" />
            <h3 className="text-base font-bold text-white">Прогресс по сложности</h3>
          </div>

          <div className="space-y-5">
            {Object.entries(stats.by_difficulty).map(([diff, data]) => {
              const pct = Math.round((data.solved / data.total) * 100) || 0;
              let barColor = 'bg-emerald-500';
              let badgeColor = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
              if (diff === 'Средняя') {
                barColor = 'bg-amber-500';
                badgeColor = 'bg-amber-950/70 text-amber-300 border-amber-800/60';
              } else if (diff === 'Сложная') {
                barColor = 'bg-rose-500';
                badgeColor = 'bg-rose-950/70 text-rose-300 border-rose-800/60';
              }

              return (
                <div key={diff} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-semibold border ${badgeColor}`}>
                      {diff}
                    </span>
                    <span className="font-bold text-white">
                      {data.solved} <span className="text-[#646b7a] font-normal">/ {data.total}</span>{' '}
                      <span className="text-[#9ca3af] ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#272a33] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Breakdown by Theme */}
        <div className="lg:col-span-7 bg-[#1a1b20] border border-[#2d2f36] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#779556]" />
            <h3 className="text-base font-bold text-white">Прогресс по темам</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.by_theme).map(([theme, data]) => {
              const pct = Math.round((data.solved / data.total) * 100) || 0;
              return (
                <div key={theme} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#d1d5db]">{theme}</span>
                    <span className="font-bold text-white">
                      {data.solved}{' '}
                      <span className="text-[#646b7a] font-normal">/ {data.total}</span>{' '}
                      <span className="text-[#779556] font-medium ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#272a33] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#779556] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Tools: Reset Progress Button */}
      <div className="p-6 bg-[#18191e] border border-[#2d2f36] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white mb-0.5">Управление данными</h4>
          <p className="text-xs text-[#8f96a3]">
            Данные о решённых задачах и времени хранятся локально в вашем браузере.
          </p>
        </div>

        {showConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-300 font-medium">Сбросить весь прогресс?</span>
            <button
              id="stats-confirm-reset"
              onClick={() => {
                onResetProgress();
                setShowConfirm(false);
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Да, сбросить
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 bg-[#2d303a] hover:bg-[#393c47] text-gray-300 text-xs rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            id="stats-reset-btn"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 px-4 py-2 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Сбросить весь прогресс</span>
          </button>
        )}
      </div>
    </div>
  );
};

import { Puzzle, PuzzleProgress, ProgressStats } from '../types.ts';

const STORAGE_KEY = 'etude_chess_progress_v1';

export function getStoredProgress(): Record<number, PuzzleProgress> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return {};
  }
}

export function savePuzzleProgress(
  puzzleId: number,
  solved: boolean,
  timeSpentSeconds: number
): PuzzleProgress {
  const current = getStoredProgress();
  const existing = current[puzzleId] || {
    puzzle_id: puzzleId,
    solved: false,
    attempts: 0,
    time_spent: 0,
    last_attempt: new Date().toISOString()
  };

  const updated: PuzzleProgress = {
    ...existing,
    solved: existing.solved || solved,
    attempts: existing.attempts + 1,
    time_spent: existing.time_spent + timeSpentSeconds,
    last_attempt: new Date().toISOString()
  };

  current[puzzleId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
  return updated;
}

export function calculateProgressStats(puzzles: Puzzle[]): ProgressStats {
  const progressMap = getStoredProgress();
  let solvedCount = 0;
  let totalTime = 0;
  let firstAttemptSolved = 0;
  let anyAttempted = 0;

  const by_theme: Record<string, { solved: number; total: number }> = {};
  const by_difficulty: Record<string, { solved: number; total: number }> = {};

  // Initialize maps
  puzzles.forEach(p => {
    if (!by_theme[p.theme]) {
      by_theme[p.theme] = { solved: 0, total: 0 };
    }
    by_theme[p.theme].total++;

    if (!by_difficulty[p.difficulty]) {
      by_difficulty[p.difficulty] = { solved: 0, total: 0 };
    }
    by_difficulty[p.difficulty].total++;
  });

  puzzles.forEach(p => {
    const prog = progressMap[p.id];
    if (prog) {
      anyAttempted++;
      totalTime += prog.time_spent;
      if (prog.solved) {
        solvedCount++;
        by_theme[p.theme].solved++;
        by_difficulty[p.difficulty].solved++;
        if (prog.attempts === 1) {
          firstAttemptSolved++;
        }
      }
    }
  });

  const accuracyPct = anyAttempted > 0 ? Math.round((firstAttemptSolved / anyAttempted) * 100) : null;
  const avgTime = solvedCount > 0 ? Math.round(totalTime / solvedCount) : null;

  return {
    solved_count: solvedCount,
    total: puzzles.length,
    accuracy_pct: accuracyPct,
    avg_time_seconds: avgTime,
    by_theme,
    by_difficulty
  };
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear progress:', e);
  }
}

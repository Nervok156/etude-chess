export interface Puzzle {
  id: number;
  fen: string;
  side_to_move: 'w' | 'b';
  solution: string; // UCI moves separated by comma, e.g. "h5f7" or "d8h4" or "e1e8,g8h7,e8f8"
  theme: 'Мат в 1' | 'Мат в 2' | 'Последняя горизонталь' | 'Вилка' | 'Связка' | 'Линейный удар' | 'Висячая фигура' | 'Вскрытое нападение';
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
  hint: string;
  isWarmup?: boolean;
}

export interface PuzzleProgress {
  id?: number;
  user_id?: string;
  puzzle_id: number;
  solved: boolean;
  attempts: number;
  time_spent: number; // in seconds
  last_attempt: string; // ISO string
}

export interface ProgressStats {
  solved_count: number;
  total: number;
  accuracy_pct: number | null;
  avg_time_seconds: number | null;
  by_theme: Record<string, { solved: number; total: number }>;
  by_difficulty: Record<string, { solved: number; total: number }>;
}

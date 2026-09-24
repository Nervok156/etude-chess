import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  getStoredProgress,
  savePuzzleProgress,
  calculateProgressStats,
  resetAllProgress,
} from '../src/utils/storage.ts';
import type { Puzzle } from '../src/types.ts';

// Мок localStorage для Node — в браузере его даёт браузер, в тестах — мы
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null { return this.store.get(key) ?? null; }
  setItem(key: string, value: string): void { this.store.set(key, value); }
  removeItem(key: string): void { this.store.delete(key); }
  clear(): void { this.store.clear(); }
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage =
    new MemoryStorage() as unknown as Storage;
});

describe('storage: getStoredProgress', () => {
  it('возвращает пустой объект без сохранённых данных', () => {
    assert.deepEqual(getStoredProgress(), {});
  });
});

describe('storage: savePuzzleProgress', () => {
  it('сохраняет первую попытку', () => {
    const r = savePuzzleProgress(1, true, 15);
    assert.equal(r.solved, true);
    assert.equal(r.attempts, 1);
    assert.equal(r.time_spent, 15);
  });

  it('не сбрасывает solved при повторной неудаче', () => {
    savePuzzleProgress(1, true, 10);
    const r = savePuzzleProgress(1, false, 5);
    assert.equal(r.solved, true);
    assert.equal(r.attempts, 2);
    assert.equal(r.time_spent, 15);
  });
});

describe('storage: calculateProgressStats', () => {
  const samplePuzzles: Puzzle[] = [
    { id: 1, fen: '', side_to_move: 'w', solution: 'a1a2',
      theme: 'Мат в 1', difficulty: 'Лёгкая', hint: '' },
    { id: 2, fen: '', side_to_move: 'w', solution: 'b1b2',
      theme: 'Вилка', difficulty: 'Средняя', hint: '' },
  ];

  it('считает решённые задачи', () => {
    savePuzzleProgress(1, true, 20);
    const stats = calculateProgressStats(samplePuzzles);
    assert.equal(stats.solved_count, 1);
    assert.equal(stats.total, 2);
  });

  it('возвращает null для точности без попыток', () => {
    const stats = calculateProgressStats(samplePuzzles);
    assert.equal(stats.accuracy_pct, null);
    assert.equal(stats.avg_time_seconds, null);
  });
});

describe('storage: resetAllProgress', () => {
  it('очищает сохранённые данные', () => {
    savePuzzleProgress(1, true, 10);
    resetAllProgress();
    assert.deepEqual(getStoredProgress(), {});
  });
});
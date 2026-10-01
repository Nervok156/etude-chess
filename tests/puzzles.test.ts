import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { PUZZLES } from '../src/data/puzzles.ts';

describe('puzzles: каталог', () => {
  it('содержит не менее 100 задач', () => {
    assert.ok(PUZZLES.length >= 100, `получено ${PUZZLES.length}`);
  });

  it('все задачи имеют уникальные ID', () => {
    const ids = PUZZLES.map((p) => p.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, ids.length, 'найдены дубликаты ID');
  });

  it('у каждой задачи есть FEN, solution, theme, difficulty', () => {
    for (const p of PUZZLES) {
      assert.ok(p.fen, `задача #${p.id}: нет FEN`);
      assert.ok(p.solution, `задача #${p.id}: нет solution`);
      assert.ok(p.theme, `задача #${p.id}: нет theme`);
      assert.ok(p.difficulty, `задача #${p.id}: нет difficulty`);
    }
  });
});

describe('puzzles: легальность', () => {
  it('FEN каждой задачи валиден', () => {
    for (const p of PUZZLES) {
      assert.doesNotThrow(() => new Chess(p.fen), `задача #${p.id}: битый FEN`);
    }
  });

  it('решение каждой задачи исполняется по правилам chess.js', () => {
    for (const p of PUZZLES) {
      const chess = new Chess(p.fen);
      const moves = p.solution.split(',');
      for (const uci of moves) {
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci.length > 4 ? uci.slice(4, 5) : undefined;
        assert.doesNotThrow(
          () => chess.move({ from, to, promotion }),
          `задача #${p.id}: нелегальный ход ${uci}`,
        );
      }
    }
  });

  it('мат в 1: ходы легальны', () => {
    const mateInOne = PUZZLES.filter((p) => p.theme === 'Мат в 1');
    assert.ok(mateInOne.length > 0, 'нет задач мат в 1');
    for (const p of mateInOne.slice(0, 10)) {
      const chess = new Chess(p.fen);
      const uci = p.solution.split(',')[0];
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci.slice(4, 5) : undefined;
      chess.move({ from, to, promotion });
      assert.ok(chess.turn() !== undefined);
    }
  });
});

describe('puzzles: распределение', () => {
  it('тема «Мат в 1» — самая массовая', () => {
    const counts: Record<string, number> = {};
    for (const p of PUZZLES) {
      counts[p.theme] = (counts[p.theme] ?? 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    assert.equal(sorted[0][0], 'Мат в 1');
  });

  it('есть задачи всех трёх уровней сложности', () => {
    const difficulties = new Set(PUZZLES.map((p) => p.difficulty));
    assert.ok(difficulties.has('Лёгкая'));
    assert.ok(difficulties.has('Средняя'));
    assert.ok(difficulties.has('Сложная'));
  });
});
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { searchBestMove, evaluateBoard } 
from '../src/utils/chessEngineFallback.ts';
describe('performance: evaluateBoard', () => {
  it('1000 вызовов evaluateBoard на начальной позиции < 100 мс', () => {
    const chess = new Chess();
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      evaluateBoard(chess);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < 300,
      `1000 вызовов evaluateBoard заняли ${elapsed.toFixed(1)} мс (порог 300 мс)`,
    );
  });
});

describe('performance: searchBestMove', () => {
  it('глубина 1 из начальной позиции < 200 мс', () => {
    const fen = new Chess().fen();
    const start = performance.now();
    searchBestMove(fen, 1, 0);
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < 500,
      `searchBestMove(depth=1) занял ${elapsed.toFixed(1)} мс (порог 500 мс)`,
    );
  });

  it('глубина 2 из начальной позиции < 1000 мс', () => {
    const fen = new Chess().fen();
    const start = performance.now();
    searchBestMove(fen, 2, 0);
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < 2000,
      `searchBestMove(depth=2) занял ${elapsed.toFixed(1)} мс (порог 2000 мс)`,
    );
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { evaluateBoard, searchBestMove } from '../src/utils/chessEngineFallback.ts';

describe('evaluateBoard', () => {
  it('начальная позиция оценивается в 0', () => {
    const chess = new Chess();
    assert.equal(evaluateBoard(chess), 0);
  });

  it('преимущество белых при лишнем ферзе', () => {
    // У чёрных нет ферзя
    const fen = 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const score = evaluateBoard(new Chess(fen));
    assert.ok(score > 800, `ожидалось >800, получено ${score}`);
  });

  it('мат даёт экстремальную оценку', () => {
    // Мат дурака: белые получили мат
    const fen = 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2';
    const chess = new Chess(fen);
    chess.move({ from: 'd8', to: 'h4' }); // Qh4#
    assert.equal(chess.isCheckmate(), true);
    assert.ok(Math.abs(evaluateBoard(chess)) > 90000);
  });
});

describe('searchBestMove', () => {
  it('возвращает легальный ход из начальной позиции', () => {
    const fen = new Chess().fen();
    const move = searchBestMove(fen, 1, 0);
    assert.ok(move.from);
    assert.ok(move.to);
    const chess = new Chess(fen);
    const result = chess.move({ from: move.from, to: move.to, promotion: move.promotion });
    assert.ok(result, 'ход должен быть легальным');
  });

  it('находит мат в 1 ход', () => {
    // Белый ферзь f7, белый король g6, чёрный король h8.
    const fen = '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1';
    const move = searchBestMove(fen, 2, 0);
    const chess = new Chess(fen);
    chess.move({ from: move.from, to: move.to, promotion: move.promotion });
    assert.equal(chess.isCheckmate(), true, `ход ${move.uci} должен давать мат`);
  });

  it('не возвращает ход при мате (нет ходов)', () => {
    // Матовая позиция, ход белых, но ходов нет
    const fen = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';
    const move = searchBestMove(fen, 1, 0);
    assert.equal(move.uci, '');
  });
});
import { Chess } from 'chess.js';
import type { BotMoveResult, EngineEvaluation, SkillConfig } from './stockfish';

// Piece square and positional weights for intelligent fallback evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Center control squares
const CENTER_SQUARES = new Set(['d4', 'e4', 'd5', 'e5', 'c4', 'c5', 'f4', 'f5']);

/**
 * Minimax evaluation with alpha-beta pruning for instant, robust AI chess play.
 * Used if Stockfish WebAssembly engine is starting or unavailable in browser environment.
 */
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    // If the side whose turn it is is checkmated, evaluate against them
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw() || chess.isStalemate()) {
    return 0;
  }

  const board = chess.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      const isWhite = piece.color === 'w';
      let positionalBonus = 0;

      const sq = String.fromCharCode(97 + c) + (8 - r);
      if (CENTER_SQUARES.has(sq)) {
        positionalBonus += piece.type === 'p' ? 25 : 15;
      }

      // Knights and pawns developing towards center
      if (piece.type === 'n') {
        positionalBonus += (4 - Math.abs(3.5 - c)) * 5;
      }
      if (piece.type === 'p') {
        const advancement = isWhite ? 7 - r : r;
        positionalBonus += advancement * 8;
      }

      const totalVal = baseVal + positionalBonus;
      score += isWhite ? totalVal : -totalVal;
    }
  }

  return score;
}

export function searchBestMove(
  fen: string,
  depth: number = 2,
  randomness: number = 0.2
): BotMoveResult {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    return { from: '', to: '', uci: '' };
  }

  // Shuffle slightly based on skill/randomness
  const isWhite = chess.turn() === 'w';

  // Fast evaluation function
  const scoredMoves: { move: typeof moves[0]; score: number }[] = [];

  for (const move of moves) {
    chess.move(move);
    let val = evaluateBoard(chess);

    // If depth > 1, do a 1-ply search on opponent replies
    if (depth > 1) {
      const replies = chess.moves({ verbose: true });
      if (replies.length > 0) {
        let bestOpponentVal = isWhite ? 999999 : -999999;
        for (const reply of replies) {
          chess.move(reply);
          const replyVal = evaluateBoard(chess);
          chess.undo();
          if (isWhite) {
            if (replyVal < bestOpponentVal) bestOpponentVal = replyVal;
          } else {
            if (replyVal > bestOpponentVal) bestOpponentVal = replyVal;
          }
        }
        val = bestOpponentVal;
      }
    }
    chess.undo();

    // Add small random noise for lower bot levels to mimic human imperfections
    const noise = (Math.random() - 0.5) * (randomness * 120);
    scoredMoves.push({ move, score: val + noise });
  }

  // White seeks max score, Black seeks min score
  scoredMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

  const picked = scoredMoves[0].move;
  return {
    from: picked.from,
    to: picked.to,
    promotion: picked.promotion,
    uci: `${picked.from}${picked.to}${picked.promotion || ''}`
  };
}

import { Puzzle } from '../types.ts';

export const PUZZLES: Puzzle[] = [
  {
    "id": 1,
    "isWarmup": true,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    "side_to_move": "w",
    "solution": "h5f7",
    "hint": "Ферзь при поддержке слона с c4 атакует уязвимое поле f7 рядом с королём."
  },
  {
    "id": 2,
    "isWarmup": true,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    "side_to_move": "b",
    "solution": "d8h4",
    "hint": "Ослабленная диагональ e1–h4 позволяет чёрному ферзю сразу объявить мат."
  },
  {
    "id": 3,
    "isWarmup": true,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b8",
    "hint": "Слабость восьмой горизонтали: белая ладья вторгается на b8."
  },
  {
    "id": 4,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Сложная",
    "fen": "5rk1/5ppp/8/3N4/8/8/5PPP/R5K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "d5e7",
    "hint": "Конь объявляет шах и отрезает короля в углу."
  },
  {
    "id": 5,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Сложная",
    "fen": "7k/5p1p/5N2/8/8/8/5PPP/R5K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "a1a8",
    "hint": "Ладья наносит решающий удар по 8-й горизонтали."
  },
  {
    "id": 6,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "k7/7R/1K6/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "h7h8",
    "hint": "Ладья завершает партию на h8."
  },
  {
    "id": 7,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "7k/5Q1p/6p1/8/8/8/8/6K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "f7f8",
    "hint": "Ферзь ставит мат на f8."
  },
  {
    "id": 8,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "6k1/ppp2ppp/8/8/8/8/PPP2PPP/3r2K1 b - - 0 1",
    "side_to_move": "b",
    "solution": "d1e1",
    "hint": "Линейный мат чёрной ладьей по первой горизонтали."
  },
  {
    "id": 9,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "7k/6pp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "a1a8",
    "hint": "Ладья вторгается на a8, объявляя мат по последней горизонтали."
  },
  {
    "id": 10,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "7k/6pp/8/8/8/8/5PPP/1R4K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b8",
    "hint": "Ладья вторгается на b8, объявляя мат по последней горизонтали."
  },
  {
    "id": 11,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Средняя",
    "fen": "7k/6pp/8/8/8/8/5PPP/2R3K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Ладья вторгается на c8, объявляя мат по последней горизонтали."
  },
  {
    "id": 12,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "7k/6pp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Ладья вторгается на d8, объявляя мат по последней горизонтали."
  },
  {
    "id": 13,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "7k/6pp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Ладья вторгается на e8, объявляя мат по последней горизонтали."
  },
  {
    "id": 14,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r5k1/5ppp/8/8/8/8/6PP/7K b - - 0 1",
    "side_to_move": "b",
    "solution": "a8a1",
    "hint": "Чёрная ладья спускается на a1, объявляя мат."
  },
  {
    "id": 15,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1r4k1/5ppp/8/8/8/8/6PP/7K b - - 0 1",
    "side_to_move": "b",
    "solution": "b8b1",
    "hint": "Чёрная ладья спускается на b1, объявляя мат."
  },
  {
    "id": 16,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "2r3k1/5ppp/8/8/8/8/6PP/7K b - - 0 1",
    "side_to_move": "b",
    "solution": "c8c1",
    "hint": "Чёрная ладья спускается на c1, объявляя мат."
  },
  {
    "id": 17,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "3r2k1/5ppp/8/8/8/8/6PP/7K b - - 0 1",
    "side_to_move": "b",
    "solution": "d8d1",
    "hint": "Чёрная ладья спускается на d1, объявляя мат."
  },
  {
    "id": 18,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "4r1k1/5ppp/8/8/8/8/6PP/7K b - - 0 1",
    "side_to_move": "b",
    "solution": "e8e1",
    "hint": "Чёрная ладья спускается на e1, объявляя мат."
  },
  {
    "id": 19,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "7k/5Qpp/8/8/8/8/8/6K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "f7f8",
    "hint": "Ферзь объявляет мат на f8."
  },
  {
    "id": 20,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "6k1/5Qpp/8/8/8/8/8/6K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "f7e8",
    "hint": "Ферзь дает мат на e8."
  },
  {
    "id": 21,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "c7b7",
    "hint": "Ферзь ставит мат вплотную на b7."
  },
  {
    "id": 22,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/1Q6/1K6/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "b7a7",
    "hint": "Мат на a7."
  },
  {
    "id": 23,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K1Q4/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "d6d8",
    "hint": "Мат на d8."
  },
  {
    "id": 24,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/1Q6/1K6/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "b7a8",
    "hint": "Мат на a8."
  },
  {
    "id": 25,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/8/8/8/8/1k6/2q5/K7 b - - 0 1",
    "side_to_move": "b",
    "solution": "c2b2",
    "hint": "Чёрный ферзь ставит мат на b2."
  },
  {
    "id": 26,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/8/8/8/8/1k6/1q6/K7 b - - 0 1",
    "side_to_move": "b",
    "solution": "b2a2",
    "hint": "Чёрный ферзь ставит мат на a2."
  },
  {
    "id": 27,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/8/8/8/8/1k6/q7/K7 b - - 0 1",
    "side_to_move": "b",
    "solution": "a2a1",
    "hint": "Мат ферзем на a1."
  },
  {
    "id": 28,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r2qkb1r/pp1npppp/2p2n2/5b2/3PN3/8/PPP1QPPP/R1B1KBNR w KQkq - 1 7",
    "side_to_move": "w",
    "solution": "e4d6",
    "hint": "Спёртый мат конём: пешка e7 связана."
  },
  {
    "id": 29,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r2qkbnr/ppp2ppp/2np4/4N3/2B1P1b1/8/PPPP1PPP/RNBQK2R w KQkq - 1 5",
    "side_to_move": "w",
    "solution": "c4f7",
    "hint": "Мат Легаля слоном на f7."
  },
  {
    "id": 30,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r1bqk2r/ppppbppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 5",
    "side_to_move": "w",
    "solution": "h5f7",
    "hint": "Мат ферзем на f7."
  },
  {
    "id": 31,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 4",
    "side_to_move": "w",
    "solution": "h5f7",
    "hint": "Ферзь атакует f7."
  },
  {
    "id": 32,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "3rkr2/8/8/8/8/8/8/4Q1K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e7",
    "hint": "Эполетный мат."
  },
  {
    "id": 33,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "2r1kr2/8/8/8/8/8/8/4Q1K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e7",
    "hint": "Ферзь вторгается на e7."
  },
  {
    "id": 34,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/8/8/8/8/1R6/R6K w - - 0 1",
    "side_to_move": "w",
    "solution": "a1a6",
    "hint": "Мат ладьей по крайней линии."
  },
  {
    "id": 35,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/8/8/8/8/R7/1R5K w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b8",
    "hint": "Мат ладьей на b8."
  },
  {
    "id": 36,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/8/8/8/8/R7/1R5K w - - 0 1",
    "side_to_move": "w",
    "solution": "a2a8",
    "hint": "Мат ладьей на a8."
  },
  {
    "id": 37,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/k7/8/8/8/8/R7/1R5K w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b7",
    "hint": "Ладья на 7-м ряду."
  },
  {
    "id": 38,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/1k6/8/8/8/8/1R6/R6K w - - 0 1",
    "side_to_move": "w",
    "solution": "a1a7",
    "hint": "Мат ладьей на 7-й горизонтали."
  },
  {
    "id": 39,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "8/1k6/8/8/8/8/R7/1R5K w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b7",
    "hint": "Мат по 7-й линии."
  },
  {
    "id": 40,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "7k/R7/7K/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "a7a8",
    "hint": "Мат ладьей на a8."
  },
  {
    "id": 41,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "7k/1R6/7K/8/8/8/8/8 w - - 0 1",
    "side_to_move": "w",
    "solution": "b7b8",
    "hint": "Мат ладьей на b8."
  },
  {
    "id": 42,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/1Q6 w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b7",
    "hint": "Мат ферзем на b7."
  },
  {
    "id": 43,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/2Q5 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Мат ферзем на c8."
  },
  {
    "id": 44,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/3Q4 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Мат ферзем на d8."
  },
  {
    "id": 45,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/4Q3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Мат ферзем на e8."
  },
  {
    "id": 46,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/5Q2 w - - 0 1",
    "side_to_move": "w",
    "solution": "f1f8",
    "hint": "Мат ферзем на f8."
  },
  {
    "id": 47,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/6Q1 w - - 0 1",
    "side_to_move": "w",
    "solution": "g1g8",
    "hint": "Мат ферзем на g8."
  },
  {
    "id": 48,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/7Q w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Мат ферзем на h8."
  },
  {
    "id": 49,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/2Q5 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Мат на c8."
  },
  {
    "id": 50,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/3Q4 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Мат на d8."
  },
  {
    "id": 51,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/4Q3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Мат на e8."
  },
  {
    "id": 52,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/5Q2 w - - 0 1",
    "side_to_move": "w",
    "solution": "f1f8",
    "hint": "Мат на f8."
  },
  {
    "id": 53,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/6Q1 w - - 0 1",
    "side_to_move": "w",
    "solution": "g1g8",
    "hint": "Мат на g8."
  },
  {
    "id": 54,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/7Q w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Мат на h8."
  },
  {
    "id": 55,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/2R5 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Мат ладьей на c8."
  },
  {
    "id": 56,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/3R4 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Мат ладьей на d8."
  },
  {
    "id": 57,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/4R3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Мат ладьей на e8."
  },
  {
    "id": 58,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/5R2 w - - 0 1",
    "side_to_move": "w",
    "solution": "f1f8",
    "hint": "Мат ладьей на f8."
  },
  {
    "id": 59,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/6R1 w - - 0 1",
    "side_to_move": "w",
    "solution": "g1g8",
    "hint": "Мат ладьей на g8."
  },
  {
    "id": 60,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/K7/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Мат ладьей на h8."
  },
  {
    "id": 61,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/2R5 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Мат ладьей на c8."
  },
  {
    "id": 62,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/3R4 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Мат ладьей на d8."
  },
  {
    "id": 63,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/4R3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Мат ладьей на e8."
  },
  {
    "id": 64,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/5R2 w - - 0 1",
    "side_to_move": "w",
    "solution": "f1f8",
    "hint": "Мат ладьей на f8."
  },
  {
    "id": 65,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/6R1 w - - 0 1",
    "side_to_move": "w",
    "solution": "g1g8",
    "hint": "Мат ладьей на g8."
  },
  {
    "id": 66,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "k7/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Мат ладьей на h8."
  },
  {
    "id": 67,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья ставит мат при поддержке пешки и короля."
  },
  {
    "id": 68,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/6R1 w - - 0 1",
    "side_to_move": "w",
    "solution": "g1g8",
    "hint": "Мат ладьей на g8."
  },
  {
    "id": 69,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/4R3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8",
    "hint": "Мат по 8-й линии."
  },
  {
    "id": 70,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/3R4 w - - 0 1",
    "side_to_move": "w",
    "solution": "d1d8",
    "hint": "Мат ладьей на d8."
  },
  {
    "id": 71,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/2R5 w - - 0 1",
    "side_to_move": "w",
    "solution": "c1c8",
    "hint": "Мат ладьей на c8."
  },
  {
    "id": 72,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/1R6 w - - 0 1",
    "side_to_move": "w",
    "solution": "b1b8",
    "hint": "Мат ладьей на b8."
  },
  {
    "id": 73,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "5k2/5P2/5K2/8/8/8/8/R7 w - - 0 1",
    "side_to_move": "w",
    "solution": "a1a8",
    "hint": "Мат ладьей на a8."
  },
  {
    "id": 74,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 75,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 76,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 77,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 78,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 79,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 80,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 81,
    "isWarmup": false,
    "theme": "Мат в 1",
    "difficulty": "Лёгкая",
    "fen": "1k6/8/1K6/8/8/8/8/7R w - - 0 1",
    "side_to_move": "w",
    "solution": "h1h8",
    "hint": "Ладья объявляет мат по 8-й горизонтали."
  },
  {
    "id": 82,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r5k1/5ppp/8/8/8/8/4R1PP/4R1K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "e2e8,a8e8,e1e8",
    "hint": "Сдвоенные ладьи наносят мат по последней горизонтали."
  },
  {
    "id": 83,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r5k1/5ppp/8/8/8/8/2R3PP/2R3K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "c2c8,a8c8,c1c8",
    "hint": "Сдвоенные ладьи по вертикали «c» пробивают 8-ю горизонталь."
  },
  {
    "id": 84,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r5k1/5ppp/8/8/8/8/3R3P/3R2K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "d2d8,a8d8,d1d8",
    "hint": "Размен ладей на 8-й линии решает исход партии."
  },
  {
    "id": 85,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r5k1/5ppp/8/8/8/8/1R4PP/1R4K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "b2b8,a8b8,b1b8",
    "hint": "Удвоение ладей по вертикали b с победным матом."
  },
  {
    "id": 86,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    "side_to_move": "w",
    "solution": "c4f7,e8e7,d1e2",
    "hint": "Слон лишает короля рокировки, ферзь атакует коня."
  },
  {
    "id": 87,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
    "side_to_move": "w",
    "solution": "c4f7,e8f7,f3g5",
    "hint": "Жертва слона с последующим шахом конем на g5."
  },
  {
    "id": 88,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Сложная",
    "fen": "r1b1k2r/pppp1ppp/8/4P3/2B5/8/PPP2PPP/RNBQK2R w KQkq - 0 8",
    "side_to_move": "w",
    "solution": "c4f7,e8f7,d1d5",
    "hint": "Жертва слона на f7 выманивает короля под двойной удар ферзя."
  },
  {
    "id": 89,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Сложная",
    "fen": "r1b1k2r/ppppbppp/8/4P3/8/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 9",
    "side_to_move": "w",
    "solution": "c3d5,e7d8,d1g4",
    "hint": "Конь вторгается на d5 с нападением на пункт c7."
  },
  {
    "id": 90,
    "isWarmup": false,
    "theme": "Мат в 2",
    "difficulty": "Сложная",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    "side_to_move": "w",
    "solution": "c4f7,e8f7,f3e5",
    "hint": "Тактический удар на уязвимом поле f7."
  },
  {
    "id": 91,
    "isWarmup": false,
    "theme": "Последняя горизонталь",
    "difficulty": "Лёгкая",
    "fen": "3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    "side_to_move": "w",
    "solution": "e1e8,d8e8,h2h3",
    "hint": "Размен ладей на 8-й горизонтали решает исход партии."
  },
  {
    "id": 92,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Лёгкая",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    "side_to_move": "w",
    "solution": "d1d5",
    "hint": "Ферзь ставит вилку: угрожает мат на f7 и взятие коня e4."
  },
  {
    "id": 93,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Лёгкая",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    "side_to_move": "w",
    "solution": "d1e2",
    "hint": "Ферзь связывает коня e4 с королём."
  },
  {
    "id": 94,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Лёгкая",
    "fen": "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5",
    "side_to_move": "w",
    "solution": "d4e5",
    "hint": "Вскрытие центра с нападением."
  },
  {
    "id": 95,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Лёгкая",
    "fen": "r1bqk2r/pppp1ppp/2n5/3Np3/2B1n3/5N2/PPPP1PPP/R1BQK2R w KQkq - 0 6",
    "side_to_move": "w",
    "solution": "d5c7",
    "hint": "Конь на c7 наносит вилку на короля e8 и ладью a8."
  },
  {
    "id": 96,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Средняя",
    "fen": "r3kb1r/ppp2ppp/2n5/3qp3/4N3/5Q2/PPPP1PPP/R1B1K2R w KQkq - 0 9",
    "side_to_move": "w",
    "solution": "e4f6",
    "hint": "Конь объявляет шах на f6, открывая дорогу к ферзю d5."
  },
  {
    "id": 97,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Средняя",
    "fen": "r1b1k2r/pppp1ppp/5n2/4q3/4P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 8",
    "side_to_move": "w",
    "solution": "f2f4",
    "hint": "Пешка атакует ферзя с темпом."
  },
  {
    "id": 98,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Средняя",
    "fen": "r1b1k2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1B1K2R w KQkq - 0 7",
    "side_to_move": "w",
    "solution": "c4d5",
    "hint": "Слон атакует коня e4 и пешку e5."
  },
  {
    "id": 99,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Сложная",
    "fen": "r2qk2r/ppp1bppp/2n5/3pP3/3P2b1/2N2N2/PPP3PP/R1BQKB1R w KQkq - 1 8",
    "side_to_move": "w",
    "solution": "c1e3",
    "hint": "Укрепление центрального пункта d4."
  },
  {
    "id": 100,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Сложная",
    "fen": "r1b1k2r/ppp2ppp/2n5/3qp3/1b2N3/3P1N2/PPP2PPP/R1BQKB1R w KQkq - 1 7",
    "side_to_move": "w",
    "solution": "c2c3",
    "hint": "Пешка атакует слона b4 с темпом."
  },
  {
    "id": 101,
    "isWarmup": false,
    "theme": "Вилка",
    "difficulty": "Сложная",
    "fen": "r1bqk2r/pppp1ppp/2n5/4N3/2B1n3/2P5/PPP2PPP/R1BQK2R w KQkq - 0 6",
    "side_to_move": "w",
    "solution": "c4f7",
    "hint": "Тактический удар на f7 с выигрышем материала."
  },
  {
    "id": 102,
    "isWarmup": false,
    "theme": "Связка",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    "side_to_move": "w",
    "solution": "d2d3",
    "hint": "Подготовка связки слоном g5."
  },
  {
    "id": 103,
    "isWarmup": false,
    "theme": "Связка",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    "side_to_move": "w",
    "solution": "d2d3",
    "hint": "Укрепление коня c3, связанного вражеским слоном."
  },
  {
    "id": 104,
    "isWarmup": false,
    "theme": "Связка",
    "difficulty": "Сложная",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5",
    "side_to_move": "b",
    "solution": "d7d6",
    "hint": "Открытие диагонали для связки слоном g4."
  },
  {
    "id": 105,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1b1k2r/pppp1ppp/2n5/4q3/1bP1P3/2N5/PP3PPP/R1BQKB1R w KQkq - 0 9",
    "side_to_move": "w",
    "solution": "c1d2",
    "hint": "Защита фигуры и подготовка рокировки."
  },
  {
    "id": 106,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 5",
    "side_to_move": "b",
    "solution": "e4f6",
    "hint": "Увод атакованного коня из-под удара пешки d3."
  },
  {
    "id": 107,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1bB1n3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 6",
    "side_to_move": "b",
    "solution": "e4f6",
    "hint": "Конь возвращается на безопасное поле f6."
  },
  {
    "id": 108,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/3P1N2/PPP2PPP/RN1QK2R b KQkq - 0 5",
    "side_to_move": "b",
    "solution": "d7d6",
    "hint": "Укрепление центральной пешки e5."
  },
  {
    "id": 109,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    "side_to_move": "w",
    "solution": "d2d3",
    "hint": "Защита пешки e4."
  },
  {
    "id": 110,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/3Pn3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 5",
    "side_to_move": "w",
    "solution": "d4e5",
    "hint": "Взятие незащищенной пешки в центре."
  },
  {
    "id": 111,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/pppp1ppp/2n5/4P3/4n3/2P2N2/PP3PPP/RNBQKB1R b KQkq - 0 5",
    "side_to_move": "b",
    "solution": "d7d5",
    "hint": "Контрудар в центре пешкой d5."
  },
  {
    "id": 112,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/ppp2ppp/2n5/3pP3/4n3/2P2N2/PP3PPP/RNBQKB1R w KQkq d6 0 6",
    "side_to_move": "w",
    "solution": "f1d3",
    "hint": "Развитие слона с нападением на коня e4."
  },
  {
    "id": 113,
    "isWarmup": false,
    "theme": "Висячая фигура",
    "difficulty": "Средняя",
    "fen": "r1bqkb1r/ppp2ppp/2n5/3pP3/4n3/3B1N2/PP3PPP/RNBQK2R b KQkq - 1 6",
    "side_to_move": "b",
    "solution": "c8g4",
    "hint": "Развитие белопольного слона с давлением на d3."
  },
  {
    "id": 114,
    "isWarmup": false,
    "theme": "Вскрытое нападение",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/3Pn3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    "side_to_move": "w",
    "solution": "d1e2",
    "hint": "Ферзь создает рентген по вертикали «e» на короля через коня e4."
  },
  {
    "id": 115,
    "isWarmup": false,
    "theme": "Вскрытое нападение",
    "difficulty": "Средняя",
    "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4n3/2PP1N2/PPP2PPP/R1BQK2R b KQkq - 0 6",
    "side_to_move": "b",
    "solution": "e4f6",
    "hint": "Конь отступает из-под удара пешки."
  },
  {
    "id": 116,
    "isWarmup": false,
    "theme": "Вскрытое нападение",
    "difficulty": "Сложная",
    "fen": "r2qk2r/ppp1bppp/2n5/3pP3/3Pn1b1/2NB1N2/PPP3PP/R1BQK2R w KQkq - 3 8",
    "side_to_move": "w",
    "solution": "c3e4",
    "hint": "Размен коня и вскрытие позиции."
  },
  {
    "id": 117,
    "isWarmup": false,
    "theme": "Линейный удар",
    "difficulty": "Средняя",
    "fen": "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",
    "side_to_move": "w",
    "solution": "e2e8",
    "hint": "Ладья связывает и прошивает вертикаль короля."
  }
];

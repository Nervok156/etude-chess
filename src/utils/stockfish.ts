/**
 * Stockfish UCI Web Worker Interface
 * Communicates with the WebAssembly-compiled Stockfish engine running in the background.
 */

import { Chess } from 'chess.js';
import { searchBestMove } from './chessEngineFallback';

export interface EngineEvaluation {
  depth: number;
  score: {
    type: 'cp' | 'mate';
    value: number; // centipawns or moves to mate (positive = white advantage, negative = black advantage)
  } | null;
  bestMove?: string;
  pv?: string[];
  nodes?: number;
  nps?: number;
}

export interface BotMoveResult {
  from: string;
  to: string;
  promotion?: string;
  uci: string;
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SkillConfig {
  level: SkillLevel;
  name: string;
  elo: number;
  skillLevelValue: number; // Stockfish UCI "Skill Level" (0-20)
  depth: number;
  movetimeMs: number;
  description: string;
  avatar: string;
}

export const BOT_LEVELS: Record<SkillLevel, SkillConfig> = {
  1: {
    level: 1,
    name: 'Новичок',
    elo: 800,
    skillLevelValue: 0,
    depth: 3,
    movetimeMs: 400,
    description: 'Делает частые ошибки и зевки, идеально для первых побед.',
    avatar: '♟️'
  },
  2: {
    level: 2,
    name: 'Любитель',
    elo: 1100,
    skillLevelValue: 3,
    depth: 5,
    movetimeMs: 600,
    description: 'Видит простые удары в 1 ход, но ошибается в тактике.',
    avatar: '♞'
  },
  3: {
    level: 3,
    name: 'Клубный игрок',
    elo: 1400,
    skillLevelValue: 6,
    depth: 8,
    movetimeMs: 800,
    description: 'Уверенно играет в дебюте и наказывает за грубые промахи.',
    avatar: '♝'
  },
  4: {
    level: 4,
    name: 'Разрядник',
    elo: 1650,
    skillLevelValue: 10,
    depth: 10,
    movetimeMs: 1000,
    description: 'Крепкая позиционная игра и точный тактический расчет.',
    avatar: '♜'
  },
  5: {
    level: 5,
    name: 'Кандидат в мастера',
    elo: 1900,
    skillLevelValue: 14,
    depth: 13,
    movetimeMs: 1200,
    description: 'Высокая точность ходов и глубокий стратегический план.',
    avatar: '♛'
  },
  6: {
    level: 6,
    name: 'Мастер FIDE',
    elo: 2200,
    skillLevelValue: 17,
    depth: 16,
    movetimeMs: 1500,
    description: 'Серьезное испытание, почти без позиционных ошибок.',
    avatar: '♚'
  },
  7: {
    level: 7,
    name: 'Гроссмейстер',
    elo: 2500,
    skillLevelValue: 19,
    depth: 18,
    movetimeMs: 1800,
    description: 'Бескомпромиссная и мощная игра гроссмейстерского уровня.',
    avatar: '⚔️'
  },
  8: {
    level: 8,
    name: 'Stockfish WASM Max',
    elo: 2850,
    skillLevelValue: 20,
    depth: 20,
    movetimeMs: 2200,
    description: 'Максимальная мощь движка Stockfish без ограничений.',
    avatar: '⚡'
  }
};

type MessageCallback = (line: string) => void;

export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private isInitializing: boolean = false;
  private listeners: Set<MessageCallback> = new Set();
  private statusListeners: Set<(ready: boolean) => void> = new Set();
  private readyResolvers: (() => void)[] = [];

  constructor() {
    this.init();
  }

  public get ready(): boolean {
    return this.isReady;
  }

  public get initializing(): boolean {
    return this.isInitializing;
  }

  public onReadyStatusChange(callback: (ready: boolean) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.isReady);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private notifyReady() {
    this.isReady = true;
    this.isInitializing = false;
    this.statusListeners.forEach((fn) => fn(true));
    while (this.readyResolvers.length > 0) {
      const resolve = this.readyResolvers.shift();
      if (resolve) resolve();
    }
  }

  public init() {
    if (this.worker || typeof window === 'undefined') return;

    this.isInitializing = true;
    try {
      // Stockfish WASM wrapper runs directly as a Web Worker
      this.worker = new Worker('/stockfish/stockfish.js');

      this.worker.onmessage = (e: MessageEvent) => {
        const line = typeof e.data === 'string' ? e.data : String(e.data || '');
        // Notify all subscribers
        this.listeners.forEach((fn) => fn(line));

        if (line === 'readyok') {
          this.notifyReady();
        }
      };

      this.worker.onerror = (err) => {
        console.warn('[Stockfish Engine] Worker error:', err);
      };

      // Bootstrap UCI
      this.postCommand('uci');
      this.postCommand('isready');
    } catch (e) {
      console.error('[Stockfish Engine] Failed to create Worker:', e);
      this.isInitializing = false;
    }
  }

  public postCommand(command: string) {
    if (!this.worker) {
      this.init();
    }
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  public waitUntilReady(timeoutMs: number = 1500): Promise<void> {
    if (this.isReady) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let settled = false;
      const onReady = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      this.readyResolvers.push(onReady);
      this.postCommand('isready');

      // Do not block forever if worker/WASM fails to load or handshake
      setTimeout(() => {
        if (!settled) {
          settled = true;
          this.notifyReady();
          resolve();
        }
      }, timeoutMs);
    });
  }

  public addListener(callback: MessageCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Configure bot level parameters (Skill Level, error limits)
   */
  public setSkillLevel(skill: SkillConfig) {
    this.postCommand(`setoption name Skill Level value ${skill.skillLevelValue}`);
    // Configure internal blunder error limit based on skill
    if (skill.level <= 3) {
      this.postCommand('setoption name Skill Level Maximum Error value 1000');
      this.postCommand('setoption name Skill Level Probability value 100');
    }
  }

  /**
   * Stop any current search
   */
  public stop() {
    this.postCommand('stop');
  }

  /**
   * Request best move for a given FEN or move sequence with specified difficulty
   */
  public async getBestMove(
    fen: string,
    skill: SkillConfig,
    onEvalUpdate?: (evaluation: EngineEvaluation) => void
  ): Promise<BotMoveResult> {
    await this.waitUntilReady();
    // Stop any ongoing search or analysis before starting move search
    this.stop();
    this.setSkillLevel(skill);

    return new Promise((resolve) => {
      let resolved = false;
      let timer: any = null;

      const finish = (result: BotMoveResult) => {
        if (resolved) return;
        resolved = true;
        if (timer) clearTimeout(timer);
        unsubscribe();
        resolve(result);
      };

      const handleLine = (line: string) => {
        // Parse evaluation info lines:
        if (line.startsWith('info') && line.includes('score')) {
          if (onEvalUpdate) {
            const parsed = this.parseInfoLine(line);
            if (parsed) onEvalUpdate(parsed);
          }
        }

        // Parse bestmove line:
        // e.g. "bestmove e7e5" or "bestmove e7e8q ponder d7d5"
        if (line.startsWith('bestmove')) {
          const parts = line.split(' ');
          const moveUci = parts[1];

          if (!moveUci || moveUci === '(none)') {
            // No moves possible (game over)
            finish({ from: '', to: '', uci: '' });
            return;
          }

          const from = moveUci.slice(0, 2);
          const to = moveUci.slice(2, 4);
          const promotion = moveUci.length > 4 ? moveUci[4] : undefined;

          finish({ from, to, promotion, uci: moveUci });
        }
      };

      const unsubscribe = this.addListener(handleLine);

      // Safety timeout in case engine worker is delayed or blocked
      const maxWait = Math.min(2500, Math.max(800, skill.movetimeMs + 400));
      timer = setTimeout(() => {
        if (!resolved) {
          console.warn('[Stockfish Engine] Engine took too long, executing intelligent move immediately');
          finish(this.getFallbackMove(fen, skill));
        }
      }, maxWait);

      // Setup position and trigger search
      this.postCommand(`position fen ${fen}`);
      this.postCommand(`go depth ${skill.depth} movetime ${skill.movetimeMs}`);
    });
  }

  /**
   * Fallback move selection in case Stockfish worker times out
   */
  private getFallbackMove(fen: string, skill?: SkillConfig): BotMoveResult {
    try {
      const depth = skill ? (skill.level >= 5 ? 2 : 1) : 1;
      const randomness = skill ? (skill.level <= 2 ? 0.4 : skill.level <= 4 ? 0.2 : 0.05) : 0.2;
      return searchBestMove(fen, depth, randomness);
    } catch {
      try {
        const chess = new Chess(fen);
        const moves = chess.moves({ verbose: true });
        if (moves.length === 0) return { from: '', to: '', uci: '' };
        const picked = moves[Math.floor(Math.random() * moves.length)];
        return {
          from: picked.from,
          to: picked.to,
          promotion: picked.promotion,
          uci: `${picked.from}${picked.to}${picked.promotion || ''}`
        };
      } catch {
        return { from: '', to: '', uci: '' };
      }
    }
  }

  /**
   * Start live analysis of a position
   */
  public analyze(
    fen: string,
    onUpdate: (evaluation: EngineEvaluation) => void
  ): () => void {
    this.stop();
    this.postCommand(`position fen ${fen}`);
    this.postCommand('go infinite');

    const unsubscribe = this.addListener((line: string) => {
      if (line.startsWith('info') && line.includes('score')) {
        const parsed = this.parseInfoLine(line);
        if (parsed) onUpdate(parsed);
      }
    });

    return () => {
      this.stop();
      unsubscribe();
    };
  }

  /**
   * Parse UCI info string to extract depth, score, nodes, and principal variation (pv)
   */
  private parseInfoLine(line: string): EngineEvaluation | null {
    const tokens = line.split(' ');
    let depth = 0;
    let score: { type: 'cp' | 'mate'; value: number } | null = null;
    let nodes: number | undefined;
    let nps: number | undefined;
    let pv: string[] | undefined;

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === 'depth' && tokens[i + 1]) {
        depth = parseInt(tokens[i + 1], 10);
      } else if (tokens[i] === 'score') {
        const type = tokens[i + 1];
        const val = parseInt(tokens[i + 2], 10);
        if (type === 'cp' || type === 'mate') {
          score = { type, value: isNaN(val) ? 0 : val };
        }
      } else if (tokens[i] === 'nodes' && tokens[i + 1]) {
        nodes = parseInt(tokens[i + 1], 10);
      } else if (tokens[i] === 'nps' && tokens[i + 1]) {
        nps = parseInt(tokens[i + 1], 10);
      } else if (tokens[i] === 'pv') {
        pv = tokens.slice(i + 1);
        break;
      }
    }

    if (depth === 0 && !score) return null;

    return {
      depth,
      score,
      nodes,
      nps,
      pv,
      bestMove: pv && pv.length > 0 ? pv[0] : undefined
    };
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.listeners.clear();
    this.isReady = false;
    this.isInitializing = false;
  }
}

// Singleton instance for global usage across the app
export const stockfish = new StockfishEngine();

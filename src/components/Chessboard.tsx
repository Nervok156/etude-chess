import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPieceSvg } from './ChessPieceSvg.tsx';

interface ChessboardProps {
  fen: string;
  orientation?: 'white' | 'black';
  onMove?: (from: string, to: string, promotion?: string) => boolean;
  disabled?: boolean;
  lastMove?: { from: string; to: string } | null;
  hintSquare?: string | null;
  isMini?: boolean;
  className?: string;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  orientation = 'white',
  onMove,
  disabled = false,
  lastMove = null,
  hintSquare = null,
  isMini = false,
  className = ''
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Parse current FEN with chess.js
  const chess = React.useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  }, [fen]);

  // Find king square if in check
  const inCheck = chess.inCheck();
  const kingSquare = React.useMemo(() => {
    if (!inCheck) return null;
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${FILES[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, [chess, inCheck]);

  // Clear selection on FEN change
  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [fen]);

  const files = orientation === 'white' ? FILES : [...FILES].reverse();
  const ranks = orientation === 'white' ? [...RANKS].reverse() : RANKS;

  const checkIsPromotion = (from: string, to: string): boolean => {
    const piece = chess.get(from as Square);
    if (!piece || piece.type !== 'p') return false;
    return (piece.color === 'w' && to.endsWith('8')) || (piece.color === 'b' && to.endsWith('1'));
  };

  const handleSquareClick = (square: string) => {
    if (disabled || isMini || !onMove || pendingPromotion) return;

    // If clicking on a legal destination for currently selected piece
    if (selectedSquare && legalMoves.includes(square)) {
      if (checkIsPromotion(selectedSquare, square)) {
        setPendingPromotion({ from: selectedSquare, to: square });
        return;
      }
      const success = onMove(selectedSquare, square);
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Otherwise check if clicked square has a piece of the current turn
    const piece = chess.get(square as Square);
    if (piece && piece.color === chess.turn()) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        setSelectedSquare(square);
        const moves = chess.moves({ square: square as Square, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
      }
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (disabled || isMini || !onMove || pendingPromotion) {
      e.preventDefault();
      return;
    }
    const piece = chess.get(square as Square);
    if (!piece || piece.color !== chess.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    setSelectedSquare(square);
    const moves = chess.moves({ square: square as Square, verbose: true });
    setLegalMoves(moves.map((m) => m.to));
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || isMini || !onMove) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: string) => {
    if (disabled || isMini || !onMove) return;
    e.preventDefault();
    const fromSquare = draggedSquare || e.dataTransfer.getData('text/plain');
    if (fromSquare && fromSquare !== targetSquare) {
      if (legalMoves.includes(targetSquare)) {
        if (checkIsPromotion(fromSquare, targetSquare)) {
          setPendingPromotion({ from: fromSquare, to: targetSquare });
          setDraggedSquare(null);
          return;
        }
        onMove(fromSquare, targetSquare);
      }
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleSelectPromotionPiece = (pieceType: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion && onMove) {
      onMove(pendingPromotion.from, pendingPromotion.to, pieceType);
      setPendingPromotion(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  return (
    <div
      ref={boardRef}
      id="chessboard-container"
      className={`relative select-none aspect-square rounded-lg overflow-hidden border border-[#333] shadow-2xl ${className}`}
      style={{ touchAction: 'none' }}
    >
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const isDark = (fileIndex + rankIndex) % 2 === 1;
            const piece = chess.get(square as Square);

            const isSelected = selectedSquare === square;
            const isLegalTarget = legalMoves.includes(square);
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isCheckSquare = kingSquare === square;
            const isHint = hintSquare === square;

            // Background coloring
            let squareBg = isDark ? 'bg-[#779556]' : 'bg-[#ebecd0]';
            if (isLastMoveFrom || isLastMoveTo) {
              squareBg = isDark ? 'bg-[#bbcb2b]' : 'bg-[#f5f682]';
            }
            if (isSelected) {
              squareBg = isDark ? 'bg-[#9fb735]' : 'bg-[#e4e840]';
            }
            if (isCheckSquare) {
              squareBg = 'bg-[#cc3333]';
            }

            return (
              <div
                key={square}
                id={`square-${square}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${squareBg}`}
              >
                {/* Board coordinates */}
                {!isMini && fileIndex === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[10px] font-semibold leading-none pointer-events-none ${
                      isDark ? 'text-[#ebecd0]/70' : 'text-[#779556]/70'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {!isMini && rankIndex === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] font-semibold leading-none pointer-events-none ${
                      isDark ? 'text-[#ebecd0]/70' : 'text-[#779556]/70'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Hint pulsator */}
                {isHint && (
                  <div className="absolute inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-75 pointer-events-none" />
                )}

                {/* Piece representation */}
                {piece && (
                  <div
                    draggable={!disabled && !isMini && piece.color === chess.turn()}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className={`w-[84%] h-[84%] flex items-center justify-center transition-transform duration-75 active:scale-95 ${
                      !disabled && !isMini && piece.color === chess.turn() ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''
                    }`}
                  >
                    <ChessPieceSvg
                      piece={piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()}
                    />
                  </div>
                )}

                {/* Legal move destination marker */}
                {isLegalTarget && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {piece ? (
                      // Capture target: outer ring
                      <div className="w-[88%] h-[88%] rounded-full border-4 border-black/25" />
                    ) : (
                      // Quiet move: small center dot
                      <div className="w-[30%] h-[30%] rounded-full bg-black/20" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Promotion selection overlay */}
      {pendingPromotion && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-30 p-4">
          <div className="bg-[#24262e] border border-[#3b3e4a] rounded-xl p-4 shadow-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Выберите фигуру превращения:
            </span>
            <div className="flex items-center gap-2">
              {(['q', 'r', 'b', 'n'] as const).map((pt) => {
                const turn = chess.turn();
                const pieceSymbol = turn === 'w' ? pt.toUpperCase() : pt.toLowerCase();
                const labels: Record<string, string> = {
                  q: 'Ферзь',
                  r: 'Ладья',
                  b: 'Слон',
                  n: 'Конь'
                };
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => handleSelectPromotionPiece(pt)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-[#18191d] hover:bg-[#333742] border border-[#323642] hover:border-[#779556] transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ChessPieceSvg piece={pieceSymbol} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#b5bcc9] group-hover:text-white">
                      {labels[pt]}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingPromotion(null);
                setSelectedSquare(null);
                setLegalMoves([]);
              }}
              className="text-[11px] text-[#9ca3af] hover:text-white underline mt-1"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

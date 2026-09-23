import React from 'react';

interface PieceProps {
  piece: string; // 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K'
  className?: string;
}

const PIECE_NAMES: Record<string, string> = {
  wP: 'Белая пешка',
  wN: 'Белый конь',
  wB: 'Белый слон',
  wR: 'Белая ладья',
  wQ: 'Белый ферзь',
  wK: 'Белый король',
  bP: 'Чёрная пешка',
  bN: 'Чёрный конь',
  bB: 'Чёрный слон',
  bR: 'Чёрная ладья',
  bQ: 'Чёрный ферзь',
  bK: 'Чёрный король',
};

export const ChessPieceSvg: React.FC<PieceProps> = ({ piece, className = 'w-full h-full' }) => {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const pieceCode = `${isWhite ? 'w' : 'b'}${piece.toUpperCase()}`;
  const localSrc = `/pieces/cburnett/${pieceCode}.svg`;
  const cdnFallback = `https://lichess1.org/assets/piece/cburnett/${pieceCode}.svg`;

  return (
    <img
      src={localSrc}
      alt={PIECE_NAMES[pieceCode] || pieceCode}
      className={`select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] object-contain ${className}`}
      draggable={false}
      loading="eager"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.src !== cdnFallback) {
          target.src = cdnFallback;
        }
      }}
    />
  );
};


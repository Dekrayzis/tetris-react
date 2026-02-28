import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { TETROMINOS, type TetrominoKey, type TetrominoShape } from '../tetrominos';
import TetrominoBackdrop from './TetrominoBackdrop';

type BackdropPiece = {
  id: string;
  shape: TetrominoShape;
  color: string;
  leftPct: number;
  sizePx: number;
  opacity: number;
  durationMs: number;
  rotation: 0 | 1 | 2 | 3;
};

const fall = keyframes`
  0% {
    transform: translate3d(0, -25vh, 0);
  }
  100% {
    transform: translate3d(0, 125vh, 0);
  }
`;

const rotateFlap = keyframes`
  0% { rotate: 0deg; }
  32% { rotate: 0deg; }
  45% { rotate: 90deg; }
  65% { rotate: 90deg; }
  78% { rotate: 180deg; }
  100% { rotate: 270deg; }
`;

const BackdropRoot = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Piece = styled.div<{ $leftPct: number; $durationMs: number; $opacity: number }>`
  position: absolute;
  left: ${p => p.$leftPct}%;
  top: 0;
  opacity: ${p => p.$opacity};

  animation: ${fall} ${p => p.$durationMs}ms linear infinite;

  will-change: transform;
`;

const PieceInner = styled.div<{ $durationMs: number; $rotation: number }>`
  transform-origin: 50% 50%;
  rotate: ${p => p.$rotation * 90}deg;

  animation: ${rotateFlap} ${p => Math.max(1800, Math.floor(p.$durationMs * 0.9))}ms steps(1) infinite;
`;

const tetrominoKeys: TetrominoKey[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

const pickRandom = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const createPiece = (): BackdropPiece => {
  const key = pickRandom(tetrominoKeys);
  const base = TETROMINOS[key];

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    shape: base.shape,
    color: base.color,
    leftPct: Math.floor(Math.random() * 92) + 2,
    sizePx: Math.floor(Math.random() * 12) + 20,
    opacity: Math.random() * 0.35 + 0.15,
    durationMs: Math.floor(Math.random() * 5000) + 9000,
    rotation: (Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3),
  };
};

export default function TitleBackdrop() {
  const [pieces, setPieces] = useState<BackdropPiece[]>([]);

  const initialPieces = useMemo(() => Array.from({ length: 10 }, () => createPiece()), []);

  useEffect(() => {
    setPieces(initialPieces);

    const intervalId = window.setInterval(() => {
      setPieces((prev) => {
        const next = prev.length < 18 ? [...prev, createPiece()] : prev;
        return next;
      });
    }, 650);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [initialPieces]);

  return (
    <BackdropRoot aria-hidden>
      {pieces.map((p) => (
        <Piece key={p.id} $leftPct={p.leftPct} $durationMs={p.durationMs} $opacity={p.opacity}>
          <PieceInner $durationMs={p.durationMs} $rotation={p.rotation}>
            <TetrominoBackdrop shape={p.shape} color={p.color} tileSize={p.sizePx} />
          </PieceInner>
        </Piece>
      ))}
    </BackdropRoot>
  );
}

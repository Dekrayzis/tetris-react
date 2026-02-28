import React from 'react';

import Block from './Block';
import type { TetrominoShape } from '../tetrominos';

type TetrominoBackdropProps = {
  shape: TetrominoShape;
  color: string;
  tileSize: number;
};

const TetrominoBackdrop = ({ shape, color, tileSize }: TetrominoBackdropProps) => {
  const width = (shape[0]?.length ?? 0) * tileSize;
  const height = shape.length * tileSize;

  const hasCell = (x: number, y: number) => {
    if (y < 0 || y >= shape.length) {
      return false;
    }
    const row = shape[y];
    if (!row || x < 0 || x >= row.length) {
      return false;
    }
    return row[x] !== 0;
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      {shape.flatMap((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) {
            return null;
          }

          const borderEdges = {
            top: true,
            left: true,
            right: !hasCell(x + 1, y),
            bottom: !hasCell(x, y + 1),
          };

          return (
            <Block
              key={`${x}-${y}`}
              tileSize={tileSize}
              color={`rgba(${color}, 0.10)`}
              borderColor={`rgba(${color}, 0.55)`}
              borderEdges={borderEdges}
              position={[x, y]}
            />
          );
        })
      )}
    </div>
  );
};

export default TetrominoBackdrop;

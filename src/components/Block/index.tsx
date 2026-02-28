import React from 'react';
import { css } from 'aphrodite';

import styles from './styles';
import { TILE_SIZE } from '../../constants/game-board';


type BlockProps = {
  position?: [number, number];
  color?: string;
  tileSize?: number;
  stepSize?: number;
  borderOnly?: boolean;
  borderColor?: string;
  borderEdges?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
};

const Block = ({
  position = [0, 0],
  color = 'transparent',
  tileSize = TILE_SIZE,
  stepSize,
  borderOnly = false,
  borderColor,
  borderEdges,
}: BlockProps) => {
  const effectiveStepSize = stepSize ?? tileSize;
  const borderValue = `1px solid ${borderColor ?? color}`;
  const usePerEdgeBorders = Boolean(borderEdges);

  return (
    <div
      className={css(styles.block)}
      style={{
        boxSizing: 'border-box',
        backgroundColor: borderOnly ? 'transparent' : color,
        border: borderOnly && !usePerEdgeBorders ? borderValue : 'none',
        borderTop: usePerEdgeBorders && borderEdges?.top ? borderValue : undefined,
        borderRight: usePerEdgeBorders && borderEdges?.right ? borderValue : undefined,
        borderBottom: usePerEdgeBorders && borderEdges?.bottom ? borderValue : undefined,
        borderLeft: usePerEdgeBorders && borderEdges?.left ? borderValue : undefined,
        width: tileSize + 'px',
        height: tileSize + 'px',
        left: position[0] * effectiveStepSize + 'px',
        top: position[1] * effectiveStepSize + 'px',
      }}
    />
  );
};

export default Block;

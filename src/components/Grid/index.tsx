import { useCallback } from 'react';

import { drawLine } from '../../helpers/canvas';
import Canvas from '../Canvas';


type GridProps = {
  numRows: number;
  numCols: number;
  tileSize: number;
  lineColor?: string;
  withOuterBorder?: boolean;
};

const Grid = ({
  numRows,
  numCols,
  tileSize,
  lineColor = '#CCC',
  withOuterBorder = false,
}: GridProps) => {
  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const width = numCols * tileSize;
      const height = numRows * tileSize;

      // eslint-disable-next-line no-param-reassign
      ctx.strokeStyle = lineColor;

      // Draw the outer border, if requested
      if (withOuterBorder) {
        ctx.rect(0, 0, width, height);
        ctx.stroke();
      }

      // Draw all the row lines
      for (let i = 1; i < numRows; i += 1) {
        drawLine(
          ctx,
          [0, i * tileSize],
          [width, i * tileSize]
        );
      }

      // Draw all the col lines.
      for (let i = 1; i < numCols; i += 1) {
        drawLine(
          ctx,
          [i * tileSize, 0],
          [i * tileSize, height]
        );
      }
    },
    [lineColor, numCols, numRows, tileSize, withOuterBorder]
  );

  const width = numCols * tileSize;
  const height = numRows * tileSize;

  return (
    <Canvas
      width={width}
      height={height}
      draw={draw}
    />
  );
};

export default Grid;

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';

import { scaleCanvas } from '../../helpers/canvas';


type CanvasProps = {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  draw: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
};

const Canvas = ({ style, width = 800, height = 600, draw }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Reset the canvas, so that the update can just draw the new contents.
    ctx.clearRect(0, 0, width, height);

    draw(canvas, ctx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    scaleCanvas(canvas, ctx);
    updateCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateCanvas();
  }, [width, height, draw]);

  return (
    <canvas
      ref={(c) => {
        canvasRef.current = c;
      }}
      style={style}
      width={width}
      height={height}
    />
  );
};

export default Canvas;

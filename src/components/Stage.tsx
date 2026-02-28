import React from 'react';
import Cell from './Cell';

import styles from './Stage.module.scss';

type PushDir = 0 | 1 | 2 | 3;

type StageCell = [any, string];

type StageGrid = StageCell[][];

type StageProps = {
  stage: StageGrid;
  frameColor?: string;
  pushDir?: PushDir;
};

const CellComponent = Cell as unknown as React.ComponentType<{ type: any }>;

const pushDirectionMap: Record<PushDir, string> = {
  0: '',
  1: 'pushRight',
  2: 'pushDown',
  3: 'pushLeft'
};

const Stage = ({ stage, frameColor, pushDir = 0 }: StageProps) => (
  <div
    id="tetroBoard"
    tabIndex={-1}
    className={`${styles.stage} ${pushDirectionMap[pushDir]}`.trim()}
    style={
      {
        ['--stage-width' as any]: stage[0].length,
        ['--stage-height' as any]: stage.length,
        ['--stage-frame' as any]: frameColor || undefined
      } as React.CSSProperties
    }
  >
    {stage.map((row) => row.map((cell, x) => <CellComponent key={x} type={cell[0]} />))}
  </div>
);

export default Stage;

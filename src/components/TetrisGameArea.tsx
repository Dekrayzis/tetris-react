import React from 'react';
import GameArea from './GameArea';
import NameBox from './NameBox';
import Stage from './Stage';

type LevelDataItem = {
  completionLines?: number;
  frame?: string;
};

type TetrisGameAreaProps = {
  stage: any;
  frameColor?: string;
  shake: boolean;
  badgeTxt: string | null;
  speedLvl: number;
  rows: number;
  levelData: LevelDataItem;
  showBadge: boolean;
  elapsedTime: string;
  score: number;
  showScoreIndicator: boolean;
  highScore: number;
  shunt: number;
  zoneProgress: number;
  zoneColor?: string;
  stageComplete: boolean;
  zoneRowCount: number;
  zoneRowHeight: number;
  displayNameBox: boolean;
  playerName: string;
  playerHighScore: number;
  setPlayerName: (name: string) => void;
  onSubmitHighScore: () => void;
};

const TetrisGameArea = ({
  stage,
  frameColor,
  shake,
  badgeTxt,
  speedLvl,
  rows,
  levelData,
  showBadge,
  elapsedTime,
  score,
  showScoreIndicator,
  highScore,
  shunt,
  zoneProgress,
  zoneColor,
  stageComplete,
  zoneRowCount,
  zoneRowHeight,
  displayNameBox,
  playerName,
  playerHighScore,
  setPlayerName,
  onSubmitHighScore,
}: TetrisGameAreaProps) => {
  return (
    <GameArea
      shake={shake}
      badgeTxt={badgeTxt}
      speedLvl={speedLvl}
      rows={rows}
      levelData={levelData}
      showBadge={showBadge}
      elapsedTime={elapsedTime}
      score={score}
      showScoreIndicator={showScoreIndicator}
      highScore={highScore}
      shunt={shunt}
      zoneProgress={zoneProgress}
      zoneColor={zoneColor}
      stageComplete={stageComplete}
      zoneRowCount={zoneRowCount}
      zoneRowHeight={zoneRowHeight}
    >
      <Stage stage={stage as any} frameColor={frameColor} />
      {displayNameBox ? (
        <NameBox name={playerName} score={playerHighScore} setName={setPlayerName} callback={onSubmitHighScore} />
      ) : null}
    </GameArea>
  );
};

export default TetrisGameArea;

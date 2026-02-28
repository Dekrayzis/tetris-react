import React from 'react';
import { CanvasOverlay } from './styles/StyledCanvasScreen';
import DialogResults from './DialogResults';
import GameOverDialog from './GameOverDialog';
import HowToPlayDialog from './HowToPlayDialog';
import { numberWithCommas } from '../util';

type TetrisOverlaysProps = {
  showHowToPlay: boolean;
  showResultsScreen: boolean;
  showGameOverScreen: boolean;
  gameOver: boolean;
  isLevelComplete: boolean;
  zoneActive: boolean;
  linesCleared: number;
  speedLvl: number;
  time: string;
  score: number;
  onContinue: () => void;
  onQuit: () => void;
  onRetry: () => void;
  onAcknowledgeHowToPlay: () => void;
};

const TetrisOverlays = ({
  showHowToPlay,
  showResultsScreen,
  showGameOverScreen,
  gameOver,
  isLevelComplete,
  zoneActive,
  linesCleared,
  speedLvl,
  time,
  score,
  onContinue,
  onQuit,
  onRetry,
  onAcknowledgeHowToPlay,
}: TetrisOverlaysProps) => {
  return (
    <>
      {showHowToPlay ? (
        <CanvasOverlay $opacity={0.6} $depth={6}>
          <HowToPlayDialog onOk={onAcknowledgeHowToPlay} />
        </CanvasOverlay>
      ) : null}

      {!zoneActive && isLevelComplete ? (
        <CanvasOverlay $opacity={showResultsScreen ? 0.98 : 0} $depth={showResultsScreen ? 5 : -1}>
          <DialogResults
            linesCleared={linesCleared}
            speedLvl={speedLvl}
            time={time}
            score={numberWithCommas(score)}
            callback={onContinue}
          />
        </CanvasOverlay>
      ) : null}

      {gameOver ? (
        <CanvasOverlay $opacity={showGameOverScreen ? 0.98 : 0} $depth={showGameOverScreen ? 5 : -1}>
          <GameOverDialog title="Game Over" quit={onQuit} retry={onRetry} />
        </CanvasOverlay>
      ) : null}
    </>
  );
};

export default TetrisOverlays;

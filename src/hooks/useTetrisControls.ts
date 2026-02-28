import { useCallback } from 'react';

type KeyEvent = { keyCode: number };

type UseTetrisControlsArgs = {
  showHowToPlay: boolean;
  gameOver: boolean;
  isLevelComplete: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onRotate: () => void;
  onBombDrop: () => void;
  onActivateZone: () => void;
  onKeyUpDownArrow: () => void;
};

export function useTetrisControls({
  showHowToPlay,
  gameOver,
  isLevelComplete,
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onRotate,
  onBombDrop,
  onActivateZone,
  onKeyUpDownArrow,
}: UseTetrisControlsArgs) {
  const onKeyDown = useCallback(
    ({ keyCode }: KeyEvent) => {
      if (showHowToPlay) return;
      if (gameOver) return;
      if (isLevelComplete) return;

      if (keyCode === 37) {
        onMoveLeft();
      } else if (keyCode === 39) {
        onMoveRight();
      } else if (keyCode === 40) {
        onSoftDrop();
      } else if (keyCode === 38) {
        onRotate();
      } else if (keyCode === 66) {
        onBombDrop();
      } else if (keyCode === 90) {
        onActivateZone();
      }
    },
    [gameOver, isLevelComplete, onActivateZone, onBombDrop, onMoveLeft, onMoveRight, onRotate, onSoftDrop, showHowToPlay]
  );

  const onKeyUp = useCallback(
    ({ keyCode }: KeyEvent) => {
      if (showHowToPlay) return;
      if (gameOver) return;

      if (keyCode === 40) {
        onKeyUpDownArrow();
      }
    },
    [gameOver, onKeyUpDownArrow, showHowToPlay]
  );

  return { onKeyDown, onKeyUp };
}

/**
 * Main Tetris game logic
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

import UIfx from 'uifx';
import { addDoc, collection } from 'firebase/firestore';

// Helpers & styles
import { numberWithCommas } from '../util';
import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
import { CanvasOverlay } from './styles/StyledCanvasScreen';
import GameArea from './GameArea';
import levelData from '../data/levels';
import { db } from '../firebase/config';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import { musicPlayer, stopAudio, fadeMasterAudio } from '../hooks/useMusicPlayer';
import { useZoneProgress } from '../hooks/useZoneProgress';

// Components
import Stage from './Stage';
import NameBox from './NameBox';
import DialogResults from './DialogResults';
import GameOverDialog from './GameOverDialog';
import CompletedText from './CompletedText';
import HowToPlayDialog from './HowToPlayDialog';

// fx
import { sfx_Collided, sfx_GameOver } from '../config/config';

// SFX
const fxCollide = new UIfx(sfx_Collided, { volume: 0.5 });
const fxGameOver = new UIfx(sfx_GameOver, { volume: 0.7 });

const iDropIntervalTime = 500;
const HOW_TO_PLAY_STORAGE_KEY = 'tetris-react:how-to-play-ack';

type LevelDataItem = {
  levelNum?: number;
  completionLines?: number;
  frame?: string;
  music?: any;
};

type Props = {
  backToMain: () => void;
  highScores: Array<{ score: number | string }>;
};

const Tetris: React.FC<Props> = ({ backToMain, highScores }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(() => {
    try {
      return localStorage.getItem(HOW_TO_PLAY_STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const didPauseForHowToPlayRef = useRef(false);

  // Music track instances.
  const [trackInstance1, setTrackInstance1] = useState<any>(null);
  const [trackInstance2, setTrackInstance2] = useState<any>(null);

  // Sets the total elapsed seconds.
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Move grid space [0 = static or up, 1 = right, 2 = down, 3 = left]
  const [iPushIdx, setPushIdx] = useState(0);

  // Game interval time.
  const [gameElapsedTime, setElapsedInterval] = useState<number | null>(null);

  // Is level completed ?
  const [isLevelComplete, setLevelComplete] = useState(false);

  // Used to set a flash on the score counter when the score is increased.
  const [scoreIndicator, setScoreIndicator] = useState(false);

  // The Tetronimo drop time.
  const [dropTime, setDropTime] = useState<number | null>(null);

  // Display/hide gameover bar
  const [gameOver, setGameOver] = useState(false);
  const [hasLevelBegun, setLevelStarted] = useState(false);

  // used for boosting the Tetromino downwards.
  const [userBombDrop, setBombDrop] = useState(false);

  // Game time string.
  const [elapsedGameTime, setGameTime] = useState('00:00');

  // Display/hide the new highscore dialog window.
  const [displayNameBox, setDisplayNameBox] = useState(false);

  // Player name.
  const [playerName, setPlayerName] = useState('');

  // current level speed.
  const [speedLevel, setSpeedLevel] = useState(0);

  // Current level data.
  const [getLevelData, setLevelData] = useState<LevelDataItem>({});

  // Overlay screens
  const [showGameOverScreen, setGameOverScreen] = useState(false);
  const [showResultsScreen, setResultsScreen] = useState(false);

  // In the zone
  const [iZoneProgress, setZoneProgress] = useState(100);
  const [bZoneActivated, setZoneActive] = useState(false);
  const [iZoneInterval, setZoneInterval] = useState<number | null>(null);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, bZoneActivated);
  const [iZoneRows, setZoneRows, iHeight, setHeight] = useZoneProgress(rowsCleared, bZoneActivated);

  // Player stats
  const [playerHighScore, setPlayerHighScore] = useState(0);
  const [
    iScore,
    setScore,
    iRows,
    setRows,
    iLevel,
    setLevel,
    showTetrisBadge,
    tetrisBadgeText,
    shakeScreen,
    setShake,
  ] = useGameStatus(rowsCleared, setScoreIndicator, setZoneProgress);

  /**
   * TODO: if these already exist in your file, paste them back in.
   */
  const resetZoneTimer = useCallback(() => {
    // TODO: implement your existing reset logic (you had iZoneTimer global before)
  }, []);

  const GameTimer = useCallback(() => {
    setTotalSeconds((prev) => {
      const next = prev + 1;
      const minutes = Math.floor(next / 60);
      const seconds = next % 60;

      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      setGameTime(`${mm}:${ss}`);

      return next;
    });
  }, []);

  /**
   * Moves the Tetronimo around the playing field.
   */
  const movePlayer = useCallback(
    (f_Dir: number) => {
      if (!checkCollision(player, stage, { x: f_Dir, y: 0 })) {
        updatePlayerPos({ x: f_Dir, y: 0, collided: false });
      }
    },
    [player, stage, updatePlayerPos]
  );

  /**
   * Changes the fall speed of the tetromino.
   */
  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (showHowToPlay) return;
    if (gameOver) return;

    if (keyCode === 40) {
      setDropTime(iDropIntervalTime / (iLevel + 1));
    }

    setPushIdx(0);
  };

  /**
   * Sets the current level data.
   */
  const setCurrentLevel = useCallback(() => {
    const oLevelItem = levelData[iLevel];
    if (!oLevelItem) return;

    setLevelData(oLevelItem);
    setSpeedLevel(oLevelItem.levelNum ?? iLevel);

    musicPlayer(
      setTrackInstance1,
      setTrackInstance2,
      trackInstance1,
      trackInstance2,
      oLevelItem.music,
      levelData[iLevel + 1]?.music ?? null
    );
  }, [iLevel, trackInstance1, trackInstance2]);

  /**
   * Starts the game/level.
   */
  const startLevel = useCallback(() => {
    if (!hasLevelBegun && iLevel < levelData.length) {
      setResultsScreen(false);

      setStage(createStage());
      setCurrentLevel();

      // Reset time values
      setTotalSeconds(0);
      setGameTime('00:00');
      setElapsedInterval(1000);
      setDropTime(iDropIntervalTime / (iLevel + 1));

      // Reset player values
      resetPlayer();
      setScore(0);
      setLevel(iLevel);
      setRows(0);

      // UI
      setGameOver(false);
      setLevelStarted(true);
      setLevelComplete(false);

      setPlayerHighScore(iScore + playerHighScore);
    }

    // Game complete.
    if (iLevel > levelData.length) {
      setDropTime(null);
      setElapsedInterval(null);
      setLevelComplete(true);
      setLevelStarted(false);
    }
  }, [
    hasLevelBegun,
    iLevel,
    iScore,
    playerHighScore,
    resetPlayer,
    setCurrentLevel,
    setLevel,
    setRows,
    setScore,
    setStage,
  ]);

  useEffect(() => {
    startLevel();
  }, [startLevel]);

  // Pause gameplay while how-to-play overlay is showing (only once per level start)
  useEffect(() => {
    if (!showHowToPlay) return;
    if (!hasLevelBegun) return;
    if (didPauseForHowToPlayRef.current) return;

    didPauseForHowToPlayRef.current = true;
    setDropTime(null);
    setElapsedInterval(null);
  }, [hasLevelBegun, showHowToPlay]);

  // Refocus board when no overlays are open
  useEffect(() => {
    const anyOverlayOpen = showHowToPlay || showResultsScreen || showGameOverScreen || gameOver;
    if (anyOverlayOpen) return;

    let rafId: number | null = null;
    let attempts = 0;
    const maxAttempts = 120;

    const focusBoard = () => {
      attempts += 1;
      const el = document.getElementById('tetroBoard') as any;
      if (el && typeof el.focus === 'function') {
        el.focus();
        rafId = null;
        return;
      }
      if (attempts < maxAttempts) rafId = window.requestAnimationFrame(focusBoard);
    };

    rafId = window.requestAnimationFrame(focusBoard);
    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, [gameOver, showGameOverScreen, showHowToPlay, showResultsScreen]);

  useEffect(() => {
    if (showResultsScreen) fadeMasterAudio(0, 2000);
  }, [showResultsScreen]);

  /**
   * Checks if the new score is greater than the current highscore.
   */
  const ShouldStoreHighScore = useCallback(() => {
    if (highScores.length > 0) {
      if (playerHighScore > parseInt(String(highScores[0].score), 10)) {
        setDisplayNameBox(true);
      }
    } else {
      if (playerHighScore > 0) setDisplayNameBox(true);
    }
  }, [highScores, playerHighScore]);

  /**
   * Submits new Highscore to the database.
   */
  const SubmitNewHighScore = useCallback(async () => {
    if (playerName !== '' && playerName.length > 2) {
      await addDoc(collection(db, 'highscores'), {
        name: playerName,
        level: iLevel,
        score: playerHighScore,
      });
      setDisplayNameBox(false);
    }
  }, [iLevel, playerHighScore, playerName]);

  /**
   * User requests zone to be activated.
   */
  const shouldActivateZone = useCallback(() => {
    if (!bZoneActivated && iZoneProgress === 100) {
      setZoneActive(true);
      setZoneInterval(178);
    }
  }, [bZoneActivated, iZoneProgress]);

  /**
   * Called to move the tetromino down the screen.
   */
  const drop = useCallback(() => {
    // Level completed
    if (!isLevelComplete && iRows >= (getLevelData.completionLines ?? 0)) {
      setResultsScreen(true);
      setLevelComplete(true);
      setDropTime(null);
      setElapsedInterval(null);

      // Reset zone
      setZoneActive(false);
      resetZoneTimer();
      setZoneInterval(null);
      setZoneRows(0);
      setHeight(0);

      return;
    }

    // Move down if no collision
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
      return;
    }

    // Collision: if near top, game over
    if (player.pos.y < 1) {
      setGameOver(true);

      stopAudio(trackInstance1, 0, { immediate: true, stopAll: true });
      stopAudio(trackInstance2, 0, { immediate: true, stopAll: true });
      fxGameOver.play();

      setGameOverScreen(true);
      setDropTime(null);
      setElapsedInterval(null);
      ShouldStoreHighScore();
      return;
    }

    updatePlayerPos({ x: 0, y: 0, collided: true });

    fxCollide.play();
    setPushIdx(2);
    setTimeout(() => setPushIdx(0), 100);

    if (userBombDrop) {
      setBombDrop(false);
      setDropTime(iDropIntervalTime / (iLevel + 1));
    }
  }, [
    ShouldStoreHighScore,
    getLevelData.completionLines,
    iLevel,
    iRows,
    isLevelComplete,
    player,
    resetZoneTimer,
    stage,
    trackInstance1,
    trackInstance2,
    updatePlayerPos,
    userBombDrop,
    setZoneRows,
    setHeight,
  ]);

  /**
   * Triggered when the player pressed the down arrow.
   */
  const dropPlayer = useCallback(() => {
    setDropTime(null);
    drop();
  }, [drop]);

  /**
   * Rapidly drops the Tetronimino.
   */
  const bombDrop = useCallback(() => {
    setBombDrop(true);
    setDropTime(25);
    drop();
  }, [drop]);

  /**
   * Player control.
   */
  const move = useCallback(
    ({ keyCode }: { keyCode: number }) => {
      if (showHowToPlay) return;
      if (gameOver) return;
      if (isLevelComplete) return;

      if (keyCode === 37) {
        movePlayer(-1);
        setPushIdx(3);
      } else if (keyCode === 39) {
        movePlayer(1);
        setPushIdx(1);
      } else if (keyCode === 40) {
        dropPlayer();
        setPushIdx(2);
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode === 66) {
        bombDrop();
      } else if (keyCode === 90) {
        shouldActivateZone();
      }
    },
    [bombDrop, dropPlayer, gameOver, isLevelComplete, movePlayer, playerRotate, shouldActivateZone, showHowToPlay, stage]
  );

  /**
   * Advance to next level (your snippet had this logic “loose”)
   */
  const continueGame = useCallback(() => {
    setResultsScreen(false);
    setLevelStarted(false);
    setShake(false);

    // stop audio before next level
    stopAudio(trackInstance1, 0, { immediate: true, stopAll: true });
    stopAudio(trackInstance2, 0, { immediate: true, stopAll: true });

    // start next level
    didPauseForHowToPlayRef.current = false;
    setLevel((prev) => prev + 1);
  }, [trackInstance1, trackInstance2, setLevel, setShake]);

  const replayPrevGame = useCallback(() => {
    setResultsScreen(false);
    setGameOver(false);
    setLevelComplete(false);
    setLevelStarted(false);
    setGameOverScreen(false);

    didPauseForHowToPlayRef.current = false;
    startLevel();
  }, [startLevel]);

  const quitGame = useCallback(() => {
    setResultsScreen(false);

    stopAudio(trackInstance1, 0, { immediate: true, stopAll: true });
    stopAudio(trackInstance2, 0, { immediate: true, stopAll: true });

    backToMain();
  }, [backToMain, trackInstance1, trackInstance2]);

  const acknowledgeHowToPlay = useCallback(() => {
    try {
      localStorage.setItem(HOW_TO_PLAY_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setShowHowToPlay(false);

    setElapsedInterval(1000);
    setDropTime(iDropIntervalTime / (iLevel + 1));

    let attempts = 0;
    const maxAttempts = 120;

    const focusBoard = () => {
      attempts += 1;
      const el = document.getElementById('tetroBoard') as any;
      if (el && typeof el.focus === 'function') {
        el.focus();
        return;
      }
      if (attempts < maxAttempts) window.requestAnimationFrame(focusBoard);
    };

    window.requestAnimationFrame(focusBoard);
  }, [iLevel]);

  // Timers
  useInterval(() => drop(), dropTime);
  useInterval(() => GameTimer(), gameElapsedTime);
  useInterval(() => {
    // Zone timer tick (if you previously had zoneTimer using iZoneTimer global)
    if (!bZoneActivated || iZoneInterval == null) return;

    setZoneProgress((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setZoneActive(false);
        resetZoneTimer();
        setZoneInterval(null);
        setElapsedInterval(1000);
        setZoneRows(0);
        setHeight(0);
        return 0;
      }
      setElapsedInterval(null);
      return next;
    });
  }, iZoneInterval);

  return (
    <StyledTetrisWrapper role="button" tabIndex={0} onKeyDown={(e: any) => move(e)} onKeyUp={keyUp}>
      {isLevelComplete && getLevelData.levelNum === 7 ? <CompletedText title="COMPLETED GAME" quit={quitGame} /> : null}

      {hasLevelBegun ? (
        <StyledTetris>
          {showHowToPlay ? (
            <CanvasOverlay $opacity={0.6} $depth={6}>
              <HowToPlayDialog onOk={acknowledgeHowToPlay} />
            </CanvasOverlay>
          ) : null}

          {!bZoneActivated && isLevelComplete ? (
            <CanvasOverlay $opacity={showResultsScreen ? 0.98 : 0} $depth={showResultsScreen ? 5 : -1}>
              <DialogResults
                linesCleared={iRows}
                speedLvl={speedLevel}
                time={elapsedGameTime}
                score={numberWithCommas(iScore)}
                callback={continueGame}
              />
            </CanvasOverlay>
          ) : null}

          {gameOver ? (
            <CanvasOverlay $opacity={showGameOverScreen ? 0.98 : 0} $depth={showGameOverScreen ? 5 : -1}>
              <GameOverDialog title="Game Over" quit={quitGame} retry={replayPrevGame} />
            </CanvasOverlay>
          ) : null}

          <GameArea
            shake={shakeScreen}
            badgeTxt={tetrisBadgeText}
            speedLvl={speedLevel}
            rows={iRows}
            levelData={getLevelData}
            showBadge={showTetrisBadge}
            elapsedTime={elapsedGameTime}
            score={iScore}
            showScoreIndicator={scoreIndicator}
            highScore={playerHighScore}
            shunt={iPushIdx}
            zoneProgress={iZoneProgress > 100 ? 100 : iZoneProgress}
            zoneColor={getLevelData.frame}
            stageComplete={isLevelComplete}
            zoneRowCount={iZoneRows}
            zoneRowHeight={bZoneActivated ? iHeight : 0}
          >
            <Stage stage={stage as any} frameColor={getLevelData.frame} />
            {displayNameBox ? (
              <NameBox name={playerName} score={playerHighScore} setName={setPlayerName} callback={SubmitNewHighScore} />
            ) : null}
          </GameArea>
        </StyledTetris>
      ) : null}
    </StyledTetrisWrapper>
  );
};

export default Tetris;
/**
 * Main Tetris game logic
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

import UIfx from 'uifx';
import { addDoc, collection } from 'firebase/firestore';

// Helpers & styles
import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
import levelData from '../data/levels';
import { db } from '../firebase/config';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import { musicPlayer, stopAudio, fadeMasterAudio } from '../hooks/useMusicPlayer';
import { useGameTimer } from '../hooks/useGameTimer';
import { useZone } from '../hooks/useZone';
import { useTetrisControls } from '../hooks/useTetrisControls';
import { isMuted } from '../util/isMuted';

// Components
import CompletedText from './CompletedText';
import TetrisOverlays from './TetrisOverlays';
import TetrisGameArea from './TetrisGameArea';

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

  // Move grid space [0 = static or up, 1 = right, 2 = down, 3 = left]
  const [iPushIdx, setPushIdx] = useState(0);

  const {
    elapsedTime: elapsedGameTime,
    pause: pauseGameTimer,
    reset: resetGameTimer,
    resume: resumeGameTimer,
  } = useGameTimer();

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
  const [bZoneActivated, setZoneActive] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, bZoneActivated);

  const zone = useZone({
    rowsCleared,
    onPauseGameTimer: pauseGameTimer,
    onResumeGameTimer: () => resumeGameTimer(1000),
  });

  const {
    zoneProgress: iZoneProgress,
    setZoneProgress,
    zoneActive,
    activateZone,
    resetZone,
    zoneRowCount: iZoneRows,
    zoneRowHeight: iHeight,
  } = zone;

  useEffect(() => {
    setZoneActive(zoneActive);
  }, [zoneActive]);

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

      // Reset zone state
      resetZone();

      setStage(createStage());
      setCurrentLevel();

      // Reset time values
      resetGameTimer();
      resumeGameTimer(1000);
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
      pauseGameTimer();
      setLevelComplete(true);
      setLevelStarted(false);
    }
  }, [
    hasLevelBegun,
    iLevel,
    iScore,
    playerHighScore,
    resetPlayer,
    pauseGameTimer,
    resetGameTimer,
    resumeGameTimer,
    setCurrentLevel,
    setLevel,
    setRows,
    setScore,
    setStage,
    resetZone,
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
    pauseGameTimer();
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
    activateZone();
  }, [activateZone]);

  /**
   * Called to move the tetromino down the screen.
   */
  const drop = useCallback(() => {
    // Level completed
    if (!isLevelComplete && iRows >= (getLevelData.completionLines ?? 0)) {
      setResultsScreen(true);
      setLevelComplete(true);
      setDropTime(null);
      pauseGameTimer();

      // Reset zone
      resetZone();

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
      if (!isMuted()) fxGameOver.play();

      setGameOverScreen(true);
      setDropTime(null);
      pauseGameTimer();
      ShouldStoreHighScore();
      return;
    }

    updatePlayerPos({ x: 0, y: 0, collided: true });

    if (!isMuted()) fxCollide.play();
    setPushIdx(2);
    setTimeout(() => setPushIdx(0), 100);

    if (userBombDrop) {
      setBombDrop(false);
      setDropTime(iDropIntervalTime / (iLevel + 1));
    }
  }, [
    ShouldStoreHighScore,
    getLevelData.completionLines,
    pauseGameTimer,
    iLevel,
    iRows,
    isLevelComplete,
    player,
    stage,
    trackInstance1,
    trackInstance2,
    updatePlayerPos,
    userBombDrop,
    resetZone,
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

  const controls = useTetrisControls({
    showHowToPlay,
    gameOver,
    isLevelComplete,
    onMoveLeft: () => {
      movePlayer(-1);
      setPushIdx(3);
    },
    onMoveRight: () => {
      movePlayer(1);
      setPushIdx(1);
    },
    onSoftDrop: () => {
      dropPlayer();
      setPushIdx(2);
    },
    onRotate: () => playerRotate(stage, 1),
    onBombDrop: bombDrop,
    onActivateZone: shouldActivateZone,
    onKeyUpDownArrow: () => {
      setDropTime(iDropIntervalTime / (iLevel + 1));
      setPushIdx(0);
    },
  });

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

    resumeGameTimer(1000);
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
  }, [iLevel, resumeGameTimer]);

  // Timers
  useInterval(() => drop(), dropTime);

  return (
    <StyledTetrisWrapper role="button" tabIndex={0} onKeyDown={(e: any) => controls.onKeyDown(e)} onKeyUp={controls.onKeyUp}>
      {isLevelComplete && getLevelData.levelNum === 7 ? <CompletedText title="COMPLETED GAME" quit={quitGame} /> : null}

      {hasLevelBegun ? (
        <StyledTetris>
          <TetrisOverlays
            showHowToPlay={showHowToPlay}
            showResultsScreen={showResultsScreen}
            showGameOverScreen={showGameOverScreen}
            gameOver={gameOver}
            isLevelComplete={isLevelComplete}
            zoneActive={zoneActive}
            linesCleared={iRows}
            speedLvl={speedLevel}
            time={elapsedGameTime}
            score={iScore}
            onContinue={continueGame}
            onQuit={quitGame}
            onRetry={replayPrevGame}
            onAcknowledgeHowToPlay={acknowledgeHowToPlay}
          />

          <TetrisGameArea
            stage={stage}
            frameColor={getLevelData.frame}
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
            zoneRowHeight={zoneActive ? iHeight : 0}
            displayNameBox={displayNameBox}
            playerName={playerName}
            playerHighScore={playerHighScore}
            setPlayerName={setPlayerName}
            onSubmitHighScore={SubmitNewHighScore}
          />
        </StyledTetris>
      ) : null}
    </StyledTetrisWrapper>
  );
};

export default Tetris;
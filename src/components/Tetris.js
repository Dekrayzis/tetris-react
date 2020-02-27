/**
 * Main Tetris game logic
 */

import React, { useState } from 'react';
import UIfx from 'uifx';

// Helpers & styles
import { numberWithCommas } from '../util';
import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
import { CanvasOverlay } from './styles/StyledCanvasScreen';
import GameArea from './GameArea';
import levelData from '../data/levels';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import { musicPlayer, stopAudio } from '../hooks/useMusicPlayer';
import { useZoneProgress } from '../hooks/useZoneProgress';

// Components
import Stage from './Stage';
import NameBox from './NameBox';
import DialogResults from './DialogResults';
import GameOverDialog from './GameOverDialog';
import CompletedText from './CompletedText';

// fx
import sfxCollided from '../data/sfx/collided.wav';

// SFX
const fxCollide = new UIfx(sfxCollided, {
    volume: 0.5 // value must be between 0.0 ⇔ 1.0
});

let iDropIntervalTime = 500;
let iZoneTimer = 6000;

const Tetris = ({ backToMain, dataBase, highScores }) => {

    // Music track instances.
    const [trackInstance1, setTrackInstance1] = useState(null);
    const [trackInstance2, setTrackInstance2] = useState(null);

    // Sets the total elapsed seconds.
    let [totalSeconds, setTotalSeconds] = useState(0);

    // Move grid space [0 = static or up, 1 = right, 2 = down, 3 = left]
    let [iPushIdx, setPushIdx] = useState(0);

    // Game interval time.
    const [GameElapsedTime, setElapsedInterval] = useState(null);

    // Is level completed ?
    const [isLevelComplete, setLevelComplete] = useState(false);

    // Used to set a flash on the score counter when the score is increased.
    const [scoreIndicator, setScoreIndicator] = useState(false);

    // The Tetronimo drop time.
    const [dropTime, setDropTime] = useState(null);

    // Display/hide gameover bar
    const [gameOver, setGameOver] = useState(false);
    const [hasLevelBegun, setLevelStarted] = useState(false);

    // used for boosting the Tetromino downwards.
    const [userBombDrop, setBombDrop] = useState(false);

    // Sets/unsets game pause.
    // const [isPaused, setIsPaused] = useState(false);

    // Game time string.
    const [elapsedGameTime, setGameTime] = useState("00:00");

    // Display/hide the new highscore dialog window.
    const [displayNameBox, setDisplayNameBox] = useState(false);

    // Player name.
    const [playerName, setPlayerName] = useState("");

    // current level speed.
    const [speedLevel, setSpeedLevel] = useState(0);

    // Player name.
    const [getLevelData, setLevelData] = useState({});
    
    // Overlay screens
    const [showGameOverScreen, setGameOverScreen] = useState(false);
    const [showResultsScreen, setResultsScreen] = useState(false);

    // In the zone
    const [iZoneProgress, setZoneProgress] = useState(100);
    const [bZoneActivated, setZoneActive] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, bZoneActivated);
    const [iZoneRows, setZoneRows, iHeight, setHeight] = useZoneProgress(rowsCleared, bZoneActivated);
    const [iZoneInterval, setZoneInterval] = useState(null);


    // Player stats
    const [playerHighScore, setPlayerHighScore] = useState(0);
    const [iScore, setScore, iRows, setRows, iLevel, setLevel, showTetrisBadge, tetrisBadgeText, shakeScreen, setShake] = useGameStatus(rowsCleared, setScoreIndicator, setZoneProgress, bZoneActivated);


    /**
     * Moves the Tetronimo around the playing field.
     * 
     * @param {float} f_Dir - screen position of tetronimo.
     * @private
     */
    const movePlayer = f_Dir => {

        if (!checkCollision(player, stage, { x: f_Dir, y: 0 })) {
            updatePlayerPos({ x: f_Dir, y: 0 });
        }

    };


    /**
     * Changes the fall speed of the tetromino.
     *  
     * @param {integer} keyCode - key being pressed.
     * @public 
     */
    const keyUp = ({ keyCode }) => {

        if (!gameOver) {

            // Activate the interval when user releases the down arrow.
            if (keyCode === 40) {
                setDropTime(iDropIntervalTime / (iLevel + 1));
            }

            // Set to base position.
            setPushIdx(0);

        }

    };


    /**
     * Sets the current level data.
     * @private
     */
    const setCurrentLevel = () => {

        levelData.forEach((oLevelItem, idx) => {

            if (idx === iLevel) {

                setLevelData(oLevelItem);
                setLevel(oLevelItem.levelNum);

                musicPlayer(
                    setTrackInstance1, 
                    setTrackInstance2, 
                    trackInstance1, trackInstance2,
                    oLevelItem.music, 
                    levelData[idx + 1].music ? levelData[idx + 1].music : null
                );              

            }

        });

    };


    /**
     * Starts the game.
     * @private
     */
    const startLevel = () => {

        if (!hasLevelBegun && iLevel < levelData.length) {

            // Reset everything
            setStage(createStage());
            setCurrentLevel();

            // Reset time values
            setTotalSeconds(0);
            setGameTime("00:00");
            setElapsedInterval(1000);
            setDropTime(iDropIntervalTime);

            // Reset player values
            resetPlayer();
            setScore(0);
            setLevel(iLevel);
            setRows(0);

            // Hide gameover bar
            setGameOver(false);
            setLevelStarted(true);
            setLevelComplete(false);
            setPlayerHighScore(iScore + playerHighScore);
            // aMusicUrls = getLevelData.music;
        }

        // Game complete.
        if (iLevel > levelData.length) {

            setDropTime(null);
            setElapsedInterval(null);
            setLevelComplete(true);
            setLevelStarted(false);

        }

    };


    /**
     * Called to move the tetromino down the screen.
     * @private
     */
    const drop = () => {

        // Level is completed...
        if (iRows >= getLevelData.completionLines) {

            stopAudio(trackInstance1, 1000);

            // Display results.
            setResultsScreen(true);

            // Freeze everything on screen.
            setLevelComplete(true);

            // setLevelStarted(false);
            setDropTime(null);
            setElapsedInterval(null);

            // setTimeout(() => {
            //     continueGame();
            // }, 5000);

            // Reset 'in the zone' values.
            setZoneActive(false);
            resetZoneTimer();
            setZoneInterval(null);
            setZoneRows(0);
            setHeight(0);

            console.log(`Level ${getLevelData.levelNum} completed`);

        };

        // Increase level when player has cleared '2' rows
        // if (iRows > (iLevel + 1) * 2) {

        //     // Also increase speed
        //     setDropTime(1000 / (iLevel + 1) + 200);
        //     setSpeedLevel(iLevel)

        // }

        // Update tetromino position
        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {

            // Game over!
            if (player.pos.y < 1) {

                setGameOver(true);

                setGameOverScreen(true);
                setDropTime(null);

                // Check if should save new high score.
                ShouldStoreHighScore();
                setElapsedInterval(null);

            }

            updatePlayerPos({ 
                x: 0, 
                y: 0, 
                collided: true
            });

            fxCollide.play();
            setPushIdx(2);

            setTimeout(() => {                
                setPushIdx(0);
            }, 100);

            // Reset dropTimer internal
            if (userBombDrop) {
                setBombDrop(false);
                setDropTime(1000 / (iLevel + 1) + 200);
            }

        }

    };


    /**
     * Checks if the new score is greater than the current highscore.
     * 
     * @desc updates the high score database entries.
     * @private
     */
    const ShouldStoreHighScore = () => {

        if (highScores.length > 0){
            
            if (playerHighScore > parseInt(highScores[0].score)) {
                setDisplayNameBox(true);
            }

        } else {

            if (playerHighScore > 0)
                setDisplayNameBox(true);
        }

    };


    /**
     * Submits new Highscore to the database.
     * @private
     */
    const SubmitNewHighScore = () => {

        if (playerName !== "" && playerName.length > 2) {

            const firebaseDB = dataBase.firestore();
            firebaseDB.collection("highscores").add({
                name: playerName,
                level: iLevel,
                score: playerHighScore
            });

            // Remove the display name box from screen.
            setDisplayNameBox(false);

        }

    };


    /**
     * Triggered when the player pressed the down arrow.
     * @private
     */
    const dropPlayer = () => {

        // Deactivate interval timer when down arrow is pressed.
        setDropTime(null);
        drop();

    };


    // Tetromino drop interval timer.
    useInterval(() => {
        drop();
    }, dropTime);


    // Game interval timer.
    useInterval(() => {
        GameTimer();
    }, GameElapsedTime);


    /**
     * Rapidly drops the Tetronimino.
     * @public
     */
    const bombDrop = () => {

        setBombDrop(true);

        // Deactivate interval timer when down arrow is pressed.
        setDropTime(25);
        drop();

    };


    /**
     * Player control.
     * 
     * @param {integer} keyCode - event keycode.
     * @private 
     */
    const move = ({ keyCode }) => {

        if (gameOver)
            return;

        // Process only if gameplay is active.
        if (!isLevelComplete) {

            // move left
            if (keyCode === 37) {
                movePlayer(-1);
                setPushIdx(3);

                // move right
            } else if (keyCode === 39) {
                movePlayer(1);
                setPushIdx(1);

                // push down
            } else if (keyCode === 40) {
                dropPlayer();
                setPushIdx(2);

                // push up
            } else if (keyCode === 38) {
                playerRotate(stage, 1);

                // 'B' key
            } else if (keyCode === 66) {
                bombDrop();
            } else if (keyCode === 90) {
                shouldActivateZone();
            }
        }

    };

    /**
     * User requests zone to be activated.
     * @private
     */
    const shouldActivateZone = () => {
        
        if (!bZoneActivated && iZoneProgress === 100) {

            setZoneActive(true);
            setZoneInterval(178);

        }

    };


    /**
     * Counts down the timer for when 'Zone' is active.
     * @private
     */
    const zoneTimer = () => {      

        if (iZoneProgress === 0) {
            
            setZoneActive(false);
            resetZoneTimer();
            setZoneInterval(null);
            setElapsedInterval(1000);
            setZoneRows(0);
            setHeight(0);
            setZoneProgress(0);

        } else {

            setElapsedInterval(null);
            if (iZoneProgress !== 0) {
                setZoneProgress( (prev) => prev -1); // Decrease the zone meter. 
                iZoneTimer --;
            }          

        }

    };


    useInterval(() => {
        zoneTimer();
    }, iZoneInterval);


    const resetZoneTimer = () => {
        iZoneTimer = 6000;
    };

    
    /**
     * Game timer.
     * @private
     */
    const GameTimer = () => {

        const digitPadding = (val) => {

            var valString = val + "";

            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }

        };

        setTotalSeconds(++totalSeconds);

        let seconds = digitPadding(totalSeconds % 60);
        let minutes = digitPadding(parseInt(totalSeconds / 60));

        setGameTime(minutes + ":" + seconds);

    };


    /**
     * Trigger for advancing to the next level.
     * @private
     */
    const continueGame = () => {

        setResultsScreen(false);
        setLevelStarted(false);
        setShake(false);

        // Increase the level counter
        setLevel(prev => prev + 1);
        startLevel();

    };


    /**
     * Trigger for advancing to the next level.
     * @private
     */
    const replayPrevGame = () => {

        setGameOver(false);
        setLevelComplete(false);
        setLevelStarted(false);
        setGameOverScreen(false);
        stopAudio(trackInstance1, 500, 10);

        // Restart previous game.
        startLevel();

    };


    /**
     * Quits the game and returns to title screen.
     * @private
     */
    const quitGame = () => {
        
        stopAudio(trackInstance1, 1000, 50);
        backToMain();

    };

    return (

        <StyledTetrisWrapper
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
        >
        {/* <Spiral /> */}
            {
                isLevelComplete && getLevelData.levelNum === 7 ? (<CompletedText title="COMPLETED GAME" quit={quitGame} />) : null
            }
            {
                hasLevelBegun && getLevelData.music ? (
                    <StyledTetris>
                        {
                            !bZoneActivated && isLevelComplete ? (

                                <CanvasOverlay display={showResultsScreen ? '0.98' : '0'} depth={showResultsScreen ? '5' : '-1'}>
                                    <DialogResults linesCleared={iRows} speedLvl={speedLevel} time={elapsedGameTime} score={numberWithCommas(iScore)} callback={continueGame} />
                                </CanvasOverlay>
                            ) : null
                        }
                        {/* <ScoreBoard scoreList={highScores} /> */}
                        {
                            gameOver ? (

                                <CanvasOverlay display={showGameOverScreen ? '0.98' : '0'} depth={showGameOverScreen ? '5' : '-1'}>
                                    <GameOverDialog title="Game Over" quit={quitGame} retry={replayPrevGame} />
                                </CanvasOverlay>

                            ) : null
                        }
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
                            zoneProgress={iZoneProgress > 100 ? setZoneProgress(100) : iZoneProgress }
                            zoneColor={getLevelData.frame}
                            stageComplete={isLevelComplete}
                            zoneRowCount={iZoneRows}
                            zoneRowHeight={bZoneActivated ? iHeight : 0}>
                            <Stage stage={stage} frameColor={getLevelData.frame} />
                            {
                                displayNameBox ? <NameBox name={playerName} score={playerHighScore} setName={setPlayerName} callback={SubmitNewHighScore} /> : null
                            }
                        </GameArea>
                        {/* <video id="background-video" loop autoPlay>
                                <source src="/assets/video/video01.mp4" type="video/mp4" />
                                <source src="/assets/video/video01.mp4" type="video/ogg" />
                                Your browser does not support the video tag.
                            </video> */}
                    </StyledTetris>
                ) : startLevel()
            }
        </StyledTetrisWrapper>
    );
};

export default Tetris;
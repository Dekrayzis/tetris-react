import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import Tetris from './components/Tetris';
import TitleScreen from './components/TitleScreen';
import ScoreBoard from './components/ScoreBoard';
import { CanvasOverlay } from './components/styles/StyledCanvasScreen';
import { db } from './firebase/config';

const App = () => {

    // Display gameboard
    const [stageHasBegun, setStartGame] = useState(false);
    const [displayScores, setDisplayScores] = useState(false);

    // Array of high scores.
    const iDelay = 10000;

    const timeoutIDRef = useRef(null);


    /**
     * Starts the game.
     * @private
     */
    const startGame = () => {
        setStartGame(true);
    };


    /**
     * Display title screen
     * @private
     */
    const showTitleScreen = () => {
        setStartGame(false);
    };


    /**
     * Start the 'no input' timer.
     * @private
     */
    const goInactive = useCallback(() => {
        setDisplayScores(true);
    }, []);

    const startTimer = useCallback(() => {
        if (!stageHasBegun) {
            // wait 10 seconds before calling goInactive
            timeoutIDRef.current = window.setTimeout(goInactive, iDelay);
        }
    }, [goInactive, iDelay, stageHasBegun]);


    /**
     * Display title screen.
     * @private
     */
    const goActive = () => {

        setDisplayScores(false);
        startTimer();

    };


    /**
     * Reset the 'no input' timer.
     * @private
     */
    const resetTimer = useCallback(() => {
        if (timeoutIDRef.current) {
            window.clearTimeout(timeoutIDRef.current);
        }
        goActive();
    }, [goActive]);


    /**
     * Display the high scores.
     * @private
     */
    /**
     * Setup event handlers.
     * @private
     */
    useEffect(() => {
        if (stageHasBegun) {
            return undefined;
        }

        const rootEl = document.getElementById('root');
        if (!rootEl) {
            return undefined;
        }

        const onMouseMove = () => resetTimer();

        rootEl.addEventListener('mousemove', onMouseMove);
        rootEl.addEventListener('mousedown', resetTimer, false);
        rootEl.addEventListener('keypress', resetTimer, false);
        rootEl.addEventListener('DOMMouseScroll', resetTimer, false);
        rootEl.addEventListener('mousewheel', resetTimer, false);
        rootEl.addEventListener('touchmove', resetTimer, false);
        rootEl.addEventListener('MSPointerMove', resetTimer, false);

        startTimer();

        return () => {
            rootEl.removeEventListener('mousemove', onMouseMove);
            rootEl.removeEventListener('mousedown', resetTimer, false);
            rootEl.removeEventListener('keypress', resetTimer, false);
            rootEl.removeEventListener('DOMMouseScroll', resetTimer, false);
            rootEl.removeEventListener('mousewheel', resetTimer, false);
            rootEl.removeEventListener('touchmove', resetTimer, false);
            rootEl.removeEventListener('MSPointerMove', resetTimer, false);

            if (timeoutIDRef.current) {
                window.clearTimeout(timeoutIDRef.current);
            }
        };
    }, [resetTimer, stageHasBegun, startTimer]);

    const { data: highScores = [] } = useQuery({
        queryKey: ['highscores'],
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, 'highscores'));

            const aHighScores = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            aHighScores.sort((a, b) => (a.score - b.score)).slice(0, 10);
            return aHighScores.reverse();
        },
        staleTime: 60_000,
    });

    return (
        <div className="App">
            {
                stageHasBegun ? (
                    <Tetris backToMain={showTitleScreen} highScores={highScores} />
                ) : <TitleScreen start={startGame} />
            }

            {
                !stageHasBegun && displayScores ? (
                    <CanvasOverlay display={displayScores ? '0.98' : '0'} depth={displayScores ? '5' : '-1'}>
                        <ScoreBoard scoreList={highScores} />
                    </CanvasOverlay>
                ) : null
            }
        </div>
    );

};
export default App;
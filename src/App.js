import React, { useState, useEffect } from 'react';
import Tetris from './components/Tetris';
import TitleScreen from './components/TitleScreen';
import ScoreBoard from './components/ScoreBoard';
import { CanvasOverlay } from './components/styles/StyledCanvasScreen';
import firebase from './firebase/config';

const App = () => {

    // Display gameboard
    const [stageHasBegun, setStartGame] = useState(false);
    const [displayScores, setDisplayScores] = useState(false);

    // Array of high scores.
    const [highScores, setHighScore] = useState([]);
    const iDelay = 10000;

    let timeoutID;


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
    const startTimer = () => {
        
        if (!stageHasBegun) {
            // wait 10 seconds before calling goInactive
            timeoutID = window.setTimeout(goInactive, iDelay);
        }

    };
    
    
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
    const resetTimer = () => {

        window.clearTimeout(timeoutID);    
        goActive();

    };


    /**
     * Display the high scores.
     * @private
     */
    const goInactive = () => {
        setDisplayScores(true); 
    };
    

    /**
     * Setup event handlers.
     * @private
     */
    const setup = () => {

        document.getElementById("root").addEventListener('mousemove', event => {
            resetTimer();
        });
        document.getElementById("root").addEventListener('mousedown', resetTimer, false);
        document.getElementById("root").addEventListener('keypress', resetTimer, false);
        document.getElementById("root").addEventListener('DOMMouseScroll', resetTimer, false);
        document.getElementById("root").addEventListener('mousewheel', resetTimer, false);
        document.getElementById("root").addEventListener('touchmove', resetTimer, false);
        document.getElementById("root").addEventListener('MSPointerMove', resetTimer, false);
    
        startTimer();

    };

    // Initialise listerners.
    setup();

    /**
     * Obtain highscores from database and set as a state property [highScores].
     * @private
     */
    const ObtainHighScore = () => {

        useEffect(() => {

            const fetchData = async () => {

                // Obtain data from the Google firebase database.
                const firebaseDB = firebase.firestore();
                const oData = await firebaseDB.collection("highscores").get();

                let aHighScores = oData.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));

                // Sort by highest score and return only the first 10 highest scored players.
                aHighScores.sort((a, b) => (a.score - b.score)).slice(0, 10);
                setHighScore(aHighScores.reverse());

            };
            fetchData();
        }, []);

    };

    // Grab the current highest scores on component load.
    ObtainHighScore();

    return (
        <div className="App">
            {
                stageHasBegun ? (
                    <Tetris backToMain={showTitleScreen} dataBase={firebase} highScores={highScores} />
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
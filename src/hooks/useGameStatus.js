import { useState, useEffect, useCallback } from 'react';
import UIfx from 'uifx';

import sfxBreak from '../data/sfx/break.wav';

const fxBreak = new UIfx(sfxBreak, {
    volume: 0.4 // value must be between 0.0 ⇔ 1.0
});

export const useGameStatus = (rowsCleared, setScoreIndicator, setZoneProgress) => {

    const [iScore, setScore] = useState(0);
    const [iRows, setRows] = useState(0);
    const [iLevel, setLevel] = useState(0);
    const [shakeScreen, setShake] = useState(false);
    const [showTetrisBadge, setTetrisBadge] = useState(0);
    const [tetrisBadgeText, setTetrisBadgeText] = useState(null);

    // Score points
    const linePoints = [40, 100, 300, 700, 1200, 1500];
    // const speeds = [800, 650, 500, 370, 250, 160];

    const calcScore = useCallback(() => {

        // Only calculated after 1 row has been cleared.
        if (rowsCleared > 0) {

            setScoreIndicator(true);

            // Perfectris badge
        if (rowsCleared >= 18) {

            setTetrisBadgeText("perfectris");
            setTetrisBadge(true);
            setZoneProgress(prev => prev + 18)

            setTimeout(() => {
                setTetrisBadge(false);
            }, 3000);

            // Decahexatris badge
        } else if (rowsCleared >= 16) {

            setTetrisBadgeText("decahexatris");
            setTetrisBadge(true);
            setZoneProgress(prev => prev + 12)

            setTimeout(() => {
                setTetrisBadge(false);
            }, 2000);

            // Ocktris badge
        } else if (rowsCleared === 8) {

            setTetrisBadgeText("ocktris");
            setTetrisBadge(true);
            setZoneProgress(prev => prev + 9)

            setTimeout(() => {
                setTetrisBadge(false);
            }, 2000);

            // Tetris badge
        } else if (rowsCleared === 4) {

            setTetrisBadgeText("tetris");
            setTetrisBadge(true);
            setZoneProgress(prev => prev + 4)

            setTimeout(() => {
                setTetrisBadge(false);
            }, 2000);

            // Back-2-back badge
        } else if (rowsCleared === 2) {

            setTetrisBadgeText("back-2-Back");
            setTetrisBadge(true);
            setZoneProgress(prev => prev + 18)

            setTimeout(() => {
                setTetrisBadge(false);
            }, 2000);

        }

        // This is how original Tetris score is calculated
        setScore(prev => prev + linePoints[rowsCleared - 1] * (iLevel + 1));
        setRows(prev => prev + rowsCleared);
        
        setShake(true);

        fxBreak.play();

        setTimeout(() => {
            setScoreIndicator(false);
            setShake(false);
        }, 1000);

    }

    }, [iLevel, linePoints, rowsCleared, setScoreIndicator, setZoneProgress]);


useEffect(() => { calcScore(); }, [calcScore, rowsCleared, iScore]);

return [iScore, setScore, iRows, setRows, iLevel, setLevel, showTetrisBadge, tetrisBadgeText, shakeScreen, setShake];

};
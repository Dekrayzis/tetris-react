import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import UIfx from 'uifx';

import sfxBreak from '../data/sfx/break.wav';

const LINE_POINTS = [40, 100, 300, 700, 1200, 1500] as const;

const fxBreak = new UIfx(sfxBreak, {
    volume: 0.4
});

export const useGameStatus = (
    rowsCleared: number,
    setScoreIndicator: Dispatch<SetStateAction<boolean>>,
    setZoneProgress: Dispatch<SetStateAction<number>>
) => {

    const [iScore, setScore] = useState(0);
    const [iRows, setRows] = useState(0);
    const [iLevel, setLevel] = useState(0);
    const [shakeScreen, setShake] = useState(false);
    const [showTetrisBadge, setTetrisBadge] = useState(false);
    const [tetrisBadgeText, setTetrisBadgeText] = useState<string | null>(null);

    const badgeTimeoutRef = useRef<number | null>(null);
    const shakeTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (badgeTimeoutRef.current != null) {
                window.clearTimeout(badgeTimeoutRef.current);
                badgeTimeoutRef.current = null;
            }
            if (shakeTimeoutRef.current != null) {
                window.clearTimeout(shakeTimeoutRef.current);
                shakeTimeoutRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (rowsCleared <= 0) return;

        setScoreIndicator(true);

        let badgeText: string | null = null;
        let badgeDurationMs = 0;
        let zoneDelta = 0;

        if (rowsCleared >= 18) {
            badgeText = 'perfectris';
            badgeDurationMs = 3000;
            zoneDelta = 18;
        } else if (rowsCleared >= 16) {
            badgeText = 'decahexatris';
            badgeDurationMs = 2000;
            zoneDelta = 12;
        } else if (rowsCleared === 8) {
            badgeText = 'ocktris';
            badgeDurationMs = 2000;
            zoneDelta = 9;
        } else if (rowsCleared === 4) {
            badgeText = 'tetris';
            badgeDurationMs = 2000;
            zoneDelta = 4;
        } else if (rowsCleared === 2) {
            badgeText = 'back-2-Back';
            badgeDurationMs = 2000;
            zoneDelta = 18;
        }

        if (badgeText) {
            setTetrisBadgeText(badgeText);
            setTetrisBadge(true);
            setZoneProgress(prev => prev + zoneDelta);

            if (badgeTimeoutRef.current != null) {
                window.clearTimeout(badgeTimeoutRef.current);
            }
            badgeTimeoutRef.current = window.setTimeout(() => {
                setTetrisBadge(false);
                badgeTimeoutRef.current = null;
            }, badgeDurationMs);
        }

        setScore(prev => prev + LINE_POINTS[rowsCleared - 1] * (iLevel + 1));
        setRows(prev => prev + rowsCleared);

        setShake(true);
        fxBreak.play();

        if (shakeTimeoutRef.current != null) {
            window.clearTimeout(shakeTimeoutRef.current);
        }
        shakeTimeoutRef.current = window.setTimeout(() => {
            setScoreIndicator(false);
            setShake(false);
            shakeTimeoutRef.current = null;
        }, 1000);
    }, [iLevel, rowsCleared, setScoreIndicator, setZoneProgress]);

    return [
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
    ] as const;

};
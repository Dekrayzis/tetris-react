import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Howler } from 'howler';
import Tetris from './components/Tetris';
import TitleScreen from './components/TitleScreen';
import ScoreBoard from './components/ScoreBoard';
import SoundToggle from './components/SoundToggle';
import { CanvasOverlay } from './components/styles/StyledCanvasScreen';
import { db } from './firebase/config';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';

type HighScore = {
    id: string;
    name?: string;
    level?: number;
    score: number;
};

const App = () => {

    const [muted, setMuted] = useState(() => {
        try {
            return localStorage.getItem('tetris-react:muted') === '1';
        } catch {
            return false;
        }
    });

    // Display gameboard
    const [stageHasBegun, setStartGame] = useState(false);
    const [displayScores, setDisplayScores] = useState(false);

    /**
     * Starts the game.
     * @private
     */
    const startGame = useCallback(() => {
        setStartGame(true);
    }, []);

    /**
     * Display title screen
     * @private
     */
    const showTitleScreen = useCallback(() => {
        setStartGame(false);
    }, []);

    useEffect(() => {
        Howler.mute(muted);
        try {
            localStorage.setItem('tetris-react:muted', muted ? '1' : '0');
        } catch {
            // ignore
        }
    }, [muted]);

    useInactivityTimeout({
        enabled: !stageHasBegun && !displayScores,
        delayMs: 10000,
        elementId: 'root',
        onInactive: () => setDisplayScores(true),
    });

    useInactivityTimeout({
        enabled: !stageHasBegun && displayScores,
        delayMs: 15000,
        elementId: 'root',
        onActivity: () => setDisplayScores(false),
        onInactive: () => setDisplayScores(false),
    });

    const { data: highScores = [] } = useQuery<HighScore[]>({
        queryKey: ['highscores'],
        queryFn: async () => {
            const highscoresQuery = query(
                collection(db, 'highscores'),
                orderBy('score', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(highscoresQuery);

            const seen = new Set<string>();
            const deduped: HighScore[] = [];

            for (const doc of snapshot.docs) {
                const data = doc.data() as any;
                const name = String(data?.name ?? '').trim();
                const level = Number(data?.level ?? 0);
                const score = Number(data?.score ?? 0);
                const key = `${name}::${level}::${score}`;
                if (seen.has(key)) continue;

                seen.add(key);
                deduped.push({
                    id: doc.id,
                    name: data?.name,
                    level: data?.level,
                    score,
                });

                if (deduped.length >= 10) break;
            }

            return deduped;
        },
        staleTime: 60_000,
    });

    const shouldShowScores = !stageHasBegun && displayScores;
    const overlayOpacity = displayScores ? 0.98 : 0;
    const overlayDepth = displayScores ? 5 : -1;

    return (
        <div className="App">
            <SoundToggle muted={muted} onToggle={() => setMuted((prev) => !prev)} />
            {stageHasBegun
                ? <Tetris backToMain={showTitleScreen} highScores={highScores} />
                : <TitleScreen start={startGame} />}
            {shouldShowScores && (
                <CanvasOverlay $opacity={overlayOpacity} $depth={overlayDepth}>
                    <ScoreBoard scoreList={highScores} />
                </CanvasOverlay>
            )}
        </div>
    );

};
export default App;
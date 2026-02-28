import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import Tetris from './components/Tetris';
import TitleScreen from './components/TitleScreen';
import ScoreBoard from './components/ScoreBoard';
import { CanvasOverlay } from './components/styles/StyledCanvasScreen';
import { db } from './firebase/config';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';

type HighScore = {
    id: string;
    name?: string;
    level?: number;
    score?: number;
};

const App = () => {

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
            const snapshot = await getDocs(collection(db, 'highscores'));

            const aHighScores: HighScore[] = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })) as HighScore[];

            return aHighScores
                .slice()
                .sort((a, b) => (Number(b.score || 0) - Number(a.score || 0)))
                .slice(0, 10);
        },
        staleTime: 60_000,
    });

    const shouldShowScores = !stageHasBegun && displayScores;
    const overlayOpacity = displayScores ? 0.98 : 0;
    const overlayDepth = displayScores ? 5 : -1;

    return (
        <div className="App">
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
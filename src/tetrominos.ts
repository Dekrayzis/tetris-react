export type TetrominoKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export type TetrominoCell = 0 | TetrominoKey;
export type TetrominoShape = TetrominoCell[][];

export interface TetrominoDefinition {
    shape: TetrominoShape;
    color: string;
}

export const TETROMINOS = {
    0: { 
        shape: [
            [0]
        ], 
        color: '0, 0, 0' 
    },
    I: {
        shape: [
            [0, 'I', 0, 0], 
            [0, 'I', 0, 0], 
            [0, 'I', 0, 0], 
            [0, 'I', 0, 0]
        ],
        color: '80, 227, 230'
    },
    J: { 
        shape: [
            [0, 'J', 0], 
            [0, 'J', 0], 
            ['J', 'J', 0]
        ], 
        color: '36, 95, 223' 
    },
    L: {
        shape: [
            [0, 'L', 0], 
            [0, 'L', 0], 
            [0, 'L', 'L']
        ],
        color: '223, 173, 36'
    },
    O: { 
        shape: [
            ['O', 'O'], 
            ['O', 'O']
        ], 
        color: '223, 217, 36' 
    },
    S: { 
        shape: [
            [0, 'S', 'S'], 
            ['S', 'S', 0], 
            [0, 0, 0]
        ], 
        color: '48, 211, 56' 
    },
    T: {
        shape: [
            [0, 0, 0], 
            ['T', 'T', 'T'], 
            [0, 'T', 0]
        ],
        color: '132, 61, 198'
    },
    Z: { 
        shape: [
            ['Z', 'Z', 0], 
            [0, 'Z', 'Z'], 
            [0, 0, 0]
        ], 
        color: '227, 78, 78' 
    },
    // A: { 
    //     shape: [
    //         [0, 'A', 'A'], 
    //         ['A', 'A', 0], 
    //         [0, 'A', 0]
    //     ], 
    //     color: '227, 78, 78' 
    // }
} satisfies Record<TetrominoKey | 0, TetrominoDefinition>;

const TETROMINO_KEYS: readonly TetrominoKey[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const;

export const randomTetromino = (): TetrominoDefinition => {
    const randKey = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    return TETROMINOS[randKey];
};
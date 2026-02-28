import { useCallback, useState } from 'react';

import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

type TetrominoCell = 0 | string;
export type TetrominoShape = TetrominoCell[][];

type StageCell = [TetrominoCell, string];
export type Stage = StageCell[][];

export interface Player {
    pos: { x: number; y: number };
    tetromino: TetrominoShape;
    collided: boolean;
}

export interface PlayerMove {
    x: number;
    y: number;
    collided: boolean;
}

export const usePlayer = () => {

    // Set player state
    const [player, setPlayer] = useState<Player>({
        pos: { x: 0, y: 0 },
        tetromino: (TETROMINOS[0].shape as TetrominoShape),
        collided: false,
    });

    const rotate = (matrix: TetrominoShape, dir: number): TetrominoShape => {

        // Make the rows to become columns (transpose)
        const mtrx = matrix.map((_, index) => matrix.map((column) => column[index]));

        // Reverse each row to get a rotated matrix
        if (dir > 0) return mtrx.map((row) => [...row].reverse());

        return [...mtrx].reverse();

    };


    /**
     * Tetromino rotation by player control.
     * 
     * @param {object} stage - playable area.
     * @param {integer} dir - direction user wants to rotate.
     * @public
     */
    const playerRotate = (stage: Stage, dir: number): void => {

        const rotatedTetromino = rotate(player.tetromino, dir);
        const clonedPlayer: Player = {
            ...player,
            tetromino: rotatedTetromino,
        };

        const pos = clonedPlayer.pos.x;
        let offset = 1;

        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {

            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > clonedPlayer.tetromino[0].length) {

                clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                
                return;

            }
        }

        setPlayer(clonedPlayer);

    };


    /**
     * Update rotation.
     * @public
     */
    const updatePlayerPos = ({ x, y, collided }: PlayerMove): void => {

        setPlayer((prev) => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided,
        }));

    };


    /**
     * Reset player location & generate random tetromino.
     * @public
     */
    const resetPlayer = useCallback(() => {

        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: (randomTetromino().shape as TetrominoShape),
            collided: false,
        });
        
    }, []);

    return [player, updatePlayerPos, resetPlayer, playerRotate] as const;

};
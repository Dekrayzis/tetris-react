import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { createStage } from '../gameHelpers';

import type { Player, Stage, TetrominoShape } from './usePlayer';

type StageCell = Stage[number][number];

export const useStage = (
    player: Player,
    resetPlayer: () => void,
    _zoneActivated: boolean
) => {

    const [stage, setStage] = useState<Stage>(createStage() as Stage);
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {

        setRowsCleared(0);

        const sweepRows = (newStage: Stage): { sweptStage: Stage; cleared: number } => {
            let cleared = 0;
            const sweptStage = newStage.reduce<Stage>((ack, row) => {
                if (row.findIndex((cell) => cell[0] === 0) === -1) {
                    cleared += 1;
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear'] as StageCell));
                    return ack;
                }

                ack.push(row);
                return ack;
            }, [] as Stage);

            return { sweptStage, cleared };
        };

        /**
         * Updates the stage.
         * 
         * @param {object} prevStage - Previous stage layout.
         * @public
         */
        const updateStage = (prevStage: Stage): Stage => {

            // First flush the stage
            const newStage = prevStage.map((row) =>
                row.map((cell) => (cell[1] === 'clear' ? ([0, 'clear'] as StageCell) : cell))
            );

            // Draw the tetromino
            (player.tetromino as TetrominoShape).forEach((row, y) => {

                row.forEach((value, x) => {

                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`,
                        ] as StageCell;
                    }

                });

            });

            // check if we got some score if collided
            if (player.collided) {

                resetPlayer();

                const { sweptStage, cleared } = sweepRows(newStage as Stage);
                setRowsCleared(cleared);
                return sweptStage;
                
            }

            return newStage;
            
        };

        // Update stage
        setStage((prev) => updateStage(prev));

    }, [
        player.collided,
        player.pos.x,
        player.pos.y,
        player.tetromino,
        resetPlayer
    ]);

    return [stage, setStage as Dispatch<SetStateAction<Stage>>, rowsCleared] as const;
    
};
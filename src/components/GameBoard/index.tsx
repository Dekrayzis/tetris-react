import React from 'react';
import { css, StyleSheet } from 'aphrodite';

import Grid from '../Grid';
import Tetromino from '../Tetromino';
import { NUM_ROWS, NUM_COLS, TILE_SIZE } from '../../constants/game-board';

const styles = StyleSheet.create({
  gameboard: {
    position: 'relative',
    width: NUM_COLS * TILE_SIZE,
    height: NUM_ROWS * TILE_SIZE,
  },
});

type GameBoardProps = {
  tetrominos?: any[];
};

const GameBoard = ({ tetrominos = [] }: GameBoardProps) => {
  console.log('TETROMINOS', tetrominos);
  return (
    <div className={css(styles.gameboard)}>
      {tetrominos.map(tetromino => (
        <Tetromino key={tetromino.id} {...tetromino} />
      ))}
      <Grid
        withOuterBorder
        numRows={NUM_ROWS}
        numCols={NUM_COLS}
        tileSize={TILE_SIZE}
        lineColor="#EEE"
      />
    </div>

  );
};

export default GameBoard;

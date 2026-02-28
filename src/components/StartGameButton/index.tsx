// eslint-disable-next-line no-unused-vars
import React from 'react';

import Button from '../Button/index';
import styles from './styles';

type StartGameButtonProps = {
  onStart?: () => void;
  children?: React.ReactNode;
};

const StartGameButton = ({ children = 'Start Game', onStart }: StartGameButtonProps) => {
  return (
    <Button mergeStyles={styles.startGameButton} onClick={onStart}>
      {children}
    </Button>
  );
};

export default StartGameButton;

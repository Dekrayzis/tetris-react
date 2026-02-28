// eslint-disable-next-line no-unused-vars
import React from 'react';
import { css } from 'aphrodite';

import styles from './styles';


type ButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  mergeStyles?: unknown;
};

const Button = ({ children, onClick, mergeStyles }: ButtonProps) => {
  return (
    <button className={css(styles.button, mergeStyles)} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

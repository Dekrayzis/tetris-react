import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const border = keyframes`
  0%, 100% {
    background-position: 0 0;
  }

  50% {
    background-position: 300% 0;
  }
`;

const StyledButton = styled.button`
  box-sizing: border-box;
  margin: ${props => props.startBtn ? '4rem 0 0' : '0 0 6px 0'};
  padding: ${props => props.startBtn ? '14px 34px' : '4px'};
  min-height: 30px;
  width: ${props => props.customStyle.width ? `${props.customStyle.width}` : (props.startBtn ? '180px' : '10%') };

  border: ${props => props.startBtn ? '0' : '0'};
  border-radius: 8px;

  color: white;
  background: ${props => props.startBtn ? '#151320' : 'transparent'};
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: ${props => props.startBtn ? '1.1rem' : '1rem'};
  outline: none;
  cursor: pointer;
  position: absolute;
  left: ${props => props.customStyle.left ? `${props.customStyle.left}` : 0 };
  top: ${props => props.customStyle.top ? `${props.customStyle.top}` : 0 };

  ${props => props.startBtn && css`
    z-index: 0;
    border-radius: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 13px;
      z-index: -1;
      pointer-events: none;
      background: linear-gradient(45deg,
        #ffff00, #00ff00, #0099ff, #001aff, #a200ff, #ff0055, #ff0000,
        #ff0055, #ff0000, #ffff00, #00ff00, #0099ff, #001aff, #a200ff
      );
      background-size: 300% 300%;
      animation: ${border} 12s linear infinite;
    }

    &::after {
      inset: 1px;
      border-radius: 11px;
      background: #151320;
      animation: none;
    }
  `}
`;

const Button = ({ callback, isStartBtn, label, customStyle }) => (
    <StyledButton className={ isStartBtn ? "pulsate" : "float-shadow"} startBtn={isStartBtn} onClick={callback} customStyle={customStyle} >{label}</StyledButton>
);

export default Button;
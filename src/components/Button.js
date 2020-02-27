import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  box-sizing: border-box;
  margin: ${props => props.startBtn ? '0 0 20px 0' : '0 0 6px 0'};
  padding: ${props => props.startBtn ? '20px' : '4px'};
  min-height: 30px;
  width: ${props => props.customStyle.width ? `${props.customStyle.width}` : '10%' };

  border: ${props => props.startBtn ? '2px solid transparent' : '0'};
  border-image: ${props => props.startBtn ? 'linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)' : null};
  border-image-slice: ${props => props.startBtn ? '1' : null};  
  border-radius: 8px;

  color: white;
  background: transparent;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  position: absolute;
  left: ${props => props.customStyle.left ? `${props.customStyle.left}` : 0 };
  top: ${props => props.customStyle.top ? `${props.customStyle.top}` : 0 };
`;

const Button = ({ callback, isStartBtn, label, customStyle }) => (
    <StyledButton className={ isStartBtn ? "pulsate" : "float-shadow"} startBtn={isStartBtn} onClick={callback} customStyle={customStyle} >{label}</StyledButton>
);

export default Button;
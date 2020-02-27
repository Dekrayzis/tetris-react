import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

// Grid layout.
export const StyledStage = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${props => props.height},
    calc(25vw / ${props => props.width})
  );
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-gap: 1px;
  border: ${props => props.frame ? `2px solid ${props.frame}` : '2px solid #0453d8' }; // default blue
  border-top: 0;
  width: 100%;
  max-width: 25vw;
  background: transparent;
  margin: auto;
  z-index: 99999999999999;

`;

const setPushDirection = (dir) => {
        
  switch(dir){

      case 0 :
          return '';
          
      case 1:
          return 'pushRight';

      case 2:
          return 'pushDown';

      case 3 :
          return 'pushLeft';
      
      default: 
          return '';

  }

};

/**
 * Game stage.
 * 
 * @param {*} stage - 
 * @public 
 */
const Stage = ({ stage, frameColor, pushDir }) => (
    <StyledStage className={ setPushDirection(pushDir) } width={stage[0].length} height={stage.length} frame={frameColor} >
        { stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />)) }
    </StyledStage>
);

export default Stage;
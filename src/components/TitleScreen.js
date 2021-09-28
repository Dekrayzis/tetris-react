import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledScreen = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;

  img {
    top: 25vh;
    left: 33vw;
    position: absolute;
  }
`;

const TitleScreen = ({start}) => {
    return (
        <StyledScreen>
            <img src="/assets/tetris-logo.jpg" alt="logo" />
            <Button callback={start} isStartBtn label="START" customStyle={{top: '73vh', left: '44.6%'}} />
        </StyledScreen>
    );
};

export default TitleScreen;
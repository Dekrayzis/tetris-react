import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #000000b5;
  background-size: cover;
  overflow: hidden;
  outline: 0;
`;

export const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 1600px;  
`;

export const LeftColumn = styled.div`
  width: 100%;
  max-width: 200px;
  display: block;
  padding: 0 20px;
  position: absolute;
  bottom: 12%;
  left: 25.5%;
`;

export const RightColumn = styled.div`
  width: 100%;
  max-width: 200px;
  display: block;
  padding: 0 20px;
  position: absolute;
  bottom: 16%;
  right: 25.5%;
`;
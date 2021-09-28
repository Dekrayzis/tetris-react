import styled from 'styled-components';

export const SideBox = styled.div`
  box-sizing: border-box;
  display: block;
  text-align:  ${props => (props.align ? 'left' : 'right')};
  padding: 20px;
  padding-bottom: 0;
  ${'' /* border: 2px solid #67bd01; // Green */}
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: ${props => (props.gameOver ? 'red' : '#999')};
  font-family: Pixel, Arial, Helvetica, sans-serif;
  z-index: 999999999999999;

  h2 {
    color: #999;
    font-size: 1.4rem;
    font-family: 'Teko', sans-serif;
    font-weight: 500;
    margin-bottom: 5px;
  }
  span {
    color: white;
    font-size: 1.8rem;
  }

`;
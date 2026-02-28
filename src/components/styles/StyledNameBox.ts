import styled from 'styled-components';

export const StyledDialogWindow = styled.div`
  display: block;
  text-align: center;
  padding: 1rem;
  border-radius: 20px;
  color: #999;
  background: #000;
  position: absolute;
  top: 40%;
  left: calc((78vw / 2) - 75px);
  width: 420px;
  height: 200px;
  z-index: 9999;
  border: 4px double #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;

  input {
    background-color: transparent;
    color: white;
    width: 50%;
    height: 30px;
    outline: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  button {
    background-color: transparent;    
    border: 4px solid #333;
    border-radius: 8px;
    padding: 1rem;
    color: white;
    font-size: 1.2rem;
    margin-top: 1rem;
    cursor: pointer;
  }
`;
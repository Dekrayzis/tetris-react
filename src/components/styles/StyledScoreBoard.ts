import styled from 'styled-components';

// Grid layout.
export const StyledScoreList = styled.div`
  display: block;
  width: 100%;
  max-width: 80%;
  margin: auto;
  z-index: 99999999999999999999999999999999;
  position: fixed;
  top: 20%;
  left: 10%;
  height: 40%;

  .scoreTitleRow {
    display: flex;
    justify-content: space-between;
    color: white;
    margin-bottom: 0.3rem;
    padding: 0.25rem 1.25rem;
    font-weight: 500;
    font-size: 1.5rem;

    span {
      text-align: center;
    }

  }

  .scoreRow {
    display: flex;
    justify-content: space-between;
    color: white;
    margin-bottom: 0.3rem;
    padding: 0.25rem 1.25rem;
    font-weight: 500;
    
    span {
      text-align: center;
    }

  }

`;
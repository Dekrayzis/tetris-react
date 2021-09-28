import styled from 'styled-components';

// Grid layout.
export const StyledResults = styled.div`
  color: white
  display: block;
  width: 30%;
  margin-right: 1rem;
  position: absolute;
  left: 34%;
  top: 33%;
  text-align: center;

  h2 {    
    font-size: 1.6rem;
    margin-bottom: 0;
  }

  .content-box {
    position: relative;
    height: 450px;
    
    .dialogRow {
      display: flex;
      justify-content: space-between;
      width: 100%;

      span {
        display: block;
        margin-bottom: 0.3rem;
        padding: 0.25rem 1.25rem;
        font-size: 1.2rem;
      }
      
      .scoreText {
        color: wheat;
      }

    }
  
  }

`;
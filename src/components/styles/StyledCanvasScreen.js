import styled from 'styled-components';

/* Style the overlay container */
export const CanvasOverlay = styled.div`
    display: block;
    position: absolute;
    background-color: black;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: ${props => props.depth};
    opacity: ${props => props.display};
  -webkit-transition: 0.6s;
  -moz-transition: 0.6s;
  -o-transition: 0.6s;
  transition: 0.6s;
}`;
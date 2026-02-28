import styled from 'styled-components';

/* Style the overlay container */
export const CanvasOverlay = styled.div<{ $depth: number; $opacity: number }>`
    display: block;
    position: absolute;
    background-color: rgba(0, 0, 0, ${props => props.$opacity});
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: ${props => props.$depth};
  -webkit-transition: 0.6s;
  -moz-transition: 0.6s;
  -o-transition: 0.6s;
  transition: 0.6s;
`;
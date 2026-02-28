import styled, { keyframes } from 'styled-components';

const retroFlash = keyframes`
  0%, 6% {
    opacity: 1;
    filter: brightness(1);
  }
  7% {
    opacity: 0.55;
    filter: brightness(0.9);
  }
  8% {
    opacity: 1;
    filter: brightness(1.05);
  }
  18% {
    opacity: 0.85;
    filter: brightness(1.25);
  }
  19% {
    opacity: 1;
    filter: brightness(1);
  }
  55% {
    opacity: 1;
    filter: brightness(1);
  }
  56% {
    opacity: 0.7;
    filter: brightness(0.95);
  }
  58% {
    opacity: 1;
    filter: brightness(1.15);
  }
  100% {
    opacity: 1;
    filter: brightness(1);
  }
`;

type SideBoxProps = {
  align?: boolean;
  gameOver?: boolean;
  $highlight?: boolean;
};

export const SideBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['align', 'gameOver'].includes(prop),
})<SideBoxProps>`
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

  ${props => (props.$highlight ? `
    background: radial-gradient(ellipse at top, rgba(255, 230, 120, 0.08), rgba(10, 10, 14, 0) 60%);
    border: 1px solid rgba(255, 215, 90, 0.25);
    box-shadow: 0 0 22px rgba(255, 215, 90, 0.08);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.045) 0px,
        rgba(255, 255, 255, 0.045) 1px,
        rgba(0, 0, 0, 0) 3px,
        rgba(0, 0, 0, 0) 6px
      );
      opacity: 0.18;
      mix-blend-mode: screen;
    }
  ` : '')}

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

  span.arcade {
    color: #ffe36b;
    text-shadow:
      0 0 6px rgba(255, 227, 107, 0.55),
      0 0 18px rgba(255, 227, 107, 0.22),
      0 2px 0 rgba(0, 0, 0, 0.6);
    letter-spacing: 0.02em;
    animation: ${retroFlash} 1.35s steps(2, end) infinite;
  }

`;
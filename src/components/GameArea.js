import React from 'react';
import styled from 'styled-components';
import { LeftColumn, RightColumn } from './styles/StyledTetris';
import Badge from './Badge';
import Display from './Display';
import { numberWithCommas } from '../util';

import ZoneWrapper from './ZoneProgress';

const StyledGameArea = styled.div`
  width: 100%;
  display: flex;
  z-index: 4;
`;

const MatrixGrid = styled.div`
    margin: 0 auto;
    width: 100%;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
`;

const ZoneRowOverlay = styled.div`  
  width: 30%;
  position: absolute;
  bottom: 2px;
  height: ${props => (props.height ? `${props.height}px` : 0)};
  background-color: #480303e6;
  left: 35%;
`;

// Only re-render the changed cells.
const GameArea = ({ children, shake,
    badgeTxt, speedLvl, rows, levelData, showBadge, elapsedTime, score, stageComplete,
    showScoreIndicator, highScore, shunt, zoneProgress, zoneColor, zoneRowCount, zoneRowHeight }) => {

    let zoomClass = [""];
    let shuntClass = [""];

    // For when the stage is complete.
    if (stageComplete) {
        zoomClass.push('expand-size');
    } else {
        zoomClass = [""];
    }

    // For when the stage is complete.
    if (shake) {
        shuntClass.push('shakeScreenAnim');
    } else {
        shuntClass = [""];
    }

    // When the player presses [left, right, down].
    if (shunt) {

        switch (shunt) {

            case 0:
                shuntClass = ["noShunt"];
                break;

            case 1:
                shuntClass.push('shuntRight');
                break;

            case 2:
                shuntClass.push('shuntDown');
                break;

            case 3:
                shuntClass.push('shuntLeft');
                break;

            default:
                shuntClass = ["noShunt"];
                break;
        }

    }

    return (

        <StyledGameArea className={zoomClass.join(' ')} >

            <LeftColumn>
                {showBadge ? (<Badge text={badgeTxt} />) : null}
                <Display title="Speed lv" text={speedLvl} />
                <Display title="Lines" text={`${rows}/${levelData.completionLines}`} />
                <ZoneWrapper percentage={zoneProgress} color={zoneColor} />
            </LeftColumn>

            <MatrixGrid id="stageArea" className={shuntClass.join(' ')}>
                {children}
                <ZoneRowOverlay height={zoneRowHeight} />
            </MatrixGrid>

            <RightColumn>
                <Display title="Time" text={elapsedTime} align />
                <Display title="Total Score" text={numberWithCommas(score)} align flash={showScoreIndicator} />
                <Display title="High Score" text={numberWithCommas(highScore)} align flash={showScoreIndicator} highlight />
            </RightColumn>

        </StyledGameArea>

    )

};

export default GameArea;
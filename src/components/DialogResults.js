import React from 'react';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

const DialogResults = ({ linesCleared, speedLvl, time, score, callback }) => {

    return (
        <StyledResults>
            <h2>RESULTS</h2>
            <Seperator />
            <div className="content-box">
                <div className="dialogRow">
                    <span>LINES CLEARED</span><span>{ linesCleared }</span>
                </div>
                <div className="dialogRow">
                    <span>SPEED LV</span><span>{ speedLvl }</span>
                </div>
                <div className="dialogRow">
                    <span>TIME</span><span>{ time }</span>
                </div>
                <div className="dialogRow">
                    <span className="scoreText">SCORE</span><span className="scoreText">{ score }</span>
                </div>
                <Button callback={callback} label="Continue" customStyle={{ top: '40%', left: '35%', width: '30%' }} />
            </div>
        </StyledResults>
    );
};

export default DialogResults;
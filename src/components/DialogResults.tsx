import React, { useEffect, useRef } from 'react';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

const DialogResults = ({ linesCleared, speedLvl, time, score, callback }) => {

    const continueBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        let rafId: number | null = null;
        rafId = window.requestAnimationFrame(() => {
            continueBtnRef.current?.focus();
        });

        return () => {
            if (rafId != null) window.cancelAnimationFrame(rafId);
        };
    }, []);

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
                <Button ref={continueBtnRef} callback={callback} label="Continue" customStyle={{ top: '40%', left: '35%', width: '30%' }} />
            </div>
        </StyledResults>
    );
};

export default DialogResults;
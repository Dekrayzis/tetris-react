import React from 'react';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

const GameOverDialog = ({ title, quit, retry }) => {

    return (
        <StyledResults>
            <h2>{title.toUpperCase()}</h2>
            <Seperator />
            <div className="content-box">
                <Button callback={retry} label="Retry?" customStyle={{ top: '0', left: '35%', width: '30%' }} />
                <Button callback={quit} label="Quit" customStyle={{ top: '13%', left: '35%', width: '30%' }} />
            </div>
        </StyledResults>
    );
};

export default GameOverDialog;
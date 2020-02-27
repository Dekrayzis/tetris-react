import React from 'react';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

const CompletedText = ({ title, quit }) => {

    return (
        <StyledResults>
            <h2>{title.toUpperCase()}</h2>
            <Seperator />
            <div className="content-box">
                <Button callback={quit} label="Quit" customStyle={{ top: '-2%', left: '35%', width: '30%' }} />
            </div>
        </StyledResults>
    );
};

export default CompletedText;
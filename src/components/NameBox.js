import React from 'react';
import {StyledDialogWindow} from './styles/StyledNameBox';

const NameBox = ({name, setName, score, callback}) => {
    return (
        <StyledDialogWindow>
            <h2>New high score!</h2>
            <div>
                <h2>{score}</h2>
                <h3>Enter your initials:</h3>
                <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <button onClick={callback} >Submit</button>
        </StyledDialogWindow>
    );
};

export default NameBox;
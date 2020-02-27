import React from 'react';
import { SideBox } from './styles/StyledDisplay';

const Display = ({ text, title, align, flash, highlight }) => {

    return (
        <SideBox align={align}>
            <h2>{title.toUpperCase()}</h2>
            <span className={ flash ? 'blur' : '' } style={{ color: highlight ? 'wheat' : 'white' }}>{text}</span>
        </SideBox>
    );

}

export default Display;
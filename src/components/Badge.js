import React from 'react';
import {StyledBadge} from './styles/StyledBadge';

const Badge = ({text}) => {

    const getColoredText = () => {
        
        switch(text){

            case 'tetris' :
                return '#4666FF';
                
            case 'decahexatris' :
                return '#FFBD5C';

            case 'back-2-back' :
                return '#FFBD5C';

            case 'ocktris' :
                return '#FFBD5C';

            case 'perfectris' :
                return '#FFBD5C';
            
            default: 
                return 'white';
        }

    }
    return (
        <StyledBadge>
            <span style={{ color: getColoredText() }}>{text.toUpperCase() }</span>
        </StyledBadge>
    );
};

export default Badge;
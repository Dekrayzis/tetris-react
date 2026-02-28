import React from 'react';
import styled from 'styled-components';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

type HowToPlayDialogProps = {
    onOk: () => void;
};

const StyledHowToPlayResults = styled(StyledResults)`
    background: rgba(10, 10, 14, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    padding: 1.25rem 1rem 1rem;

    .content-box {
        .dialogFooter {
            margin-top: 1.25rem;
            display: flex;
            justify-content: center;

            button {
                position: relative;
                left: auto;
                top: auto;
                padding: 10px 18px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.28);
                box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
                transition: transform 120ms ease, background-color 120ms ease, border-color 120ms ease;
            }

            button:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.4);
                transform: translateY(-1px);
            }

            button:active {
                transform: translateY(0);
            }
        }
    }
`;

const HowToPlayDialog = ({ onOk }: HowToPlayDialogProps) => {
    return (
        <StyledHowToPlayResults>
            <h2>HOW TO PLAY</h2>
            <Seperator />
            <div className="content-box content-box--compact">
                <div className="dialogRows">
                <div className="dialogRow">
                    <span>MOVE</span><span>LEFT / RIGHT</span>
                </div>
                <div className="dialogRow">
                    <span>ROTATE</span><span>UP ARROW</span>
                </div>
                <div className="dialogRow">
                    <span>SOFT DROP</span><span>DOWN ARROW</span>
                </div>
                <div className="dialogRow">
                    <span>BOMB DROP</span><span>B</span>
                </div>
                <div className="dialogRow">
                    <span>ZONE</span><span>Z</span>
                </div>
                </div>
                <div className="dialogFooter">
                    <Button callback={onOk} label="OK" customStyle={{ width: '30%' }} />
                </div>
            </div>
        </StyledHowToPlayResults>
    );
};

export default HowToPlayDialog;

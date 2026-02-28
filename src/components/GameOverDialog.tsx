import React, { useEffect, useRef } from 'react';
import { StyledResults } from './styles/StyledResults';
import Seperator from './Seperator';
import Button from './Button';

const GameOverDialog = ({ title, quit, retry }) => {

    const retryBtnRef = useRef<HTMLButtonElement | null>(null);
    const quitBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        let rafId: number | null = null;
        rafId = window.requestAnimationFrame(() => {
            retryBtnRef.current?.focus();
        });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                quitBtnRef.current?.focus();
                return;
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                retryBtnRef.current?.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            if (rafId != null) window.cancelAnimationFrame(rafId);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <StyledResults>
            <h2>{title.toUpperCase()}</h2>
            <Seperator />
            <div className="content-box">
                <Button ref={retryBtnRef} callback={retry} label="Retry?" customStyle={{ top: '0', left: '35%', width: '30%' }} />
                <Button ref={quitBtnRef} callback={quit} label="Quit" customStyle={{ top: '13%', left: '35%', width: '30%' }} />
            </div>
        </StyledResults>
    );
};

export default GameOverDialog;
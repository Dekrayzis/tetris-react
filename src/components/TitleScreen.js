import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import Button from './Button';

import themeMusic from '../data/music/themeMusic.mp3';

const StyledScreen = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;

  img {
    top: 25vh;
    left: 33vw;
    position: absolute;
  }
`;

const TitleScreen = ({start}) => {

    const titleMusicRef = useRef(null);

    useEffect(() => {
        const sound = new Howl({
            src: [themeMusic],
            loop: true,
            volume: 0.6,
            html5: true
        });

        titleMusicRef.current = sound;
        sound.play();

        return () => {
            try {
                sound.stop();
                sound.unload();
            } catch (e) {
                // ignore
            }
            titleMusicRef.current = null;
        };
    }, []);

    const handleStart = useCallback(() => {
        try {
            if (titleMusicRef.current) {
                titleMusicRef.current.stop();
                titleMusicRef.current.unload();
                titleMusicRef.current = null;
            }
        } catch (e) {
            // ignore
        }
        start();
    }, [start]);

    return (
        <StyledScreen>
            <img src="/assets/tetris-logo.jpg" alt="logo" />
            <Button callback={handleStart} isStartBtn label="START" customStyle={{top: '73vh', left: '44.6%'}} />
        </StyledScreen>
    );
};

export default TitleScreen;
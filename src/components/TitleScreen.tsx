import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import Button from './Button';
import TitleBackdrop from './TitleBackdrop';

import themeMusic from '../data/music/themeMusic.mp3';

const StyledScreen = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;

  > *:not([data-title-backdrop]) {
    z-index: 2;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 2;
  text-align: center;
  color: rgba(255, 255, 255, 0.56);
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.06em;

  opacity: 0.9;
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.35));
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.35));
`;

const TitleScreen = ({start}) => {

    const currentYear = new Date().getFullYear();

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
            <div data-title-backdrop>
                <TitleBackdrop />
            </div>
            <Content>
                <img className="tetris-logo" src="/assets/tetris-logo.png" alt="logo" />
                <Button
                    callback={handleStart}
                    isStartBtn
                    label="START"
                    customStyle={{ position: 'relative', top: 0, left: 0 }}
                />
            </Content>
            <Footer>
                Created by Dekrayzis 2019 - {currentYear}
            </Footer>
        </StyledScreen>
    );
};

export default TitleScreen;
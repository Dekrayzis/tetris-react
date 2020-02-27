import React from 'react';
import styled from 'styled-components';

const StyledSeperator = styled.div`
    background:radial-gradient(ellipse at 50% -50% , #cccccc 0px, rgba(255, 255, 255, 0) 80%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    background:-webkit-radial-gradient(ellipse at 50% -50% , #cccccc 0px, rgba(255, 255, 255, 0) 80%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    background:-moz-radial-gradient(ellipse at 50% -50% , #cccccc 0px, rgba(255, 255, 255, 0) 80%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    background:-o-radial-gradient(ellipse at 50% -50% , #cccccc 0px, rgba(255, 255, 255, 0) 80%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
    height: 1px;
    overflow: visible;
    border: none;
    clear: both;
    position: relative;
    z-index: 11;

    &::after {
        display: block;
        margin-top: 10px;
        height: 6px;
        width: 100%;
        content: "";
        background: radial-gradient(ellipse at 50% -50%,rgba(0,0,0,.5) 0,rgba(255,255,255,0) 65%);
    }

`;

const Seperator = () => {
    return (
        <StyledSeperator />
    );
};

export default Seperator;
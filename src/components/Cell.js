import React from 'react';
import { TETROMINOS } from '../tetrominos';
import styled from 'styled-components';

const StyledCell = styled.div`
  width: auto;
  /* border-radius: 5px;  uncomment to change style */
  background: rgba(${props => props.color}, transparent);
  border: ${props => (props.type === 0 ? '0px solid' : '4px solid')};
  border-bottom-color: rgba(${props => props.color}, 0.1);
  border-right-color: rgba(${props => props.color}, 1);
  border-top-color: rgba(${props => props.color}, 1);
  border-left-color: rgba(${props => props.color}, 0.3);
`;

// Only re-render the changed cells.
const Cell = ({ type }) => (
    <StyledCell type={type} color={TETROMINOS[type].color} />
);

/* 
    React.memo
    
    Acts like a PureComponent in the fact that it will stop re-renders when the props haven’t changed. 
    Example: React.memo(Component, [areEqual(prevProps, nextProps)]);

    By default, memo only does a shallow comparison of props and prop’s objects. 
    You can pass a second argument to indicate a custom equality check.

    A memoized function will first check to see if the dependencies have changed since the last render. 
    If so, it executes the function and returns the result. If false, it simply returns the cached result 
    from the last execution.

    This is good for expensive operations like transforming API data or doing major calculations that you 
    don't want to be re-doing unnecessarily.
    
*/
export default React.memo(Cell);
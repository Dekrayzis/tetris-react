import React from 'react';
import {StyledScoreList} from './styles/StyledScoreBoard';

const ScoreBoard = ({ scoreList }) => {

    const displayScores = () => {
        
        return scoreList.map((score, idx) => (
            <tr className="scoreRow" key={idx}>
                <td>{idx}</td>
                <td>{score.name}</td>
                <td>{score.level}</td>
                <td>{score.score}</td>
            </tr>
        ))
    }

    return (
        <StyledScoreList>
            <div></div>
            <table id="highScores">
                <thead>
                    <tr className="scoreTitleRow">
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th className="highlightText">Score</th>
                    </tr>  
                </thead>      
                <tbody>
                    { displayScores() }
                </tbody>        
            </table>
        </StyledScoreList>
    );
};

export default ScoreBoard;
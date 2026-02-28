import React from 'react';
import {StyledScoreList} from './styles/StyledScoreBoard';
import './ScoreBoard.scss';

type ScoreEntry = {
    id?: string;
    name?: string;
    level?: number;
    score?: number;
};

type ScoreBoardProps = {
    scoreList?: ScoreEntry[];
};

const ScoreBoard = ({ scoreList = [] }: ScoreBoardProps) => {

    return (
        <StyledScoreList>
            <div />
            <h2 className="scoreboard-title">High Scores</h2>
            <table id="highScores" className="highscores-table">
                <thead>
                    <tr className="scoreTitleRow">
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th className="highlightText">Score</th>
                    </tr>  
                </thead>      
                <tbody>
                    {scoreList.length === 0 ? (
                        <tr className="scoreRow">
                            <td colSpan={4} className="empty-scores">No scores yet</td>
                        </tr>
                    ) : (
                        scoreList.map((score, idx) => (
                            <tr
                                className={`scoreRow scoreRow--animate${idx === 0 ? ' scoreRow--top' : ''}`}
                                key={score.id ?? `${score.name ?? 'unknown'}-${idx}`}
                                style={{ ['--row-delay' as any]: `${idx * 140}ms` }}
                            >
                                <td>{idx + 1}</td>
                                <td>{score.name ?? '-'}</td>
                                <td>{score.level ?? '-'}</td>
                                <td>{score.score ?? '-'}</td>
                            </tr>
                        ))
                    )}
                </tbody>        
            </table>
        </StyledScoreList>
    );
};

export default ScoreBoard;
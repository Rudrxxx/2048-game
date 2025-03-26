import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ScoreContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const ScoreBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  min-width: 150px;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`;

const PlayerIndicator = styled.div`
  font-size: 0.8rem;
  color: ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.5)'};
  margin-top: 0.5rem;
`;

const ScoreBoard = ({ score, player1Score, player2Score, gameMode }) => {
  const isTwoPlayer = gameMode === 'two_player';

  return (
    <ScoreContainer>
      {isTwoPlayer ? (
        <>
          <ScoreBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScoreLabel>Player 1</ScoreLabel>
            <ScoreValue>{player1Score}</ScoreValue>
            <PlayerIndicator active={true}>Current Turn</PlayerIndicator>
          </ScoreBox>
          <ScoreBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ScoreLabel>Player 2</ScoreLabel>
            <ScoreValue>{player2Score}</ScoreValue>
            <PlayerIndicator active={false}>Waiting</PlayerIndicator>
          </ScoreBox>
        </>
      ) : (
        <ScoreBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScoreLabel>Score</ScoreLabel>
          <ScoreValue>{score}</ScoreValue>
        </ScoreBox>
      )}
    </ScoreContainer>
  );
};

export default ScoreBoard; 
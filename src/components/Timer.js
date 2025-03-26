import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TimerContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

const TimerLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
`;

const TimerValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.warning ? '#ff6b6b' : 'white'};
`;

const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 30;

  return (
    <TimerContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TimerLabel>Time Left</TimerLabel>
      <TimerValue warning={isWarning}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </TimerValue>
    </TimerContainer>
  );
};

export default Timer; 
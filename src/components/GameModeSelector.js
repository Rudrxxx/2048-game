import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModeContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ModeButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResetButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #ff6b6b;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`;

const GameModeSelector = ({ currentMode, onModeSelect, onReset }) => {
  const modes = [
    { id: 'classic', label: 'Classic' },
    { id: 'time_attack', label: 'Time Attack' },
    { id: 'two_player', label: '2 Player' },
    { id: 'zen', label: 'Zen Mode' }
  ];

  return (
    <ModeContainer>
      {modes.map(mode => (
        <ModeButton
          key={mode.id}
          active={currentMode === mode.id}
          onClick={() => onModeSelect(mode.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode.label}
        </ModeButton>
      ))}
      <ResetButton
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Reset Game
      </ResetButton>
    </ModeContainer>
  );
};

export default GameModeSelector; 
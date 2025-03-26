import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import GameModeSelector from './components/GameModeSelector';
import ScoreBoard from './components/ScoreBoard';
import Timer from './components/Timer';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(26, 26, 26, 0.9);
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;

  a {
    color: #4ecdc4;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }
`;

const GameModes = {
  CLASSIC: 'classic',
  TIME_ATTACK: 'time_attack',
  TWO_PLAYER: 'two_player',
  ZEN: 'zen'
};

function App() {
  const [gameMode, setGameMode] = useState(GameModes.CLASSIC);
  const [score, setScore] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for time attack mode

  // Reset scores when game mode changes
  useEffect(() => {
    resetGame();
  }, [gameMode]);

  useEffect(() => {
    let timer;
    if (gameMode === GameModes.TIME_ATTACK && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameMode, timeLeft]);

  const handleScoreUpdate = (points, player = 1) => {
    if (gameMode === GameModes.TWO_PLAYER) {
      if (player === 1) {
        setPlayer1Score((prev) => prev + points);
      } else {
        setPlayer2Score((prev) => prev + points);
      }
    } else {
      setScore((prev) => prev + points);
    }
  };

  const resetGame = () => {
    setScore(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setTimeLeft(180);
    setIsGameOver(false);
  };

  return (
    <AppContainer>
      <Title>2048 Game</Title>
      <GameContainer>
        <GameModeSelector
          currentMode={gameMode}
          onModeSelect={setGameMode}
          onReset={resetGame}
        />
        {(gameMode === GameModes.TIME_ATTACK || gameMode === GameModes.TWO_PLAYER) && (
          <Timer timeLeft={timeLeft} />
        )}
        <ScoreBoard
          score={score}
          player1Score={player1Score}
          player2Score={player2Score}
          gameMode={gameMode}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={gameMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GameBoard
              gameMode={gameMode}
              onScoreUpdate={handleScoreUpdate}
              isGameOver={isGameOver}
              onGameOver={() => setIsGameOver(true)}
            />
          </motion.div>
        </AnimatePresence>
      </GameContainer>
      <Footer>
        <FooterContent>
          <span>© 2025 2048 Game</span>
          <span>|</span>
          <span>Created with ❤️ by Rudransh</span>
          <span>|</span>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>|</span>
          <span>How to Play: Use arrow keys or swipe to move tiles</span>
        </FooterContent>
      </Footer>
    </AppContainer>
  );
}

export default App; 
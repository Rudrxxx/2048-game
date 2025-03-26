import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  background: rgba(238, 228, 218, 0.35);
  padding: 10px;
  border-radius: 6px;
  width: 400px;
  height: 400px;
  position: relative;
`;

const Cell = styled(motion.div)`
  background: rgba(238, 228, 218, 0.35);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Tile = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.value >= 1024 ? '1.6rem' : '2rem'};
  font-weight: bold;
  border-radius: 3px;
  background: ${props => getTileBackground(props.value)};
  color: ${props => props.value <= 4 ? '#776e65' : '#f9f6f2'};
`;

const GameOverlay = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(238, 228, 218, 0.73);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const GameOverMessage = styled.h2`
  font-size: 2.5rem;
  color: #776e65;
  margin-bottom: 1rem;
`;

const PlayerTurnIndicator = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  font-size: 1.2rem;
  color: #4ecdc4;
  padding: 0.5rem;
`;

const getTileBackground = (value) => {
  const colors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[value] || '#3c3a32';
};

const GameBoard = ({ gameMode, onScoreUpdate, isGameOver, onGameOver }) => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const isTwoPlayer = gameMode === 'two_player';

  function initializeBoard() {
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    return newBoard;
  }

  function addNewTile(board) {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveTiles = useCallback((direction) => {
    if (isGameOver) return false;

    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let score = 0;

    // Function to move a single tile
    const move = (row, col, rowDir, colDir) => {
      if (newBoard[row][col] === 0) return false;
      
      let currentRow = row;
      let currentCol = col;
      
      while (true) {
        const nextRow = currentRow + rowDir;
        const nextCol = currentCol + colDir;
        
        // Check if next position is out of bounds
        if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) break;
        
        // If next cell is empty, move tile
        if (newBoard[nextRow][nextCol] === 0) {
          newBoard[nextRow][nextCol] = newBoard[currentRow][currentCol];
          newBoard[currentRow][currentCol] = 0;
          currentRow = nextRow;
          currentCol = nextCol;
          moved = true;
        } 
        // If next cell has same value, merge tiles
        else if (newBoard[nextRow][nextCol] === newBoard[currentRow][currentCol]) {
          newBoard[nextRow][nextCol] *= 2;
          newBoard[currentRow][currentCol] = 0;
          score += newBoard[nextRow][nextCol];
          moved = true;
          break;
        } 
        // If next cell has different value, stop moving
        else {
          break;
        }
      }
      
      return moved;
    };

    // Process the board based on direction
    if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) {
          move(row, col, -1, 0);
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) {
          move(row, col, 1, 0);
        }
      }
    } else if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
          move(row, col, 0, -1);
        }
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) {
          move(row, col, 0, 1);
        }
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      onScoreUpdate(score, currentPlayer);
      
      if (isTwoPlayer) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
      
      checkGameOver(newBoard);
      return true;
    }
    
    return false;
  }, [board, isGameOver, onScoreUpdate, currentPlayer, isTwoPlayer]);

  const checkGameOver = (board) => {
    // Check for 2048 tile
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048 && gameMode !== 'zen') {
          onGameOver();
          return;
        }
      }
    }

    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return;
        }
      }
    }

    // No moves left
    onGameOver();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.preventDefault) e.preventDefault();
      
      switch (e.key) {
        case 'ArrowLeft':
          moveTiles('left');
          break;
        case 'ArrowRight':
          moveTiles('right');
          break;
        case 'ArrowUp':
          moveTiles('up');
          break;
        case 'ArrowDown':
          moveTiles('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveTiles]);

  // Reset board when game mode changes
  useEffect(() => {
    setBoard(initializeBoard());
    setCurrentPlayer(1);
  }, [gameMode]);

  // Touch support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (xDiff > 10) {
        moveTiles('left');
      } else if (xDiff < -10) {
        moveTiles('right');
      }
    } else {
      // Vertical swipe
      if (yDiff > 10) {
        moveTiles('up');
      } else if (yDiff < -10) {
        moveTiles('down');
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <Board
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isTwoPlayer && (
        <PlayerTurnIndicator>
          Player {currentPlayer}'s turn
        </PlayerTurnIndicator>
      )}
      
      {/* Create the grid with cells and tiles */}
      {board.map((row, i) => 
        row.map((value, j) => (
          <Cell key={`cell-${i}-${j}`}>
            {value !== 0 && (
              <Tile
                key={`tile-${i}-${j}-${value}`}
                value={value}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {value}
              </Tile>
            )}
          </Cell>
        ))
      )}
      
      {/* Game over overlay */}
      {isGameOver && (
        <GameOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GameOverMessage>
            {board.some(row => row.some(cell => cell === 2048)) 
              ? 'You Win!' 
              : 'Game Over!'}
          </GameOverMessage>
        </GameOverlay>
      )}
    </Board>
  );
};

export default GameBoard; 
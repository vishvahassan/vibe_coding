import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

const GameContainer = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const GameTitle = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const GameArea = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GameCanvas = styled.div`
  width: 300px;
  height: 600px;
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 200px;
`;

const NextPiece = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
`;

const NextPieceTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const NextPieceDisplay = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: #0a0a0a;
  border: 2px solid #4ecdc4;
  border-radius: 5px;
  position: relative;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: linear-gradient(45deg, #ff5252, #26a69a);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4ecdc4;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #cccccc;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem;
  max-width: 600px;
  text-align: center;
`;

const InstructionText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

// Tetromino shapes
const TETROMINOS = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00f5ff'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f0a000'
  }
};

// Board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const Tetris = () => {
  const [board, setBoard] = useState(() => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function createBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
  }

  function getRandomPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      type: randomPiece,
      shape: TETROMINOS[randomPiece].shape,
      color: TETROMINOS[randomPiece].color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[randomPiece].shape[0].length / 2),
      y: 0
    };
  }

  function isValidMove(piece, newX, newY, newShape) {
    for (let y = 0; y < newShape.length; y++) {
      for (let x = 0; x < newShape[y].length; x++) {
        if (newShape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (boardY >= 0 && board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function placePiece(piece) {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    return newBoard;
  }

  function clearLines(board) {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      
      if (linesCleared >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Tetris! +400 points! 🎉');
      } else {
        toast.success(`Cleared ${linesCleared} line(s)! +${linesCleared * 100} points`);
      }
    }
    
    return newBoard;
  }

  function movePiece(direction) {
    if (!currentPiece || gameOver || !isPlaying) return;
    
    let newX = currentPiece.x;
    let newY = currentPiece.y;
    
    switch (direction) {
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
      case 'down':
        newY += 1;
        break;
      default:
        break;
    }
    
    if (isValidMove(currentPiece, newX, newY, currentPiece.shape)) {
      setCurrentPiece({ ...currentPiece, x: newX, y: newY });
    } else if (direction === 'down') {
      // Piece has landed
      const newBoard = placePiece(currentPiece);
      const clearedBoard = clearLines(newBoard);
      setBoard(clearedBoard);
      
      // Check for game over
      if (currentPiece.y <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        toast.error('Game Over!');
        return;
      }
      
      // Spawn new piece
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomPiece());
    }
  }

  function rotatePiece() {
    if (!currentPiece || gameOver || !isPlaying) return;
    
    const rotated = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotated)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  }

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = setInterval(() => {
      movePiece('down');
    }, 1000 / level);
    
    return () => clearInterval(gameLoop);
  }, [currentPiece, isPlaying, level]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          while (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            movePiece('down');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, isPlaying]);

  // Level up every 10 lines
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      toast.success(`Level ${newLevel}! Speed increased!`);
    }
  }, [lines, level]);

  const startGame = () => {
    const newBoard = createBoard();
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsPlaying(true);
    setShowConfetti(false);
    toast.success('Tetris game started! Use arrow keys to move and rotate.');
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsPlaying(false);
    setShowConfetti(false);
    toast.success('Game reset!');
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Draw current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} style={{ display: 'flex' }}>
        {row.map((cell, x) => (
          <div
            key={x}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: cell || '#1a1a1a',
              border: '1px solid #333',
              boxShadow: cell ? '0 0 5px rgba(255, 255, 255, 0.3)' : 'none'
            }}
          />
        ))}
      </div>
    ));
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    return nextPiece.shape.map((row, y) => (
      <div key={y} style={{ display: 'flex' }}>
        {row.map((cell, x) => (
          <div
            key={x}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: cell ? nextPiece.color : 'transparent',
              border: '1px solid #333'
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Tetris</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Classic block stacking puzzle game!
        </p>
      </GameHeader>

      <GameArea>
        <GameCanvas>
          {renderBoard()}
          {gameOver && (
            <GameOverlay>
              <div>Game Over!</div>
              <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
                Final Score: {score}
              </div>
            </GameOverlay>
          )}
        </GameCanvas>

        <SidePanel>
          <Stats>
            <StatItem>
              <StatValue>{score}</StatValue>
              <StatLabel>Score</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{lines}</StatValue>
              <StatLabel>Lines</StatLabel>
            </StatItem>
          </Stats>
          
          <Stats>
            <StatItem>
              <StatValue>{level}</StatValue>
              <StatLabel>Level</StatLabel>
            </StatItem>
          </Stats>

          <NextPiece>
            <NextPieceTitle>Next Piece</NextPieceTitle>
            <NextPieceDisplay>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}>
                {renderNextPiece()}
              </div>
            </NextPieceDisplay>
          </NextPiece>
        </SidePanel>
      </GameArea>

      <Controls>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          disabled={isPlaying}
        >
          Start Game
        </Button>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
        >
          Reset
        </Button>
        <BackButton to="/">
          Back to Games
        </BackButton>
      </Controls>

      <Instructions>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>How to Play</h3>
        <InstructionText>
          • Use arrow keys to move and rotate pieces
        </InstructionText>
        <InstructionText>
          • Complete horizontal lines to clear them
        </InstructionText>
        <InstructionText>
          • Press spacebar to drop pieces instantly
        </InstructionText>
        <InstructionText>
          • Game speeds up as you level up!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default Tetris; 
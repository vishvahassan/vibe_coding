import React, { useState, useEffect } from 'react';
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

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: #4ecdc4;
  padding: 4px;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
  margin-bottom: 2rem;
`;

const Tile = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: ${props => props.isEmpty ? 'transparent' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  cursor: ${props => props.isEmpty ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  border: ${props => props.isEmpty ? '2px dashed rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.5)'};
  
  &:hover {
    transform: ${props => props.isEmpty ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.isEmpty ? 'none' : '0 5px 15px rgba(0, 0, 0, 0.3)'};
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
  }
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
  gap: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4ecdc4;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem;
  max-width: 500px;
  text-align: center;
`;

const InstructionText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PuzzleSlider = () => {
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const BOARD_SIZE = 3;
  const EMPTY_TILE = 0;

  // Generate solved board
  const generateSolvedBoard = () => {
    const solved = [];
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE - 1; i++) {
      solved.push(i + 1);
    }
    solved.push(EMPTY_TILE);
    return solved;
  };

  // Shuffle board
  const shuffleBoard = (board) => {
    const shuffled = [...board];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Check if puzzle is solvable
  const isSolvable = (board) => {
    let inversions = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = i + 1; j < board.length; j++) {
        if (board[i] !== EMPTY_TILE && board[j] !== EMPTY_TILE && board[i] > board[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  // Initialize game
  const initializeGame = () => {
    let newBoard;
    do {
      newBoard = shuffleBoard(generateSolvedBoard());
    } while (!isSolvable(newBoard));
    
    setBoard(newBoard);
    setMoves(0);
    setIsComplete(false);
    setShowConfetti(false);
    setTimer(0);
    setIsPlaying(false);
  };

  // Get empty tile position
  const getEmptyPosition = (board) => {
    return board.indexOf(EMPTY_TILE);
  };

  // Check if tile can move
  const canMove = (tileIndex) => {
    const emptyPos = getEmptyPosition(board);
    const tileRow = Math.floor(tileIndex / BOARD_SIZE);
    const tileCol = tileIndex % BOARD_SIZE;
    const emptyRow = Math.floor(emptyPos / BOARD_SIZE);
    const emptyCol = emptyPos % BOARD_SIZE;
    
    // Check if tile is adjacent to empty space
    return (
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
    );
  };

  // Move tile
  const moveTile = (tileIndex) => {
    if (!canMove(tileIndex) || isComplete) return;
    
    const emptyPos = getEmptyPosition(board);
    const newBoard = [...board];
    
    // Swap tile with empty space
    [newBoard[tileIndex], newBoard[emptyPos]] = [newBoard[emptyPos], newBoard[tileIndex]];
    
    setBoard(newBoard);
    setMoves(prev => prev + 1);
    
    // Check if puzzle is complete
    if (isPuzzleComplete(newBoard)) {
      setIsComplete(true);
      setIsPlaying(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`Puzzle completed in ${moves + 1} moves! 🎉`);
    }
  };

  // Check if puzzle is complete
  const isPuzzleComplete = (currentBoard) => {
    const solved = generateSolvedBoard();
    return currentBoard.every((tile, index) => tile === solved[index]);
  };

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setTimer(0);
    toast.success('Puzzle Slider started! Click tiles to move them.');
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
    toast.success('Game reset!');
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Puzzle Slider</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Slide the tiles to arrange them in order!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{moves}</StatValue>
          <StatLabel>Moves</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{formatTime(timer)}</StatValue>
          <StatLabel>Time</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{isComplete ? 'Complete!' : 'In Progress'}</StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </Stats>

      <GameBoard>
        {board.map((tile, index) => (
          <Tile
            key={index}
            isEmpty={tile === EMPTY_TILE}
            onClick={() => moveTile(index)}
            whileHover={{ scale: tile === EMPTY_TILE ? 1 : 1.05 }}
            whileTap={{ scale: tile === EMPTY_TILE ? 1 : 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {tile === EMPTY_TILE ? '' : tile}
          </Tile>
        ))}
      </GameBoard>

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
          New Game
        </Button>
        <BackButton to="/">
          Back to Games
        </BackButton>
      </Controls>

      <Instructions>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>How to Play</h3>
        <InstructionText>
          • Click on tiles adjacent to the empty space to move them
        </InstructionText>
        <InstructionText>
          • Arrange the numbers from 1 to 8 in order
        </InstructionText>
        <InstructionText>
          • The empty space should be in the bottom-right corner
        </InstructionText>
        <InstructionText>
          • Try to complete the puzzle with the fewest moves!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default PuzzleSlider; 
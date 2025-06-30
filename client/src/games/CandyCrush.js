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

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 15px;
  border: 3px solid #4ecdc4;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
  margin-bottom: 2rem;
`;

const Candy = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
  background: ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
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

const candyTypes = [
  { emoji: '🍬', color: '#ff6b6b' },
  { emoji: '🍭', color: '#4ecdc4' },
  { emoji: '🍫', color: '#45b7d1' },
  { emoji: '🍪', color: '#96ceb4' },
  { emoji: '🍩', color: '#feca57' },
  { emoji: '🍰', color: '#ff9ff3' }
];

const CandyCrush = () => {
  const [board, setBoard] = useState([]);
  const [selectedCandy, setSelectedCandy] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const BOARD_SIZE = 8;

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const randomCandy = candyTypes[Math.floor(Math.random() * candyTypes.length)];
        row.push({
          type: randomCandy.emoji,
          color: randomCandy.color,
          row: i,
          col: j
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  }, []);

  // Check for matches
  const checkMatches = useCallback((board) => {
    const matches = new Set();

    // Check horizontal matches
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE - 2; j++) {
        if (board[i][j].type === board[i][j + 1].type && 
            board[i][j].type === board[i][j + 2].type) {
          matches.add(`${i},${j}`);
          matches.add(`${i},${j + 1}`);
          matches.add(`${i},${j + 2}`);
        }
      }
    }

    // Check vertical matches
    for (let i = 0; i < BOARD_SIZE - 2; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j].type === board[i + 1][j].type && 
            board[i][j].type === board[i + 2][j].type) {
          matches.add(`${i},${j}`);
          matches.add(`${i + 1},${j}`);
          matches.add(`${i + 2},${j}`);
        }
      }
    }

    return Array.from(matches).map(pos => {
      const [row, col] = pos.split(',').map(Number);
      return { row, col };
    });
  }, []);

  // Remove matches and fill board
  const removeMatches = useCallback((matches) => {
    if (matches.length === 0) return false;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      
      // Remove matched candies
      matches.forEach(({ row, col }) => {
        newBoard[row][col] = null;
      });

      // Drop candies down
      for (let col = 0; col < BOARD_SIZE; col++) {
        let writeRow = BOARD_SIZE - 1;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
          if (newBoard[row][col] !== null) {
            if (writeRow !== row) {
              newBoard[writeRow][col] = newBoard[row][col];
              newBoard[writeRow][col].row = writeRow;
              newBoard[row][col] = null;
            }
            writeRow--;
          }
        }
      }

      // Fill empty spaces with new candies
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (newBoard[i][j] === null) {
            const randomCandy = candyTypes[Math.floor(Math.random() * candyTypes.length)];
            newBoard[i][j] = {
              type: randomCandy.emoji,
              color: randomCandy.color,
              row: i,
              col: j
            };
          }
        }
      }

      return newBoard;
    });

    // Update score
    setScore(prev => prev + matches.length * 10);
    setMoves(prev => prev + 1);

    // Show confetti for big matches
    if (matches.length >= 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`Amazing! ${matches.length} candies matched!`);
    } else if (matches.length >= 3) {
      toast.success(`${matches.length} candies matched!`);
    }

    return true;
  }, []);

  // Handle candy selection
  const handleCandyClick = useCallback((row, col) => {
    if (isProcessing) return;

    if (!selectedCandy) {
      setSelectedCandy({ row, col });
    } else {
      const { row: selectedRow, col: selectedCol } = selectedCandy;
      
      // Check if candies are adjacent
      const isAdjacent = (
        (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
        (Math.abs(col - selectedCol) === 1 && row === selectedRow)
      );

      if (isAdjacent) {
        setIsProcessing(true);
        
        // Swap candies
        setBoard(prevBoard => {
          const newBoard = prevBoard.map(row => [...row]);
          const temp = newBoard[row][col];
          newBoard[row][col] = newBoard[selectedRow][selectedCol];
          newBoard[selectedRow][selectedCol] = temp;
          
          // Update positions
          newBoard[row][col].row = row;
          newBoard[row][col].col = col;
          newBoard[selectedRow][selectedCol].row = selectedRow;
          newBoard[selectedRow][selectedCol].col = selectedCol;
          
          return newBoard;
        });

        // Check for matches after swap
        setTimeout(() => {
          setBoard(prevBoard => {
            const matches = checkMatches(prevBoard);
            if (matches.length > 0) {
              removeMatches(matches);
              // Continue checking for cascading matches
              setTimeout(() => {
                setIsProcessing(false);
                setSelectedCandy(null);
              }, 500);
            } else {
              // No matches, revert swap
              setBoard(prevBoard => {
                const newBoard = prevBoard.map(row => [...row]);
                const temp = newBoard[row][col];
                newBoard[row][col] = newBoard[selectedRow][selectedCol];
                newBoard[selectedRow][selectedCol] = temp;
                
                newBoard[row][col].row = row;
                newBoard[row][col].col = col;
                newBoard[selectedRow][selectedCol].row = selectedRow;
                newBoard[selectedRow][selectedCol].col = selectedCol;
                
                return newBoard;
              });
              setIsProcessing(false);
              setSelectedCandy(null);
              toast.error('No matches found!');
            }
            return prevBoard;
          });
        }, 300);
      } else {
        setSelectedCandy({ row, col });
      }
    }
  }, [selectedCandy, isProcessing, checkMatches, removeMatches]);

  // Reset game
  const resetGame = () => {
    setScore(0);
    setMoves(0);
    setSelectedCandy(null);
    setIsProcessing(false);
    initializeBoard();
    toast.success('Game reset!');
  };

  // Initialize game
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Candy Crush</GameTitle>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{moves}</StatValue>
          <StatLabel>Moves</StatLabel>
        </StatItem>
      </Stats>

      <GameBoard>
        {board.map((row, rowIndex) =>
          row.map((candy, colIndex) => (
            <Candy
              key={`${rowIndex}-${colIndex}`}
              color={candy?.color || 'transparent'}
              onClick={() => handleCandyClick(rowIndex, colIndex)}
              style={{
                border: selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                  ? '3px solid #fff'
                  : 'none'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {candy?.type || ''}
            </Candy>
          ))
        )}
      </GameBoard>

      <Controls>
        <Button onClick={resetGame} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Reset Game
        </Button>
        <BackButton to="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Back to Home
        </BackButton>
      </Controls>

      <Instructions>
        <InstructionText>
          <strong>How to Play:</strong>
        </InstructionText>
        <InstructionText>
          • Click on a candy to select it
        </InstructionText>
        <InstructionText>
          • Click on an adjacent candy to swap
        </InstructionText>
        <InstructionText>
          • Match 3 or more candies in a row or column
        </InstructionText>
        <InstructionText>
          • Chain matches for bonus points!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default CandyCrush; 
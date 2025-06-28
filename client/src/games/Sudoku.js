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

const SudokuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  background: #4ecdc4;
  padding: 2px;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
`;

const Cell = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.isSelected ? '#4ecdc4' : props.isFixed ? '#2c3e50' : '#34495e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.isFixed ? '#ecf0f1' : '#ffffff'};
  cursor: ${props => props.isFixed ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  border: ${props => props.isSelected ? '2px solid #ffffff' : '1px solid #2c3e50'};
  
  &:hover {
    background: ${props => props.isFixed ? '#2c3e50' : '#4ecdc4'};
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const NumberButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
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
  max-width: 600px;
  text-align: center;
`;

const InstructionText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

// Generate a simple Sudoku puzzle
const generateSudoku = () => {
  // Initialize grid properly
  const grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = 0;
    }
  }
  
  // Fill diagonal 3x3 boxes first
  for (let i = 0; i < 9; i += 4) {
    fillBox(grid, i, i);
  }
  
  // Solve the rest
  solveSudoku(grid);
  
  // Remove some numbers to create puzzle
  const puzzle = grid.map(row => [...row]);
  const cellsToRemove = 40; // Adjust difficulty
  
  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row] && puzzle[row][col] !== undefined) {
      puzzle[row][col] = 0;
    }
  }
  
  return puzzle;
};

const fillBox = (grid, row, col) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (row + i < 9 && col + j < 9 && grid[row + i] && grid[row + i][col + j] !== undefined) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        grid[row + i][col + j] = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }
    }
  }
};

const isValid = (grid, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const Sudoku = () => {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const initializeGame = () => {
    const puzzle = generateSudoku();
    const solutionGrid = puzzle.map(row => [...row]);
    solveSudoku(solutionGrid);
    
    setGrid(puzzle);
    setSolution(solutionGrid);
    setSelectedCell(null);
    setMoves(0);
    setIsComplete(false);
    setShowConfetti(false);
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = number;
    
    setGrid(newGrid);
    setMoves(prev => prev + 1);
    setSelectedCell(null);
    
    // Check if move is correct
    if (number === solution[row][col]) {
      toast.success('Correct!');
      
      // Check if puzzle is complete
      if (isPuzzleComplete(newGrid)) {
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Congratulations! Sudoku completed! 🎉');
      }
    } else {
      toast.error('Incorrect! Try again.');
    }
  };

  const isPuzzleComplete = (currentGrid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === 0) return false;
      }
    }
    return true;
  };

  const resetGame = () => {
    initializeGame();
    toast.success('Game reset!');
  };

  const getHint = () => {
    if (!selectedCell) {
      toast.error('Select a cell first!');
      return;
    }
    
    const { row, col } = selectedCell;
    const correctNumber = solution[row][col];
    toast.success(`Hint: The correct number for this cell is ${correctNumber}`);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Sudoku</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Fill the grid with numbers 1-9 following Sudoku rules!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{moves}</StatValue>
          <StatLabel>Moves</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{isComplete ? 'Complete!' : 'In Progress'}</StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </Stats>

      <GameArea>
        <SudokuGrid>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isFixed={grid[rowIndex][colIndex] !== 0 && solution[rowIndex][colIndex] === grid[rowIndex][colIndex]}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </Cell>
            ))
          )}
        </SudokuGrid>

        <NumberPad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
            <NumberButton
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(number)}
              disabled={!selectedCell}
            >
              {number}
            </NumberButton>
          ))}
        </NumberPad>
      </GameArea>

      <Controls>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getHint}
        >
          Get Hint
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
          • Click on an empty cell to select it
        </InstructionText>
        <InstructionText>
          • Click a number to fill the selected cell
        </InstructionText>
        <InstructionText>
          • Each row, column, and 3x3 box must contain numbers 1-9
        </InstructionText>
        <InstructionText>
          • No number can appear twice in the same row, column, or box
        </InstructionText>
        <InstructionText>
          • Fill all cells correctly to complete the puzzle!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default Sudoku; 
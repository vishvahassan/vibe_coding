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

const GameCanvas = styled.div`
  width: 400px;
  height: 400px;
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
  margin-bottom: 2rem;
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
  max-width: 500px;
  text-align: center;
`;

const InstructionText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SnakeGame = () => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const GRID_SIZE = 20;
  const GAME_SPEED = 150;

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ];
    setFood(newFood);
  }, []);

  // Check if position is valid (not occupied by snake)
  const isValidPosition = useCallback((pos) => {
    return !snake.some(segment => segment[0] === pos[0] && segment[1] === pos[1]);
  }, [snake]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = [...newSnake[0]];
      
      // Move head
      head[0] += direction[0];
      head[1] += direction[1];
      
      // Check wall collision
      if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }
      
      // Check self collision
      if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }
      
      newSnake.unshift(head);
      
      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            toast.success('New High Score! 🎉');
          } else {
            toast.success('Food collected! +10 points');
          }
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood, highScore]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying]);

  const startGame = () => {
    setSnake([[10, 10]]);
    setDirection([0, 1]);
    setFood([15, 15]);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setShowConfetti(false);
    toast.success('Snake game started! Use arrow keys to move.');
  };

  const resetGame = () => {
    setSnake([[10, 10]]);
    setDirection([0, 1]);
    setFood([15, 15]);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
    setShowConfetti(false);
    toast.success('Game reset!');
  };

  const renderSnake = () => {
    return snake.map((segment, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: `${(segment[0] / GRID_SIZE) * 100}%`,
          top: `${(segment[1] / GRID_SIZE) * 100}%`,
          width: `${100 / GRID_SIZE}%`,
          height: `${100 / GRID_SIZE}%`,
          backgroundColor: index === 0 ? '#4ecdc4' : '#45b7d1',
          borderRadius: '2px',
          boxShadow: '0 0 5px rgba(78, 205, 196, 0.5)'
        }}
      />
    ));
  };

  const renderFood = () => (
    <div
      style={{
        position: 'absolute',
        left: `${(food[0] / GRID_SIZE) * 100}%`,
        top: `${(food[1] / GRID_SIZE) * 100}%`,
        width: `${100 / GRID_SIZE}%`,
        height: `${100 / GRID_SIZE}%`,
        backgroundColor: '#ff6b6b',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(255, 107, 107, 0.7)',
        animation: 'pulse 1s infinite'
      }}
    />
  );

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Snake Game</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Classic snake arcade game - eat food and grow longer!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{highScore}</StatValue>
          <StatLabel>High Score</StatLabel>
        </StatItem>
      </Stats>

      <GameCanvas>
        {renderSnake()}
        {renderFood()}
        {gameOver && (
          <GameOverlay>
            <div>Game Over!</div>
            <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
              Final Score: {score}
            </div>
          </GameOverlay>
        )}
      </GameCanvas>

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
          • Use arrow keys to control the snake
        </InstructionText>
        <InstructionText>
          • Eat the red food to grow and earn points
        </InstructionText>
        <InstructionText>
          • Avoid hitting the walls or yourself
        </InstructionText>
        <InstructionText>
          • Try to beat your high score!
        </InstructionText>
      </Instructions>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </GameContainer>
  );
};

export default SnakeGame; 
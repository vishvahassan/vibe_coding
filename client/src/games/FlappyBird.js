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
  height: 600px;
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
  margin-bottom: 2rem;
`;

const Bird = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background: #FFD700;
  border-radius: 50%;
  left: 50px;
  transition: transform 0.1s ease;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    right: 5px;
    width: 8px;
    height: 8px;
    background: #000;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    right: 2px;
    width: 12px;
    height: 6px;
    background: #FF6347;
    border-radius: 50%;
  }
`;

const Pipe = styled.div`
  position: absolute;
  width: 60px;
  background: #228B22;
  border: 2px solid #006400;
  border-radius: 5px;
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
  flex-wrap: wrap;
  justify-content: center;
`;

const Stat = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  min-width: 120px;
`;

const StatValue = styled.div`
  color: #4ecdc4;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 20;
`;

const Instructions = styled.div`
  color: #cccccc;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  max-width: 600px;
`;

const FlappyBird = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [birdY, setBirdY] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameLoop, setGameLoop] = useState(null);

  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const PIPE_SPEED = 2;

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setBirdY(300);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setShowConfetti(false);
    
    // Start game loop
    const loop = setInterval(() => {
      updateGame();
    }, 16); // ~60 FPS
    setGameLoop(loop);
  };

  const resetGame = () => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setGameState('waiting');
    setBirdY(300);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setShowConfetti(false);
  };

  const updateGame = () => {
    if (gameState !== 'playing') return;

    // Update bird position
    const newBirdY = birdY + birdVelocity;
    const newBirdVelocity = birdVelocity + GRAVITY;
    
    setBirdY(newBirdY);
    setBirdVelocity(newBirdVelocity);

    // Check if bird hits ground or ceiling
    if (newBirdY <= 0 || newBirdY >= 570) {
      gameOver();
      return;
    }

    // Update pipes
    const updatedPipes = pipes.map(pipe => ({
      ...pipe,
      x: pipe.x - PIPE_SPEED
    })).filter(pipe => pipe.x > -PIPE_WIDTH);

    // Add new pipes
    if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < 300) {
      const gapY = Math.random() * 300 + 100;
      updatedPipes.push({
        x: 400,
        gapY: gapY,
        passed: false
      });
    }

    // Check collisions
    updatedPipes.forEach(pipe => {
      if (!pipe.passed && pipe.x < 80 && pipe.x > 20) {
        if (newBirdY < pipe.gapY || newBirdY > pipe.gapY + PIPE_GAP) {
          gameOver();
          return;
        }
      }
      
      // Check if bird passed pipe
      if (!pipe.passed && pipe.x < 50) {
        pipe.passed = true;
        const newScore = score + 1;
        setScore(newScore);
        
        if (newScore > highScore) {
          setHighScore(newScore);
          if (newScore % 10 === 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            toast.success(`Amazing! ${newScore} points! 🎉`);
          }
        }
      }
    });

    setPipes(updatedPipes);
  };

  const gameOver = () => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setGameState('gameOver');
    toast.error('Game Over! Try again! 💔');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'waiting') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        } else if (gameState === 'gameOver') {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, jump]);

  useEffect(() => {
    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [gameLoop]);

  const renderPipes = () => {
    return pipes.map((pipe, index) => (
      <React.Fragment key={index}>
        <Pipe
          style={{
            height: pipe.gapY,
            left: pipe.x,
            top: 0
          }}
        />
        <Pipe
          style={{
            height: 600 - pipe.gapY - PIPE_GAP,
            left: pipe.x,
            top: pipe.gapY + PIPE_GAP
          }}
        />
      </React.Fragment>
    ));
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>Flappy Bird</GameTitle>
        <Instructions>
          Press SPACE to jump! Navigate through pipes and try to get the highest score!
        </Instructions>
      </GameHeader>

      <Stats>
        <Stat>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{highScore}</StatValue>
          <StatLabel>High Score</StatLabel>
        </Stat>
      </Stats>

      <GameCanvas>
        <Bird 
          style={{ 
            top: birdY,
            transform: `rotate(${birdVelocity * 2}deg)`
          }} 
        />
        {renderPipes()}
        
        {gameState === 'waiting' && (
          <GameOverlay>
            Press SPACE to Start!
          </GameOverlay>
        )}
        
        {gameState === 'gameOver' && (
          <GameOverlay>
            Game Over!
            <br />
            <small>Press SPACE to restart</small>
          </GameOverlay>
        )}
      </GameCanvas>

      <Controls>
        {gameState === 'waiting' && (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
          >
            Start Game
          </Button>
        )}
        
        {gameState === 'playing' && (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={jump}
          >
            Jump (SPACE)
          </Button>
        )}
        
        {gameState === 'gameOver' && (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
          >
            Play Again
          </Button>
        )}
        
        <BackButton to="/">
          Back to Home
        </BackButton>
      </Controls>

      {showConfetti && <Confetti />}
    </GameContainer>
  );
};

export default FlappyBird; 
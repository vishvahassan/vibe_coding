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
  width: 600px;
  height: 400px;
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  background: #000;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
  margin-bottom: 2rem;
`;

const Paddle = styled.div`
  position: absolute;
  width: 15px;
  height: 80px;
  background: #4ecdc4;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
`;

const Ball = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #ff6b6b;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
`;

const CenterLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  font-size: 2rem;
  font-weight: bold;
  color: #4ecdc4;
  font-family: 'Orbitron', monospace;
`;

const Player1Score = styled(Score)`
  left: 50px;
`;

const Player2Score = styled(Score)`
  right: 50px;
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

const Pong = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [player1Y, setPlayer1Y] = useState(160);
  const [player2Y, setPlayer2Y] = useState(160);
  const [ballX, setBallX] = useState(300);
  const [ballY, setBallY] = useState(200);
  const [ballSpeedX, setBallSpeedX] = useState(3);
  const [ballSpeedY, setBallSpeedY] = useState(2);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameLoop, setGameLoop] = useState(null);
  const [winner, setWinner] = useState(null);

  const PADDLE_SPEED = 5;
  const PADDLE_HEIGHT = 80;
  const CANVAS_HEIGHT = 400;
  const CANVAS_WIDTH = 600;

  const startGame = () => {
    setGameState('playing');
    setBallX(300);
    setBallY(200);
    setBallSpeedX(Math.random() > 0.5 ? 3 : -3);
    setBallSpeedY(Math.random() > 0.5 ? 2 : -2);
    setPlayer1Y(160);
    setPlayer2Y(160);
    setWinner(null);
    setShowConfetti(false);
    
    const loop = setInterval(() => {
      updateGame();
    }, 16);
    setGameLoop(loop);
  };

  const resetGame = () => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setGameState('waiting');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setShowConfetti(false);
  };

  const updateGame = () => {
    if (gameState !== 'playing') return;

    // Update ball position
    const newBallX = ballX + ballSpeedX;
    const newBallY = ballY + ballSpeedY;

    // Ball collision with top and bottom
    if (newBallY <= 0 || newBallY >= CANVAS_HEIGHT - 12) {
      setBallSpeedY(-ballSpeedY);
    }

    // Ball collision with paddles
    if (newBallX <= 30 && newBallX >= 15 && 
        newBallY >= player1Y && newBallY <= player1Y + PADDLE_HEIGHT) {
      setBallSpeedX(-ballSpeedX);
      // Add some randomness to make it more interesting
      setBallSpeedY(ballSpeedY + (Math.random() - 0.5) * 2);
    }

    if (newBallX >= CANVAS_WIDTH - 45 && newBallX <= CANVAS_WIDTH - 30 && 
        newBallY >= player2Y && newBallY <= player2Y + PADDLE_HEIGHT) {
      setBallSpeedX(-ballSpeedX);
      setBallSpeedY(ballSpeedY + (Math.random() - 0.5) * 2);
    }

    // Ball out of bounds
    if (newBallX <= 0) {
      const newScore = player2Score + 1;
      setPlayer2Score(newScore);
      if (newScore >= 11) {
        endGame('Player 2');
      } else {
        resetBall();
      }
    } else if (newBallX >= CANVAS_WIDTH) {
      const newScore = player1Score + 1;
      setPlayer1Score(newScore);
      if (newScore >= 11) {
        endGame('Player 1');
      } else {
        resetBall();
      }
    }

    setBallX(newBallX);
    setBallY(newBallY);
  };

  const resetBall = () => {
    setBallX(300);
    setBallY(200);
    setBallSpeedX(Math.random() > 0.5 ? 3 : -3);
    setBallSpeedY(Math.random() > 0.5 ? 2 : -2);
  };

  const endGame = (winnerName) => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setGameState('gameOver');
    setWinner(winnerName);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    toast.success(`${winnerName} wins! 🎉`);
  };

  const movePaddle = (player, direction) => {
    if (gameState !== 'playing') return;

    if (player === 1) {
      const newY = player1Y + (direction === 'up' ? -PADDLE_SPEED : PADDLE_SPEED);
      if (newY >= 0 && newY <= CANVAS_HEIGHT - PADDLE_HEIGHT) {
        setPlayer1Y(newY);
      }
    } else {
      const newY = player2Y + (direction === 'up' ? -PADDLE_SPEED : PADDLE_SPEED);
      if (newY >= 0 && newY <= CANVAS_HEIGHT - PADDLE_HEIGHT) {
        setPlayer2Y(newY);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.code) {
        case 'KeyW':
          movePaddle(1, 'up');
          break;
        case 'KeyS':
          movePaddle(1, 'down');
          break;
        case 'ArrowUp':
          movePaddle(2, 'up');
          break;
        case 'ArrowDown':
          movePaddle(2, 'down');
          break;
        case 'Space':
          e.preventDefault();
          if (gameState === 'waiting') {
            startGame();
          } else if (gameState === 'gameOver') {
            resetGame();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, player1Y, player2Y]);

  useEffect(() => {
    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [gameLoop]);

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>Pong</GameTitle>
        <Instructions>
          Player 1: W/S keys | Player 2: Arrow Up/Down | Press SPACE to start/restart
        </Instructions>
      </GameHeader>

      <Stats>
        <Stat>
          <StatValue>{player1Score}</StatValue>
          <StatLabel>Player 1</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{player2Score}</StatValue>
          <StatLabel>Player 2</StatLabel>
        </Stat>
      </Stats>

      <GameCanvas>
        <CenterLine />
        <Player1Score>{player1Score}</Player1Score>
        <Player2Score>{player2Score}</Player2Score>
        
        <Paddle style={{ left: 15, top: player1Y }} />
        <Paddle style={{ right: 15, top: player2Y }} />
        
        <Ball style={{ left: ballX, top: ballY }} />
        
        {gameState === 'waiting' && (
          <GameOverlay>
            Press SPACE to Start!
            <br />
            <small style={{ fontSize: '1rem' }}>
              First to 11 points wins!
            </small>
          </GameOverlay>
        )}
        
        {gameState === 'gameOver' && (
          <GameOverlay>
            {winner} Wins!
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
          <>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => movePaddle(1, 'up')}
            >
              Player 1 Up (W)
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => movePaddle(1, 'down')}
            >
              Player 1 Down (S)
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => movePaddle(2, 'up')}
            >
              Player 2 Up (↑)
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => movePaddle(2, 'down')}
            >
              Player 2 Down (↓)
            </Button>
          </>
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

export default Pong; 
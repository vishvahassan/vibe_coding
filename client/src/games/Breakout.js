import React, { useState, useEffect, useRef } from 'react';
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

const GameCanvas = styled.canvas`
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  background: #0a0a0a;
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

const Breakout = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [level, setLevel] = useState(1);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 20;
  const BALL_RADIUS = 10;
  const BRICK_ROWS = 5;
  const BRICK_COLS = 10;
  const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLS;
  const BRICK_HEIGHT = 30;

  let animationId;
  let paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
  let ballX = CANVAS_WIDTH / 2;
  let ballY = CANVAS_HEIGHT - 50;
  let ballDX = 4;
  let ballDY = -4;
  let bricks = [];

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  const initializeGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize bricks
    bricks = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * BRICK_WIDTH,
          y: row * BRICK_HEIGHT + 50,
          width: BRICK_WIDTH - 2,
          height: BRICK_HEIGHT - 2,
          color: colors[row % colors.length],
          visible: true
        });
      }
    }
    
    // Reset ball and paddle
    paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT - 50;
    ballDX = 4;
    ballDY = -4;
    
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(false);
    setShowConfetti(false);
    setLevel(1);
  };

  const drawBricks = (ctx) => {
    bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });
  };

  const drawPaddle = (ctx) => {
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
  };

  const drawBall = (ctx) => {
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawScore = (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, 10, 60);
    ctx.fillText(`Level: ${level}`, 10, 90);
  };

  const collisionDetection = () => {
    bricks.forEach(brick => {
      if (brick.visible) {
        if (ballX > brick.x && ballX < brick.x + brick.width &&
            ballY > brick.y && ballY < brick.y + brick.height) {
          ballDY = -ballDY;
          brick.visible = false;
          setScore(prev => prev + 10);
          
          // Check if all bricks are destroyed
          if (bricks.every(b => !b.visible)) {
            setLevel(prev => prev + 1);
            toast.success(`Level ${level + 1} completed!`);
            initializeLevel();
          }
        }
      }
    });
  };

  const initializeLevel = () => {
    // Reset bricks for new level
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const index = row * BRICK_COLS + col;
        bricks[index].visible = true;
        bricks[index].color = colors[row % colors.length];
      }
    }
    
    // Reset ball position
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT - 50;
    ballDX = 4 + level * 0.5;
    ballDY = -4 - level * 0.5;
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw game elements
    drawBricks(ctx);
    drawPaddle(ctx);
    drawBall(ctx);
    drawScore(ctx);
    
    if (isPlaying) {
      // Move ball
      ballX += ballDX;
      ballY += ballDY;
      
      // Ball collision with walls
      if (ballX + BALL_RADIUS > CANVAS_WIDTH || ballX - BALL_RADIUS < 0) {
        ballDX = -ballDX;
      }
      if (ballY - BALL_RADIUS < 0) {
        ballDY = -ballDY;
      }
      
      // Ball collision with paddle
      if (ballY + BALL_RADIUS > CANVAS_HEIGHT - PADDLE_HEIGHT - 10 &&
          ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
        ballDY = -ballDY;
        // Adjust ball direction based on where it hits the paddle
        const hitPos = (ballX - paddleX) / PADDLE_WIDTH;
        ballDX = (hitPos - 0.5) * 8;
      }
      
      // Ball falls below paddle
      if (ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            toast.error('Game Over!');
            return 0;
          } else {
            // Reset ball position
            ballX = CANVAS_WIDTH / 2;
            ballY = CANVAS_HEIGHT - 50;
            ballDX = 4;
            ballDY = -4;
            toast.info(`Lives remaining: ${newLives}`);
            return newLives;
          }
        });
      }
      
      collisionDetection();
    }
    
    animationId = requestAnimationFrame(gameLoop);
  };

  const handleMouseMove = (e) => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    paddleX = mouseX - PADDLE_WIDTH / 2;
    
    // Keep paddle within canvas bounds
    if (paddleX < 0) paddleX = 0;
    if (paddleX + PADDLE_WIDTH > CANVAS_WIDTH) {
      paddleX = CANVAS_WIDTH - PADDLE_WIDTH;
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    toast.success('Breakout game started! Move your mouse to control the paddle.');
  };

  const resetGame = () => {
    initializeGame();
    toast.success('Game reset!');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', handleMouseMove);
    
    initializeGame();
    gameLoop();
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      toast.success(`Great job! Score: ${score}`);
    }
  }, [score]);

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Breakout</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Classic ball and paddle arcade game!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{lives}</StatValue>
          <StatLabel>Lives</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{level}</StatValue>
          <StatLabel>Level</StatLabel>
        </StatItem>
      </Stats>

      <GameCanvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />

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
          Reset Game
        </Button>
        <BackButton to="/">
          Back to Games
        </BackButton>
      </Controls>

      <Instructions>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>How to Play</h3>
        <InstructionText>
          • Move your mouse to control the paddle
        </InstructionText>
        <InstructionText>
          • Break all the bricks to complete each level
        </InstructionText>
        <InstructionText>
          • Don't let the ball fall below the paddle
        </InstructionText>
        <InstructionText>
          • Each level gets faster and more challenging!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default Breakout; 
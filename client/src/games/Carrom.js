import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CarromContainer = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameTitle = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  animation: gradientShift 3s ease infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const RealBoardSVG = styled.svg`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const BrandText = styled.div`
  position: absolute;
  color: #222;
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 2px;
  user-select: none;
  z-index: 3;
`;

const MadeInIndia = styled.div`
  position: absolute;
  color: #b33;
  font-family: 'monospace';
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 1px;
  user-select: none;
  z-index: 3;
`;

const GameBoard = styled.div`
  width: 600px;
  height: 600px;
  background: #f7e3c3; /* flat wood color */
  border: 24px solid #181818; /* thick black border */
  border-radius: 18px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Striker = styled(motion.div)`
  width: 45px;
  height: 45px;
  background: radial-gradient(circle, #ffffff 30%, #e0e0e0 70%);
  border: 3px solid #333;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const Coin = styled(motion.div)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 5;
`;

const BlackCoin = styled(Coin)`
  background: radial-gradient(circle, #333 30%, #000 70%);
  border: 2px solid #000;
`;

const WhiteCoin = styled(Coin)`
  background: radial-gradient(circle, #ffffff 30%, #e0e0e0 70%);
  border: 2px solid #ccc;
`;

const RedCoin = styled(Coin)`
  background: radial-gradient(circle, #ff4444 30%, #cc0000 70%);
  border: 2px solid #cc0000;
`;

const CornerPocket = styled.div`
  width: 70px;
  height: 70px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
`;

const CenterCircle = styled.div`
  width: 140px;
  height: 140px;
  border: 4px solid #654321;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
`;

const StrikerBase = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid #654321;
  border-radius: 50%;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
`;

const AimingLine = styled.div`
  position: absolute;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  transform-origin: left center;
  pointer-events: none;
  z-index: 8;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
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
  
  &:hover {
    background: linear-gradient(45deg, #ff5252, #26a69a);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ScoreBoard = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ScoreCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem 2rem;
  text-align: center;
  min-width: 120px;
`;

const ScoreLabel = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  color: #4ecdc4;
  font-size: 1.5rem;
  font-weight: bold;
`;

const PowerMeter = styled.div`
  width: 200px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const PowerFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #ff6b6b);
  border-radius: 10px;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TurnIndicator = styled.div`
  background: ${props => props.isPlayer1 ? 'linear-gradient(45deg, #ff6b6b, #ff5252)' : 'linear-gradient(45deg, #4ecdc4, #26a69a)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Carrom = () => {
  const [gameState, setGameState] = useState('aiming'); // aiming, shooting, gameOver
  const [strikerPos, setStrikerPos] = useState({ x: 300, y: 520 });
  const [coins, setCoins] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [isPowerCharging, setIsPowerCharging] = useState(false);
  const [fouls, setFouls] = useState({ player1: 0, player2: 0 });
  const [consecutivePockets, setConsecutivePockets] = useState(0);
  const [lastPocketedType, setLastPocketedType] = useState(null);
  const [gamePhase, setGamePhase] = useState('black'); // black, white, red
  const [isAITurn, setIsAITurn] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'human'
  const boardRef = useRef(null);
  const powerIntervalRef = useRef(null);
  const animationRef = useRef(null);
  const aiTimeoutRef = useRef(null);

  // Initialize coins in traditional carrom formation
  useEffect(() => {
    initializeCoins();
  }, []);

  // AI turn handler
  useEffect(() => {
    if (isAITurn && gameState === 'aiming' && gameMode === 'ai') {
      handleAITurn();
    }
  }, [isAITurn, gameState, gameMode]);

  // Update game phase based on remaining coins
  useEffect(() => {
    const remainingCoins = coins.filter(coin => !coin.pocketed);
    const blackCoins = remainingCoins.filter(coin => coin.type === 'black').length;
    const whiteCoins = remainingCoins.filter(coin => coin.type === 'white').length;
    const redCoins = remainingCoins.filter(coin => coin.type === 'red').length;

    if (blackCoins === 0 && whiteCoins === 0 && redCoins > 0) {
      setGamePhase('red');
    } else if (blackCoins === 0 && whiteCoins > 0) {
      setGamePhase('white');
    } else {
      setGamePhase('black');
    }
  }, [coins]);

  const initializeCoins = () => {
    const initialCoins = [];
    const centerX = 300;
    const centerY = 300;
    
    // Red coin in center
    initialCoins.push({ 
      id: 'red', 
      x: centerX, 
      y: centerY, 
      type: 'red', 
      pocketed: false,
      velocity: { x: 0, y: 0 }
    });
    
    // Black coins in diamond formation around red
    const blackPositions = [
      { x: centerX - 35, y: centerY - 35 },
      { x: centerX + 35, y: centerY - 35 },
      { x: centerX - 35, y: centerY + 35 },
      { x: centerX + 35, y: centerY + 35 },
      { x: centerX, y: centerY - 35 },
      { x: centerX, y: centerY + 35 },
      { x: centerX - 35, y: centerY },
      { x: centerX + 35, y: centerY }
    ];
    
    blackPositions.forEach((pos, index) => {
      initialCoins.push({
        id: `black-${index}`,
        x: pos.x,
        y: pos.y,
        type: 'black',
        pocketed: false,
        velocity: { x: 0, y: 0 }
      });
    });
    
    // White coins in outer formation
    const whitePositions = [
      { x: centerX - 70, y: centerY - 70 },
      { x: centerX + 70, y: centerY - 70 },
      { x: centerX - 70, y: centerY + 70 },
      { x: centerX + 70, y: centerY + 70 },
      { x: centerX - 70, y: centerY },
      { x: centerX + 70, y: centerY },
      { x: centerX, y: centerY - 70 },
      { x: centerX, y: centerY + 70 }
    ];
    
    whitePositions.forEach((pos, index) => {
      initialCoins.push({
        id: `white-${index}`,
        x: pos.x,
        y: pos.y,
        type: 'white',
        pocketed: false,
        velocity: { x: 0, y: 0 }
      });
    });
    
    setCoins(initialCoins);
  };

  // AI Logic Functions
  const calculateDistance = (pos1, pos2) => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  };

  const findBestTarget = () => {
    const remainingCoins = coins.filter(coin => !coin.pocketed);
    const validCoins = remainingCoins.filter(coin => {
      if (gamePhase === 'black') return coin.type === 'black';
      if (gamePhase === 'white') return coin.type === 'white';
      if (gamePhase === 'red') return coin.type === 'red';
      return false;
    });

    if (validCoins.length === 0) {
      // No valid coins, try any coin (will result in foul)
      return remainingCoins[0];
    }

    // Find the coin closest to a pocket
    let bestCoin = validCoins[0];
    let bestScore = -1;

    validCoins.forEach(coin => {
      const pockets = [
        { x: 0, y: 0 },
        { x: 600, y: 0 },
        { x: 0, y: 600 },
        { x: 600, y: 600 }
      ];

      let minDistanceToPocket = Infinity;
      pockets.forEach(pocket => {
        const distance = calculateDistance(coin, pocket);
        if (distance < minDistanceToPocket) {
          minDistanceToPocket = distance;
        }
      });

      // Score based on distance to pocket and distance from striker
      const distanceFromStriker = calculateDistance(strikerPos, coin);
      const score = (1000 / minDistanceToPocket) - (distanceFromStriker * 0.1);

      if (score > bestScore) {
        bestScore = score;
        bestCoin = coin;
      }
    });

    return bestCoin;
  };

  const calculateAIShot = (targetCoin) => {
    const strikerX = strikerPos.x;
    const strikerY = strikerPos.y;
    const targetX = targetCoin.x;
    const targetY = targetCoin.y;

    // Calculate direct angle to target
    const deltaX = targetX - strikerX;
    const deltaY = targetY - strikerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Add some randomness for more realistic AI
    const randomAngle = (Math.random() - 0.5) * 10; // ±5 degrees
    angle += randomAngle;

    // Calculate optimal power based on distance
    const distance = calculateDistance(strikerPos, targetCoin);
    let power = Math.min(100, Math.max(30, distance * 0.8));

    // Add some randomness to power
    const randomPower = (Math.random() - 0.5) * 20; // ±10 power
    power = Math.min(100, Math.max(20, power + randomPower));

    return { angle, power };
  };

  const handleAITurn = () => {
    setAiThinking(true);
    
    // AI thinking delay for realism
    aiTimeoutRef.current = setTimeout(() => {
      const targetCoin = findBestTarget();
      if (!targetCoin) {
        // No coins left, end game
        endGame();
        return;
      }

      const { angle, power } = calculateAIShot(targetCoin);
      
      setAngle(angle);
      setPower(power);
      setAiThinking(false);
      
      // Execute AI shot after a short delay
      setTimeout(() => {
        shootStriker();
      }, 500);
    }, 1000 + Math.random() * 2000); // 1-3 seconds thinking time
  };

  const handleMouseDown = () => {
    if (gameState === 'aiming' && !isAITurn && gameMode === 'ai') {
      setIsPowerCharging(true);
      setPower(0);
      
      powerIntervalRef.current = setInterval(() => {
        setPower(prev => {
          if (prev >= 100) {
            setIsPowerCharging(false);
            clearInterval(powerIntervalRef.current);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    } else if (gameState === 'aiming' && gameMode === 'human') {
      setIsPowerCharging(true);
      setPower(0);
      
      powerIntervalRef.current = setInterval(() => {
        setPower(prev => {
          if (prev >= 100) {
            setIsPowerCharging(false);
            clearInterval(powerIntervalRef.current);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    }
  };

  const handleMouseUp = () => {
    if (isPowerCharging) {
      setIsPowerCharging(false);
      clearInterval(powerIntervalRef.current);
      shootStriker();
    }
  };

  const handleMouseMove = (e) => {
    if (gameState === 'aiming' && !isAITurn && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const strikerCenterX = 300;
      const strikerCenterY = 520;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const deltaX = mouseX - strikerCenterX;
      const deltaY = mouseY - strikerCenterY;
      const newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setAngle(newAngle);
    }
  };

  const checkPocketCollision = (x, y) => {
    const pockets = [
      { x: 0, y: 0 },
      { x: 600, y: 0 },
      { x: 0, y: 600 },
      { x: 600, y: 600 }
    ];
    
    for (let pocket of pockets) {
      const distance = Math.sqrt(Math.pow(x - pocket.x, 2) + Math.pow(y - pocket.y, 2));
      if (distance < 35) return true;
    }
    return false;
  };

  const checkWallCollision = (x, y) => {
    return x <= 20 || x >= 580 || y <= 20 || y >= 580;
  };

  const applyFriction = (velocity) => {
    const friction = 0.98;
    return {
      x: velocity.x * friction,
      y: velocity.y * friction
    };
  };

  const checkCoinCollision = (strikerX, strikerY, coinX, coinY) => {
    const distance = Math.sqrt(Math.pow(strikerX - coinX, 2) + Math.pow(strikerY - coinY, 2));
    return distance < 38; // Combined radius of striker and coin
  };

  const calculateCollisionResponse = (strikerVel, coinVel, strikerPos, coinPos) => {
    const dx = coinPos.x - strikerPos.x;
    const dy = coinPos.y - strikerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return { strikerVel, coinVel };
    
    const nx = dx / distance;
    const ny = dy / distance;
    
    const relativeVelX = strikerVel.x - coinVel.x;
    const relativeVelY = strikerVel.y - coinVel.y;
    
    const speed = relativeVelX * nx + relativeVelY * ny;
    
    if (speed < 0) return { strikerVel, coinVel };
    
    const impulse = 2 * speed;
    
    return {
      strikerVel: {
        x: strikerVel.x - impulse * nx,
        y: strikerVel.y - impulse * ny
      },
      coinVel: {
        x: coinVel.x + impulse * nx,
        y: coinVel.y + impulse * ny
      }
    };
  };

  const shootStriker = () => {
    if (power === 0) return;
    
    setGameState('shooting');
    setConsecutivePockets(0);
    setLastPocketedType(null);
    
    const velocity = power * 0.8;
    const radians = angle * (Math.PI / 180);
    const velocityX = Math.cos(radians) * velocity;
    const velocityY = Math.sin(radians) * velocity;
    
    let strikerVelocity = { x: velocityX, y: velocityY };
    let strikerPosition = { ...strikerPos };
    let coinsState = [...coins];
    let coinsPocketedThisTurn = [];
    let foulCommitted = false;
    
    const animate = () => {
      // Update striker position
      strikerPosition.x += strikerVelocity.x;
      strikerPosition.y += strikerVelocity.y;
      
      // Check wall collision
      if (checkWallCollision(strikerPosition.x, strikerPosition.y)) {
        strikerVelocity.x *= -0.8;
        strikerVelocity.y *= -0.8;
        
        // Keep striker in bounds
        strikerPosition.x = Math.max(20, Math.min(580, strikerPosition.x));
        strikerPosition.y = Math.max(20, Math.min(580, strikerPosition.y));
      }
      
      // Check pocket collision for striker
      if (checkPocketCollision(strikerPosition.x, strikerPosition.y)) {
        foulCommitted = true;
        toast.error('Striker pocketed! Foul committed!');
      }
      
      // Update coins
      coinsState = coinsState.map(coin => {
        if (coin.pocketed) return coin;
        
        // Check collision with striker
        if (checkCoinCollision(strikerPosition.x, strikerPosition.y, coin.x, coin.y)) {
          const collision = calculateCollisionResponse(
            strikerVelocity,
            coin.velocity,
            strikerPosition,
            { x: coin.x, y: coin.y }
          );
          
          strikerVelocity = collision.strikerVel;
          coin.velocity = collision.coinVel;
        }
        
        // Update coin position
        coin.x += coin.velocity.x;
        coin.y += coin.velocity.y;
        
        // Check wall collision for coins
        if (checkWallCollision(coin.x, coin.y)) {
          coin.velocity.x *= -0.8;
          coin.velocity.y *= -0.8;
          coin.x = Math.max(20, Math.min(580, coin.x));
          coin.y = Math.max(20, Math.min(580, coin.y));
        }
        
        // Check pocket collision for coins
        if (checkPocketCollision(coin.x, coin.y)) {
          coin.pocketed = true;
          coinsPocketedThisTurn.push(coin);
          
          // Check if it's a valid pocket
          if (gamePhase === 'black' && coin.type === 'black') {
            setConsecutivePockets(prev => prev + 1);
            setLastPocketedType('black');
          } else if (gamePhase === 'white' && coin.type === 'white') {
            setConsecutivePockets(prev => prev + 1);
            setLastPocketedType('white');
          } else if (gamePhase === 'red' && coin.type === 'red') {
            setConsecutivePockets(prev => prev + 1);
            setLastPocketedType('red');
          } else {
            foulCommitted = true;
            toast.error(`Wrong coin pocketed! Foul committed!`);
          }
        }
        
        // Apply friction
        coin.velocity = applyFriction(coin.velocity);
        
        return coin;
      });
      
      // Apply friction to striker
      strikerVelocity = applyFriction(strikerVelocity);
      
      // Update state
      setStrikerPos(strikerPosition);
      setCoins(coinsState);
      
      // Check if animation should stop
      const totalVelocity = Math.abs(strikerVelocity.x) + Math.abs(strikerVelocity.y);
      const coinsMoving = coinsState.some(coin => 
        !coin.pocketed && (Math.abs(coin.velocity.x) > 0.1 || Math.abs(coin.velocity.y) > 0.1)
      );
      
      if (totalVelocity < 0.5 && !coinsMoving) {
        // End turn
        endTurn(foulCommitted, coinsPocketedThisTurn);
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const endTurn = (foulCommitted, coinsPocketed) => {
    if (foulCommitted) {
      // Foul penalty
      if (currentPlayer === 1) {
        setFouls(prev => ({ ...prev, player1: prev.player1 + 1 }));
        setPlayer1Score(prev => Math.max(0, prev - 5));
      } else {
        setFouls(prev => ({ ...prev, player2: prev.player2 + 1 }));
        setPlayer2Score(prev => Math.max(0, prev - 5));
      }
      toast.error(`Player ${currentPlayer} committed a foul! -5 points`);
    } else if (coinsPocketed.length > 0) {
      // Valid pockets
      let points = 0;
      coinsPocketed.forEach(coin => {
        if (coin.type === 'red') points += 10;
        else if (coin.type === 'black') points += 5;
        else points += 2;
      });
      
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + points);
      } else {
        setPlayer2Score(prev => prev + points);
      }
      
      toast.success(`Player ${currentPlayer} pocketed ${coinsPocketed.length} coin(s)! +${points} points`);
      
      // Check if player gets another turn
      if (consecutivePockets > 0) {
        toast.success(`Player ${currentPlayer} gets another turn!`);
        setGameState('aiming');
        resetStriker();
        if (gameMode === 'ai') {
          setIsAITurn(currentPlayer === 2);
        }
        return;
      }
    }
    
    // Switch turns
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setGameState('aiming');
    resetStriker();
    
    if (gameMode === 'ai') {
      setIsAITurn(currentPlayer === 1); // If current player was 2, next turn is AI (player 2)
    }
    
    // Check game end conditions
    const remainingCoins = coins.filter(coin => !coin.pocketed);
    if (remainingCoins.length === 0) {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('gameOver');
    const winner = player1Score > player2Score ? 1 : player2Score > player1Score ? 2 : 'Tie';
    if (winner === 'Tie') {
      toast.success('Game ended in a tie!');
    } else {
      toast.success(`Player ${winner} wins with ${winner === 1 ? player1Score : player2Score} points!`);
    }
  };

  const resetStriker = () => {
    setStrikerPos({ x: 300, y: 520 });
    setPower(0);
    setAngle(0);
  };

  const resetGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setFouls({ player1: 0, player2: 0 });
    setGameState('aiming');
    setGamePhase('black');
    setConsecutivePockets(0);
    setLastPocketedType(null);
    setIsAITurn(false);
    setAiThinking(false);
    resetStriker();
    initializeCoins();
    
    // Clear any AI timeouts
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    
    toast.success('Game reset!');
  };

  const toggleGameMode = () => {
    setGameMode(gameMode === 'ai' ? 'human' : 'ai');
    resetGame();
    toast.success(`Switched to ${gameMode === 'ai' ? 'Human vs Human' : 'Human vs AI'} mode`);
  };

  const remainingCoins = coins.filter(coin => !coin.pocketed);
  const blackCoins = remainingCoins.filter(coin => coin.type === 'black').length;
  const whiteCoins = remainingCoins.filter(coin => coin.type === 'white').length;
  const redCoins = remainingCoins.filter(coin => coin.type === 'red').length;

  return (
    <CarromContainer>
      <GameTitle>Carrom</GameTitle>
      
      <TurnIndicator isPlayer1={currentPlayer === 1}>
        {gameState === 'gameOver' ? 'Game Over' : 
         aiThinking ? 'AI is thinking...' :
         isAITurn ? 'AI Turn' : 
         `Player ${currentPlayer}'s Turn`}
      </TurnIndicator>
      
      <ScoreBoard>
        <ScoreCard>
          <ScoreLabel>You</ScoreLabel>
          <ScoreValue>{player1Score}</ScoreValue>
          <div style={{ fontSize: '0.8rem', color: '#ff6b6b' }}>Fouls: {fouls.player1}</div>
        </ScoreCard>
        <ScoreCard>
          <ScoreLabel>{gameMode === 'ai' ? 'AI' : 'Player 2'}</ScoreLabel>
          <ScoreValue>{player2Score}</ScoreValue>
          <div style={{ fontSize: '0.8rem', color: '#ff6b6b' }}>Fouls: {fouls.player2}</div>
        </ScoreCard>
        <ScoreCard>
          <ScoreLabel>Phase</ScoreLabel>
          <ScoreValue style={{ color: gamePhase === 'red' ? '#ff4444' : gamePhase === 'white' ? '#ffffff' : '#333' }}>
            {gamePhase.toUpperCase()}
          </ScoreValue>
        </ScoreCard>
        <ScoreCard>
          <ScoreLabel>Coins Left</ScoreLabel>
          <ScoreValue>{remainingCoins.length}</ScoreValue>
        </ScoreCard>
      </ScoreBoard>
      
      <Controls>
        <Button onClick={resetGame} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Reset Game
        </Button>
        <Button onClick={toggleGameMode} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {gameMode === 'ai' ? 'Switch to Human vs Human' : 'Switch to Human vs AI'}
        </Button>
        <PowerMeter>
          <PowerFill
            initial={{ width: 0 }}
            animate={{ width: `${power}%` }}
            transition={{ duration: 0.1 }}
          />
        </PowerMeter>
        <BackButton as="a" href="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ← Back to Games
        </BackButton>
      </Controls>
      
      <GameBoard
        ref={boardRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: (isAITurn || aiThinking) ? 'not-allowed' : 'crosshair',
          opacity: (isAITurn || aiThinking) ? 0.8 : 1
        }}
      >
        <RealBoardSVG width="600" height="600">
          {/* Double border lines */}
          <rect x="30" y="30" width="540" height="540" rx="12" fill="none" stroke="#181818" strokeWidth="3" />
          <rect x="60" y="60" width="480" height="480" rx="8" fill="none" stroke="#181818" strokeWidth="2" />
          {/* Arrows in corners, matching the real board */}
          <path d="M60,120 Q90,60 120,60" stroke="#181818" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M480,60 Q510,60 540,120" stroke="#181818" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M60,480 Q60,510 120,540" stroke="#181818" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M480,540 Q510,540 540,480" stroke="#181818" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          {/* Center star/compass, matching the real board */}
          <g>
            <circle cx="300" cy="300" r="48" fill="none" stroke="#181818" strokeWidth="2" />
            <polygon points="300,252 308,292 348,292 316,312 328,352 300,328 272,352 284,312 252,292 292,292" fill="#b33" stroke="#181818" strokeWidth="1" />
            <circle cx="300" cy="300" r="10" fill="#181818" />
            <circle cx="300" cy="300" r="6" fill="#fff" />
          </g>
          {/* Arrow marker definition */}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,4 L0,8 Z" fill="#181818" />
            </marker>
          </defs>
        </RealBoardSVG>
        {/* Brand and Made in India text, matching the real board */}
        <BrandText style={{top: 8, left: 40}}>KORNERS</BrandText>
        <BrandText style={{bottom: 8, right: 40, transform: 'rotate(180deg)'}}>SENORS</BrandText>
        <MadeInIndia style={{top: 120, left: 70, transform: 'rotate(-30deg)'}}>MADE IN INDIA</MadeInIndia>
        
        {/* Corner pockets */}
        <CornerPocket style={{ top: -35, left: -35 }} />
        <CornerPocket style={{ top: -35, right: -35 }} />
        <CornerPocket style={{ bottom: -35, left: -35 }} />
        <CornerPocket style={{ bottom: -35, right: -35 }} />
        
        {/* Center circle */}
        <CenterCircle />
        
        {/* Striker base */}
        <StrikerBase />
        
        {/* Aiming line */}
        {gameState === 'aiming' && !isAITurn && !aiThinking && (
          <AimingLine
            style={{
              left: strikerPos.x,
              top: strikerPos.y,
              width: '100px',
              transform: `rotate(${angle}deg)`
            }}
          />
        )}
        
        {/* AI thinking indicator */}
        {aiThinking && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
              zIndex: 20
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            AI is thinking...
          </motion.div>
        )}
        
        {/* Coins */}
        {coins.map((coin) => (
          !coin.pocketed && (
            <motion.div
              key={coin.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {coin.type === 'red' && (
                <RedCoin
                  style={{
                    left: coin.x - 16,
                    top: coin.y - 16
                  }}
                />
              )}
              {coin.type === 'black' && (
                <BlackCoin
                  style={{
                    left: coin.x - 16,
                    top: coin.y - 16
                  }}
                />
              )}
              {coin.type === 'white' && (
                <WhiteCoin
                  style={{
                    left: coin.x - 16,
                    top: coin.y - 16
                  }}
                />
              )}
            </motion.div>
          )
        ))}
        
        {/* Striker */}
        <Striker
          style={{
            left: strikerPos.x - 22.5,
            top: strikerPos.y - 22.5
          }}
          animate={{
            scale: isPowerCharging ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: isPowerCharging ? Infinity : 0
          }}
        />
      </GameBoard>
      
      <div style={{ color: '#cccccc', textAlign: 'center', maxWidth: '600px', marginTop: '2rem' }}>
        <h3>Carrom Rules:</h3>
        <p>• Pocket coins in order: Black → White → Red</p>
        <p>• Click and hold to charge power, move mouse to aim</p>
        <p>• Pocketing wrong coin or striker = Foul (-5 points)</p>
        <p>• Pocketing correct coin = Extra turn</p>
        <p>• Red: 10pts | Black: 5pts | White: 2pts</p>
        <p>• AI plays strategically and calculates optimal shots</p>
      </div>
    </CarromContainer>
  );
};

export default Carrom; 
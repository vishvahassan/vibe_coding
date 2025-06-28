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
  align-items: flex-end;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Tower = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 300px;
  padding: 1rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.isSelected ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4ecdc4;
    transform: translateY(-5px);
  }
`;

const Pole = styled.div`
  width: 20px;
  height: 200px;
  background: linear-gradient(45deg, #8b4513, #a0522d);
  border-radius: 10px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: -15px;
    width: 50px;
    height: 20px;
    background: linear-gradient(45deg, #8b4513, #a0522d);
    border-radius: 5px;
  }
`;

const Disk = styled(motion.div)`
  width: ${props => props.size * 30 + 60}px;
  height: 30px;
  background: linear-gradient(45deg, ${props => props.color}, ${props => props.color}dd);
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
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

const TowerOfHanoi = () => {
  const [towers, setTowers] = useState([[], [], []]);
  const [selectedTower, setSelectedTower] = useState(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const diskColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];

  const initializeGame = () => {
    const initialTower = Array.from({ length: 8 }, (_, i) => ({
      size: 8 - i,
      color: diskColors[i]
    }));
    
    setTowers([initialTower, [], []]);
    setSelectedTower(null);
    setMoves(0);
    setIsComplete(false);
    setShowConfetti(false);
  };

  const handleTowerClick = (towerIndex) => {
    if (isComplete) return;

    if (selectedTower === null) {
      // Select tower if it has disks
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
        toast.success('Tower selected! Click destination tower.');
      }
    } else {
      // Move disk
      if (selectedTower === towerIndex) {
        setSelectedTower(null);
        toast.info('Selection cancelled.');
        return;
      }

      const sourceTower = towers[selectedTower];
      const destTower = towers[towerIndex];
      
      if (sourceTower.length === 0) {
        setSelectedTower(null);
        toast.error('No disk to move!');
        return;
      }

      const topDisk = sourceTower[sourceTower.length - 1];
      
      // Check if move is valid (larger disk can't be placed on smaller disk)
      if (destTower.length > 0 && destTower[destTower.length - 1].size < topDisk.size) {
        setSelectedTower(null);
        toast.error('Invalid move! Larger disk cannot be placed on smaller disk.');
        return;
      }

      // Perform move
      const newTowers = towers.map((tower, i) => {
        if (i === selectedTower) {
          return tower.slice(0, -1);
        } else if (i === towerIndex) {
          return [...tower, topDisk];
        }
        return tower;
      });

      setTowers(newTowers);
      setSelectedTower(null);
      setMoves(prev => prev + 1);

      // Check if puzzle is complete
      if (newTowers[2].length === 8) {
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success(`Congratulations! Puzzle completed in ${moves + 1} moves! 🎉`);
      } else {
        toast.success('Move successful!');
      }
    }
  };

  const resetGame = () => {
    initializeGame();
    toast.success('Game reset!');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <GameContainer>
      {showConfetti && <Confetti />}
      
      <GameHeader>
        <GameTitle>Tower of Hanoi</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Move all disks from the left tower to the right tower!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{moves}</StatValue>
          <StatLabel>Moves</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{towers[2].length}</StatValue>
          <StatLabel>Disks Moved</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{isComplete ? 'Complete!' : 'In Progress'}</StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </Stats>

      <GameArea>
        {towers.map((tower, index) => (
          <Tower
            key={index}
            isSelected={selectedTower === index}
            onClick={() => handleTowerClick(index)}
          >
            <Pole />
            {tower.map((disk, diskIndex) => (
              <Disk
                key={diskIndex}
                size={disk.size}
                color={disk.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: diskIndex * 0.1 }}
              />
            ))}
          </Tower>
        ))}
      </GameArea>

      <Controls>
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
          • Click on a tower to select it, then click on another tower to move the top disk
        </InstructionText>
        <InstructionText>
          • You can only move one disk at a time
        </InstructionText>
        <InstructionText>
          • A larger disk cannot be placed on top of a smaller disk
        </InstructionText>
        <InstructionText>
          • Move all disks from the left tower to the right tower to complete the puzzle
        </InstructionText>
        <InstructionText>
          • Try to complete it with the minimum number of moves (255 for 8 disks)!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default TowerOfHanoi; 
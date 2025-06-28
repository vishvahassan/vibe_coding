import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  width: 100%;
  max-width: 800px;
  height: 600px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

// Cube component
const Cube = ({ position, color }) => {
  return (
    <Box position={position} args={[0.9, 0.9, 0.9]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

// Magic Cube Scene
const MagicCubeScene = () => {
  const controlsRef = useRef();
  
  // Cube colors
  const colors = {
    front: '#ff6b6b',   // Red
    back: '#ffa726',    // Orange
    top: '#ffffff',     // White
    bottom: '#ffeb3b',  // Yellow
    left: '#4caf50',    // Green
    right: '#2196f3'    // Blue
  };

  // Generate cube positions (3x3x3)
  const generateCubes = () => {
    const cubes = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip center cube
          if (x === 0 && y === 0 && z === 0) continue;
          
          cubes.push({
            position: [x, y, z],
            color: getCubeColor(x, y, z)
          });
        }
      }
    }
    return cubes;
  };

  const getCubeColor = (x, y, z) => {
    // Determine which face this cube represents
    if (z === 1) return colors.front;
    if (z === -1) return colors.back;
    if (y === 1) return colors.top;
    if (y === -1) return colors.bottom;
    if (x === -1) return colors.left;
    if (x === 1) return colors.right;
    return '#333333'; // Default color for edge pieces
  };

  const cubes = generateCubes();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {cubes.map((cube, index) => (
        <Cube key={index} position={cube.position} color={cube.color} />
      ))}
      
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={1}
      />
    </>
  );
};

const MagicCube = () => {
  const [isScrambled, setIsScrambled] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setTimer(0);
    setMoveCount(0);
    setIsScrambled(false);
    toast.success('Magic Cube game started!');
  };

  const scrambleCube = () => {
    setIsScrambled(true);
    setMoveCount(prev => prev + 20); // Add scramble moves
    toast.success('Cube scrambled! Good luck solving it!');
  };

  const resetGame = () => {
    setIsPlaying(false);
    setTimer(0);
    setMoveCount(0);
    setIsScrambled(false);
    toast.success('Game reset!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>Magic Cube</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          The legendary 3D puzzle that challenges your spatial reasoning!
        </p>
      </GameHeader>

      <GameCanvas>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <MagicCubeScene />
        </Canvas>
      </GameCanvas>

      <Controls>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
        >
          Start Game
        </Button>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrambleCube}
          disabled={!isPlaying}
        >
          Scramble
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

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>Time</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTime(timer)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#4ecdc4', marginBottom: '0.5rem' }}>Moves</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{moveCount}</p>
        </div>
      </div>

      <Instructions>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>How to Play</h3>
        <InstructionText>
          • Use your mouse to rotate the cube and view it from different angles
        </InstructionText>
        <InstructionText>
          • Click and drag to rotate the entire cube
        </InstructionText>
        <InstructionText>
          • Scroll to zoom in and out
        </InstructionText>
        <InstructionText>
          • Try to solve the cube by getting all faces to be the same color
        </InstructionText>
        <InstructionText>
          • The goal is to complete it in the fewest moves and shortest time!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default MagicCube; 
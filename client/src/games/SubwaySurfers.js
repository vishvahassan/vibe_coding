import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #DDA0DD 100%);
  position: relative;
  overflow: hidden;
`;

const GameUI = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: white;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const Score = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Coins = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Lives = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const StartScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  z-index: 20;
  font-family: 'Arial', sans-serif;
`;

const GameTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #4ecdc4;
`;

const StartButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  z-index: 20;
  font-family: 'Arial', sans-serif;
`;

const GameOverTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #ff6b6b;
`;

const FinalScore = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const RestartButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Instructions = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 10;
`;

const SubwaySurfers = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  const startGame = () => {
    setShowStartScreen(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Game variables
    let player = null;
    let platforms = [];
    let obstacles = [];
    let coins = [];
    let gameSpeed = 0.1;
    let playerLane = 0; // -1: left, 0: center, 1: right
    let isJumping = false;
    let jumpVelocity = 0;
    let playerY = 0;
    let keys = {};

    // Create player
    const createPlayer = () => {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      player = new THREE.Mesh(geometry, material);
      player.position.set(0, 1, 0);
      player.castShadow = true;
      scene.add(player);
    };

    // Create platform
    const createPlatform = (z) => {
      const geometry = new THREE.BoxGeometry(10, 0.5, 20);
      const material = new THREE.MeshLambertMaterial({ color: 0x808080 });
      const platform = new THREE.Mesh(geometry, material);
      platform.position.set(0, -0.25, z);
      platform.receiveShadow = true;
      scene.add(platform);
      platforms.push(platform);
    };

    // Create obstacle
    const createObstacle = (z, lane) => {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      const obstacle = new THREE.Mesh(geometry, material);
      obstacle.position.set(lane * 3, 1, z);
      obstacle.castShadow = true;
      scene.add(obstacle);
      obstacles.push(obstacle);
    };

    // Create coin
    const createCoin = (z, lane) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: 0xffd700 });
      const coin = new THREE.Mesh(geometry, material);
      coin.position.set(lane * 3, 1.5, z);
      coin.castShadow = true;
      scene.add(coin);
      coins.push(coin);
    };

    // Initialize game
    const initGame = () => {
      createPlayer();
      
      // Create initial platforms
      for (let i = 0; i < 10; i++) {
        createPlatform(-i * 20);
      }

      // Create initial obstacles and coins
      for (let i = 1; i < 20; i++) {
        if (Math.random() < 0.3) {
          const lane = Math.floor(Math.random() * 3) - 1;
          createObstacle(-i * 20, lane);
        }
        if (Math.random() < 0.4) {
          const lane = Math.floor(Math.random() * 3) - 1;
          createCoin(-i * 20, lane);
        }
      }

      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    };

    // Handle input
    const handleKeyDown = (event) => {
      keys[event.code] = true;
      
      if (event.code === 'Space' && !isJumping) {
        jumpVelocity = 0.3;
        isJumping = true;
      }
    };

    const handleKeyUp = (event) => {
      keys[event.code] = false;
    };

    // Game logic
    const updateGame = () => {
      if (gameOver) return;

      // Handle player movement
      if (keys['ArrowLeft'] && playerLane > -1) {
        playerLane--;
        player.position.x = playerLane * 3;
      }
      if (keys['ArrowRight'] && playerLane < 1) {
        playerLane++;
        player.position.x = playerLane * 3;
      }

      // Handle jumping
      if (isJumping) {
        playerY += jumpVelocity;
        jumpVelocity -= 0.015; // Gravity
        
        if (playerY <= 0) {
          playerY = 0;
          jumpVelocity = 0;
          isJumping = false;
        }
        
        player.position.y = playerY + 1;
      }

      // Move everything forward
      gameSpeed += 0.0001;
      
      platforms.forEach(platform => {
        platform.position.z += gameSpeed;
        if (platform.position.z > 20) {
          scene.remove(platform);
          platforms = platforms.filter(p => p !== platform);
          createPlatform(-200);
        }
      });

      obstacles.forEach(obstacle => {
        obstacle.position.z += gameSpeed;
        obstacle.rotation.y += 0.02;
        
        // Check collision
        if (Math.abs(obstacle.position.z - player.position.z) < 1 &&
            Math.abs(obstacle.position.x - player.position.x) < 1 &&
            Math.abs(obstacle.position.y - player.position.y) < 1) {
          handleCollision();
        }
        
        if (obstacle.position.z > 20) {
          scene.remove(obstacle);
          obstacles = obstacles.filter(o => o !== obstacle);
        }
      });

      coins.forEach(coin => {
        coin.position.z += gameSpeed;
        coin.rotation.y += 0.05;
        
        // Check coin collection
        if (Math.abs(coin.position.z - player.position.z) < 1 &&
            Math.abs(coin.position.x - player.position.x) < 1 &&
            Math.abs(coin.position.y - player.position.y) < 1) {
          scene.remove(coin);
          coins = coins.filter(c => c !== coin);
          setCoins(prev => prev + 1);
          setScore(prev => prev + 10);
        }
        
        if (coin.position.z > 20) {
          scene.remove(coin);
          coins = coins.filter(c => c !== coin);
        }
      });

      // Generate new obstacles and coins
      if (Math.random() < 0.02) {
        const lane = Math.floor(Math.random() * 3) - 1;
        createObstacle(-200, lane);
      }
      
      if (Math.random() < 0.03) {
        const lane = Math.floor(Math.random() * 3) - 1;
        createCoin(-200, lane);
      }

      // Update score
      setScore(prev => prev + 1);
    };

    const handleCollision = () => {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      
      // Remove the obstacle that was hit
      const hitObstacle = obstacles.find(obstacle => 
        Math.abs(obstacle.position.z - player.position.z) < 1 &&
        Math.abs(obstacle.position.x - player.position.x) < 1
      );
      
      if (hitObstacle) {
        scene.remove(hitObstacle);
        obstacles = obstacles.filter(o => o !== hitObstacle);
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (gameStarted && !gameOver) {
        updateGame();
      }
      
      renderer.render(scene, camera);
    };

    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Start game
    initGame();
    animate();
    setGameStarted(true);

    // Store ref value for cleanup
    const currentMountRef = mountRef.current;

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (currentMountRef && renderer.domElement) {
        currentMountRef.removeChild(renderer.domElement);
      }
    };
  }, [gameOver, gameStarted]);

  const restartGame = () => {
    setScore(0);
    setCoins(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(false);
    setShowStartScreen(true);
  };

  return (
    <GameContainer>
      <GameUI>
        <Score>Score: {score}</Score>
        <Coins>Coins: {coins}</Coins>
        <Lives>Lives: {lives}</Lives>
      </GameUI>

      {showStartScreen && (
        <StartScreen>
          <GameTitle>🏃 Subway Surfers</GameTitle>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Run, jump, and collect coins in this 3D endless runner!
          </p>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <p><strong>Controls:</strong></p>
            <p>• ← → Arrow Keys: Move left/right</p>
            <p>• Space: Jump over obstacles</p>
            <p>• Avoid red obstacles</p>
            <p>• Collect golden coins for points</p>
          </div>
          <StartButton onClick={startGame}>Start Game</StartButton>
        </StartScreen>
      )}

      {gameOver && (
        <GameOverScreen>
          <GameOverTitle>Game Over!</GameOverTitle>
          <FinalScore>Final Score: {score}</FinalScore>
          <FinalScore>Coins Collected: {coins}</FinalScore>
          <RestartButton onClick={restartGame}>Play Again</RestartButton>
        </GameOverScreen>
      )}

      {!showStartScreen && !gameOver && (
        <Instructions>
          Use Arrow Keys to move left/right • Space to jump • Avoid red obstacles • Collect gold coins!
        </Instructions>
      )}

      <div ref={mountRef} />
    </GameContainer>
  );
};

export default SubwaySurfers; 
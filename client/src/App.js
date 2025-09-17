import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/auth/Profile';
import Home from './pages/Home';
import Header from './components/Header';
import PaymentButton from './components/PaymentButton';
import Breakout from './games/Breakout';
import CandyCrush from './games/CandyCrush';
import FlappyBird from './games/FlappyBird';
import MagicCube from './games/MagicCube';
import MemoryCards from './games/MemoryCards';
import Pong from './games/Pong';
import PuzzleSlider from './games/PuzzleSlider';
import SnakeGame from './games/SnakeGame';
import SubwaySurfers from './games/SubwaySurfers';
import Sudoku from './games/Sudoku';
import Tetris from './games/Tetris';
import TowerOfHanoi from './games/TowerOfHanoi';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const FloatingParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  opacity: 0.6;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const Logo = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
  animation: gradientShift 3s ease infinite;
  position: relative;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &::before {
    content: 'VV';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: 2px;
  }
  
  &::after {
    content: 'Vishnu & Vishva';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: #cccccc;
    font-weight: 400;
    letter-spacing: 1px;
    font-family: 'Arial', sans-serif;
  }
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [particles, setParticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Check if user is logged in (check localStorage for token)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <LoadingScreen>
        <Logo>VV Magic Cube</Logo>
        <LoadingText>Loading your magical experience...</LoadingText>
      </LoadingScreen>
    );
  }

  return (
    <AppContainer>
      <FloatingParticles>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            initial={{ x: particle.x, y: particle.y }}
            animate={{
              y: [particle.y, particle.y - 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </FloatingParticles>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            border: '1px solid #4a4a4a'
          },
        }}
      />
      
      {isAuthenticated && <Header user={user} onLogout={handleLogout} />}
      
      {/* Floating Payment Button */}
      {isAuthenticated && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <PaymentButton 
            variant="secondary"
            size="large"
            onPaymentSuccess={(plan) => {
              console.log('Payment successful for plan:', plan);
              // You can add logic here to unlock premium features
            }}
          >
            💎 Upgrade to Premium
          </PaymentButton>
        </div>
      )}
      
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <Register onLogin={handleLogin} /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            !isAuthenticated ? 
            <ForgotPassword /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/reset-password/:token" 
          element={
            !isAuthenticated ? 
            <ResetPassword /> : 
            <Navigate to="/" replace />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile user={user} onUpdateUser={updateUser} />
            </ProtectedRoute>
          } 
        />
        
        {/* Game Routes */}
        <Route 
          path="/games/breakout" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Breakout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/candy-crush" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CandyCrush />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/magic-cube" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MagicCube />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/memory-cards" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MemoryCards />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/puzzle-slider" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PuzzleSlider />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/snake" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SnakeGame />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/subway-surfers" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SubwaySurfers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/sudoku" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sudoku />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/tetris" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tetris />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/tower-of-hanoi" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TowerOfHanoi />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/flappy-bird" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FlappyBird />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games/pong" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Pong />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AppContainer>
  );
}

export default App; 
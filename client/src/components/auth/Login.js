import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
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

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #cccccc;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const LoginButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
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

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #4ecdc4;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #26a69a;
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #cccccc;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    padding: 0 1rem;
    font-size: 0.9rem;
  }
`;

const DemoButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll use a simple authentication
      // In a real app, you'd make an API call to your server
      if (formData.username && formData.password) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: 1,
          username: formData.username,
          email: `${formData.username}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
          createdAt: new Date().toISOString()
        };
        
        const token = 'demo-token-' + Date.now();
        
        onLogin(userData, token);
        toast.success('Welcome back! 🎉');
        navigate('/');
      } else {
        toast.error('Please fill in all fields');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 1,
        username: 'demo_user',
        email: 'demo@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        createdAt: new Date().toISOString()
      };
      
      const token = 'demo-token-' + Date.now();
      
      onLogin(userData, token);
      toast.success('Welcome to V Magic Cube! 🎮');
      navigate('/');
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Logo>VV Magic Cube</Logo>
      
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Welcome Back</Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </InputGroup>
          
          <LoginButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
        </Form>
        
        <LinksContainer>
          <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
          <StyledLink to="/register">Create Account</StyledLink>
        </LinksContainer>
        
        <Divider>
          <span>or</span>
        </Divider>
        
        <DemoButton
          onClick={handleDemoLogin}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Demo Mode
        </DemoButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 
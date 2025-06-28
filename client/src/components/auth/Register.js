import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RegisterContainer = styled.div`
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

const RegisterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
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

const RegisterButton = styled(motion.button)`
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
  text-align: center;
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

const PasswordRequirements = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #cccccc;
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RequirementIcon = styled.span`
  color: ${props => props.met ? '#4ecdc4' : '#ff6b6b'};
  font-weight: bold;
`;

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isPasswordValid) {
        toast.error('Please meet all password requirements');
        return;
      }

      if (!passwordsMatch) {
        toast.error('Passwords do not match');
        return;
      }

      if (!formData.username || !formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        createdAt: new Date().toISOString()
      };
      
      const token = 'demo-token-' + Date.now();
      
      onLogin(userData, token);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Logo>VV Magic Cube</Logo>
      
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Create Account</Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              placeholder="Create a strong password"
              required
            />
            <PasswordRequirements>
              <Requirement>
                <RequirementIcon met={passwordRequirements.length}>●</RequirementIcon>
                At least 8 characters
              </Requirement>
              <Requirement>
                <RequirementIcon met={passwordRequirements.uppercase}>●</RequirementIcon>
                One uppercase letter
              </Requirement>
              <Requirement>
                <RequirementIcon met={passwordRequirements.lowercase}>●</RequirementIcon>
                One lowercase letter
              </Requirement>
              <Requirement>
                <RequirementIcon met={passwordRequirements.number}>●</RequirementIcon>
                One number
              </Requirement>
              <Requirement>
                <RequirementIcon met={passwordRequirements.special}>●</RequirementIcon>
                One special character
              </Requirement>
            </PasswordRequirements>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {formData.confirmPassword && !passwordsMatch && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Passwords do not match
              </div>
            )}
          </InputGroup>
          
          <RegisterButton
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </RegisterButton>
        </Form>
        
        <LinksContainer>
          Already have an account? <StyledLink to="/login">Sign In</StyledLink>
        </LinksContainer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 
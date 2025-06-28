import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ResetPasswordContainer = styled.div`
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

const ResetPasswordCard = styled(motion.div)`
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
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #cccccc;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
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

const ResetButton = styled(motion.button)`
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

const SuccessMessage = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  color: #4ecdc4;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

      if (!formData.password) {
        toast.error('Please enter a new password');
        return;
      }

      // Simulate API call with token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Password reset successfully! 🎉');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <ResetPasswordContainer>
        <Logo>VV Magic Cube</Logo>
        
        <ResetPasswordCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Password Reset Successfully!</Title>
          <SuccessMessage>
            Your password has been reset successfully.
            <br />
            You will be redirected to the login page in a few seconds.
          </SuccessMessage>
          
          <LinksContainer>
            <StyledLink to="/login">Go to Login Now</StyledLink>
          </LinksContainer>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer>
      <Logo>VV Magic Cube</Logo>
      
      <ResetPasswordCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Reset Your Password</Title>
        <Subtitle>
          Enter your new password below. Make sure it's strong and secure.
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              required
            />
            {formData.confirmPassword && !passwordsMatch && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Passwords do not match
              </div>
            )}
          </InputGroup>
          
          <ResetButton
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </ResetButton>
        </Form>
        
        <LinksContainer>
          Remember your password? <StyledLink to="/login">Sign In</StyledLink>
        </LinksContainer>
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
};

export default ResetPassword; 
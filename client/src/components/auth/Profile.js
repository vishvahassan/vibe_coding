import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
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
  position: relative;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &::before {
    content: 'VV';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: 1px;
  }
  
  &::after {
    content: 'Vishnu & Vishva';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: #cccccc;
    font-weight: 400;
    letter-spacing: 1px;
    font-family: 'Arial', sans-serif;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #4ecdc4;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
`;

const Username = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  color: #cccccc;
  font-size: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
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

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
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

const BackButton = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
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

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
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

const Profile = ({ user, onUpdateUser }) => {
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
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

  const passwordRequirements = validatePassword(passwordData.newPassword);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        username: profileData.username,
        email: profileData.email
      };
      
      onUpdateUser(updatedUser);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
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

      if (!passwordData.currentPassword) {
        toast.error('Please enter your current password');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully! 🔐');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <Title>VV Magic Cube</Title>
      
      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AvatarSection>
          <Avatar src={user?.avatar} alt={user?.username} />
          <Username>{user?.username}</Username>
          <Email>{user?.email}</Email>
        </AvatarSection>

        <StatsSection>
          <StatCard>
            <StatValue>9</StatValue>
            <StatLabel>Games Available</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Games Played</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>High Score</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Total Time</StatLabel>
          </StatCard>
        </StatsSection>

        <Section>
          <SectionTitle>Profile Information</SectionTitle>
          <Form onSubmit={handleProfileUpdate}>
            <InputGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                placeholder="Enter your username"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                required
              />
            </InputGroup>
            
            <Button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Form>
        </Section>

        <Section>
          <SectionTitle>Change Password</SectionTitle>
          <Form onSubmit={handlePasswordUpdate}>
            <InputGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
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
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
              />
              {passwordData.confirmPassword && !passwordsMatch && (
                <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Passwords do not match
                </div>
              )}
            </InputGroup>
            
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </Form>
        </Section>
      </ProfileCard>

      <BackButton to="/">
        ← Back to Games
      </BackButton>
    </ProfileContainer>
  );
};

export default Profile; 
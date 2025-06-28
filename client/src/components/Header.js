import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  animation: gradientShift 3s ease infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &:hover {
    transform: scale(1.05);
  }
  
  &::before {
    content: 'VV';
    position: absolute;
    top: -8px;
    left: -5px;
    font-size: 0.9rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #4ecdc4;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Username = styled.span`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserEmail = styled.span`
  color: #cccccc;
  font-size: 0.8rem;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem;
  min-width: 150px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #4ecdc4;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #ff6b6b;
  background: none;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  
  &:hover {
    background: rgba(255, 107, 107, 0.1);
    color: #ff5252;
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/magic-cube', label: 'Magic Cube' },
    { path: '/snake-game', label: 'Snake' },
    { path: '/tetris', label: 'Tetris' },
    { path: '/memory-cards', label: 'Memory' },
    { path: '/tower-of-hanoi', label: 'Hanoi' },
    { path: '/sudoku', label: 'Sudoku' },
    { path: '/breakout', label: 'Breakout' },
    { path: '/puzzle-slider', label: 'Slider' }
  ];

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">VV Magic Cube</Logo>
        
        <Nav>
          <NavLinks>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            ))}
          </NavLinks>
          
          <UserSection>
            <UserDropdown>
              <UserAvatar
                src={user?.avatar}
                alt={user?.username}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              
              {isDropdownOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserInfo style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Username>{user?.username}</Username>
                    <UserEmail>{user?.email}</UserEmail>
                  </UserInfo>
                  
                  <DropdownItem to="/profile" onClick={() => setIsDropdownOpen(false)}>
                    👤 Profile Settings
                  </DropdownItem>
                  
                  <LogoutButton onClick={handleLogout}>
                    🚪 Logout
                  </LogoutButton>
                </DropdownMenu>
              )}
            </UserDropdown>
          </UserSection>
          
          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </Nav>
      </HeaderContent>
      
      {isMobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item) => (
            <MobileNavLink
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </MobileNavLink>
          ))}
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header; 
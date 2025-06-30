import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
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

const WelcomeSubtitle = styled.p`
  color: #cccccc;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const UserWelcome = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const UserAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #4ecdc4;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
`;

const UserGreeting = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: #4ecdc4;
  font-size: 1.5rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: #4ecdc4;
  }
`;

const GameIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const GameDescription = styled.p`
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const PlayButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff5252, #26a69a);
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const games = [
  {
    id: 'magic-cube',
    title: 'Magic Cube',
    description: '3D Rubik\'s Cube puzzle with smooth controls and beautiful graphics',
    icon: '🧊',
    path: '/games/magic-cube'
  },
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic arcade snake game with modern visuals and smooth gameplay',
    icon: '🐍',
    path: '/games/snake'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'The legendary block-stacking puzzle game with beautiful animations',
    icon: '📦',
    path: '/games/tetris'
  },
  {
    id: 'subway-surfers',
    title: 'Subway Surfers',
    description: 'Endless runner game with 3D graphics, jumping, and coin collection',
    icon: '🏃',
    path: '/games/subway-surfers'
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    description: 'Test your memory with this beautiful card matching game',
    icon: '🃏',
    path: '/games/memory-cards'
  },
  {
    id: 'tower-of-hanoi',
    title: 'Tower of Hanoi',
    description: 'Classic puzzle game with elegant animations and smooth controls',
    icon: '🏛️',
    path: '/games/tower-of-hanoi'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Number puzzle game with multiple difficulty levels',
    icon: '🔢',
    path: '/games/sudoku'
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Classic ball and paddle game with modern graphics',
    icon: '🏓',
    path: '/games/breakout'
  },
  {
    id: 'puzzle-slider',
    title: 'Puzzle Slider',
    description: 'Slide tiles to solve the puzzle and create beautiful images',
    icon: '🧩',
    path: '/games/puzzle-slider'
  },
  {
    id: 'candy-crush',
    title: 'Candy Crush',
    description: 'Match colorful candies in this addictive puzzle game',
    icon: '🍬',
    path: '/games/candy-crush'
  }
];

const Home = ({ user }) => {
  return (
    <HomeContainer>
      <Content>
        <WelcomeSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeTitle>VV Magic Cube</WelcomeTitle>
          <WelcomeSubtitle>Your ultimate gaming destination</WelcomeSubtitle>
        </WelcomeSection>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UserWelcome>
              <UserAvatar src={user.avatar} alt={user.username} />
              <UserGreeting>Welcome back, {user.username}! 🎮</UserGreeting>
              <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
                Ready to play some amazing games?
              </p>
              <UserStats>
                <Stat>
                  <StatValue>10</StatValue>
                  <StatLabel>Games Available</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>0</StatValue>
                  <StatLabel>Games Played</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>0</StatValue>
                  <StatLabel>High Score</StatLabel>
                </Stat>
              </UserStats>
            </UserWelcome>
          </motion.div>
        )}

        <GamesGrid>
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GameIcon>{game.icon}</GameIcon>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
              <PlayButton to={game.path}>Play Now</PlayButton>
            </GameCard>
          ))}
        </GamesGrid>
      </Content>
    </HomeContainer>
  );
};

export default Home; 
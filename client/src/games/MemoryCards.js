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

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
`;

const Card = styled(motion.div)`
  width: 120px;
  height: 120px;
  background: ${props => props.isFlipped ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' : 'linear-gradient(45deg, #ff6b6b, #ff5252)'};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 2rem;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
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
  max-width: 500px;
  text-align: center;
`;

const InstructionText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const MemoryCards = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setIsPlaying(true);
    setShowConfetti(false);
  };

  const handleCardClick = (cardId) => {
    if (!isPlaying || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setMatchedPairs(prev => [...prev, firstCard.emoji]);
        setScore(prev => prev + 10);
        
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isMatched: true }
            : c
        ));

        setFlippedCards([]);
        
        // Check if game is complete
        if (matchedPairs.length + 1 === emojis.length) {
          setIsPlaying(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          toast.success('Congratulations! You completed the game! 🎉');
        } else {
          toast.success('Match found! +10 points');
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
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
        <GameTitle>Memory Cards</GameTitle>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          Test your memory by matching pairs of cards!
        </p>
      </GameHeader>

      <Stats>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{moves}</StatValue>
          <StatLabel>Moves</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{matchedPairs.length}</StatValue>
          <StatLabel>Matches</StatLabel>
        </StatItem>
      </Stats>

      <GameBoard>
        {cards.map((card) => (
          <Card
            key={card.id}
            isFlipped={card.isFlipped || card.isMatched}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
          </Card>
        ))}
      </GameBoard>

      <Controls>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
        >
          New Game
        </Button>
        <BackButton to="/">
          Back to Games
        </BackButton>
      </Controls>

      <Instructions>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>How to Play</h3>
        <InstructionText>
          • Click on cards to flip them and reveal their emoji
        </InstructionText>
        <InstructionText>
          • Find matching pairs of the same emoji
        </InstructionText>
        <InstructionText>
          • Complete all pairs to win the game
        </InstructionText>
        <InstructionText>
          • Try to complete it with the fewest moves!
        </InstructionText>
      </Instructions>
    </GameContainer>
  );
};

export default MemoryCards; 
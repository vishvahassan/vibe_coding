const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Game state management
const gameStates = new Map();
const playerSessions = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join game room
  socket.on('joinGame', (gameType) => {
    socket.join(gameType);
    console.log(`User ${socket.id} joined ${gameType}`);
  });

  // Handle game moves
  socket.on('gameMove', (data) => {
    const { gameType, gameId, move } = data;
    const roomKey = `${gameType}-${gameId}`;
    
    if (!gameStates.has(roomKey)) {
      gameStates.set(roomKey, { moves: [], players: [] });
    }
    
    const gameState = gameStates.get(roomKey);
    gameState.moves.push(move);
    
    // Broadcast move to all players in the room
    socket.to(gameType).emit('gameUpdate', {
      gameId,
      move,
      gameState
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    playerSessions.delete(socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'V Magic Cube Server is running!' });
});

// Game-specific endpoints
app.get('/api/games', (req, res) => {
  const games = [
    {
      id: 'magic-cube',
      name: 'Magic Cube',
      description: '3D Rubik\'s Cube puzzle game',
      difficulty: 'Hard',
      category: 'Puzzle'
    },
    {
      id: 'snake-game',
      name: 'Snake Game',
      description: 'Classic snake arcade game',
      difficulty: 'Easy',
      category: 'Arcade'
    },
    {
      id: 'tetris',
      name: 'Tetris',
      description: 'Block stacking puzzle game',
      difficulty: 'Medium',
      category: 'Puzzle'
    },
    {
      id: 'memory-cards',
      name: 'Memory Cards',
      description: 'Card matching memory game',
      difficulty: 'Easy',
      category: 'Memory'
    },
    {
      id: 'tower-of-hanoi',
      name: 'Tower of Hanoi',
      description: 'Classic disk stacking puzzle',
      difficulty: 'Medium',
      category: 'Puzzle'
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Number placement puzzle',
      difficulty: 'Medium',
      category: 'Logic'
    },
    {
      id: 'breakout',
      name: 'Breakout',
      description: 'Ball and paddle arcade game',
      difficulty: 'Easy',
      category: 'Arcade'
    },
    {
      id: 'puzzle-slider',
      name: 'Puzzle Slider',
      description: 'Sliding tile puzzle game',
      difficulty: 'Medium',
      category: 'Puzzle'
    }
  ];
  res.json(games);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 V Magic Cube Server running on port ${PORT}`);
  console.log(`🎮 Available games: Magic Cube, Snake, Tetris, Memory Cards, Tower of Hanoi, Sudoku, Breakout, Puzzle Slider`);
}); 
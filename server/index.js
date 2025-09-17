const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

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

// Payment Routes
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'v-magic-cube-' + Date.now() } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID'
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

app.get('/api/payments/plans', (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 99,
      currency: 'INR',
      features: [
        'Access to 5 games',
        'Basic leaderboard',
        'Ad-free experience for 30 days'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 299,
      currency: 'INR',
      features: [
        'Access to all 12 games',
        'Advanced leaderboard',
        'Ad-free experience for 90 days',
        'Exclusive game themes',
        'Priority customer support'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 599,
      currency: 'INR',
      features: [
        'Access to all games + future releases',
        'Global leaderboard',
        'Lifetime ad-free experience',
        'Exclusive game themes',
        'Priority customer support',
        'Early access to new features'
      ],
      popular: false
    }
  ];
  
  res.json(plans);
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
      id: 'subway-surfers',
      name: 'Subway Surfers',
      description: 'Endless runner game with 3D graphics',
      difficulty: 'Medium',
      category: 'Arcade'
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
    },
    {
      id: 'candy-crush',
      name: 'Candy Crush',
      description: 'Match colorful candies in this addictive puzzle game',
      difficulty: 'Easy',
      category: 'Puzzle'
    },
    {
      id: 'flappy-bird',
      name: 'Flappy Bird',
      description: 'Navigate through pipes in this addictive flying game',
      difficulty: 'Medium',
      category: 'Arcade'
    },
    {
      id: 'pong',
      name: 'Pong',
      description: 'Classic two-player paddle game with modern graphics',
      difficulty: 'Easy',
      category: 'Arcade'
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
  console.log(`🎮 Multiple games available!`);
}); 
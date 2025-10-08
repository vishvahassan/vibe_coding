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

// Environment configuration
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || (NODE_ENV === 'production' ? 'https://your-app.vercel.app' : 'http://localhost:3000');
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';

// Socket.IO configuration with proper CORS
const io = socketIo(server, {
  cors: {
    origin: ALLOW_ALL_ORIGINS ? true : [CLIENT_URL, 'http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize Razorpay with error handling
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay not initialized - missing environment variables');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: ALLOW_ALL_ORIGINS ? true : [CLIENT_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting and deployment
app.set('trust proxy', 1);

// Rate limiting with different limits for development/production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
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

// Payment Routes
app.post('/api/payments/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured. Please contact support.'
      });
    }

    const { amount, currency = 'INR', receipt = 'v-magic-cube-' + Date.now() } = req.body;
    
    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount provided'
      });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      details: NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured'
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields'
      });
    }
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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
        error: 'Payment verification failed - invalid signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: NODE_ENV === 'development' ? error.message : undefined
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

// Serve static files in production
if (NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  
  // Serve static files from React build
  app.use(express.static(buildPath, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true
  }));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
} else {
  // Development route - provide helpful message
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.json({
        message: 'Development server running',
        note: 'Start the React development server with "npm run client"',
        apiEndpoints: ['/api/health', '/api/games', '/api/payments/plans']
      });
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 V Magic Cube Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🎮 Multiple games available!`);
  console.log(`📱 Client URL: ${CLIENT_URL}`);
  if (razorpay) {
    console.log(`💳 Payment system: Ready`);
  } else {
    console.log(`⚠️  Payment system: Not configured`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
}); 
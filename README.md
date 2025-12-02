# V Magic Cube 🧊

> **"Where Magic Meets Gaming"** ✨

A magical collection of 12+ puzzle and arcade games built with React, Node.js, and modern web technologies. Experience the thrill of classic games reimagined with stunning 3D graphics, smooth animations, and real-time multiplayer features.

## 🎮 Games Included

1. **Magic Cube** - 3D Rubik's Cube puzzle game with Three.js
2. **Snake Game** - Classic snake arcade game
3. **Tetris** - Block stacking puzzle game
4. **Memory Cards** - Card matching memory game
5. **Tower of Hanoi** - Classic disk stacking puzzle
6. **Sudoku** - Number placement puzzle
7. **Breakout** - Ball and paddle arcade game
8. **Puzzle Slider** - Sliding tile puzzle game

## ✨ Features

- **Modern UI/UX** - Beautiful gradient backgrounds and smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Gameplay** - Smooth 60fps gameplay with optimized rendering
- **Score Tracking** - Track your progress and beat high scores
- **Multiple Difficulty Levels** - Games adapt to your skill level
- **Confetti Celebrations** - Celebrate victories with animated confetti
- **Toast Notifications** - Real-time feedback and game status updates

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe_coding
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend (recommended)
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only (in another terminal)
   npm run client
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **Three.js** - 3D graphics for Magic Cube
- **React Three Fiber** - React renderer for Three.js
- **React Hot Toast** - Toast notifications
- **React Confetti** - Celebration animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 🎯 Game Controls

### Magic Cube
- **Mouse** - Rotate and zoom the cube
- **Click & Drag** - Rotate the entire cube

### Snake Game
- **Arrow Keys** - Control snake direction

### Tetris
- **Arrow Keys** - Move and rotate pieces
- **Spacebar** - Drop piece instantly

### Memory Cards
- **Mouse Click** - Flip cards to find matches

### Tower of Hanoi
- **Mouse Click** - Select source tower, then destination tower

### Sudoku
- **Mouse Click** - Select cell, then click number to fill

### Breakout
- **Mouse** - Control paddle movement

### Puzzle Slider
- **Mouse Click** - Move tiles adjacent to empty space

## 📁 Project Structure

```
vibe_coding/
├── server/                 # Backend server
│   └── index.js           # Express server with Socket.IO
├── client/                # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── games/         # Individual game components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎨 Customization

### Adding New Games

1. Create a new game component in `client/src/games/`
2. Add the route in `client/src/App.js`
3. Add the game to the navigation in `client/src/components/Header.js`
4. Add game data to the API in `server/index.js`

### Styling

The app uses a consistent design system with:
- **Color Palette**: Magical gradients with #ff6b6b and #4ecdc4
- **Typography**: Orbitron for headings, Roboto for body text
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
```

### Backend (Node.js)
```bash
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- **Three.js** for 3D graphics
- **Framer Motion** for animations
- **React Community** for excellent documentation
- **Game Developers** who inspired these classic games

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify Node.js version is 14 or higher
4. Check that ports 3000 and 5000 are available

## 🎮 Have Fun!

Enjoy playing the V Magic Cube games! Challenge yourself, beat your high scores, and discover the magic of puzzle solving and arcade gaming.

---

**Made with ❤️ and ✨ magic** 
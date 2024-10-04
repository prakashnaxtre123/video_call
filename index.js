const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const { Server } = require('socket.io');
// Express setup
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

// Create server and attach Socket.IO
const server = http.createServer(app);
// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: 'https://prakash-video.netlify.app', // Your Angular app URL
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials
  },
});

// Middleware to authenticate socket connections using JWT
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  try {
    const user = jwt.verify(token, 'your_jwt_secret');
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);

  // Handle signaling for video call
  socket.on('call-user', ({ offer, targetUser }) => {
    io.to(targetUser).emit('receive-call', { offer, from: socket.user.username });
  });

  socket.on('answer-call', ({ answer, targetUser }) => {
    io.to(targetUser).emit('call-answered', { answer });
  });

  socket.on('ice-candidate', ({ candidate, targetUser }) => {
    io.to(targetUser).emit('new-ice-candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});

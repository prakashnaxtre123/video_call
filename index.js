const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import cors
const app = express();
const server = http.createServer(app);
app.use(cors());

const io = socketIO(server, {
    cors: {
        origin: "https://prakash-video.netlify.app", // Replace with your Angular app URL
        methods: ["GET", "POST"], // Allowed methods
        allowedHeaders: ["Content-Type"], // Allowed headers
        credentials: true // Allow credentials
    }
});

// Serve static files from the Angular app (built later)
app.use(express.static(__dirname + '/public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Handle video call signals
    socket.on('join-room', (roomId, userId) => {
        console.log(`${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

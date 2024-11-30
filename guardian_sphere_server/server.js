const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Use the pre-configured app from app.js
const connectDB = require('./src/config/db.js');

// Connect to MongoDB
connectDB();


// Initialize Socket.io with the server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io/' // Explicitly set the Socket.IO path
});


// Object to manage connected users by group
const usersByGroup = {};

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join group', (group) => {
    socket.join(group);

    if (!usersByGroup[group]) {
      usersByGroup[group] = [];
    }
    usersByGroup[group].push(socket.id);

    io.to(group).emit('user connected', usersByGroup[group]);
  });

  socket.on('leave group', (group) => {
    socket.leave(group);

    if (usersByGroup[group]) {
      usersByGroup[group] = usersByGroup[group].filter((id) => id !== socket.id);
      io.to(group).emit('user connected', usersByGroup[group]);
    }
  });

  socket.on('chat message', (msg) => {
    io.to(msg.group).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    for (const group in usersByGroup) {
      usersByGroup[group] = usersByGroup[group].filter((id) => id !== socket.id);
      io.to(group).emit('user connected', usersByGroup[group]);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

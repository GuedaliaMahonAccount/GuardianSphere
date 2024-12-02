const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Preconfigured Express app
const connectDB = require('./src/config/db');
const Message = require('./src/models/groups'); // Message model

// Connect to MongoDB
connectDB();

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io/',
});

// Manage connected users
const usersByGroup = {};

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a group
  socket.on('join group', async (group) => {
    console.log(`User ${socket.id} joined group: ${group}`);
    socket.join(group);
    usersByGroup[group] = usersByGroup[group] || [];
    usersByGroup[group].push(socket.id);

    // Notify all users in the group about connected users
    io.to(group).emit('user connected', usersByGroup[group]);
  });

  // Leave a group
  socket.on('leave group', (group) => {
    console.log(`User ${socket.id} left group: ${group}`);
    socket.leave(group);

    if (usersByGroup[group]) {
      usersByGroup[group] = usersByGroup[group].filter((id) => id !== socket.id);
      io.to(group).emit('user connected', usersByGroup[group]);
    }
  });

  // Chat message
socket.on('chat message', async (msg) => {
  console.log('Received message:', msg);

  const { group, sender, content, photo, userId } = msg;

  try {
    const newMessage = new Message({
      group,
      sender,
      userId,
      content,
      photo,
    });

    await newMessage.save();

    console.log('Broadcasting message to group:', group, newMessage);

    // Broadcast the saved message to all users in the group
    io.to(group).emit('chat message', {
      group,
      sender,
      userId, 
      content,
      photo,
      _id: newMessage._id,
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
});

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const group in usersByGroup) {
      usersByGroup[group] = usersByGroup[group].filter((id) => id !== socket.id);
      io.to(group).emit('user connected', usersByGroup[group]);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

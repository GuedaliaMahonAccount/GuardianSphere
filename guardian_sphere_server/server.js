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
    origin: [
      'https://guardian-sphere.azurewebsites.net',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling']  // Explicitly define transports
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

    // Nettoie les anciens messages
    await cleanOldMessages(group);

    console.log('Broadcasting message to group:', group, newMessage);

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

// Ajouter la fonction cleanOldMessages
async function cleanOldMessages(group) {
  try {
    const count = await Message.countDocuments({ group });
    if (count > 20) {
      const messagesToDelete = await Message.find({ group })
        .sort({ timestamp: 1 })
        .limit(count - 20);
      
      if (messagesToDelete.length > 0) {
        await Message.deleteMany({
          _id: { $in: messagesToDelete.map(msg => msg._id) }
        });
      }
    }
  } catch (error) {
    console.error('Error cleaning old messages:', error);
  }
}

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
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
  console.log(`Frontend Origin: ${process.env.FRONTEND_ORIGIN}`);
});

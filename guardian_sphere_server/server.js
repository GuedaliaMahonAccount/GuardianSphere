const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Preconfigured Express app
const connectDB = require('./src/config/db');
const Message = require('./src/models/groups'); // Message model
const logger = require('./logger'); // Logger

// Connect to MongoDB
connectDB();

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'https://guardian-sphere.azurewebsites.net',
      'http://localhost:3000',
      'https://guardianspheres.com',
      'https://guardian-sphere-python-new-c7csa3dzetg9ckdp.israelcentral-01.azurewebsites.net'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling']
});

// Manage connected users
const usersByGroup = {};

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  logger.info(`User connected: ${socket.id}`);

  // Join a group
  socket.on('join group', ({ group, language, secter }) => {
    const groupKey = `${group}_${language}_${secter}`;
    console.log(`User ${socket.id} joined group: ${groupKey}`);
    logger.info(`User ${socket.id} joined group: ${groupKey}`);
    socket.join(groupKey);
    usersByGroup[groupKey] = usersByGroup[groupKey] || [];
    usersByGroup[groupKey].push(socket.id);

    // Notify all users in the group about connected users
    io.to(groupKey).emit('user connected', usersByGroup[groupKey]);
  });

  // Leave a group
  socket.on('leave group', ({ group, language, secter }) => {
    const groupKey = `${group}_${language}_${secter}`;
    console.log(`User ${socket.id} left group: ${groupKey}`);
    logger.info(`User ${socket.id} left group: ${groupKey}`);
    socket.leave(groupKey);

    if (usersByGroup[groupKey]) {
      usersByGroup[groupKey] = usersByGroup[groupKey].filter((id) => id !== socket.id);
      io.to(groupKey).emit('user connected', usersByGroup[groupKey]);
    }
  });

  // Chat message
  socket.on('chat message', async (msg) => {
    console.log('Received message:', msg);
    logger.info(`Received message: ${msg}`);

    const { group, sender, content, photo, userId, language, secter } = msg;
    const groupKey = `${group}_${language}_${secter}`;

    try {
      const newMessage = new Message({
        group: groupKey,
        sender,
        userId,
        content,
        photo,
      });

      await newMessage.save();

      // Clean old messages
      await cleanOldMessages(groupKey);

      console.log('Broadcasting message to group:', groupKey, newMessage);
      logger.info(`Broadcasting message to group: ${groupKey}, ${newMessage}`);

      io.to(groupKey).emit('chat message', {
        group: groupKey,
        sender,
        userId,
        content,
        photo,
        _id: newMessage._id,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      logger.error(`Error saving message: ${error}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const groupKey in usersByGroup) {
      usersByGroup[groupKey] = usersByGroup[groupKey].filter((id) => id !== socket.id);
      io.to(groupKey).emit('user connected', usersByGroup[groupKey]);
    }
    console.log('User disconnected:', socket.id);
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Clean old messages function
async function cleanOldMessages(groupKey) {
  try {
    const count = await Message.countDocuments({ group: groupKey });
    if (count > 20) {
      const messagesToDelete = await Message.find({ group: groupKey })
        .sort({ timestamp: 1 })
        .limit(count - 20);

      if (messagesToDelete.length > 0) {
        await Message.deleteMany({
          _id: { $in: messagesToDelete.map((msg) => msg._id) }
        });
      }
    }
  } catch (error) {
    console.error('Error cleaning old messages:', error);
    logger.error(`Error cleaning old messages: ${error}`);
  }
}

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});

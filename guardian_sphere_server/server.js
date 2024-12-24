const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Preconfigured Express app
const connectDB = require('./src/config/db');
const Message = require('./src/models/groups'); // Message model
const logger = require('./logger'); //logger

// Connect to MongoDB
connectDB();

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'https://guardian-sphere.azurewebsites.net',
      'http://localhost:3000',
      'https://guardianspheres.com/',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling']  // Explicitly define transports
});

// Manage connected users
const usersByGroup = {};

// Active calls tracking
const activeCalls = {};

// Socket.IO logic
io.on('connection', (socket) => {

  // Join a group
  socket.on('join group', async (group) => {
    console.log(`User ${socket.id} joined group: ${group}`);
    logger.info(`User ${socket.id} joined group: ${group}`);
    socket.join(group);
    usersByGroup[group] = usersByGroup[group] || [];
    usersByGroup[group].push(socket.id);

    // Notify all users in the group about connected users
    io.to(group).emit('user connected', usersByGroup[group]);
  });

  // Leave a group
  socket.on('leave group', (group) => {
    console.log(`User ${socket.id} left group: ${group}`);
    logger.info(`User ${socket.id} left group: ${group}`);
    socket.leave(group);

    if (usersByGroup[group]) {
      usersByGroup[group] = usersByGroup[group].filter((id) => id !== socket.id);
      io.to(group).emit('user connected', usersByGroup[group]);
    }
  });

  // Chat message
socket.on('chat message', async (msg) => {

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
    logger.info(`Broadcasting message to group: ${group}, ${newMessage}`);

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
    logger.error(`Error saving message: ${error}`);
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
    logger.error(`Error cleaning old messages: ${error}`);
  }
}



//call logic
//
//

async function cleanupEmptyCalls() {
  try {
      const emptyCalls = await Call.find({ participants: { $size: 0 } });
      for (const call of emptyCalls) {
          await Call.deleteOne({ id: call.id });
          console.log(`Deleted empty call: ${call.id}`);
      }
  } catch (error) {
      console.error('Error cleaning up empty calls:', error);
  }
}



socket.on('join call', ({ callId, peerId, userId }) => {
  if (!activeCalls[callId]) {
      activeCalls[callId] = [];
  }

  if (peerId) {
      activeCalls[callId].push({ peerId, userId, socketId: socket.id });
      socket.join(callId);

      console.log(`User ${userId} joined call ${callId}`);
      io.to(callId).emit('update participants', activeCalls[callId]); // Update participants count
  } else {
      console.warn(`Peer ID missing for user ${userId}. Cannot join call ${callId}.`);
  }
});

socket.on('disconnect', () => {
  for (const callId in activeCalls) {
    activeCalls[callId] = activeCalls[callId].filter((user) => user.socketId !== socket.id);

    if (activeCalls[callId].length === 0) {
      delete activeCalls[callId];
      console.log(`Call ${callId} deleted.`);
    }
  }
});

socket.on('leave call', async ({ callId }) => {
  if (activeCalls[callId]) {
      activeCalls[callId] = activeCalls[callId].filter(
          (participant) => participant.socketId !== socket.id
      );
      socket.leave(callId);

      if (activeCalls[callId].length === 0) {
          delete activeCalls[callId];
          console.log(`Call ${callId} deleted.`);
          await cleanupEmptyCalls(); // Trigger cleanup
      } else {
          io.to(callId).emit('update participants', activeCalls[callId]);
      }
  }
});

socket.on('disconnect', async () => {
  for (const callId in activeCalls) {
      activeCalls[callId] = activeCalls[callId].filter(
          (participant) => participant.socketId !== socket.id
      );

      if (activeCalls[callId].length === 0) {
          delete activeCalls[callId];
          console.log(`Call ${callId} deleted.`);
          await cleanupEmptyCalls(); // Trigger cleanup
      } else {
          io.to(callId).emit('update participants', activeCalls[callId]);
      }
  }
});

});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
});

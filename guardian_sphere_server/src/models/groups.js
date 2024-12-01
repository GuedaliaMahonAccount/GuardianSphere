const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  group: { type: String, required: true },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  photo: { type: String, default: '/Pictures/default-avatar.png' },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

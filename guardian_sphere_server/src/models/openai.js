const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Message Schema
const messageSchema = new Schema({
  user_message: { type: String, required: true },
  ai_message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Chat Schema
const chatSchema = new Schema({
  title: { type: String, required: true }, // Title for the chat
  messages: [messageSchema], // Array of messages
  timestamp: { type: Date, default: Date.now }, // Chat creation date
  helped: { type: Boolean, default: null }, // User helped or not
  feedback: { type: String, enum: ["like", "dislike", null], default: null }, // Feedback
});

// User Chat Schema
const userChatSchema = new Schema({
  username: { type: String, required: true, unique: true },
  chats: [chatSchema], // Array of chats
});

const OpenAIChat = mongoose.model("OpenAIChat", userChatSchema);
module.exports = OpenAIChat;

const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");

// New chat
router.post("/new-chat", openaiController.addNewChat);

// Send message
router.post("/chat", openaiController.chatWithAI);

// Delete chat
router.delete("/delete-chat", openaiController.deleteChat);

// Get chat history
router.get("/history/:username", openaiController.getChatHistory);

// Update chat title
router.put("/update-chat-title", openaiController.updateChatTitle);

// Update feedback
router.put("/update-feedback", openaiController.updateChatFeedback);

module.exports = router;
const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");

// Nouvelle discussion
router.post("/new-chat", openaiController.addNewChat);

// Envoyer un message
router.post("/chat", openaiController.chatWithAI);

// Effacer un chat
router.delete("/delete-chat", openaiController.deleteChat);

// Obtenir l'historique
router.get("/history/:username", openaiController.getChatHistory);

module.exports = router;

const OpenAIChat = require("../models/openai");
const openai = require("openai");

// Configure OpenAI API
openai.apiKey = process.env.OPENAI_API_KEY;

// Chat with AI and save the message
exports.chatWithAI = async (req, res) => {
    try {
        const { username, chatId, message } = req.body;

        if (!username || !message) {
            return res.status(400).json({ error: "Username and message are required." });
        }

        const userChat = await OpenAIChat.findOne({ username });
        if (!userChat) {
            return res.status(404).json({ error: "No user found." });
        }

        const chat = userChat.chats.id(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        const aiResponse = await openai.ChatCompletion.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const aiMessage = aiResponse.choices[0].message.content.trim();

        chat.messages.push({
            user_message: message,
            ai_message: aiMessage,
        });

        await userChat.save();

        res.json({ response: aiMessage, chatId });
    } catch (error) {
        console.error("Error in chatWithAI:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Add a new chat for the user
exports.addNewChat = async (req, res) => {
    try {
        const { username, title } = req.body;

        if (!username || !title) {
            return res.status(400).json({ error: "Username and title are required." });
        }

        const userChat = await OpenAIChat.findOne({ username });
        if (!userChat) {
            const newUser = new OpenAIChat({
                username,
                chats: [{ title, messages: [] }],
            });
            await newUser.save();
            return res.json({ message: "New chat created.", chatId: newUser.chats[0]._id });
        }

        userChat.chats.push({ title, messages: [] });
        const newChat = userChat.chats[userChat.chats.length - 1];
        await userChat.save();

        res.json({ message: "New chat created.", chatId: newChat._id });
    } catch (error) {
        console.error("Error in addNewChat:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Retrieve chat history by username
exports.getChatHistory = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const userChat = await OpenAIChat.findOne({ username });
        if (!userChat) {
            return res.status(404).json({ error: "No chat history found for this username." });
        }

        res.json({ history: userChat.chats });
    } catch (error) {
        console.error("Error in getChatHistory:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Delete a chat by chatId
exports.deleteChat = async (req, res) => {
    try {
        const { username, chatId } = req.body;

        if (!username || !chatId) {
            return res.status(400).json({ error: "Username and chatId are required." });
        }

        const userChat = await OpenAIChat.findOne({ username });
        if (!userChat) {
            return res.status(404).json({ error: "No user found." });
        }

        const chat = userChat.chats.id(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        chat.remove();
        await userChat.save();

        res.json({ message: "Chat deleted successfully." });
    } catch (error) {
        console.error("Error in deleteChat:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Update chat title
exports.updateChatTitle = async (req, res) => {
    try {
        const { username, chatId, newTitle } = req.body;

        if (!username || !chatId || !newTitle) {
            return res.status(400).json({ error: "Username, chatId, and newTitle are required." });
        }

        const userChat = await OpenAIChat.findOne({ username });
        if (!userChat) {
            return res.status(404).json({ error: "No user found." });
        }

        const chat = userChat.chats.id(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        chat.title = newTitle;
        await userChat.save();

        res.json({ message: "Chat title updated successfully." });
    } catch (error) {
        console.error("Error in updateChatTitle:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Update chat feedback (like/dislike)
exports.updateChatFeedback = async (req, res) => {
    try {
      const { username, chatId, feedback } = req.body;
  
      if (!username || !chatId || !["like", "dislike"].includes(feedback)) {
        return res.status(400).json({ error: "Invalid feedback or missing fields." });
      }
  
      const userChat = await OpenAIChat.findOne({ username });
      if (!userChat) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const chat = userChat.chats.id(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found." });
      }
  
      chat.feedback = feedback;
      await userChat.save();
  
      res.json({ message: "Feedback updated successfully.", feedback });
    } catch (error) {
      console.error("Error in updateChatFeedback:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
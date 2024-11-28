import React, { useState, useEffect } from 'react';
import './Home.css';
import { useTranslation } from "react-i18next";
import { sendMessageToAI, getChatHistory, addNewChat, deleteChat } from './HomeReq';

const Home = () => {
  const { t, i18n } = useTranslation("Home");

  const username = "userexemple"; // Hardcoded username
  const [message, setMessage] = useState(''); // Current input message
  const [messages, setMessages] = useState([]); // Messages of the active chat
  const [chatHistory, setChatHistory] = useState([]); // Global chat history
  const [activeChatId, setActiveChatId] = useState(null); // ID of the active chat
  const [showHistory, setShowHistory] = useState(false); // Toggle for showing/hiding chat history

  // Load chat history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getChatHistory(username);
      setChatHistory(history); // Update chat history
    };
    fetchHistory();
  }, [username]);

  // Start a new chat
  const startNewChat = async () => {
    const newChat = await addNewChat(username, `Chat ${chatHistory.length + 1}`);
    if (!newChat) {
      console.error("Failed to create a new chat.");
      return; // Stop execution if the new chat is not created
    }
  
    setChatHistory((prevHistory) => [...prevHistory, newChat]);
    setMessages([]);
    setActiveChatId(newChat._id);
  };
  
  // Select a chat from the history
const handleSelectHistory = (chatId) => {
  const selectedChat = chatHistory.find((chat) => chat._id === chatId);
  if (selectedChat) {
    // Correction du mapping des messages
    setMessages(selectedChat.messages.map((msg) => ({
      sender: msg.role === 'user' ? 'user' : 'ai',
      text: msg.content
    })));
    setActiveChatId(chatId);
    setShowHistory(false);
  }
};

  // Delete a chat from the history
  const handleDeleteChat = async (chatId) => {
    await deleteChat(username, chatId); // Send a request to delete the chat
    setChatHistory((prevHistory) => prevHistory.filter((chat) => chat._id !== chatId)); // Remove the deleted chat from history
    if (activeChatId === chatId) {
      setMessages([]); // Clear messages if the active chat was deleted
      setActiveChatId(null); // Reset the active chat
    }
  };

  // Send a message to the AI
  const handleSendToAi = async (e) => {
    e.preventDefault();
    if (message.trim() && activeChatId) {
      try {
        // Ajoutez d'abord le message de l'utilisateur à l'interface
        setMessages(prev => [...prev, {
          sender: 'user',
          text: message
        }]);
        
        const userMessage = message;
        setMessage('');  // Clear input
        
        const response = await sendMessageToAI(username, activeChatId, userMessage);
        
        // Mettre à jour les messages avec la réponse complète
        if (response.messages) {
          setMessages(response.messages.map(msg => ({
            sender: msg.role === 'user' ? 'user' : 'ai',
            text: msg.content
          })));
        }
      } catch (err) {
        console.error("Error sending message:", err);
        // Ajouter un message d'erreur à l'interface
        setMessages(prev => [...prev, {
          sender: 'system',
          text: "Error: Unable to get response from AI."
        }]);
      }
    }
  };
  
  return (
    <div className="home-container">
      <h2>{t("hello_i_m_here_for_you")}</h2>

      {/* New Chat Button */}
      <button className="new-chat-button" onClick={startNewChat}>
        {t("new_chat")}
      </button>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === 'user' ? 'user-message' : 'ai-message'}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Form */}
      <form onSubmit={handleSendToAi} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("write_here")}
          className="message-input"
        />
        <button type="submit" className="send-button">{t("send")}</button>
      </form>

      {/* Button to toggle chat history */}
      <button
        className="history-button"
        onClick={() => setShowHistory(!showHistory)}
      >
        {t("view_history")}
      </button>

      {/* Side menu for chat history */}
      <div
        className={`history-menu ${i18n.language === "he" ? "left" : "right"} ${showHistory ? "open" : ""}`}
      >
        <h3>{t("chat_history")}</h3>
        <ul>
          {chatHistory.map((chat) => (
            <li key={chat._id}>
              <strong onClick={() => handleSelectHistory(chat._id)}>
                {chat.title}
              </strong>
              <button className="clear-history-button" onClick={() => handleDeleteChat(chat._id)}>
                {t("delete")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

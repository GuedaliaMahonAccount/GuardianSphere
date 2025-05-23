import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { useTranslation } from "react-i18next";
import { sendMessageToAI, getChatHistory, addNewChat, deleteChat, updateChatTitle, updateChatFeedback } from './ChatReq';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { t, i18n } = useTranslation("Chat");
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const [message, setMessage] = useState(''); // Current input message
  const [messages, setMessages] = useState([]); // Messages of the active chat
  const [chatHistory, setChatHistory] = useState([]); // Global chat history
  const [activeChatId, setActiveChatId] = useState(null); // ID of the active chat
  const [showHistory, setShowHistory] = useState(false); // Toggle for showing/hiding chat history
  const [editingChatId, setEditingChatId] = useState(null); // ID of the chat being edited
  const [newTitle, setNewTitle] = useState(''); // New title for the chat
  const [chatHeight, setChatHeight] = useState(100); // Initial height
   const chatBoxRef = useRef(null); // Reference for the chat box container

  useEffect(() => {
    const newHeight = Math.min(100 + messages.length * 20, 400); // Increase by 20px per message up to 400px
    setChatHeight(newHeight);
    scrollToBottom();
  }, [messages]);

    const scrollToBottom = () => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    };

  // Load chat history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getChatHistory(username);
      setChatHistory(history); // Update chat history

      if (history && history.length > 0) {
        const latestChat = history[history.length - 1]; // Get the latest chat
        setActiveChatId(latestChat._id); // Set the latest chat as active
        setMessages(latestChat.messages.map((msg) => ({
          sender: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content,
        })));
      }
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
      setMessages(selectedChat.messages.map((msg) => ({
        sender: msg.role === 'user' ? 'user' : 'ai',
        text: msg.content,
      })));
      setActiveChatId(chatId); // Assurez-vous que l'ID actif est défini ici
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
        // Add the user message to the interface first
        setMessages(prev => [...prev, {
          sender: 'user',
          text: message
        }]);

        const userMessage = message;
        setMessage('');  // Clear input

        const response = await sendMessageToAI(username, activeChatId, userMessage);

        // Update messages with the full response
        if (response.messages) {
          setMessages(response.messages.map(msg => ({
            sender: msg.role === 'user' ? 'user' : 'ai',
            text: msg.content
          })));
        }
      } catch (err) {
        console.error("Error sending message:", err);
        // Add an error message to the interface
        setMessages(prev => [...prev, {
          sender: 'system',
          text: "Error: Unable to get response from AI."
        }]);
      }
    }
  };

  // Update chat title
  const handleUpdateTitle = async (chatId) => {
    if (newTitle.trim()) {
      await updateChatTitle(username, chatId, newTitle);
      setChatHistory(prevHistory => prevHistory.map(chat =>
        chat._id === chatId ? { ...chat, title: newTitle } : chat
      ));
      setEditingChatId(null);
      setNewTitle('');
    }
  };

  const handleFeedback = async (feedback) => {
    try {
      if (!activeChatId) {
        console.error("No active chat ID found. Cannot update feedback.");
        return;
      }

      console.log("Sending feedback update:", { username, chatId: activeChatId, feedback });

      await updateChatFeedback(username, activeChatId, feedback);

      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat._id === activeChatId ? { ...chat, feedback } : chat
        )
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'system', text: t("thanks") },
      ]);
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="chat-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <img src="logo192guardian.png" alt="Guardian Sphere Logo" className="landing-logo1" />
      <div className="chat-header">
        <h2>{t("hello_i_m_here_for_you")}</h2>
      </div>

      {/* New Chat Button */}
      <button className="new-chat-button" onClick={startNewChat}>
        {t("new_chat")}
      </button>

      {/* Chat Box */}
      <div className="chat-box" style={{ height: `${chatHeight}px` }} ref={chatBoxRef}>
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

      <div className="feedback-buttons">
        <button
          className={`feedback-button ${activeChatId && chatHistory.find(chat => chat._id === activeChatId)?.feedback === "like" ? "liked" : ""}`}
          onClick={() => handleFeedback("like")}
        >
          👍{t("it_helped")}
        </button>
        <button
          className={`feedback-button ${activeChatId && chatHistory.find(chat => chat._id === activeChatId)?.feedback === "dislike" ? "disliked" : ""}`}
          onClick={() => handleFeedback("dislike")}
        >
          👎{t("it_not_helped")}
        </button>
      </div>


      {/* Button to toggle chat history */}
      <button
        className={`history-button ${i18n.language === "he" ? "left" : "right"}`}
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
              {editingChatId === chat._id ? (
                <>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateTitle(chat._id); // Save the title on Enter key press
                      }
                    }}
                  />
                  <button className="save-button" onClick={() => handleUpdateTitle(chat._id)}>
                    {t("save")}
                  </button>
                </>
              ) : (
                <>
                  <strong onClick={() => handleSelectHistory(chat._id)}>
                    {chat.title}
                  </strong>
                  <button
                    className="edit-title-button"
                    onClick={() => {
                      setEditingChatId(chat._id);
                      setNewTitle(chat.title);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </>
              )}
              <button
                className="clear-history-button"
                onClick={() => handleDeleteChat(chat._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default Chat;
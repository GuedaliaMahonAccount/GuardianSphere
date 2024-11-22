import React, { useState } from 'react';
import './Home.css'; // Make sure to create this CSS file for styling the page

const Home = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Handle message submission
  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message to the message array
      setMessages([...messages, { sender: 'user', text: message }]);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: 'I am here to help, how can I assist you today?' },
        ]);
      }, 1000); // AI responds after 1 second
    }
    setMessage(''); // Clear the input field after sending the message
  };

  const handleSendToAi = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { sender: 'user', text: message }]);
      setMessage('');
  
      // Send the user message to the AI API (example structure)
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.response },
      ]);
    }
  };
  

  return (
    <div className="home-container">
      <h2>Welcome, you are not alone</h2>
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write here..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Home;

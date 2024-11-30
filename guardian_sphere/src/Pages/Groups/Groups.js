import React, { useEffect, useState } from 'react';
import './Groups.css';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';


// Connect to the Socket.IO server
const socket = io('http://localhost:5001', {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
});

const Groups = () => {
  const { t } = useTranslation('Groups');
  const [messages, setMessages] = useState({
    group1: [],
    group2: [],
    group3: [],
  });
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [msg.group]: [...prevMessages[msg.group], msg],
      }));
    });

    socket.on('user connected', (users) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat message');
      socket.off('user connected');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && currentGroup) {
      socket.emit('chat message', {
        group: currentGroup,
        message: input,
        sender: username || t('anonymous'),
        photo: photo || '/Pictures/default-avatar.png', 
      });
      setInput('');
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const openGroup = (group) => {
    setCurrentGroup(group);
    socket.emit('join group', group);
  };

  const goBack = () => {
    socket.emit('leave group', currentGroup);
    setCurrentGroup(null);
    setConnectedUsers([]);
    setIsNameSet(false);
    setUsername('');
    setPhoto('');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please upload an image.');
    }
  };
  

  return (
    <div className="home-container">
      {!currentGroup ? (
        <div className="group-list">
          <h2 className="group-title-header">{t('groups_title')}</h2>
          <p>{t('groups_description')}</p>
          {['group1', 'group2', 'group3'].map((group) => (
            <div key={group} className="group-title" onClick={() => openGroup(group)}>
              <h3>{t(`${group}_title`)}</h3>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="external-header">
            <div className="username-header">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('enter_name')}
              />
              <input type="file" onChange={handlePhotoUpload} />
            </div>
            <h2 className="chat-group-title">{t(`${currentGroup}_title`)}</h2>
          </div>
          <div className="chat-box">
            <div className="chat-header">
              <button onClick={goBack} className="back-button">{t('back')}</button>
              <p>{t('connected_users')}: {connectedUsers.length}</p>
            </div>
            <div className="messages">
              {messages[currentGroup].map((msg, index) => (
                <div key={index} className="message">
                  <div className="profile">
                    <img src={msg.photo || '/default-avatar.png'} alt="profile" />
                    <span>{msg.sender}</span>
                  </div>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="message-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('type_message')}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button onClick={sendMessage} className="send-button">{t('send')}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Groups;

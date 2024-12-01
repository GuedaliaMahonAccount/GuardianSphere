import React, { useEffect, useState } from 'react';
import './Groups.css';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { fetchGroupMessages } from './GroupsReq';

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

  // Listen for socket events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('chat message', (msg) => {
      console.log('Received chat message:', msg);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [msg.group]: [...prevMessages[msg.group], msg],
      }));
    });

    socket.on('user connected', (users) => {
      console.log('Connected users updated:', users);
      setConnectedUsers(users);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat message');
      socket.off('user connected');
    };
  }, []);

  // Load group messages on group change
  useEffect(() => {
    const loadMessages = async () => {
      if (currentGroup) {
        try {
          const data = await fetchGroupMessages(currentGroup);
          setMessages((prevMessages) => ({
            ...prevMessages,
            [currentGroup]: data,
          }));
        } catch (error) {
          console.error('Failed to load group messages:', error);
        }
      }
    };

    loadMessages();
  }, [currentGroup]);

  const sendMessage = () => {
    if (input.trim() && currentGroup) {
      const messagePayload = {
        group: currentGroup,
        message: input,
        sender: username || t('anonymous'),
        photo: photo || '/Pictures/default-avatar.png',
      };
      console.log('Sending message:', messagePayload);

      socket.emit('chat message', messagePayload);
      setInput(''); // Clear the input field
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
              {messages[currentGroup]?.map((msg, index) => (
                <div key={index} className="message">
                  <div className="profile">
                    <img src={msg.photo || '/default-avatar.png'} alt="profile" />
                    <span>{msg.sender}</span>
                  </div>
                  <span>{msg.content}</span>
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

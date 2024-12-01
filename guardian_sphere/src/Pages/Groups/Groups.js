import React, { useEffect, useRef, useState } from 'react';
import './Groups.css';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { fetchGroupMessages, updateUserData } from './GroupsReq';

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
  const messagesEndRef = useRef(null); // Référence pour le défilement automatique

  // Fonction pour défiler jusqu'en bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Appeler la fonction de défilement à chaque changement de messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Récupération des détails de l'utilisateur
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:5001/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user details');
          return;
        }

        const user = await response.json();
        setUsername(user.anonymousName || user.realName);
        setPhoto(user.photo || '/Pictures/default-avatar.png');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserDetails();
  }, []);

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
        content: input,
        sender: username,
        photo,
      };

      socket.emit('chat message', messagePayload);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentGroup]: [...prevMessages[currentGroup], messagePayload],
      }));

      setInput('');
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setPhoto(photoData);
        updateUserData({ photo: photoData });
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
            <div key={group} className="group-title" onClick={() => setCurrentGroup(group)}>
              <h3>{t(`${group}_title`)}</h3>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button className="back-button" onClick={() => setCurrentGroup(null)}>{t('back')}</button>
          <div className="external-header">
            <div className="username-header">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('enter_name')}
                className="username-input"
              />
              <div className="photo-upload">
                <label htmlFor="photo-input" className="photo-container">
                  <img src={photo} alt="profile" className="user-avatar" />
                </label>
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <h2 className="chat-group-title">{t(`${currentGroup}_title`)}</h2>
          </div>

          <div className="chat-header">
            <p>{t('connected_users')}: {connectedUsers.length}</p>
          </div>
          <div className="chat-box">
            <div className="messages">
              {messages[currentGroup]?.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === username ? 'my-message' : 'other-message'}`}
                >
                  <div className="profile">
                    <img src={msg.photo} alt="profile" />
                    <span>{msg.sender}</span>
                  </div>
                  <span>{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="message-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('type_message')}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
            />
            <button className="send-button" onClick={sendMessage}>{t('send')}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Groups;

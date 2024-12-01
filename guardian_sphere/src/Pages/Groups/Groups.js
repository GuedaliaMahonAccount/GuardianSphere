import React, { useEffect, useState } from 'react';
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
  const [userId, setUserId] = useState('');

  // Fetch user details from the backend on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure token is fetched correctly
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:5001/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
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
        content: input, // Correct field name
        sender: username,
        photo,
      };
  
      socket.emit('chat message', messagePayload);
  
      // Optimistic UI update
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentGroup]: [...prevMessages[currentGroup], messagePayload],
      }));
  
      setInput('');
    }
  };
  
  const updateProfile = async () => {
    try {
      await updateUserData({ anonymousName: username, photo });
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        updateProfile();
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please upload an image.');
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    updateProfile();
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
          <div className="external-header">
            <div className="username-header">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder={t('enter_name')}
              />
              <input type="file" onChange={handlePhotoUpload} />
            </div>
            <h2 className="chat-group-title">{t(`${currentGroup}_title`)}</h2>
          </div>
          <div className="chat-box">
            <div className="chat-header">
              <button onClick={() => setCurrentGroup(null)}>{t('back')}</button>
              <p>{t('connected_users')}: {connectedUsers.length}</p>
            </div>
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
                  <span>{msg.content}</span> {/* Ensure "message" matches the backend field */}
                </div>
              ))}
            </div>

            <div className="message-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('type_message')}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>{t('send')}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Groups;

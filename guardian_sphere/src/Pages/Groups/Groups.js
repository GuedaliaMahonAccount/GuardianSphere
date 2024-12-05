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
  const { t, i18n } = useTranslation('Groups');
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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  const chatBoxRef = useRef(null); // Reference for the chat box container

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');

    if (savedUserId) {
      setUsername(savedUsername || 'Anonymous');
    } else {
      console.error('No userId found in localStorage. Please log in.');
    }
  }, []);

  // Automatically scroll to the bottom when messages update
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user details from the server
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
      // If this is our own sent message, we can hide the loader
      if (msg.userId === localStorage.getItem('userId')) {
        setIsSending(false);
      }
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
    if (currentGroup) {
      socket.emit('join group', currentGroup);
    }

    return () => {
      if (currentGroup) {
        socket.emit('leave group', currentGroup);
      }
    };
  }, [currentGroup]);

  useEffect(() => {
    const loadMessages = async () => {
      if (currentGroup) {
        try {
          setIsLoadingMessages(true);
          const data = await fetchGroupMessages(currentGroup);
          setMessages((prevMessages) => ({
            ...prevMessages,
            [currentGroup]: data,
          }));
        } catch (error) {
          console.error('Failed to load group messages:', error);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    };

    loadMessages();
  }, [currentGroup]);

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

  const sendMessage = () => {
    if (input.trim() && currentGroup) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('No userId found in localStorage.');
        return;
      }

      setIsSending(true);
      const messagePayload = {
        group: currentGroup,
        content: input,
        sender: username,
        userId,
        photo,
      };

      socket.emit('chat message', messagePayload);
      setInput('');
    }
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    try {
      await updateUserData({ anonymousName: newUsername });
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Failed to update username:', error);
      setUsername(username);
    }
  };

  return (
    <div className="group-container">
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
          <button
            className={`back-button ${i18n.language === 'he' ? 'rtl' : 'ltr'}`}
            onClick={() => setCurrentGroup(null)}
          >
            {t('back')}
          </button>
          <div className="external-header">
            <div className="username-header">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
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
          <div className="chat-box" ref={chatBoxRef}>
            {isLoadingMessages ? (
              <div className="loader-container">
                {/* Simple loader example (you can style it in Groups.css) */}
                <div className="loader"></div>
              </div>
            ) : (
              <div className="messages">
                {messages[currentGroup]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.userId === localStorage.getItem('userId') ? 'my-message' : 'other-message'}`}
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
            )}
          </div>

          <div className="message-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('type_message')}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
              disabled={isLoadingMessages || isSending}
            />
            <button className="send-button" onClick={sendMessage} disabled={isLoadingMessages || isSending}>
              {isSending ? (
                <div className="loader-button"></div>
              ) : (
                t('send')
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Groups;

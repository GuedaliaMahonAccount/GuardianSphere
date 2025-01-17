import React, { useEffect, useRef, useState } from 'react';
import './Groups.css';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { fetchGroupMessages, updateUserData, reportMessageRequest } from './GroupsReq';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const socket = io(`${BASE_URL}`, {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
});

const Groups = () => {
  const { t, i18n } = useTranslation('Groups');
  const navigate = useNavigate();

  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reportPopups, setReportPopups] = useState({});
  const [isBanned, setIsBanned] = useState(false);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Helper function to generate group key
  const getGroupKey = (group) => {
    const language = i18n.language;
    const secter = localStorage.getItem('secter');
    return `${group}_${language}_${secter}`;
  };

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');

    if (savedUserId) {
      setUsername(savedUsername || 'Anonymous');
    } else {
      console.error('No userId found in localStorage. Please log in.');
    }
  }, []);

  useEffect(() => {
    socket.on('user banned', ({ userId }) => {
      setMessages((prevMessages) => {
        const updatedMessages = {};
        for (const [groupKey, groupMessages] of Object.entries(prevMessages)) {
          updatedMessages[groupKey] = groupMessages.filter((msg) => msg.userId !== userId);
        }
        return updatedMessages;
      });
    });
  
    return () => {
      socket.off('user banned');
    };
  }, []);
  

  // Report message functionality
  const reportMessage = async (userId, messageId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    const confirmation = window.confirm(t('confirm_report'));
  
    if (!confirmation) {
      return; // Exit if the user cancels the action
    }
  
    try {
      const data = await reportMessageRequest(userId, token);
      console.log(data.message);
  
      // Show the pop-up for the reported message
      setReportPopups((prevPopups) => ({
        ...prevPopups,
        [messageId]: true,
      }));
  
      // Automatically hide the pop-up after 3 seconds
      setTimeout(() => {
        setReportPopups((prevPopups) => {
          const { [messageId]: _, ...rest } = prevPopups; // Remove specific pop-up
          return rest;
        });
      }, 3000);
    } catch (error) {
      console.error(error.message || 'Failed to report the message. Please try again.');
    }
  };
  
  // Auto-scroll functionality
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/me`, {
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

  // Socket connection management
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => {
        const groupKey = msg.group;
        return {
          ...prevMessages,
          [groupKey]: Array.isArray(prevMessages[groupKey])
            ? [...prevMessages[groupKey], msg]
            : [msg]
        };
      });

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

  // Join/Leave group management
  useEffect(() => {
    if (currentGroup) {
      const userLanguage = i18n.language;
      const userSecter = localStorage.getItem('secter');

      socket.emit('join group', {
        group: currentGroup,
        language: userLanguage,
        secter: userSecter
      });
    }

    return () => {
      if (currentGroup) {
        const userLanguage = i18n.language;
        const userSecter = localStorage.getItem('secter');
        socket.emit('leave group', {
          group: currentGroup,
          language: userLanguage,
          secter: userSecter
        });
      }
    };
  }, [currentGroup, i18n.language]);

  // Load messages for current group
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadMessages = async () => {
      if (currentGroup) {
        try {
          setIsLoadingMessages(true);
          const userLanguage = i18n.language;
          const userSecter = localStorage.getItem('secter');
          const data = await fetchGroupMessages(currentGroup, userLanguage, userSecter);
          const groupKey = getGroupKey(currentGroup);

          setMessages((prevMessages) => ({
            ...prevMessages,
            [groupKey]: data
          }));
        } catch (error) {
          console.error('Failed to load group messages:', error);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup, i18n.language]);


  // Handle photo upload
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

  // Send message functionality
  const sendMessage = () => {
    if (input.trim() && currentGroup) {
      const userId = localStorage.getItem('userId');
      const language = i18n.language;
      const secter = localStorage.getItem('secter');

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
        language,
        secter,
      };

      socket.emit('chat message', messagePayload);
      setInput('');
    }
  };

  // Handle username changes
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


  useEffect(() => {
    // Vérifiez si l'utilisateur est banni au chargement
    const checkBanStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found.');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user data.');
          return;
        }

        const user = await response.json();
        setIsBanned(user.banned || false);
      } catch (error) {
        console.error('Error checking ban status:', error);
      }
    };

    checkBanStatus();
  }, []);

  const requestUnban = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert(t('please_login'));
        return;
      }
  
      const response = await fetch(`${BASE_URL}/api/user/request-unban`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert(t('unban_request_failed'));
        return;
      }
  
      alert(t('unban_request_sent'));
    } catch (error) {
      console.error('Error requesting unban:', error);
      alert(t('unban_request_failed'));
    }
  };
  

  return (
    <div className="group-container">
      <button onClick={() => navigate("/home")} className="home-back-button">
        {t("home")}
      </button>
  
      {isBanned ? (
        <div className="banned-container">
          <h2>{t('banned_message')}</h2>
          <p>{t('banned_explanation')}</p>
          <button onClick={requestUnban} className="request-unban-button">
            {t('request_unban')}
          </button>
        </div>
      ) : (
        <div className="group-header">
          {!currentGroup ? (
            <div className="groups-panel">
              <h2 className="group-title-header">{t('groups_title')}</h2>
              <p>{t('groups_description')}</p>
              {['PTSD', 'burnout', 'depression', 'anxiety', 'sleep_disorder'].map((group) => (
                <div
                  key={group}
                  className="group-title"
                  onClick={() => setCurrentGroup(group)}
                >
                  <h3>{t(`${group}_title`)}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="chat-container">
              <button
                className={`home-back-button ${i18n.language === 'he' ? 'rtl' : 'ltr'}`}
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
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="messages">
                    {messages[getGroupKey(currentGroup)]?.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.userId === localStorage.getItem('userId') ? 'my-message' : 'other-message'}`}
                      >
                        <div className="message-header">
                          {msg.userId !== localStorage.getItem('userId') && (
                            <div className="report-section">
                              <button
                                className="report-button"
                                onClick={() => reportMessage(msg.userId, msg.id)}
                                title={t('report_message_tooltip')}
                              >
                                <FontAwesomeIcon icon={faFlag} />
                              </button>
                              {reportPopups[msg.id] && (
                                <div className="report-popup">
                                  {t('report_acknowledgment')}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="profile">
                            <img src={msg.photo} alt="profile" />
                            <span>{msg.sender}</span>
                          </div>
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
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="message-input"
                  disabled={isLoadingMessages || isSending}
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={isLoadingMessages || isSending}
                >
                  {isSending ? (
                    <div className="loader-button"></div>
                  ) : (
                    t('send')
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Groups;
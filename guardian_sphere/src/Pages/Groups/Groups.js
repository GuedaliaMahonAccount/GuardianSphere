import React, { useEffect, useRef, useState } from 'react';
import './Groups.css';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { fetchGroupMessages, updateUserData } from './GroupsReq';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Peer from 'peerjs';





const socket = io(`${BASE_URL}`, {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
});

const Groups = () => {
    const { t, i18n } = useTranslation('Groups');
    const navigate = useNavigate();

  // const navigate = useNavigate();
  const [messages, setMessages] = useState({
    stress: [],
    depression: [],
    anger: [],
    trauma: [],
    fear: [],
  });
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeCalls, setActiveCalls] = useState([]);
  // const [activeParticipants, setActiveParticipants] = useState([]);

  const [peer, setPeer] = useState(null);
  // const [myStream, setMyStream] = useState(null);


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


  //message section
  //
  //
  const reportMessage = (userId) => {
    console.log(`Sender ID: ${userId}`);
    // Additional logic to handle reporting can be added here
  };
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




  // Call section
  //
  //
  useEffect(() => {
    // Fetch active calls from server
    const fetchActiveCalls = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/calls`);
        if (!response.ok) {
          throw new Error('Failed to fetch active calls.');
        }
        const calls = await response.json();
        setActiveCalls(calls);
      } catch (error) {
        console.error('Error fetching active calls:', error);
      }
    };

    fetchActiveCalls();

    // Listen for updates to the active calls
    socket.on('update calls', (calls) => setActiveCalls(calls));

    // Listen for updates to call participants
    socket.on('update participants', (participants) => {
      // setActiveParticipants(participants);
    });

    return () => {
      socket.off('update calls');
      socket.off('update participants');
    };
  }, []);
  const createNewCall = async () => {
    try {
      // Vérifiez l'accès aux périphériques multimédias avant de créer l'appel
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // setMyStream(stream);

      const response = await fetch(`${BASE_URL}/api/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: username,
          participants: [{ userId: localStorage.getItem('userId'), username, photo }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newCall = await response.json();
      setActiveCalls((prev) => [...prev, newCall]);
      socket.emit('new call', newCall); // Notifie les autres
    } catch (error) {
      if (error.name === 'NotFoundError') {
        alert('No microphone or camera found. Please connect a device and try again.');
      } else {
        console.error('Erreur lors de la création de l\'appel:', error);
      }
    }
  };
  const joinCall = async (callId) => {
    try {
      // Vérifiez l'accès aux périphériques multimédias
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // setMyStream(stream);

      // Affichez la vidéo localement
      const myVideo = document.createElement('video');
      myVideo.srcObject = stream;
      myVideo.muted = true;
      myVideo.play();
      document.getElementById('video-grid').append(myVideo);

      // Initialisez PeerJS et rejoignez l'appel
      if (!peer) {
        const newPeer = new Peer(); // Ou configurez l'ID Peer si nécessaire
        setPeer(newPeer);

        newPeer.on('open', (peerId) => {
          socket.emit('join call', { callId, peerId, userId: localStorage.getItem('userId') });
          console.log(`Joined call with Peer ID: ${peerId}`);
        });

        // Écoutez les connexions entrantes
        newPeer.on('call', (incomingCall) => {
          incomingCall.answer(stream); // Partagez votre flux avec l'autre utilisateur
          incomingCall.on('stream', addVideoStream); // Ajoutez leur flux à l'interface
        });
      }
    } catch (error) {
      if (error.name === 'NotFoundError') {
        alert('Aucun microphone ou caméra trouvés. Veuillez connecter un périphérique et réessayer.');
      } else {
        console.error('Erreur lors de la tentative de rejoindre l\'appel:', error);
      }
    }
  };
  const addVideoStream = (stream) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    document.getElementById('video-grid').append(video);
  };
  const leaveCall = (callId) => {
    const userId = localStorage.getItem('userId');
    socket.emit('leave call', { callId, userId });
  };



  return (
      <div className="group-container">
          <button onClick={() => navigate("/home")} className="home-back-button2">{t("home")}</button>

      <div className="group-header">
        {/* Left Panel: Groups */}
        <div className="groups-panel">
          {!currentGroup ? (
            <>
              <h2 className="group-title-header">{t('groups_title')}</h2>
              <p>{t('groups_description')}</p>
              {['stress', 'depression', 'anger', 'trauma', 'fear'].map((group) => (
                <div
                  key={group}
                  className="group-title"
                  onClick={() => setCurrentGroup(group)}
                >
                  <h3>{t(`${group}_title`)}</h3>
                </div>
              ))}
            </>
          ) : (
            <>
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
                    {messages[currentGroup]?.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.userId === localStorage.getItem('userId') ? 'my-message' : 'other-message'}`}
                      >
                        <div className="message-header">
                          {msg.userId !== localStorage.getItem('userId') && (
                            <button
                              className="report-button"
                              onClick={() => reportMessage(msg.userId)}
                              title={t('report_message_tooltip')}
                            >
                              <FontAwesomeIcon icon={faFlag} />
                            </button>
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
            </>
          )}
        </div>

        {/* Right Panel: Active Calls */}
        <div className="calls-panel">
          <h2 className="calls-header">{t('active_calls')}</h2>
          <button onClick={createNewCall} className="create-call-button">
            {t('create_new_call')}
          </button>
          <div className="active-calls-list">
            {activeCalls.length > 0 ? (
              activeCalls.map((call) => (
                <div key={call.id} className="call-item">
                  <p>{`${t('participants_count')}: ${call.participants.length}`}</p>
                  <button
                    onClick={() => joinCall(call.id)}
                    className="join-call-button"
                  >
                    {t('join_call')}
                  </button>
                  <button
                    onClick={() => leaveCall(call.id)}
                    className="leave-call-button"
                  >
                    {t('leave_call')}
                  </button>
                </div>
              ))
            ) : (
              <p>{t('no_active_calls')}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );


};

export default Groups;

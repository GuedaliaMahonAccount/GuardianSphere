import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL?.replace(/["']/g, '').trim();

console.log('API URL being used:', apiUrl); // Debug log


const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

axios.defaults.withCredentials = true;

export const sendMessageToAI = async (username, chatId, message) => {
  // try {
  //   const response = await axios.post(
  //     `${apiUrl}/chat`,
  //     { username, chatId, message },
  //     {
  //       headers: getAuthHeaders(),
  //       withCredentials: true
  //     }
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error:", error);
  //   throw error;
  // }
};

export const getChatHistory = async (username) => {
  if (!apiUrl) {
    console.error('API URL is not defined');
    return [];
  }

  try {
    const url = `${apiUrl}/history/${username}`;
    console.log('Making request to:', url); // Debug log
    
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data.history;
  } catch (error) {
    console.error("Error while fetching chat history:", error);
    console.error("Request URL:", `${apiUrl}/history/${username}`); // Debug log
    return [];
  }
};

export const addNewChat = async (username, title) => {
  try {
    const response = await axios.post(
      `${apiUrl}/new-chat`,
      { username, title },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data.chat;
  } catch (error) {
    console.error("Error while creating new chat:", error);
    return null;
  }
};

export const deleteChat = async (username, chatId) => {
  try {
    await axios.delete(
      `${apiUrl}/delete-chat`,
      {
        headers: getAuthHeaders(),
        data: { username, chatId },
      }
    );
  } catch (error) {
    console.error("Error while deleting chat:", error);
  }
};

export const updateChatTitle = async (username, chatId, newTitle) => {
  try {
    await axios.put(
      `${apiUrl}/update-chat-title`,
      { username, chatId, newTitle },
      {
        headers: getAuthHeaders()
      }
    );
  } catch (error) {
    console.error("Error while updating chat title:", error);
  }
};

export const updateChatFeedback = async (username, chatId, feedback) => {
  try {
    await axios.put(
      `${apiUrl}/update-feedback`,
      { username, chatId, feedback },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error("Error while updating feedback:", error);
    throw error;
  }
};

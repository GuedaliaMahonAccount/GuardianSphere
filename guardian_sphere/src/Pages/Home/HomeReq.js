import axios from 'axios';

const apiUrl = process.env.API_URL || "http://127.0.0.1:5001";

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure token is valid
});

axios.defaults.withCredentials = true; // Enable sending credentials

export const sendMessageToAI = async (username, chatId, message) => {
  try {
    const response = await axios.post(
      `${apiUrl}/chat`,
      { username, chatId, message },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getChatHistory = async (username) => {
  try {
    const response = await axios.get(
      `${apiUrl}/history/${username}`,
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    );
    return response.data.history;
  } catch (error) {
    console.error("Error while fetching chat history:", error);
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

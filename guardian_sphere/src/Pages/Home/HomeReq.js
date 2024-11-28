import axios from 'axios';

const API_URL = "http://127.0.0.1:5001";

export const sendMessageToAI = async (username, chatId, message) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      { username, chatId, message },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while communicating with AI:", error);
    throw error;
  }
};

export const getChatHistory = async (username) => {
  try {
    const response = await axios.get(
      `${API_URL}/history/${username}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
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
      `${API_URL}/new-chat`,
      { username, title },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data.chat;
  } catch (error) {
    console.error("Error while creating new chat:", error.response?.data || error.message);
    return null;
  }
};

export const deleteChat = async (username, chatId) => {
  try {
    await axios.delete(
      `${API_URL}/delete-chat`,
      {
        headers: { "Content-Type": "application/json" },
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
      `${API_URL}/update-chat-title`,
      { username, chatId, newTitle },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error while updating chat title:", error);
  }
};
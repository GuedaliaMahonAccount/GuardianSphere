import axios from 'axios';

const apiUrl =  process.env.API_URL;

export const sendMessageToAI = async (username, chatId, message) => {
  // try {
  //   const response = await axios.post(
  //     `${API_URL}/chat`,
  //     { username, chatId, message },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       withCredentials: true
  //     }
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error while communicating with AI:", error);
  //   throw error;
  // }
};

export const getChatHistory = async (username) => {
  try {
    const response = await axios.get(
      `${apiUrl}/history/${username}`,
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
      `${apiUrl}/new-chat`,
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
      `${apiUrl}/delete-chat`,
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
      `${apiUrl}/update-chat-title`,
      { username, chatId, newTitle },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error while updating chat title:", error);
  }
};
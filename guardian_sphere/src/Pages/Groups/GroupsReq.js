import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/messages';

// Fetch group messages
export const fetchGroupMessages = async (group) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${group}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response || error);
    throw error;
  }
};

// Send a message
export const sendMessageToGroup = async (group, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, { group, ...message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

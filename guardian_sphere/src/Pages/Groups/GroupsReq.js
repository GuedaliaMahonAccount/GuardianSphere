import axios from 'axios';
import { BASE_URL } from '../../config';



export const fetchGroupMessages = async (group, language, secter) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/messages/${group}?language=${language}&secter=${secter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching group messages:', error.message);
    throw error;
  }
};

export const updateUserData = async (userData) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token
    const response = await axios.put(`${BASE_URL}/api/user/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token directly in headers
        'Content-Type': 'application/json', // Specify the content type
      },
    });
    return response.data; // Return the updated user data
  } catch (error) {
    console.error('Error updating user data:', error.message); // Log the error

    // Handle specific status codes, e.g., unauthorized access
    if (error.response?.status === 401) {
      console.error('Unauthorized: Please log in again.');
    }

    throw error; // Rethrow the error for further handling
  }
};

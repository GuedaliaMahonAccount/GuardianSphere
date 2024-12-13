import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_ORIGIN;

export const fetchGroupMessages = async (group) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token
    const response = await axios.get(`${BASE_URL}/api/messages/${group}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token directly in headers
      },
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching group messages:', error.message); // Log the error
    throw error; // Rethrow the error for further handling
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

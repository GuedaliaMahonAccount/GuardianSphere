import axios from 'axios';

export const fetchGroupMessages = async (group) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5001/api/messages/${group}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
};

export const updateUserData = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/user/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

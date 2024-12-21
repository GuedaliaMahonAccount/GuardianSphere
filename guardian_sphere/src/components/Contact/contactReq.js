import axios from 'axios';
import { BASE_URL } from '../../config';

// Increment 'contacted' for the user
export const incrementContacted = async () => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user/increment-contacted`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    console.log('Contacted incremented successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error incrementing contacted:', error.message);
    throw error;
  }
};

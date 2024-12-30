import axios from 'axios';
import { BASE_URL } from '../../config';

// Increment 'contacted' for the user
export const incrementContacted = async () => {
  try {
    console.log('Token for points increment:', localStorage.getItem('token'));
    const response = await axios.put(`${BASE_URL}/api/user/increment-points`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    console.log('Points increment response:', response);
    return response.data;
  } catch (error) {
    console.error('Points increment error:', error.response || error);
    throw error;
  }
};
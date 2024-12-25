import { BASE_URL } from '../../config';


export const getPointsOfMe = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await fetch(`${BASE_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json(); // Assurez-vous de bien parser la réponse en JSON
      console.log('Score updated successfully:', data);
      return data; // Assurez-vous que `data` contient le champ `points`
    } catch (error) {
      console.error('Error in get score:', error.message);
      throw error;
    }
  };
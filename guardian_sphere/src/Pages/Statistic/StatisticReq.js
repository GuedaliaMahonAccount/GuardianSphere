// services/statisticReq.js
import axios from "axios";
import { BASE_URL } from "../../config";

// Fonction pour récupérer les statistiques des utilisateurs
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/all-users`);
    return response.data; // Retourne les données des utilisateurs
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error; // Relance l'erreur pour gestion future
  }
};

import axios from 'axios';
import { BASE_URL } from '../../config';


// Get treatments by username
export const getByUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/follow?username=${username}`);
    console.log("GET Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching treatments:", error.message);
    throw error;
  }
};

// Create a new treatment
export const createTreatment = async (username, treatment) => {
  const data = {
    username,
    treatementData: treatment,
  };

  console.log("Creating treatment with data:", data);

  try {
    const response = await axios.post(`${BASE_URL}/api/follow`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Treatment created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating treatment:", error.message);
    throw error;
  }
};

// Update a treatment (e.g., editing treatment name/description)
export const updateTreatment = async (id, updatedData) => {
  console.log("Updating treatment with ID:", id, "Data:", updatedData);

  try {
    const response = await axios.put(`${BASE_URL}/api/follow/${id}`, updatedData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Treatment updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating treatment:", error.message);
    throw error;
  }
};

// Toggle a checkbox (mark a date as done/undone)
export const toggleCheck = async (treatmentId, date) => {
  const data = { date };

  console.log(`Toggling checkbox for Treatment ID: ${treatmentId}, Date: ${date}`);

  try {
    const response = await axios.put(`${BASE_URL}/api/follow/${treatmentId}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Checkbox toggled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error toggling checkbox:", error.message);
    throw error;
  }
};

// Delete a treatment
export const deleteTreatment = async (treatmentId) => {
  console.log("Deleting treatment with ID:", treatmentId);

  try {
    const response = await axios.delete(`${BASE_URL}/api/follow/${treatmentId}`);
    console.log("Treatment deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting treatment:", error.message);
    throw error;
  }
};

// Increment user points
export const incrementUserPoints = async () => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user/increment-points`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("User points incremented successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error incrementing user points:", error.message);
    throw error;
  }
};
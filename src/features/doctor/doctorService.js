import axios from 'axios'; 

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE}/api/doctor`;

export const getDoctor = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    const data = response.data;

    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error("Unexpected response format.");
    }

    return data.data; // return the array of doctors
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch doctors.";
    throw new Error(message);
  }
};
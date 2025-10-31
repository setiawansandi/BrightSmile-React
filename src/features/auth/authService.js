import axios from 'axios'; 

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE}/api/auth`;

// --- Register Logic ---
export const register = async (userData) => {
  console.log('AuthService: Attempting registration...');
  
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    if (response.data && response.data.data) {
      const { user, token } = response.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return user;
    } else {
      throw new Error('Invalid response format from server.');
    }

  } catch (error) {
    const message = error.response?.data?.error || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

// --- Login Logic ---
export const login = async (email, password) => {
  console.log('AuthService: Attempting login...');
  
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data && response.data.data) {
      const { user, token } = response.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return user;
    } else {
      throw new Error('Invalid response format from server.');
    }

  } catch (error) {
    const message = error.response?.data?.error || 'Login failed. Please try again.';
    throw new Error(message);
  }
};

// --- Logout Logic ---
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

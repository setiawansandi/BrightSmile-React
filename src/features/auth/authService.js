import axios from 'axios';

// Set your API base URL
const API_URL = 'http://your-backend-api.com/api';

/**
 * Sends a login request to the API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} The user data from the API
 */
export const login = async (email, password) => {
  console.log('AuthService.login called');
  // When API is ready, uncomment this:
  /*
  const response = await axios.post(`${API_URL}/login.php`, { email, password });
  
  if (response.data.success) {
    return response.data.user; // or response.data.token
  } else {
    throw new Error(response.data.error || 'Login failed');
  }
  */

  // --- Mock logic for now ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'Password123!') {
        resolve({ id: 1, email: 'test@test.com', name: 'Test User' });
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000);
  });
};

/**
 * Sends a registration request to the API
 * @param {object} userData - e.g., { firstName, lastName, email, ... }
 * @returns {Promise<object>} The new user data
 */
export const register = async (userData) => {
  console.log('AuthService.register called with:', userData);
  // When API is ready, uncomment this:
  /*
  const response = await axios.post(`${API_URL}/register.php`, userData);

  if (response.data.success) {
    return response.data.user;
  } else {
    throw new Error(response.data.error || 'Registration failed');
  }
  */

  // --- Mock logic for now ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 2, ...userData });
    }, 1000);
  });
};
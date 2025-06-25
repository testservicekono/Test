// src/api/axiosInstance.ts
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in environment variables.');
  // Handle this error appropriately, e.g., throw an error, show a user message.
  // For now, we'll just throw.
  throw new Error('VITE_API_BASE_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    console.log('Attaching token:', token); // ✅ Add this line for debug

    if (token) {
      config.headers['x-auth-token'] = token; // Attach as 'x-auth-token' header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

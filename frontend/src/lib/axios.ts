import axios from 'axios';

// Assuming backend runs on 5000 and frontend on 3000
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // If we're using cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token if it exists in local storage
api.interceptors.request.use(
  (config) => {
    // Note: We use Zustand store to manage token later, but localstorage is accessible here in browser
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch (e) {
          console.error('Error parsing auth storage', e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds (increased from 10s for better reliability)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HttpOnly cookies
});

// Request interceptor - attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap backend response format: {success, message, data}
    if (response.data && response.data.success && response.data.data !== undefined) {
      // Return unwrapped data so callers can use response.data directly
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - redirect to unauthorized page
          console.error('Access forbidden:', response.data?.message);
          break;
        case 404:
          console.error('Resource not found:', response.data?.message);
          break;
        case 500:
          console.error('Server error:', response.data?.message);
          break;
        default:
          console.error('API error:', response.data?.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

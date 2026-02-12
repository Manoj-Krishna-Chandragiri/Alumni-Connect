import axiosInstance from './axiosInstance';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login/', credentials);
    return response;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register/', userData);
    return response;
  },

  logout: async () => {
    return { success: true };
  },

  refreshToken: async () => {
    return axiosInstance.post('/auth/refresh/');
  },

  forgotPassword: async (email) => {
    return axiosInstance.post('/auth/forgot-password/', { email });
  },

  resetPassword: async (token, password) => {
    return axiosInstance.post('/auth/reset-password/', { token, password });
  },

  verifyEmail: async (token) => {
    return axiosInstance.post('/auth/verify-email/', { token });
  },

  getProfile: async () => {
    return axiosInstance.get('/auth/me/');
  },
};

export default authApi;

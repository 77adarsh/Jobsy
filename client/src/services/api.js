import axios from 'axios';

// Use environment variable or fallback to local proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  getProfile: () => api.get('/auth/me'),
};

// User service
export const userService = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.post('/users/change-password', passwordData),
};

export default api;
// src/services/authService.js
import api from './api';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        role: data.role
      }));

      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Credenciales inválidas');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        return { ...user, token };
      } catch {
        return null;
      }
    }

    return null;
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token'),

  isAdmin: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    try {
      const user = JSON.parse(userStr);
      return user.role === 'ADMIN';
    } catch {
      return false;
    }
  }
};

export default authService;
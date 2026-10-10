// src/services/userService.js
import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8081/users';

const userService = {
  getAllUsers: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  createUser: async (user) => {
    const response = await api.post(API_URL, user);
    return response.data;
  },
  
  updateUser: async (id, user) => {
    const response = await api.put(`${API_URL}/${id}`, user);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default userService;
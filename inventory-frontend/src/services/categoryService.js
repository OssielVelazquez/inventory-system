// src/services/categoryService.js
import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8081/categories'; // Sin /api/

const categoryService = {
  getAllCategories: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },
  
  getCategoryById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  createCategory: async (category) => {
    const response = await api.post(API_URL, category);
    return response.data;
  },
  
  updateCategory: async (id, category) => {
    const response = await api.put(`${API_URL}/${id}`, category);
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default categoryService;
// src/services/productService.js
import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8081/products'; // Sin /api/

const productService = {
  getAllProducts: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  createProduct: async (product) => {
    const response = await api.post(API_URL, product);
    return response.data;
  },
  
  updateProduct: async (id, product) => {
    const response = await api.put(`${API_URL}/${id}`, product);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default productService;
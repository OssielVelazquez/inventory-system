// src/services/stockService.js
import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8081/stock'; // Sin /api/

const stockService = {
  getAllStock: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },
  
  getStockById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  // IMPORTANTE: Tu backend no tiene este endpoint
  // Si lo necesitas, debes agregarlo al StockController
  getStockByProductId: async (productId) => {
    try {
      const allStock = await api.get(API_URL);
      return allStock.data.find(item => item.productId === productId);
    } catch (error) {
      return null;
    }
  },
  
  createStock: async (stock) => {
    const response = await api.post(API_URL, stock);
    return response.data;
  },
  
  updateStock: async (id, stock) => {
    const response = await api.put(`${API_URL}/${id}`, stock);
    return response.data;
  },
  
  deleteStock: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default stockService;
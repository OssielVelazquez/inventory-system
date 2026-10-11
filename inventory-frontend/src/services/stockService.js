// src/services/stockService.js
import api from './api';

const stockService = {
  getAllStock: async () => {
    const response = await api.get('/stock');
    return response.data;
  },

  getStockById: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },

  createStock: async (stock) => {
    const response = await api.post('/stock', stock);
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await api.put(`/stock/${id}`, stock);
    return response.data;
  },

  deleteStock: async (id) => {
    const response = await api.delete(`/stock/${id}`);
    return response.data;
  }
};

export default stockService;
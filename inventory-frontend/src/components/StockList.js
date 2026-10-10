// src/components/StockList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StockList = () => {
  const [stockItems, setStockItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: ''
  });

  // Obtener usuario y sus permisos
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';
  const isManager = user.role === 'MANAGER';
  const canEdit = isAdmin || isManager;  // ADMIN y MANAGER pueden editar/crear
  const canDelete = isAdmin;  // Solo ADMIN puede eliminar

  // Cargar stock
  const loadStock = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:8081/stock');
      setStockItems(response.data);
    } catch (error) {
      alert('Error al cargar stock');
    } finally {
      setLoading(false);
    }
  };


// Cargar productos
const loadProducts = async () => {
  try {
    const response = await api.get('http://localhost:8081/products');
    setProducts(response.data);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Error al cargar productos');
  }
};

  useEffect(() => {
    loadStock();
    loadProducts();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Crear o actualizar stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert('No tienes permisos para gestionar stock');
      return;
    }
    try {
      const stockData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity)
      };

      if (editingStock) {
        await api.put(`http://localhost:8081/stock/${editingStock.id}`, stockData);
        alert('✅ Stock actualizado exitosamente');
      } else {
        await api.post('http://localhost:8081/stock', stockData);
        alert('✅ Stock registrado exitosamente');
      }
      
      resetForm();
      loadStock();
    } catch (error) {
      alert('❌ Error al guardar stock');
    }
  };

  // Editar stock
  const handleEdit = (stock) => {
    if (!canEdit) {
      alert('No tienes permisos para editar stock');
      return;
    }
    setEditingStock(stock);
    setFormData({
      productId: stock.productId ? stock.productId.toString() : '',
      quantity: stock.quantity ? stock.quantity.toString() : ''
    });
    setShowForm(true);
  };

  // Eliminar stock
  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar registros de stock');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar este registro de stock?')) {
      try {
        await api.delete(`http://localhost:8081/stock/${id}`);
        alert('✅ Stock eliminado exitosamente');
        loadStock();
      } catch (error) {
        alert('❌ Error al eliminar stock');
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: ''
    });
    setEditingStock(null);
    setShowForm(false);
  };

  // Obtener nombre del producto
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Producto ID: ${productId}`;
  };

  // Determinar estado del stock
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 5) return 'low-stock';
    return 'in-stock';
  };

  // Texto del estado
  const getStatusText = (quantity) => {
    if (quantity === 0) return 'Sin Stock';
    if (quantity <= 5) return 'Stock Bajo';
    return 'Disponible';
  };

  // Calcular estadísticas
  const getStats = () => {
    const totalItems = stockItems.length;
    const lowStock = stockItems.filter(item => item.quantity <= 5 && item.quantity > 0).length;
    const outOfStock = stockItems.filter(item => item.quantity === 0).length;
    
    return { totalItems, lowStock, outOfStock };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="page">
        <h1>Gestión de Stock</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Stock</h1>
          <p className="page-subtitle">
            Control de inventario y niveles de stock
          </p>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`toggle-form-btn ${showForm ? 'secondary' : 'primary'}`}
          >
            {showForm ? '← Volver a la lista' : '+ Nuevo Registro'}
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-container" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>Productos en Stock</h3>
          <p className="stat-number">{stats.totalItems}</p>
          <p className="stat-desc">Registros totales</p>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <h3>Stock Bajo</h3>
          <p className="stat-number">{stats.lowStock}</p>
          <p className="stat-desc">≤ 5 unidades</p>
        </div>
        
        <div className="stat-card danger">
          <div className="stat-icon">🚨</div>
          <h3>Sin Stock</h3>
          <p className="stat-number">{stats.outOfStock}</p>
          <p className="stat-desc">0 unidades</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && canEdit && (
        <div className="form-card">
          <h2>{editingStock ? '✏️ Ajustar Stock' : '➕ Nuevo Registro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Producto *</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
                disabled={!!editingStock}
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (ID: {product.id})
                  </option>
                ))}
              </select>
              {editingStock && (
                <small className="form-hint">
                  No se puede cambiar el producto al editar
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                required
                min="0"
              />
              <small className="form-hint">
                Cantidad disponible en inventario
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingStock ? 'Actualizar Stock' : 'Registrar Stock'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de stock */}
      {!showForm && (
        <>
          {stockItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No hay registros de stock</h3>
              <p>Registra el stock de tus productos para comenzar</p>
              {canEdit && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="primary-btn"
                >
                  Registrar Primer Stock
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map(item => {
                    const status = getStockStatus(item.quantity);
                    const statusText = getStatusText(item.quantity);
                    
                    return (
                      <tr key={item.id} className={`stock-row ${status}`}>
                        <td className="id-cell">{item.id}</td>
                        <td className="name-cell">
                          <strong>{getProductName(item.productId)}</strong>
                          <div className="product-id">ID: {item.productId}</div>
                        </td>
                        <td className={`quantity-cell ${status}`}>
                          <span className="quantity-number">{item.quantity}</span>
                          {status === 'low-stock' && (
                            <div className="stock-warning">⚠️ Bajo stock</div>
                          )}
                          {status === 'out-of-stock' && (
                            <div className="stock-danger">🚨 Sin stock</div>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${status}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            {canEdit && (
                              <button 
                                onClick={() => handleEdit(item)}
                                className="edit-btn"
                                title="Ajustar stock"
                              >
                                ✏️ Ajustar
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="delete-btn"
                                title="Eliminar registro"
                              >
                                🗑️ Eliminar
                              </button>
                            )}
                            {!canEdit && (
                              <span className="muted">Solo lectura</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="table-footer">
                <div>
                  <p>Mostrando {stockItems.length} registros</p>
                  <div className="legend">
                    <span className="legend-item in-stock">● Disponible</span>
                    <span className="legend-item low-stock">● Stock Bajo</span>
                    <span className="legend-item out-of-stock">● Sin Stock</span>
                  </div>
                </div>
                <button onClick={loadStock} className="refresh-btn">
                  🔄 Actualizar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockList;
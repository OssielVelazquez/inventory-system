// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: null,
    totalCategories: null,
    totalStock: null,
    totalStockUnits: null,
    lowStockItems: null,
    totalUsers: null
  });
  const [loading, setLoading] = useState(true);

  // Obtener usuario actual y su rol
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';
  const isManager = user.role === 'MANAGER';

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      const promises = [api.get('/products'), api.get('/categories'), api.get('/stock')];

      // Solo ADMIN puede ver usuarios
      if (isAdmin) {
        promises.push(api.get('/users'));
      }

      const results = await Promise.all(promises);

      const products = results[0].data;
      const categories = results[1].data;
      const stock = results[2].data;

      const lowStock = stock.filter(item => item.quantity <= 5 && item.quantity > 0).length;
      const totalStockUnits = stock.reduce((sum, item) => sum + item.quantity, 0);

      const newStats = {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalStock: stock.length,
        totalStockUnits: totalStockUnits,
        lowStockItems: lowStock,
        totalUsers: null
      };

      // Solo ADMIN tiene total de usuarios
      if (isAdmin && results[3]) {
        newStats.totalUsers = results[3].data.length;
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        totalStock: 0,
        totalStockUnits: 0,
        lowStockItems: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard del Inventario</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const displayValue = (value) => {
    return value === null ? '...' : value;
  };

  return (
    <div className="dashboard">
      <h1>Dashboard del Inventario</h1>
      <p className="subtitle">Sistema de gestión de productos, categorías y stock</p>

      <div className="stats-container">
        {/* Tarjeta de Productos - visible para todos */}
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>Productos</h3>
          <p className="stat-number">{displayValue(stats.totalProducts)}</p>
          <p className="stat-desc">Productos registrados</p>
          <Link to="/products" className="stat-link">Ver todos →</Link>
        </div>

        {/* Tarjeta de Categorías - visible para todos */}
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <h3>Categorías</h3>
          <p className="stat-number">{displayValue(stats.totalCategories)}</p>
          <p className="stat-desc">Categorías creadas</p>
          <Link to="/categories" className="stat-link">Ver todas →</Link>
        </div>

        {/* Tarjeta de Stock - visible para todos */}
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Registros Stock</h3>
          <p className="stat-number">{displayValue(stats.totalStock)}</p>
          <p className="stat-desc">Registros en inventario</p>
          <Link to="/stock" className="stat-link">Controlar →</Link>
        </div>

        {/* Tarjeta de Usuarios - SOLO PARA ADMIN */}
        {isAdmin && (
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>Usuarios</h3>
            <p className="stat-number">{displayValue(stats.totalUsers)}</p>
            <p className="stat-desc">Usuarios registrados</p>
            <Link to="/users" className="stat-link">Ver todos →</Link>
          </div>
        )}

        {/* Tarjeta de Stock Bajo - visible para todos */}
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <h3>Stock Bajo</h3>
          <p className="stat-number">{displayValue(stats.lowStockItems)}</p>
          <p className="stat-desc">Productos con ≤5 unidades</p>
          <Link to="/stock" className="stat-link">Revisar →</Link>
        </div>

        {/* Tarjeta de Unidades Totales - visible para todos */}
        <div className="stat-card info">
          <div className="stat-icon">📦</div>
          <h3>Unidades Total</h3>
          <p className="stat-number">{displayValue(stats.totalStockUnits)}</p>
          <p className="stat-desc">Unidades en inventario</p>
        </div>
      </div>

      {/* Acciones Rápidas - según rol */}
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          {(isAdmin || isManager) && (
            <Link to="/products" className="action-btn primary">
              + Agregar Producto
            </Link>
          )}
          {(isAdmin || isManager) && (
            <Link to="/categories" className="action-btn secondary">
              + Agregar Categoría
            </Link>
          )}
          {(isAdmin || isManager) && (
            <Link to="/stock" className="action-btn tertiary">
              ✏️ Ajustar Stock
            </Link>
          )}
          {isAdmin && (
            <Link to="/users" className="action-btn" style={{ background: '#9f7aea', color: 'white' }}>
              + Agregar Usuario
            </Link>
          )}
          {!isAdmin && !isManager && (
            <p className="muted" style={{ padding: '1rem' }}>
              💡 Los usuarios de solo lectura no pueden modificar datos. Contacta a un administrador para más permisos.
            </p>
          )}
        </div>
      </div>

      <div className="system-info">
        <h3>Estado del Sistema</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Backend:</span>
            <span className="info-value status-success">● Activo (puerto 8081)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Frontend:</span>
            <span className="info-value status-success">● Activo (puerto 3000)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tu Rol:</span>
            <span className="info-value">{user.role || 'USER'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
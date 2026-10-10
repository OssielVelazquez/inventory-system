// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">Inventory System</span>
        </div>
        
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">🏠</span>
            Dashboard
          </Link>
          <Link to="/products" className="nav-link">
            <span className="nav-icon">📦</span>
            Productos
          </Link>
          <Link to="/categories" className="nav-link">
            <span className="nav-icon">🏷️</span>
            Categorías
          </Link>
          <Link to="/stock" className="nav-link">
            <span className="nav-icon">📊</span>
            Stock
          </Link>
          
          {isAdmin && (
            <Link to="/users" className="nav-link">
              <span className="nav-icon">👥</span>
              Usuarios
            </Link>
          )}
        </div>
        
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{currentUser?.username}</span>
            <span className="user-role">{currentUser?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
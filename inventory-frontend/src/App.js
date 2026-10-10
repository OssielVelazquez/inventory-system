// src/App.js - Versión corregida
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import StockList from './components/StockList';
import UserList from './components/UserList';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Componente para verificar autenticación en ruta raíz
const RootRedirect = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/products" element={
          <PrivateRoute>
            <MainLayout>
              <ProductList />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/categories" element={
          <PrivateRoute>
            <MainLayout>
              <CategoryList />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/stock" element={
          <PrivateRoute>
            <MainLayout>
              <StockList />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/users" element={
          <PrivateRoute adminOnly>
            <MainLayout>
              <UserList />
            </MainLayout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

// Componente de layout principal
const MainLayout = ({ children }) => {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        {children}
      </div>
      <footer className="footer">
        <p>Sistema de Inventario v1.0 • Backend: Spring Boot (8081) • Frontend: React (3000)</p>
      </footer>
    </div>
  );
};

export default App;
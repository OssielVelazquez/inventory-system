// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">
          <h1>🔐 Sistema de Inventario</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#4299e1', textDecoration: 'none' }}>
              Regístrate aquí
            </Link>
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#718096' }}>
            Credenciales de prueba: <strong>admin / admin123</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
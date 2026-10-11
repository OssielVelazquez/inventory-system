// src/components/Register.js - CON CAMPO DE EMAIL
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const cleanUsername = formData.username.trim();
    const cleanEmail = formData.email.trim();
    
    if (!cleanUsername) {
      setError('El nombre de usuario es requerido');
      return;
    }
    
    if (cleanUsername.includes(' ')) {
      setError('El nombre de usuario no puede contener espacios');
      return;
    }
    
    if (cleanUsername.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }
    
    if (!cleanEmail) {
      setError('El correo electrónico es requerido');
      return;
    }
    
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    
    if (formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
       await api.post('/api/auth/register', {
         username: cleanUsername,
         email: cleanEmail,
         password: formData.password
        });
      
      setSuccess('✅ Usuario registrado exitosamente. Redirigiendo al login...');
      
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrar usuario. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📝 Crear Cuenta</h1>
          <p>Regístrate para acceder al sistema de inventario</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert" style={{ background: '#c6f6d5', color: '#22543d', border: '1px solid #9ae6b4' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ej: juanperez (sin espacios)"
              required
              disabled={loading}
              autoComplete="off"
            />
            <small className="form-hint">Sin espacios, mínimo 3 caracteres</small>
          </div>

          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan@example.com"
              required
              disabled={loading}
              autoComplete="off"
            />
            <small className="form-hint">Ingresa un correo válido</small>
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 4 caracteres"
              required
              disabled={loading}
            />
            <small className="form-hint">Mínimo 4 caracteres</small>
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
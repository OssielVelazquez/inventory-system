// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    enabled: true
  });

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        enabled: formData.enabled === true || formData.enabled === 'true'
      };

      // Solo enviar password si el usuario escribió uno
      // El backend se encarga de encriptarla
      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, userData);
        alert('✅ Usuario actualizado exitosamente');
      } else {
        await api.post('/users', userData);
        alert('✅ Usuario creado exitosamente');
      }

      resetForm();
      loadUsers();
    } catch (error) {
      alert('❌ Error al guardar usuario. Verifica los datos.');
    }
  };

  // Editar usuario
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '', // No mostrar contraseña por seguridad
      role: user.role || 'USER',
      enabled: user.enabled === true || user.enabled === 'true'
    });
    setShowForm(true);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        alert('✅ Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        alert('❌ Error al eliminar usuario');
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      enabled: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Gestión de Usuarios</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="page-subtitle">
            {users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`toggle-form-btn ${showForm ? 'secondary' : 'primary'}`}
        >
          {showForm ? '← Volver a la lista' : '+ Nuevo Usuario'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-card">
          <h2>{editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de Usuario *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Ej: jperez"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contraseña {!editingUser && '*'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingUser ? "Dejar vacío para no cambiar" : "Ingresa contraseña"}
                  required={!editingUser}
                />
                {editingUser && (
                  <small className="form-hint">
                    Solo llena si quieres cambiar la contraseña
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Rol *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="MANAGER">Gerente</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleInputChange}
                />
                <span style={{ marginLeft: '8px' }}>Usuario activo</span>
              </label>
              <small className="form-hint">
                Usuarios inactivos no pueden iniciar sesión
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de usuarios */}
      {!showForm && (
        <>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No hay usuarios registrados</h3>
              <p>Crea el primer usuario del sistema</p>
              <button
                onClick={() => setShowForm(true)}
                className="primary-btn"
              >
                Crear Primer Usuario
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="id-cell">{user.id}</td>
                      <td className="name-cell">
                        <strong>{user.username}</strong>
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                          {user.enabled ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(user)}
                            className="edit-btn"
                            title="Editar usuario"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="delete-btn"
                            title="Eliminar usuario"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
               </table>

              <div className="table-footer">
                <p>Mostrando {users.length} usuarios</p>
                <button onClick={loadUsers} className="refresh-btn">
                  🔄 Actualizar lista
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
// src/components/CategoryList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: ''
  });

  // Obtener usuario y sus permisos
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';
  const isManager = user.role === 'MANAGER';
  const canEdit = isAdmin || isManager;  // ADMIN y MANAGER pueden editar/crear
  const canDelete = isAdmin;  // Solo ADMIN puede eliminar

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:8081/categories');
      setCategories(response.data);
    } catch (error) {
      alert('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      name: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert('No tienes permisos para crear/editar categorías');
      return;
    }
    try {
      if (editingCategory) {
        await api.put(`http://localhost:8081/categories/${editingCategory.id}`, formData);
        alert('✅ Categoría actualizada exitosamente');
      } else {
        await api.post('http://localhost:8081/categories', formData);
        alert('✅ Categoría creada exitosamente');
      }
      
      resetForm();
      loadCategories();
    } catch (error) {
      alert('❌ Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    if (!canEdit) {
      alert('No tienes permisos para editar categorías');
      return;
    }
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar categorías');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`http://localhost:8081/categories/${id}`);
        alert('✅ Categoría eliminada exitosamente');
        loadCategories();
      } catch (error) {
        alert('❌ Error al eliminar categoría');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Gestión de Categorías</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Categorías</h1>
          <p className="page-subtitle">
            {categories.length} {categories.length === 1 ? 'categoría registrada' : 'categorías registradas'}
          </p>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`toggle-form-btn ${showForm ? 'secondary' : 'primary'}`}
          >
            {showForm ? '← Volver a la lista' : '+ Nueva Categoría'}
          </button>
        )}
      </div>

      {showForm && canEdit && (
        <div className="form-card">
          <h2>{editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre de la Categoría *</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Electrónicos, Ropa, Hogar..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <>
          {categories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>No hay categorías registradas</h3>
              <p>Crea tu primera categoría para organizar tus productos</p>
              {canEdit && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="primary-btn"
                >
                  Crear Primera Categoría
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td className="id-cell">{category.id}</td>
                      <td className="name-cell">
                        <strong>{category.name}</strong>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          {canEdit && (
                            <button 
                              onClick={() => handleEdit(category)}
                              className="edit-btn"
                            >
                              ✏️ Editar
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              onClick={() => handleDelete(category.id)}
                              className="delete-btn"
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
                  ))}
                </tbody>
              </table>
              
              <div className="table-footer">
                <p>Mostrando {categories.length} categorías</p>
                <button onClick={loadCategories} className="refresh-btn">
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

export default CategoryList;
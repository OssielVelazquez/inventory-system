// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: ''
  });

  // Obtener usuario y sus permisos
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';
  const isManager = user.role === 'MANAGER';
  const canEdit = isAdmin || isManager;  // ADMIN y MANAGER pueden editar/crear
  const canDelete = isAdmin;  // Solo ADMIN puede eliminar

  // Cargar productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('http://localhost:8081/products');
      setProducts(response.data);
    } catch (error) {
      setError('Error al cargar productos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };

      if (editingProduct) {
        await api.put(`http://localhost:8081/products/${editingProduct.id}`, productData);
        alert('✅ Producto actualizado exitosamente');
      } else {
        await api.post('http://localhost:8081/products', productData);
        alert('✅ Producto creado exitosamente');
      }
      
      resetForm();
      loadProducts();
    } catch (error) {
      alert('❌ Error al guardar producto. Verifica los datos.');
    }
  };

  // Editar producto
  const handleEdit = (product) => {
    if (!canEdit) {
      alert('No tienes permisos para editar productos');
      return;
    }
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      category_id: product.category_id ? product.category_id.toString() : ''
    });
    setShowForm(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar productos');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`http://localhost:8081/products/${id}`);
        alert('✅ Producto eliminado exitosamente');
        loadProducts();
      } catch (error) {
        alert('❌ Error al eliminar producto');
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Gestión de Productos</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Gestión de Productos</h1>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={loadProducts} className="retry-btn">
            Reintentar
          </button>
          <p className="backend-hint">
            Asegúrate de que el backend esté corriendo en: 
            <a href="http://localhost:8081/products" target="_blank" rel="noreferrer">
              http://localhost:8081/products
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Productos</h1>
          <p className="page-subtitle">
            {products.length} {products.length === 1 ? 'producto registrado' : 'productos registrados'}
          </p>
        </div>
        {/* Mostrar botón "Nuevo Producto" solo si puede editar */}
        {canEdit && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`toggle-form-btn ${showForm ? 'secondary' : 'primary'}`}
          >
            {showForm ? '← Volver a la lista' : '+ Nuevo Producto'}
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && canEdit && (
        <div className="form-card">
          <h2>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Laptop Dell XPS 13"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el producto..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>ID de Categoría *</label>
                <input
                  type="number"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  placeholder="1, 2, 3..."
                  required
                  min="1"
                />
                <small className="form-hint">
                  Debe existir en la base de datos
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de productos */}
      {!showForm && (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No hay productos registrados</h3>
              <p>Crea tu primer producto haciendo clic en "Nuevo Producto"</p>
              {canEdit && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="primary-btn"
                >
                  Crear Primer Producto
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
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Categoría ID</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="id-cell">{product.id}</td>
                      <td className="name-cell">
                        <strong>{product.name}</strong>
                      </td>
                      <td className="desc-cell">
                        {product.description || <span className="muted">Sin descripción</span>}
                      </td>
                      <td className="price-cell">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="category-cell">
                        <span className="badge">{product.category_id}</span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          {canEdit && (
                            <button 
                              onClick={() => handleEdit(product)}
                              className="edit-btn"
                              title="Editar producto"
                            >
                              ✏️ Editar
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="delete-btn"
                              title="Eliminar producto"
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
                <p>Mostrando {products.length} productos</p>
                <button onClick={loadProducts} className="refresh-btn">
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

export default ProductList;
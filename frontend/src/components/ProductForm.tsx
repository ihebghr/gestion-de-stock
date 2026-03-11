import React, { useState } from 'react';
import { productsAPI } from '../services/api';

interface ProductFormProps {
  onProductAdded?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category: 'outils',
    description: '',
    quantity: 0,
    minQuantity: 5,
    price: 0,
    supplier: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'outils', label: 'Outils' },
    { value: 'quincaillerie', label: 'Quincaillerie' },
    { value: 'matériaux', label: 'Matériaux' },
    { value: 'électricité', label: 'Électricité' },
    { value: 'plomberie', label: 'Plomberie' },
    { value: 'jardinage', label: 'Jardinage' },
    { value: 'sécurité', label: 'Sécurité' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minQuantity' || name === 'price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await productsAPI.create(formData);
      setFormData({
        name: '',
        reference: '',
        category: 'outils',
        description: '',
        quantity: 0,
        minQuantity: 5,
        price: 0,
        supplier: '',
        location: ''
      });
      onProductAdded?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Ajouter un Produit</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Référence *
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="REF-001"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Marteau de charpentier"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Fournisseur
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="form-input"
              placeholder="Nom du fournisseur"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-textarea"
            placeholder="Description du produit..."
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Quantité *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Stock minimum *
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Prix (TND) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Emplacement
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="Allée A, Rayon 1"
          />
        </div>

        <div className="flex flex-between">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-large"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

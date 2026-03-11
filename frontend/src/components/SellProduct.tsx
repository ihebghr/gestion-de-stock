import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productsAPI, transactionsAPI } from '../services/api';

const SellProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.filter((p: Product) => p.quantity > 0));
    } catch (err) {
      setError('Erreur lors du chargement des produits');
    }
  };

  const selectedProductData = products.find(p => p._id === selectedProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await transactionsAPI.create({
        productId: selectedProduct,
        type: 'sale',
        quantity,
        customerName,
        notes
      });
      
      setSuccess('Vente enregistrée avec succès!');
      setSelectedProduct('');
      setQuantity(1);
      setCustomerName('');
      setNotes('');
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la vente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Vendre un Produit</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div style={{padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', color: '#059669'}}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Produit *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Sélectionner un produit</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} (Stock: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Quantité *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              required
              min="1"
              max={selectedProductData?.quantity || 1}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Nom du client
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input"
              placeholder="Nom du client (optionnel)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Total
            </label>
            <input
              type="text"
              value={selectedProductData ? `${(selectedProductData.price * quantity).toFixed(2)} TND` : '0.00 TND'}
              readOnly
              className="form-input"
              style={{backgroundColor: '#f9fafb', fontWeight: 'bold'}}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Notes sur la vente (optionnel)"
          />
        </div>

        {selectedProductData && (
          <div style={{padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '16px'}}>
            <h4 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>Détails du produit:</h4>
            <p style={{margin: '4px 0', fontSize: '13px', color: '#6b7280'}}>
              Référence: {selectedProductData.reference}
            </p>
            <p style={{margin: '4px 0', fontSize: '13px', color: '#6b7280'}}>
              Prix unitaire: {selectedProductData.price.toFixed(2)} TND
            </p>
            <p style={{margin: '4px 0', fontSize: '13px', color: '#6b7280'}}>
              Stock disponible: {selectedProductData.quantity}
            </p>
          </div>
        )}

        <div className="flex flex-between">
          <button
            type="submit"
            disabled={loading || !selectedProduct}
            className="btn-primary btn-large"
          >
            {loading ? 'Vente en cours...' : 'Confirmer la vente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellProduct;

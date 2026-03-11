import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product';
import { productsAPI } from '../services/api';
import EditProduct from './EditProduct';
import * as XLSX from 'xlsx';

interface ProductListProps {
  refreshTrigger?: number;
}

const ProductList: React.FC<ProductListProps> = ({ refreshTrigger }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { text: 'Rupture', class: 'status-out' };
    if (product.quantity <= product.minQuantity) return { text: 'Stock faible', class: 'status-low' };
    return { text: 'Disponible', class: 'status-available' };
  };

  const downloadExcel = () => {
    const excelData = products.map(product => ({
      'Référence': product.reference,
      'Nom': product.name,
      'Catégorie': product.category,
      'Quantité': product.quantity,
      'Stock Minimum': product.minQuantity,
      'Prix (TND)': product.price.toFixed(2),
      'Valeur Totale (TND)': (product.price * product.quantity).toFixed(2),
      'Fournisseur': product.supplier || '-',
      'Emplacement': product.location || '-',
      'Statut': getStockStatus(product).text,
      'Description': product.description || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Liste des Produits');
    
    const fileName = `liste_produits_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (editingProduct) {
    return (
      <EditProduct
        productId={editingProduct}
        onProductUpdated={handleProductUpdated}
        onCancel={() => setEditingProduct(null)}
      />
    );
  }

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="card">
      <h2>Liste des Produits</h2>
      
      {/* Filters */}
      <div className="card" style={{marginBottom: '16px', padding: '16px'}}>
        <h3 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600'}}>Filtrer les produits</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="form-label">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher par nom, référence..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Catégorie</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{minWidth: '200px'}}
            >
              <option value="">Toutes les catégories</option>
              <option value="outils">Outils</option>
              <option value="quincaillerie">Quincaillerie</option>
              <option value="matériaux">Matériaux</option>
              <option value="électricité">Électricité</option>
              <option value="plomberie">Plomberie</option>
              <option value="jardinage">Jardinage</option>
              <option value="sécurité">Sécurité</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="btn-danger btn-small"
          >
            Réinitialiser les filtres
          </button>
          <button
            onClick={downloadExcel}
            className="btn-primary btn-small"
          >
            📊 Télécharger Excel
          </button>
          <div style={{fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
            {products.length} produit(s) trouvé(s)
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div style={{overflowX: 'auto'}}>
        <table className="table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th className="text-center">Quantité</th>
              <th className="text-center">Stock Min</th>
              <th className="text-right">Prix (TND)</th>
              <th className="text-center">Statut</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <tr key={product._id}>
                  <td style={{fontWeight: '500'}}>{product.reference}</td>
                  <td>{product.name}</td>
                  <td className="capitalize">{product.category}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-center">{product.minQuantity}</td>
                  <td className="text-right">{product.price.toFixed(2)} TND</td>
                  <td className="text-center">
                    <span className={`status-badge ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="btn-primary btn-small"
                      style={{marginRight: '8px'}}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-danger btn-small"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !loading && (
        <div className="no-data">
          Aucun produit trouvé
        </div>
      )}
    </div>
  );
};

export default ProductList;

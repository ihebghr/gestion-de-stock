import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productsAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, lowStockResponse] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getLowStock()
      ]);
      
      setProducts(productsResponse.data);
      setLowStockProducts(lowStockResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock = lowStockProducts.length;

  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="mb-6">
      <h1>Tableau de Bord</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex-center flex-between">
            <div className="stat-info">
              <h3>Total Produits</h3>
              <p className="stat-value blue">{totalProducts}</p>
            </div>
            <div className="stat-icon blue">
              <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-center flex-between">
            <div className="stat-info">
              <h3>Valeur Totale</h3>
              <p className="stat-value green">{totalValue.toFixed(2)} TND</p>
            </div>
            <div className="stat-icon green">
              <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-center flex-between">
            <div className="stat-info">
              <h3>Rupture de Stock</h3>
              <p className="stat-value red">{outOfStock}</p>
            </div>
            <div className="stat-icon red">
              <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-center flex-between">
            <div className="stat-info">
              <h3>Stock Faible</h3>
              <p className="stat-value yellow">{lowStock}</p>
            </div>
            <div className="stat-icon yellow">
              <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Categories Distribution */}
        <div className="card">
          <h3>Répartition par Catégorie</h3>
          <div className="mb-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex flex-between flex-center">
                <span className="capitalize">{category}</span>
                <div className="flex-center">
                  <div style={{width: '128px', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px', marginRight: '12px'}}>
                    <div 
                      style={{ backgroundColor: '#2563eb', height: '8px', borderRadius: '4px', width: `${(count / totalProducts) * 100}%` }}
                    />
                  </div>
                  <span style={{fontSize: '14px', fontWeight: '500'}}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <h3>Alertes de Stock Faible</h3>
          <div style={{maxHeight: '256px', overflowY: 'auto'}}>
            {lowStockProducts.length === 0 ? (
              <p style={{color: '#6b7280'}}>Aucun produit en stock faible</p>
            ) : (
              lowStockProducts.slice(0, 5).map(product => (
                <div key={product._id} className="flex flex-between flex-center" style={{padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', marginBottom: '8px'}}>
                  <div>
                    <p style={{fontWeight: '500'}}>{product.name}</p>
                    <p style={{fontSize: '14px', color: '#6b7280'}}>{product.reference}</p>
                  </div>
                  <div className="text-right">
                    <p style={{fontSize: '14px', fontWeight: '500', color: '#d97706'}}>
                      {product.quantity} / {product.minQuantity}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {lowStockProducts.length > 5 && (
            <p style={{fontSize: '14px', color: '#6b7280', marginTop: '8px'}}>
              et {lowStockProducts.length - 5} autres produits...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SellProduct from './components/SellProduct';
import SalesHistory from './components/SalesHistory';

type TabType = 'dashboard' | 'products' | 'add-product' | 'sell-product' | 'sales-history';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('products');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList refreshTrigger={refreshTrigger} />;
      case 'add-product':
        return <ProductForm onProductAdded={handleProductAdded} />;
      case 'sell-product':
        return <SellProduct />;
      case 'sales-history':
        return <SalesHistory />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f3f4f6'}}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827'}}>
              Gestion de Stock - Quincaillerie
            </h1>
            <div className="flex flex-center gap-4">
              <span style={{fontSize: '14px', color: '#6b7280'}}>
                Connecté: {user?.username}
              </span>
              <button
                onClick={logout}
                className="btn-danger"
                style={{padding: '6px 12px', fontSize: '12px'}}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : 'inactive'}`}
            >
              Tableau de Bord
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`nav-tab ${activeTab === 'products' ? 'active' : 'inactive'}`}
            >
              Produits
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`nav-tab ${activeTab === 'add-product' ? 'active' : 'inactive'}`}
            >
              Ajouter Produit
            </button>
            <button
              onClick={() => setActiveTab('sell-product')}
              className={`nav-tab ${activeTab === 'sell-product' ? 'active' : 'inactive'}`}
            >
              Vendre Produit
            </button>
            <button
              onClick={() => setActiveTab('sales-history')}
              className={`nav-tab ${activeTab === 'sales-history' ? 'active' : 'inactive'}`}
            >
              Historique des Ventes
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        <div style={{padding: '24px 0'}}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import * as XLSX from 'xlsx';

interface Transaction {
  _id: string;
  product: {
    _id: string;
    name: string;
    reference: string;
  };
  type: 'sale' | 'purchase' | 'adjustment';
  quantity: number;
  price: number;
  totalPrice: number;
  customerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const SalesHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'sale' | 'purchase' | 'adjustment'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = searchTerm === '' || 
      transaction.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customerName && transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'Vente';
      case 'purchase': return 'Achat';
      case 'adjustment': return 'Ajustement';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-600 bg-green-100';
      case 'purchase': return 'text-blue-600 bg-blue-100';
      case 'adjustment': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadExcel = () => {
    const excelData = filteredTransactions.map(transaction => ({
      'Date': formatDate(transaction.createdAt),
      'Type': getTypeLabel(transaction.type),
      'Produit': transaction.product.name,
      'Référence': transaction.product.reference,
      'Client': transaction.customerName || '-',
      'Quantité': transaction.quantity,
      'Prix unitaire (TND)': transaction.price.toFixed(2),
      'Total (TND)': transaction.totalPrice.toFixed(2),
      'Notes': transaction.notes || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historique des Ventes');
    
    const fileName = `historique_ventes_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="card">
      <h2>Historique des Ventes</h2>
      
      {/* Filters */}
      <div className="card" style={{marginBottom: '16px', padding: '16px'}}>
        <h3 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600'}}>Filtrer les transactions</h3>
        <div className="flex gap-4">
          <div>
            <label className="form-label">Type de transaction</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="form-select"
              style={{minWidth: '200px'}}
            >
              <option value="all">Toutes les transactions</option>
              <option value="sale">Ventes uniquement</option>
              <option value="purchase">Achats uniquement</option>
              <option value="adjustment">Ajustements uniquement</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher par produit, client, notes..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
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
            {filteredTransactions.length} transaction(s) trouvée(s)
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
              <th>Date</th>
              <th>Type</th>
              <th>Produit</th>
              <th>Référence</th>
              <th>Client</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>
                  <span className={`status-badge ${getTypeColor(transaction.type)}`}>
                    {getTypeLabel(transaction.type)}
                  </span>
                </td>
                <td>{transaction.product.name}</td>
                <td>{transaction.product.reference}</td>
                <td>{transaction.customerName || '-'}</td>
                <td className="text-center">{transaction.quantity}</td>
                <td className="text-right">{transaction.price.toFixed(2)} TND</td>
                <td className="text-right font-bold">{transaction.totalPrice.toFixed(2)} TND</td>
                <td>{transaction.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && !loading && (
        <div className="no-data">
          Aucune transaction trouvée
        </div>
      )}
    </div>
  );
};

export default SalesHistory;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{maxWidth: '400px', margin: '100px auto'}}>
      <h2>Connexion Administrateur</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
            placeholder="admin"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary btn-large"
          style={{width: '100%'}}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{marginTop: '16px', fontSize: '14px', color: '#6b7280'}}>
        <p>Utilisez le compte administrateur pour accéder au système.</p>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Charger la clé API depuis localStorage ou .env
    const savedApiKey = localStorage.getItem('logoscribe-api-key');
    const envApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else if (envApiKey) {
      setApiKey(envApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('logoscribe-api-key', apiKey.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleClearApiKey = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer la clé API ?')) {
      localStorage.removeItem('logoscribe-api-key');
      setApiKey('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
      localStorage.removeItem('logoscribe-history');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const history = localStorage.getItem('logoscribe-history');
    if (history) {
      const blob = new Blob([history], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `logoscribe-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Paramètres</h1>
        <p>Configurez votre application LogoScribe</p>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2 className="section-title">🔑 Clé API Gemini</h2>
          <p className="section-description">
            Configurez votre clé API Gemini pour utiliser la correction automatique de texte.
            Vous pouvez obtenir une clé API sur{' '}
            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
            .
          </p>
          <div className="api-key-input-group">
            <div className="input-wrapper">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Entrez votre clé API Gemini"
                className="api-key-input"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="toggle-visibility-btn"
                title={showApiKey ? 'Masquer' : 'Afficher'}
              >
                {showApiKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="api-key-actions">
              <button onClick={handleSaveApiKey} className="save-btn">
                💾 Enregistrer
              </button>
              <button onClick={handleClearApiKey} className="clear-btn">
                🗑️ Effacer
              </button>
            </div>
            {saveSuccess && (
              <div className="success-message">
                ✓ Paramètres enregistrés avec succès !
              </div>
            )}
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-title">📚 Données</h2>
          <div className="data-actions">
            <div className="data-action-item">
              <div className="data-action-info">
                <h3>Historique</h3>
                <p>Effacez tout l'historique des transcriptions</p>
              </div>
              <button onClick={handleClearHistory} className="danger-btn">
                🗑️ Effacer l'historique
              </button>
            </div>
            <div className="data-action-item">
              <div className="data-action-info">
                <h3>Export des données</h3>
                <p>Téléchargez une sauvegarde de vos données</p>
              </div>
              <button onClick={handleExportData} className="export-btn">
                💾 Exporter les données
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-title">ℹ️ Informations</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Version</h3>
              <p>1.0.0</p>
            </div>
            <div className="info-item">
              <h3>Modèle IA</h3>
              <p>Gemini 2.5 Flash</p>
            </div>
            <div className="info-item">
              <h3>Serveur</h3>
              <p>logoscribe-backend.onrender.com</p>
            </div>
            <div className="info-item">
              <h3>Technologies</h3>
              <p>React, Socket.io, Gemini AI</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;


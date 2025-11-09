import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Layout.css';

const Layout = ({ children, connected }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/transcription', label: 'Transcription', icon: '🎤' },
    { path: '/historique', label: 'Historique', icon: '📚' },
    { path: '/parametres', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text">LogoScribe</span>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? 'open' : ''}>☰</span>
          </button>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{connected ? 'Connecté' : 'Déconnecté'}</span>
          </div>
        </div>
      </nav>

      <main className="main-content-wrapper">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 LogoScribe - Transcription et correction de texte par IA</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


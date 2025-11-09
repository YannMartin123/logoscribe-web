import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">📝</span>
            Bienvenue sur LogoScribe
          </h1>
          <p className="hero-subtitle">
            Transcription en temps réel et correction automatique de texte par intelligence artificielle
          </p>
          <div className="hero-features">
            <div className="feature-card">
              <span className="feature-icon">🎤</span>
              <h3>Transcription en temps réel</h3>
              <p>Recevez vos transcriptions instantanément via Socket.io</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✨</span>
              <h3>Correction IA</h3>
              <p>Corrigez automatiquement vos textes avec Gemini AI</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h3>Historique</h3>
              <p>Conservez et consultez toutes vos transcriptions</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💾</span>
              <h3>Export multiple</h3>
              <p>Téléchargez vos textes en TXT ou PDF</p>
            </div>
          </div>
          <Link to="/transcription" className="cta-button">
            <span>🚀</span>
            <span>Commencer la transcription</span>
          </Link>
        </div>
      </div>

      <div className="info-section">
        <h2>Comment ça fonctionne ?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connectez-vous</h3>
            <p>Connectez-vous au serveur de transcription via Socket.io</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Recevez le texte</h3>
            <p>Le texte transcrit apparaît en temps réel dans l'interface</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Corrigez avec l'IA</h3>
            <p>Utilisez l'IA pour corriger et améliorer votre texte</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Exportez</h3>
            <p>Téléchargez votre texte en TXT ou PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { GoogleGenAI } from '@google/genai';
import { useTranscription } from '../context/TranscriptionContext';
import { downloadAsTxt, downloadAsPdf, copyToClipboard, shareText } from '../utils/downloadUtils';
import './Transcription.css';

const Transcription = () => {
  const [connected, setConnected] = useState(false);
  const [paragraph, setParagraph] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const scrollRef = useRef(null);
  const correctedScrollRef = useRef(null);
  const { addToHistory } = useTranscription();

  useEffect(() => {
    const socket = io('https://logoscribe-backend.onrender.com', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ Connecté au serveur Socket.io');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Déconnecté du serveur Socket.io');
    });

    socket.on('transcription', (text) => {
      console.log('📥 Texte reçu :', text);
      setParagraph((prev) =>
        prev.length === 0 ? text : prev.trim() + ' ' + text
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [paragraph]);

  useEffect(() => {
    if (correctedScrollRef.current) {
      correctedScrollRef.current.scrollTop = correctedScrollRef.current.scrollHeight;
    }
  }, [correctedText]);

  const handleCorrection = async () => {
    if (!paragraph.trim()) return;

    setLoading(true);
    setCorrectedText('');
    setErrorMsg('');

    try {
      // Récupérer la clé API depuis localStorage ou .env
      const savedApiKey = localStorage.getItem('logoscribe-api-key');
      const envApiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiKey = savedApiKey || envApiKey || 'AIzaSyDDG9XE2UU8dXpciEmsAUbnbNmhVB54Zbg';

      if (!apiKey) {
        throw new Error('Clé API Gemini non configurée');
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      const prompt = `Corrige et améliore le texte suivant en français. Corrige les fautes d'orthographe, de grammaire et de ponctuation. Améliore la clarté et la fluidité si nécessaire, mais garde le sens original. Retourne uniquement le texte corrigé sans commentaires ni explications.\n\nTexte à corriger :\n${paragraph}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let corrected = '';
      if (response.text) {
        corrected = response.text.trim();
      } else if (response.candidates && response.candidates[0] && response.candidates[0].content) {
        corrected = response.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('Format de réponse inattendu de l\'API Gemini');
      }

      if (corrected) {
        setCorrectedText(corrected);
        // Sauvegarder dans l'historique
        addToHistory({
          originalText: paragraph,
          correctedText: corrected,
        });
      } else {
        throw new Error('Aucun texte corrigé reçu de l\'API');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la correction IA :', error);
      let errorMessage = '⚠️ Une erreur est survenue lors de la correction du texte.';

      if (error.message) {
        if (error.message.includes('API key')) {
          errorMessage = '⚠️ Clé API invalide ou manquante. Vérifiez votre configuration.';
        } else if (error.message.includes('NOT_FOUND')) {
          errorMessage = '⚠️ Modèle Gemini non trouvé. Vérifiez le nom du modèle.';
        } else if (error.message.includes('PERMISSION_DENIED')) {
          errorMessage = '⚠️ Permission refusée. Vérifiez les permissions de votre clé API.';
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          errorMessage = '⚠️ Quota API dépassé. Veuillez réessayer plus tard.';
        } else {
          errorMessage = `⚠️ ${error.message}`;
        }
      } else if (error.code) {
        if (error.code === 5) {
          errorMessage = '⚠️ Ressource non trouvée. Vérifiez la configuration de l\'API.';
        } else if (error.code === 7) {
          errorMessage = '⚠️ Permission refusée. Vérifiez les permissions de votre clé API.';
        } else if (error.code === 8) {
          errorMessage = '⚠️ Quota dépassé. Veuillez réessayer plus tard.';
        } else {
          errorMessage = `⚠️ Erreur API (code: ${error.code})`;
        }
      }

      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParagraph('');
    setCorrectedText('');
    setErrorMsg('');
    setCopySuccess(false);
    setDownloadSuccess('');
  };

  const handleCopy = async (text, type) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = (text, format, type) => {
    const filename = `transcription-${new Date().toISOString().split('T')[0]}`;
    if (format === 'txt') {
      downloadAsTxt(text, filename);
    } else if (format === 'pdf') {
      downloadAsPdf(text, filename);
    }
    setDownloadSuccess(`${type}-${format}`);
    setTimeout(() => setDownloadSuccess(''), 2000);
  };

  const handleShare = async (text, type) => {
    const success = await shareText(text, `Transcription ${type}`);
    if (success) {
      setCopySuccess(`share-${type}`);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const textToExport = correctedText || paragraph;

  return (
    <div className="transcription-page">
      <div className="page-header">
        <h1>Transcription en temps réel</h1>
        <p>Recevez et corrigez vos transcriptions instantanément</p>
      </div>

      <section className="transcription-section">
        <div className="section-header">
          <h2 className="section-title">Texte transcrit</h2>
          <div className="section-actions">
            {paragraph && (
              <>
                <button onClick={() => handleCopy(paragraph, 'original')} className="action-btn copy-btn">
                  {copySuccess === 'original' ? '✓ Copié' : '📋 Copier'}
                </button>
                <button onClick={() => handleDownload(paragraph, 'txt', 'original')} className="action-btn download-btn">
                  {downloadSuccess === 'original-txt' ? '✓ Téléchargé' : '📄 TXT'}
                </button>
                <button onClick={() => handleDownload(paragraph, 'pdf', 'original')} className="action-btn download-btn">
                  {downloadSuccess === 'original-pdf' ? '✓ Téléchargé' : '📕 PDF'}
                </button>
                <button onClick={handleClear} className="action-btn clear-btn">
                  🗑️ Effacer
                </button>
              </>
            )}
          </div>
        </div>
        <div ref={scrollRef} className="text-box transcription-box">
          {paragraph ? (
            <p className="text-content">{paragraph}</p>
          ) : (
            <p className="placeholder-text">
              <span className="placeholder-icon">🎤</span>
              En attente de transcription...
            </p>
          )}
        </div>
      </section>

      <div className="action-section">
        <button
          onClick={handleCorrection}
          className={`action-button ${loading ? 'loading' : ''} ${!paragraph.trim() ? 'disabled' : ''}`}
          disabled={loading || !paragraph.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Correction en cours...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Corriger ce texte</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <span>{errorMsg}</span>
            <button
              onClick={handleCorrection}
              className="retry-button"
              disabled={loading || !paragraph.trim()}
            >
              🔄 Réessayer
            </button>
          </div>
        </div>
      )}

      {correctedText && (
        <section className="corrected-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="success-icon">✅</span>
              Texte corrigé
            </h2>
            <div className="section-actions">
              <button onClick={() => handleCopy(correctedText, 'corrected')} className="action-btn copy-btn">
                {copySuccess === 'corrected' ? '✓ Copié' : '📋 Copier'}
              </button>
              <button onClick={() => handleShare(correctedText, 'corrigé')} className="action-btn share-btn">
                {copySuccess === 'share-corrected' ? '✓ Partagé' : '🔗 Partager'}
              </button>
              <button onClick={() => handleDownload(correctedText, 'txt', 'corrected')} className="action-btn download-btn">
                {downloadSuccess === 'corrected-txt' ? '✓ Téléchargé' : '📄 TXT'}
              </button>
              <button onClick={() => handleDownload(correctedText, 'pdf', 'corrected')} className="action-btn download-btn">
                {downloadSuccess === 'corrected-pdf' ? '✓ Téléchargé' : '📕 PDF'}
              </button>
            </div>
          </div>
          <div ref={correctedScrollRef} className="text-box corrected-box">
            <p className="text-content corrected-text">{correctedText}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Transcription;


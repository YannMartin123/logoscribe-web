import { createContext, useContext, useState, useEffect } from 'react';

const TranscriptionContext = createContext();

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error('useTranscription must be used within TranscriptionProvider');
  }
  return context;
};

export const TranscriptionProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentTranscription, setCurrentTranscription] = useState(null);

  // Charger l'historique depuis localStorage au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('logoscribe-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Erreur lors du chargement de l\'historique:', err);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage à chaque modification
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('logoscribe-history', JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = (transcription) => {
    const newItem = {
      id: Date.now(),
      originalText: transcription.originalText,
      correctedText: transcription.correctedText || null,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, 100)); // Garder les 100 derniers
    setCurrentTranscription(newItem);
    return newItem;
  };

  const deleteFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('logoscribe-history');
  };

  const getHistoryItem = (id) => {
    return history.find((item) => item.id === id);
  };

  return (
    <TranscriptionContext.Provider
      value={{
        history,
        currentTranscription,
        addToHistory,
        deleteFromHistory,
        clearHistory,
        getHistoryItem,
        setCurrentTranscription,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};


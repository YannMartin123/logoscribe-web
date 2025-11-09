import { useState } from 'react';
import { useTranscription } from '../context/TranscriptionContext';
import { downloadAsTxt, downloadAsPdf, copyToClipboard } from '../utils/downloadUtils';
import './History.css';

const History = () => {
  const { history, deleteFromHistory, clearHistory, setCurrentTranscription } = useTranscription();
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all'); // all, original, corrected

  const filteredHistory = history.filter((item) => {
    if (filter === 'original') return item.originalText && !item.correctedText;
    if (filter === 'corrected') return item.correctedText;
    return true;
  });

  const handleView = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      deleteFromHistory(id);
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleDownload = (text, format, e) => {
    e.stopPropagation();
    const filename = `transcription-${new Date(selectedItem.timestamp).toISOString().split('T')[0]}`;
    if (format === 'txt') {
      downloadAsTxt(text, filename);
    } else if (format === 'pdf') {
      downloadAsPdf(text, filename);
    }
  };

  const handleCopy = async (text, e) => {
    e.stopPropagation();
    await copyToClipboard(text);
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Historique des transcriptions</h1>
        <p>Consultez et gérez toutes vos transcriptions</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <h2>Aucune transcription enregistrée</h2>
          <p>Vos transcriptions apparaîtront ici une fois que vous aurez corrigé un texte.</p>
        </div>
      ) : (
        <>
          <div className="history-controls">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tous ({history.length})
              </button>
              <button
                className={`filter-btn ${filter === 'original' ? 'active' : ''}`}
                onClick={() => setFilter('original')}
              >
                Originaux ({history.filter((h) => h.originalText && !h.correctedText).length})
              </button>
              <button
                className={`filter-btn ${filter === 'corrected' ? 'active' : ''}`}
                onClick={() => setFilter('corrected')}
              >
                Corrigés ({history.filter((h) => h.correctedText).length})
              </button>
            </div>
            <button onClick={clearHistory} className="clear-all-btn">
              🗑️ Tout effacer
            </button>
          </div>

          <div className="history-content">
            <div className="history-list">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`history-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleView(item)}
                >
                  <div className="history-item-header">
                    <div className="history-item-info">
                      <span className="history-date">{item.date}</span>
                      {item.correctedText && (
                        <span className="history-badge corrected">✅ Corrigé</span>
                      )}
                      {!item.correctedText && (
                        <span className="history-badge original">📝 Original</span>
                      )}
                    </div>
                    <div className="history-item-actions">
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="delete-btn"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="history-item-preview">
                    {item.originalText.substring(0, 150)}
                    {item.originalText.length > 150 && '...'}
                  </div>
                </div>
              ))}
            </div>

            {selectedItem && (
              <div className="history-detail">
                <div className="detail-header">
                  <h3>Détails de la transcription</h3>
                  <button onClick={() => setSelectedItem(null)} className="close-btn">
                    ✕
                  </button>
                </div>

                <div className="detail-content">
                  <div className="detail-section">
                    <div className="detail-section-header">
                      <h4>📝 Texte original</h4>
                      <div className="detail-actions">
                        <button onClick={(e) => handleCopy(selectedItem.originalText, e)} className="action-btn">
                          📋 Copier
                        </button>
                        <button onClick={(e) => handleDownload(selectedItem.originalText, 'txt', e)} className="action-btn">
                          📄 TXT
                        </button>
                        <button onClick={(e) => handleDownload(selectedItem.originalText, 'pdf', e)} className="action-btn">
                          📕 PDF
                        </button>
                      </div>
                    </div>
                    <div className="detail-text-box">
                      <p>{selectedItem.originalText}</p>
                    </div>
                  </div>

                  {selectedItem.correctedText && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <h4>✅ Texte corrigé</h4>
                        <div className="detail-actions">
                          <button onClick={(e) => handleCopy(selectedItem.correctedText, e)} className="action-btn">
                            📋 Copier
                          </button>
                          <button onClick={(e) => handleDownload(selectedItem.correctedText, 'txt', e)} className="action-btn">
                            📄 TXT
                          </button>
                          <button onClick={(e) => handleDownload(selectedItem.correctedText, 'pdf', e)} className="action-btn">
                            📕 PDF
                          </button>
                        </div>
                      </div>
                      <div className="detail-text-box corrected">
                        <p>{selectedItem.correctedText}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    // Connexion au backend Socket.io
    const socket = io('https://logoscribe-backend-production.up.railway.app', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.io');
    });

    socket.on('transcription', (data) => {
      console.log('📝 Nouveau texte:', data);
      setText(data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 LogoScribe Live</h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '90%', marginTop: '1rem' }}>
          {text || "En attente de transcription..."}
        </p>
      </header>
    </div>
  );
}

export default App;

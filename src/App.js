import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranscriptionProvider } from './context/TranscriptionContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Transcription from './pages/Transcription';
import History from './pages/History';
import Settings from './pages/Settings';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);

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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <TranscriptionProvider>
      <Router>
        <Layout connected={connected}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transcription" element={<Transcription />} />
            <Route path="/historique" element={<History />} />
            <Route path="/parametres" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </TranscriptionProvider>
  );
}

export default App;

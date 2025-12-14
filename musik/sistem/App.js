import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MusicPlayer from './pages/MusicPlayer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MusicPlayer />} />
          <Route path="/music" element={<MusicPlayer />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/beranjak-dewasa" element={<MusicPlayer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages';
import Roulette from './pages/roulette';
import Gallery from './pages/roulette/gallery';
import Logs from './pages/roulette/logs';
import Sim from './pages/sim';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/sim" element={<Sim />} />
        <Route path="/roulette" element={<Roulette />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;

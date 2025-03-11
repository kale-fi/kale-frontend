import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Social from './pages/Social';
import Rewards from './pages/Rewards';
import Stats from './pages/Stats';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/social" element={<Social />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </WalletProvider>
  );
};

export default App;

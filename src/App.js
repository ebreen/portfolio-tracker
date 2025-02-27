// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DividendHistory from './components/DividendHistory';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import PortfolioSettings from './components/PortfolioSettings';
import AddDividend from './components/AddDividend';
import AddHolding from './components/AddHolding';
import { PortfolioProvider } from './contexts/PortfolioContext';

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">D</div>
                <span className="text-xl font-semibold">DRIP Portfolio Tracker</span>
              </div>
              <div className="flex space-x-4">
                <Link to="/" className="px-3 py-2 text-gray-700 hover:text-purple-600">Dashboard</Link>
                <Link to="/dividends" className="px-3 py-2 text-gray-700 hover:text-purple-600">Dividend History</Link>
                <Link to="/scenarios" className="px-3 py-2 text-gray-700 hover:text-purple-600">Scenario Analysis</Link>
                <Link to="/settings" className="px-3 py-2 text-gray-700 hover:text-purple-600">Settings</Link>
              </div>
            </div>
          </nav>

          <div className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dividends" element={<DividendHistory />} />
              <Route path="/scenarios" element={<ScenarioAnalysis />} />
              <Route path="/settings" element={<PortfolioSettings />} />
              <Route path="/add-dividend" element={<AddDividend />} />
              <Route path="/add-holding" element={<AddHolding />} />
            </Routes>
          </div>
        </div>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
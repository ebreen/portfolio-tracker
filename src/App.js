// App.js
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DividendHistory from './components/DividendHistory';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import PortfolioSettings from './components/PortfolioSettings';
import AddDividend from './components/AddDividend';
import AddHolding from './components/AddHolding';
import Notification from './components/Notification';
import { PortfolioProvider, PortfolioContext } from './contexts/PortfolioContext';
import DataMigration from './utils/DataMigration';

// AppContent component to access context
const AppContent = () => {
  const { dataManagementState, clearDataManagementMessage } = useContext(PortfolioContext);
  const [migrationMessage, setMigrationMessage] = useState(null);
  
  // Check for and perform data migrations on app initialization
  useEffect(() => {
    if (DataMigration.isMigrationNeeded()) {
      console.log('Data migration needed, performing migration...');
      const result = DataMigration.performSafeMigration();
      
      if (result.success) {
        setMigrationMessage({
          type: 'success',
          text: result.message || 'Data migration completed successfully'
        });
      } else {
        setMigrationMessage({
          type: 'error',
          text: result.message || 'Data migration failed'
        });
      }
      
      // Clear message after 8 seconds
      const timer = setTimeout(() => {
        setMigrationMessage(null);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
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
      
      {/* Global notification area */}
      {(dataManagementState.message || migrationMessage) && (
        <div className="container mx-auto py-2 px-4">
          {dataManagementState.message && dataManagementState.messageType === 'success' && (
            <Notification
              type={dataManagementState.messageType}
              message={dataManagementState.message}
              onDismiss={clearDataManagementMessage}
              duration={5000}
            />
          )}
          
          {migrationMessage && (
            <Notification
              type={migrationMessage.type}
              message={migrationMessage.text}
              onDismiss={() => setMigrationMessage(null)}
              duration={8000}
            />
          )}
        </div>
      )}
      
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
      
      {/* Footer with data storage info */}
      <footer className="bg-white border-t border-gray-200 py-3 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Data stored locally in your browser | {
              dataManagementState.lastBackupDate 
                ? `Last backup: ${new Date(dataManagementState.lastBackupDate).toLocaleDateString()}`
                : 'No backups yet'
            } | <Link to="/settings" className="text-purple-600 hover:underline">Manage data</Link>
          </p>
          <p className="mt-1">
            DRIP Portfolio Tracker v{DataMigration.CURRENT_VERSION}
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}

export default App;
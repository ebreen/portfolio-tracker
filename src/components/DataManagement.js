// components/DataManagement.js
import React, { useContext, useRef, useState, useEffect } from 'react';
import { PortfolioContext } from '../contexts/PortfolioContext';
import Notification from './Notification';

const DataManagement = () => {
  const { 
    holdings,
    dividends,
    exportData,
    importData,
    dataManagementState,
    clearDataManagementMessage
  } = useContext(PortfolioContext);
  
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Clear notification after 5 seconds
  useEffect(() => {
    if (dataManagementState.message) {
      const timer = setTimeout(() => {
        clearDataManagementMessage();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [dataManagementState.message, clearDataManagementMessage]);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file);
    }
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      importData(e.dataTransfer.files[0]);
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
      <h2 className="text-xl font-semibold mb-4">Data Management</h2>
      <p className="text-sm text-gray-600 mb-6">
        Export your portfolio data for backup or import previously exported data.
        Your data is stored locally in your browser.
      </p>
      
      {/* Status message */}
      {dataManagementState.message && (
        <div className="mb-4">
          <Notification
            type={dataManagementState.messageType}
            message={dataManagementState.message}
            onDismiss={clearDataManagementMessage}
            duration={5000}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Export Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download a backup of your portfolio data as a JSON file.
            This file contains all your holdings, dividends, and scenario settings.
          </p>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600">Data Summary:</div>
            <div className="grid grid-cols-2 gap-x-4 mt-1">
              <div>Holdings:</div>
              <div className="font-medium">{holdings.length}</div>
              
              <div>Dividend Records:</div>
              <div className="font-medium">{dividends.length}</div>
              
              <div>Last Backup:</div>
              <div className="font-medium">{formatDate(dataManagementState.lastBackupDate)}</div>
            </div>
          </div>
          
          <button
            onClick={exportData}
            disabled={dataManagementState.isExporting}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {dataManagementState.isExporting ? 'Exporting...' : 'Export Portfolio Data'}
          </button>
        </div>
        
        {/* Import section */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3">Import Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Import portfolio data from a previously exported JSON file.
            This will replace your current data.
          </p>
          
          <div 
            className={`border-2 border-dashed rounded-md p-4 text-center mb-4 ${
              dragActive ? 'border-green-500 bg-green-100' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-sm text-gray-600 mb-2">
              {dragActive 
                ? 'Drop the file here' 
                : 'Drag and drop a JSON file here, or click to select'}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="application/json"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={dataManagementState.isImporting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
            >
              {dataManagementState.isImporting ? 'Importing...' : 'Select File'}
            </button>
          </div>
          
          <div className="bg-yellow-100 p-3 rounded-md text-sm text-yellow-800 border border-yellow-200">
            <strong>Warning:</strong> Importing data will overwrite your current portfolio data.
            Make sure to export your current data as a backup first if needed.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
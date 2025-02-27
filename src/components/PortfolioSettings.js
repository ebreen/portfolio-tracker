// components/PortfolioSettings.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../contexts/PortfolioContext';

const PortfolioSettings = () => {
  const { scenarios, updateScenarios, holdings, updateHolding, deleteHolding } = useContext(PortfolioContext);
  const navigate = useNavigate();
  
  // State for editing scenario settings
  const [scenarioData, setScenarioData] = useState({
    bullish: { ...scenarios.bullish },
    neutral: { ...scenarios.neutral },
    bearish: { ...scenarios.bearish }
  });
  
  // State for editing holdings
  const [editingHolding, setEditingHolding] = useState(null);
  
  // Handle scenario input changes
  const handleScenarioChange = (scenario, field, value) => {
    setScenarioData({
      ...scenarioData,
      [scenario]: {
        ...scenarioData[scenario],
        [field]: parseFloat(value)
      }
    });
  };
  
  // Handle holding updates
  const handleHoldingChange = (e) => {
    const { name, value } = e.target;
    
    setEditingHolding({
      ...editingHolding,
      [name]: name === 'ticker' || name === 'name' ? value : parseFloat(value)
    });
  };
  
  // Save scenario settings
  const saveScenarioSettings = () => {
    updateScenarios(scenarioData);
    alert('Scenario settings updated successfully');
  };
  
  // Edit a holding
  const startEditHolding = (holding) => {
    setEditingHolding({ ...holding });
  };
  
  // Save holding changes
  const saveHoldingChanges = () => {
    if (editingHolding) {
      updateHolding(editingHolding);
      setEditingHolding(null);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingHolding(null);
  };
  
  // Confirm holding deletion
  const confirmDeleteHolding = (holdingId) => {
    if (window.confirm('Are you sure you want to delete this holding? This will also delete all associated dividend records.')) {
      deleteHolding(holdingId);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Portfolio Settings</h1>
      
      {/* Scenario Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
        <h2 className="text-xl font-semibold mb-4">Scenario Settings</h2>
        <p className="text-sm text-gray-600 mb-6">
          Customize the parameters for each scenario to match your investment expectations.
          These settings will affect all projections and calculations throughout the app.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bullish Scenario */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-3">Bullish Scenario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.bullish.monthlyDividend}
                  onChange={(e) => handleScenarioChange('bullish', 'monthlyDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.bullish.annualDividend}
                  onChange={(e) => handleScenarioChange('bullish', 'annualDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yield (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.bullish.yield}
                  onChange={(e) => handleScenarioChange('bullish', 'yield', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share Growth (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.bullish.shareGrowth}
                  onChange={(e) => handleScenarioChange('bullish', 'shareGrowth', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          
          {/* Neutral Scenario */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Neutral Scenario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.neutral.monthlyDividend}
                  onChange={(e) => handleScenarioChange('neutral', 'monthlyDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.neutral.annualDividend}
                  onChange={(e) => handleScenarioChange('neutral', 'annualDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yield (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.neutral.yield}
                  onChange={(e) => handleScenarioChange('neutral', 'yield', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share Growth (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.neutral.shareGrowth}
                  onChange={(e) => handleScenarioChange('neutral', 'shareGrowth', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          
          {/* Bearish Scenario */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">Bearish Scenario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.bearish.monthlyDividend}
                  onChange={(e) => handleScenarioChange('bearish', 'monthlyDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Dividend ($)
                </label>
                <input
                  type="number"
                  value={scenarioData.bearish.annualDividend}
                  onChange={(e) => handleScenarioChange('bearish', 'annualDividend', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yield (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.bearish.yield}
                  onChange={(e) => handleScenarioChange('bearish', 'yield', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share Growth (%)
                </label>
                <input
                  type="number"
                  value={scenarioData.bearish.shareGrowth}
                  onChange={(e) => handleScenarioChange('bearish', 'shareGrowth', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={saveScenarioSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Scenario Settings
          </button>
        </div>
      </div>
      
      {/* Manage Holdings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Holdings</h2>
        <p className="text-sm text-gray-600 mb-6">
          Update your current holdings' information or add new investments to track.
        </p>
        
        {/* Current Holdings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Ticker</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Initial Investment</th>
                <th className="p-2 text-left">Current Share Price</th>
                <th className="p-2 text-left">Shares</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(holding => (
                <tr key={holding.id} className="border-t border-gray-100">
                  <td className="p-2">{holding.ticker}</td>
                  <td className="p-2">{holding.name}</td>
                  <td className="p-2">${holding.initialInvestment.toFixed(2)}</td>
                  <td className="p-2">${holding.currentSharePrice.toFixed(2)}</td>
                  <td className="p-2">{holding.shares.toFixed(2)}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => startEditHolding(holding)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteHolding(holding.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {holdings.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No holdings yet. Add one to get started.
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate('/add-holding')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add New Holding
          </button>
        </div>
      </div>
      
      {/* Edit Holding Modal */}
      {editingHolding && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Holding</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  name="ticker"
                  value={editingHolding.ticker}
                  onChange={handleHoldingChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingHolding.name}
                  onChange={handleHoldingChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Share Price ($)
                </label>
                <input
                  type="number"
                  name="currentSharePrice"
                  value={editingHolding.currentSharePrice}
                  onChange={handleHoldingChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shares
                </label>
                <input
                  type="number"
                  name="shares"
                  value={editingHolding.shares}
                  onChange={handleHoldingChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveHoldingChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSettings;
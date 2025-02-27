// components/AddHolding.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../contexts/PortfolioContext';

const AddHolding = () => {
  const { addHolding } = useContext(PortfolioContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    ticker: '',
    name: '',
    initialInvestment: '',
    initialSharePrice: '',
    currentSharePrice: '',
    shares: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, validate and convert to numbers
    if (['initialInvestment', 'initialSharePrice', 'currentSharePrice', 'shares'].includes(name)) {
      // Allow empty string or numeric values
      if (value === '' || !isNaN(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const calculateShares = () => {
    if (formData.initialInvestment && formData.initialSharePrice) {
      const shares = parseFloat(formData.initialInvestment) / parseFloat(formData.initialSharePrice);
      setFormData({
        ...formData,
        shares: shares.toFixed(2)
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.ticker) newErrors.ticker = 'Ticker is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.initialInvestment) newErrors.initialInvestment = 'Initial investment is required';
    if (!formData.initialSharePrice) newErrors.initialSharePrice = 'Initial share price is required';
    if (!formData.currentSharePrice) newErrors.currentSharePrice = 'Current share price is required';
    if (!formData.shares) newErrors.shares = 'Number of shares is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const newHolding = {
        ticker: formData.ticker,
        name: formData.name,
        initialInvestment: parseFloat(formData.initialInvestment),
        initialSharePrice: parseFloat(formData.initialSharePrice),
        currentSharePrice: parseFloat(formData.currentSharePrice),
        shares: parseFloat(formData.shares),
        purchaseDate: formData.purchaseDate
      };
      
      addHolding(newHolding);
      navigate('/');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Holding</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticker Symbol*
              </label>
              <input
                type="text"
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.ticker ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. MSTY"
              />
              {errors.ticker && (
                <p className="mt-1 text-sm text-red-600">{errors.ticker}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. MSTY DRIP ETF"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Investment ($)*
              </label>
              <input
                type="number"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleChange}
                onBlur={calculateShares}
                className={`w-full p-2 border rounded-md ${errors.initialInvestment ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 30000"
                min="0"
                step="0.01"
              />
              {errors.initialInvestment && (
                <p className="mt-1 text-sm text-red-600">{errors.initialInvestment}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Share Price ($)*
              </label>
              <input
                type="number"
                name="initialSharePrice"
                value={formData.initialSharePrice}
                onChange={handleChange}
                onBlur={calculateShares}
                className={`w-full p-2 border rounded-md ${errors.initialSharePrice ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 21.00"
                min="0"
                step="0.01"
              />
              {errors.initialSharePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.initialSharePrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Share Price ($)*
              </label>
              <input
                type="number"
                name="currentSharePrice"
                value={formData.currentSharePrice}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.currentSharePrice ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 21.00"
                min="0"
                step="0.01"
              />
              {errors.currentSharePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.currentSharePrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Shares*
              </label>
              <input
                type="number"
                name="shares"
                value={formData.shares}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.shares ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 1428.57"
                min="0"
                step="0.01"
              />
              {errors.shares && (
                <p className="mt-1 text-sm text-red-600">{errors.shares}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Holding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHolding;
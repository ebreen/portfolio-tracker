// components/AddDividend.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../contexts/PortfolioContext';

const AddDividend = () => {
  const { holdings, addDividend } = useContext(PortfolioContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    holdingId: '',
    date: new Date().toISOString().split('T')[0],
    exDate: '',
    recordDate: '',
    declarationDate: '',
    amount: '',
    reinvested: true,
    sharePrice: ''
  });
  
  const [errors, setErrors] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({
    totalAmount: 0,
    newShares: 0
  });
  
  // When holding changes, update related fields
  useEffect(() => {
    if (formData.holdingId) {
      const selectedHolding = holdings.find(h => h.id === parseInt(formData.holdingId));
      if (selectedHolding) {
        // Pre-fill current share price
        setFormData(prev => ({
          ...prev,
          sharePrice: selectedHolding.currentSharePrice.toString()
        }));
        
        // Calculate total amount if amount is entered
        if (formData.amount) {
          calculateTotalAndShares(formData.amount, selectedHolding.shares, formData.sharePrice);
        }
      }
    }
  }, [formData.holdingId, holdings]);
  
  // Calculate total and new shares when values change
  useEffect(() => {
    if (formData.holdingId && formData.amount) {
      const selectedHolding = holdings.find(h => h.id === parseInt(formData.holdingId));
      if (selectedHolding) {
        calculateTotalAndShares(formData.amount, selectedHolding.shares, formData.sharePrice);
      }
    }
  }, [formData.amount, formData.sharePrice, formData.reinvested]);
  
  const calculateTotalAndShares = (amount, shares, sharePrice) => {
    const amountValue = parseFloat(amount);
    const sharesValue = parseFloat(shares);
    const sharePriceValue = parseFloat(sharePrice);
    
    if (!isNaN(amountValue) && !isNaN(sharesValue)) {
      const totalAmount = amountValue * sharesValue;
      
      let newShares = 0;
      if (formData.reinvested && !isNaN(sharePriceValue) && sharePriceValue > 0) {
        newShares = totalAmount / sharePriceValue;
      }
      
      setCalculatedValues({
        totalAmount,
        newShares
      });
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (['amount', 'sharePrice'].includes(name)) {
      // For numeric fields, validate and convert to numbers
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
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.holdingId) newErrors.holdingId = 'Holding is required';
    if (!formData.date) newErrors.date = 'Pay date is required';
    if (!formData.amount) newErrors.amount = 'Dividend amount is required';
    if (formData.reinvested && !formData.sharePrice) newErrors.sharePrice = 'Share price is required for reinvestment';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Get selected holding for share count
      const selectedHolding = holdings.find(h => h.id === parseInt(formData.holdingId));
      
      if (selectedHolding) {
        const newDividend = {
          holdingId: parseInt(formData.holdingId),
          date: formData.date,
          exDate: formData.exDate || formData.date,
          recordDate: formData.recordDate || formData.date,
          declarationDate: formData.declarationDate || '',
          amount: parseFloat(formData.amount),
          sharesOwned: selectedHolding.shares,
          totalReceived: calculatedValues.totalAmount,
          reinvested: formData.reinvested,
          sharePrice: parseFloat(formData.sharePrice || 0),
          newShares: formData.reinvested ? calculatedValues.newShares : 0
        };
        
        addDividend(newDividend);
        navigate('/dividends');
      }
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Record New Dividend</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holding*
              </label>
              <select
                name="holdingId"
                value={formData.holdingId}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.holdingId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a holding</option>
                {holdings.map(holding => (
                  <option key={holding.id} value={holding.id}>
                    {holding.ticker} - {holding.name}
                  </option>
                ))}
              </select>
              {errors.holdingId && (
                <p className="mt-1 text-sm text-red-600">{errors.holdingId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Date*
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ex-Dividend Date
              </label>
              <input
                type="date"
                name="exDate"
                value={formData.exDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Record Date
              </label>
              <input
                type="date"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Declaration Date
              </label>
              <input
                type="date"
                name="declarationDate"
                value={formData.declarationDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dividend Amount Per Share ($)*
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 2.02"
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reinvested"
                  name="reinvested"
                  checked={formData.reinvested}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="reinvested" className="ml-2 block text-sm text-gray-700">
                  Reinvest this dividend (DRIP)
                </label>
              </div>
            </div>
            
            {formData.reinvested && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reinvestment Share Price ($)*
                </label>
                <input
                  type="number"
                  name="sharePrice"
                  value={formData.sharePrice}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.sharePrice ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. 21.35"
                  min="0"
                  step="0.01"
                />
                {errors.sharePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.sharePrice}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Dividend summary */}
          {formData.holdingId && formData.amount && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-md font-medium text-blue-800 mb-2">Dividend Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Shares Owned:</div>
                <div className="font-medium">
                  {holdings.find(h => h.id === parseInt(formData.holdingId))?.shares.toFixed(2) || '0.00'}
                </div>
                
                <div className="text-gray-600">Dividend Per Share:</div>
                <div className="font-medium">${parseFloat(formData.amount || 0).toFixed(2)}</div>
                
                <div className="text-gray-600">Total Dividend Payment:</div>
                <div className="font-medium">${calculatedValues.totalAmount.toFixed(2)}</div>
                
                {formData.reinvested && (
                  <>
                    <div className="text-gray-600">Reinvestment Share Price:</div>
                    <div className="font-medium">${parseFloat(formData.sharePrice || 0).toFixed(2)}</div>
                    
                    <div className="text-gray-600">New Shares Purchased:</div>
                    <div className="font-medium">{calculatedValues.newShares.toFixed(2)}</div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dividends')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Record Dividend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDividend;
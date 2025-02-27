// contexts/PortfolioContext.js
import React, { createContext, useState, useEffect } from 'react';

// Initial sample data
const initialHoldings = [
  {
    id: 1,
    ticker: "MSTY",
    name: "MSTY DRIP ETF",
    initialInvestment: 30000,
    initialSharePrice: 21,
    currentSharePrice: 21,
    shares: 1428.57,
    totalDividends: 0,
    color: '#8884d8'
  }
];

const initialDividends = [
  {
    id: 1,
    holdingId: 1,
    date: '2025-02-14',
    exDate: '2025-02-13',
    recordDate: '2025-02-13',
    declarationDate: '2024-12-24',
    amount: 2.02,
    sharesOwned: 1428.57,
    totalReceived: 2885.71,
    reinvested: true,
    sharePrice: 21.35,
    newShares: 135.16
  }
];

const initialScenarios = {
  bullish: {
    monthlyDividend: 3.50,
    annualDividend: 42.00,
    yield: 16.7,
    shareGrowth: 8.0,
    year5Value: 114027,
    year10Value: 432680
  },
  neutral: {
    monthlyDividend: 2.25,
    annualDividend: 27.00,
    yield: 10.7,
    shareGrowth: 5.0,
    year5Value: 70586,
    year10Value: 163595
  },
  bearish: {
    monthlyDividend: 1.25,
    annualDividend: 15.00,
    yield: 5.9,
    shareGrowth: 2.0,
    year5Value: 44962,
    year10Value: 67362
  }
};

// Create the context
export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  // Initialize state with local storage if available or use defaults
  const [holdings, setHoldings] = useState(() => {
    const savedHoldings = localStorage.getItem('holdings');
    return savedHoldings ? JSON.parse(savedHoldings) : initialHoldings;
  });
  
  const [dividends, setDividends] = useState(() => {
    const savedDividends = localStorage.getItem('dividends');
    return savedDividends ? JSON.parse(savedDividends) : initialDividends;
  });
  
  const [scenarios, setScenarios] = useState(() => {
    const savedScenarios = localStorage.getItem('scenarios');
    return savedScenarios ? JSON.parse(savedScenarios) : initialScenarios;
  });
  
  const [currentScenario, setCurrentScenario] = useState(() => {
    const savedScenario = localStorage.getItem('currentScenario');
    return savedScenario || 'neutral';
  });

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('holdings', JSON.stringify(holdings));
  }, [holdings]);
  
  useEffect(() => {
    localStorage.setItem('dividends', JSON.stringify(dividends));
  }, [dividends]);
  
  useEffect(() => {
    localStorage.setItem('scenarios', JSON.stringify(scenarios));
  }, [scenarios]);
  
  useEffect(() => {
    localStorage.setItem('currentScenario', currentScenario);
  }, [currentScenario]);

  // Calculate portfolio summary data
  const getPortfolioSummary = () => {
    return holdings.map(holding => {
      const holdingDividends = dividends.filter(d => d.holdingId === holding.id);
      const totalDividends = holdingDividends.reduce((sum, div) => sum + div.totalReceived, 0);
      const currentValue = holding.shares * holding.currentSharePrice;
      const growth = currentValue - holding.initialInvestment;
      const growthPercentage = (growth / holding.initialInvestment) * 100;
      
      return {
        ...holding,
        totalDividends,
        currentValue,
        growth,
        growthPercentage
      };
    });
  };

  // Calculate upcoming dividends based on dividend history patterns
  const getUpcomingDividends = () => {
    const upcoming = [];
    const today = new Date();
    
    holdings.forEach(holding => {
      const holdingDividends = dividends.filter(d => d.holdingId === holding.id);
      
      if (holdingDividends.length > 0) {
        // Sort dividends by date
        const sortedDividends = [...holdingDividends].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        // Get the latest dividend
        const latestDividend = sortedDividends[0];
        
        // Calculate next dividend date (assume monthly for simplicity)
        const lastDividendDate = new Date(latestDividend.date);
        const nextDividendDate = new Date(lastDividendDate);
        nextDividendDate.setMonth(lastDividendDate.getMonth() + 1);
        
        // Only include if it's a future date
        if (nextDividendDate > today) {
          // Calculate average of last 3 dividends if available
          const lastThreeDividends = sortedDividends.slice(0, 3);
          const avgAmount = lastThreeDividends.reduce((sum, div) => 
            sum + div.amount, 0) / lastThreeDividends.length;
          
          upcoming.push({
            holdingId: holding.id,
            ticker: holding.ticker,
            exDate: nextDividendDate.toISOString().split('T')[0],
            amount: avgAmount.toFixed(2),
            estTotal: (avgAmount * holding.shares).toFixed(2),
            payDate: new Date(nextDividendDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        }
      }
    });
    
    return upcoming;
  };

  // Function to add a new holding
  const addHolding = (newHolding) => {
    const holdingWithId = {
      ...newHolding,
      id: holdings.length > 0 ? Math.max(...holdings.map(h => h.id)) + 1 : 1,
      color: generateRandomColor()
    };
    setHoldings([...holdings, holdingWithId]);
  };

  // Function to update a holding
  const updateHolding = (updatedHolding) => {
    setHoldings(holdings.map(holding => 
      holding.id === updatedHolding.id ? updatedHolding : holding
    ));
  };

  // Function to delete a holding
  const deleteHolding = (holdingId) => {
    setHoldings(holdings.filter(holding => holding.id !== holdingId));
    // Also delete associated dividends
    setDividends(dividends.filter(dividend => dividend.holdingId !== holdingId));
  };

  // Function to add a new dividend
  const addDividend = (newDividend) => {
    const dividendWithId = {
      ...newDividend,
      id: dividends.length > 0 ? Math.max(...dividends.map(d => d.id)) + 1 : 1
    };
    
    // Update holding shares if dividend was reinvested
    if (newDividend.reinvested) {
      const targetHolding = holdings.find(h => h.id === newDividend.holdingId);
      if (targetHolding) {
        const updatedHolding = {
          ...targetHolding,
          shares: targetHolding.shares + newDividend.newShares
        };
        updateHolding(updatedHolding);
      }
    }
    
    setDividends([...dividends, dividendWithId]);
  };

  // Function to update scenario settings
  const updateScenarios = (updatedScenarios) => {
    setScenarios(updatedScenarios);
  };

  // Generate a random color for chart display
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate projection data for a specific scenario
  const generateProjection = (scenario, years = 10) => {
    const projectionData = [];
    const portfolioSummary = getPortfolioSummary();
    
    // For each holding, calculate projection
    portfolioSummary.forEach(holding => {
      const yearlyData = [];
      
      // Current values (Year 0)
      let currentShares = holding.shares;
      let sharePrice = holding.currentSharePrice;
      let totalValue = currentShares * sharePrice;
      let annualDividend = scenarios[scenario].annualDividend;
      let dividendIncome = (annualDividend / 100) * totalValue;
      
      yearlyData.push({
        year: 0,
        ticker: holding.ticker,
        shares: currentShares,
        sharePrice: sharePrice,
        dividendIncome: dividendIncome,
        totalValue: totalValue
      });
      
      // Project for each year
      for (let year = 1; year <= years; year++) {
        // Apply share price growth
        sharePrice = sharePrice * (1 + scenarios[scenario].shareGrowth / 100);
        
        // Calculate dividend and reinvest
        dividendIncome = (annualDividend / 100) * totalValue;
        const newShares = dividendIncome / sharePrice;
        currentShares += newShares;
        
        // Calculate new total value
        totalValue = currentShares * sharePrice;
        
        yearlyData.push({
          year,
          ticker: holding.ticker,
          shares: currentShares,
          sharePrice: sharePrice,
          dividendIncome: dividendIncome,
          totalValue: totalValue
        });
      }
      
      projectionData.push({
        holdingId: holding.id,
        ticker: holding.ticker,
        projectionData: yearlyData
      });
    });
    
    return projectionData;
  };

  // Create a value object with all our state and functions
  const value = {
    holdings,
    dividends,
    scenarios,
    currentScenario,
    setCurrentScenario,
    getPortfolioSummary,
    getUpcomingDividends,
    addHolding,
    updateHolding,
    deleteHolding,
    addDividend,
    updateScenarios,
    generateProjection
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
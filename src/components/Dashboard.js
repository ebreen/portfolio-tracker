// components/Dashboard.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../contexts/PortfolioContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { 
    getPortfolioSummary, 
    getUpcomingDividends, 
    dividends, 
    scenarios, 
    currentScenario, 
    setCurrentScenario,
    generateProjection
  } = useContext(PortfolioContext);
  
  const portfolioSummary = getPortfolioSummary();
  const upcomingDividends = getUpcomingDividends();
  
  // Calculate overall portfolio metrics
  const totalInitialInvestment = portfolioSummary.reduce((sum, holding) => sum + holding.initialInvestment, 0);
  const totalCurrentValue = portfolioSummary.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalShares = portfolioSummary.reduce((sum, holding) => sum + holding.shares, 0);
  const totalDividends = portfolioSummary.reduce((sum, holding) => sum + holding.totalDividends, 0);
  const overallGrowth = ((totalCurrentValue - totalInitialInvestment) / totalInitialInvestment) * 100;
  
  // Get dividend history data for charts
  const sortedDividends = [...dividends].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastSixDividends = sortedDividends.slice(-6);
  
  const dividendHistoryData = lastSixDividends.map(dividend => {
    const date = new Date(dividend.date);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      amount: dividend.amount
    };
  });
  
  // Generate projection data
  const projectionData = generateProjection(currentScenario, 10);
  
  // Format projection data for the chart
  const formattedProjectionData = [];
  const combinedProjection = {};
  
  // Combine all holdings by year
  projectionData.forEach(holding => {
    holding.projectionData.forEach(yearData => {
      if (!combinedProjection[yearData.year]) {
        combinedProjection[yearData.year] = {
          year: yearData.year,
          totalValue: 0,
          dividendIncome: 0,
          totalShares: 0
        };
      }
      
      combinedProjection[yearData.year].totalValue += yearData.totalValue;
      combinedProjection[yearData.year].dividendIncome += yearData.dividendIncome;
      combinedProjection[yearData.year].totalShares += yearData.shares;
    });
  });
  
  // Convert the combined projection to an array
  Object.values(combinedProjection).forEach(yearData => {
    formattedProjectionData.push(yearData);
  });
  
  // Function to determine which scenario we're currently tracking with
  const determineCurrentTrajectory = () => {
    // If we don't have enough data, default to neutral
    if (lastSixDividends.length < 3) return 'neutral';
    
    // Calculate average dividend yield from recent dividends
    const recentDividends = lastSixDividends.slice(-3);
    const avgDividend = recentDividends.reduce((sum, div) => sum + div.amount, 0) / recentDividends.length;
    
    const bullishThreshold = scenarios.neutral.monthlyDividend + 
                           (scenarios.bullish.monthlyDividend - scenarios.neutral.monthlyDividend) / 2;
    
    const bearishThreshold = scenarios.neutral.monthlyDividend - 
                           (scenarios.neutral.monthlyDividend - scenarios.bearish.monthlyDividend) / 2;
    
    if (avgDividend >= bullishThreshold) return 'bullish';
    if (avgDividend <= bearishThreshold) return 'bearish';
    return 'neutral';
  };
  
  const currentTrajectory = determineCurrentTrajectory();
  const trajectoryPercent = {
    'bearish': 25,
    'neutral': 50,
    'bullish': 75
  }[currentTrajectory];
  
  // Get month-over-month share growth
  const calculateShareGrowth = () => {
    if (lastSixDividends.length < 2) return 0;
    
    const previousMonth = lastSixDividends[lastSixDividends.length - 2];
    const currentMonth = lastSixDividends[lastSixDividends.length - 1];
    
    return currentMonth.newShares || 0;
  };
  
  const lastMonthShareGrowth = calculateShareGrowth();
  
  // Journal entries (using the most recent dividends)
  const recentJournalEntries = lastSixDividends.slice(-2).map(dividend => {
    const date = new Date(dividend.date);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      entry: `Received dividend payment of $${dividend.amount.toFixed(2)} per share. ${
        dividend.reinvested 
          ? `Reinvested to purchase ${dividend.newShares.toFixed(1)} additional shares at $${dividend.sharePrice.toFixed(2)}.`
          : 'Dividend was not reinvested.'
      }`
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ETF Dividend Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Portfolio Summary Box */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="font-semibold mb-4">Portfolio Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>Initial Investment:</div>
            <div className="font-medium">${totalInitialInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div>Current Shares:</div>
            <div className="font-medium">{totalShares.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div>Current Value:</div>
            <div className="font-medium">${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div>Total Dividends:</div>
            <div className="font-medium">${totalDividends.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
        
        {/* Performance Tracker */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="font-semibold mb-4">Performance Tracker</h3>
          <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500">Growth Since Start</div>
              <div className="text-3xl font-bold text-blue-600">{overallGrowth > 0 ? '+' : ''}{overallGrowth.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mt-2">Current Scenario: {currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Dividends */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
        <h3 className="font-semibold mb-4">Upcoming Dividends</h3>
        {upcomingDividends.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Ticker</th>
                  <th className="p-2 text-left">Ex-Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Est. Total</th>
                  <th className="p-2 text-left">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDividends.map((dividend, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-2">{dividend.ticker}</td>
                    <td className="p-2">{dividend.exDate}</td>
                    <td className="p-2">${parseFloat(dividend.amount).toFixed(2)}</td>
                    <td className="p-2">${parseFloat(dividend.estTotal).toFixed(2)}</td>
                    <td className="p-2">{dividend.payDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No upcoming dividends projected yet</div>
        )}
      </div>
      
      {/* Charts & Metrics Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Dividend History Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="text-sm font-semibold mb-2">Dividend History</h3>
          <div className="h-40">
            {dividendHistoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dividendHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No dividend history to display
              </div>
            )}
          </div>
        </div>
        
        {/* Scenario Tracking */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="text-sm font-semibold mb-2">Scenario Tracking</h3>
          <div className="h-40 bg-gradient-to-b from-purple-50 to-white rounded-md p-3">
            <div className="text-xs text-gray-500 mb-1">Current Trajectory</div>
            <div className="h-2 w-full bg-gray-200 rounded-full mb-3">
              <div 
                className="h-2 bg-purple-500 rounded-full" 
                style={{width: `${trajectoryPercent}%`}}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div>Bearish</div>
              <div>Neutral</div>
              <div>Bullish</div>
            </div>
            <div className="text-center mt-5">
              <div className="text-xs text-gray-500">Currently tracking with</div>
              <div className="text-sm font-bold text-purple-700">
                {currentTrajectory.charAt(0).toUpperCase() + currentTrajectory.slice(1)} Scenario
                ({scenarios[currentTrajectory].annualDividend}% yield)
              </div>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <button 
                onClick={() => setCurrentScenario('bearish')}
                className={`px-2 py-1 text-xs rounded ${
                  currentScenario === 'bearish' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
                Bearish
              </button>
              <button 
                onClick={() => setCurrentScenario('neutral')}
                className={`px-2 py-1 text-xs rounded ${
                  currentScenario === 'neutral' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
                Neutral
              </button>
              <button 
                onClick={() => setCurrentScenario('bullish')}
                className={`px-2 py-1 text-xs rounded ${
                  currentScenario === 'bullish' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
                Bullish
              </button>
            </div>
          </div>
        </div>
        
        {/* Share Accumulation */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="text-sm font-semibold mb-2">Share Accumulation</h3>
          <div className="h-40 bg-gradient-to-b from-green-50 to-white rounded-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.floor(totalShares).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">shares</div>
              {lastMonthShareGrowth > 0 && (
                <div className="text-sm font-medium text-green-600">
                  +{lastMonthShareGrowth.toFixed(0)} last month
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Growth Projection Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
        <h3 className="font-semibold mb-4">Dividend & Share Growth Projection</h3>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedProjectionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: 0 }} />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Dividend Income ($)', angle: 90, position: 'insideRight' }} 
              />
              <Tooltip 
                formatter={(value, name) => [
                  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
                  name === 'totalValue' ? 'Portfolio Value' : 'Annual Dividend Income'
                ]}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="totalValue" 
                name="Portfolio Value" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="dividendIncome" 
                name="Dividend Income" 
                stroke="#82ca9d" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <div>Current: ${totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>Year 5: ${formattedProjectionData[5]?.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>Year 10: ${formattedProjectionData[10]?.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
      
      {/* Journal and Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow col-span-2">
          <h3 className="font-semibold mb-4">Investment Journal</h3>
          {recentJournalEntries.length > 0 ? (
            <div className="space-y-3">
              {recentJournalEntries.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 text-sm">
                  <div className="font-medium">{entry.date} Update</div>
                  <div className="text-gray-600 mt-1">{entry.entry}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No journal entries yet</div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/add-dividend" className="block w-full py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium text-center">
              Record New Dividend
            </Link>
            <Link to="/add-holding" className="block w-full py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium text-center">
              Add New Holding
            </Link>
            <Link to="/settings" className="block w-full py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium text-center">
              Update Scenarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
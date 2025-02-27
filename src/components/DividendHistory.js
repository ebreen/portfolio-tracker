// components/DividendHistory.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../contexts/PortfolioContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DividendHistory = () => {
  const { dividends, holdings } = useContext(PortfolioContext);
  const [viewMode, setViewMode] = useState('table'); // table, chart, calendar
  
  // Sort dividends by date (most recent first)
  const sortedDividends = [...dividends].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Function to get holding ticker by ID
  const getHoldingTicker = (holdingId) => {
    const holding = holdings.find(h => h.id === holdingId);
    return holding ? holding.ticker : 'Unknown';
  };
  
  // Format dividend data for charts
  const formatDividendDataForChart = () => {
    // Group by month
    const dividendsByMonth = {};
    
    sortedDividends.forEach(dividend => {
      const date = new Date(dividend.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!dividendsByMonth[monthYear]) {
        dividendsByMonth[monthYear] = {
          month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          totalAmount: 0,
          dividends: []
        };
      }
      
      dividendsByMonth[monthYear].totalAmount += dividend.totalReceived;
      dividendsByMonth[monthYear].dividends.push(dividend);
    });
    
    // Convert to array and sort by date
    return Object.values(dividendsByMonth).sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      return yearA === yearB 
        ? new Date(`${monthA} 1, 20${yearA}`).getMonth() - new Date(`${monthB} 1, 20${yearB}`).getMonth()
        : yearA - yearB;
    });
  };
  
  const chartData = formatDividendDataForChart();
  
  // Calendar view data generation
  const generateCalendarData = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Generate last 12 months
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      months.push({
        month: monthDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
        date: monthDate
      });
    }
    
    // Add dividends to each month
    return months.map(month => {
      const monthDividends = sortedDividends.filter(dividend => {
        const dividendDate = new Date(dividend.date);
        return dividendDate.getMonth() === month.date.getMonth() &&
               dividendDate.getFullYear() === month.date.getFullYear();
      });
      
      const totalAmount = monthDividends.reduce((sum, div) => sum + div.totalReceived, 0);
      
      return {
        ...month,
        dividends: monthDividends,
        totalAmount
      };
    });
  };
  
  const calendarData = generateCalendarData();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dividend History</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Table
          </button>
          <button 
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'chart' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Chart
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'calendar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            {sortedDividends.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Ticker</th>
                    <th className="p-2 text-left">Ex-Dividend Date</th>
                    <th className="p-2 text-left">Cash Amount</th>
                    <th className="p-2 text-left">Declaration Date</th>
                    <th className="p-2 text-left">Record Date</th>
                    <th className="p-2 text-left">Pay Date</th>
                    <th className="p-2 text-left">Shares Owned</th>
                    <th className="p-2 text-left">Total Received</th>
                    <th className="p-2 text-left">Reinvested</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDividends.map(dividend => (
                    <tr key={dividend.id} className="border-t border-gray-100">
                      <td className="p-2">{getHoldingTicker(dividend.holdingId)}</td>
                      <td className="p-2">{dividend.exDate}</td>
                      <td className="p-2">${dividend.amount.toFixed(2)}</td>
                      <td className="p-2">{dividend.declarationDate}</td>
                      <td className="p-2">{dividend.recordDate}</td>
                      <td className="p-2">{dividend.date}</td>
                      <td className="p-2">{dividend.sharesOwned.toFixed(2)}</td>
                      <td className="p-2">${dividend.totalReceived.toFixed(2)}</td>
                      <td className="p-2">
                        {dividend.reinvested ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No dividend history available yet
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'chart' && (
          <div className="space-y-8">
            <div className="h-80">
              <h3 className="text-lg font-medium mb-4">Monthly Dividend Income</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Dividend Income ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total Amount']} />
                    <Legend />
                    <Bar dataKey="totalAmount" name="Dividend Income" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No dividend data to display
                </div>
              )}
            </div>
            
            <div className="h-80">
              <h3 className="text-lg font-medium mb-4">Dividend Growth Trend</h3>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Dividend Income ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total Amount']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalAmount" 
                      name="Dividend Income" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Not enough data for trend analysis
                </div>
              )}
            </div>
          </div>
        )}
        
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarData.map((month, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-3 border-b border-gray-200">
                  <div className="font-medium">{month.month}</div>
                  <div className="text-lg font-bold text-blue-700">
                    ${month.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 max-h-48 overflow-y-auto">
                  {month.dividends.length > 0 ? (
                    <ul className="space-y-2">
                      {month.dividends.map(dividend => (
                        <li key={dividend.id} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{getHoldingTicker(dividend.holdingId)}</span>
                            <span>${dividend.totalReceived.toFixed(2)}</span>
                          </div>
                          <div className="text-gray-500">Paid on {dividend.date}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-400">No dividends</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Link 
          to="/add-dividend" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Record New Dividend
        </Link>
      </div>
    </div>
  );
};

export default DividendHistory;
// components/ScenarioAnalysis.js
import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../contexts/PortfolioContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScenarioAnalysis = () => {
  const { scenarios, generateProjection, holdings } = useContext(PortfolioContext);
  const [selectedHolding, setSelectedHolding] = useState('all');
  const [projectionYears, setProjectionYears] = useState(10);
  const [chartType, setChartType] = useState('value'); // value, shares, income
  
  // Generate projections for all scenarios
  const bullishProjection = generateProjection('bullish', projectionYears);
  const neutralProjection = generateProjection('neutral', projectionYears);
  const bearishProjection = generateProjection('bearish', projectionYears);
  
  // Combine projections for chart data
  const formatChartData = () => {
    const chartData = [];
    
    for (let year = 0; year <= projectionYears; year++) {
      let bullishValue = 0;
      let neutralValue = 0;
      let bearishValue = 0;
      
      let bullishShares = 0;
      let neutralShares = 0;
      let bearishShares = 0;
      
      let bullishIncome = 0;
      let neutralIncome = 0;
      let bearishIncome = 0;
      
      // If all holdings selected, sum all holdings for each scenario
      if (selectedHolding === 'all') {
        // Sum all holdings for each scenario
        for (const holdingProj of bullishProjection) {
          const yearData = holdingProj.projectionData.find(d => d.year === year);
          if (yearData) {
            bullishValue += yearData.totalValue;
            bullishShares += yearData.shares;
            bullishIncome += yearData.dividendIncome;
          }
        }
        
        for (const holdingProj of neutralProjection) {
          const yearData = holdingProj.projectionData.find(d => d.year === year);
          if (yearData) {
            neutralValue += yearData.totalValue;
            neutralShares += yearData.shares;
            neutralIncome += yearData.dividendIncome;
          }
        }
        
        for (const holdingProj of bearishProjection) {
          const yearData = holdingProj.projectionData.find(d => d.year === year);
          if (yearData) {
            bearishValue += yearData.totalValue;
            bearishShares += yearData.shares;
            bearishIncome += yearData.dividendIncome;
          }
        }
      } else {
        // Get projection for specific holding
        const bullishHolding = bullishProjection.find(h => h.holdingId === parseInt(selectedHolding));
        const neutralHolding = neutralProjection.find(h => h.holdingId === parseInt(selectedHolding));
        const bearishHolding = bearishProjection.find(h => h.holdingId === parseInt(selectedHolding));
        
        if (bullishHolding) {
          const yearData = bullishHolding.projectionData.find(d => d.year === year);
          if (yearData) {
            bullishValue = yearData.totalValue;
            bullishShares = yearData.shares;
            bullishIncome = yearData.dividendIncome;
          }
        }
        
        if (neutralHolding) {
          const yearData = neutralHolding.projectionData.find(d => d.year === year);
          if (yearData) {
            neutralValue = yearData.totalValue;
            neutralShares = yearData.shares;
            neutralIncome = yearData.dividendIncome;
          }
        }
        
        if (bearishHolding) {
          const yearData = bearishHolding.projectionData.find(d => d.year === year);
          if (yearData) {
            bearishValue = yearData.totalValue;
            bearishShares = yearData.shares;
            bearishIncome = yearData.dividendIncome;
          }
        }
      }
      
      chartData.push({
        year,
        bullishValue,
        neutralValue,
        bearishValue,
        bullishShares,
        neutralShares,
        bearishShares,
        bullishIncome,
        neutralIncome,
        bearishIncome
      });
    }
    
    return chartData;
  };
  
  const chartData = formatChartData();
  
  // Table data for scenario comparisons
  const tableData = {
    bullish: {
      year5: chartData[5] || {},
      year10: chartData[10] || {},
      scenario: scenarios.bullish
    },
    neutral: {
      year5: chartData[5] || {},
      year10: chartData[10] || {},
      scenario: scenarios.neutral
    },
    bearish: {
      year5: chartData[5] || {},
      year10: chartData[10] || {},
      scenario: scenarios.bearish
    }
  };
  
  // Render chart based on selected type
  const renderChart = () => {
    const dataKeys = {
      value: ['bullishValue', 'neutralValue', 'bearishValue'],
      shares: ['bullishShares', 'neutralShares', 'bearishShares'],
      income: ['bullishIncome', 'neutralIncome', 'bearishIncome']
    };
    
    const labels = {
      value: 'Portfolio Value ($)',
      shares: 'Total Shares',
      income: 'Annual Dividend Income ($)'
    };
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];
    const names = ['Bullish', 'Neutral', 'Bearish'];
    
    const selectedKeys = dataKeys[chartType];
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            label={{ 
              value: labels[chartType], 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip 
            formatter={(value, name) => {
              if (chartType === 'value' || chartType === 'income') {
                return [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name];
              }
              return [value.toLocaleString(undefined, { maximumFractionDigits: 2 }), name];
            }}
            labelFormatter={(value) => `Year ${value}`}
          />
          <Legend />
          {selectedKeys.map((key, index) => (
            <Area 
              key={key}
              type="monotone"
              dataKey={key}
              name={names[index]}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scenario Analysis</h1>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Holding</label>
            <select
              value={selectedHolding}
              onChange={(e) => setSelectedHolding(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-48"
            >
              <option value="all">All Holdings</option>
              {holdings.map(holding => (
                <option key={holding.id} value={holding.id}>
                  {holding.ticker} - {holding.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Projection Years</label>
            <select
              value={projectionYears}
              onChange={(e) => setProjectionYears(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-md w-48"
            >
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
              <option value="15">15 Years</option>
              <option value="20">20 Years</option>
              <option value="25">25 Years</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartType('value')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  chartType === 'value' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Portfolio Value
              </button>
              <button 
                onClick={() => setChartType('shares')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  chartType === 'shares' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Share Growth
              </button>
              <button 
                onClick={() => setChartType('income')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  chartType === 'income' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Dividend Income
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-80 mb-6">
          {renderChart()}
        </div>
        
        <h3 className="text-lg font-semibold mt-8 mb-4">Scenario Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Scenario</th>
                <th className="p-2 text-left">Monthly Dividend</th>
                <th className="p-2 text-left">Annual Dividend</th>
                <th className="p-2 text-left">Yield</th>
                <th className="p-2 text-left">Share Growth</th>
                <th className="p-2 text-right">Year 5 Value</th>
                <th className="p-2 text-right">Year 10 Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 bg-purple-50">
                <td className="p-2 font-medium">Bullish</td>
                <td className="p-2">${scenarios.bullish.monthlyDividend.toFixed(2)}</td>
                <td className="p-2">${scenarios.bullish.annualDividend.toFixed(2)}</td>
                <td className="p-2">{scenarios.bullish.yield.toFixed(1)}%</td>
                <td className="p-2">{scenarios.bullish.shareGrowth.toFixed(1)}%</td>
                <td className="p-2 text-right">
                  ${tableData.bullish.year5.bullishValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
                <td className="p-2 text-right">
                  ${tableData.bullish.year10.bullishValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
              </tr>
              <tr className="border-t border-gray-100 bg-blue-50">
                <td className="p-2 font-medium">Neutral</td>
                <td className="p-2">${scenarios.neutral.monthlyDividend.toFixed(2)}</td>
                <td className="p-2">${scenarios.neutral.annualDividend.toFixed(2)}</td>
                <td className="p-2">{scenarios.neutral.yield.toFixed(1)}%</td>
                <td className="p-2">{scenarios.neutral.shareGrowth.toFixed(1)}%</td>
                <td className="p-2 text-right">
                  ${tableData.neutral.year5.neutralValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
                <td className="p-2 text-right">
                  ${tableData.neutral.year10.neutralValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
              </tr>
              <tr className="border-t border-gray-100 bg-yellow-50">
                <td className="p-2 font-medium">Bearish</td>
                <td className="p-2">${scenarios.bearish.monthlyDividend.toFixed(2)}</td>
                <td className="p-2">${scenarios.bearish.annualDividend.toFixed(2)}</td>
                <td className="p-2">{scenarios.bearish.yield.toFixed(1)}%</td>
                <td className="p-2">{scenarios.bearish.shareGrowth.toFixed(1)}%</td>
                <td className="p-2 text-right">
                  ${tableData.bearish.year5.bearishValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
                <td className="p-2 text-right">
                  ${tableData.bearish.year10.bearishValue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-lg font-semibold mt-8 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">Bullish Scenario</h4>
            <p className="text-sm text-gray-700">
              Assumes high dividend yields of {scenarios.bullish.yield.toFixed(1)}% with strong share price growth of {scenarios.bullish.shareGrowth.toFixed(1)}% annually.
              This results in significant compounding effects over time.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Neutral Scenario</h4>
            <p className="text-sm text-gray-700">
              Projects moderate dividend yields of {scenarios.neutral.yield.toFixed(1)}% with steady share price growth of {scenarios.neutral.shareGrowth.toFixed(1)}% annually.
              This represents the most likely outcome based on current trends.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Bearish Scenario</h4>
            <p className="text-sm text-gray-700">
              Considers lower dividend yields of {scenarios.bearish.yield.toFixed(1)}% with minimal share price growth of {scenarios.bearish.shareGrowth.toFixed(1)}% annually.
              Represents a conservative estimate for risk assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioAnalysis;